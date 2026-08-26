// GitHub provider preparation (contracts/github-adapter.md): read-only
// `not-applicable`. GitHub never creates a coordination Issue as a bootstrap
// side effect; the first normal enqueue may create the deterministic
// Issue/label pair.

import type {
  MutationCommand,
  PreparationApplyResult,
  PreparationNotApplicableResult,
  PreparationPlan,
  ProviderPreparationAdapter,
  ReadinessReport,
} from '../ports.ts';

const NOT_APPLICABLE: PreparationNotApplicableResult = {
  disposition: 'not-applicable',
  classification: 'capability',
  reason: 'GitHub has no provider bootstrap capability; queue-only preparation applies only to Azure DevOps',
  nextAction: 'use `workspace integrate`; the coordination Issue is created by the first normal enqueue',
};

export class GithubPreparationAdapter implements ProviderPreparationAdapter {
  async readiness(): Promise<ReadinessReport> {
    return {
      provider: 'github',
      observedAt: new Date().toISOString(),
      configuration: { outcome: 'passed', detail: 'GitHub provider selected' },
      runtime: { outcome: 'not-selected', detail: 'runtimeProfile is null or omitted' },
      authentication: { outcome: 'passed', detail: 'gh CLI authentication reported by GitHub adapter' },
      target: { outcome: 'passed', detail: 'GitHub remote origin' },
      permissions: [],
      remoteRoles: { roles: [] },
      policyVisibility: { inventorySources: [], effectiveBlockingCount: 0 },
      queue: { outcome: 'passed', detail: 'coordination-Issue queue available' },
      network: { outcome: 'passed', detail: 'GitHub reachability reported by GitHub adapter' },
    };
  }

  async preview(): Promise<PreparationPlan> {
    return {
      applicability: 'not-applicable',
      digest: 'not-applicable',
      actions: [{ kind: 'none', detail: NOT_APPLICABLE.reason }],
    };
  }

  async apply(_command: MutationCommand<PreparationPlan>): Promise<PreparationApplyResult> {
    return NOT_APPLICABLE;
  }
}