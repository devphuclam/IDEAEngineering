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
});
