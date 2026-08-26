// `workspace integrate <work-item>` (T037/T053/T054, FR-010/FR-012/FR-020/FR-022).
// Candidate discovery, overlap decisions, PR integration, and queue state are
// explicit; an empty in-memory candidate list is never treated as success.

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { contextPath, integrationQueuePath, readJson, writeJsonAtomic } from '../adapters/local/state-files.ts';
import { IntegrationQueue, type QueuedCandidate } from '../domain/queue.ts';
import { IntegrationCoordinator } from '../domain/integration.ts';
import { classifyOverlap } from '../domain/overlap.ts';
import type { AgentCheckpoint, ChangeScope, RunContext, VerificationResult, WorkItem } from '../domain/types.ts';
import { redactText } from '../domain/redaction.ts';
import { conflictError, usageError, WorkspaceError } from '../errors.ts';
import { requireGitHubContext } from './context.ts';
import type { CliContext } from './context.ts';
import { integrationEvidence, actionEvidence, loadEvidence, saveEvidence, transitionEvidence } from './evidence.ts';
import { latestCheckpoint } from './recovery.ts';
import { reportCommandError } from './output.ts';
import { command, ensureProviderOwner, providerPorts, targetFor } from './provider-runtime.ts';

const execAsync = promisify(exec);

interface Candidate {
  workItemId: string;
  runId: string;
  checkpoint: AgentCheckpoint;
  dependencies: string[];
  scope: ChangeScope;
}

interface QueueState {
  candidates: QueuedCandidate[];
  incorporatedWorkItems: string[];
  pullRequests: Record<string, string>;
  semanticDecisions: Record<string, { decision: 'approved-dependency' | 'approved-serialized' | 'human'; decidedBy: string; decidedAt: string }>;
}

async function runVerification(cwd: string, command: string): Promise<VerificationResult> {
  if (!command.trim()) return { command, outcome: 'unexecuted', evidenceRef: 'empty verification command' };
  try {
    await execAsync(command, { cwd, windowsHide: true, maxBuffer: 4 * 1024 * 1024 });
    return { command, outcome: 'passed' };
  } catch (error) {
    const e = error as { stdout?: string; stderr?: string; code?: string | number };
    const detail = redactText((e.stderr ?? e.stdout ?? `verification exited with ${e.code ?? 'unknown'}`).slice(0, 500));
    return { command, outcome: 'failed', evidenceRef: detail };
  }
}

async function discoverCandidates(ctx: CliContext, current: Candidate): Promise<Candidate[]> {
  if (!ctx.workItems.listOpen || !ctx.sourceHost.readCheckpoints) return [current];
  const workItems = await ctx.workItems.listOpen();
  const candidates: Candidate[] = [];
  for (const item of workItems) {
    // The current Work Item is added below using its active run. Its Issue
    // history may still expose a checkpoint from an earlier retry, which
    // must not be compared with the replacement run as a separate candidate.
    if (item.id === current.workItemId) continue;
    const checkpoints = await ctx.sourceHost.readCheckpoints(item.id);
    const checkpoint = checkpoints[0];
    if (!checkpoint) continue;
    candidates.push({
      workItemId: item.id,
      runId: checkpoint.runId,
      checkpoint,
      dependencies: item.dependencies,
      scope: item.changeScope,
    });
  }
  // The requested candidate gets the first queue position. Other checkpointed
  // Work Items remain visible for overlap/dependency checks and can proceed on
  // later integration calls.
  return [current, ...candidates];
}

function queueStateFrom(value: QueueState | undefined): QueueState {
  return {
    candidates: value?.candidates ?? [],
    incorporatedWorkItems: value?.incorporatedWorkItems ?? [],
    pullRequests: value?.pullRequests ?? {},
    semanticDecisions: value?.semanticDecisions ?? {},
  };
}

function decisionKey(left: string, right: string): string {
  return [left, right].sort().join('::');
}

