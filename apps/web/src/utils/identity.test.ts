import { describe, expect, it } from "vitest";
import { formatDisplayId, generateUuid, isUuidOrLongIdentifier } from "./identity";

describe("Identity formatting utilities", () => {
  it("formats standard UUID into a compact token", () => {
    const rawUuid = "99fc203b-d303-4d3b-9a26-bdce8d4f725b";
    expect(isUuidOrLongIdentifier(rawUuid)).toBe(true);
    expect(formatDisplayId(rawUuid)).toBe("99fc203b...725b");
  });

  it("formats account UUID correctly", () => {
    const rawAccount = "872c524d-2ce6-4715-931a-c15785876baf";
    expect(isUuidOrLongIdentifier(rawAccount)).toBe(true);
    expect(formatDisplayId(rawAccount)).toBe("872c524d...6baf");
  });

  it("leaves standard usernames and short account codes untouched", () => {
    expect(isUuidOrLongIdentifier("engineer.dev")).toBe(false);
    expect(formatDisplayId("engineer.dev")).toBe("engineer.dev");

    expect(isUuidOrLongIdentifier("acc_019842a")).toBe(false);
    expect(formatDisplayId("acc_019842a")).toBe("acc_019842a");
  });

  it("handles empty or falsy inputs gracefully", () => {
    expect(isUuidOrLongIdentifier("")).toBe(false);
    expect(formatDisplayId("")).toBe("");
  });

  it("generates valid RFC 4122 v4 UUID", () => {
    const id = generateUuid();
    expect(isUuidOrLongIdentifier(id)).toBe(true);
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});
