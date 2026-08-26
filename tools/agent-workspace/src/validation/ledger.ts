import { mkdir } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { readJson, writeJsonAtomic } from '../adapters/local/state-files.ts';

export type ValidationOutcome = 'passed' | 'failed' | 'blocked' | 'not-run';
export type CleanupOperation = 'queue-entry.remove' | 'work-item.close' | 'pull-request.abandon' | 'source-branch.delete';

export interface ValidationTarget {
  organizationUrl: string;
  projectId: string;
  repositoryId: string;
  targetRef: string;
}

export interface ValidationLedgerEntry {
  artifactKey: string;
  intentSequence: number;
  operation: string;
  state: 'intent-recorded' | 'provider-accepted' | 'acknowledged' | 'cleanup-pending' | 'cleaned' | 'blocked';
  target: ValidationTarget;
  expectedRevisionOrHead: string | null;
  marker: string;
  providerRef: string | null;
  observedRevisionOrHead: string | null;
  cleanupOperation: CleanupOperation;
  cleanupPrerequisites: string[];
  cleanupOutcome: ValidationOutcome | 'pending';
  updatedAt: string;
}

export interface ValidationLedgerDocument {
  schema: 'agent-workspace/validation-ledger';
  version: 1;
  validationRunId: string;
  target: ValidationTarget;
  nextIntentSequence: number;
  entries: ValidationLedgerEntry[];
  handoff: { to: string; at: string; note?: string } | null;
}

export interface ValidationRecoveryMatch {
  providerRef: string;
  observedRevisionOrHead: string | null;
}

export interface LiveGateInput {
  environment?: NodeJS.ProcessEnv;
  runtimeReady: boolean;
  configReady: boolean;
  identityReady: boolean;
  permissionsReady: boolean;
  capabilityReady: boolean;
  networkReady: boolean;
  policyReady: boolean;
  target: ValidationTarget;
}

export interface LiveGateResult {
  outcome: ValidationOutcome;
  missing: string[];
  mode: 'live';
  target: ValidationTarget;
}

const SAFE_RUN_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/;

export function assertSafeValidationRunId(validationRunId: string): string {
  if (!SAFE_RUN_ID.test(validationRunId) || validationRunId.includes('..')) {
    throw new Error('validation run ID must be a bounded path-safe identifier');
  }
  return validationRunId;
}

function validationDirectory(root: string, validationRunId: string): string {
  const safeRunId = assertSafeValidationRunId(validationRunId);
  const base = resolve(root, '.workspace', 'validation');
  const directory = resolve(base, safeRunId);
  if (directory !== base && !directory.startsWith(`${base}${sep}`)) {
    throw new Error('validation ledger path escaped the workspace validation directory');
  }
  return directory;
}

export function validationMarker(validationRunId: string, artifactKey: string): string {
  return `agent-workspace:validation:${validationRunId}:${artifactKey}`;
}

export function evaluateLiveGate(input: LiveGateInput): LiveGateResult {
  const env = input.environment ?? process.env;
  const missing: string[] = [];
  if (env.AGENT_WORKSPACE_AZURE_LIVE !== '1') missing.push('AGENT_WORKSPACE_AZURE_LIVE=1');
  if (!input.runtimeReady) missing.push('runtimeProfile local-agent-v1 in Linux Dev Container or WSL2');
  if (!input.configReady) missing.push('complete provider configuration');
  if (!input.identityReady) missing.push('approved named identity');
  if (!input.permissionsReady) missing.push('effective permission probes');
  if (!input.capabilityReady) missing.push('read-only capability probes');
  if (!input.networkReady) missing.push('network access');
  if (!input.policyReady) missing.push('policy/process visibility');
  const allow = (name: string) => env[name] ?? '';
  if (allow('AGENT_WORKSPACE_AZURE_LIVE_ALLOW_ORGANIZATION_URL') !== input.target.organizationUrl) missing.push('exact organization allowlist');
  if (allow('AGENT_WORKSPACE_AZURE_LIVE_ALLOW_PROJECT_ID') !== input.target.projectId) missing.push('exact project allowlist');
  if (allow('AGENT_WORKSPACE_AZURE_LIVE_ALLOW_REPOSITORY_ID') !== input.target.repositoryId) missing.push('exact repository allowlist');
  if (allow('AGENT_WORKSPACE_AZURE_LIVE_ALLOW_TARGET_REF') !== input.target.targetRef) missing.push('exact target ref allowlist');
  return { outcome: missing.length === 0 ? 'passed' : 'not-run', missing, mode: 'live', target: input.target };
}

