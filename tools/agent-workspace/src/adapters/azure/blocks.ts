// Strict managed-block serializer/parser (contracts/canonical-records.md).
// Each pair of visible markers surrounds exactly one <pre> containing
// HTML-escaped canonical JSON. Parsers reject duplicate, nested, reversed,
// mixed-version, or partially present markers. Replacement changes only the
// bytes from BEGIN through END for its block and preserves all other
// Description content.

import { canonicalJson, payloadHash } from '../../domain/mutations.ts';
import type {
  BlockerClassification,
  ChangeScopeBlock,
  CoordinationState,
  ManagedBlockKind,
  QueueManifest,
  RunEvidence,
} from '../../domain/types.ts';

export class ManagedBlockError extends Error {
  constructor(message: string) {
    super(`managed block: ${message}`);
    this.name = 'ManagedBlockError';
  }
}

export const BLOCK_MARKERS: Record<ManagedBlockKind, { begin: string; end: string; label: string }> = {
  'coordination-state': {
    begin: 'AGENT-WORKSPACE:COORDINATION-STATE:V1:BEGIN',
    end: 'AGENT-WORKSPACE:COORDINATION-STATE:V1:END',
    label: 'AGENT-WORKSPACE:COORDINATION-STATE:V1',
  },
  'change-scope': {
    begin: 'AGENT-WORKSPACE:CHANGE-SCOPE:V1:BEGIN',
    end: 'AGENT-WORKSPACE:CHANGE-SCOPE:V1:END',
    label: 'AGENT-WORKSPACE:CHANGE-SCOPE:V1',
  },
  'queue-manifest': {
    begin: 'AGENT-WORKSPACE:QUEUE-MANIFEST:V1:BEGIN',
    end: 'AGENT-WORKSPACE:QUEUE-MANIFEST:V1:END',
    label: 'AGENT-WORKSPACE:QUEUE-MANIFEST:V1',
  },
};

const BLOCK_PATTERN = /^(AGENT-WORKSPACE:(?:COORDINATION-STATE|CHANGE-SCOPE|QUEUE-MANIFEST):V1):BEGIN$/m;

export interface ManagedBlock<T> {
  kind: ManagedBlockKind;
  label: string;
  canonical: string;
  payloadHash: string;
  value: T;
}

