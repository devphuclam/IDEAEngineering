// `workspace retry <work-item>` (T031/T052, FR-008): release the earlier
// attempt, create a new linked claim/run, and start from its latest durable
// checkpoint without overwriting the earlier attempt.

import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import type { ClaimRecord, ClaimState, RunContext } from '../domain/types.ts';
import { claimPath, checkpointPath, contextPath, readJson, writeJsonAtomic } from '../adapters/local/state-files.ts';
import { createRetryLink } from '../domain/lifecycle.ts';
import { sanitizeBranch } from '../adapters/local/runner.ts';
import { assertOwner } from '../domain/handoff.ts';
import { evidenceForRun } from '../domain/evidence.ts';
import { conflictError, usageError, WorkspaceError } from '../errors.ts';
import { requireGitHubContext } from './context.ts';
import type { CliContext } from './context.ts';
import { actionEvidence, saveEvidence, transitionEvidence } from './evidence.ts';
import { latestCheckpoint } from './recovery.ts';
import { reportCommandError } from './output.ts';
import { command, ensureProviderOwner, operationId, providerPorts } from './provider-runtime.ts';

export async function retry(
  ctx: CliContext,
  workItemId: string,
  requestedOperationId?: string,
): Promise<{ retry: Record<string, string> }> {
  if (!workItemId) throw usageError('usage: workspace retry <work-item>');
  requireGitHubContext(ctx);
  if (ctx.providerPorts) {
    const ports = providerPorts(ctx);
    await ensureProviderOwner(ctx);
    const snapshot = await ports.workItems.read(workItemId);
    const active = (await ports.claims.active(workItemId)).value;
    if (active) assertOwner(active.claimant, ctx.owner);
    const earlierRunId = active?.runId;
    const checkpoint = await latestCheckpoint(ctx, workItemId, earlierRunId);
    if (!checkpoint) throw new WorkspaceError('CHECKPOINT_MISSING', 'capability', 'retry requires a valid durable checkpoint; the earlier sandbox cannot be treated as recoverable');
    let expectedRevision = snapshot.revision;
    if (active) {
      const previousRun = await readJson<RunContext>(contextPath(active.runId, ctx.cwd));
      const released = await ports.claims.release(command(`retry-release:${workItemId}:${active.runId}`, expectedRevision, ctx.owner, { workItemId, claimToken: active.claimToken, reason: 'retry creates a new Run' }));
      if (released.disposition === 'conflict') throw conflictError(released.reason ?? 'earlier retry claim could not be released');
      expectedRevision = released.revision;
      const from = snapshot.value.coordination.run?.state === 'ready-for-integration'
        ? 'ready-for-integration'
        : snapshot.value.coordination.run?.state === 'running' || previousRun?.state === 'running'
          ? 'in-progress'
          : 'claimed';
      const projected = await ports.workItems.projectState(command(`state:retry-release:${workItemId}:${active.runId}`, expectedRevision, ctx.owner, { workItemId, from, to: 'open' }));
      if (projected.disposition === 'conflict') throw conflictError(projected.reason ?? 'retry release state projection conflicted');
      expectedRevision = projected.revision;
    }
    const runId = `run-${randomUUID()}`;
    const link = createRetryLink(checkpoint.runId, runId);
    const claim: ClaimRecord = { workItemId, claimToken: `claim-${randomUUID()}`, claimant: ctx.owner, runId, acquiredAt: new Date().toISOString(), leaseExpiresAt: new Date(Date.now() + 8 * 3_600_000).toISOString(), kind: 'acquire' };
    const acquired = await ports.claims.acquire(command(requestedOperationId ?? operationId([], `retry:${workItemId}`), expectedRevision, ctx.owner, claim));
    if (acquired.disposition === 'conflict') throw conflictError(acquired.reason ?? 'retry claim rejected');
    const projectedClaim = await ports.workItems.projectState(command(`state:retry-claim:${workItemId}:${runId}`, acquired.revision, ctx.owner, { workItemId, from: 'open', to: 'claimed' }));
    if (projectedClaim.disposition === 'conflict') throw conflictError(projectedClaim.reason ?? 'retry claim state projection conflicted');
    const branch = sanitizeBranch(snapshot.value.item.title, snapshot.value.item.id, runId);
    const sandboxId = await ctx.runner.create(runId, branch, checkpoint.commit, ctx.config?.azureDevOps?.integrationTarget ?? 'refs/heads/main');
    const runContext: RunContext = { runId, workItemId, owner: ctx.owner, sandboxId, branch, worktreePath: join('.worktrees', runId), changeScope: snapshot.value.changeScope, state: 'running', retryOf: link.retryOf };
    await writeJsonAtomic(contextPath(runId, ctx.cwd), runContext);
    await writeJsonAtomic(claimPath(runId, ctx.cwd), claim satisfies ClaimState);
    await writeJsonAtomic(checkpointPath(runId, checkpoint.checkpointId, ctx.cwd), { ...checkpoint, runId });
    await ctx.driver.prepare(sandboxId, runContext);
    const started = await ports.workItems.projectState(command(`state:retry-start:${workItemId}:${runId}`, projectedClaim.revision, ctx.owner, { workItemId, from: 'claimed', to: 'in-progress' }));
    if (started.disposition === 'conflict') throw conflictError(started.reason ?? 'retry start state projection conflicted');
    let evidence = evidenceForRun(runId, workItemId, ctx.owner);
    evidence = { ...evidence, retryOf: link.retryOf, checkpointRefs: [checkpoint.checkpointId] };
    evidence = transitionEvidence(evidence, 'requested', 'claimed');
    evidence = transitionEvidence(evidence, 'claimed', 'preparing');
    evidence = transitionEvidence(evidence, 'preparing', 'running');
    evidence = actionEvidence(evidence, 'retry', ctx.owner);
    await saveEvidence(ctx, evidence);
    return { retry: { runId, retryOf: link.retryOf, sandboxId, branch, worktreePath: runContext.worktreePath, owner: ctx.owner } };
  }
  const workItem = await ctx.workItems.read(workItemId);
  const active = await ctx.claims.active(workItemId);
  if (active) assertOwner(active.claimant, ctx.owner);
  const earlierRunId = active?.runId;
  const checkpoint = await latestCheckpoint(ctx, workItemId, earlierRunId);
  if (!checkpoint) {
    throw new WorkspaceError(
      'CHECKPOINT_MISSING',
      'capability',
      'retry requires a valid durable checkpoint; the earlier sandbox cannot be treated as recoverable',
    );
  }
  if (active) await ctx.claims.release(workItemId, active.claimToken);

  const runId = `run-${randomUUID()}`;
  const link = createRetryLink(checkpoint.runId, runId);
  const claim: ClaimRecord = {
    workItemId,
    claimToken: `claim-${randomUUID()}`,
    claimant: ctx.owner,
    runId,
    acquiredAt: new Date().toISOString(),
    leaseExpiresAt: new Date(Date.now() + 8 * 3_600_000).toISOString(),
    kind: 'acquire',
  };
  const acquired = await ctx.claims.acquire(claim);
  if (!acquired.winner) {
    throw conflictError(`retry claim rejected: ${acquired.reason ?? 'another claim is active'}`);
  }

  const branch = sanitizeBranch(workItem.title, workItem.id, runId);
  const sandboxId = await ctx.runner.create(runId, branch, checkpoint.commit, ctx.config?.azureDevOps?.integrationTarget ?? 'refs/heads/main');
  const runContext: RunContext = {
    runId,
    workItemId,
    owner: ctx.owner,
    sandboxId,
    branch,
    worktreePath: join('.worktrees', runId),
    changeScope: workItem.changeScope,
    state: 'running',
    retryOf: link.retryOf,
  };
  await writeJsonAtomic(contextPath(runId, ctx.cwd), runContext);
  await writeJsonAtomic(claimPath(runId, ctx.cwd), claim satisfies ClaimState);
  await writeJsonAtomic(checkpointPath(runId, checkpoint.checkpointId, ctx.cwd), { ...checkpoint, runId });
  await ctx.driver.prepare(sandboxId, runContext);
  await ctx.workItems.setState(workItemId, 'in-progress');

  let evidence = evidenceForRun(runId, workItemId, ctx.owner);
  evidence = { ...evidence, retryOf: link.retryOf, checkpointRefs: [checkpoint.checkpointId] };
  evidence = transitionEvidence(evidence, 'requested', 'claimed');
  evidence = transitionEvidence(evidence, 'claimed', 'preparing');
  evidence = transitionEvidence(evidence, 'preparing', 'running');
  evidence = actionEvidence(evidence, 'retry', ctx.owner);
  await saveEvidence(ctx, evidence);

  return {
    retry: {
      runId,
      retryOf: link.retryOf,
      sandboxId,
      branch,
      worktreePath: runContext.worktreePath,
      owner: ctx.owner,
    },
  };
}

export async function runRetryCommand(ctx: CliContext, args: string[], json: boolean): Promise<number> {
  try {
    const result = await retry(ctx, args[0] ?? '', operationId(args, 'retry'));
    if (json) process.stdout.write(`${JSON.stringify(result)}\n`);
    else {
      const r = result.retry;
      process.stdout.write(`retry ${r.runId} from ${r.retryOf} started in ${r.worktreePath} (branch ${r.branch})\n`);
    }
    return 0;
  } catch (error) {
    return reportCommandError(error, json);
  }
}
