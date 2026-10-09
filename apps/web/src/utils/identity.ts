// Presentation lineage: feat/f04-admin-iam-ui @ 9160ec27. IDs remain Server-derived.
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuidOrLongIdentifier(id: string): boolean {
  return Boolean(id) && (UUID_REGEX.test(id) || id.length > 20);
}

export function formatDisplayId(id: string): string {
  if (!id) return "";
  if (UUID_REGEX.test(id)) return `${id.slice(0, 8)}...${id.slice(-4)}`;
  if (id.length > 20) return `${id.slice(0, 10)}...${id.slice(-4)}`;
  return id;
}

/**
 * Ánh xạ nhất quán (deterministic) một UUID bất kỳ thành mã số 6 chữ số cố định dạng #123-456.
 * Dùng thuật toán băm FNV-1a đảm bảo tốc độ cực nhanh và luôn cố định giá trị cho cùng một ID.
 */
export function toShortDisplayCode(id: string, prefix = "#"): string {
  if (!id) return "";
  let hash = 2166136261;
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const num = Math.abs(hash) % 1000000;
  const str = String(num).padStart(6, "0");
  return `${prefix}${str.slice(0, 3)}-${str.slice(3)}`;
}

/**
 * Trích xuất các chữ số trần (raw digits) từ chuỗi để so khớp tìm kiếm nhanh.
 */
export function getRawDigits(code: string): string {
  return code.replace(/\D/g, "");
}

/**
 * Lấy 2 chữ cái viết tắt đại diện (Initials Avatar) từ tên hiển thị.
 */
export function getInitials(name: string): string {
  if (!name) return "ID";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ID";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
