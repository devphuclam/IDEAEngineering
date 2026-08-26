// Helpers for explicitly authorized live GitHub acceptance tests. These tests
// create temporary Work Items and branches in WORKSPACE_BB_REPO only.

import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { ChangeScope } from '../../src/domain/types.ts';

const execFileAsync = promisify(execFile);

export const LIVE_REPO = process.env.WORKSPACE_BB_REPO;

export function requireLiveRepo(): string {
  if (!LIVE_REPO) throw new Error('WORKSPACE_BB_REPO is required for live GitHub acceptance tests');
  return LIVE_REPO;
}

export async function cloneLiveRepo(prefix: string): Promise<{ root: string; cleanup: () => Promise<void> }> {
  const repo = requireLiveRepo();
  const root = await mkdtemp(join(tmpdir(), `${prefix}-`));
  await execFileAsync('gh', ['repo', 'clone', repo, root], { encoding: 'utf8' });
  await execFileAsync('git', ['-C', root, 'config', 'user.email', 'agent-workspace-live-pilot@example.invalid']);
  await execFileAsync('git', ['-C', root, 'config', 'user.name', 'Agent Workspace Live Pilot']);
  return {
    root,
    cleanup: async () => {
      await rm(root, { recursive: true, force: true });
    },
  };
}

export async function createLiveWorkItem(title: string, scope: ChangeScope): Promise<string> {
  const repo = requireLiveRepo();
  const body =
    `<!-- change-scope -->\n${JSON.stringify(scope, null, 2)}\n<!-- /change-scope -->\n\n` +
    'Created by the explicitly authorized live acceptance pilot.';
  const result = await execFileAsync(
    'gh',
    ['api', `repos/${repo}/issues`, '--method', 'POST', '--field', `title=${title}`, '--field', `body=${body}`, '--jq', '.number'],
    { encoding: 'utf8' },
  );
  return result.stdout.trim();
}

export async function closeLiveWorkItem(workItemId: string): Promise<void> {
  const repo = requireLiveRepo();
  await execFileAsync(
    'gh',
    ['api', `repos/${repo}/issues/${workItemId}`, '--method', 'PATCH', '--field', 'state=closed'],
    { encoding: 'utf8' },
  );
}

export async function deleteLiveBranch(branch: string): Promise<void> {
  const repo = requireLiveRepo();
  try {
    await execFileAsync('gh', ['api', `repos/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, '--method', 'DELETE'], {
      encoding: 'utf8',
    });
  } catch {
    // The branch may already have been deleted by a provider-side operation.
  }
}
