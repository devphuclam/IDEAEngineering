/** Keyboard observations come from headed Chrome, including the authored assignment dialog. */
export function qualifyAccessibility(o:{initialFocus:boolean;trapped:boolean;escapeClosed:boolean;focusRestored:boolean;visibleFocus:boolean;noClickableDiv:boolean;noOverflow:boolean;statusHasText:boolean}){
  if(Object.values(o).some(value=>!value))throw new Error("ACCESSIBILITY_BOUNDARY_FAILED");
}
