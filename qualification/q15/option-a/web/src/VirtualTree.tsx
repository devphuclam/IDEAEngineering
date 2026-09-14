import { useEffect, useMemo, useRef, useState } from "react";
import type { TreeNode } from "./types";
import { nextSelection, virtualRange } from "./selection";

interface Props {
  total: number;
  nodes: Map<number, TreeNode>;
  onRange(start: number, end: number): void;
  label: string;
  pagingKey?: string;
}

const rowHeight = 32;

export function VirtualTree({ total, nodes, onRange, label, pagingKey = "" }: Props) {
  const [selected, setSelected] = useState(0);
  const [range, setRange] = useState(() => virtualRange(0, 430, rowHeight, total));
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => onRange(range.start, range.end), [onRange, range.end, range.start]);
  useEffect(() => {
    setSelected(0);
    setRange(virtualRange(0, 430, rowHeight, total));
    setCollapsed(new Set());
    if (viewport.current) viewport.current.scrollTo({ top: 0, left: 0 });
  }, [pagingKey, total]);
  const visible = useMemo(() => Array.from({ length: Math.max(0, range.end - range.start) }, (_, i) => range.start + i), [range]);

  return <div data-q15="product-tree">
    <div className="tree-summary" aria-live="polite">{total.toLocaleString()} nodes</div>
    <div
      ref={viewport}
      className="virtual-tree"
      role="tree"
      aria-label={label}
      tabIndex={0}
      onScroll={(event) => setRange(virtualRange(event.currentTarget.scrollTop, event.currentTarget.clientHeight, rowHeight, total))}
      onKeyDown={(event) => {
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const next = nextSelection(selected, event.key, total);
          setSelected(next);
          window.setTimeout(() => viewport.current?.querySelector<HTMLElement>(`[data-tree-index="${next}"]`)?.scrollIntoView({ block: "nearest" }));
        } else if (["ArrowLeft", "ArrowRight", "Enter", " "].includes(event.key)) {
          const node = nodes.get(selected);
          if (node?.hasChildren) {
            event.preventDefault();
            setCollapsed((current) => { const next = new Set(current); next.has(node.nodeId) ? next.delete(node.nodeId) : next.add(node.nodeId); return next; });
          }
        }
      }}
    >
      <div style={{ height: total * rowHeight, position: "relative" }}>
        {visible.map((index) => {
          const node = nodes.get(index);
          const expanded = node ? !collapsed.has(node.nodeId) : false;
          return <div
            key={index}
            role="treeitem"
            aria-level={(node?.depth ?? 0) + 1}
            aria-selected={index === selected}
            aria-expanded={node?.hasChildren ? expanded : undefined}
            className={`tree-node ${index === selected ? "selected" : ""}`}
            data-tree-index={index}
            data-q15={`tree-node-${index}`}
            style={{ transform: `translateY(${index * rowHeight}px)`, paddingInlineStart: 8 + (node?.depth ?? 0) * 12 }}
            onClick={() => setSelected(index)}
          >
            <span aria-hidden="true">{node?.hasChildren ? (expanded ? "▾" : "▸") : "·"}</span>
            <span>{node?.label ?? `Loading node ${index + 1}`}</span>
          </div>;
        })}
      </div>
    </div>
  </div>;
}
