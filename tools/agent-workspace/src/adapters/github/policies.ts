// GitHub effective policy mapping (contracts/github-adapter.md): active
// effective Rulesets and classic protection inventory, then exact-head
// review/check-run/commit-status evaluation for the candidate head SHA.

import type {
  IntegrationTarget,
  PolicyInventory,
  PolicyRequirement,
  PolicySnapshot,
  PullRequestRef,
} from '../../domain/types.ts';
import { aggregateOutcome } from '../../domain/policy.ts';

export interface RulesetRule {
  id: string;
  name: string;
  enforcement: 'active' | 'evaluate' | 'disabled';
  target?: string;
}

export interface ClassicProtection {
  requiredApprovingReviews: number;
  requiredChecks: string[];
}

export interface ReviewState {
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING';
  user: string;
}

export interface CheckRunState {
  name: string;
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'timed_out' | 'action_required' | 'stale' | 'skipped' | 'startup_failure' | null;
  status: 'queued' | 'in_progress' | 'completed';
}

export interface CommitStatus {
  context: string;
  state: 'success' | 'failure' | 'error' | 'pending';
}

export interface GithubPolicyData {
  target: IntegrationTarget;
  rulesets: RulesetRule[];
  classicProtection: ClassicProtection;
  reviews: ReviewState[];
  checkRuns: CheckRunState[];
  commitStatuses: CommitStatus[];
  headCommit: string;
  observedAt: string;
  reviewIntent: { minimumHumanApprovals: number; authorSelfReview: boolean };
  authorLogin: string;
}

export function isRulesetActive(rule: RulesetRule): boolean {
  return rule.enforcement === 'active';
}

export function inventoryRequirements(data: GithubPolicyData): PolicyRequirement[] {
  const requirements: PolicyRequirement[] = [];
  for (const ruleset of data.rulesets.filter(isRulesetActive)) {
    requirements.push({
      id: `ruleset:${ruleset.id}`,
      name: ruleset.name,
      source: 'github-rulesets',
      kind: 'provider',
      verdict: 'unexecuted',
      appliedToCommit: data.headCommit,
    });
  }
  if (data.classicProtection.requiredApprovingReviews > 0) {
    requirements.push({
      id: 'classic:required-approving-reviews',
      name: 'Required approving reviews',
      source: 'github-classic-protection',
      kind: 'provider',
      verdict: 'unexecuted',
      appliedToCommit: data.headCommit,
    });
  }
  for (const check of data.classicProtection.requiredChecks) {
    requirements.push({
      id: `classic:check:${check}`,
      name: `Required check: ${check}`,
      source: 'github-classic-protection',
      kind: 'provider',
      verdict: 'unexecuted',
      appliedToCommit: data.headCommit,
    });
  }
  return requirements;
}

function evaluateReviewRequirement(data: GithubPolicyData, requiredReviews: number): PolicyRequirement {
  if (requiredReviews <= 0) {
    return {
      id: 'classic:required-approving-reviews',
      name: 'Required approving reviews',
      source: 'github-classic-protection',
      kind: 'provider',
      verdict: 'passed',
      detail: 'no approving reviews required by provider policy',
      appliedToCommit: data.headCommit,
    };
  }
  const approvals = new Set(
    data.reviews.filter((review) => review.state === 'APPROVED').map((review) => review.user),
  );
  const authorApproves = approvals.has(data.authorLogin);
  const effectiveApprovals = data.reviewIntent.authorSelfReview ? approvals.size : approvals.size - (authorApproves ? 1 : 0);
  const verdict =
    effectiveApprovals >= requiredReviews ? 'passed' : effectiveApprovals > 0 ? 'blocked' : 'unexecuted';
  return {
    id: 'classic:required-approving-reviews',
    name: 'Required approving reviews',
    source: 'github-classic-protection',
    kind: 'provider',
    verdict,
    detail: `${approvals.size} approval(s) recorded; ${requiredReviews} required by provider`,
    appliedToCommit: data.headCommit,
  };
}

