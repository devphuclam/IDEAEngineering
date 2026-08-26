// `workspace checkpoint <work-item>` (T028/T051, FR-007/FR-013/FR-004):
// resolve and push the assigned sandbox commit before recording recovery state.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { contextPath, checkpointPath, listCheckpoints, readJson, writeJsonAtomic } from '../adapters/local/state-files.ts';
import { createCheckpoint } from '../domain/checkpoint.ts';
import type { AgentCheckpoint, RunContext } from '../domain/types.ts';
import { assertOwner } from '../domain/handoff.ts';
import { conflictError, usageError, WorkspaceError } from '../errors.ts';
import { requireGitHubContext } from './context.ts';
import type { CliContext } from './context.ts';
import { actionEvidence, checkpointEvidence, loadEvidence, saveEvidence, transitionEvidence } from './evidence.ts';
import { worktreeAbsolutePath } from './recovery.ts';
import { reportCommandError } from './output.ts';
import { command, ensureProviderOwner, operationId, providerPorts } from './provider-runtime.ts';

const execFileAsync = promisify(execFile);

export async function resolveCommit(cwd: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' });
    const commit = stdout.trim();
    if (!/^[0-9a-f]{7,64}$/i.test(commit)) throw new Error('git returned an invalid commit id');
    return commit;
  } catch (error) {
    throw new WorkspaceError(
      'CHECKPOINT_UNRECOVERABLE',
      'capability',
      `cannot resolve a commit in the assigned sandbox; checkpoint requires a pushed branch (FR-007): ${(error as Error).message}`,
    );
  }
}

