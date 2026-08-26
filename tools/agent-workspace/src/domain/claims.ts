// Deterministic claim reconciliation per research.md §2:
// append-only records; the first valid unexpired claim wins; expiry is computed
// from the newest valid record; duplicate delivery for the same token is absorbed.

import type { ClaimRecord, ClaimState } from './types.ts';

export interface ClaimOutcome {
  winner: boolean;
  reason?: string;
}

export function isExpired(record: ClaimRecord, now: string): boolean {
  return Date.parse(record.leaseExpiresAt) <= Date.parse(now);
}

/**
 * Reconciles append-only claim records for one Work Item. Records must be
 * ordered oldest-first (comment creation order on GitHub).
 *
 * Semantics per data-model.md: a claim token is valid iff its LATEST record is
 * an acquire/renew (not release/expire) and its lease has not expired. Among
 * valid tokens the deterministic winner is the one whose first record appears
 * earliest in creation order. Duplicate tokens are treated as one claim.
 */
export function reconcile(
  records: ClaimRecord[],
  now: string,
): { active: ClaimState | undefined; duplicates: string[] } {
  const latestByToken = new Map<string, ClaimRecord>();
  const firstSeen = new Map<string, number>();
  const duplicates: string[] = [];

  records.forEach((record, index) => {
    if (latestByToken.has(record.claimToken)) {
      duplicates.push(record.claimToken);
    }
    if (!firstSeen.has(record.claimToken)) {
      firstSeen.set(record.claimToken, index);
    }
    latestByToken.set(record.claimToken, record);
  });

  const valid = [...latestByToken.values()]
    .filter(
      (record) =>
        record.kind !== 'release' &&
        record.kind !== 'expire' &&
        !isExpired(record, now),
    )
    .sort((a, b) => (firstSeen.get(a.claimToken) ?? 0) - (firstSeen.get(b.claimToken) ?? 0));

  const winner = valid[0];
  const active: ClaimState | undefined = winner
    ? {
        workItemId: winner.workItemId,
        claimToken: winner.claimToken,
        claimant: winner.claimant,
        runId: winner.runId,
        acquiredAt: winner.acquiredAt,
        leaseExpiresAt: winner.leaseExpiresAt,
      }
    : undefined;

  return { active, duplicates };
}

/**
 * Attempts to acquire. Returns winner=true iff the record is the first valid
 * unexpired claim for the Work Item (or a duplicate of the winner).
 */
export function acquire(records: ClaimRecord[], claim: ClaimRecord, now: string): ClaimOutcome {
  const { active } = reconcile(records, now);
  if (active && active.claimToken === claim.claimToken) {
    if (active.claimant === claim.claimant && active.runId === claim.runId) {
      return { winner: true, reason: 'duplicate delivery absorbed' };
    }
    return { winner: false, reason: 'claim token is already owned by another identity' };
  }
  if (active) {
    return {
      winner: false,
      reason: `work item already claimed by ${active.claimant} until ${active.leaseExpiresAt}`,
    };
  }
  if (isExpired(claim, now)) {
    return { winner: false, reason: 'claim lease is already expired' };
  }
  return { winner: true };
}

/**
 * Renews a claim as a heartbeat: allowed only for the current winner's token.
 */
export function renew(records: ClaimRecord[], claim: ClaimRecord, now: string): ClaimOutcome {
  const { active } = reconcile(records, now);
  if (!active) {
    return { winner: false, reason: 'no active claim to renew' };
  }
  if (active.claimToken !== claim.claimToken || active.claimant !== claim.claimant || active.runId !== claim.runId) {
    return { winner: false, reason: `active claim belongs to ${active.claimant}` };
  }
  return { winner: true };
}

/**
 * Transfers the active claim to a replacement owner without changing the
 * claim token or run id. The previous owner is carried in the handoff record
 * so reconciliation can reject stale control instructions.
 */
export function handoff(records: ClaimRecord[], claim: ClaimRecord, now: string): ClaimOutcome {
  const { active } = reconcile(records, now);
  if (!active) return { winner: false, reason: 'no active claim to hand off' };
  if (claim.kind !== 'handoff' || !claim.previousOwner) {
    return { winner: false, reason: 'handoff record is missing the previous owner' };
  }
  if (active.claimToken !== claim.claimToken || active.claimant !== claim.previousOwner || active.runId !== claim.runId) {
    return { winner: false, reason: `active claim belongs to ${active.claimant}` };
  }
  if (isExpired(claim, now)) return { winner: false, reason: 'claim lease is already expired' };
  return { winner: true };
}
