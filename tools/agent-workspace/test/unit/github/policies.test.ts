// T009: GitHub policy evaluation tests - active effective Rulesets, classic
// protection, reviews, conversations, check runs, commit statuses, exact head
// SHA, source applications, zero template approvals, and stricter provider
// rules (FR-022, FR-023).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGithubPolicySnapshot,
  evaluatePullRequestPolicy,
  inventoryRequirements,
  isRulesetActive,
  type GithubPolicyData,
} from '../../../src/adapters/github/policies.ts';
import { aggregateOutcome } from '../../../src/domain/policy.ts';

const HEAD = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const TARGET = { repositoryId: '123456789', targetRef: 'refs/heads/main' };

function data(overrides: Partial<GithubPolicyData> = {}): GithubPolicyData {
  return {
    target: TARGET,
    rulesets: [],
    classicProtection: { requiredApprovingReviews: 0, requiredChecks: [] },
    reviews: [],
    checkRuns: [],
    commitStatuses: [],
    headCommit: HEAD,
    observedAt: '2026-08-14T00:00:00.000Z',
    reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
    authorLogin: 'author',
    ...overrides,
  };
}

test('only active effective Rulesets are inventoried', () => {
  const rulesets = [
    { id: '1', name: 'active ruleset', enforcement: 'active' as const },
    { id: '2', name: 'evaluate-only', enforcement: 'evaluate' as const },
    { id: '3', name: 'disabled', enforcement: 'disabled' as const },
  ];
  const requirements = inventoryRequirements(data({ rulesets }));
  assert.equal(isRulesetActive(rulesets[0]), true);
  assert.equal(isRulesetActive(rulesets[1]), false);
  assert.equal(isRulesetActive(rulesets[2]), false);
  assert.ok(requirements.some((r) => r.id === 'ruleset:1'));
  assert.ok(!requirements.some((r) => r.id === 'ruleset:2'));
  assert.ok(!requirements.some((r) => r.id === 'ruleset:3'));
  for (const requirement of requirements) {
    assert.equal(requirement.kind, 'provider');
    assert.equal(requirement.source, 'github-rulesets');
  }
});

test('classic protection contributes review and check requirements', () => {
  const requirements = inventoryRequirements(
    data({ classicProtection: { requiredApprovingReviews: 1, requiredChecks: ['build'] } }),
  );
  assert.ok(requirements.some((r) => r.id === 'classic:required-approving-reviews'));
  assert.ok(requirements.some((r) => r.id === 'classic:check:build'));
});

test('an exact-head approving review passes only with enough distinct human approvals', () => {
  const evaluations = evaluatePullRequestPolicy(
    data({
      classicProtection: { requiredApprovingReviews: 2, requiredChecks: [] },
      reviews: [
        { state: 'APPROVED', user: 'alice' },
        { state: 'APPROVED', user: 'bob' },
        { state: 'CHANGES_REQUESTED', user: 'carol' },
      ],
    }),
  );
  const review = evaluations.find((r) => r.id === 'classic:required-approving-reviews')!;
  assert.equal(review.verdict, 'passed');
});

test('insufficient approvals are blocked, zero approvals are unexecuted', () => {
  const oneApproval = evaluatePullRequestPolicy(
    data({
      classicProtection: { requiredApprovingReviews: 2, requiredChecks: [] },
      reviews: [{ state: 'APPROVED', user: 'alice' }],
    }),
  );
  assert.equal(oneApproval.find((r) => r.id === 'classic:required-approving-reviews')!.verdict, 'blocked');

  const none = evaluatePullRequestPolicy(
    data({
      classicProtection: { requiredApprovingReviews: 1, requiredChecks: [] },
      reviews: [{ state: 'COMMENTED', user: 'alice' }],
    }),
  );
  assert.equal(none.find((r) => r.id === 'classic:required-approving-reviews')!.verdict, 'unexecuted');
});

test('zero template approvals: no review requirement passes without inventing one', () => {
  const snapshot = buildGithubPolicySnapshot(data({ reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true } }));
  assert.ok(!snapshot.evaluations.some((r) => r.id === 'classic:required-approving-reviews'));
  assert.equal(aggregateOutcome(snapshot.evaluations), 'passed');
});

test('the author approving their own review counts only when authorSelfReview is true', () => {
  const withAuthor = evaluatePullRequestPolicy(
    data({
      classicProtection: { requiredApprovingReviews: 1, requiredChecks: [] },
      reviews: [{ state: 'APPROVED', user: 'author' }],
      reviewIntent: { minimumHumanApprovals: 1, authorSelfReview: true },
    }),
  );
  assert.equal(withAuthor.find((r) => r.id === 'classic:required-approving-reviews')!.verdict, 'passed');

  const withoutAuthor = evaluatePullRequestPolicy(
    data({
      classicProtection: { requiredApprovingReviews: 1, requiredChecks: [] },
      reviews: [{ state: 'APPROVED', user: 'author' }],
      reviewIntent: { minimumHumanApprovals: 1, authorSelfReview: false },
    }),
  );
    assert.equal(withoutAuthor.find((r) => r.id === 'classic:required-approving-reviews')!.verdict, 'unexecuted');
});

