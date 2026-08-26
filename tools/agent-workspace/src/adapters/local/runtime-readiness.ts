import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import type { RuntimeReadinessReport } from '../../domain/types.ts';
import type { RuntimeReadinessAdapter } from '../ports.ts';

export interface RuntimeInspectionOptions {
  runtimeProfile: 'local-agent-v1' | null | undefined;
  cwd?: string;
  platform?: NodeJS.Platform;
  environment?: NodeJS.ProcessEnv;
  nodeVersion?: string;
  hasCodexDesktop?: boolean;
  hasAzCli?: boolean;
}

export async function inspectRuntime(options: RuntimeInspectionOptions): Promise<RuntimeReadinessReport> {
  const cwd = options.cwd ?? process.cwd();
  const environment = options.environment ?? process.env;
  const nodeVersion = options.nodeVersion ?? process.versions.node;
  const platform = options.platform ?? process.platform;
  if (options.runtimeProfile === null || options.runtimeProfile === undefined) {
    return { state: 'not-selected', detail: 'runtimeProfile is omitted or null; Local Agent Runner is not selected', checks: [{ name: 'runtime-profile', outcome: 'not-run', detail: 'select local-agent-v1 to inspect runner prerequisites' }] };
  }
  const isWsl = platform === 'linux' && (Boolean(environment.WSL_DISTRO_NAME) || /microsoft/i.test(environment.WSL_INTEROP ?? ''));
  const isLinuxContainer = platform === 'linux' && (Boolean(environment.REMOTE_CONTAINERS) || Boolean(environment.CODESPACES) || Boolean(environment.DEVCONTAINER) || await pathExists('/.dockerenv'));
  const checks: RuntimeReadinessReport['checks'] = [];
  const nodeMajor = Number.parseInt(nodeVersion.split('.')[0] ?? '0', 10);
  checks.push({ name: 'runtime.environment', outcome: isWsl || isLinuxContainer ? 'passed' : 'unsupported', detail: isWsl ? 'WSL2' : isLinuxContainer ? 'Linux Dev Container' : 'native Windows/unsupported host' });
  checks.push({ name: 'runtime.node', outcome: nodeMajor >= 24 ? 'passed' : 'failed', detail: `Node ${nodeVersion}; requires >=24` });
  checks.push({ name: 'runtime.git', outcome: (await pathExists(`${cwd}/.git`)) || (await pathExists(`${cwd}/.git/HEAD`)) ? 'passed' : 'failed', detail: 'Git repository/worktree metadata' });
  checks.push({ name: 'runtime.lockfile', outcome: await pathExists(`${cwd}/package-lock.json`) || await pathExists(`${cwd}/tools/agent-workspace/package-lock.json`) ? 'passed' : 'failed', detail: 'npm lockfile is available' });
  checks.push({ name: 'runtime.codex-desktop', outcome: options.hasCodexDesktop === false ? 'failed' : 'passed', detail: options.hasCodexDesktop === false ? 'Codex Desktop handoff is unavailable' : 'Codex Desktop handoff path is available' });
  checks.push({ name: 'runtime.azure-cli', outcome: options.hasAzCli === false ? 'not-run' : 'passed', detail: options.hasAzCli === false ? 'optional Azure CLI is not installed; offline mode remains valid' : 'optional Azure CLI capability available or not required offline' });
  if (!isWsl && !isLinuxContainer) return { state: 'unsupported', detail: 'local-agent-v1 requires a Linux Dev Container or WSL2; native Windows cannot substitute', checks };
  const required = checks.filter((check) => ['runtime.environment', 'runtime.node', 'runtime.git', 'runtime.lockfile', 'runtime.codex-desktop'].includes(check.name));
  return { state: required.every((check) => check.outcome === 'passed') ? 'ready' : 'blocked', detail: required.every((check) => check.outcome === 'passed') ? 'local-agent-v1 prerequisites are ready' : 'one or more local-agent-v1 prerequisites are unavailable', checks };
}

export class LocalRuntimeReadinessAdapter implements RuntimeReadinessAdapter {
  private readonly options: RuntimeInspectionOptions;
  constructor(options: RuntimeInspectionOptions) { this.options = options; }
  inspect(): Promise<RuntimeReadinessReport> { return inspectRuntime(this.options); }
}

async function pathExists(path: string): Promise<boolean> {
  try { await access(path, constants.F_OK); return true; } catch { return false; }
}
