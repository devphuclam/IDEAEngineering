import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { RbacPilotPage, isValidKebabCase } from './RbacPilotPage';

describe('RBAC Pilot Page Integration', () => {
  it('renders initial page with role catalogue table and inspector', () => {
    const html = renderToStaticMarkup(<RbacPilotPage />);

    expect(html).toContain('Quản lý vai trò (RBAC Pilot)');
    expect(html).toContain('AUTHORITATIVE SERVER SCOPE');
    expect(html).toContain('+ Tạo Custom Role mới');
    expect(html).toContain('org-admin');
    expect(html).toContain('project-viewer');
    expect(html).toContain('compliance-auditor');
    expect(html).toContain('Chi tiết vai trò');
    expect(html).toContain('Mã định danh Version');
  });

  describe('ASCII kebab-case role code validation constraint', () => {
    it('accepts valid ASCII kebab-case codes', () => {
      expect(isValidKebabCase('cad-model-reviewer')).toBe(true);
      expect(isValidKebabCase('org-admin')).toBe(true);
      expect(isValidKebabCase('vault-auditor-1')).toBe(true);
      expect(isValidKebabCase('viewer')).toBe(true);
      expect(isValidKebabCase('sec-ops-lead')).toBe(true);
    });

    it('rejects Vietnamese accented characters', () => {
      expect(isValidKebabCase('quản-trị')).toBe(false);
      expect(isValidKebabCase('người-xem')).toBe(false);
      expect(isValidKebabCase('kiểm-toán')).toBe(false);
      expect(isValidKebabCase('kế-toán-viên')).toBe(false);
    });

    it('rejects uppercase letters, spaces, underscores, and invalid punctuation', () => {
      expect(isValidKebabCase('CAD-Admin')).toBe(false);
      expect(isValidKebabCase('cad admin')).toBe(false);
      expect(isValidKebabCase('cad_admin')).toBe(false);
      expect(isValidKebabCase('cad.admin')).toBe(false);
      expect(isValidKebabCase('cad@admin')).toBe(false);
    });

    it('rejects leading, trailing, or consecutive hyphens', () => {
      expect(isValidKebabCase('-cad-admin')).toBe(false);
      expect(isValidKebabCase('cad-admin-')).toBe(false);
      expect(isValidKebabCase('cad--admin')).toBe(false);
      expect(isValidKebabCase('')).toBe(false);
    });
  });

  it('renders custom organization context when provided', () => {
    const customContext = {
      actorId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      accountId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      organizationId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
      displayName: 'Trần Văn Kỹ Sư',
      organizationName: 'IDEA Heavy Mechanical Plant',
      actions: ['role.catalogue.read', 'role.definition.prepare'],
    };

    const html = renderToStaticMarkup(<RbacPilotPage context={customContext} />);
    expect(html).toContain('Quản lý vai trò (RBAC Pilot)');
    expect(html).toContain('+ Tạo Custom Role mới');
  });
});