export function blockTag(kind: ManagedBlockKind): string {
  return BLOCK_MARKERS[kind].label;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function unescapeHtml(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function serializePre(canonical: string): string {
  return `<pre>${escapeHtml(canonical)}</pre>`;
}

/**
 * Serialize a block into a Description string that preserves all other
 * content byte-for-byte: the block bytes from BEGIN through END are replaced.
 * A block that is already present (same label + hash) is left untouched.
 */
export function replaceManagedBlock<T>(
  description: string,
  kind: ManagedBlockKind,
  value: T,
): { description: string; changed: boolean; canonical: string; hash: string } {
  const markers = BLOCK_MARKERS[kind];
  const canonical = canonicalJson(value);
  const hash = payloadHash(value);
  const block = `${markers.begin}\n${serializePre(canonical)}\n${markers.end}`;

  const beginIndex = description.indexOf(markers.begin);
  const endIndex = description.indexOf(markers.end);
  if (beginIndex >= 0 && endIndex >= 0 && endIndex > beginIndex) {
    if (description.slice(beginIndex, endIndex + markers.end.length) === block) {
      return { description, changed: false, canonical, hash };
    }
    const nextBegin = description.indexOf(markers.begin, beginIndex + markers.begin.length);
    if (nextBegin >= 0 && nextBegin < endIndex) {
      throw new ManagedBlockError(`duplicate ${kind} block`);
    }
    return {
      description: `${description.slice(0, beginIndex)}${block}${description.slice(endIndex + markers.end.length)}`,
      changed: true,
      canonical,
      hash,
    };
  }
  if (beginIndex >= 0 || endIndex >= 0) {
    throw new ManagedBlockError(`partially present ${kind} block`);
  }
  const suffix = description.length > 0 && !description.endsWith('\n') ? '\n' : '';
  return { description: `${description}${suffix}${block}`, changed: true, canonical, hash };
}

/**
 * Parse exactly one block of the given kind from a Description. Fails closed
 * on duplicate, nested, reversed, mixed-version, or partially present markers
 * and on any non-<pre> content between the markers.
 */
export function parseManagedBlock(description: string, kind: ManagedBlockKind): ManagedBlock<Record<string, unknown>> {
  const markers = BLOCK_MARKERS[kind];
  const matches = [...description.matchAll(new RegExp(escapeRegExp(markers.begin), 'g'))];
  const endMatches = [...description.matchAll(new RegExp(escapeRegExp(markers.end), 'g'))];
  if (matches.length === 0 && endMatches.length === 0) {
    throw new ManagedBlockError(`no ${kind} block present`);
  }
  if (matches.length !== 1 || endMatches.length !== 1) {
    throw new ManagedBlockError(`expected exactly one ${kind} block; found ${matches.length} begin / ${endMatches.length} end markers`);
  }
  const beginIndex = matches[0].index;
  const endIndex = endMatches[0].index;
  if (endIndex <= beginIndex) {
    throw new ManagedBlockError(`reversed ${kind} block markers`);
  }
  const inner = description.slice(beginIndex + markers.begin.length, endIndex);
  const pre = inner.match(/^\n?<pre>([\s\S]*?)<\/pre>\n?$/);
  if (!pre) {
    throw new ManagedBlockError(`malformed ${kind} block: markers must surround exactly one <pre>`);
  }
  const canonical = unescapeHtml(pre[1]);
  let value: unknown;
  try {
    value = JSON.parse(canonical) as unknown;
  } catch {
    throw new ManagedBlockError(`malformed ${kind} block: inner JSON is not parseable`);
  }
  return {
    kind,
    label: markers.label,
    canonical,
    payloadHash: payloadHash(value),
    value: value as Record<string, unknown>,
  };
}

export function parseQueueManifest(description: string): ManagedBlock<QueueManifest> {
  const block = parseManagedBlock(description, 'queue-manifest');
  return {
    ...block,
    value: decodeQueueManifest(block.value),
  };
}

export function parseCoordinationState(description: string): ManagedBlock<CoordinationState> {
  const block = parseManagedBlock(description, 'coordination-state');
  return {
    ...block,
    value: decodeCoordinationState(block.value),
  };
}

export function parseChangeScope(description: string): ManagedBlock<ChangeScopeBlock> {
  const block = parseManagedBlock(description, 'change-scope');
  return {
    ...block,
    value: decodeChangeScope(block.value),
  };
}

function requireObject(value: unknown, what: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new ManagedBlockError(`${what} must be an object`);
  }
  return value as Record<string, unknown>;
}

function requireString(value: unknown, what: string): string {
  if (typeof value !== 'string') throw new ManagedBlockError(`${what} must be a string`);
  return value;
}

function requireNumber(value: unknown, what: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new ManagedBlockError(`${what} must be a finite number`);
  }
  return value;
}

function requireStringArray(value: unknown, what: string): string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw new ManagedBlockError(`${what} must be an array of strings`);
  }
  return [...value];
}

export function decodeQueueManifest(raw: unknown): QueueManifest {
  const record = requireObject(raw, 'queue manifest');
  if (record.schema !== 'agent-workspace/queue-manifest') {
    throw new ManagedBlockError(`queue manifest schema mismatch: ${String(record.schema)}`);
  }
  if (record.version !== 1) throw new ManagedBlockError('queue manifest version must be 1');
  const entries = record.entries;
  if (!Array.isArray(entries)) throw new ManagedBlockError('queue manifest entries must be an array');
  const lease = record.lease === null ? null : requireObject(record.lease, 'queue lease');
  return {
    schema: 'agent-workspace/queue-manifest',
    version: 1,
    queueKey: requireString(record.queueKey, 'queueKey'),
    organizationUrl: requireString(record.organizationUrl, 'organizationUrl'),
    projectId: requireString(record.projectId, 'projectId'),
    repositoryId: requireString(record.repositoryId, 'repositoryId'),
    targetRef: requireString(record.targetRef, 'targetRef'),
    nextEnqueueSequence: requireNumber(record.nextEnqueueSequence, 'nextEnqueueSequence'),
    entries: entries.map((entry, index) => decodeQueueEntry(entry, index)),
    lease: lease
      ? {
          operationId: requireString(lease.operationId, 'lease.operationId'),
          entrySequence: requireNumber(lease.entrySequence, 'lease.entrySequence'),
          candidateWorkItemId: requireString(lease.candidateWorkItemId, 'lease.candidateWorkItemId'),
          runId: requireString(lease.runId, 'lease.runId'),
          acquiredAt: requireString(lease.acquiredAt, 'lease.acquiredAt'),
          expiresAt: requireString(lease.expiresAt, 'lease.expiresAt'),
          targetCommit: requireString(lease.targetCommit, 'lease.targetCommit'),
        }
      : null,
    lastOperation:
      record.lastOperation === null
        ? null
        : {
            operationId: requireString(requireObject(record.lastOperation, 'lastOperation').operationId, 'lastOperation.operationId'),
            kind: requireString(requireObject(record.lastOperation, 'lastOperation').kind, 'lastOperation.kind'),
            outcome: requireString(requireObject(record.lastOperation, 'lastOperation').outcome, 'lastOperation.outcome'),
            at: requireString(requireObject(record.lastOperation, 'lastOperation').at, 'lastOperation.at'),
          },
    pendingPublication: decodePendingPublication(record.pendingPublication),
  };
}

