/** Keyboard observations come from headed Chrome, including the authored assignment dialog. */
export function qualifyAccessibility(o:{initialFocus:boolean;trapped:boolean;escapeClosed:boolean;focusRestored:boolean;visibleFocus:boolean;noClickableDiv:boolean;noOverflow:boolean;statusHasText:boolean}){
  const failed=Object.entries(o).filter(([,value])=>!value).map(([name])=>name);
  if(failed.length)throw new Error("ACCESSIBILITY_BOUNDARY_FAILED:"+failed.join(","));
}
