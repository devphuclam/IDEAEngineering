// `workspace status [work-item]` (T042/T055/T056, FR-013/FR-014): inspect
// canonical evidence and local mirrors without requiring the original sandbox.

import { contextPath, listCheckpoints, listLocalRunIds, readJson } from '../adapters/local/state-files.ts';
import type { AgentCheckpoint, ClaimRecord, RunContext, RunEvidence, RunState } from '../domain/types.ts';
import { normalizeError, usageError, WorkspaceError } from '../errors.ts';
import { requireGitHubContext, type CliContext } from './context.ts';
import { reportCommandError } from './output.ts';
import { providerPorts, targetFor } from './provider-runtime.ts';

export interface StatusRun {
  runId: string;
  workItemId: string;
  state: RunState | string;
  claimState: 'active' | 'released' | 'expired' | 'unknown';
  owner: string;
  branch: string;
  retryOf?: string;
  checkpoints: Array<{ checkpointId: string; createdAt: string; commit: string }>;
  verification: RunEvidence['verification'];
  integration: RunEvidence['integrationResult'] | null;
  blocker?: RunEvidence['blocker'];
  nextAction?: string;
  ownerHistory?: RunEvidence['ownerHistory'];
  queue?: {
    sequence?: number;
    state?: string;
    canonicalRevision?: string;
    observedAt?: string;
    leaseOwner?: string;
    recovery?: string;
  };
}

function latestEvidence(records: RunEvidence[]): RunEvidence | undefined {
  return [...records].sort((a, b) => {
    const left = Date.parse(a.timestamps.at(-1) ?? '');
    const right = Date.parse(b.timestamps.at(-1) ?? '');
    return right - left;
  })[0];
}

function claimStateForRun(records: ClaimRecord[], runId: string): StatusRun['claimState'] {
  const relevant = records.filter((record) => record.runId === runId);
  const last = relevant.at(-1);
  if (!last) return 'unknown';
  if (last.kind === 'release') return 'released';
  if (last.kind === 'expire') return 'expired';
  return 'active';
}

function stateFromEvidence(evidence: RunEvidence | undefined, claims: ClaimRecord[], runId: string): RunState {
  const state = evidence?.stateTransitions.at(-1)?.to;
  if (state) return state;
  const last = claims.filter((record) => record.runId === runId).at(-1);
  if (last?.kind === 'expire') return 'expired';
  return last ? 'claimed' : 'requested';
}

async function localContextForRun(ctx: CliContext, runId: string): Promise<RunContext | undefined> {
  return readJson<RunContext>(contextPath(runId, ctx.cwd));
}

export async function status(
  ctx: CliContext,
  workItemId: string | undefined,
): Promise<{ runs: StatusRun[] }> {
  if (ctx.providerPorts) {
    requireGitHubContext(ctx, false);
    return statusProvider(ctx, workItemId);
  }
  const localRunIds = await listLocalRunIds(ctx.cwd);
  if (!workItemId && localRunIds.length === 0) return { runs: [] };

  let claimRecords: ClaimRecord[] = [];
  let canonicalEvidence: RunEvidence[] = [];
  const canonicalProviderAvailable = Boolean(ctx.providerPorts) || Boolean(ctx.repo && !ctx.repoError);
  if (workItemId && canonicalProviderAvailable) {
    try {
      claimRecords = await ctx.claims.records(workItemId);
      canonicalEvidence = await ctx.evidence.list(workItemId);
    } catch (error) {
      if (localRunIds.length === 0) throw normalizeError(error, 'STATUS_READ_FAILED', 'capability');
    }
  } else if (workItemId && localRunIds.length === 0) {
    throw ctx.repoError ?? new WorkspaceError('STATUS_SOURCE_UNAVAILABLE', 'capability', 'no canonical Work Item source is available');
  }

  const runIds = new Set<string>(workItemId ? [] : localRunIds);
  for (const record of claimRecords) runIds.add(record.runId);
  for (const record of canonicalEvidence) runIds.add(record.runId);

  const runs: StatusRun[] = [];
  for (const runId of runIds) {
    const context = await localContextForRun(ctx, runId);
    if (workItemId && context && context.workItemId !== workItemId) continue;
    const itemId = workItemId ?? context?.workItemId;
    if (!itemId) continue;

    const evidenceRecords = canonicalEvidence.filter((record) => record.runId === runId);
    let evidence = latestEvidence(evidenceRecords);
    if (!evidence) {
      try {
        evidence = await ctx.evidence.read(runId);
      } catch {
        evidence = undefined;
      }
    }
    const checkpoints = await listCheckpoints<AgentCheckpoint>(runId, ctx.cwd);
    if (checkpoints.length === 0 && ctx.sourceHost.readCheckpoints && canonicalProviderAvailable) {
      checkpoints.push(...(await ctx.sourceHost.readCheckpoints(itemId)).filter((checkpoint) => checkpoint.runId === runId));
    }
    const claimsForItem = claimRecords.length > 0 ? claimRecords : [];
    const owner = evidence?.owner ?? claimsForItem.filter((record) => record.runId === runId).at(-1)?.claimant ?? context?.owner ?? 'unknown';
    const branch = context?.branch ?? checkpoints[0]?.branch ?? 'unknown';
    runs.push({
      runId,
      workItemId: itemId,
      state: stateFromEvidence(evidence, claimsForItem, runId),
      claimState: claimStateForRun(claimsForItem, runId),
      owner,
      branch,
      retryOf: evidence?.retryOf ?? context?.retryOf,
      checkpoints: checkpoints.map((checkpoint) => ({
        checkpointId: checkpoint.checkpointId,
        createdAt: checkpoint.createdAt,
        commit: checkpoint.commit,
      })),
      verification: evidence?.verification ?? checkpoints[0]?.verification ?? [],
      integration: evidence?.integrationResult ?? null,
      blocker: evidence?.blocker,
      nextAction: evidence?.nextAction ?? checkpoints[0]?.nextAction,
      ownerHistory: evidence?.ownerHistory,
    });
  }
  return { runs: runs.sort((a, b) => a.runId.localeCompare(b.runId)) };
}

