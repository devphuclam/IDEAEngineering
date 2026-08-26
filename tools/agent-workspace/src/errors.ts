// Classified failures per contracts/cli.md: stable errorCode + classification,
// exit codes 0 (success) / 2 (usage) / 1 (operational failure).

export type ErrorClassification =
  | 'capability'
  | 'credential'
  | 'quota'
  | 'network'
  | 'region'
  | 'conflict'
  | 'usage';

export const EXIT_OK = 0;
export const EXIT_FAILURE = 1;
export const EXIT_USAGE = 2;

export class WorkspaceError extends Error {
  readonly errorCode: string;
  readonly classification: ErrorClassification;

  constructor(errorCode: string, classification: ErrorClassification, message: string) {
    super(message);
    this.name = 'WorkspaceError';
    this.errorCode = errorCode;
    this.classification = classification;
  }
}

export function usageError(message: string): WorkspaceError {
  return new WorkspaceError('USAGE_ERROR', 'usage', message);
}

export function capabilityError(message: string): WorkspaceError {
  return new WorkspaceError('CAPABILITY_MISSING', 'capability', message);
}

export function credentialError(message: string): WorkspaceError {
  return new WorkspaceError('CREDENTIAL_REJECTED', 'credential', message);
}

export function quotaError(message: string): WorkspaceError {
  return new WorkspaceError('RATE_LIMITED', 'quota', message);
}

export function networkError(message: string): WorkspaceError {
  return new WorkspaceError('NETWORK_FAILURE', 'network', message);
}

export function conflictError(message: string): WorkspaceError {
  return new WorkspaceError('CONFLICT', 'conflict', message);
}

export function regionError(message: string): WorkspaceError {
  return new WorkspaceError('REGION_UNSUPPORTED', 'region', message);
}

export function normalizeError(
  error: unknown,
  fallbackCode = 'UNEXPECTED_FAILURE',
  fallbackClassification: ErrorClassification = 'capability',
): WorkspaceError {
  if (error instanceof WorkspaceError) return error;
  const message = error instanceof Error ? error.message : String(error);
  return new WorkspaceError(fallbackCode, fallbackClassification, message);
}

export function errorPayload(error: unknown): {
  error: { errorCode: string; classification: ErrorClassification; message: string };
} {
  const normalized = normalizeError(error);
  return {
    error: {
      errorCode: normalized.errorCode,
      classification: normalized.classification,
      message: normalized.message,
    },
  };
}

export function isWorkspaceError(error: unknown): error is WorkspaceError {
  return error instanceof WorkspaceError;
}