function decodeQueueEntry(raw: unknown, index: number): QueueManifest['entries'][number] {
  const record = requireObject(raw, `queue entry ${index}`);
  const state = record.state;
  if (!['queued', 'blocked', 'preparing', 'incorporating'].includes(state as string)) {
    throw new ManagedBlockError(`queue entry ${index} has invalid state`);
  }
  return {
    sequence: requireNumber(record.sequence, `entry ${index}.sequence`),
    candidateWorkItemId: requireString(record.candidateWorkItemId, `entry ${index}.candidateWorkItemId`),
    runId: requireString(record.runId, `entry ${index}.runId`),
    state: state as QueueManifest['entries'][number]['state'],
    enqueuedAt: requireString(record.enqueuedAt, `entry ${index}.enqueuedAt`),
    dependencies: requireStringArray(record.dependencies, `entry ${index}.dependencies`),
    decisions: Array.isArray(record.decisions) ? record.decisions : [],
...(record.latestTargetCommit === undefined || record.latestTargetCommit === null
        ? {}
        : { latestTargetCommit: requireString(record.latestTargetCommit, `entry ${index}.latestTargetCommit`) }),
  };
}

export function decodeCoordinationState(raw: unknown): CoordinationState {
  const record = requireObject(raw, 'coordination state');
  if (record.schema !== 'agent-workspace/coordination-state') {
    throw new ManagedBlockError(`coordination state schema mismatch: ${String(record.schema)}`);
  }
  if (record.version !== 1) throw new ManagedBlockError('coordination state version must be 1');
  const claim = record.claim === null ? null : requireObject(record.claim, 'claim');
  const run = record.run === null ? null : requireObject(record.run, 'run');
  return {
    schema: 'agent-workspace/coordination-state',
    version: 1,
    workItemId: requireString(record.workItemId, 'workItemId'),
    claim: claim
      ? {
          claimToken: requireString(claim.claimToken, 'claim.claimToken'),
          claimant: requireString(claim.claimant, 'claim.claimant'),
          runId: requireString(claim.runId, 'claim.runId'),
          acquiredAt: requireString(claim.acquiredAt, 'claim.acquiredAt'),
          leaseExpiresAt: requireString(claim.leaseExpiresAt, 'claim.leaseExpiresAt'),
          previousOwner: claim.previousOwner === undefined ? undefined : requireString(claim.previousOwner, 'claim.previousOwner'),
        }
      : null,
    run: run
      ? {
          runId: requireString(run.runId, 'run.runId'),
          state: requireString(run.state, 'run.state') as CoordinationRunState,
          sandboxId: run.sandboxId === undefined || run.sandboxId === null ? undefined : requireString(run.sandboxId, 'run.sandboxId'),
          branch: run.branch === undefined || run.branch === null ? undefined : requireString(run.branch, 'run.branch'),
          checkpointId: run.checkpointId === undefined || run.checkpointId === null ? undefined : requireString(run.checkpointId, 'run.checkpointId'),
          startedAt: requireString(run.startedAt, 'run.startedAt'),
        }
      : null,
    lastAppliedOperation:
      record.lastAppliedOperation === null
        ? null
        : {
            operationId: requireString(requireObject(record.lastAppliedOperation, 'lastAppliedOperation').operationId, 'lastAppliedOperation.operationId'),
            kind: requireString(requireObject(record.lastAppliedOperation, 'lastAppliedOperation').kind, 'lastAppliedOperation.kind'),
            outcome: requireString(requireObject(record.lastAppliedOperation, 'lastAppliedOperation').outcome, 'lastAppliedOperation.outcome'),
            at: requireString(requireObject(record.lastAppliedOperation, 'lastAppliedOperation').at, 'lastAppliedOperation.at'),
          },
    pendingPublication: decodePendingPublication(record.pendingPublication),
  };
}

