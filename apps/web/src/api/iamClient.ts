/** Ordinary same-origin Server session only. No browser-authored Actor, Organization or grant. */
export type SessionView = { actorId: string; accountId: string };
export type IamResult<T> =
  | { kind: "confirmed"; value: T }
  | { kind: "refused"; status: number }
  | { kind: "stale" }
  | { kind: "unavailable" }
  | { kind: "unresolved" };
export type FetchBoundary = (path: string, init: RequestInit) => Promise<Response>;

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const requestOptions = { credentials: "same-origin", cache: "no-store", redirect: "error" } as const;

function refused<T>(status: number): IamResult<T> {
  if ([400, 401, 403, 404].includes(status)) return { kind: "refused", status };
  if (status === 409) return { kind: "stale" };
  return { kind: "unavailable" };
}

function sessionView(value: unknown): SessionView {
  if (typeof value !== "object" || value === null) throw new Error("Invalid session response");
  const data = value as Record<string, unknown>;
  if (typeof data.actorId !== "string" || !uuid.test(data.actorId) ||
      typeof data.accountId !== "string" || !uuid.test(data.accountId)) throw new Error("Invalid session response");
  // Copy only the accepted redacted fields; unknown response content cannot enter UI state.
  return { actorId: data.actorId, accountId: data.accountId };
}

export function createIamClient(fetchBoundary: FetchBoundary = (path, init) => fetch(path, init)) {
  async function currentCsrf(): Promise<{ headerName: "X-CSRF-TOKEN"; token: string }> {
    const response = await fetchBoundary("/api/v1/identity/csrf", {
      ...requestOptions, method: "GET", headers: { Accept: "application/json" },
    });
    if (response.status !== 200) throw new Error("CSRF unavailable");
    const value: unknown = await response.json();
    if (typeof value !== "object" || value === null) throw new Error("Invalid CSRF response");
    const proof = value as Record<string, unknown>;
    if (proof.headerName !== "X-CSRF-TOKEN" || typeof proof.token !== "string" ||
        proof.token.length < 1 || proof.token.length > 8192 || /[\r\n]/.test(proof.token)) throw new Error("Invalid CSRF response");
    return { headerName: "X-CSRF-TOKEN", token: proof.token };
  }
  return {
    async signOut(): Promise<IamResult<void>> {
      throw new Error("IAM sign-out adapter not implemented");
    },
    async signIn(login: string, password: string): Promise<IamResult<{ actorId: string }>> {
      let submitted = false;
      try {
        const csrf = await currentCsrf();
        const body = new URLSearchParams({ username: login, password });
        submitted = true;
        const response = await fetchBoundary("/api/v1/identity/login", {
          ...requestOptions, method: "POST", body,
          headers: { "Content-Type": "application/x-www-form-urlencoded", [csrf.headerName]: csrf.token },
        });
        if (response.status !== 200) return response.status >= 500 ? { kind: "unresolved" } : refused(response.status);
        const value: unknown = await response.json();
        if (typeof value !== "object" || value === null) return { kind: "unresolved" };
        const actorId = (value as Record<string, unknown>).actorId;
        if (typeof actorId !== "string" || !uuid.test(actorId)) return { kind: "unresolved" };
        return { kind: "confirmed", value: { actorId } };
      } catch { return { kind: submitted ? "unresolved" : "unavailable" }; }
    },
    async loadSession(): Promise<IamResult<SessionView>> {
      try {
        const response = await fetchBoundary("/api/v1/identity/session", {
          ...requestOptions, method: "GET", headers: { Accept: "application/json" },
        });
        if (response.status !== 200) return refused(response.status);
        return { kind: "confirmed", value: sessionView(await response.json()) };
      } catch { return { kind: "unavailable" }; }
    },
  };
}
