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
