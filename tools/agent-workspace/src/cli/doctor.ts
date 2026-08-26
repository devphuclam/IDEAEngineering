// Provider-neutral readiness output. A missing optional runtime is reported as
// not-selected; unavailable Azure access is never collapsed into PASS.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readProtectionPolicy } from '../adapters/github/source-host.ts';
import type { ErrorClassification } from '../errors.ts';
import { normalizeError, WorkspaceError } from '../errors.ts';
import type { CliContext } from './context.ts';
import { reportCommandError } from './output.ts';

const execFileAsync = promisify(execFile);

export interface DoctorCheck {
  name: string;
  status: 'ok' | 'missing' | 'blocked' | 'not-run';
  detail: string;
  classification?: ErrorClassification;
}

async function checkBinary(name: string, args: string[]): Promise<DoctorCheck> {
  try { await execFileAsync(name, args, { encoding: 'utf8' }); return { name, status: 'ok', detail: `${name} available` }; }
  catch (error) {
    const e = error as { code?: string; stderr?: string };
    if (e.code === 'ENOENT') return { name, status: 'missing', classification: 'capability', detail: `${name} is not installed or not on PATH` };
    const normalized = normalizeError(error);
    return { name, status: 'blocked', classification: normalized.classification, detail: normalized.message };
  }
}

export async function doctor(ctx: CliContext, live = false): Promise<{ provider?: string; checks: DoctorCheck[] }> {
  const checks: DoctorCheck[] = [await checkBinary('git', ['--version']), await checkBinary('node', ['--version'])];
  if (ctx.provider === 'github' || !ctx.provider) {
    checks.push(await checkBinary('gh', ['--version']));
    if (!ctx.owner) {
      try {
        const owner = (await ctx.gh.run(['api', 'user', '--jq', '.login'])).trim();
        if (owner) ctx.owner = owner;
      } catch (error) {
        const normalized = normalizeError(error, 'CREDENTIAL_REJECTED', 'credential');
        checks.push({ name: 'auth', status: normalized.classification === 'credential' ? 'missing' : 'blocked', classification: normalized.classification, detail: normalized.message });
      }
    }
    if (ctx.owner) checks.push({ name: 'auth', status: 'ok', detail: `authenticated as ${ctx.owner}` });
    else if (!checks.some((check) => check.name === 'auth')) checks.push({ name: 'auth', status: 'missing', classification: 'credential', detail: ctx.ownerError?.message ?? 'gh identity is unavailable' });
    if (ctx.repoError || !ctx.repo) {
      const remote = ctx.config?.github?.remote ?? 'origin';
      const error = ctx.repoError ?? new WorkspaceError('REMOTE_UNAVAILABLE', 'capability', `no git remote \`${remote}\` configured`);
      checks.push({ name: 'remote', status: 'missing', classification: error.classification, detail: error.message });
      checks.push({ name: 'protection', status: 'not-run', classification: 'capability', detail: 'branch protection cannot be checked without a GitHub remote' });
    } else {
      try {
        const policy = await readProtectionPolicy(ctx.gh, ctx.repo, 'main');
        if (policy.requiredApprovingReviews !== 0) checks.push({ name: 'protection', status: 'blocked', classification: 'capability', detail: `integration target requires ${policy.requiredApprovingReviews} human approvals; provider policy is stricter than template intent` });
        else if (policy.requiredChecks.length === 0) checks.push({ name: 'protection', status: 'blocked', classification: 'capability', detail: 'integration target has no configured required checks; refusing unverified integration' });
        else checks.push({ name: 'protection', status: 'ok', detail: `required_approving_review_count: 0; required checks: ${policy.requiredChecks.join(', ')}` });
      } catch (error) { const normalized = normalizeError(error); checks.push({ name: 'protection', status: 'blocked', classification: normalized.classification, detail: normalized.message }); }
    }
    return { provider: ctx.provider ?? 'github', checks };
  }

  const ports = ctx.providerPorts;
  if (!ports) return { provider: ctx.provider, checks: [...checks, { name: 'provider-context', status: 'blocked', classification: 'capability', detail: 'Azure provider context is not wired' }] };
  try {
    const runtime = await ports.runtime.inspect();
    const runtimeStatus = runtime.state === 'not-selected' ? 'ok' : runtime.state === 'ready' ? 'ok' : runtime.state === 'unsupported' ? 'blocked' : 'missing';
    checks.push({ name: 'runtime-profile', status: runtimeStatus, classification: runtimeStatus === 'ok' ? undefined : 'capability', detail: runtime.detail });
  } catch (error) { const normalized = normalizeError(error); checks.push({ name: 'runtime-profile', status: 'blocked', classification: normalized.classification, detail: normalized.message }); }
  try {
    const readiness = await ports.preparation.readiness();
    checks.push({ name: 'azure.configuration', status: readiness.configuration.outcome === 'passed' ? 'ok' : 'blocked', classification: readiness.configuration.outcome === 'passed' ? undefined : 'capability', detail: readiness.configuration.detail ?? readiness.configuration.outcome });
    checks.push({ name: 'azure.authentication', status: readiness.authentication.outcome === 'passed' ? 'ok' : live ? 'missing' : 'not-run', classification: readiness.authentication.outcome === 'passed' ? undefined : 'credential', detail: readiness.authentication.detail ?? (live ? 'named Azure identity is unavailable' : 'live authentication is not requested') });
    checks.push({ name: 'azure.target', status: readiness.target.outcome === 'passed' ? 'ok' : 'blocked', classification: readiness.target.outcome === 'passed' ? undefined : 'capability', detail: readiness.target.detail ?? readiness.target.outcome });
    checks.push({ name: 'azure.policy-visibility', status: readiness.policyVisibility.inventorySources.every((source) => source.outcome === 'read') ? 'ok' : 'blocked', classification: 'capability', detail: `${readiness.policyVisibility.effectiveBlockingCount} effective blocking policies observed` });
    checks.push({ name: 'azure.queue', status: readiness.queue.outcome === 'passed' ? 'ok' : 'blocked', classification: readiness.queue.outcome === 'passed' ? undefined : 'capability', detail: readiness.queue.detail ?? readiness.queue.outcome });
    if (live && readiness.runtime.outcome === 'not-selected') checks.push({ name: 'live', status: 'not-run', classification: 'capability', detail: 'select local-agent-v1 in Linux Dev Container or WSL2 before live operations' });
  } catch (error) { const normalized = normalizeError(error, 'AZURE_READINESS_FAILED', 'capability'); checks.push({ name: 'azure.readiness', status: 'blocked', classification: normalized.classification, detail: normalized.message }); }
  return { provider: ctx.provider, checks };
}

export async function runDoctorCommand(ctx: CliContext, json: boolean, live = false): Promise<number> {
  try {
    const result = await doctor(ctx, live);
    if (json) process.stdout.write(`${JSON.stringify({ provider: result.provider, mode: live ? 'live' : 'offline', checks: result.checks })}\n`);
    else for (const check of result.checks) process.stdout.write(`${check.status.padEnd(8)} ${check.name}: ${check.detail}\n`);
    return result.checks.every((check) => check.status === 'ok' || check.status === 'not-run') ? 0 : 1;
  } catch (error) { return reportCommandError(error, json); }
}
