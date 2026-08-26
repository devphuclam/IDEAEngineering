import { newOperationId } from '../domain/mutations.ts';
import type { IntegrationTarget, MutationCommand, Revisioned, RevisionedWorkItem, WorkItemState } from '../domain/types.ts';
import { capabilityError, usageError } from '../errors.ts';
import type { CliContext } from './context.ts';

export type ProviderPorts = NonNullable<CliContext['providerPorts']>;

export function providerPorts(ctx: CliContext): ProviderPorts {
  if (!ctx.providerPorts) throw capabilityError('provider-neutral ports are unavailable');
  return ctx.providerPorts;
}

/** Resolve GitHub identity at the first provider operation, never while the
 * CLI context is being constructed. Azure identity is selected by its auth
 * adapter before the context is returned. */
export async function ensureProviderOwner(ctx: CliContext): Promise<string> {
  if (ctx.owner) return ctx.owner;
  if (ctx.provider !== 'github') throw capabilityError('selected provider identity is unavailable');
  const owner = (await ctx.gh.run(['api', 'user', '--jq', '.login'])).trim();
  if (!owner) throw capabilityError('GitHub returned an empty identity');
  ctx.owner = owner;
  return owner;
}

export function operationId(args: string[], prefix: string): string {
  const index = args.indexOf('--operation-id');
  if (index >= 0) {
    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw usageError('--operation-id requires a value');
    return value;
  }
  return newOperationId(`${prefix}:${new Date().toISOString()}`);
}

export function targetFor(ctx: CliContext): IntegrationTarget {
  const config = ctx.config?.azureDevOps;
  if (!config) {
    if (ctx.provider === 'github' && ctx.repo) return { repositoryId: ctx.repo, targetRef: 'refs/heads/main' };
    throw capabilityError('selected provider configuration is unavailable');
  }
  return {
    repositoryId: config.repository.expectedId ?? 'unresolved-repository-id',
    targetRef: config.integrationTarget,
  };
}

export async function readProviderWorkItem(ctx: CliContext, workItemId: string): Promise<Revisioned<RevisionedWorkItem>> {
  return providerPorts(ctx).workItems.read(workItemId);
}

export function command<T>(operation: string, expectedRevision: string, actor: string, input: T): MutationCommand<T> {
  return {
    operationId: operation,
    expectedRevision,
    actor,
    requestedAt: new Date().toISOString(),
    input,
  };
}

export async function projectState(
  ctx: CliContext,
  workItemId: string,
  from: WorkItemState,
  to: WorkItemState,
  expectedRevision: string,
  operation: string,
): Promise<string> {
  const result = await providerPorts(ctx).workItems.projectState(command(operation, expectedRevision, ctx.owner, { workItemId, from, to }));
  if (result.disposition === 'conflict') throw capabilityError(result.reason ?? 'provider Work Item state projection conflicted');
  return result.revision;
}
