// Explicit live GitHub pilot. This is intentionally separate from the default
// offline black-box suite because it creates real issues, comments, branches,
// and labels in the repository named by WORKSPACE_BB_REPO.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cloneLiveRepo, closeLiveWorkItem, createLiveWorkItem, deleteLiveBranch, LIVE_REPO } from './live.ts';
import { runWorkspace } from './helpers.ts';
import type { ChangeScope } from '../../src/domain/types.ts';

const execFileAsync = promisify(execFile);

test('live GitHub pilot: claim, checkpoint, handoff, retry, status, and safe integration refusal', {
  skip: !LIVE_REPO && 'set WORKSPACE_BB_REPO to the dedicated live pilot repository',
}, async () => {
  const scope: ChangeScope = {
    paths: ['src/live-pilot/shared.ts'],
    semanticSeams: ['live-pilot-shared'],
    prerequisites: [],
    integrationTarget: 'main',
  };
  const issueIds: string[] = [];
  const branches: string[] = [];
  const alice = await cloneLiveRepo('workspace-live-alice');
  const bob = await cloneLiveRepo('workspace-live-bob');
  try {
    const handoffIssue = await createLiveWorkItem(`Live pilot handoff ${Date.now()}`, scope);
    const retryIssue = await createLiveWorkItem(`Live pilot retry ${Date.now()}`, {
      ...scope,
      paths: ['src/live-pilot/retry.ts'],
      semanticSeams: ['live-pilot-retry'],
    });
    issueIds.push(handoffIssue, retryIssue);

    const aliceClaim = await runWorkspace(['claim', handoffIssue, '--json'], alice.root);
    assert.equal(aliceClaim.code, 0, aliceClaim.stderr);
    const bobDuplicateClaim = await runWorkspace(['claim', handoffIssue, '--json'], bob.root);
    assert.equal(bobDuplicateClaim.code, 1, 'a second clone cannot claim the active Work Item');

    const aliceStart = await runJsonCommand<{ run: { runId: string; sandboxId: string; worktreePath: string; branch: string } }>(
      ['start', handoffIssue, '--json'],
      alice.root,
    );
    branches.push(aliceStart.run.branch);
    await commitFile(resolve(alice.root, aliceStart.run.worktreePath), 'export const owner = "alice";\n', 'live handoff change');
    await expectOk(['checkpoint', handoffIssue, '--json'], alice.root);
    const handoff = await runJsonCommand<{ handoff: { previousOwner: string; replacementOwner: string } }>(
      ['handoff', handoffIssue, '--to', 'pilot-bob', '--json'],
      alice.root,
    );
    assert.equal(handoff.handoff.replacementOwner, 'pilot-bob');
    const staleAction = await runWorkspace(['checkpoint', handoffIssue, '--json'], alice.root);
    assert.equal(staleAction.code, 1, 'the previous owner is rejected after live handoff');

    const bobClaim = await expectOk(['claim', retryIssue, '--json'], bob.root);
    assert.equal(bobClaim.error, undefined);
    const bobStart = await runJsonCommand<{ run: { runId: string; sandboxId: string; worktreePath: string; branch: string } }>(
      ['start', retryIssue, '--json'],
      bob.root,
    );
    branches.push(bobStart.run.branch);
    await commitFile(resolve(bob.root, bobStart.run.worktreePath), 'export const retry = true;\n', 'live retry change');
    await expectOk(['checkpoint', retryIssue, '--json'], bob.root);
    await rm(resolve(bob.root, bobStart.run.worktreePath), { recursive: true, force: true });
    await execFileAsync('git', ['-C', bob.root, 'worktree', 'prune']);
    const retried = await runJsonCommand<{ retry: { retryOf: string; runId: string; branch: string } }>(
      ['retry', retryIssue, '--json'],
      bob.root,
    );
    branches.push(retried.retry.branch);
    assert.notEqual(retried.retry.runId, retried.retry.retryOf);

    const status = await runJsonCommand<{ runs: Array<{ retryOf?: string; checkpoints: unknown[] }> }>(
      ['status', retryIssue, '--json'],
      bob.root,
    );
    assert.ok(status.runs.some((run) => run.retryOf));
    assert.ok(status.runs.every((run) => run.checkpoints.length > 0));

    const safeIntegration = await runWorkspace(['integrate', retryIssue, '--json'], bob.root);
    assert.equal(safeIntegration.code, 1, 'integration must refuse an unprotected private target');
    const integrationPayload = JSON.parse(safeIntegration.stdout) as {
      error?: { classification?: string; errorCode?: string };
    };
    assert.ok(
      integrationPayload.error?.classification === 'quota' ||
        integrationPayload.error?.errorCode === 'PROTECTION_UNAVAILABLE' ||
        integrationPayload.error?.errorCode === 'REQUIRED_CHECKS_MISSING',
      `unexpected safe integration refusal: ${safeIntegration.stdout}`,
    );
  } finally {
    for (const branch of branches) await deleteLiveBranch(branch);
    for (const issueId of issueIds) {
      try {
        await closeLiveWorkItem(issueId);
      } catch {
        // Preserve the original test result if cleanup is unavailable.
      }
    }
    await alice.cleanup();
    await bob.cleanup();
  }
});

async function runJsonCommand<T>(args: string[], cwd: string): Promise<T> {
  const result = await expectOk(args, cwd);
  return JSON.parse(result.stdout) as T;
}

async function expectOk(args: string[], cwd: string): Promise<{ stdout: string; stderr: string; error?: never }> {
  const result = await runWorkspace(args, cwd);
  assert.equal(result.code, 0, `${args.join(' ')}\n${result.stderr}\n${result.stdout}`);
  return result;
}

async function commitFile(worktreePath: string, contents: string, message: string): Promise<void> {
  await mkdir(join(worktreePath, 'src', 'live-pilot'), { recursive: true });
  const file = join(worktreePath, 'src/live-pilot', message.includes('retry') ? 'retry.ts' : 'shared.ts');
  await writeFile(file, contents, 'utf8');
  await execFileAsync('git', ['-C', worktreePath, 'add', file]);
  await execFileAsync('git', ['-C', worktreePath, 'commit', '-m', message]);
}
