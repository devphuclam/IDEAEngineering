/**
 * IDEA Engineering — Overlay Stack Manager
 * Handles nested modal/drawer stacking, background inert isolation,
 * and focus restoration between stacked layers.
 */

interface StackItem {
  id: string;
  element: HTMLElement;
  triggerElement: HTMLElement | null;
  prevOverlayInert: boolean;
  prevOverlayAriaHidden: string | null;
}

interface SavedElementState {
  prevInert: boolean;
  prevAriaHidden: string | null;
}

const stack: StackItem[] = [];
const backgroundStatesMap = new Map<HTMLElement, SavedElementState>();

/**
 * Ensures a dedicated overlay portal container exists outside #appRoot
 */
export function getOverlayRoot(): HTMLElement {
  if (typeof document === 'undefined') {
    return null as unknown as HTMLElement;
  }

  let root = document.getElementById('idea-overlay-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'idea-overlay-root';
    document.body.appendChild(root);
  }
  return root;
}

/**
 * Checks whether any modal dialog or drawer is currently active in the stack
 */
export function isAnyOverlayActive(): boolean {
  if (typeof document === 'undefined') return false;
  if (stack.length > 0) return true;
  return Boolean(document.querySelector('.idea-modal-backdrop, .idea-drawer-backdrop'));
}

/**
 * Returns current depth of the overlay stack (useful for diagnostics and assertions)
 */
export function getStackDepth(): number {
  return stack.length;
}

/**
 * Checks if an element is a valid, currently interactive focus target
 */
export function isInteractiveFocusTarget(el: HTMLElement | null): boolean {
  if (!el || typeof document === 'undefined') return false;
  if (!document.contains(el)) return false;
  if (el.hasAttribute('disabled') || (el as HTMLButtonElement).disabled) return false;
  if (el.inert || (typeof el.closest === 'function' && el.closest('[inert]'))) return false;
  if (el.getAttribute('aria-hidden') === 'true' || (typeof el.closest === 'function' && el.closest('[aria-hidden="true"]'))) return false;
  return true;
}

/**
 * Registers an active overlay and safely applies inert to underlying layers
 */
export function pushOverlay(
  id: string,
  overlayElement: HTMLElement,
  backgroundSelector = '#appRoot'
): () => void {
  if (typeof document === 'undefined') return () => {};

  // Check if this overlay is already the top of stack to prevent duplicate registration
  const existingIdx = stack.findIndex((item) => item.id === id);
  if (existingIdx !== -1) {
    return () => {
      popOverlay(id);
    };
  }

  const triggerElement = document.activeElement as HTMLElement | null;

  if (stack.length === 0) {
    // Top-level overlay: safely capture pre-existing inert/aria-hidden states of background elements
    if (backgroundSelector) {
      document.querySelectorAll<HTMLElement>(backgroundSelector).forEach((el) => {
        if (!backgroundStatesMap.has(el)) {
          backgroundStatesMap.set(el, {
            prevInert: Boolean(el.inert),
            prevAriaHidden: el.getAttribute('aria-hidden'),
          });
        }
        el.inert = true;
        el.setAttribute('aria-hidden', 'true');
      });
    }
  } else {
    // Nested overlay (e.g. Dialog on top of Drawer): inert the preceding lower overlay layer
    const lowerOverlay = stack[stack.length - 1];
    if (lowerOverlay.element) {
      lowerOverlay.element.inert = true;
      lowerOverlay.element.setAttribute('aria-hidden', 'true');
    }
  }

  stack.push({
    id,
    element: overlayElement,
    triggerElement,
    prevOverlayInert: false,
    prevOverlayAriaHidden: null,
  });

  return () => {
    popOverlay(id);
  };
}

/**
 * Removes an overlay from the stack and restores interactivity to the underlying layer
 */
export function popOverlay(id: string): void {
  const index = stack.findIndex((item) => item.id === id);
  if (index === -1) return;

  const [removed] = stack.splice(index, 1);

  if (stack.length === 0) {
    // Restoring main application root and all preserved background elements
    backgroundStatesMap.forEach((orig, el) => {
      el.inert = orig.prevInert;
      if (orig.prevAriaHidden !== null && orig.prevAriaHidden !== undefined) {
        el.setAttribute('aria-hidden', orig.prevAriaHidden);
      } else {
        el.removeAttribute('aria-hidden');
      }
    });
    backgroundStatesMap.clear();
  } else {
    // Restoring the topmost remaining overlay layer in the stack
    const top = stack[stack.length - 1];
    if (top && top.element) {
      top.element.inert = top.prevOverlayInert;
      if (top.prevOverlayAriaHidden !== null && top.prevOverlayAriaHidden !== undefined) {
        top.element.setAttribute('aria-hidden', top.prevOverlayAriaHidden);
      } else {
        top.element.removeAttribute('aria-hidden');
      }
    }
  }

  // Restore focus only to a valid, currently interactive target
  const schedule =
    typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (cb: () => void) => setTimeout(cb, 0);

  schedule(() => {
    if (typeof document === 'undefined') return;

    if (isInteractiveFocusTarget(removed.triggerElement)) {
      removed.triggerElement?.focus();
      return;
    }

    // Fallback: if trigger is unmounted/inert/disabled, focus the current topmost active overlay
    if (stack.length > 0) {
      const currentTop = stack[stack.length - 1];
      if (currentTop && currentTop.element) {
        const focusable = currentTop.element.querySelector<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
        );
        if (focusable && isInteractiveFocusTarget(focusable)) {
          focusable.focus();
          return;
        }
        if (isInteractiveFocusTarget(currentTop.element)) {
          currentTop.element.focus();
          return;
        }
      }
    }

    // Fallback for empty stack: ensure document body or appRoot has focus without remaining lost
    const appRoot = document.getElementById('appRoot');
    if (appRoot && isInteractiveFocusTarget(appRoot)) {
      appRoot.focus();
    } else if (document.body) {
      document.body.focus();
    }
  });
}

/**
 * Resets overlay stack and background state map (used exclusively for test isolation)
 */
export function resetOverlayStackForTesting(): void {
  stack.length = 0;
  backgroundStatesMap.clear();
}
