import { describe, expect, it } from "vitest";
import { nextSelection, virtualRange } from "./selection";
import { t } from "./i18n";
import { validateIntent } from "./workspaceBridge";

describe("shared interaction semantics", () => {
  it("keeps keyboard selection inside a 100k-row grid", () => {
    expect(nextSelection(99_999, "ArrowDown", 100_000)).toBe(99_999);
    expect(nextSelection(0, "ArrowUp", 100_000)).toBe(0);
    expect(nextSelection(25, "End", 100_000)).toBe(99_999);
    expect(nextSelection(10, "PageDown", 100_000, 12)).toBe(22);
    expect(nextSelection(10, "PageUp", 100_000, 12)).toBe(0);
    expect(nextSelection(99_995, "PageDown", 100_000, 12)).toBe(99_999);
  });

  it("virtualizes rather than rendering the complete large fixture", () => {
    const range = virtualRange(1_700_000, 430, 36, 100_000);
    expect(range.start).toBeGreaterThan(47_000);
    expect(range.end - range.start).toBeLessThan(50);
  });

  it("has concrete English Vietnamese and Japanese critical labels", () => {
    expect(t("en", "checkout")).toBe("Checkout");
    expect(t("vi", "checkout")).toContain("sửa");
    expect(t("ja", "checkout")).toBe("チェックアウト");
  });

  it("allows only exact typed bridge payloads", () => {
    expect(() => validateIntent("OpenDocument", { documentId: "DOC-Q15-000001", generationId: "GEN-Q15-000001-V001" })).not.toThrow();
    expect(() => validateIntent("OpenDocument", { documentId: "DOC-Q15-000001", generationId: "GEN-Q15-000001-V001", path: "C:/secret" })).toThrow("BRIDGE_PAYLOAD_SCHEMA");
    expect(() => validateIntent("GetWorkspaceStatus", { command: "whoami" })).toThrow("BRIDGE_PAYLOAD_SCHEMA");
  });
});
