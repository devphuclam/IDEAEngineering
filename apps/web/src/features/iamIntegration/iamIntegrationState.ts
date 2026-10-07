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