export class ValidationLedger {
  readonly filePath: string;
  private document: ValidationLedgerDocument;
  private readonly clock: () => string;
  private readonly root: string;

  private constructor(root: string, document: ValidationLedgerDocument, clock: () => string) {
    this.root = root;
    this.document = document;
    this.clock = clock;
    this.filePath = join(validationDirectory(root, document.validationRunId), 'ledger.json');
  }

  static async open(root: string, validationRunId: string, target: ValidationTarget, clock: () => string = () => new Date().toISOString()): Promise<ValidationLedger> {
    const safeRunId = assertSafeValidationRunId(validationRunId);
    const filePath = join(validationDirectory(root, safeRunId), 'ledger.json');
    const existing = await readJson<ValidationLedgerDocument>(filePath);
    const document = existing ?? { schema: 'agent-workspace/validation-ledger', version: 1, validationRunId: safeRunId, target, nextIntentSequence: 1, entries: [], handoff: null };
    if (document.validationRunId !== safeRunId || document.target.organizationUrl !== target.organizationUrl || document.target.projectId !== target.projectId || document.target.repositoryId !== target.repositoryId || document.target.targetRef !== target.targetRef) throw new Error('validation ledger target/run mismatch');
    const ledger = new ValidationLedger(root, document, clock);
    await ledger.persist();
    return ledger;
  }

  static async openExisting(root: string, validationRunId: string, target: ValidationTarget, clock: () => string = () => new Date().toISOString()): Promise<ValidationLedger | undefined> {
    const safeRunId = assertSafeValidationRunId(validationRunId);
    const filePath = join(validationDirectory(root, safeRunId), 'ledger.json');
    const existing = await readJson<ValidationLedgerDocument>(filePath);
    if (!existing) return undefined;
    if (existing.validationRunId !== safeRunId || existing.target.organizationUrl !== target.organizationUrl || existing.target.projectId !== target.projectId || existing.target.repositoryId !== target.repositoryId || existing.target.targetRef !== target.targetRef) throw new Error('validation ledger target/run mismatch');
    return new ValidationLedger(root, existing, clock);
  }

  snapshot(): ValidationLedgerDocument { return structuredClone(this.document) as ValidationLedgerDocument; }

  async recordIntent(input: { artifactKey: string; operation: string; expectedRevisionOrHead: string | null; cleanupOperation: CleanupOperation; cleanupPrerequisites?: string[] }): Promise<ValidationLedgerEntry> {
    const entry: ValidationLedgerEntry = {
      artifactKey: input.artifactKey,
      intentSequence: this.document.nextIntentSequence++,
      operation: input.operation,
      state: 'intent-recorded',
      target: this.document.target,
      expectedRevisionOrHead: input.expectedRevisionOrHead,
      marker: validationMarker(this.document.validationRunId, input.artifactKey),
      providerRef: null,
      observedRevisionOrHead: null,
      cleanupOperation: input.cleanupOperation,
      cleanupPrerequisites: [...(input.cleanupPrerequisites ?? [])],
      cleanupOutcome: 'pending',
      updatedAt: this.clock(),
    };
    this.document.entries.push(entry);
    await this.persist();
    return structuredClone(entry) as ValidationLedgerEntry;
  }

  async recordProviderAcceptance(artifactKey: string, providerRef: string, observedRevisionOrHead: string | null): Promise<ValidationLedgerEntry> {
    const entry = this.find(artifactKey);
    entry.state = 'provider-accepted';
    entry.providerRef = providerRef;
    entry.observedRevisionOrHead = observedRevisionOrHead;
    entry.updatedAt = this.clock();
    await this.persist();
    return structuredClone(entry) as ValidationLedgerEntry;
  }

  async recordProviderObservation(artifactKey: string, observedRevisionOrHead: string): Promise<ValidationLedgerEntry> {
    const entry = this.find(artifactKey);
    if (!entry.providerRef) throw new Error(`validation artifact ${artifactKey} has no provider reference`);
    entry.observedRevisionOrHead = observedRevisionOrHead;
    entry.updatedAt = this.clock();
    await this.persist();
    return structuredClone(entry) as ValidationLedgerEntry;
  }

