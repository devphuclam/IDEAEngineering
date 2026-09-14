export function nextSelection(current: number, key: string, total: number): number {
  if (total <= 0) return -1;
  if (key === "ArrowDown") return Math.min(total - 1, Math.max(0, current + 1));
  if (key === "ArrowUp") return Math.max(0, current <= 0 ? 0 : current - 1);
  if (key === "Home") return 0;
  if (key === "End") return total - 1;
  return current;
}

export function virtualRange(scrollTop: number, viewportHeight: number, rowHeight: number, total: number, overscan = 8) {
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(total, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan);
  return { start, end };
}
