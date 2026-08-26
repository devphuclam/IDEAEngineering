// Shared black-box helpers: temporary repositories and CLI spawning.

import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);

export const PACKAGE_ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const CLI = join(PACKAGE_ROOT, 'src', 'cli', 'index.ts');

export async function makeTempRepo(): Promise<{ root: string; cleanup: () => Promise<void> }> {
  const root = await mkdtemp(join(tmpdir(), 'workspace-bb-'));
  await execFileAsync('git', ['init', '-b', 'main', root]);
  await execFileAsync('git', ['-C', root, 'config', 'user.email', 'test@example.com']);
  await execFileAsync('git', ['-C', root, 'config', 'user.name', 'Blackbox Test']);
  await writeFile(join(root, 'README.md'), '# temp repo\n');
  await writeFile(
    join(root, 'agent-workspace.config.json'),
    `${JSON.stringify(
      {
        schemaVersion: 1,
        provider: 'github',
        runtimeProfile: null,
        github: { remote: 'origin' },
        verification: { commands: ['node --version'] },
        reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
      },
      null,
      2,
    )}\n`,
  );
  await execFileAsync('git', ['-C', root, 'add', '.']);
  await execFileAsync('git', ['-C', root, 'commit', '-m', 'initial']);
  return {
    root,
    cleanup: async () => {
      await rm(root, { recursive: true, force: true });
    },
  };
}

export async function runWorkspace(
  args: string[],
  cwd: string,
  env?: Record<string, string>,
): Promise<{ code: number; stdout: string; stderr: string }> {
  try {
    const { stdout, stderr } = await execFileAsync('node', [CLI, ...args], {
      cwd,
      env: { ...process.env, ...env },
      encoding: 'utf8',
    });
    return { code: 0, stdout, stderr };
  } catch (error) {
    const e = error as { code?: number; stdout?: string; stderr?: string };
    return {
      code: e.code ?? 1,
      stdout: e.stdout ?? '',
      stderr: e.stderr ?? '',
    };
  }
}

export async function hasGhAuth(): Promise<boolean> {
  try {
    await execFileAsync('gh', ['auth', 'status']);
    return true;
  } catch {
    return false;
  }
}
