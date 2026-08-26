// Provider-neutral policy domain (contracts/provider-ports.md): local
// verification and provider policy remain separate gates. Pending, failed,
// blocked, unexecuted, or unavailable requirements can never pass. An empty
// list of effective blocking provider policies is observable and may pass; it
// does not remove the separate local verification requirement.

import type {
  PolicyInventory,
  PolicyRequirement,
  PolicySnapshot,
  PolicyVerdict,
} from './types.ts';

export function aggregateOutcome(requirements: PolicyRequirement[]): PolicyVerdict {
  if (requirements.length === 0) return 'passed';
  if (requirements.some((r) => r.verdict === 'unavailable')) return 'unavailable';
  if (requirements.some((r) => r.verdict === 'failed')) return 'failed';
  if (requirements.some((r) => r.verdict === 'blocked')) return 'blocked';
  if (requirements.some((r) => r.verdict === 'unexecuted')) return 'unexecuted';
  if (requirements.some((r) => r.verdict === 'pending')) return 'unexecuted';
  if (requirements.every((r) => r.verdict === 'passed')) return 'passed';
  return 'unexecuted';
}

export function snapshotAggregate(snapshot: PolicySnapshot): PolicyVerdict {
  return snapshot.aggregate === 'passed' ? 'passed' : snapshot.aggregate;
}

/** A snapshot is only observable and passable when its inventory sources all read. */
export function inventoryIsComplete(inventory: PolicyInventory): boolean {
  return inventory.sources.length > 0 && inventory.sources.every((s) => s.outcome === 'read');
}

export function inventoryVerdict(inventory: PolicyInventory): PolicyVerdict {
  if (!inventoryIsComplete(inventory)) return 'unavailable';
  return aggregateOutcome(inventory.effectiveBlocking);
}

export function snapshotIsPassable(snapshot: PolicySnapshot): boolean {
  return (
    inventoryVerdict(snapshot.inventory) === 'passed' &&
    aggregateOutcome(snapshot.evaluations) === 'passed'
  );
}

/** Strictest company/provider rule wins: a stricter provider rule overrides a looser local intent. */
export function stricterWins(a: PolicyVerdict, b: PolicyVerdict): PolicyVerdict {
  const severity: Record<PolicyVerdict, number> = {
    unavailable: 5,
    failed: 4,
    blocked: 3,
    unexecuted: 2,
    pending: 2,
    passed: 1,
  };
  return (severity[a] ?? 1) >= (severity[b] ?? 1) ? a : b;
}