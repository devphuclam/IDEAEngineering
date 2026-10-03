/**
 * Utility functions for formatting actor and account identity tokens in IDEA Engineering.
 * Prevents raw UUID database dumps and awkward wrapping in enterprise CAD/PDM views.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuidOrLongIdentifier(id: string): boolean {
  if (!id) return false;
  return UUID_REGEX.test(id) || id.length > 20;
}

export function formatDisplayId(id: string): string {
  if (!id) return "";
  if (UUID_REGEX.test(id)) {
    // Clean shortened token for UUIDs, e.g. 99fc203b...725b
    return `${id.slice(0, 8)}...${id.slice(-4)}`;
  }
  if (id.length > 20) {
    return `${id.slice(0, 10)}...${id.slice(-4)}`;
  }
  return id;
}

export function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