export async function integrate(
  ctx: CliContext,
  workItemId: string,
  options: { approveSemantic?: string; decidedBy?: string } = {},
): Promise<{ integration: Record<string, unknown> }> {
  if (!workItemId) throw usageError('usage: workspace integrate <work-item>');
  requireGitHubContext(ctx);
  if (ctx.providerPorts) return integrateProvider(ctx, workItemId);

  const claim = await ctx.claims.active(workItemId);
  if (!claim) throw conflictError('no active claim; integrate requires a checkpointed run');
  if (claim.claimant !== ctx.owner) throw conflictError(`only the Run Owner ${claim.claimant} may integrate this run`);
  const run = await readJson<RunContext>(contextPath(claim.runId, ctx.cwd));
  if (!run) throw new WorkspaceError('RUN_CONTEXT_MISSING', 'capability', 'no run context; start the run first');
  const checkpoint = await latestCheckpoint(ctx, workItemId, claim.runId);
  if (!checkpoint) {
    throw new WorkspaceError('CHECKPOINT_REQUIRED', 'capability', 'integrate requires a valid durable checkpoint; run `workspace checkpoint` first');
  }
  const workItem = await ctx.workItems.read(workItemId);
  const current: Candidate = {
    workItemId,
    runId: checkpoint.runId,
    checkpoint,
    dependencies: workItem.dependencies,
    scope: workItem.changeScope,
  };
  const candidates = await discoverCandidates(ctx, current);

  const queue = new IntegrationQueue();
  const state = queueStateFrom(await readJson<QueueState>(integrationQueuePath(ctx.cwd)));
  queue.restore(state.candidates);
  for (const candidate of candidates) {
    queue.enqueue(candidate.runId, candidate.checkpoint, candidate.dependencies, candidate.workItemId);
  }

  for (const other of candidates) {
    if (other.runId === current.runId) continue;
    const key = decisionKey(current.runId, other.runId);
    if (options.approveSemantic === other.runId) {
      if (!options.decidedBy || options.decidedBy !== ctx.owner) {
        throw usageError('semantic approval requires --by matching the authenticated Run Owner');
      }
      state.semanticDecisions[key] = {
        decision: 'approved-serialized',
        decidedBy: options.decidedBy,
        decidedAt: new Date().toISOString(),
      };
    }
    const explicitDecision = state.semanticDecisions[key];
    const dependencyRecorded =
      current.dependencies.includes(other.workItemId) ||
      other.dependencies.includes(current.workItemId) ||
      Boolean(explicitDecision);
    const overlap = classifyOverlap(current.scope, other.scope, dependencyRecorded);
    if (overlap.kind === 'semantic') {
      await writeJsonAtomic(integrationQueuePath(ctx.cwd), {
        ...state,
        candidates: queue.snapshot(),
      } satisfies QueueState);
      let evidence = await loadEvidence(ctx, run.runId, workItemId, ctx.owner);
      evidence = integrationEvidence(evidence, 'rejected', [], 'conflict');
      evidence = actionEvidence(evidence, 'integrate', ctx.owner, 'blocked');
      await saveEvidence(ctx, evidence);
      throw conflictError(
        `semantic overlap with Work Item ${other.workItemId} / run ${other.runId}; record an explicit dependency or serialized decision before integration (FR-010/FR-012)`,
      );
    }
    if (overlap.kind === 'path') {
      process.stderr.write(`warning: path overlap with run ${other.runId} (${overlap.overlappingPaths.join(', ')})\n`);
    }
  }

  const position = queue.queuePositions().find((entry) => entry.runId === current.runId);
  const next = queue.nextIncorporable(state.incorporatedWorkItems);
  if (!next || next.runId !== current.runId) {
    await writeJsonAtomic(integrationQueuePath(ctx.cwd), {
      ...state,
      candidates: queue.snapshot(),
    } satisfies QueueState);
    return {
      integration: {
        queuePosition: position?.position ?? 0,
        state: 'queued',
        verification: [],
      },
    };
  }

  const requiredChecks = await ctx.sourceHost.requiredChecks(run.changeScope.integrationTarget);
  if (requiredChecks.length === 0) {
    throw new WorkspaceError(
      'REQUIRED_CHECKS_MISSING',
      'capability',
      `integration target ${run.changeScope.integrationTarget} has no configured required checks; refusing unverified integration`,
    );
  }
  const beforeMerge: VerificationResult[] = [];
  for (const command of requiredChecks) beforeMerge.push(await runVerification(ctx.cwd, command));
  if (beforeMerge.some((check) => check.outcome !== 'passed')) {
    await writeJsonAtomic(integrationQueuePath(ctx.cwd), { ...state, candidates: queue.snapshot() } satisfies QueueState);
    let evidence = await loadEvidence(ctx, run.runId, workItemId, ctx.owner);
    evidence = integrationEvidence(evidence, 'rejected', beforeMerge);
    evidence = actionEvidence(evidence, 'integrate', ctx.owner, 'blocked');
    await saveEvidence(ctx, evidence);
    return { integration: { queuePosition: position?.position ?? 1, state: 'rejected', verification: beforeMerge } };
  }

  const pullRequestUrl = state.pullRequests[current.runId] ??
    await ctx.sourceHost.openPullRequest(workItemId, checkpoint.branch, run.changeScope.integrationTarget);
  state.pullRequests[current.runId] = pullRequestUrl;
  if (!ctx.sourceHost.mergePullRequest) {
    await writeJsonAtomic(integrationQueuePath(ctx.cwd), { ...state, candidates: queue.snapshot() } satisfies QueueState);
    return {
      integration: { queuePosition: position?.position ?? 1, state: 'queued', verification: beforeMerge, pullRequestUrl },
    };
  }
  await ctx.sourceHost.mergePullRequest(checkpoint.branch, run.changeScope.integrationTarget);

  const afterMerge: VerificationResult[] = [];
  for (const command of requiredChecks) afterMerge.push(await runVerification(ctx.cwd, command));
  const result = queue.incorporateNext(afterMerge, state.incorporatedWorkItems, (runId) =>
    candidates.find((candidate) => candidate.runId === runId)?.workItemId,
  );
  if (result.state !== 'incorporated') {
    await writeJsonAtomic(integrationQueuePath(ctx.cwd), { ...state, candidates: queue.snapshot() } satisfies QueueState);
    let evidence = await loadEvidence(ctx, run.runId, workItemId, ctx.owner);
    evidence = integrationEvidence(evidence, 'rejected', afterMerge);
    evidence = actionEvidence(evidence, 'integrate', ctx.owner, 'failed');
    await saveEvidence(ctx, evidence);
    return { integration: { queuePosition: position?.position ?? 1, state: result.state, verification: afterMerge, pullRequestUrl } };
  }

  state.candidates = queue.snapshot();
  state.incorporatedWorkItems = [...new Set([...state.incorporatedWorkItems, workItemId])];
  await writeJsonAtomic(integrationQueuePath(ctx.cwd), state);
  let evidence = await loadEvidence(ctx, run.runId, workItemId, ctx.owner);
  evidence = integrationEvidence(evidence, 'integrated', afterMerge);
  const currentState = evidence.stateTransitions.at(-1)?.to ?? 'ready-for-integration';
  if (currentState === 'ready-for-integration') evidence = transitionEvidence(evidence, 'ready-for-integration', 'integrated');
  evidence = actionEvidence(evidence, 'integrate', ctx.owner);
  await saveEvidence(ctx, evidence);
  await ctx.workItems.setState(workItemId, 'integrated');
  await ctx.claims.release(workItemId, claim.claimToken);

  return {
    integration: {
      queuePosition: position?.position ?? 1,
      state: result.state,
      verification: afterMerge,
      pullRequestUrl,
    },
  };
}

