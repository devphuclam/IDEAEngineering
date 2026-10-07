/** Ordinary same-origin Server session only. No browser-authored Actor, Organization or grant. */
export type SessionView = { actorId: string; accountId: string };
export type IamResult<T> =
  | { kind: "confirmed"; value: T }
  | { kind: "refused"; status: number }
  | { kind: "stale" }
  | { kind: "unavailable" }
  | { kind: "unresolved" };
export type FetchBoundary = (path: string, init: RequestInit) => Promise<Response>;
export type AdministrationContext = SessionView & { organizationId: string; displayName: string; organizationName: string; actions: string[] };
export type LoginIdentityView = { loginIdentityId: string; normalizedLogin: string; credentialState: "ESTABLISHED" | "NOT_ESTABLISHED" };
export type AccountView = SessionView & { organizationId: string; displayName: string; status: "PENDING" | "ACTIVE" | "DISABLED"; securityVersion: number; loginIdentities: LoginIdentityView[] };
export type AccountPage = { items: AccountView[]; offset: number; limit: number; hasMore: boolean };
export type AccountChange = SessionView & { status: AccountView["status"]; securityVersion: number; loginIdentityId?: string };
export type ProofPurpose = "FIRST_SETUP" | "RESET";
export type PrivateProof = { proof: string; expiresAt: string };

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const requestOptions = { credentials: "same-origin", cache: "no-store", redirect: "error" } as const;

function refused<T>(status: number): IamResult<T> {
  if ([400, 401, 403, 404].includes(status)) return { kind: "refused", status };
  if (status === 409) return { kind: "stale" };
  return { kind: "unavailable" };
}

function mutationRefusal<T>(status: number): IamResult<T> {
  if ([400, 401, 403, 404, 409].includes(status)) return refused(status);
  // A missing/unexpected response is not proof of rollback or permission to resubmit.
  return { kind: "unresolved" };
}

