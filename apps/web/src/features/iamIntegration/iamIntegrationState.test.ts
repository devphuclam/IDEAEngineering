import { describe, expect, it } from "vitest";
import { initialIamState } from "./iamIntegrationState";
import { createIamClient } from "../../api/iamClient";

describe("Shared IAM view state", () => {
  it("starts loading with no fabricated Actor, Organization, role or successful result", () => {
    expect(initialIamState()).toEqual({ kind: "loading" });
  });

  it("reads the current Actor and Account only from the ordinary Server session route", async () => {
    const session = { actorId: "00000000-0000-4000-8000-000000000101", accountId: "00000000-0000-4000-8000-000000000102" };
    const client = createIamClient(async (path, init) => {
      expect(path).toBe("/api/v1/identity/session");
      expect(init.method).toBe("GET");
      expect(init.credentials).toBe("same-origin");
      expect(init.cache).toBe("no-store");
      expect(init.redirect).toBe("error");
      expect(init.body).toBeUndefined();
      expect(new Headers(init.headers).get("ActorId")).toBeNull();
      expect(new Headers(init.headers).get("Authorization")).toBeNull();
      return Response.json(session);
    });
    expect(await client.loadSession()).toEqual({ kind: "confirmed", value: session });
  });

  it("signs in with a freshly acquired Server CSRF header and retains no credential or CSRF in the result", async () => {
    const credential = "test-only-submission-value";
    const csrf = "test-only-csrf-value";
    const actorId = "00000000-0000-4000-8000-000000000103";
    const requests: string[] = [];
    const client = createIamClient(async (path, init) => {
      requests.push(path);
      expect(init.credentials).toBe("same-origin");
      expect(init.redirect).toBe("error");
      if (path === "/api/v1/identity/csrf") return Response.json({ headerName: "X-CSRF-TOKEN", token: csrf });
      expect(path).toBe("/api/v1/identity/login");
      expect(init.method).toBe("POST");
      const headers = new Headers(init.headers);
      expect(headers.get("X-CSRF-TOKEN")).toBe(csrf);
      expect(headers.get("Authorization")).toBeNull();
      expect(headers.get("ActorId")).toBeNull();
      const body = init.body as URLSearchParams;
      expect([...body.keys()]).toEqual(["username", "password"]);
      expect(body.get("username")).toBe("synthetic.login");
      expect(body.get("password")).toBe(credential);
      return Response.json({ actorId });
    });
    const result = await client.signIn("synthetic.login", credential);
    expect(result).toEqual({ kind: "confirmed", value: { actorId } });
    expect(requests).toEqual(["/api/v1/identity/csrf", "/api/v1/identity/login"]);
    expect(JSON.stringify(result)).not.toContain(credential);
    expect(JSON.stringify(result)).not.toContain(csrf);
  });

  it("logs out only through the ordinary CSRF-protected session contract", async () => {
    const client = createIamClient(async (path, init) => {
      if (path === "/api/v1/identity/csrf") return Response.json({ headerName: "X-CSRF-TOKEN", token: "test-csrf" });
      expect(path).toBe("/api/v1/identity/logout");
      expect(init.method).toBe("POST");
      expect(init.credentials).toBe("same-origin");
      expect(init.body).toBeUndefined();
      expect(new Headers(init.headers).get("X-CSRF-TOKEN")).toBe("test-csrf");
      expect(new Headers(init.headers).get("ActorId")).toBeNull();
      return new Response(null, { status: 204 });
    });
    expect(await client.signOut()).toEqual({ kind: "confirmed", value: undefined });
  });

  it("distinguishes refusal, stale and unavailable reads without treating refusal as authorized empty", async () => {
    for (const [status, expected] of [[400, { kind: "refused", status: 400 }], [401, { kind: "refused", status: 401 }],
      [403, { kind: "refused", status: 403 }], [404, { kind: "refused", status: 404 }],
      [409, { kind: "stale" }], [503, { kind: "unavailable" }]] as const) {
      const client = createIamClient(async () => new Response("PRIVATE_RESPONSE_SENTINEL", { status }));
      expect(await client.loadSession()).toEqual(expected);
    }
  });

  it("refuses malformed successful session responses and never copies extra private response fields", async () => {
    for (const value of [null, {}, { actorId: "not-a-uuid", accountId: "not-a-uuid" }]) {
      expect(await createIamClient(async () => Response.json(value)).loadSession()).toEqual({ kind: "unavailable" });
    }
    const safe = { actorId: "00000000-0000-4000-8000-000000000101", accountId: "00000000-0000-4000-8000-000000000102" };
    expect(await createIamClient(async () => Response.json({ ...safe, privateDetail: "PRIVATE_RESPONSE_SENTINEL" })).loadSession())
      .toEqual({ kind: "confirmed", value: safe });
  });

  it("read network failure is unavailable, while response loss after submission is unresolved with no retry", async () => {
    expect(await createIamClient(async () => { throw new Error("PRIVATE_DIAGNOSTIC_SENTINEL"); }).loadSession())
      .toEqual({ kind: "unavailable" });
    let posts = 0;
    const client = createIamClient(async (path) => {
      if (path === "/api/v1/identity/csrf") return Response.json({ headerName: "X-CSRF-TOKEN", token: "test-csrf" });
      posts++;
      throw new Error("PRIVATE_DIAGNOSTIC_SENTINEL");
    });
    expect(await client.signIn("synthetic.login", "test-only-credential")).toEqual({ kind: "unresolved" });
    expect(posts).toBe(1);
  });

  it("rejects missing, malformed or attacker-selected CSRF headers before any mutation is submitted", async () => {
    for (const proof of [{}, { headerName: "Cookie", token: "test-csrf" }, { headerName: "X-CSRF-TOKEN", token: "" },
      { headerName: "X-CSRF-TOKEN", token: "a\r\nb" }]) {
      let posts = 0;
      const client = createIamClient(async (path) => {
        if (path === "/api/v1/identity/csrf") return Response.json(proof);
        posts++;
        return new Response(null, { status: 204 });
      });
      expect(await client.signIn("synthetic.login", "test-only-credential")).toEqual({ kind: "unavailable" });
      expect(posts).toBe(0);
    }
  });

  it("unexpected mutation success statuses cannot become confirmed login or proof of rollback", async () => {
    for (const status of [201, 202, 204]) {
      const client = createIamClient(async (path) => path === "/api/v1/identity/csrf"
        ? Response.json({ headerName: "X-CSRF-TOKEN", token: "test-csrf" }) : new Response(null, { status }));
      expect(await client.signIn("synthetic.login", "test-only-credential")).toEqual({ kind: "unresolved" });
    }
  });

  it("generic authentication and CSRF refusals never become success or expose response details", async () => {
    for (const status of [400, 401, 403]) {
      const client = createIamClient(async (path) => path === "/api/v1/identity/csrf"
        ? Response.json({ headerName: "X-CSRF-TOKEN", token: "test-csrf" }) : new Response("PRIVATE_RESPONSE_SENTINEL", { status }));
      expect(await client.signIn("synthetic.login", "test-only-credential")).toEqual({ kind: "refused", status });
    }
  });
});
