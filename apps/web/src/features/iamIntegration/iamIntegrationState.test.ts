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
});
