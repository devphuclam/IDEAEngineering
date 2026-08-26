// Handoff domain logic (T027, FR-005/FR-006): durable single-owner transfer.

import type { AgentCheckpoint, HandoffRecord } from './types.ts';
import { conflictError } from '../errors.ts';

export interface HandoffInput {
  previousOwner: string;
  replacementOwner: string;
  checkpoint: AgentCheckpoint;
  unresolvedRisks: string[];
  nextAction: string;
  recordedAt?: string;
}

export function createHandoff(input: HandoffInput): HandoffRecord {
  if (!input.replacementOwner || input.replacementOwner === input.previousOwner) {
    throw conflictError('handoff requires a different named replacement owner (--to <identity>)');
  }
  return {
    previousOwner: input.previousOwner,
    replacementOwner: input.replacementOwner,
    checkpoint: input.checkpoint,
    unresolvedRisks: input.unresolvedRisks,
    nextAction: input.nextAction,
    recordedAt: input.recordedAt ?? new Date().toISOString(),
  };
}

/**
 * Rejection rule: a non-owner sending a control instruction is rejected and
 * the active owner remains unchanged.
 */
export function assertOwner(activeOwner: string, actor: string): void {
  if (activeOwner !== actor) {
    throw conflictError(
      `control instruction rejected: ${actor} is not the active Run Owner (${activeOwner}); the owner remains unchanged (FR-005)`,
    );
  }
}