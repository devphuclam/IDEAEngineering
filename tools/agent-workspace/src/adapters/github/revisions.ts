// GitHub canonical revision projection and reconciliation
// (contracts/github-adapter.md): an Issue/comment stream is projected into
// canonical state; the deterministic earliest valid winner is authoritative;
// stale/losing proposals are retained as immutable history but never control
// a claim, Run, sandbox, queue lease, or integration decision.

import { createHash } from 'node:crypto';
import type { OperationReceipt, ProviderRevision } from '../../domain/types.ts';
import { canonicalJson, payloadHash } from '../../domain/mutations.ts';

export class GithubRevisionError extends Error {
  constructor(message: string) {
    super(`github revision: ${message}`);
    this.name = 'GithubRevisionError';
  }
}

export const OPERATION_RECEIPT_MARKER = 'AGENT-WORKSPACE:OPERATION-RECEIPT:V1';
export const QUEUE_PROPOSAL_MARKER = 'AGENT-WORKSPACE:QUEUE-PROPOSAL:V1';
export const QUEUE_COMPLETION_MARKER = 'AGENT-WORKSPACE:QUEUE-COMPLETION:V1';
export const CHECKPOINT_MARKER = 'AGENT-WORKSPACE:CHECKPOINT:V1';

export interface WireComment {
  id: number;
  body: string;
  createdAt: string;
}

/** Immutable queue-key vector: GitHub numeric Repository ID serialized as decimal. */
export function githubQueueKey(canonicalRepositoryId: string, targetRef: string): string {
  return createHash('sha256')
    .update(`github\n${canonicalRepositoryId}\n${targetRef}`, 'utf8')
    .digest('hex');
}

export function queueKeyTag(queueKey: string): string {
  return `agent-workspace:queue-key:sha256:${queueKey}`;
}

export const QUEUE_DISCOVERY_LABEL = 'agent-workspace:integration-queue';

/** Exact normalized/sorted queue-label projection; missing/duplicate/mismatched pairs block discovery. */
export function projectQueueLabels(labels: string[], queueKey: string): string[] {
  const normalized = labels
    .filter((label): label is string => typeof label === 'string')
    .map((label) => label.trim().toLowerCase())
    .filter((label) => label.length > 0);
  const discovery = normalized.filter((label) => label === QUEUE_DISCOVERY_LABEL);
  const keyLabels = normalized.filter((label) => label === queueKeyTag(queueKey));
  if (discovery.length !== 1 || keyLabels.length !== 1) {
    throw new GithubRevisionError(
      `queue label projection must contain exactly one ${QUEUE_DISCOVERY_LABEL} and one queue-key label`,
    );
  }
  return [...new Set([...discovery, ...keyLabels])].sort();
}

export interface ProposalEnvelope {
  marker: string;
  operationId: string;
  payloadHash: string;
  payload: Record<string, unknown>;
}

export function serializeProposal(marker: string, operationId: string, payload: unknown): string {
  const canonical = canonicalJson(payload);
  return [
    `${marker} ${operationId}`,
    '',
    '```json',
    canonical,
    '```',
  ].join('\n');
}

export function parseProposal(marker: string, body: string): ProposalEnvelope {
  const lines = body.split('\n');
  const header = lines.find((line) => line.startsWith(marker));
  if (!header) throw new GithubRevisionError(`comment does not start with ${marker}`);
  const operationId = header.slice(marker.length).trim();
  if (!operationId) throw new GithubRevisionError(`missing operation id after ${marker}`);
  const fenceStart = lines.findIndex((line) => line.trim() === '```json');
  const fenceEnd = lines.findIndex((line, index) => index > fenceStart && line.trim() === '```');
  if (fenceStart < 0 || fenceEnd < 0) {
    throw new GithubRevisionError(`${marker} comment must contain one fenced JSON payload`);
  }
  const canonical = lines.slice(fenceStart + 1, fenceEnd).join('\n');
  let payload: unknown;
  try {
    payload = JSON.parse(canonical) as unknown;
  } catch {
    throw new GithubRevisionError(`${marker} comment payload is not valid JSON`);
  }
  return {
    marker,
    operationId,
    payloadHash: payloadHash(payload),
    payload: payload as Record<string, unknown>,
  };
}

export interface ReconcileInput {
  comments: WireComment[];
  proposalMarker: string;
  expectedOperationId: string;
  expectedPayloadHash: string;
}

export interface ReconcileOutcome {
  disposition: 'applied' | 'duplicate' | 'conflict';
  winner: ProposalEnvelope | undefined;
  receipt: OperationReceipt | undefined;
  reasons: string[];
}

/**
 * Append-reread-reconcile: project the comment stream, find proposals with
 * the exact operation ID, and reconcile. The deterministic earliest valid
 * proposal wins; any other proposal with the same operation is non-authoritative.
 */
