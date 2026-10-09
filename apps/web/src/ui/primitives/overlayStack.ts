/**
 * IDEA Engineering — Overlay Stack Manager
 * Handles nested modal/drawer stacking, background inert isolation,
 * and focus restoration between stacked layers.
 */

interface StackItem {
  id: string;
  element: HTMLElement;
  triggerElement: HTMLElement | null;
  backgroundElements: HTMLElement[];
}

const stack: StackItem[] = [];

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
 * Registers an active overlay and safely applies inert to underlying layers
 */
export function pushOverlay(
  id: string,
  overlayElement: HTMLElement,
  backgroundSelector = '#appRoot'
): () => void {
  if (typeof document === 'undefined') return () => {};

  const triggerElement = document.activeElement as HTMLElement | null;
  const backgroundElements: HTMLElement[] = [];

  if (stack.length === 0) {
    // Top-level overlay: inert the main application root
    if (backgroundSelector) {
      document.querySelectorAll<HTMLElement>(backgroundSelector).forEach((el) => {
        el.inert = true;
        el.setAttribute('aria-hidden', 'true');
        backgroundElements.push(el);
      });
    }
  } else {
    // Nested overlay (e.g. Dialog on top of Drawer): inert the preceding overlay layer
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
    backgroundElements,
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
    // Restoring main application root
    removed.backgroundElements.forEach((el) => {
      el.inert = false;
      el.removeAttribute('aria-hidden');
    });
  } else {
    // Restoring the previous overlay layer
    const top = stack[stack.length - 1];
    if (top.element) {
      top.element.inert = false;
      top.element.removeAttribute('aria-hidden');
    }
  }

  // Restore focus to trigger element if available
  if (removed.triggerElement && typeof removed.triggerElement.focus === 'function') {
    const schedule = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (cb: () => void) => setTimeout(cb, 0);
    schedule(() => {
      if (typeof document !== 'undefined' && document.contains(removed.triggerElement)) {
        removed.triggerElement?.focus();
      }
    });
  }
}
