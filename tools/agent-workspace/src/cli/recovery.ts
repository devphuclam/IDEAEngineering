import { resolve } from 'node:path';
import { listCheckpoints, writeProviderQueueMirrorAtomic } from '../adapters/local/state-files.ts';
import type { AgentCheckpoint } from '../domain/types.ts';
import { requireGitHubContext, type CliContext } from './context.ts';
import { targetFor } from './provider-runtime.ts';

/**
 * Local state is an execution mirror. If a sandbox disappeared, the source
 * host checkpoint comments are the recovery authority.
 */
export async function latestCheckpoint(
  ctx: CliContext,
  workItemId: string,
  runId?: string,
): Promise<AgentCheckpoint | undefined> {
  if (runId) {
    const local = await listCheckpoints<AgentCheckpoint>(runId, ctx.cwd);
    const match = local.find((checkpoint) => checkpoint.runId === runId);
    if (match) return match;
  }
  const remote = ctx.providerPorts?.sourceHost.readCheckpoints
    ? await ctx.providerPorts.sourceHost.readCheckpoints(workItemId)
    : ctx.sourceHost.readCheckpoints
      ? await ctx.sourceHost.readCheckpoints(workItemId)
      : [];
  return remote.find((checkpoint) => !runId || checkpoint.runId === runId);
}

export function worktreeAbsolutePath(ctx: CliContext, worktreePath: string): string {
  return resolve(ctx.cwd, worktreePath);
}

/** Provider-first recovery: canonical queue/history are read before local indexes. */
export async function recoverProvider(ctx: CliContext, workItemId?: string): Promise<Record<string, unknown>> {
  const ports = ctx.providerPorts;
  if (!ports) throw new Error('provider-neutral context is not available');
  requireGitHubContext(ctx, false);
  const target = targetFor(ctx);
  const queue = await ports.queue.read(target);
  await writeProviderQueueMirrorAtomic({
    schema: 'agent-workspace/provider-queue-mirror',
    version: 1,
    queueKey: queue.value.queueKey,
    providerRevision: queue.revision,
    observedAt: queue.observedAt,
  }, ctx.cwd);
  const history = await ports.queue.completionHistory(target);
  const activeCandidates = workItemId ? queue.value.entries.filter((entry) => entry.candidateWorkItemId === workItemId) : queue.value.entries;
  const providerRepairs: unknown[] = [await ports.queue.reconcilePending(target)];
  const claimWorkItemIds = [...new Set([...(workItemId ? [workItemId] : []), ...activeCandidates.map((entry) => entry.candidateWorkItemId)])];
  for (const candidateWorkItemId of claimWorkItemIds) {
    providerRepairs.push(await ports.claims.reconcilePending(candidateWorkItemId));
  }
  return {
    recovery: {
      queueKey: queue.value.queueKey,
      activeCandidates: activeCandidates.length,
      completedSummariesRead: history.length,
      localIndexesRebuilt: false,
      localRecovery: {
        queueMirror: 'rebuilt',
        checkpoints: 'not-run',
        activeRuns: 'not-run',
        runEvidence: 'not-run',
        pullRequests: 'not-run',
      },
      providerRepairs,
    },
  };
}
