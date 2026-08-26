// Strict non-secret provider configuration (contracts/provider-configuration.md).
// The committed root default explicitly selects `github` with `runtimeProfile: null`.
// No remote-derived fallback exists: a missing or invalid selection fails closed.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const SUPPORTED_PROVIDERS = ['github', 'azure-devops'] as const;
export type ProviderName = (typeof SUPPORTED_PROVIDERS)[number];
export type RuntimeProfileName = 'local-agent-v1';

export interface ProcessOverride {
  open: string;
  claimed: string;
  'in-progress': string;
  'ready-for-integration': string;
  integrated: string;
  blocked: string;
}

export interface AzureProcessConfig {
  profile: string;
  workItemType: string;
  expectedFingerprint: string | null;
  override: ProcessOverride | null;
}

export interface AzurePatFallbackConfig {
  mode: 'disabled' | 'company-approved';
  secretEnvironmentVariable: string;
}

export interface AzureAuthConfig {
  preferred: 'entra-user';
  tenantId: string | null;
  patFallback: AzurePatFallbackConfig;
}

export interface AzureRemoteRoles {
  companyOrigin: string;
  templateUpstream: string;
}

export interface AzureDevOpsConfig {
  organizationUrl: string;
  project: { name: string; expectedId: string | null };
  repository: { name: string; expectedId: string | null };
  integrationTarget: string;
  process: AzureProcessConfig;
  authentication: AzureAuthConfig;
  remoteRoles: AzureRemoteRoles;
}

export interface GithubConfig {
  remote: string;
}

export interface ProviderConfig {
  schemaVersion: number;
  provider: ProviderName;
  runtimeProfile: RuntimeProfileName | null;
  github?: GithubConfig;
  azureDevOps?: AzureDevOpsConfig;
  verification: { commands: string[] };
  reviewIntent: { minimumHumanApprovals: number; authorSelfReview: boolean };
  liveValidation?: {
    modeFlagEnvironmentVariable: string;
    allowlistEnvironmentPrefix: string;
  };
}

export class ProviderConfigError extends Error {
  constructor(message: string) {
    super(`provider configuration: ${message}`);
    this.name = 'ProviderConfigError';
  }
}

const SECRET_PATTERN =
  /(password|passwd|pwd|secret|token|pat|api[_-]?key|private[_-]?key|credential|bearer|authorization)/i;

function assertNonSecret(value: unknown, path: string): void {
  if (typeof value !== 'string') return;
  if (/^[A-Z][A-Z0-9_]{3,}$/.test(value)) return;
  if (SECRET_PATTERN.test(value) && /[A-Za-z0-9_-]{16,}/.test(value)) {
    throw new ProviderConfigError(`${path} appears to carry a secret value; only names are allowed`);
  }
}

export function validateProviderConfig(raw: unknown, source = 'agent-workspace.config.json'): ProviderConfig {
  if (typeof raw !== 'object' || raw === null) {
    throw new ProviderConfigError(`${source} is not a JSON object`);
  }
  const config = raw as Record<string, unknown>;
  if (config.schemaVersion !== 1) {
    throw new ProviderConfigError(`${source}: schemaVersion must be 1`);
  }
  if (!SUPPORTED_PROVIDERS.includes(config.provider as ProviderName)) {
    throw new ProviderConfigError(`${source}: exactly one supported provider is required; no implicit fallback`);
  }
  const provider = config.provider as ProviderName;

  const runtimeProfile = config.runtimeProfile ?? null;
  if (runtimeProfile !== null && runtimeProfile !== 'local-agent-v1') {
    throw new ProviderConfigError(`${source}: runtimeProfile must be omitted, null, or local-agent-v1`);
  }

  const verification = config.verification as Record<string, unknown> | undefined;
  if (!verification || !Array.isArray(verification.commands) || verification.commands.length === 0) {
    throw new ProviderConfigError(`${source}: verification.commands must be a non-empty array`);
  }
  for (const command of verification.commands) {
    if (typeof command !== 'string' || /[\r\n]/.test(command)) {
      throw new ProviderConfigError(`${source}: verification commands must be plain project-relative commands`);
    }
  }

  const reviewIntent = config.reviewIntent as Record<string, unknown> | undefined;
  if (!reviewIntent || reviewIntent.minimumHumanApprovals !== 0 || reviewIntent.authorSelfReview !== true) {
    throw new ProviderConfigError(`${source}: reviewIntent template values must be exactly 0 and true`);
  }

  const liveValidation = config.liveValidation as Record<string, unknown> | undefined;
  if (liveValidation) {
    if (
      typeof liveValidation.modeFlagEnvironmentVariable !== 'string' ||
      typeof liveValidation.allowlistEnvironmentPrefix !== 'string' ||
      !/^[A-Z][A-Z0-9_]*$/.test(liveValidation.modeFlagEnvironmentVariable) ||
      !/^[A-Z][A-Z0-9_]*$/.test(liveValidation.allowlistEnvironmentPrefix)
    ) {
      throw new ProviderConfigError(`${source}: liveValidation requires environment variable names`);
    }
  }

  if (provider === 'github') {
    const github = config.github as Record<string, unknown> | undefined;
    if (!github || typeof github.remote !== 'string' || github.remote.length === 0) {
      throw new ProviderConfigError(`${source}: github.remote must name the template remote`);
    }
    return {
      schemaVersion: 1,
      provider,
      runtimeProfile,
      github: { remote: github.remote },
      verification: { commands: verification.commands as string[] },
      reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
      liveValidation: liveValidation as ProviderConfig['liveValidation'],
    };
  }

  const azure = config.azureDevOps as Record<string, unknown> | undefined;
  if (!azure) {
    throw new ProviderConfigError(`${source}: azure-devops provider requires azureDevOps configuration`);
  }
  const azureDevOps = validateAzureDevOpsConfig(azure, source);
  return {
    schemaVersion: 1,
    provider,
    runtimeProfile,
    azureDevOps,
    verification: { commands: verification.commands as string[] },
    reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
    liveValidation: liveValidation as ProviderConfig['liveValidation'],
  };
}

