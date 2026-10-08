/** Assertions fed only by the actual packaged HTTPS/Chrome harness, not an HTML double. */
export function qualifyBrowser(o:{secure:boolean;httpOnly:boolean;sameSite:string;host:string;authenticated:number;invalidated:number;reloaded:boolean}){
  if(!o.secure||!o.httpOnly||o.sameSite!=="Strict"||o.host!=="localhost"||o.authenticated!==200||o.invalidated!==401||!o.reloaded)throw new Error("BROWSER_BOUNDARY_FAILED");
}
