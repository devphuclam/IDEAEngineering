import { useEffect, useMemo, useRef, useState } from "react";
import type { DocumentSummary } from "./types";
import { nextSelection, virtualRange } from "./selection";

interface Props {
  total: number;
  columns: string[];
  rows: Map<number, DocumentSummary>;
  selected: number;
  onSelected(index: number): void;
  onOpen(index: number): void;
  onRange(start: number, end: number): void;
  label: string;
  editLabel: string;
  menuLabel: string;
  pagingKey?: string;
}

const rowHeight = 36;

export function VirtualGrid({ total, columns, rows, selected, onSelected, onOpen, onRange, label, editLabel, menuLabel, pagingKey = "" }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const firstMenuItem = useRef<HTMLButtonElement>(null);
  const [range, setRange] = useState(() => virtualRange(0, 430, rowHeight, total));
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [composing, setComposing] = useState(false);
  const [menu, setMenu] = useState<{ index: number; x: number; y: number } | null>(null);
  const [multi, setMulti] = useState<Set<number>>(() => new Set());

  useEffect(() => { onRange(range.start, range.end); }, [onRange, range.end, range.start]);
  useEffect(() => {
    setRange(virtualRange(0, 430, rowHeight, total));
    setEditing(null);
    setDraft("");
    setComposing(false);
    setMenu(null);
    setMulti(new Set());
    if (viewport.current) viewport.current.scrollTo({ top: 0, left: 0 });
  }, [pagingKey, total, columns.length]);
  useEffect(() => { if (menu) firstMenuItem.current?.focus(); }, [menu]);

  const visible = useMemo(() => Array.from({ length: Math.max(0, range.end - range.start) }, (_, i) => range.start + i), [range]);
  const select = (index: number, extend: boolean) => {
    onSelected(index);
    setMulti((current) => extend ? new Set(current).add(index) : new Set([index]));
  };
  const ensureVisible = (index: number) => {
    const element = viewport.current;
    if (!element) return;
    // The sticky header still occupies one row in the canvas flow.
    const rowTop = (index + 2) * rowHeight;
    const rowBottom = rowTop + rowHeight;
    const visibleTop = element.scrollTop + rowHeight;
    const visibleBottom = element.scrollTop + element.clientHeight;
    let nextTop = element.scrollTop;
    if (index === 0) nextTop = 0;
    else if (rowTop < visibleTop) nextTop = Math.max(0, rowTop - rowHeight);
    else if (rowBottom > visibleBottom) nextTop = rowBottom - element.clientHeight;
    if (nextTop !== element.scrollTop) {
      element.scrollTop = nextTop;
      setRange(virtualRange(nextTop, element.clientHeight, rowHeight, total));
    }
  };
  const restoreGridFocus = () => window.requestAnimationFrame(() => viewport.current?.focus());

  return <div className="grid-region" data-q15="document-grid">
    <div className="grid-summary" aria-live="polite">{total.toLocaleString()} rows · {columns.length} columns · {multi.size} selected</div>
    <div
      ref={viewport}
      className="virtual-grid"
      role="grid"
      aria-label={label}
      aria-rowcount={total}
      aria-colcount={columns.length}
      tabIndex={0}
      onScroll={(event) => setRange(virtualRange(event.currentTarget.scrollTop, event.currentTarget.clientHeight, rowHeight, total))}
      onKeyDown={(event) => {
        if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const pageRows = Math.max(1, Math.floor(event.currentTarget.clientHeight / rowHeight));
          const next = nextSelection(selected, event.key, total, pageRows);
          select(next, event.ctrlKey || event.metaKey || event.shiftKey);
          ensureVisible(next);
        } else if (event.key === " " && selected >= 0) {
          event.preventDefault();
          setMulti((current) => {
            const next = new Set(current);
            if (next.has(selected)) next.delete(selected);
            else next.add(selected);
            return next;
          });
        } else if (event.key === "Enter" && selected >= 0) onOpen(selected);
        else if (event.key === "F2" && selected >= 0) {
          const row = rows.get(selected);
          if (row) { setEditing(selected); setDraft(row.title); }
        } else if ((event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) && selected >= 0) {
          event.preventDefault(); setMenu({ index: selected, x: 80, y: 80 });
        }
      }}
    >
      <div className="grid-canvas" style={{ height: (total + 2) * rowHeight, width: Math.max(1_280, columns.length * 148) }}>
        <div className="grid-header" role="row" style={{ width: columns.length * 148 }}>
          {columns.map((column, index) => <div role="columnheader" key={column}>{index === 0 ? "Document / title" : column}</div>)}
        </div>
        {visible.map((index) => {
          const row = rows.get(index);
          return <div
            className={`grid-row ${selected === index ? "selected" : ""}`}
            role="row"
            aria-rowindex={index + 1}
            aria-selected={multi.has(index)}
            data-row-index={index}
            data-q15={`grid-row-${index}`}
            key={index}
            style={{ transform: `translateY(${index * rowHeight + rowHeight}px)`, width: columns.length * 148 }}
            onClick={(event) => select(index, event.ctrlKey || event.metaKey || event.shiftKey)}
            onDoubleClick={() => row && onOpen(index)}
            onContextMenu={(event) => { event.preventDefault(); select(index, false); setMenu({ index, x: event.clientX, y: event.clientY }); }}
          >
            <div role="gridcell">
              {editing === index ? <input
                autoFocus
                aria-label={editLabel}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onCompositionStart={() => setComposing(true)}
                onCompositionEnd={() => setComposing(false)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !composing) setEditing(null);
                  if (event.key === "Escape") setEditing(null);
                }}
                onBlur={() => setEditing(null)}
              /> : row ? <><strong>{row.documentId}</strong><span>{row.title}</span></> : <span className="skeleton">Loading row {index + 1}</span>}
            </div>
            {columns.slice(1).map((column, columnIndex) => <div role="gridcell" key={column}>{row?.values[columnIndex] ?? "…"}</div>)}
          </div>;
        })}
      </div>
    </div>
    {menu && <div
      className="context-menu"
      role="menu"
      aria-label={menuLabel}
      style={{ left: menu.x, top: menu.y }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          setMenu(null);
          restoreGridFocus();
        }
      }}
    >
      <button ref={firstMenuItem} role="menuitem" onClick={() => { onOpen(menu.index); setMenu(null); restoreGridFocus(); }}>Open detail</button>
      <button role="menuitem" onClick={() => { setEditing(menu.index); setDraft(rows.get(menu.index)?.title ?? ""); setMenu(null); }}>{editLabel}</button>
      <button role="menuitem" onClick={() => { setMenu(null); restoreGridFocus(); }}>Close</button>
    </div>}
  </div>;
}
