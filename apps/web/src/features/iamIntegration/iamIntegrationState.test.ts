import { describe, expect, it } from "vitest";
import { initialIamState } from "./iamIntegrationState";

describe("Shared IAM view state", () => {
  it("starts loading with no fabricated Actor, Organization, role or successful result", () => {
    expect(initialIamState()).toEqual({ kind: "loading" });
  });
});