  async acknowledge(artifactKey: string): Promise<ValidationLedgerEntry> {
    const entry = this.find(artifactKey);
    if (entry.state !== 'provider-accepted' && entry.state !== 'acknowledged') throw new Error(`validation artifact ${artifactKey} cannot be acknowledged before provider acceptance`);
    entry.state = 'acknowledged';
    entry.updatedAt = this.clock();
    await this.persist();
    return structuredClone(entry) as ValidationLedgerEntry;
  }

  async markCleanup(artifactKey: string, outcome: ValidationOutcome, reason?: string): Promise<ValidationLedgerEntry> {
    const entry = this.find(artifactKey);
    entry.cleanupOutcome = outcome;
    entry.state = outcome === 'passed' ? 'cleaned' : 'blocked';
    if (reason) entry.cleanupPrerequisites = [...entry.cleanupPrerequisites, reason];
    entry.updatedAt = this.clock();
    await this.persist();
    return structuredClone(entry) as ValidationLedgerEntry;
  }

  async handoff(to: string, note?: string): Promise<void> {
    this.document.handoff = { to, at: this.clock(), note };
    await this.persist();
  }

  async recover(scan: (marker: string, target: ValidationTarget) => Promise<Array<string | ValidationRecoveryMatch>>, allowMutation: boolean): Promise<{ repaired: string[]; blocked: string[] }> {
    const repaired: string[] = [];
    const blocked: string[] = [];
    let changed = false;
    const recoverableEntries = this.document.entries
      .filter((item) => item.state !== 'cleaned')
      .sort((left, right) => right.intentSequence - left.intentSequence);
    for (const entry of recoverableEntries) {
      const matches = await scan(entry.marker, this.document.target);
      if (matches.length === 1) {
        const match = typeof matches[0] === 'string' ? { providerRef: matches[0], observedRevisionOrHead: null } : matches[0];
        const providerDrifted = entry.providerRef !== null && entry.providerRef !== match.providerRef;
        const revisionDrifted = entry.observedRevisionOrHead !== null
          && match.observedRevisionOrHead !== null
          && entry.observedRevisionOrHead !== match.observedRevisionOrHead;
        const explainedRevisionAdvance = revisionDrifted && this.document.entries.some((candidate) =>
          candidate.intentSequence > entry.intentSequence
          && candidate.providerRef === match.providerRef
          && candidate.expectedRevisionOrHead === entry.observedRevisionOrHead
          && candidate.observedRevisionOrHead === match.observedRevisionOrHead
          && ['provider-accepted', 'acknowledged', 'cleanup-pending', 'cleaned'].includes(candidate.state),
        );
        const missingObservation = entry.providerRef !== null && entry.observedRevisionOrHead === null;
        const missingMatchObservation = match.observedRevisionOrHead === null;
        if (providerDrifted || (revisionDrifted && !explainedRevisionAdvance) || missingObservation || missingMatchObservation) {
          blocked.push(`${entry.artifactKey}: provider reference or revision/head drifted or was not recorded`);
          if (entry.state !== 'blocked') { entry.state = 'blocked'; entry.updatedAt = this.clock(); changed = true; }
        } else if (explainedRevisionAdvance) {
          entry.observedRevisionOrHead = match.observedRevisionOrHead;
          entry.updatedAt = this.clock();
          repaired.push(entry.artifactKey);
          changed = true;
        } else if (!entry.providerRef) {
          entry.providerRef = match.providerRef;
          entry.observedRevisionOrHead = match.observedRevisionOrHead;
          entry.state = 'provider-accepted';
          entry.updatedAt = this.clock();
          repaired.push(entry.artifactKey);
          changed = true;
        }
      } else if (matches.length === 0) {
        blocked.push(`${entry.artifactKey}: marker not found`);
        if (entry.state !== 'blocked') { entry.state = 'blocked'; entry.updatedAt = this.clock(); changed = true; }
      } else {
        blocked.push(`${entry.artifactKey}: ambiguous marker`);
        if (entry.state !== 'blocked') { entry.state = 'blocked'; entry.updatedAt = this.clock(); changed = true; }
      }
    }
    if (allowMutation && changed) await this.persist();
    return { repaired, blocked };
  }

  private find(artifactKey: string): ValidationLedgerEntry {
    const entry = this.document.entries.find((candidate) => candidate.artifactKey === artifactKey);
    if (!entry) throw new Error(`validation artifact ${artifactKey} is not in the ledger`);
    return entry;
  }

  private async persist(): Promise<void> {
    await mkdir(validationDirectory(this.root, this.document.validationRunId), { recursive: true });
    await writeJsonAtomic(this.filePath, this.document);
  }
}
