import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { AppShell, NavItem } from './AppShell';
import { InspectorLayout } from './InspectorLayout';

describe('Layout Components', () => {
  describe('AppShell', () => {
    it('renders brand title, subtitle and navigation items', () => {
      const navItems: NavItem[] = [
        { id: 'home', label: 'Trang chủ', active: true },
        { id: 'settings', label: 'Cài đặt', active: false },
      ];

      const html = renderToStaticMarkup(
        <AppShell brandTitle="IDEA CAD" brandSubtitle="v2.0" navItems={navItems}>
          <div>Workspace Content</div>
        </AppShell>
      );

      expect(html).toContain('IDEA CAD');
      expect(html).toContain('v2.0');
      expect(html).toContain('Trang chủ');
      expect(html).toContain('Cài đặt');
      expect(html).toContain('Workspace Content');
      expect(html).toContain('idea-shell--workbench');
    });
  });

  describe('InspectorLayout & Alt+I Keyboard Guard', () => {
    it('renders master and inspector panel content when open', () => {
      const html = renderToStaticMarkup(
        <InspectorLayout
          isOpen={true}
          onToggle={() => {}}
          title="Thuộc tính vai trò"
          inspectorContent={<div>Chi tiết inspector</div>}
        >
          <div>Nội dung bảng chính</div>
        </InspectorLayout>
      );

      expect(html).toContain('idea-inspector-container');
      expect(html).toContain('Nội dung bảng chính');
      expect(html).toContain('Thuộc tính vai trò');
      expect(html).toContain('Chi tiết inspector');
      expect(html).toContain('Alt+I');
    });

    it('renders closed inspector panel when isOpen is false', () => {
      const html = renderToStaticMarkup(
        <InspectorLayout
          isOpen={false}
          onToggle={() => {}}
          title="Thuộc tính vai trò"
          inspectorContent={<div>Chi tiết inspector</div>}
        >
          <div>Nội dung bảng chính</div>
        </InspectorLayout>
      );

      expect(html).toContain('idea-inspector-panel--closed');
      expect(html).not.toContain('Chi tiết inspector');
    });
  });
});