async function integrateProvider(ctx: CliContext, workItemId: string): Promise<{ integration: Record<string, unknown> }> {
  const ports = providerPorts(ctx);
  await ensureProviderOwner(ctx);
  const claim = (await ports.claims.active(workItemId)).value;
  if (!claim) throw conflictError('no active claim; integrate requires a checkpointed run');
  if (claim.claimant !== ctx.owner) throw conflictError(`only the Run Owner ${claim.claimant} may integrate this run`);
  const run = await readJson<RunContext>(contextPath(claim.runId, ctx.cwd));
  if (!run) throw new WorkspaceError('RUN_CONTEXT_MISSING', 'capability', 'no run context; start the run first');
  const checkpoint = await latestCheckpoint(ctx, workItemId, claim.runId);
  if (!checkpoint) throw new WorkspaceError('CHECKPOINT_REQUIRED', 'capability', 'integrate requires a valid durable checkpoint; run `workspace checkpoint` first');
  const item = await ports.workItems.read(workItemId);
  const coordinator = new IntegrationCoordinator({
    queue: ports.queue,
    sourceHost: ports.sourceHost,
    policies: ports.policies,
    verification: ports.verification,
    evidence: ports.evidence,
  });
  const target = targetFor(ctx);
  // GitHub creates its coordination Issue on the first normal enqueue. A
  // provider-neutral coordinator starts with a read, so seed that first
  // candidate through the canonical queue mutation when no Issue exists.
  if (ctx.provider === 'github') {
    try {
      await ports.queue.read(target);
    } catch (error) {
      if (!(error instanceof Error) || !/does not exist/i.test(error.message)) throw error;
      const seeded = await ports.queue.enqueue({
        operationId: `integrate:${claim.runId}:enqueue`,
        expectedRevision: 'github-empty-queue',
        actor: claim.runId,
        requestedAt: new Date().toISOString(),
        input: { candidateWorkItemId: workItemId, runId: claim.runId, dependencies: item.value.item.dependencies, decisions: [] },
      });
      if (seeded.disposition === 'conflict') throw conflictError(seeded.reason ?? 'GitHub coordination queue could not be created');
    }
  }
  const outcome = await coordinator.integrate({
    candidateWorkItemId: workItemId,
    runId: claim.runId,
    checkpoint,
    dependencies: item.value.item.dependencies,
    decisions: [],
    worktreePath: run.worktreePath,
    verificationCommands: ctx.config?.verification.commands ?? [],
    title: 'Integration: work item ' + workItemId,
  }, target);

  let evidence = await loadEvidence(ctx, claim.runId, workItemId, ctx.owner);
  if (outcome.state === 'integrated') {
    evidence = integrationEvidence(evidence, 'integrated', outcome.verification);
    const currentState = evidence.stateTransitions.at(-1)?.to;
    if (currentState === 'ready-for-integration') evidence = transitionEvidence(evidence, 'ready-for-integration', 'integrated');
    evidence = actionEvidence(evidence, 'integrate', ctx.owner);
    await saveEvidence(ctx, evidence);
    const activeAfterEvidence = await ports.claims.active(workItemId);
    const released = await ports.claims.release(command(`integrate:release:${workItemId}:${claim.runId}`, activeAfterEvidence.revision, ctx.owner, { workItemId, claimToken: claim.claimToken, reason: 'integration completed' }));
    if (released.disposition === 'conflict') throw conflictError(released.reason ?? 'integration claim release conflicted');
    const projected = await ports.workItems.projectState(command(`integrate:state:${workItemId}:${claim.runId}`, released.revision, ctx.owner, { workItemId, from: 'ready-for-integration', to: 'integrated' }));
    if (projected.disposition === 'conflict') throw conflictError(projected.reason ?? 'integration state projection conflicted');
  } else {
    evidence = integrationEvidence(evidence, outcome.state === 'rejected' ? 'rejected' : 'pending', outcome.verification);
    evidence = actionEvidence(evidence, 'integrate', ctx.owner, outcome.state === 'blocked' ? 'blocked' : 'failed');
    await saveEvidence(ctx, evidence);
  }
  return {
    integration: {
      state: outcome.state,
      queuePosition: outcome.queuePosition,
      targetCommit: outcome.targetCommit,
      pullRequestUrl: outcome.pullRequest?.url,
      verification: outcome.verification,
      policy: outcome.policy,
      nextAction: outcome.nextAction,
    },
  };
}

export async function runIntegrateCommand(ctx: CliContext, args: string[], json: boolean): Promise<number> {
  try {
    const approvalIndex = args.indexOf('--approve-semantic');
    const byIndex = args.indexOf('--by');
    const result = await integrate(ctx, args[0] ?? '', {
      approveSemantic: approvalIndex >= 0 ? args[approvalIndex + 1] : undefined,
      decidedBy: byIndex >= 0 ? args[byIndex + 1] : undefined,
    });
    if (json) process.stdout.write(`${JSON.stringify(result)}\n`);
    else {
      const i = result.integration;
      process.stdout.write(`integration state=${i.state} (verification: ${(i.verification as VerificationResult[]).map((v) => `${v.command}:${v.outcome}`).join(', ')})\n`);
    }
    return result.integration.state === 'rejected' ? 1 : 0;
  } catch (error) {
    return reportCommandError(error, json);
  }
}