function sessionView(value: unknown): SessionView {
  if (typeof value !== "object" || value === null) throw new Error("Invalid session response");
  const data = value as Record<string, unknown>;
  if (typeof data.actorId !== "string" || !uuid.test(data.actorId) ||
      typeof data.accountId !== "string" || !uuid.test(data.accountId)) throw new Error("Invalid session response");
  // Copy only the accepted redacted fields; unknown response content cannot enter UI state.
  return { actorId: data.actorId, accountId: data.accountId };
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid response");
  return value as Record<string, unknown>;
}
function identifier(value: unknown): string { if (typeof value !== "string" || !uuid.test(value)) throw new Error("Invalid identity"); return value; }
function text(value: unknown, max = 200): string { if (typeof value !== "string" || !value.trim() || value.length > max || /[\x00-\x1f\x7f]/.test(value)) throw new Error("Invalid text"); return value; }
function version(value: unknown): number { if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) throw new Error("Invalid version"); return value; }
function status(value: unknown): AccountView["status"] { if (value !== "PENDING" && value !== "ACTIVE" && value !== "DISABLED") throw new Error("Invalid state"); return value; }
function accountChange(value: unknown): AccountChange {
  const data = object(value);
  return { ...sessionView(data), status: status(data.status), securityVersion: version(data.securityVersion),
    ...(data.loginIdentityId === undefined ? {} : { loginIdentityId: identifier(data.loginIdentityId) }) };
}
function accountView(value: unknown): AccountView {
  const data = object(value); if (!Array.isArray(data.loginIdentities)) throw new Error("Invalid logins");
  const logins = data.loginIdentities.map(value => {
    const login = object(value);
    if (login.credentialState !== "ESTABLISHED" && login.credentialState !== "NOT_ESTABLISHED") throw new Error("Invalid credential state");
    return { loginIdentityId: identifier(login.loginIdentityId), normalizedLogin: text(login.normalizedLogin, 254), credentialState: login.credentialState } as LoginIdentityView;
  });
  return { ...sessionView(data), organizationId: identifier(data.organizationId), displayName: text(data.displayName),
    status: status(data.status), securityVersion: version(data.securityVersion), loginIdentities: logins };
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
  async function read<T>(path: string, decode: (value: unknown) => T): Promise<IamResult<T>> {
    try {
      const response = await fetchBoundary(path, { ...requestOptions, method: "GET", headers: { Accept: "application/json" } });
      if (response.status !== 200) return refused(response.status);
      return { kind: "confirmed", value: decode(await response.json()) };
    } catch { return { kind: "unavailable" }; }
  }
  async function command<T>(path: string, input: unknown, expected: number, decode: (response: Response) => Promise<T>): Promise<IamResult<T>> {
    let submitted = false;
    let body = "";
    try {
      const csrf = await currentCsrf(); body = JSON.stringify(input); submitted = true;
      const response = await fetchBoundary(path, { ...requestOptions, method: "POST", body,
        headers: { "Content-Type": "application/json", [csrf.headerName]: csrf.token } });
      if (response.status !== expected) return mutationRefusal(response.status);
      return { kind: "confirmed", value: await decode(response) };
    } catch { return { kind: submitted ? "unresolved" : "unavailable" }; }
    finally { body = ""; input = undefined; }
  }
  return {
    loadContext(): Promise<IamResult<AdministrationContext>> {
      return read("/api/v1/administration/context", value => {
        const data = object(value);
        const allowed = ["account.read", "account.create", "account.disable", "account.re-enable", "account.credential.setup.issue", "account.credential.reset.issue"];
        if (!Array.isArray(data.actions) || data.actions.some(action => typeof action !== "string" || !allowed.includes(action))) throw new Error("Invalid action availability");
        return { ...sessionView(data), organizationId: identifier(data.organizationId), displayName: text(data.displayName), organizationName: text(data.organizationName), actions: [...data.actions] };
      });
    },
    loadAccounts(filter = "", offset = 0): Promise<IamResult<AccountPage>> {
      return read(`/api/v1/administration/accounts?filter=${encodeURIComponent(filter)}&offset=${offset}&limit=50`, value => {
        const data = object(value);
        if (!Array.isArray(data.items) || typeof data.offset !== "number" || !Number.isSafeInteger(data.offset) || data.offset < 0 ||
          typeof data.limit !== "number" || !Number.isSafeInteger(data.limit) || data.limit < 1 || data.limit > 100 || typeof data.hasMore !== "boolean") throw new Error("Invalid page");
        return { items: data.items.map(accountView), offset: data.offset, limit: data.limit, hasMore: data.hasMore };
      });
    },
    loadAccount(accountId: string): Promise<IamResult<AccountView>> { return read(`/api/v1/administration/accounts/${identifier(accountId)}`, accountView); },
    createAccount(input: { operationId: string; organizationId: string; displayName: string; login: string }): Promise<IamResult<AccountChange>> {
      return command("/api/v1/identity/accounts", input, 201, async response => accountChange(await response.json()));
    },
    changeAccount(accountId: string, action: "disable" | "re-enable", input: { operationId: string; organizationId: string; expectedSecurityVersion: number; reason: string }): Promise<IamResult<AccountChange>> {
      return command(`/api/v1/identity/accounts/${identifier(accountId)}/${action}`, input, 200, async response => accountChange(await response.json()));
    },
    issueProof(accountId: string, input: { operationId: string; organizationId: string; loginIdentityId: string; purpose: ProofPurpose; expectedSecurityVersion: number; reason: string }): Promise<IamResult<PrivateProof>> {
      return command(`/api/v1/identity/accounts/${identifier(accountId)}/credential-proofs`, input, 200, async response => {
        if (!response.headers.get("Cache-Control")?.split(",").some(value => value.trim().toLowerCase() === "no-store")) throw new Error("Private delivery caching refused");
        const data = object(await response.json());
        if (typeof data.proof !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(data.proof) || typeof data.expiresAt !== "string" || !Number.isFinite(Date.parse(data.expiresAt))) throw new Error("Invalid proof response");
        return { proof: data.proof, expiresAt: data.expiresAt };
      });
    },
    redeemCredential(input: { operationId: string; accountId: string; purpose: ProofPurpose; proof: string; password: string }): Promise<IamResult<void>> {
      return command("/api/v1/identity/credentials", input, 204, async () => undefined);
    },
    async signOut(): Promise<IamResult<void>> {
      let submitted = false;
      try {
        const csrf = await currentCsrf();
        submitted = true;
        const response = await fetchBoundary("/api/v1/identity/logout", {
          ...requestOptions, method: "POST", headers: { [csrf.headerName]: csrf.token },
        });
        return response.status === 204 ? { kind: "confirmed", value: undefined } : mutationRefusal(response.status);
      } catch { return { kind: submitted ? "unresolved" : "unavailable" }; }
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
        if (response.status !== 200) return mutationRefusal(response.status);
        const value: unknown = await response.json();
        if (typeof value !== "object" || value === null) return { kind: "unresolved" };
        const actorId = (value as Record<string, unknown>).actorId;
        if (typeof actorId !== "string" || !uuid.test(actorId)) return { kind: "unresolved" };
        return { kind: "confirmed", value: { actorId } };
      } catch { return { kind: submitted ? "unresolved" : "unavailable" }; }
      finally { password = ""; }
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
