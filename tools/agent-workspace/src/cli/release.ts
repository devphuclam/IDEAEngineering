// `workspace release <work-item>` (T030, FR-004): releases the claim; the
// run, branch, and evidence remain preserved.

import { assertOwner } from '../domain/handoff.ts';
import { conflictError, usageError, WorkspaceError } from '../errors.ts';
import { requireGitHubContext } from './context.ts';
import type { CliContext } from './context.ts';
import { actionEvidence, loadEvidence, saveEvidence } from './evidence.ts';
import { reportCommandError } from './output.ts';
import { command, ensureProviderOwner, operationId, providerPorts } from './provider-runtime.ts';
import type { WorkItemState } from '../domain/types.ts';

export async function release(
  ctx: CliContext,
  workItemId: string,
  requestedOperationId?: string,
): Promise<{ released: { workItemId: string; runId: string; preserved: boolean } }> {
  if (!workItemId) throw usageError('usage: workspace release <work-item>');
  requireGitHubContext(ctx);
  if (ctx.providerPorts) {
    const ports = providerPorts(ctx);
    await ensureProviderOwner(ctx);
    const current = await ports.workItems.read(workItemId);
    const active = (await ports.claims.active(workItemId)).value;
    if (!active) throw conflictError('no active claim to release');
    assertOwner(active.claimant, ctx.owner);
    const released = await ports.claims.release(command(requestedOperationId ?? operationId([], `release:${workItemId}`), current.revision, ctx.owner, { workItemId, claimToken: active.claimToken, reason: 'released by Run Owner' }));
    if (released.disposition === 'conflict') throw conflictError(released.reason ?? 'claim release conflicted');
    const providerRunState = current.value.coordination.run?.state;
    const from: WorkItemState = providerRunState === 'running'
      ? 'in-progress'
      : providerRunState === 'ready-for-integration'
        ? 'ready-for-integration'
        : 'claimed';
    const projected = await ports.workItems.projectState(command(`state:release:${workItemId}:${active.runId}`, released.revision, ctx.owner, { workItemId, from, to: 'open' }));
    if (projected.disposition === 'conflict') throw conflictError(projected.reason ?? 'release state projection conflicted');
    let evidence = await loadEvidence(ctx, active.runId, workItemId, ctx.owner);
    evidence = actionEvidence(evidence, 'release', ctx.owner);
    await saveEvidence(ctx, evidence);
    return { released: { workItemId, runId: active.runId, preserved: true } };
  }
  const claim = await ctx.claims.active(workItemId);
  if (!claim) throw conflictError('no active claim to release');
  assertOwner(claim.claimant, ctx.owner);

  await ctx.claims.release(workItemId, claim.claimToken);
  await ctx.workItems.setState(workItemId, 'open');
  let evidence = await loadEvidence(ctx, claim.runId, workItemId, ctx.owner);
  evidence = actionEvidence(evidence, 'release', ctx.owner);
  await saveEvidence(ctx, evidence);

  return {
    released: { workItemId, runId: claim.runId, preserved: true },
  };
}

export async function runReleaseCommand(ctx: CliContext, args: string[], json: boolean): Promise<number> {
  try {
    const result = await release(ctx, args[0] ?? '', operationId(args, 'release'));
    if (json) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    } else {
      const r = result.released;
      process.stdout.write(`released claim for ${r.workItemId}; run ${r.runId} preserved (${r.preserved})\n`);
    }
    return 0;
  } catch (error) {
    return reportCommandError(error, json);
  }
}
