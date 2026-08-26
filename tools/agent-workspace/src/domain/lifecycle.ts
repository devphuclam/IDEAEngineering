// Run lifecycle state machine per data-model.md:
// requested -> claimed -> preparing -> running -> verifying -> ready-for-integration
//             -> integrated | failed | cancelled | expired
// Every transition is idempotent: re-applying the same transition is a no-op
// that returns the target state instead of failing.

import type { RunState } from './types.ts';

const TERMINAL: RunState[] = ['integrated', 'failed', 'cancelled', 'expired'];

const ALLOWED: Record<RunState, RunState[]> = {
  requested: ['claimed', 'cancelled', 'expired', 'failed'],
  claimed: ['preparing', 'cancelled', 'expired', 'failed'],
  preparing: ['running', 'cancelled', 'expired', 'failed'],
  running: ['verifying', 'cancelled', 'expired', 'failed'],
  verifying: ['ready-for-integration', 'running', 'cancelled', 'expired', 'failed'],
  'ready-for-integration': ['running', 'integrated', 'expired', 'failed'],
  integrated: [],
  failed: [],
  cancelled: [],
  expired: [],
};

export function isTerminal(state: RunState): boolean {
  return TERMINAL.includes(state);
}

export interface TransitionResult {
  state: RunState;
  transitioned: boolean;
  idempotent: boolean;
}

export class InvalidTransitionError extends Error {
  constructor(from: RunState, to: RunState) {
    super(`Invalid transition ${from} -> ${to}`);
    this.name = 'InvalidTransitionError';
  }
}

/**
 * Applies a state transition. Idempotent: requesting a transition that already
 * applies (from === to) returns the state with `transitioned: false` rather
 * than failing, so duplicate commands never create a second state transition.
 */
export function transition(from: RunState, to: RunState): TransitionResult {
  if (from === to) {
    return { state: to, transitioned: false, idempotent: true };
  }
  if (from in ALLOWED && ALLOWED[from].includes(to)) {
    return { state: to, transitioned: true, idempotent: false };
  }
  throw new InvalidTransitionError(from, to);
}

export interface RetryLink {
  runId: string;
  retryOf: string;
}

/**
 * Retry linkage (T031, FR-008): a retry is a NEW run id linked to the earlier
 * attempt; the earlier run is never reactivated or overwritten.
 */
export function createRetryLink(earlierRunId: string, newRunId: string): RetryLink {
  if (newRunId === earlierRunId) {
    throw new InvalidTransitionError('requested', 'requested');
  }
  return { runId: newRunId, retryOf: earlierRunId };
}
