// Azure authentication (contracts/azure-adapter.md): Entra is attempted
// first via `az account get-access-token` (Azure CLI used only as an Entra
// token broker); an explicitly enabled company-approved per-developer PAT
// fallback is allowed only when Entra credential acquisition is unavailable.
// No credential reaches arguments, files, output, or evidence.

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';

export class SecretString {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static from(value: string): SecretString {
    return new SecretString(value);
  }

  basicHeader(): string {
    const encoded = Buffer.from(`:${this.value}`, 'utf8').toString('base64');
    return `Basic ${encoded}`;
  }

  bearerHeader(): string {
    return `Bearer ${this.value}`;
  }

  redacted(): string {
    return '<redacted>';
  }

  toJSON(): string {
    return this.redacted();
  }

  hash(): string {
    return `sha256:${createHash('sha256').update(this.value, 'utf8').digest('hex')}`;
  }

  toString(): string {
    return this.redacted();
  }
}

export type AuthSource = 'entra' | 'pat-fallback' | 'none';

export interface AuthSelection {
  source: AuthSource;
  credential?: SecretString;
  detail: string;
}

export interface AzCli {
  accountGetAccessToken(tenantId?: string): Promise<{ token: string; expiresOn?: string }>;
}

type AzCliFailureKind = 'unavailable' | 'auth' | 'network' | 'quota' | 'invalid';

class AzCliFailure extends Error {
  readonly kind: AzCliFailureKind;

  constructor(kind: AzCliFailureKind) {
    super('Entra credential acquisition failed');
    this.name = 'AzCliFailure';
    this.kind = kind;
  }
}

export class SpawnedAzCli implements AzCli {
  async accountGetAccessToken(tenantId?: string): Promise<{ token: string; expiresOn?: string }> {
    const args = ['account', 'get-access-token', '--output', 'json'];
    if (tenantId) args.push('--tenant', tenantId);
    const output = await runJson(['az', ...args]);
    if (typeof output.accessToken !== 'string' || output.accessToken.length === 0) {
      throw new Error('az returned no access token');
    }
    return { token: output.accessToken, expiresOn: typeof output.expiresOn === 'string' ? output.expiresOn : undefined };
  }
}

export interface PatSource {
  read(): Promise<SecretString | undefined>;
}

export class EnvironmentPatSource implements PatSource {
  private readonly variableName: string;

  constructor(variableName: string) {
    this.variableName = variableName;
  }

  async read(): Promise<SecretString | undefined> {
    const value = process.env[this.variableName];
    if (!value || value.length === 0) return undefined;
    if (/^\$\{/.test(value)) return undefined;
    return SecretString.from(value);
  }
}

export class AzureAuthenticator {
  private readonly options: {
    azCli?: AzCli;
    tenantId?: string | null;
    patFallback: { mode: 'disabled' | 'company-approved'; source: PatSource };
    environment?: NodeJS.ProcessEnv;
  };

  constructor(options: {
    azCli?: AzCli;
    tenantId?: string | null;
    patFallback: { mode: 'disabled' | 'company-approved'; source: PatSource };
    environment?: NodeJS.ProcessEnv;
  }) {
    this.options = options;
  }

  async select(): Promise<AuthSelection> {
    const environment = this.options.environment ?? process.env;
    if (environment.AGENT_WORKSPACE_FORCE_PAT_FALLBACK === '1' && this.options.patFallback.mode === 'disabled') {
      return { source: 'none', detail: 'PAT fallback forced but not approved' };
    }
    try {
      const azCli = this.options.azCli ?? new SpawnedAzCli();
      const result = await azCli.accountGetAccessToken(this.options.tenantId ?? undefined);
      return { source: 'entra', credential: SecretString.from(result.token), detail: 'entra-user token acquired' };
    } catch (error) {
      if (this.options.patFallback.mode !== 'company-approved') {
        return {
          source: 'none',
          detail:
            'Entra credential acquisition unavailable and PAT fallback is not company-approved; ' +
          'live Azure operations are not-run',
        };
      }
      const fallbackAllowed = error instanceof AzCliFailure
        ? error.kind === 'unavailable'
        : error instanceof Error && /not installed|not found|launch failed|enoent/i.test(error.message);
      if (!fallbackAllowed) {
        return { source: 'none', detail: 'Entra credential acquisition failed; PAT fallback was not attempted' };
      }
      const pat = await this.options.patFallback.source.read();
      if (!pat) {
        return { source: 'none', detail: 'Entra unavailable and approved PAT variable is not set' };
      }
      return { source: 'pat-fallback', credential: pat, detail: 'company-approved PAT fallback' };
    }
  }
}

function runJson(args: string[]): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const child = spawn(args[0], args.slice(1), {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });
    child.on('error', () => reject(new AzCliFailure('unavailable')));
    child.on('close', (code) => {
      if (code !== 0) {
        const output = stderr.toLowerCase();
        const kind: AzCliFailureKind = /401|403|unauthori[sz]ed|forbidden|login|aadsts/.test(output)
          ? 'auth'
          : /429|quota|rate limit|throttl/.test(output)
            ? 'quota'
            : /network|timeout|timed out|dns|connect|unreachable/.test(output)
              ? 'network'
              : 'invalid';
        reject(new AzCliFailure(kind));
        return;
      }
      try {
        resolve(JSON.parse(stdout) as Record<string, unknown>);
      } catch {
        reject(new AzCliFailure('invalid'));
      }
    });
  });
}

/** Ephemeral Git authentication environment: http.extraHeader is never a credential file. */
export function gitAuthEnv(selection: AuthSelection): NodeJS.ProcessEnv {
  if (!selection.credential) return {};
  const header = selection.source === 'pat-fallback' ? selection.credential.basicHeader() : selection.credential.bearerHeader();
  return {
    GIT_CONFIG_COUNT: '1',
    GIT_CONFIG_KEY_0: 'http.extraHeader',
    GIT_CONFIG_VALUE_0: `Authorization: ${header}`,
  };
}
