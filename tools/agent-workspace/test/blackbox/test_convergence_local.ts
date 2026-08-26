// T057: deterministic acceptance path for the core CLI lifecycle. It uses
// real temporary git worktrees with fake provider/source-host adapters, so the
// suite is reproducible without credentials while live GitHub cases remain
// explicitly gated in the original scenario files.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SerializedGh } from '../../src/adapters/github/gh.ts';
import { FakeClaimStore, FakeEvidenceStore, FakeSourceHostAdapter, FakeWorkItemAdapter } from '../../src/adapters/fakes/index.ts';
import { CodexDesktopDriver } from '../../src/adapters/local/codex-driver.ts';
import { LocalRunnerAdapter } from '../../src/adapters/local/runner.ts';
import { claim } from '../../src/cli/claim.ts';
import { start } from '../../src/cli/start.ts';
import { checkpoint } from '../../src/cli/checkpoint.ts';
import { handoff } from '../../src/cli/handoff.ts';
import { retry } from '../../src/cli/retry.ts';
import { status } from '../../src/cli/status.ts';
import { integrate } from '../../src/cli/integrate.ts';
import { makeTempRepo } from './helpers.ts';
import type { CliContext } from '../../src/cli/context.ts';
import type { AgentCheckpoint } from '../../src/domain/types.ts';

test('T057: local claim/start/checkpoint/handoff/retry/status acceptance path', async () => {
  const repo = await makeTempRepo();
  try {
    const workItems = new FakeWorkItemAdapter();
    workItems.items.set('12', {
      id: '12',
      title: 'Reporting foundation',
      dependencies: [],
      changeScope: {
        paths: ['src/reporting/'],
        semanticSeams: ['reporting-service'],
        prerequisites: [],
        integrationTarget: 'main',
      },
    });
    const ctx: CliContext = {
      cwd: repo.root,
      gh: new SerializedGh(async () => 'ok'),
      repo: 'fake/repo',
      owner: 'alice',
      claims: new FakeClaimStore(),
      workItems,
      runner: new LocalRunnerAdapter(repo.root),
      driver: new CodexDesktopDriver(),
      evidence: new FakeEvidenceStore(),
      sourceHost: new FakeSourceHostAdapter(),
    };

    const claimed = await claim(ctx, '12', undefined);
    assert.equal(claimed.claim.claimant, 'alice');
    const firstRun = await start(ctx, '12');
    const firstCheckpoint = await checkpoint(ctx, '12', ['none'], 'handoff to bob');
    assert.equal(firstCheckpoint.checkpoint.runId, firstRun.run.runId);

    const transferred = await handoff(ctx, '12', 'bob');
    assert.equal(transferred.handoff.replacementOwner, 'bob');
    ctx.owner = 'bob';
    const resumed = await start(ctx, '12');
    assert.equal(resumed.run.runId, firstRun.run.runId);

    await ctx.runner.destroy(resumed.run.sandboxId);
    const second = await retry(ctx, '12');
    assert.equal(second.retry.retryOf, firstRun.run.runId);
    const inspected = await status(ctx, '12');
    assert.equal(inspected.runs.length, 2);
    assert.ok(inspected.runs.some((run) => run.retryOf === firstRun.run.runId));
    assert.ok(inspected.runs.every((run) => run.checkpoints.length > 0));
  } finally {
    await repo.cleanup();
  }
});

test('T054: local integration queue executes configured checks and records incorporation', async () => {
  const repo = await makeTempRepo();
  try {
    const workItems = new FakeWorkItemAdapter();
    workItems.items.set('13', {
      id: '13',
      title: 'Integration smoke',
      dependencies: [],
      changeScope: {
        paths: ['src/smoke/'],
        semanticSeams: ['smoke-service'],
        prerequisites: [],
        integrationTarget: 'main',
      },
    });
    const sourceHost = new FakeSourceHostAdapter();
    sourceHost.protection.set('main', { requiredApprovingReviews: 0, checks: ['node --version'] });
    const ctx: CliContext = {
      cwd: repo.root,
      gh: new SerializedGh(async () => 'ok'),
      repo: 'fake/repo',
      owner: 'alice',
      claims: new FakeClaimStore(),
      workItems,
      runner: new LocalRunnerAdapter(repo.root),
      driver: new CodexDesktopDriver(),
      evidence: new FakeEvidenceStore(),
      sourceHost,
    };
    await claim(ctx, '13', undefined);
    await start(ctx, '13');
    await checkpoint(ctx, '13', [], 'integrate');
    const result = await integrate(ctx, '13');
    assert.equal(result.integration.state, 'incorporated');
    assert.equal((result.integration.verification as Array<{ outcome: string }>)[0].outcome, 'passed');
    assert.equal((await status(ctx, '13')).runs[0].integration, 'integrated');
  } finally {
    await repo.cleanup();
  }
});

