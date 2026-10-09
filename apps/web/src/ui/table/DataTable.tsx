import React, { useState, useMemo, useRef } from 'react';
import './table.css';

export type SortDirection = 'ascending' | 'descending' | 'none';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string | number;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (item: T) => string;
  selectedId?: string;
  onSelectRow?: (item: T) => void;
  filterPlaceholder?: string;
  initialSearchQuery?: string;
  filterFn?: (item: T, query: string) => boolean;
  emptyMessage?: string;
  toolbarActions?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}

export function handleRowKeyDown<T>(
  e: React.KeyboardEvent<HTMLTableRowElement> | { key: string; preventDefault: () => void },
  item: T,
  index: number,
  onSelectRow?: (item: T) => void,
  tableRef?: React.RefObject<HTMLTableElement | null>
): void {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onSelectRow?.(item);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    const rows = tableRef?.current?.querySelectorAll('tbody tr');
    if (rows && index < rows.length - 1) {
      (rows[index + 1] as HTMLElement).focus();
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    const rows = tableRef?.current?.querySelectorAll('tbody tr');
    if (rows && index > 0) {
      (rows[index - 1] as HTMLElement).focus();
    }
  }
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  selectedId,
  onSelectRow,
  filterPlaceholder = 'Tìm kiếm trong bảng...',
  initialSearchQuery = '',
  filterFn,
  emptyMessage = 'Không tìm thấy bản ghi nào',
  toolbarActions,
  ariaLabel = 'Bảng dữ liệu',
  className = '',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const tableRef = useRef<HTMLTableElement>(null);

  const handleSort = (columnKey: string) => {
    if (sortKey !== columnKey) {
      setSortKey(columnKey);
      setSortDirection('ascending');
    } else {
      if (sortDirection === 'none') {
        setSortDirection('ascending');
      } else if (sortDirection === 'ascending') {
        setSortDirection('descending');
      } else {
        setSortDirection('none');
        setSortKey(null);
      }
    }
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.trim().toLowerCase();

    if (filterFn) {
      return data.filter((item) => filterFn(item, query));
    }

    return data.filter((item) => {
      return Object.values(item as Record<string, unknown>).some((val) => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, filterFn]);

  const sortedData = useMemo(() => {
    if (!sortKey || sortDirection === 'none') return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const compare = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
      return sortDirection === 'ascending' ? compare : -compare;
    });
  }, [filteredData, sortKey, sortDirection]);

  return (
    <div className={`idea-table-container ${className}`}>
      <div className="idea-table-toolbar">
        <div style={{ flex: 1, maxWidth: '320px' }}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={filterPlaceholder}
            className="idea-input"
            aria-label={filterPlaceholder}
            style={{ height: '28px', fontSize: '12px' }}
          />
        </div>
        {toolbarActions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {toolbarActions}
          </div>
        )}
      </div>

      <div className="idea-table-scroll-wrapper">
        <table ref={tableRef} className="idea-table" aria-label={ariaLabel}>
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const ariaSortValue: SortDirection = col.sortable
                  ? isSorted
                    ? sortDirection
                    : 'none'
                  : undefined as unknown as SortDirection;

                return (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    aria-sort={col.sortable ? ariaSortValue : undefined}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        className="idea-table-sort-btn"
                        onClick={() => handleSort(col.key)}
                        aria-label={`Sắp xếp theo ${col.header}`}
                      >
                        <span>{col.header}</span>
                        <span aria-hidden="true" style={{ fontSize: '10px', opacity: isSorted ? 1 : 0.4 }}>
                          {isSorted
                            ? sortDirection === 'ascending'
                              ? '▲'
                              : sortDirection === 'descending'
                              ? '▼'
                              : '⇅'
                            : '⇅'}
                        </span>
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '24px', color: 'var(--idea-color-text-muted)' }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => {
                const id = getRowId(item);
                const isSelected = selectedId === id;

                return (
                  <tr
                    key={id}
                    className={isSelected ? 'idea-table-row--selected' : ''}
                    tabIndex={0}
                    role="row"
                    aria-selected={isSelected}
                    onClick={() => onSelectRow?.(item)}
                    onKeyDown={(e) => handleRowKeyDown(e, item, index, onSelectRow, tableRef)}
                    style={{ cursor: onSelectRow ? 'pointer' : 'default' }}
                  >
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render
                          ? col.render(item, index)
                          : String((item as Record<string, unknown>)[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="idea-table-footer">
        <span>
          Hiển thị <strong>{sortedData.length}</strong> / {data.length} bản ghi
        </span>
        {selectedId && (
          <span style={{ fontFamily: 'var(--idea-font-family-mono)' }}>
            Đang chọn ID: {selectedId}
          </span>
        )}
      </div>
    </div>
  );
}
