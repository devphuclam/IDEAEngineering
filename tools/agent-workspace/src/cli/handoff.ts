// `workspace handoff <work-item> --to <identity>` (T029/T050, FR-005/FR-006).

import { contextPath, listCheckpoints, readJson, writeJsonAtomic } from '../adapters/local/state-files.ts';
import { createHandoff, assertOwner } from '../domain/handoff.ts';
import type { AgentCheckpoint, ClaimRecord, RunContext } from '../domain/types.ts';
import { conflictError, usageError, WorkspaceError } from '../errors.ts';
import { requireGitHubContext } from './context.ts';
import type { CliContext } from './context.ts';
import { actionEvidence, handoffEvidence, loadEvidence, saveEvidence } from './evidence.ts';
import { latestCheckpoint } from './recovery.ts';
import { reportCommandError } from './output.ts';
import { command, ensureProviderOwner, operationId, providerPorts } from './provider-runtime.ts';

export async function handoff(
  ctx: CliContext,
  workItemId: string,
  to: string | undefined,
  requestedOperationId?: string,
): Promise<{ handoff: Record<string, string> }> {
  if (!workItemId) throw usageError('usage: workspace handoff <work-item> --to <identity>');
  if (!to) throw usageError('usage: workspace handoff <work-item> --to <identity>');
  requireGitHubContext(ctx);
  if (ctx.providerPorts) {
    const ports = providerPorts(ctx);
    await ensureProviderOwner(ctx);
    const current = await ports.workItems.read(workItemId);
    const active = (await ports.claims.active(workItemId)).value;
    if (!active) throw conflictError('no active claim; nothing to hand off');
    assertOwner(active.claimant, ctx.owner);
    const run = await readJson<RunContext>(contextPath(active.runId, ctx.cwd));
    if (!run) throw new WorkspaceError('RUN_CONTEXT_MISSING', 'capability', 'no run context; start the run first');
    const checkpoint = (await listCheckpoints<AgentCheckpoint>(active.runId, ctx.cwd))[0] ?? await latestCheckpoint(ctx, workItemId, active.runId);
    if (!checkpoint) throw new WorkspaceError('CHECKPOINT_REQUIRED', 'capability', 'handoff requires a valid checkpoint; run `workspace checkpoint` first (FR-006)');
    const recorded = createHandoff({ previousOwner: ctx.owner, replacementOwner: to, checkpoint, unresolvedRisks: checkpoint.unresolvedWork, nextAction: checkpoint.nextAction });
    const transfer = await ports.claims.handoff(command(requestedOperationId ?? operationId([], `handoff:${workItemId}`), current.revision, ctx.owner, recorded));
    if (transfer.disposition === 'conflict') throw conflictError(transfer.reason ?? 'handoff rejected: claim changed before transfer');
    await writeJsonAtomic(contextPath(run.runId, ctx.cwd), { ...run, owner: to });
    let evidence = await loadEvidence(ctx, run.runId, workItemId, ctx.owner);
    evidence = handoffEvidence(evidence, recorded.previousOwner, recorded.replacementOwner, recorded.nextAction, recorded.unresolvedRisks);
    evidence = actionEvidence(evidence, 'handoff', ctx.owner);
    await saveEvidence(ctx, evidence);
    return { handoff: { previousOwner: recorded.previousOwner, replacementOwner: recorded.replacementOwner, checkpoint: recorded.checkpoint.checkpointId, nextAction: recorded.nextAction } };
  }
  const claim = await ctx.claims.active(workItemId);
  if (!claim) throw conflictError('no active claim; nothing to hand off');
  assertOwner(claim.claimant, ctx.owner);

  const run = await readJson<RunContext>(contextPath(claim.runId, ctx.cwd));
  if (!run) throw new WorkspaceError('RUN_CONTEXT_MISSING', 'capability', 'no run context; start the run first');
  const checkpoint =
    (await listCheckpoints<AgentCheckpoint>(claim.runId, ctx.cwd))[0] ??
    (await latestCheckpoint(ctx, workItemId, claim.runId));
  if (!checkpoint) {
    throw new WorkspaceError(
      'CHECKPOINT_REQUIRED',
      'capability',
      'handoff requires a valid checkpoint; run `workspace checkpoint` first (FR-006)',
    );
  }

  const recorded = createHandoff({
    previousOwner: ctx.owner,
    replacementOwner: to,
    checkpoint,
    unresolvedRisks: checkpoint.unresolvedWork,
    nextAction: checkpoint.nextAction,
  });

  // The durable handoff record is written before the authoritative claim
  // transfer, matching FR-006 even if the provider rejects the transfer.
  await ctx.gh.run([
    'issue',
    'comment',
    workItemId,
    '--body',
    `<!-- handoff -->\n\`\`\`json\n${JSON.stringify(recorded)}\n\`\`\`\n<!-- /handoff -->`,
    '-R',
    ctx.repo,
  ]);

  const transfer: ClaimRecord = {
    ...claim,
    claimant: to,
    kind: 'handoff',
    previousOwner: claim.claimant,
  };
  const transferred = await ctx.claims.handoff(transfer);
  if (!transferred.winner) {
    throw conflictError(`handoff rejected: ${transferred.reason ?? 'claim changed before transfer'}`);
  }

  const updatedRun = { ...run, owner: to };
  await writeJsonAtomic(contextPath(run.runId, ctx.cwd), updatedRun);
  let evidence = await loadEvidence(ctx, run.runId, workItemId, ctx.owner);
  evidence = handoffEvidence(
    evidence,
    recorded.previousOwner,
    recorded.replacementOwner,
    recorded.nextAction,
    recorded.unresolvedRisks,
  );
  evidence = actionEvidence(evidence, 'handoff', ctx.owner);
  await saveEvidence(ctx, evidence);

  return {
    handoff: {
      previousOwner: recorded.previousOwner,
      replacementOwner: recorded.replacementOwner,
      checkpoint: recorded.checkpoint.checkpointId,
      nextAction: recorded.nextAction,
    },
  };
}

export async function runHandoffCommand(ctx: CliContext, args: string[], json: boolean): Promise<number> {
  try {
    const toIndex = args.indexOf('--to');
    const to = toIndex >= 0 ? args[toIndex + 1] : undefined;
    const result = await handoff(ctx, args[0] ?? '', to, operationId(args, 'handoff'));
    if (json) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    } else {
      const h = result.handoff;
      process.stdout.write(`handoff ${h.previousOwner} -> ${h.replacementOwner} at checkpoint ${h.checkpoint}; next: ${h.nextAction}\n`);
    }
    return 0;
  } catch (error) {
    return reportCommandError(error, json);
  }
}