test('T054: integrate refuses a target without required checks before opening a PR', async () => {
  const repo = await makeTempRepo();
  try {
    const workItems = new FakeWorkItemAdapter();
    workItems.items.set('17', {
      id: '17',
      title: 'Unverified integration',
      dependencies: [],
      changeScope: {
        paths: ['src/unverified/'],
        semanticSeams: ['unverified-service'],
        prerequisites: [],
        integrationTarget: 'main',
      },
    });
    const sourceHost = new FakeSourceHostAdapter();
    sourceHost.protection.set('main', { requiredApprovingReviews: 0, checks: [] });
    const ctx: CliContext = {
      cwd: repo.root,
      gh: new SerializedGh(async () => 'ok'),
      repo: 'fake/repo',
      owner: 'alice',
      claims: new FakeClaimStore(),
      workItems,
      runner: new LocalRunnerAdapter(repo.root),
      driver: new CodexDesktopDriver(),
      evidence: new FakeEvidenceStore(),
      sourceHost,
    };
    await claim(ctx, '17', undefined);
    await start(ctx, '17');
    await checkpoint(ctx, '17', [], 'integrate');

    await assert.rejects(
      () => integrate(ctx, '17'),
      /no configured required checks|refusing unverified integration/,
    );
    assert.equal(sourceHost.pullRequests.length, 0);
  } finally {
    await repo.cleanup();
  }
});

test('T053: semantic overlap blocks, then proceeds only with an explicit decision', async () => {
  const repo = await makeTempRepo();
  try {
    const workItems = new FakeWorkItemAdapter();
    const scope = (path: string) => ({
      paths: [path],
      semanticSeams: ['shared-service'],
      prerequisites: [],
      integrationTarget: 'main',
    });
    workItems.items.set('15', { id: '15', title: 'First change', dependencies: [], changeScope: scope('src/first/') });
    workItems.items.set('16', { id: '16', title: 'Second change', dependencies: [], changeScope: scope('src/second/') });
    const sourceHost = new FakeSourceHostAdapter();
    sourceHost.protection.set('main', { requiredApprovingReviews: 0, checks: ['node --version'] });
    sourceHost.checkpoints.set('16', {
      checkpointId: 'cp-other',
      runId: 'run-other',
      branch: 'feature/second-wi-16-run-other',
      commit: 'abc1234',
      verification: [{ command: 'node --version', outcome: 'passed' }],
      unresolvedWork: [],
      nextAction: 'integrate',
      createdAt: new Date().toISOString(),
    } satisfies AgentCheckpoint);
    const ctx: CliContext = {
      cwd: repo.root,
      gh: new SerializedGh(async () => 'ok'),
      repo: 'fake/repo',
      owner: 'alice',
      claims: new FakeClaimStore(),
      workItems,
      runner: new LocalRunnerAdapter(repo.root),
      driver: new CodexDesktopDriver(),
      evidence: new FakeEvidenceStore(),
      sourceHost,
    };
    await claim(ctx, '15', undefined);
    await start(ctx, '15');
    await checkpoint(ctx, '15', [], 'integrate');
    await assert.rejects(() => integrate(ctx, '15'), /semantic overlap/);
    const approved = await integrate(ctx, '15', { approveSemantic: 'run-other', decidedBy: 'alice' });
    assert.equal(approved.integration.state, 'incorporated');
  } finally {
    await repo.cleanup();
  }
});