test('completed successful check runs pass; failures and pending do not', () => {
  const passed = evaluatePullRequestPolicy(
    data({
      classicProtection: { requiredApprovingReviews: 0, requiredChecks: ['build'] },
      checkRuns: [{ name: 'build', status: 'completed', conclusion: 'success' }],
    }),
  );
  assert.equal(passed.find((r) => r.id === 'classic:check:build')!.verdict, 'passed');

  const failed = evaluatePullRequestPolicy(
    data({
      classicProtection: { requiredApprovingReviews: 0, requiredChecks: ['build'] },
      checkRuns: [{ name: 'build', status: 'completed', conclusion: 'failure' }],
    }),
  );
  assert.equal(failed.find((r) => r.id === 'classic:check:build')!.verdict, 'failed');

  const pending = evaluatePullRequestPolicy(
    data({
      classicProtection: { requiredApprovingReviews: 0, requiredChecks: ['build'] },
      checkRuns: [{ name: 'build', status: 'in_progress', conclusion: null }],
    }),
  );
  assert.equal(pending.find((r) => r.id === 'classic:check:build')!.verdict, 'pending');
});

test('commit statuses satisfy required checks; pending statuses do not pass', () => {
  const passed = evaluatePullRequestPolicy(
    data({
      classicProtection: { requiredApprovingReviews: 0, requiredChecks: ['ci'] },
      commitStatuses: [{ context: 'ci', state: 'success' }],
    }),
  );
  assert.equal(passed.find((r) => r.id === 'classic:check:ci')!.verdict, 'passed');

  const pending = evaluatePullRequestPolicy(
    data({
      classicProtection: { requiredApprovingReviews: 0, requiredChecks: ['ci'] },
      commitStatuses: [{ context: 'ci', state: 'pending' }],
    }),
  );
  assert.equal(pending.find((r) => r.id === 'classic:check:ci')!.verdict, 'pending');
});

test('a missing required check context is unexecuted, never passed', () => {
  const evaluations = evaluatePullRequestPolicy(
    data({ classicProtection: { requiredApprovingReviews: 0, requiredChecks: ['missing-check'] } }),
  );
  assert.equal(evaluations.find((r) => r.id === 'classic:check:missing-check')!.verdict, 'unexecuted');
});

test('conversation noise never counts as approval', () => {
  const evaluations = evaluatePullRequestPolicy(
    data({
      classicProtection: { requiredApprovingReviews: 1, requiredChecks: [] },
      reviews: [
        { state: 'COMMENTED', user: 'alice' },
        { state: 'DISMISSED', user: 'bob' },
        { state: 'PENDING', user: 'carol' },
      ],
    }),
  );
  assert.equal(evaluations.find((r) => r.id === 'classic:required-approving-reviews')!.verdict, 'unexecuted');
});

test('evaluations carry the exact head SHA they apply to', () => {
  const snapshot = buildGithubPolicySnapshot(
    data({ classicProtection: { requiredApprovingReviews: 1, requiredChecks: ['build'] } }),
  );
  assert.equal(snapshot.headCommit, HEAD);
  for (const evaluation of snapshot.evaluations) {
    assert.equal(evaluation.appliedToCommit, HEAD);
  }
  assert.deepEqual(snapshot.inventory.sources.map((s) => s.outcome), ['read', 'read', 'read', 'read', 'read']);
});

test('stricter provider rules override looser local intent in the snapshot aggregate', () => {
  const snapshot = buildGithubPolicySnapshot(
    data({
      classicProtection: { requiredApprovingReviews: 1, requiredChecks: [] },
      reviews: [],
      reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
    }),
  );
  // The provider requires one approving review; zero recorded approvals must
  // not pass regardless of the local intent of zero.
  assert.equal(snapshot.aggregate, 'unexecuted');
  assert.notEqual(snapshot.aggregate, 'passed');
});

test('an active ruleset passes only when delegated to GitHub merge protection', () => {
  const evaluations = evaluatePullRequestPolicy(
    data({ rulesets: [{ id: '7', name: 'deploy gate', enforcement: 'active' }] }),
  );
  const ruleset = evaluations.find((r) => r.id === 'ruleset:7')!;
  assert.equal(ruleset.verdict, 'passed');
  assert.match(ruleset.detail ?? '', /delegated/);
});