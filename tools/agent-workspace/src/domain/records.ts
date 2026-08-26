import type { AgentCheckpoint, OperationReceipt, QueueCompletionSummary } from './types.ts';
import { canonicalJson, payloadHash } from './mutations.ts';

/** Provider-neutral immutable comment markers. */
export const OPERATION_RECEIPT_MARKER = 'AGENT-WORKSPACE:OPERATION-RECEIPT:V1';
export const QUEUE_COMPLETION_MARKER = 'AGENT-WORKSPACE:QUEUE-COMPLETION:V1';
export const EVIDENCE_MARKER = 'AGENT-WORKSPACE:RUN-EVIDENCE:V1';
export const CHECKPOINT_MARKER = 'AGENT-WORKSPACE:CHECKPOINT:V1';

export interface ParsedMarker<T extends Record<string, unknown> = Record<string, unknown>> {
  marker: string;
  operationId: string;
  payload: T;
  payloadHash: string;
}

export function serializeMarker(marker: string, operationId: string, payload: unknown): string {
  return `${marker} ${operationId}\n\n\`\`\`json\n${canonicalJson(payload)}\n\`\`\``;
}

export function parseMarker<T extends Record<string, unknown> = Record<string, unknown>>(
  marker: string,
  body: string,
): ParsedMarker<T> {
  const markerIndex = body.indexOf(marker);
  const header = body.split('\n').find((line) => line.startsWith(marker));
  if (!header) throw new Error(`missing marker ${marker}`);
  const operationId = header.slice(marker.length).trim();
  if (!operationId) throw new Error(`missing operation id for ${marker}`);
  const start = body.indexOf('```json', markerIndex);
  const end = body.indexOf('```', start + 7);
  if (start < 0 || end < 0) throw new Error(`marker ${marker} requires one JSON fence`);
  let parsed: unknown;
  try {
    parsed = JSON.parse(body.slice(start + 7, end).trim()) as unknown;
  } catch {
    throw new Error(`marker ${marker} payload is not valid JSON`);
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`marker ${marker} payload must be an object`);
  }
  return { marker, operationId, payload: parsed as T, payloadHash: payloadHash(parsed) };
}

export function operationReceiptBody(receipt: OperationReceipt): string {
  return serializeMarker(OPERATION_RECEIPT_MARKER, receipt.operationId, {
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
    workItemId: receipt.workItemId ?? null,
    references: receipt.references,
    blocker: receipt.blocker ?? null,
    nextAction: receipt.nextAction ?? null,
  });
}

export function parseOperationReceipt(body: string): OperationReceipt {
  const marker = parseMarker(OPERATION_RECEIPT_MARKER, body);
  const payload = marker.payload;
  if (payload.schema !== 'agent-workspace/operation-receipt' || payload.version !== 1) {
    throw new Error('operation receipt schema/version mismatch');
  }
  const required = ['kind', 'disposition', 'outcome', 'actor', 'occurredAt', 'publishedAt'];
  for (const key of required) {
    if (typeof payload[key] !== 'string') throw new Error(`operation receipt missing ${key}`);
  }
  if (!['applied', 'duplicate', 'conflict'].includes(String(payload.disposition))) {
    throw new Error('operation receipt has invalid disposition');
  }
  return {
    operationId: marker.operationId,
    kind: String(payload.kind),
    payloadHash: typeof payload.payloadHash === 'string' ? payload.payloadHash : marker.payloadHash,
    disposition: payload.disposition as OperationReceipt['disposition'],
    outcome: String(payload.outcome),
    actor: String(payload.actor),
    occurredAt: String(payload.occurredAt),
    publishedAt: String(payload.publishedAt),
    workItemId: typeof payload.workItemId === 'string' ? payload.workItemId : undefined,
    references: Array.isArray(payload.references) ? payload.references.map(String) : [],
    blocker: payload.blocker === null || payload.blocker === undefined ? undefined : String(payload.blocker) as OperationReceipt['blocker'],
    nextAction: typeof payload.nextAction === 'string' ? payload.nextAction : undefined,
  };
}

export function queueCompletionBody(summary: QueueCompletionSummary): string {
  return serializeMarker(QUEUE_COMPLETION_MARKER, summary.operationId, {
    schema: 'agent-workspace/queue-completion',
    version: 1,
    ...summary,
  });
}

export function evidenceBody(evidence: unknown, operationId: string): string {
  return serializeMarker(EVIDENCE_MARKER, operationId, {
    schema: 'agent-workspace/run-evidence',
    version: 1,
    evidence,
  });
}

export function checkpointBody(checkpoint: AgentCheckpoint): string {
  return serializeMarker(CHECKPOINT_MARKER, checkpoint.checkpointId, {
    schema: 'agent-workspace/checkpoint',
    version: 1,
    checkpoint,
  });
}

export function parseCheckpoint(body: string): AgentCheckpoint {
  const marker = parseMarker(CHECKPOINT_MARKER, body);
  const payload = marker.payload;
  if (payload.schema !== 'agent-workspace/checkpoint' || payload.version !== 1) {
    throw new Error('checkpoint schema/version mismatch');
  }
  if (typeof payload.checkpoint !== 'object' || payload.checkpoint === null) {
    throw new Error('checkpoint payload is missing');
  }
  return payload.checkpoint as unknown as AgentCheckpoint;
}
