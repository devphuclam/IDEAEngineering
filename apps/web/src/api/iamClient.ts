/** Ordinary same-origin Server session only. No browser-authored Actor, Organization or grant. */
export type SessionView = { actorId: string; accountId: string };
export type IamResult<T> =
  | { kind: "confirmed"; value: T }
  | { kind: "refused"; status: number }
  | { kind: "stale" }
  | { kind: "unavailable" }
  | { kind: "unresolved" };
export type FetchBoundary = (path: string, init: RequestInit) => Promise<Response>;

export function createIamClient(fetchBoundary: FetchBoundary = (path, init) => fetch(path, init)) {
  return {
    async loadSession(): Promise<IamResult<SessionView>> {
      throw new Error("IAM session adapter not implemented");
    },
  };
}
