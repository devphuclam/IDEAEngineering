import { errorPayload, normalizeError } from '../errors.ts';
import { redactText } from '../domain/redaction.ts';

export function reportCommandError(error: unknown, json: boolean): number {
  const normalized = normalizeError(error);
  if (json) {
    const payload = errorPayload(normalized);
    payload.error.message = redactText(payload.error.message);
    process.stdout.write(`${JSON.stringify(payload)}\n`);
  } else {
    process.stderr.write(`${normalized.classification}: ${redactText(normalized.message)} (${normalized.errorCode})\n`);
  }
  return normalized.classification === 'usage' ? 2 : 1;
}
