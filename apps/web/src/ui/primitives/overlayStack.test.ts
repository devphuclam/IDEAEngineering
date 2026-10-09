import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getOverlayRoot, isAnyOverlayActive, pushOverlay, popOverlay } from './overlayStack';

describe('overlayStack manager', () => {
  let appRootMock: HTMLElement;
  let bodyMock: HTMLElement;
  let overlayRootMock: HTMLElement | null = null;
  let activeElementMock: HTMLElement | null = null;

  beforeEach(() => {
    // Setup simulated DOM environment
    overlayRootMock = null;
    const elementsById = new Map<string, HTMLElement>();

    appRootMock = {
      id: 'appRoot',
      inert: false,
      getAttribute: vi.fn((attr: string) => (attr === 'aria-hidden' ? (appRootMock as unknown as Record<string, string>)['aria-hidden'] : null)),
      setAttribute: vi.fn((attr: string, val: string) => {
        (appRootMock as unknown as Record<string, string>)[attr] = val;
      }),
      removeAttribute: vi.fn((attr: string) => {
        delete (appRootMock as unknown as Record<string, string>)[attr];
      }),
    } as unknown as HTMLElement;
    elementsById.set('appRoot', appRootMock);

    bodyMock = {
      appendChild: vi.fn((child: HTMLElement) => {
        if (child.id) elementsById.set(child.id, child);
        return child;
      }),
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
    } as unknown as HTMLElement;
    activeElementMock = trigger;

    const drawerEl = {
      id: 'drawer-overlay',
      inert: false,
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
    } as unknown as HTMLElement;

    expect(isAnyOverlayActive()).toBe(false);

    // Push first overlay (e.g. Drawer)
    const cleanup = pushOverlay('drawer-1', drawerEl, '#appRoot');
    expect(isAnyOverlayActive()).toBe(true);
    expect(appRootMock.inert).toBe(true);
    expect(appRootMock.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');

    // Pop the overlay
    cleanup();
    expect(isAnyOverlayActive()).toBe(false);
    expect(appRootMock.inert).toBe(false);
    expect(appRootMock.removeAttribute).toHaveBeenCalledWith('aria-hidden');
  });

  it('handles nested overlay stacking (Dialog over Drawer) with proper inert isolation', () => {
    const drawerEl = {
      id: 'drawer-overlay',
      inert: false,
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
    } as unknown as HTMLElement;

    const dialogEl = {
      id: 'dialog-overlay',
      inert: false,
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
    } as unknown as HTMLElement;

    // 1. Open Drawer
    const popDrawer = pushOverlay('drawer-1', drawerEl, '#appRoot');
    expect(appRootMock.inert).toBe(true);
    expect(drawerEl.inert).toBe(false); // Drawer is active and interactive

    // 2. Open Dialog on top of Drawer (e.g. Discard confirmation dialog)
    const popDialog = pushOverlay('dialog-1', dialogEl, '#appRoot');
    expect(dialogEl.inert).toBe(false); // Dialog is active and interactive
    expect(drawerEl.inert).toBe(true); // Drawer is marked inert
    expect(drawerEl.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');

    // 3. Close Dialog -> Drawer becomes interactive again
    popDialog();
    expect(drawerEl.inert).toBe(false);
    expect(drawerEl.removeAttribute).toHaveBeenCalledWith('aria-hidden');
    expect(appRootMock.inert).toBe(true); // appRoot remains inert

    // 4. Close Drawer -> appRoot is restored
    popDrawer();
    expect(appRootMock.inert).toBe(false);
    expect(appRootMock.removeAttribute).toHaveBeenCalledWith('aria-hidden');
  });
});
