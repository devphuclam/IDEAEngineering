import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { DataTable, Column } from './DataTable';

interface TestItem {
  id: string;
  name: string;
  count: number;
}

const TEST_DATA: TestItem[] = [
  { id: '1', name: 'Alpha', count: 10 },
  { id: '2', name: 'Beta', count: 5 },
  { id: '3', name: 'Gamma', count: 20 },
];

const COLUMNS: Column<TestItem>[] = [
  { key: 'id', header: 'ID', sortable: true, width: '60px' },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'count', header: 'Count', sortable: false },
];

describe('Semantic DataTable', () => {
  it('renders semantic table structure with headers and rows', () => {
    const html = renderToStaticMarkup(
      <DataTable
        data={TEST_DATA}
        columns={COLUMNS}
        getRowId={(item) => item.id}
        ariaLabel="Bảng thử nghiệm"
      />
    );

    expect(html).toContain('<table');
    expect(html).toContain('aria-label="Bảng thử nghiệm"');
    expect(html).toContain('<thead');
    expect(html).toContain('<tbody');
    expect(html).toContain('Alpha');
    expect(html).toContain('Beta');
    expect(html).toContain('Gamma');
    expect(html).toContain('Hiển thị <strong>3</strong> / 3 bản ghi');
  });

  it('strictly places aria-sort on th elements only for sortable columns', () => {
    const html = renderToStaticMarkup(
      <DataTable
        data={TEST_DATA}
        columns={COLUMNS}
        getRowId={(item) => item.id}
      />
    );

    // Sortable columns should have aria-sort="none" initially
    expect(html).toContain('<th style="width:60px" aria-sort="none">');
    // Non-sortable column should not have aria-sort attribute
    expect(html).toMatch(/<th><span>Count<\/span><\/th>/);
  });

  it('renders empty message when data is empty', () => {
    const html = renderToStaticMarkup(
      <DataTable
        data={[]}
        columns={COLUMNS}
        getRowId={(item) => item.id}
        emptyMessage="Không có dữ liệu nào ở đây"
      />
    );

    expect(html).toContain('Không có dữ liệu nào ở đây');
  });

  it('highlights selected row and displays selected id in footer', () => {
    const html = renderToStaticMarkup(
      <DataTable
        data={TEST_DATA}
        columns={COLUMNS}
        getRowId={(item) => item.id}
        selectedId="2"
      />
    );

    expect(html).toContain('idea-table-row--selected');
    expect(html).toContain('Đang chọn ID: 2');
  });
});