export function reconcileAppendStream(input: ReconcileInput): ReconcileOutcome {
  const reasons: string[] = [];
  const proposals: ProposalEnvelope[] = [];
  const receipts: OperationReceipt[] = [];

  for (const comment of input.comments) {
    if (comment.body.startsWith(OPERATION_RECEIPT_MARKER)) {
      try {
        receipts.push(parseOperationReceipt(comment.body));
      } catch (error) {
        reasons.push(`corrupt receipt comment ${comment.id}: ${errorMessage(error)}`);
      }
      continue;
    }
    if (comment.body.startsWith(input.proposalMarker)) {
      try {
        proposals.push(parseProposal(input.proposalMarker, comment.body));
      } catch (error) {
        reasons.push(`corrupt proposal comment ${comment.id}: ${errorMessage(error)}`);
      }
    }
  }

  const matchingReceipt = receipts.find(
    (receipt) => receipt.operationId === input.expectedOperationId,
  );
  if (matchingReceipt) {
    if (matchingReceipt.payloadHash !== input.expectedPayloadHash) {
      return {
        disposition: 'conflict',
        winner: undefined,
        receipt: matchingReceipt,
        reasons: [...reasons, 'receipt payload hash mismatch'],
      };
    }
    return {
      disposition: 'duplicate',
      winner: undefined,
      receipt: matchingReceipt,
      reasons: [...reasons, 'durable matching receipt'],
    };
  }

  const candidates = proposals.filter(
    (proposal) => proposal.operationId === input.expectedOperationId,
  );
  if (candidates.length === 0) {
    return { disposition: 'conflict', winner: undefined, receipt: undefined, reasons: [...reasons, 'no proposal found'] };
  }
  if (candidates.some((candidate) => candidate.payloadHash !== input.expectedPayloadHash)) {
    return {
      disposition: 'conflict',
      winner: undefined,
      receipt: undefined,
      reasons: [...reasons, 'operation-ID/hash mismatch'],
    };
  }

  // Deterministic earliest valid winner in comment order; later duplicates are non-authoritative.
  const winner = candidates[0];
  if (candidates.length > 1) {
    reasons.push('multiple proposals share the operation; only the earliest is authoritative');
  }
  return {
    disposition: 'applied',
    winner,
    receipt: undefined,
    reasons,
  };
}

/** Canonical hash of a coordination issue/comment stream: sha256 of ordered comment ids + canonical bodies. */
export function streamRevision(comments: WireComment[]): ProviderRevision {
  const canonical = comments
    .map((comment) => `${comment.id}:${comment.body}`)
    .join('\n');
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

export function parseOperationReceipt(body: string): OperationReceipt {
  const envelope = parseProposal(OPERATION_RECEIPT_MARKER, body);
  const payload = envelope.payload as Partial<OperationReceipt> & {
    schema?: string;
    version?: number;
  };
  if (payload.schema !== 'agent-workspace/operation-receipt' || payload.version !== 1) {
    throw new GithubRevisionError('operation receipt payload schema/version mismatch');
  }
  if (
    typeof payload.kind !== 'string' ||
    typeof payload.disposition !== 'string' ||
    typeof payload.outcome !== 'string' ||
    typeof payload.actor !== 'string' ||
    typeof payload.occurredAt !== 'string' ||
    typeof payload.publishedAt !== 'string'
  ) {
    throw new GithubRevisionError('operation receipt payload is missing required fields');
  }
    return {
      operationId: envelope.operationId,
      kind: payload.kind,
      payloadHash: typeof payload.payloadHash === 'string' ? payload.payloadHash : envelope.payloadHash,
    disposition: payload.disposition as OperationReceipt['disposition'],
    outcome: payload.outcome,
    actor: payload.actor,
    occurredAt: payload.occurredAt,
    publishedAt: payload.publishedAt,
    workItemId: typeof payload.workItemId === 'string' ? payload.workItemId : undefined,
    references: Array.isArray(payload.references) ? payload.references.map(String) : [],
    blocker: payload.blocker === null || payload.blocker === undefined ? undefined : (payload.blocker as OperationReceipt['blocker']),
    nextAction: typeof payload.nextAction === 'string' ? payload.nextAction : undefined,
  };
}

export function operationReceiptBody(receipt: OperationReceipt): string {
  const payload = {
    schema: 'agent-workspace/operation-receipt',
    version: 1,
    operationId: receipt.operationId,
    kind: receipt.kind,
    payloadHash: receipt.payloadHash,
    disposition: receipt.disposition,
    outcome: receipt.outcome,
    actor: receipt.actor,
    occurredAt: receipt.occurredAt,
    publishedAt: receipt.publishedAt,
    workItemId: receipt.workItemId,
    references: receipt.references,
    blocker: receipt.blocker ?? null,
    nextAction: receipt.nextAction ?? null,
  };
  return serializeProposal(OPERATION_RECEIPT_MARKER, receipt.operationId, payload);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}