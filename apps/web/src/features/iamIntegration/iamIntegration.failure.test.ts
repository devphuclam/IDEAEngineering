import { describe, it, expect } from "vitest";

/** Never retain the private values used for the RAM-only leak comparisons. */
export function qualifyFailure(o:{ordinary:number;csrf:number;stale:number;unavailable:number;lostReadAttempts:number;lostReadStatus:number;history:number;ordinaryHistory:number;unknownState:string;leaked:boolean;clientAuthoritativeActor:boolean}){
  if(o.ordinary!==403||o.csrf!==403||o.stale!==409||o.unavailable!==503||o.lostReadAttempts!==1||o.lostReadStatus!==200||o.history!==200||o.ordinaryHistory!==403||o.unknownState!=="UNRESOLVED"||o.leaked||o.clientAuthoritativeActor)throw new Error("FAIL_CLOSED_BOUNDARY_FAILED");
}

describe("qualifyFailure boundary assertions", () => {
  it("passes when fail-closed expectations are strictly satisfied", () => {
    expect(() => qualifyFailure({
      ordinary: 403,
      csrf: 403,
      stale: 409,
      unavailable: 503,
      lostReadAttempts: 1,
      lostReadStatus: 200,
      history: 200,
      ordinaryHistory: 403,
      unknownState: "UNRESOLVED",
      leaked: false,
      clientAuthoritativeActor: false,
    })).not.toThrow();
  });

  it("throws FAIL_CLOSED_BOUNDARY_FAILED if authority leaks or returns wrong codes", () => {
    expect(() => qualifyFailure({
      ordinary: 403,
      csrf: 403,
      stale: 409,
      unavailable: 503,
      lostReadAttempts: 1,
      lostReadStatus: 200,
      history: 200,
      ordinaryHistory: 403,
      unknownState: "UNRESOLVED",
      leaked: true,
      clientAuthoritativeActor: false,
    })).toThrow("FAIL_CLOSED_BOUNDARY_FAILED");
  });
});
