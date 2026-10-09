import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { applyThemeConfig } from './tokens';

describe('Design Tokens & Theme Configuration', () => {
  let originalDocument: unknown;
  const mockDocumentElement = {
    attributes: {} as Record<string, string>,
    setAttribute(name: string, value: string) {
      this.attributes[name] = value;
    },
    removeAttribute(name: string) {
      delete this.attributes[name];
    },
    getAttribute(name: string) {
      return this.attributes[name] || null;
    },
  };

  beforeEach(() => {
    originalDocument = (globalThis as Record<string, unknown>).document;
    mockDocumentElement.attributes = {};
    (globalThis as Record<string, unknown>).document = {
      documentElement: mockDocumentElement,
    };
  });

  afterEach(() => {
    (globalThis as Record<string, unknown>).document = originalDocument;
  });

  it('applies light theme and comfortable density by default', () => {
    applyThemeConfig({ theme: 'light', density: 'comfortable' });
    expect(mockDocumentElement.getAttribute('data-theme')).toBe('light');
    expect(mockDocumentElement.getAttribute('data-density')).toBe('comfortable');
  });

  it('applies dark theme and compact density', () => {
    applyThemeConfig({ theme: 'dark', density: 'compact' });
    expect(mockDocumentElement.getAttribute('data-theme')).toBe('dark');
    expect(mockDocumentElement.getAttribute('data-density')).toBe('compact');
  });

  it('updates only theme when density is omitted', () => {
    applyThemeConfig({ density: 'compact' });
    applyThemeConfig({ theme: 'dark' });
    expect(mockDocumentElement.getAttribute('data-theme')).toBe('dark');
    expect(mockDocumentElement.getAttribute('data-density')).toBe('compact');
  });
});
