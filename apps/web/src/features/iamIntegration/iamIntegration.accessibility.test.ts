import { describe, it, expect } from "vitest";

/** Keyboard observations come from headed Chrome, including the authored assignment dialog. */
export function qualifyAccessibility(o:{initialFocus:boolean;trapped:boolean;escapeClosed:boolean;focusRestored:boolean;visibleFocus:boolean;noClickableDiv:boolean;noOverflow:boolean;statusHasText:boolean}){
  const failed=Object.entries(o).filter(([,value])=>!value).map(([name])=>name);
  if(failed.length)throw new Error("ACCESSIBILITY_BOUNDARY_FAILED:"+failed.join(","));
}

describe("qualifyAccessibility boundary assertions", () => {
  it("passes when all accessibility requirements are true", () => {
    expect(() => qualifyAccessibility({
      initialFocus: true,
      trapped: true,
      escapeClosed: true,
      focusRestored: true,
      visibleFocus: true,
      noClickableDiv: true,
      noOverflow: true,
      statusHasText: true,
    })).not.toThrow();
  });

  it("throws ACCESSIBILITY_BOUNDARY_FAILED when any requirement is false", () => {
    expect(() => qualifyAccessibility({
      initialFocus: true,
      trapped: false,
      escapeClosed: true,
      focusRestored: true,
      visibleFocus: false,
      noClickableDiv: true,
      noOverflow: true,
      statusHasText: true,
    })).toThrow("ACCESSIBILITY_BOUNDARY_FAILED:trapped,visibleFocus");
  });
});
