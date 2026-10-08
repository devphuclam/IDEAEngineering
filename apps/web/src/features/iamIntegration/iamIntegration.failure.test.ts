/** Never retain the private values used for the RAM-only leak comparisons. */
export function qualifyFailure(o:{ordinary:number;csrf:number;stale:number;unavailable:number;lostReadAttempts:number;lostReadStatus:number;history:number;unknownState:string;leaked:boolean;clientAuthoritativeActor:boolean}){
  if(o.ordinary!==403||o.csrf!==403||o.stale!==409||o.unavailable!==503||o.lostReadAttempts!==1||o.lostReadStatus!==200||o.history!==409||o.unknownState!=="UNRESOLVED"||o.leaked||o.clientAuthoritativeActor)throw new Error("FAIL_CLOSED_BOUNDARY_FAILED");
}