type CoordinationRunState = CoordinationState['run'] extends { state: infer S } | null ? S : never;

export function decodeChangeScope(raw: unknown): ChangeScopeBlock {
  const record = requireObject(raw, 'change scope');
  if (record.schema !== 'agent-workspace/change-scope') {
    throw new ManagedBlockError(`change scope schema mismatch: ${String(record.schema)}`);
  }
  if (record.version !== 1) throw new ManagedBlockError('change scope version must be 1');
  return {
    schema: 'agent-workspace/change-scope',
    version: 1,
    paths: requireStringArray(record.paths, 'paths'),
    semanticSeams: requireStringArray(record.semanticSeams, 'semanticSeams'),
    prerequisites: requireStringArray(record.prerequisites, 'prerequisites'),
    integrationTarget: requireString(record.integrationTarget, 'integrationTarget'),
  };
}

function decodePendingPublication(raw: unknown): CoordinationState['pendingPublication'] {
  if (raw === null || raw === undefined) return null;
  const record = requireObject(raw, 'pendingPublication');
  const receipt = requireObject(record.receipt, 'pendingPublication.receipt');
  const publisher =
    record.publisher === null || record.publisher === undefined
      ? undefined
      : requireObject(record.publisher, 'pendingPublication.publisher');
  const completion = record.completion === null || record.completion === undefined
    ? undefined
    : requireObject(record.completion, 'pendingPublication.completion');
  const evidence = record.evidence === null || record.evidence === undefined
    ? undefined
    : requireObject(record.evidence, 'pendingPublication.evidence');
  return {
    receipt: {
      operationId: requireString(receipt.operationId, 'receipt.operationId'),
      kind: requireString(receipt.kind, 'receipt.kind'),
      payloadHash: requireString(receipt.payloadHash, 'receipt.payloadHash'),
      outcome: requireString(receipt.outcome, 'receipt.outcome'),
      actor: requireString(receipt.actor, 'receipt.actor'),
      occurredAt: requireString(receipt.occurredAt, 'receipt.occurredAt'),
    },
    publisher: publisher
      ? {
          publisherId: requireString(publisher.publisherId, 'publisher.publisherId'),
          leaseExpiresAt: requireString(publisher.leaseExpiresAt, 'publisher.leaseExpiresAt'),
        }
      : undefined,
    evidence: evidence
      ? evidence as unknown as RunEvidence
      : undefined,
    completion: completion
      ? {
          operationId: requireString(completion.operationId, 'completion.operationId'),
          sequence: requireNumber(completion.sequence, 'completion.sequence'),
          candidateWorkItemId: requireString(completion.candidateWorkItemId, 'completion.candidateWorkItemId'),
          runId: requireString(completion.runId, 'completion.runId'),
          outcome: completion.outcome === 'integrated' || completion.outcome === 'rejected'
            ? completion.outcome
            : (() => { throw new ManagedBlockError('completion.outcome must be integrated or rejected'); })(),
          at: requireString(completion.at, 'completion.at'),
          ...(completion.pullRequestRef === undefined || completion.pullRequestRef === null ? {} : { pullRequestRef: requireString(completion.pullRequestRef, 'completion.pullRequestRef') }),
          ...(completion.evidenceRef === undefined || completion.evidenceRef === null ? {} : { evidenceRef: requireString(completion.evidenceRef, 'completion.evidenceRef') }),
          ...(completion.blocker === undefined || completion.blocker === null ? {} : { blocker: requireString(completion.blocker, 'completion.blocker') as BlockerClassification }),
        }
      : undefined,
  };
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function hasBlockLabel(description: string, label: string): boolean {
  return description.includes(label);
}

export function blockPattern(): RegExp {
  return BLOCK_PATTERN;
}
