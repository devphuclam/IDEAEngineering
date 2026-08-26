// `workspace claim <work-item> [--lease <duration>]` (T020, FR-002/FR-004).

import { randomUUID } from 'node:crypto';
import type { ClaimRecord } from '../domain/types.ts';
import { conflictError, usageError, WorkspaceError } from '../errors.ts';
import { requireGitHubContext } from './context.ts';
import type { CliContext } from './context.ts';
import { actionEvidence, loadEvidence, saveEvidence, transitionEvidence } from './evidence.ts';
import { reportCommandError } from './output.ts';
import { command, ensureProviderOwner, operationId, providerPorts } from './provider-runtime.ts';

export function parseLease(raw: string | undefined, now = Date.now()): { leaseExpiresAt: string } {
  const duration = raw ?? '8h';
  const match = duration.match(/^(\d+)(s|m|h|d)$/);
  if (!match) {
    throw usageError(`invalid lease duration '${duration}'; use <n>s|m|h|d (e.g. 8h)`);
  }
  const multipliers: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  const ms = Number(match[1]) * multipliers[match[2]];
  return { leaseExpiresAt: new Date(now + ms).toISOString() };
}

export async function claim(
  ctx: CliContext,
  workItemId: string,
  lease: string | undefined,
  suppliedToken?: string,
  requestedOperationId?: string,
): Promise<{ claim: Record<string, string> }> {
  if (!workItemId) throw usageError('usage: workspace claim <work-item> [--lease <duration>]');
  requireGitHubContext(ctx);
  if (ctx.providerPorts) {
    const ports = providerPorts(ctx);
    await ensureProviderOwner(ctx);
    const { leaseExpiresAt } = parseLease(lease);
    const active = (await ports.claims.active(workItemId)).value;
    if (suppliedToken && active && active.claimToken !== suppliedToken) {
      throw conflictError(`claim token is owned by ${active.claimant}; refusing duplicate delivery`);
    }
    const claimToken = suppliedToken || `claim-${randomUUID()}`;
    const record: ClaimRecord = active && active.claimToken === claimToken
      ? { ...active, kind: 'acquire' }
      : {
          workItemId,
          claimToken,
          claimant: ctx.owner,
          runId: `run-${randomUUID()}`,
          acquiredAt: new Date().toISOString(),
          leaseExpiresAt,
          kind: 'acquire',
        };
    if (record.claimant !== ctx.owner) throw conflictError(`claim belongs to ${record.claimant}; only that identity may retry it`);
    const snapshot = await ports.workItems.read(workItemId);
    const result = await ports.claims.acquire(command(requestedOperationId ?? operationId([], `claim:${workItemId}`), snapshot.revision, ctx.owner, record));
    if (result.disposition === 'conflict') throw conflictError(`claim rejected: ${result.reason ?? 'another claim is active'}`);
    const state = result.value ?? record;
    if (result.disposition === 'applied') {
      const projected = await ports.workItems.projectState(command(`state:claim:${workItemId}:${state.runId}`, result.revision, ctx.owner, { workItemId, from: 'open', to: 'claimed' }));
      if (projected.disposition === 'conflict') throw conflictError(projected.reason ?? 'claim state projection conflicted');
    }
    let evidence = await loadEvidence(ctx, state.runId, workItemId, ctx.owner);
    const current = evidence.stateTransitions.at(-1)?.to ?? 'requested';
    if (current === 'requested') evidence = transitionEvidence(evidence, 'requested', 'claimed');
    evidence = actionEvidence(evidence, 'claim', ctx.owner);
    await saveEvidence(ctx, evidence);
    return { claim: { workItemId, claimToken: state.claimToken, claimant: state.claimant, runId: state.runId, acquiredAt: state.acquiredAt, leaseExpiresAt: state.leaseExpiresAt } };
  }
  const { leaseExpiresAt } = parseLease(lease);
  const claimToken = suppliedToken || `claim-${randomUUID()}`;
  const existing = suppliedToken
    ? (await ctx.claims.records(workItemId)).find((record) => record.claimToken === suppliedToken)
    : undefined;
  if (existing && existing.claimant !== ctx.owner) {
    throw conflictError(`claim token is owned by ${existing.claimant}; refusing duplicate delivery`);
  }
  const record: ClaimRecord = existing ?? {
    workItemId,
    claimToken,
    claimant: ctx.owner,
    runId: `run-${randomUUID()}`,
    acquiredAt: new Date().toISOString(),
    leaseExpiresAt,
    kind: 'acquire',
  };
  const outcome = await ctx.claims.acquire(record);
  if (!outcome.winner) {
    throw conflictError(`claim rejected: ${outcome.reason ?? 'another claim is active'}`);
  }
  await ctx.workItems.setState(workItemId, 'claimed');
  let evidence = await loadEvidence(ctx, record.runId, workItemId, ctx.owner);
  evidence = transitionEvidence(evidence, 'requested', 'claimed');
  evidence = actionEvidence(evidence, 'claim', ctx.owner);
  await saveEvidence(ctx, evidence);
  return {
    claim: {
      workItemId,
      claimToken,
      claimant: ctx.owner,
      runId: record.runId,
      acquiredAt: record.acquiredAt,
      leaseExpiresAt,
    },
  };
}

export async function runClaimCommand(ctx: CliContext, args: string[], json: boolean): Promise<number> {
  try {
    const workItemId = args[0];
    const leaseIndex = args.indexOf('--lease');
    const lease = leaseIndex >= 0 ? args[leaseIndex + 1] : undefined;
    const tokenIndex = args.indexOf('--token');
    const token = tokenIndex >= 0 ? args[tokenIndex + 1] : undefined;
    const result = await claim(ctx, workItemId, lease, token, operationId(args, 'claim'));
    if (json) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    } else {
      const c = result.claim;
      process.stdout.write(
        `claimed ${c.workItemId} for ${c.claimant} until ${c.leaseExpiresAt} (token ${c.claimToken})\n`,
      );
    }
    return 0;
  } catch (error) {
    return reportCommandError(error, json);
  }
}
