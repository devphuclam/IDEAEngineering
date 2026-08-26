// Offline pilot: simulate two Agents on one machine without GitHub or Azure.
// The test exercises the public command seams with real git worktrees and fake
// provider adapters, so it is a useful pre-credential readiness check.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FakeClaimStore,
  FakeEvidenceStore,
  FakeSourceHostAdapter,
  FakeWorkItemAdapter,
} from '../../src/adapters/fakes/index.ts';
import { SerializedGh } from '../../src/adapters/github/gh.ts';
import { LocalRunnerAdapter } from '../../src/adapters/local/runner.ts';
import { CodexDesktopDriver } from '../../src/adapters/local/codex-driver.ts';
import { claim } from '../../src/cli/claim.ts';
import { checkpoint } from '../../src/cli/checkpoint.ts';
import type { CliContext } from '../../src/cli/context.ts';
import { handoff } from '../../src/cli/handoff.ts';
import { integrate } from '../../src/cli/integrate.ts';
import { retry } from '../../src/cli/retry.ts';
import { start } from '../../src/cli/start.ts';
import { status } from '../../src/cli/status.ts';
import type { WorkItem } from '../../src/domain/types.ts';
import { makeTempRepo } from './helpers.ts';

const execFileAsync = promisify(execFile);

test('offline pilot: two simulated Agents can isolate, hand off, recover, and integrate work', async () => {
  const repo = await makeTempRepo();
  try {
    const workItems = new FakeWorkItemAdapter();
    const sharedScope = {
      paths: ['src/shared/model.ts'],
      semanticSeams: ['shared-model'],
      prerequisites: [],
      integrationTarget: 'main',
    };
    const aliceItem: WorkItem = {
      id: '101',
      title: 'Shared model foundation',
      dependencies: [],
      changeScope: sharedScope,
    };
    const bobItem: WorkItem = {
      id: '102',
      title: 'Shared model export',
      dependencies: [],
      changeScope: sharedScope,
    };
    workItems.items.set(aliceItem.id, aliceItem);
    workItems.items.set(bobItem.id, bobItem);

    const claims = new FakeClaimStore();
    const evidence = new FakeEvidenceStore();
    const sourceHost = new FakeSourceHostAdapter();
    sourceHost.protection.set('main', { requiredApprovingReviews: 0, checks: ['node --version'] });
    const alice = makeContext(repo.root, 'alice', claims, workItems, evidence, sourceHost);
    const bob = makeContext(repo.root, 'bob', claims, workItems, evidence, sourceHost);

    const aliceClaim = await claim(alice, aliceItem.id, undefined);
    const bobClaim = await claim(bob, bobItem.id, undefined);
    const aliceRun = await start(alice, aliceItem.id);
    const bobRun = await start(bob, bobItem.id);

    const aliceSandbox = resolve(repo.root, aliceRun.run.worktreePath);
    const bobSandbox = resolve(repo.root, bobRun.run.worktreePath);
    await commitFile(aliceSandbox, 'export const source = "alice";\n', 'alice change');
    await commitFile(bobSandbox, 'export const source = "bob";\n', 'bob change');
    assert.equal(await readFile(join(aliceSandbox, 'src/shared/model.ts'), 'utf8'), 'export const source = "alice";\n');
    assert.equal(await readFile(join(bobSandbox, 'src/shared/model.ts'), 'utf8'), 'export const source = "bob";\n');
    assert.equal(await fileExists(join(repo.root, 'src/shared/model.ts')), false, 'main checkout stays untouched');

    await checkpoint(alice, aliceItem.id, ['Bob should review the shared model'], 'handoff to bob');
    await checkpoint(bob, bobItem.id, [], 'integrate after semantic decision');
    const transfer = await handoff(alice, aliceItem.id, 'bob');
    assert.equal(transfer.handoff.replacementOwner, 'bob');
    await assert.rejects(
      () => checkpoint(alice, aliceItem.id, [], 'stale Alice action'),
      /Run Owner|owner/i,
      'the previous owner cannot control the handed-off run',
    );

    await bob.runner.destroy(aliceRun.run.sandboxId);
    const recovered = await retry(bob, aliceItem.id);
    assert.equal(recovered.retry.retryOf, aliceRun.run.runId);
    await checkpoint(bob, aliceItem.id, [], 'integrate after recovery');

    await assert.rejects(
      () => integrate(bob, aliceItem.id),
      /semantic overlap/i,
    );
    const integratedAlice = await integrate(bob, aliceItem.id, {
      approveSemantic: bobRun.run.runId,
      decidedBy: 'bob',
    });
    assert.equal(integratedAlice.integration.state, 'incorporated');
    const integratedBob = await integrate(bob, bobItem.id);
    assert.equal(integratedBob.integration.state, 'incorporated');

    const aliceStatus = await status(bob, aliceItem.id);
    const bobStatus = await status(bob, bobItem.id);
    assert.equal(aliceStatus.runs.length, 2, 'retry preserves the earlier Agent Run');
    assert.ok(aliceStatus.runs.some((run) => run.retryOf === aliceRun.run.runId));
    assert.ok(aliceStatus.runs.some((run) => run.integration === 'integrated'));
    assert.ok(bobStatus.runs.some((run) => run.integration === 'integrated'));
    assert.equal(aliceClaim.claim.claimant, 'alice');
    assert.equal(bobClaim.claim.claimant, 'bob');
  } finally {
    await repo.cleanup();
  }
});

function makeContext(
  cwd: string,
  owner: string,
  claims: FakeClaimStore,
  workItems: FakeWorkItemAdapter,
  evidence: FakeEvidenceStore,
  sourceHost: FakeSourceHostAdapter,
): CliContext {
  return {
    cwd,
    gh: new SerializedGh(async () => 'offline pilot'),
    repo: 'offline/pilot',
    owner,
    claims,
    workItems,
    runner: new LocalRunnerAdapter(cwd),
    driver: new CodexDesktopDriver(),
    evidence,
    sourceHost,
  };
}

async function commitFile(worktreePath: string, contents: string, message: string): Promise<void> {
  await mkdir(join(worktreePath, 'src', 'shared'), { recursive: true });
  await writeFile(join(worktreePath, 'src/shared/model.ts'), contents, 'utf8');
  await execFileAsync('git', ['-C', worktreePath, 'add', 'src/shared/model.ts']);
  await execFileAsync('git', ['-C', worktreePath, 'commit', '-m', message]);
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}