export async function checkpoint(
  ctx: CliContext,
  workItemId: string,
  unresolvedWork: string[],
  nextAction: string,
  requestedOperationId?: string,
): Promise<{ checkpoint: Record<string, string> }> {
  if (!workItemId) throw usageError('usage: workspace checkpoint <work-item>');
  requireGitHubContext(ctx);
  if (ctx.providerPorts) {
    const ports = providerPorts(ctx);
    await ensureProviderOwner(ctx);
    const active = (await ports.claims.active(workItemId)).value;
    if (!active) throw conflictError('no active claim; nothing to checkpoint');
    assertOwner(active.claimant, ctx.owner);
    const run = await readJson<RunContext>(contextPath(active.runId, ctx.cwd));
    if (!run) throw new WorkspaceError('RUN_CONTEXT_MISSING', 'capability', 'no run context; run `workspace start` before checkpointing');
    const workingDirectory = worktreeAbsolutePath(ctx, run.worktreePath);
    const commit = await resolveCommit(workingDirectory);
    const previous = (await listCheckpoints<AgentCheckpoint>(run.runId, ctx.cwd)).find((entry) => entry.commit === commit && entry.nextAction === nextAction);
    const created = previous ?? createCheckpoint({ runContext: run, commit, verification: [{ command: 'git rev-parse HEAD', outcome: 'passed', evidenceRef: commit }], unresolvedWork, nextAction });
    await ports.sourceHost.pushCheckpoint(created, run.worktreePath);
    if (ports.sourceHost.remoteCommit && !(await ports.sourceHost.remoteCommit(created))) throw new WorkspaceError('CHECKPOINT_REMOTE_UNCONFIRMED', 'network', `source host did not confirm pushed commit ${created.commit} on ${created.branch}`);
    if (ports.sourceHost.recordCheckpoint) await ports.sourceHost.recordCheckpoint(workItemId, created);
    await writeJsonAtomic(checkpointPath(run.runId, created.checkpointId, ctx.cwd), created);
    const current = await ports.workItems.read(workItemId);
    const renewed = await ports.claims.renew(command(requestedOperationId ?? operationId([], `checkpoint:${workItemId}`), current.revision, ctx.owner, { ...active, kind: 'renew', leaseExpiresAt: new Date(Date.now() + 8 * 3_600_000).toISOString() }));
    if (renewed.disposition === 'conflict') throw conflictError(renewed.reason ?? 'checkpoint lease renewal rejected');
    const projected = await ports.workItems.projectState(command(`state:checkpoint:${workItemId}:${created.checkpointId}`, renewed.revision, ctx.owner, { workItemId, from: 'in-progress', to: 'ready-for-integration' }));
    if (projected.disposition === 'conflict') throw conflictError(projected.reason ?? 'checkpoint state projection conflicted');
    let evidence = await loadEvidence(ctx, run.runId, workItemId, ctx.owner);
    const currentState = evidence.stateTransitions.at(-1)?.to ?? run.state ?? 'running';
    if (currentState === 'running') evidence = transitionEvidence(evidence, 'running', 'verifying');
    evidence = checkpointEvidence(evidence, created);
    evidence = { ...evidence, nextAction, unresolvedRisks: unresolvedWork };
    if ((evidence.stateTransitions.at(-1)?.to ?? currentState) === 'verifying') evidence = transitionEvidence(evidence, 'verifying', 'ready-for-integration');
    evidence = actionEvidence(evidence, 'checkpoint', ctx.owner);
    await saveEvidence(ctx, evidence);
    return { checkpoint: { checkpointId: created.checkpointId, runId: created.runId, branch: created.branch, commit: created.commit, createdAt: created.createdAt } };
  }
  const claim = await ctx.claims.active(workItemId);
  if (!claim) throw conflictError('no active claim; nothing to checkpoint');
  assertOwner(claim.claimant, ctx.owner);

  const run = await readJson<RunContext>(contextPath(claim.runId, ctx.cwd));
  if (!run) {
    throw new WorkspaceError(
      'RUN_CONTEXT_MISSING',
      'capability',
      'no run context; run `workspace start` before checkpointing',
    );
  }
  const workingDirectory = worktreeAbsolutePath(ctx, run.worktreePath);
  const commit = await resolveCommit(workingDirectory);
  const previous = (await listCheckpoints<AgentCheckpoint>(run.runId, ctx.cwd)).find(
    (entry) => entry.commit === commit && entry.nextAction === nextAction,
  );
  const created = previous ?? createCheckpoint({
    runContext: run,
    commit,
    verification: [{ command: 'git rev-parse HEAD', outcome: 'passed', evidenceRef: commit }],
    unresolvedWork,
    nextAction,
  });

  await ctx.sourceHost.pushCheckpoint(created, run.worktreePath);
  if (ctx.sourceHost.remoteCommit && !(await ctx.sourceHost.remoteCommit(created))) {
    throw new WorkspaceError(
      'CHECKPOINT_REMOTE_UNCONFIRMED',
      'network',
      `source host did not confirm pushed commit ${created.commit} on ${created.branch}`,
    );
  }
  if (ctx.sourceHost.recordCheckpoint) await ctx.sourceHost.recordCheckpoint(workItemId, created);
  await writeJsonAtomic(checkpointPath(run.runId, created.checkpointId, ctx.cwd), created);

  const renewal = {
    ...claim,
    kind: 'renew' as const,
    leaseExpiresAt: new Date(Date.now() + 8 * 3_600_000).toISOString(),
  };
  const renewed = await ctx.claims.renew(renewal);
  if (!renewed.winner) {
    throw conflictError(`checkpoint created but lease renewal rejected: ${renewed.reason ?? 'unknown'}`);
  }

  let evidence = await loadEvidence(ctx, run.runId, workItemId, ctx.owner);
  const current = evidence.stateTransitions.at(-1)?.to ?? run.state ?? 'running';
  if (current === 'running') evidence = transitionEvidence(evidence, 'running', 'verifying');
  evidence = checkpointEvidence(evidence, created);
  evidence = {
    ...evidence,
    nextAction,
    unresolvedRisks: unresolvedWork,
  };
  const afterVerification = evidence.stateTransitions.at(-1)?.to ?? current;
  if (afterVerification === 'verifying') {
    evidence = transitionEvidence(evidence, 'verifying', 'ready-for-integration');
  }
  evidence = actionEvidence(evidence, 'checkpoint', ctx.owner);
  await saveEvidence(ctx, evidence);
  await ctx.workItems.setState(workItemId, 'ready-for-integration');
  return {
    checkpoint: {
      checkpointId: created.checkpointId,
      runId: created.runId,
      branch: created.branch,
      commit: created.commit,
      createdAt: created.createdAt,
    },
  };
}

export async function runCheckpointCommand(ctx: CliContext, args: string[], json: boolean): Promise<number> {
  try {
    const result = await checkpoint(ctx, args[0] ?? '', [], 'push checkpoint and request integration', operationId(args, 'checkpoint'));
    if (json) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    } else {
      const c = result.checkpoint;
      process.stdout.write(`checkpoint ${c.checkpointId} for run ${c.runId} on ${c.branch} at ${c.commit} (${c.createdAt})\n`);
    }
    return 0;
  } catch (error) {
    return reportCommandError(error, json);
  }
}
