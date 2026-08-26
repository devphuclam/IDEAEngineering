// Checkpoint domain logic (T026, FR-007): capture durable repository and
// verification state; recovery never relies on uncommitted sandbox files.

import { randomUUID } from 'node:crypto';
import type { AgentCheckpoint, RunContext, VerificationResult } from './types.ts';
import { WorkspaceError } from '../errors.ts';

export interface CheckpointInput {
  runContext: RunContext;
  commit: string;
  verification: VerificationResult[];
  unresolvedWork: string[];
  nextAction: string;
  createdAt?: string;
}

export function createCheckpoint(input: CheckpointInput): AgentCheckpoint {
  if (input.commit.length < 7) {
    throw new WorkspaceError(
      'CHECKPOINT_UNRECOVERABLE',
      'capability',
      'cannot checkpoint: no pushed commit resolved; state is not recoverable (FR-007)',
    );
  }
  return {
    checkpointId: `cp-${randomUUID()}`,
    runId: input.runContext.runId,
    branch: input.runContext.branch,
    commit: input.commit,
    verification: input.verification,
    unresolvedWork: input.unresolvedWork,
    nextAction: input.nextAction,
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

export function validateRecoverability(checkpoint: AgentCheckpoint | undefined): void {
  if (!checkpoint) {
    throw new WorkspaceError(
      'CHECKPOINT_MISSING',
      'capability',
      'no valid checkpoint exists; recovery reports the missing prerequisite instead of claiming recoverability',
    );
  }
}