async function statusProvider(ctx: CliContext, workItemId: string | undefined): Promise<{ runs: StatusRun[] }> {
  const ports = providerPorts(ctx);
  const localRunIds = await listLocalRunIds(ctx.cwd);
  const ids = new Set<string>();
  if (workItemId) ids.add(workItemId);
  for (const runId of localRunIds) {
    const context = await localContextForRun(ctx, runId);
    if (context?.workItemId) ids.add(context.workItemId);
  }
  if (ids.size === 0) {
    // Local run indexes are disposable. Rebuild the candidate set from the
    // provider before deciding that there are no runs to show.
    for (const item of await ports.workItems.listOpen()) ids.add(item.value.item.id);
  }
  if (ids.size === 0) return { runs: [] };
  const target = targetFor(ctx);
  const queue = await ports.queue.read(target).catch(() => undefined);
  const runs: StatusRun[] = [];
  for (const itemId of ids) {
    const snapshot = await ports.workItems.read(itemId);
    const evidenceRecords = await ports.evidence.list(itemId);
    const evidence = latestEvidence(evidenceRecords);
    const coordination = snapshot.value.coordination;
    const active = (await ports.claims.active(itemId)).value;
    const runIds = new Set<string>(evidenceRecords.map((record) => record.runId));
    if (coordination.run?.runId) runIds.add(coordination.run.runId);
    if (active?.runId) runIds.add(active.runId);
    for (const runId of runIds) {
      const context = await localContextForRun(ctx, runId);
      if (workItemId && context && context.workItemId !== workItemId) continue;
      const runEvidence = latestEvidence(evidenceRecords.filter((record) => record.runId === runId));
      let checkpoints = (await listCheckpoints<AgentCheckpoint>(runId, ctx.cwd)).filter((checkpoint) => checkpoint.runId === runId);
      if (checkpoints.length === 0 && ports.sourceHost.readCheckpoints) checkpoints = (await ports.sourceHost.readCheckpoints(itemId)).filter((checkpoint) => checkpoint.runId === runId);
      const claimState: StatusRun['claimState'] = active?.runId === runId
        ? Date.parse(active.leaseExpiresAt) > Date.now() ? 'active' : 'expired'
        : runEvidence?.stateTransitions.at(-1)?.to === 'expired' ? 'expired' : 'released';
      const entry = queue?.value.entries.find((candidate) => candidate.runId === runId || candidate.candidateWorkItemId === itemId);
      runs.push({
        runId,
        workItemId: itemId,
        state: runEvidence?.stateTransitions.at(-1)?.to ?? (coordination.run?.runId === runId ? coordination.run.state : 'requested'),
        claimState,
        owner: active?.runId === runId ? active.claimant : runEvidence?.owner ?? context?.owner ?? 'unknown',
        branch: coordination.run?.runId === runId ? coordination.run.branch ?? context?.branch ?? checkpoints[0]?.branch ?? 'unknown' : context?.branch ?? checkpoints[0]?.branch ?? 'unknown',
        retryOf: runEvidence?.retryOf ?? context?.retryOf,
        checkpoints: checkpoints.map((checkpoint) => ({ checkpointId: checkpoint.checkpointId, createdAt: checkpoint.createdAt, commit: checkpoint.commit })),
        verification: runEvidence?.verification ?? checkpoints[0]?.verification ?? [],
        integration: runEvidence?.integrationResult ?? null,
        blocker: runEvidence?.blocker,
        nextAction: runEvidence?.nextAction ?? checkpoints[0]?.nextAction,
        ownerHistory: runEvidence?.ownerHistory,
        queue: queue ? {
          sequence: entry?.sequence,
          state: entry?.state,
          canonicalRevision: queue.revision,
          observedAt: queue.observedAt,
          leaseOwner: queue.value.lease?.runId === runId ? queue.value.lease.operationId : undefined,
          recovery: 'provider-canonical; local mirrors are disposable',
        } : { recovery: 'queue unavailable; run `workspace recover` for provider diagnostics' },
      });
    }
  }
  return { runs: runs.sort((a, b) => a.runId.localeCompare(b.runId)) };
}

export async function runStatusCommand(ctx: CliContext, args: string[], json: boolean): Promise<number> {
  try {
    const result = await status(ctx, args[0]);
    if (json) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    } else {
      for (const run of result.runs) {
        process.stdout.write(
          `run ${run.runId}: ${run.state} (${run.workItemId}) owner=${run.owner} claim=${run.claimState} branch=${run.branch}\n`,
        );
        for (const checkpoint of run.checkpoints) process.stdout.write(`  checkpoint ${checkpoint.checkpointId} @ ${checkpoint.commit}\n`);
        for (const verification of run.verification) process.stdout.write(`  verification ${verification.command}: ${verification.outcome}\n`);
        if (run.queue) process.stdout.write(`  queue: ${run.queue.state ?? 'not-enqueued'} revision=${run.queue.canonicalRevision ?? 'unknown'}${run.queue.sequence === undefined ? '' : ` sequence=${run.queue.sequence}`}\n`);
        if (run.nextAction) process.stdout.write(`  next: ${run.nextAction}\n`);
      }
    }
    return 0;
  } catch (error) {
    return reportCommandError(error, json);
  }
}
