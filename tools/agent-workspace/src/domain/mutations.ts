// Provider-neutral mutation foundation (contracts/provider-ports.md and
// contracts/canonical-records.md): canonical payload hashing, stable
// operation identity, authoritative mutation dispositions, the shared
// MAX_STALE_REREADS budget, and same-process keyed serialization.
//
// An atomic provider rejects a stale conditional write before state change.
// An append-only provider may retain a stale proposal as immutable history,
// but it returns `conflict` and that proposal never controls a claim, Run,
// sandbox, queue lease, or integration decision.

import { createHash } from 'node:crypto';
import {
  MAX_STALE_REREADS,
  type MutationCommand,
  type MutationDisposition,
  type OperationId,
  type ProviderRevision,
} from './types.ts';

export { MAX_STALE_REREADS };

/** Canonical JSON: lexicographically sorted object keys, no insignificant whitespace. */
export function canonicalJson(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`;
  }
  if (typeof value === 'string') return JSON.stringify(value);
  return String(value);
}

/** SHA-256 of canonical JSON, prefixed `sha256:`. */
export function payloadHash(input: unknown): string {
  return `sha256:${createHash('sha256').update(canonicalJson(input), 'utf8').digest('hex')}`;
}

export function newOperationId(now: string, counter?: number): OperationId {
  return `op-${now.replace(/[-:.]/g, '')}-${(counter ?? 0).toString(36)}`;
}

export function isStaleRevision(expected: ProviderRevision, actual: ProviderRevision): boolean {
  return expected !== actual;
}

export interface RetryBudget {
  remaining: number;
  exhausted(): boolean;
  consume(): void;
}

export function retryBudget(maxRereads: number = MAX_STALE_REREADS): RetryBudget {
  let remaining = maxRereads;
  return {
    get remaining() {
      return remaining;
    },
    exhausted: () => remaining <= 0,
    consume: () => {
      remaining -= 1;
    },
  };
}

export interface KeyedSerialization {
  <T>(key: string, task: () => Promise<T>): Promise<T>;
}

export function createKeyedSerializer(): KeyedSerialization {
  const queues = new Map<string, Promise<unknown>>();
  return <T>(key: string, task: () => Promise<T>): Promise<T> => {
    const previous = queues.get(key) ?? Promise.resolve();
    const next = previous.then(task, task);
    queues.set(
      key,
      next.catch(() => undefined),
    );
    return next;
  };
}

export function applyDisposition<T>(
  result: { disposition: MutationDisposition; reason?: string },
  operationId: OperationId,
  revision: ProviderRevision,
  value?: T,
): { disposition: MutationDisposition; operationId: OperationId; revision: ProviderRevision; value?: T; reason?: string } {
  return { disposition: result.disposition, operationId, revision, value, reason: result.reason };
}

/**
 * Reconcile an append-only proposal stream against its reread projection.
 * Only a proposal that is authoritative under the adapter's reconciliation
 * model may return `applied`; a losing/stale proposal returns `conflict` and
 * never controls a claim, Run, sandbox, queue lease, or integration decision.
 */
export function classifyAppendOutcome(params: {
  operationId: OperationId;
  expectedRevision: ProviderRevision;
  readRevision: ProviderRevision;
  proposalFound: boolean;
  proposalAuthoritative: boolean;
  receiptFound: boolean;
}): MutationDisposition {
  const { operationId, expectedRevision, readRevision, proposalFound, proposalAuthoritative, receiptFound } = params;
  void operationId;
  if (receiptFound) return 'duplicate';
  if (!proposalFound) return 'conflict';
  if (!proposalAuthoritative) return 'conflict';
  if (isStaleRevision(expectedRevision, readRevision)) return 'conflict';
  return 'applied';
}
