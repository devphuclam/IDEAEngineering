// Shared CLI evidence lifecycle helpers. Every state-changing command uses
// the same read/modify/persist path so canonical Work Item evidence and the
// local mirror cannot drift merely because a command took a different route.

import {
  createEvidence,
  evidenceForRun,
  recordAction,
  recordCheckpoint,
  recordIntegrationResult,
  recordOwnerTransfer,
  recordTransition,
  recordVerification,
} from '../domain/evidence.ts';
import { transition } from '../domain/lifecycle.ts';
import type { AgentCheckpoint, RunEvidence, RunState, VerificationResult } from '../domain/types.ts';
import type { CliContext } from './context.ts';
import { command, providerPorts } from './provider-runtime.ts';
import { payloadHash } from '../domain/mutations.ts';

export async function loadEvidence(
  ctx: CliContext,
  runId: string,
  workItemId: string,
  owner: string,
): Promise<RunEvidence> {
  try {
    if (ctx.providerPorts) return await providerPorts(ctx).evidence.read(runId);
    return await ctx.evidence.read(runId);
  } catch {
    try {
      const canonical = ctx.providerPorts
        ? await providerPorts(ctx).evidence.list(workItemId)
        : await ctx.evidence.list(workItemId);
      const matching = canonical
        .filter((record) => record.runId === runId)
        .sort((a, b) => Date.parse(b.timestamps.at(-1) ?? '') - Date.parse(a.timestamps.at(-1) ?? ''))[0];
      if (matching) return matching;
    } catch {
      // The caller will receive the new local record; operational commands
      // still fail later if the canonical provider is required.
    }
    return evidenceForRun(runId, workItemId, owner);
  }
}

export async function saveEvidence(ctx: CliContext, evidence: RunEvidence): Promise<RunEvidence> {
  const clean = createEvidence(evidence);
  if (ctx.providerPorts) {
    const ports = providerPorts(ctx);
    const operationId = `evidence:${clean.runId}:${payloadHash(clean)}`;
    let current = await ports.workItems.read(clean.workItemId);
    let result = await ports.evidence.publish(command(operationId, current.revision, clean.owner, clean));
    if (result.disposition === 'conflict') {
      current = await ports.workItems.read(clean.workItemId);
      result = await ports.evidence.publish(command(operationId, current.revision, clean.owner, clean));
    }
    if (result.disposition === 'conflict') throw new Error(result.reason ?? 'provider evidence publication conflicted');
  } else {
    await ctx.evidence.persist(clean);
  }
  return clean;
}

export function transitionEvidence(
  evidence: RunEvidence,
  from: RunState,
  to: RunState,
  at = new Date().toISOString(),
): RunEvidence {
  if (from === to) return evidence;
  transition(from, to);
  return recordTransition(evidence, from, to, at);
}

export function actionEvidence(
  evidence: RunEvidence,
  action: string,
  actor: string,
  outcome: 'succeeded' | 'failed' | 'blocked' | 'unexecuted' = 'succeeded',
): RunEvidence {
  return recordAction(evidence, action, actor, outcome);
}

export function checkpointEvidence(evidence: RunEvidence, checkpoint: AgentCheckpoint): RunEvidence {
  return recordCheckpoint(
    recordVerification(evidence, checkpoint.verification),
    checkpoint.checkpointId,
  );
}

export function integrationEvidence(
  evidence: RunEvidence,
  result: 'integrated' | 'rejected' | 'pending',
  verification: VerificationResult[],
  blocker?: RunEvidence['blocker'],
): RunEvidence {
  return recordIntegrationResult(recordVerification(evidence, verification), result, blocker ?? undefined);
}

export function handoffEvidence(
  evidence: RunEvidence,
  previousOwner: string,
  replacementOwner: string,
  nextAction: string,
  unresolvedRisks: string[],
): RunEvidence {
  return recordOwnerTransfer(
    { ...evidence, nextAction, unresolvedRisks },
    previousOwner,
    replacementOwner,
  );
}
