// `workspace start <work-item>` (T021/T051/T052, FR-003/FR-007/FR-009).

import { join } from 'node:path';
import type { ClaimState, RunContext, RunState } from '../domain/types.ts';
import { claimPath, contextPath, readJson, writeJsonAtomic } from '../adapters/local/state-files.ts';
import { sanitizeBranch } from '../adapters/local/runner.ts';
import { conflictError, usageError, WorkspaceError } from '../errors.ts';
import { latestCheckpoint } from './recovery.ts';
import { requireGitHubContext } from './context.ts';
import type { CliContext } from './context.ts';
import { actionEvidence, loadEvidence, saveEvidence, transitionEvidence } from './evidence.ts';
import { reportCommandError } from './output.ts';
import { command, ensureProviderOwner, operationId, providerPorts } from './provider-runtime.ts';

function lastState(runState: RunContext['state'] | undefined): RunState {
  return runState ?? 'claimed';
}

export async function start(
  ctx: CliContext,
  workItemId: string,
  requestedOperationId?: string,
): Promise<{ run: Record<string, string> }> {
  if (!workItemId) throw usageError('usage: workspace start <work-item>');
  requireGitHubContext(ctx);
  if (ctx.providerPorts) {
    const ports = providerPorts(ctx);
    await ensureProviderOwner(ctx);
    const active = (await ports.claims.active(workItemId)).value;
    if (!active) throw conflictError('no active claim for this work item; run `workspace claim <work-item>` first');
    if (active.claimant !== ctx.owner) throw conflictError(`claim belongs to ${active.claimant}; only the Run Owner can start the run (FR-005)`);
    const snapshot = await ports.workItems.read(workItemId);
    if (snapshot.value.changeScope.paths.length === 0 && snapshot.value.changeScope.semanticSeams.length === 0) {
      throw new WorkspaceError('NO_CHANGE_SCOPE', 'usage', 'work item has no declared Change Scope (FR-009)');
    }
    const runId = active.runId;
    const existing = await readJson<RunContext>(contextPath(runId, ctx.cwd));
    const checkpoint = await latestCheckpoint(ctx, workItemId, runId);
    const branch = existing?.branch ?? checkpoint?.branch ?? sanitizeBranch(snapshot.value.item.title, snapshot.value.item.id, runId);
    const sandboxId = await ctx.runner.create(runId, branch, checkpoint?.commit, ctx.config?.azureDevOps?.integrationTarget ?? 'refs/heads/main');
    const worktreePath = existing?.worktreePath ?? join('.worktrees', runId);
    const runContext: RunContext = { runId, workItemId, owner: ctx.owner, sandboxId, branch, worktreePath, changeScope: snapshot.value.changeScope, state: 'running', retryOf: existing?.retryOf };
    await writeJsonAtomic(contextPath(runId, ctx.cwd), runContext);
    await writeJsonAtomic(claimPath(runId, ctx.cwd), active satisfies ClaimState);
    await ctx.driver.prepare(sandboxId, runContext);
    const projected = await ports.workItems.projectState(command(requestedOperationId ?? operationId([], `start:${workItemId}`), snapshot.revision, ctx.owner, { workItemId, from: 'claimed', to: 'in-progress' }));
    if (projected.disposition === 'conflict') throw conflictError(projected.reason ?? 'start state projection conflicted');
    let evidence = await loadEvidence(ctx, runId, workItemId, ctx.owner);
    const current = evidence.stateTransitions.at(-1)?.to ?? 'claimed';
    if (current === 'claimed') evidence = transitionEvidence(evidence, 'claimed', 'preparing');
    const afterPreparing = evidence.stateTransitions.at(-1)?.to ?? current;
    if (afterPreparing === 'preparing') evidence = transitionEvidence(evidence, 'preparing', 'running');
    if (checkpoint) evidence = { ...evidence, checkpointRefs: [...new Set([...evidence.checkpointRefs, checkpoint.checkpointId])] };
    evidence = actionEvidence(evidence, 'start', ctx.owner);
    await saveEvidence(ctx, evidence);
    return { run: { runId, sandboxId, branch, worktreePath, owner: ctx.owner, next: ctx.driver.instruction(runContext) } };
  }
  const claim = await ctx.claims.active(workItemId);
  if (!claim) {
    throw conflictError('no active claim for this work item; run `workspace claim <work-item>` first');
  }
  if (claim.claimant !== ctx.owner) {
    throw conflictError(`claim belongs to ${claim.claimant}; only the Run Owner can start the run (FR-005)`);
  }
  const workItem = await ctx.workItems.read(workItemId);
  if (workItem.changeScope.paths.length === 0 && workItem.changeScope.semanticSeams.length === 0) {
    throw new WorkspaceError('NO_CHANGE_SCOPE', 'usage', 'work item has no declared Change Scope (FR-009)');
  }

  const runId = claim.runId;
  const existing = await readJson<RunContext>(contextPath(runId, ctx.cwd));
  const checkpoint = await latestCheckpoint(ctx, workItemId, runId);
  const branch = existing?.branch ?? checkpoint?.branch ?? sanitizeBranch(workItem.title, workItem.id, runId);
  const sandboxId = await ctx.runner.create(runId, branch, checkpoint?.commit, ctx.config?.azureDevOps?.integrationTarget ?? 'refs/heads/main');
  const worktreePath = existing?.worktreePath ?? join('.worktrees', runId);
  const runContext: RunContext = {
    runId,
    workItemId,
    owner: ctx.owner,
    sandboxId,
    branch,
    worktreePath,
    changeScope: workItem.changeScope,
    state: 'running',
    retryOf: existing?.retryOf,
  };

  await writeJsonAtomic(contextPath(runId, ctx.cwd), runContext);
  await writeJsonAtomic(claimPath(runId, ctx.cwd), claim satisfies ClaimState);
  await ctx.driver.prepare(sandboxId, runContext);
  await ctx.workItems.setState(workItemId, 'in-progress');

  let evidence = await loadEvidence(ctx, runId, workItemId, ctx.owner);
  const current = evidence.stateTransitions.at(-1)?.to ?? lastState(existing?.state);
  if (current === 'requested') evidence = transitionEvidence(evidence, 'requested', 'claimed');
  if (current === 'ready-for-integration') evidence = transitionEvidence(evidence, 'ready-for-integration', 'running');
  const afterClaim = evidence.stateTransitions.at(-1)?.to ?? current;
  if (afterClaim === 'claimed') evidence = transitionEvidence(evidence, 'claimed', 'preparing');
  const afterPreparing = evidence.stateTransitions.at(-1)?.to ?? afterClaim;
  if (afterPreparing === 'preparing') evidence = transitionEvidence(evidence, 'preparing', 'running');
  if (checkpoint) {
    evidence = { ...evidence, checkpointRefs: [...new Set([...evidence.checkpointRefs, checkpoint.checkpointId])] };
  }
  evidence = actionEvidence(evidence, 'start', ctx.owner);
  await saveEvidence(ctx, evidence);

  return {
    run: {
      runId,
      sandboxId,
      branch,
      worktreePath,
      owner: ctx.owner,
      next: ctx.driver.instruction(runContext),
    },
  };
}

export async function runStartCommand(ctx: CliContext, args: string[], json: boolean): Promise<number> {
  try {
    const result = await start(ctx, args[0] ?? '', operationId(args, 'start'));
    if (json) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    } else {
      const r = result.run;
      process.stdout.write(`run ${r.runId} started in ${r.worktreePath} (branch ${r.branch})\n${r.next}\n`);
    }
    return 0;
  } catch (error) {
    return reportCommandError(error, json);
  }
}
