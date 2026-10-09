import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getOverlayRoot,
  isAnyOverlayActive,
  pushOverlay,
  popOverlay,
  getStackDepth,
  isTopOverlay,
  isInteractiveFocusTarget,
  resetOverlayStackForTesting,
} from './overlayStack';

describe('overlayStack manager', () => {
  let appRootMock: HTMLElement;
  let bodyMock: HTMLElement;
  let overlayRootMock: HTMLElement | null = null;
  let activeElementMock: HTMLElement | null = null;

  beforeEach(() => {
    resetOverlayStackForTesting();
    overlayRootMock = null;
    const elementsById = new Map<string, HTMLElement>();

    appRootMock = {
      id: 'appRoot',
      inert: false,
      getAttribute: vi.fn((attr: string) =>
        attr === 'aria-hidden' ? (appRootMock as unknown as Record<string, string>)['aria-hidden'] : null
      ),
      setAttribute: vi.fn((attr: string, val: string) => {
        (appRootMock as unknown as Record<string, string>)[attr] = val;
      }),
      removeAttribute: vi.fn((attr: string) => {
        delete (appRootMock as unknown as Record<string, string>)[attr];
      }),
      hasAttribute: vi.fn((attr: string) =>
        Boolean((appRootMock as unknown as Record<string, string>)[attr])
      ),
      focus: vi.fn(),
    } as unknown as HTMLElement;
    elementsById.set('appRoot', appRootMock);

    bodyMock = {
      appendChild: vi.fn((child: HTMLElement) => {
        if (child.id) elementsById.set(child.id, child);
        return child;
      }),
      focus: vi.fn(),
    } as unknown as HTMLElement;

    // Install global document mock
    (globalThis as unknown as { document: unknown }).document = {
      body: bodyMock,
      getElementById: (id: string) => elementsById.get(id) || null,
      createElement: (tag: string) => {
        const el = {
          tagName: tag.toUpperCase(),
          id: '',
          inert: false,
          getAttribute: vi.fn((attr: string) => (el as unknown as Record<string, string>)[attr] || null),
          setAttribute: vi.fn((attr: string, val: string) => {
            (el as unknown as Record<string, string>)[attr] = val;
          }),
          removeAttribute: vi.fn((attr: string) => {
            delete (el as unknown as Record<string, string>)[attr];
          }),
          hasAttribute: vi.fn((attr: string) => Boolean((el as unknown as Record<string, string>)[attr])),
          focus: vi.fn(),
        } as unknown as HTMLElement;
        return el;
      },
      querySelectorAll: (sel: string) => {
        if (sel === '#appRoot') return [appRootMock];
        return [];
      },
      querySelector: (sel: string) => {
        if (sel.includes('.idea-modal-backdrop') || sel.includes('.idea-drawer-backdrop')) {
          return null;
        }
        return null;
      },
      contains: vi.fn(() => true),
      get activeElement() {
        return activeElementMock;
      },
    };
  });

  afterEach(() => {
    resetOverlayStackForTesting();
    delete (globalThis as unknown as { document?: unknown }).document;
  });

  it('getOverlayRoot creates #idea-overlay-root in document.body outside #appRoot', () => {
    const root = getOverlayRoot();
    expect(root).toBeDefined();
    expect(root.id).toBe('idea-overlay-root');
    expect(bodyMock.appendChild).toHaveBeenCalledWith(root);

    // Subsequent calls return existing root
    const root2 = getOverlayRoot();
    expect(root2).toBe(root);
  });

  it('pushOverlay sets background #appRoot inert and restores on popOverlay', () => {
    const trigger = {
      focus: vi.fn(),
      hasAttribute: vi.fn(() => false),
      inert: false,
      getAttribute: vi.fn(() => null),
    } as unknown as HTMLElement;
    activeElementMock = trigger;

    const drawerEl = {
      id: 'drawer-overlay',
      inert: false,
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      hasAttribute: vi.fn(() => false),
      getAttribute: vi.fn(() => null),
    } as unknown as HTMLElement;

    expect(isAnyOverlayActive()).toBe(false);

    // Push first overlay (e.g. Drawer)
    const cleanup = pushOverlay('drawer-1', drawerEl, '#appRoot');
    expect(isAnyOverlayActive()).toBe(true);
    expect(getStackDepth()).toBe(1);
    expect(appRootMock.inert).toBe(true);
    expect(appRootMock.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');

    // Pop the overlay
    cleanup();
    expect(isAnyOverlayActive()).toBe(false);
    expect(getStackDepth()).toBe(0);
    expect(appRootMock.inert).toBe(false);
    expect(appRootMock.removeAttribute).toHaveBeenCalledWith('aria-hidden');
  });

  it('preserves pre-existing inert and aria-hidden attributes when restoring background', () => {
    // Set pre-existing attributes on appRoot
    (appRootMock as unknown as Record<string, string>)['aria-hidden'] = 'false';
    appRootMock.inert = false;

    const drawerEl = {
      id: 'drawer-overlay',
      inert: false,
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      hasAttribute: vi.fn(() => false),
      getAttribute: vi.fn(() => null),
    } as unknown as HTMLElement;

    const cleanup = pushOverlay('drawer-1', drawerEl, '#appRoot');
    expect(appRootMock.inert).toBe(true);
    expect(appRootMock.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');

    cleanup();
    expect(appRootMock.inert).toBe(false);
    expect(appRootMock.setAttribute).toHaveBeenCalledWith('aria-hidden', 'false');
  });

  it('handles nested overlay stacking (Dialog over Drawer) with proper inert isolation', () => {
    const drawerEl = {
      id: 'drawer-overlay',
      inert: false,
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      hasAttribute: vi.fn(() => false),
      getAttribute: vi.fn(() => null),
    } as unknown as HTMLElement;

    const dialogEl = {
      id: 'dialog-overlay',
      inert: false,
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      hasAttribute: vi.fn(() => false),
      getAttribute: vi.fn(() => null),
    } as unknown as HTMLElement;

    // 1. Open Drawer
    const popDrawer = pushOverlay('drawer-1', drawerEl, '#appRoot');
    expect(appRootMock.inert).toBe(true);
    expect(drawerEl.inert).toBe(false); // Drawer is active and interactive

    // 2. Open Dialog on top of Drawer (e.g. Discard confirmation dialog)
    const popDialog = pushOverlay('dialog-1', dialogEl, '#appRoot');
    expect(getStackDepth()).toBe(2);
    expect(dialogEl.inert).toBe(false); // Dialog is active and interactive
    expect(drawerEl.inert).toBe(true); // Drawer is marked inert
    expect(drawerEl.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');

    // 3. Close Dialog -> Drawer becomes interactive again
    popDialog();
    expect(getStackDepth()).toBe(1);
    expect(drawerEl.inert).toBe(false);
    expect(drawerEl.removeAttribute).toHaveBeenCalledWith('aria-hidden');
    expect(appRootMock.inert).toBe(true); // appRoot remains inert

    // 4. Close Drawer -> appRoot is restored
    popDrawer();
    expect(getStackDepth()).toBe(0);
    expect(appRootMock.inert).toBe(false);
    expect(appRootMock.removeAttribute).toHaveBeenCalledWith('aria-hidden');
  });

  it('supports out-of-order cleanup without leaving the application inert', () => {
    const drawerEl = {
      id: 'drawer-overlay',
      inert: false,
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      hasAttribute: vi.fn(() => false),
      getAttribute: vi.fn(() => null),
    } as unknown as HTMLElement;

    const dialogEl = {
      id: 'dialog-overlay',
      inert: false,
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      hasAttribute: vi.fn(() => false),
      getAttribute: vi.fn(() => null),
    } as unknown as HTMLElement;

    pushOverlay('drawer-1', drawerEl, '#appRoot');
    pushOverlay('dialog-1', dialogEl, '#appRoot');
    expect(getStackDepth()).toBe(2);

    // Pop the LOWER overlay first (out-of-order unmount)
    popOverlay('drawer-1');
    expect(getStackDepth()).toBe(1);
    expect(appRootMock.inert).toBe(true); // Background is STILL protected by dialog-1

    // Pop the remaining overlay
    popOverlay('dialog-1');
    expect(getStackDepth()).toBe(0);
    expect(appRootMock.inert).toBe(false); // Background is now safely restored!
  });

  it('guarantees focus restoration only to a valid, currently interactive target', () => {
    const validTarget = {
      focus: vi.fn(),
      hasAttribute: vi.fn(() => false),
      inert: false,
      getAttribute: vi.fn(() => null),
    } as unknown as HTMLElement;
    expect(isInteractiveFocusTarget(validTarget)).toBe(true);

    const disabledTarget = {
      focus: vi.fn(),
      hasAttribute: vi.fn((attr: string) => attr === 'disabled'),
      inert: false,
      getAttribute: vi.fn(() => null),
    } as unknown as HTMLElement;
    expect(isInteractiveFocusTarget(disabledTarget)).toBe(false);

    const inertTarget = {
      focus: vi.fn(),
      hasAttribute: vi.fn(() => false),
      inert: true,
      getAttribute: vi.fn(() => null),
    } as unknown as HTMLElement;
    expect(isInteractiveFocusTarget(inertTarget)).toBe(false);

    const ariaHiddenTarget = {
      focus: vi.fn(),
      hasAttribute: vi.fn(() => false),
      inert: false,
      getAttribute: vi.fn((attr: string) => (attr === 'aria-hidden' ? 'true' : null)),
    } as unknown as HTMLElement;
    expect(isInteractiveFocusTarget(ariaHiddenTarget)).toBe(false);
  });

  it('correctly tracks isTopOverlay for topmost overlay during nesting and unmounting', () => {
    const drawerEl = {
      id: 'drawer-overlay',
      inert: false,
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      hasAttribute: vi.fn(() => false),
      getAttribute: vi.fn(() => null),
    } as unknown as HTMLElement;

    const dialogEl = {
      id: 'dialog-overlay',
      inert: false,
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      hasAttribute: vi.fn(() => false),
      getAttribute: vi.fn(() => null),
    } as unknown as HTMLElement;

    // Initially empty
    expect(isTopOverlay('drawer-1')).toBe(false);
    expect(isTopOverlay('dialog-1')).toBe(false);

    // Push drawer
    pushOverlay('drawer-1', drawerEl, '#appRoot');
    expect(isTopOverlay('drawer-1')).toBe(true);
    expect(isTopOverlay('dialog-1')).toBe(false);

    // Push dialog on top of drawer
    pushOverlay('dialog-1', dialogEl, '#appRoot');
    expect(isTopOverlay('drawer-1')).toBe(false); // Drawer is no longer top!
    expect(isTopOverlay('dialog-1')).toBe(true);  // Dialog is top!

    // Pop dialog -> Drawer becomes top again
    popOverlay('dialog-1');
    expect(isTopOverlay('drawer-1')).toBe(true);
    expect(isTopOverlay('dialog-1')).toBe(false);

    // Pop drawer -> Neither is top
    popOverlay('drawer-1');
    expect(isTopOverlay('drawer-1')).toBe(false);
    expect(isTopOverlay('dialog-1')).toBe(false);
  });
});