function evaluateCheckRequirement(data: GithubPolicyData, check: string): PolicyRequirement {
  const run = data.checkRuns.find((candidate) => candidate.name === check);
  if (!run) {
    const status = data.commitStatuses.find((candidate) => candidate.context === check);
    if (!status) {
      return {
        id: `classic:check:${check}`,
        name: `Required check: ${check}`,
        source: 'github-classic-protection',
        kind: 'provider',
        verdict: 'unexecuted',
        detail: 'no check run or commit status for this context',
        appliedToCommit: data.headCommit,
      };
    }
    return {
      id: `classic:check:${check}`,
      name: `Required check: ${check}`,
      source: 'github-classic-protection',
      kind: 'provider',
      verdict: status.state === 'success' ? 'passed' : status.state === 'pending' ? 'pending' : 'failed',
      detail: `commit status ${status.state}`,
      appliedToCommit: data.headCommit,
    };
  }
  if (run.status !== 'completed') {
    return {
      id: `classic:check:${check}`,
      name: `Required check: ${check}`,
      source: 'github-classic-protection',
      kind: 'provider',
      verdict: run.status === 'in_progress' ? 'pending' : 'unexecuted',
      detail: `check run ${run.status}`,
      appliedToCommit: data.headCommit,
    };
  }
  return {
    id: `classic:check:${check}`,
    name: `Required check: ${check}`,
    source: 'github-classic-protection',
    kind: 'provider',
    verdict: run.conclusion === 'success' ? 'passed' : 'failed',
    detail: `check run conclusion ${run.conclusion ?? 'none'}`,
    appliedToCommit: data.headCommit,
  };
}

export function evaluatePullRequestPolicy(data: GithubPolicyData): PolicyRequirement[] {
  const requirements = inventoryRequirements(data);
  for (const requirement of requirements) {
    if (requirement.id === 'classic:required-approving-reviews') {
      requirements[requirements.indexOf(requirement)] = evaluateReviewRequirement(
        data,
        data.classicProtection.requiredApprovingReviews,
      );
    } else if (requirement.id.startsWith('classic:check:')) {
      const check = requirement.id.slice('classic:check:'.length);
      requirements[requirements.indexOf(requirement)] = evaluateCheckRequirement(data, check);
    } else if (requirement.id.startsWith('ruleset:')) {
      const ruleset = data.rulesets.find((candidate) => candidate.id === requirement.id.slice('ruleset:'.length))!;
      requirements[requirements.indexOf(requirement)] = {
        id: `ruleset:${ruleset.id}`,
        name: ruleset.name,
        source: 'github-rulesets',
        kind: 'provider',
        verdict: 'passed',
        detail: 'active ruleset observed; evaluation delegated to GitHub merge protection',
        appliedToCommit: data.headCommit,
      };
    }
  }
  return requirements;
}

export function buildGithubPolicySnapshot(
  data: GithubPolicyData,
  pullRequestRef?: PullRequestRef,
): PolicySnapshot {
  const inventory: PolicyInventory = {
    target: data.target,
    observedAt: data.observedAt,
    sources: [
      { name: 'github-rulesets', outcome: 'read' },
      { name: 'github-classic-protection', outcome: 'read' },
      { name: 'github-reviews', outcome: 'read' },
      { name: 'github-check-runs', outcome: 'read' },
      { name: 'github-commit-statuses', outcome: 'read' },
    ],
    effectiveBlocking: inventoryRequirements(data),
  };
  return {
    target: data.target,
    pullRequestRef,
    headCommit: data.headCommit,
    observedAt: data.observedAt,
    inventory,
    evaluations: evaluatePullRequestPolicy(data),
    aggregate: aggregateOutcome(evaluatePullRequestPolicy(data)),
  };
}