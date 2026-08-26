// Run evidence recording (T041, FR-013): attributable records of state
// transitions, checkpoints, verification outcomes, integration results, and
// blockers. Never misreports blocked/unexecuted as passed (FR-014).

import type {
  BlockerClassification,
  CheckpointId,
  RunEvidence,
  RunId,
  RunState,
  VerificationResult,
} from './types.ts';
import { redactEvidence, withDefaultRetention } from './redaction.ts';

export function createEvidence(evidence: RunEvidence): RunEvidence {
  // The CheckOutcome union (passed | failed | blocked | unexecuted) makes it
  // impossible to represent a blocked/unexecuted check as passed (FR-014);
  // redaction happens before persistence (FR-015).
  return redactEvidence(withDefaultRetention(evidence));
}

export function recordTransition(
  evidence: RunEvidence,
  from: RunState,
  to: RunState,
  at: string,
): RunEvidence {
  return {
    ...evidence,
    timestamps: [...evidence.timestamps, at],
    stateTransitions: [...evidence.stateTransitions, { from, to, at }],
  };
}

export function recordVerification(
  evidence: RunEvidence,
  verification: VerificationResult[],
): RunEvidence {
  return { ...evidence, verification };
}

export function recordCheckpoint(evidence: RunEvidence, checkpointId: CheckpointId): RunEvidence {
  return { ...evidence, checkpointRefs: [...evidence.checkpointRefs, checkpointId] };
}

export function recordIntegrationResult(
  evidence: RunEvidence,
  result: 'integrated' | 'rejected' | 'pending',
  blocker?: BlockerClassification,
): RunEvidence {
  return { ...evidence, integrationResult: result, blocker: blocker ?? null };
}

export function recordOwnerTransfer(
  evidence: RunEvidence,
  previousOwner: string,
  replacementOwner: string,
  at = new Date().toISOString(),
): RunEvidence {
  return {
    ...evidence,
    owner: replacementOwner,
    ownerHistory: [
      ...(evidence.ownerHistory ?? []),
      { from: previousOwner, to: replacementOwner, at },
    ],
    timestamps: [...evidence.timestamps, at],
  };
}

export function recordAction(
  evidence: RunEvidence,
  action: string,
  actor: string,
  outcome: 'succeeded' | 'failed' | 'blocked' | 'unexecuted',
  at = new Date().toISOString(),
): RunEvidence {
  return {
    ...evidence,
    timestamps: [...evidence.timestamps, at],
    actions: [...(evidence.actions ?? []), { action, actor, at, outcome }],
  };
}

export function evidenceForRun(
  runId: RunId,
  workItemId: string,
  owner: string,
): RunEvidence {
  const now = new Date().toISOString();
  return {
    runId,
    workItemId,
    owner,
    timestamps: [now],
    stateTransitions: [{ from: 'requested', to: 'requested', at: now }],
    checkpointRefs: [],
    verification: [],
    integrationResult: 'pending',
    blocker: null,
    retention: {
      days: 30,
      expiresAt: new Date(Date.now() + 30 * 86_400_000).toISOString(),
    },
    actions: [],
  };
}
