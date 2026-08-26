// Evidence redaction rules per FR-015: credentials, personal Agent sessions,
// unnecessary prompts, complete transcripts, and full source snapshots are
// excluded or redacted before persistence.

import type { RunEvidence, VerificationResult } from './types.ts';

export const DEFAULT_RETENTION_DAYS = 30;

const CREDENTIAL_PATTERNS: RegExp[] = [
  /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/g,
  /\b(?:sk-[A-Za-z0-9]{20,})\b/g,
  /\b(?:password|passwd|pwd|secret|token|api[_-]?key|authorization|client[_-]?secret)\s*[:=]\s*[^\s"'`]+/gi,
  /gh auth token[^\n]*/gi,
];

const PROMPT_TRANSCRIPT_MARKERS: RegExp[] = [
  /(?:prompt|transcript|conversation|chat log|agent session)\s*[:=]\s*[^\r\n]*/gi,
];

const SOURCE_SNAPSHOT_PATTERN = /(?:```|~~~)(?:[a-zA-Z0-9+#-]*)\n[\s\S]{40,}\n(?:```|~~~)/g;

export function redactText(text: string): string {
  let result = text;
  for (const pattern of CREDENTIAL_PATTERNS) {
    result = result.replace(pattern, '[REDACTED]');
  }
  result = result.replace(SOURCE_SNAPSHOT_PATTERN, '[REDACTED SOURCE SNAPSHOT]');
  for (const pattern of PROMPT_TRANSCRIPT_MARKERS) {
    result = result.replace(pattern, '[REDACTED PROMPT/TRANSCRIPT]\n');
  }
  return result;
}

function redactVerification(verification: VerificationResult[]): VerificationResult[] {
  return verification.map((v) => ({
    ...v,
    command: redactText(v.command),
    evidenceRef: v.evidenceRef ? redactText(v.evidenceRef) : undefined,
  }));
}

export function withDefaultRetention(
  evidence: RunEvidence,
  now = new Date(),
  days = DEFAULT_RETENTION_DAYS,
): RunEvidence {
  if (evidence.retention) return evidence;
  const expiresAt = new Date(now.getTime() + days * 86_400_000).toISOString();
  return { ...evidence, retention: { days, expiresAt } };
}

export function redactEvidence(evidence: RunEvidence): RunEvidence {
  const retained = withDefaultRetention(evidence);
  return {
    ...retained,
    owner: redactText(evidence.owner),
    providerMarker: evidence.providerMarker ? redactText(evidence.providerMarker) : undefined,
    providerRevision: evidence.providerRevision ? redactText(evidence.providerRevision) : undefined,
    branch: evidence.branch ? redactText(evidence.branch) : undefined,
    pullRequestRef: evidence.pullRequestRef ? redactText(evidence.pullRequestRef) : undefined,
    targetCommit: evidence.targetCommit ? redactText(evidence.targetCommit) : undefined,
    verification: redactVerification(evidence.verification),
    nextAction: evidence.nextAction ? redactText(evidence.nextAction) : undefined,
    unresolvedRisks: evidence.unresolvedRisks?.map(redactText),
    ownerHistory: evidence.ownerHistory?.map((entry) => ({
      ...entry,
      from: redactText(entry.from),
      to: redactText(entry.to),
    })),
    actions: evidence.actions?.map((action) => ({
      ...action,
      actor: redactText(action.actor),
      action: redactText(action.action),
    })),
  };
}
