import { describe, it, expect } from "vitest";

/** Assertions fed only by the actual packaged HTTPS/Chrome harness, not an HTML double. */
export function qualifyBrowser(o:{secure:boolean;httpOnly:boolean;sameSite:string;host:string;authenticated:number;invalidated:number;reloaded:boolean}){
  if(!o.secure||!o.httpOnly||o.sameSite!=="Strict"||o.host!=="localhost"||o.authenticated!==200||o.invalidated!==401||!o.reloaded)throw new Error("BROWSER_BOUNDARY_FAILED");
}

describe("qualifyBrowser boundary assertions", () => {
  it("passes when browser boundary satisfies all security expectations", () => {
    expect(() => qualifyBrowser({
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
      host: "localhost",
      authenticated: 200,
      invalidated: 401,
      reloaded: true,
    })).not.toThrow();
  });

  it("throws BROWSER_BOUNDARY_FAILED if any parameter is insecure or unexpected", () => {
    expect(() => qualifyBrowser({
      secure: false,
      httpOnly: true,
      sameSite: "Strict",
      host: "localhost",
      authenticated: 200,
      invalidated: 401,
      reloaded: true,
    })).toThrow("BROWSER_BOUNDARY_FAILED");
  });
});
