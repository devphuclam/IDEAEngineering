import type { IamResult } from "../../api/iamClient";

/** Shared view state is advisory UI state, never an Actor, grant or session capability. */
export type IamState<T> =
  | { kind: "loading" }
  | { kind: "ready"; value: T }
  | { kind: "empty" }
  | { kind: "refused"; status: number }
  | { kind: "stale" }
  | { kind: "unavailable" }
  | { kind: "unresolved" };

export function initialIamState<T>(): IamState<T> {
  return { kind: "loading" };
}

export function settledIamState<T>(result: IamResult<T>, isEmpty: (value: T) => boolean = () => false): IamState<T> {
  switch (result.kind) {
    case "confirmed": return isEmpty(result.value) ? { kind: "empty" } : { kind: "ready", value: result.value };
    case "refused": return { kind: "refused", status: result.status };
    case "stale": return { kind: "stale" };
    case "unavailable": return { kind: "unavailable" };
    case "unresolved": return { kind: "unresolved" };
  }
}