export function validateAzureDevOpsConfig(azure: Record<string, unknown>, source: string): AzureDevOpsConfig {
  const organizationUrl = azure.organizationUrl;
  if (
    typeof organizationUrl !== 'string' ||
    !/^https:\/\/dev\.azure\.com\/[A-Za-z0-9][A-Za-z0-9-]*\/?$/.test(organizationUrl)
  ) {
    throw new ProviderConfigError(
      `${source}: organizationUrl must be an HTTPS dev.azure.com URL with exactly one organization segment`,
    );
  }
  if (/\/[^/]*[?&#]/.test(organizationUrl)) {
    throw new ProviderConfigError(`${source}: organizationUrl must not carry userinfo, query, or fragment`);
  }

  const project = azure.project as Record<string, unknown> | undefined;
  const repository = azure.repository as Record<string, unknown> | undefined;
  if (!project || typeof project.name !== 'string' || project.name.length === 0) {
    throw new ProviderConfigError(`${source}: project.name is required`);
  }
  if (!repository || typeof repository.name !== 'string' || repository.name.length === 0) {
    throw new ProviderConfigError(`${source}: repository.name is required`);
  }

  const integrationTarget = azure.integrationTarget;
  if (
    typeof integrationTarget !== 'string' ||
    !/^refs\/heads\/[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(integrationTarget)
  ) {
    throw new ProviderConfigError(`${source}: integrationTarget must be a fully qualified refs/heads/... ref`);
  }

  const process = azure.process as Record<string, unknown> | undefined;
  if (!process || typeof process.profile !== 'string' || typeof process.workItemType !== 'string') {
    throw new ProviderConfigError(`${source}: process.profile and process.workItemType are required`);
  }
  const expectedFingerprint = process.expectedFingerprint ?? null;
  if (expectedFingerprint !== null && typeof expectedFingerprint !== 'string') {
    throw new ProviderConfigError(`${source}: process.expectedFingerprint must be a string or null`);
  }
  const override = (process.override ?? null) as ProcessOverride | null;
  if (override !== null) {
    const required = ['open', 'claimed', 'in-progress', 'ready-for-integration', 'integrated', 'blocked'];
    for (const key of required) {
      if (typeof override[key as keyof ProcessOverride] !== 'string') {
        throw new ProviderConfigError(`${source}: process.override requires all six neutral states`);
      }
    }
    const extra = Object.keys(override).filter((key) => !required.includes(key));
    if (extra.length > 0) {
      throw new ProviderConfigError(`${source}: process.override has unknown keys: ${extra.join(', ')}`);
    }
  }

  const authentication = azure.authentication as Record<string, unknown> | undefined;
  if (!authentication || authentication.preferred !== 'entra-user') {
    throw new ProviderConfigError(`${source}: authentication.preferred must be entra-user`);
  }
  const patFallback = authentication.patFallback as Record<string, unknown> | undefined;
  if (
    !patFallback ||
    (patFallback.mode !== 'disabled' && patFallback.mode !== 'company-approved') ||
    typeof patFallback.secretEnvironmentVariable !== 'string' ||
    patFallback.secretEnvironmentVariable.length === 0
  ) {
    throw new ProviderConfigError(
      `${source}: patFallback requires mode disabled|company-approved and a secret environment variable name`,
    );
  }
  assertNonSecret(patFallback.secretEnvironmentVariable, `${source}.authentication.patFallback.secretEnvironmentVariable`);

  const remoteRoles = azure.remoteRoles as Record<string, unknown> | undefined;
  if (
    !remoteRoles ||
    typeof remoteRoles.companyOrigin !== 'string' ||
    typeof remoteRoles.templateUpstream !== 'string' ||
    remoteRoles.companyOrigin === remoteRoles.templateUpstream ||
    remoteRoles.companyOrigin.length === 0
  ) {
    throw new ProviderConfigError(`${source}: remoteRoles requires distinct companyOrigin and templateUpstream names`);
  }

  return {
    organizationUrl,
    project: {
      name: project.name,
      expectedId: (project.expectedId as string | null | undefined) ?? null,
    },
    repository: {
      name: repository.name,
      expectedId: (repository.expectedId as string | null | undefined) ?? null,
    },
    integrationTarget,
    process: {
      profile: process.profile,
      workItemType: process.workItemType,
      expectedFingerprint,
      override,
    },
    authentication: {
      preferred: 'entra-user',
      tenantId: (authentication.tenantId as string | null | undefined) ?? null,
      patFallback: {
        mode: patFallback.mode as 'disabled' | 'company-approved',
        secretEnvironmentVariable: patFallback.secretEnvironmentVariable,
      },
    },
    remoteRoles: {
      companyOrigin: remoteRoles.companyOrigin,
      templateUpstream: remoteRoles.templateUpstream,
    },
  };
}

export function loadProviderConfig(path = resolve('agent-workspace.config.json')): ProviderConfig {
  const raw = readFileSync(path, 'utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ProviderConfigError(`${path} is not valid JSON`);
  }
  return validateProviderConfig(parsed, path);
}

export function parseProviderConfig(json: string): ProviderConfig {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new ProviderConfigError('configuration string is not valid JSON');
  }
  return validateProviderConfig(parsed, 'configuration string');
}