import { newOperationId, payloadHash } from '../domain/mutations.ts';
import type { AdoptionPlan, AdoptionRequest, MutationCommand, PreparationPlan } from '../domain/types.ts';
import { capabilityError, usageError } from '../errors.ts';
import type { CliContext } from './context.ts';
import { reportCommandError } from './output.ts';

function valueAfter(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

export async function providerPrepare(ctx: CliContext, args: string[], json: boolean): Promise<number> {
  try {
    const preparation = ctx.providerPorts?.preparation;
    if (!preparation) throw capabilityError('provider preparation is not wired');
    const operationId = valueAfter(args, '--operation-id') ?? newOperationId(new Date().toISOString());
    const apply = args.includes('--apply');
    const preview = await preparation.preview();
    if (!apply) {
      const result = { operationId, mode: 'preview', ...preview };
      if (json) process.stdout.write(`${JSON.stringify(result)}\n`); else process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return 0;
    }
    const requestedDigest = valueAfter(args, '--plan-digest') ?? preview.digest;
    const command: MutationCommand<PreparationPlan> = { operationId, expectedRevision: requestedDigest, actor: ctx.owner, requestedAt: new Date().toISOString(), input: { ...preview, digest: requestedDigest } };
    const result = await preparation.apply(command);
    if (json) process.stdout.write(`${JSON.stringify({ operationId, mode: 'apply', ...result })}\n`); else process.stdout.write(`${JSON.stringify({ operationId, mode: 'apply', ...result }, null, 2)}\n`);
    return result.disposition === 'applied' || result.disposition === 'not-applicable' ? 0 : 1;
  } catch (error) { return reportCommandError(error, json); }
}

export async function providerAdopt(ctx: CliContext, args: string[], json: boolean): Promise<number> {
  try {
    const sourceHost = ctx.providerPorts?.sourceHost;
    if (!sourceHost || !ctx.config?.azureDevOps) throw capabilityError('provider adoption is available only for the selected Azure source host');
    const config = ctx.config.azureDevOps;
    const request: AdoptionRequest = {
      repositoryId: config.repository.expectedId ?? 'unresolved-repository-id',
      originRoleName: config.remoteRoles.companyOrigin,
      templateUpstreamRoleName: config.remoteRoles.templateUpstream,
      templateUpstreamUrl: 'https://github.com/devphuclam/CodespaceTemplate.git',
      companyOriginUrl: `${config.organizationUrl.replace(/\/+$/, '')}/${encodeURIComponent(config.project.name)}/_git/${encodeURIComponent(config.repository.name)}`,
    };
    const plan = await sourceHost.previewAdoption(request);
    const apply = args.includes('--apply');
    if (!apply) {
      const result = { mode: 'preview', operationId: valueAfter(args, '--operation-id') ?? newOperationId(new Date().toISOString()), ...plan };
      if (json) process.stdout.write(`${JSON.stringify(result)}\n`); else process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return 0;
    }
    const operationId = valueAfter(args, '--operation-id') ?? newOperationId(new Date().toISOString());
    const expectedDigest = valueAfter(args, '--plan-digest') ?? plan.digest;
    const result = await sourceHost.applyAdoption({ operationId, expectedRevision: expectedDigest, actor: ctx.owner, requestedAt: new Date().toISOString(), input: { ...plan, digest: expectedDigest } });
    if (json) process.stdout.write(`${JSON.stringify({ mode: 'apply', ...result })}\n`); else process.stdout.write(`${JSON.stringify({ mode: 'apply', ...result }, null, 2)}\n`);
    return result.disposition === 'applied' ? 0 : 1;
  } catch (error) { return reportCommandError(error, json); }
}

export function providerUsage(): never {
  throw usageError('usage: workspace provider prepare|adopt [--preview|--apply] [--plan-digest <sha256:...>] [--operation-id <id>]');
}

export function planDigest(plan: PreparationPlan | AdoptionPlan): string { return payloadHash(plan); }
