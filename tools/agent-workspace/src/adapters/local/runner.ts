// Local RunnerAdapter (T018): git worktree sandboxes per research.md §3.
// Serialized git operations; cleanup via `git worktree remove`, never rm -rf.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { access } from 'node:fs/promises';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { Serializer } from './state-files.ts';
import { capabilityError, conflictError, isWorkspaceError } from '../../errors.ts';
import type { RunnerAdapter } from '../ports.ts';

const execFileAsync = promisify(execFile);

export function slugifyWorkItem(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return slug || 'work-item';
}

export function sanitizeBranch(workItemSlug: string, workItemId?: string, runId?: string): string {
  const identity = workItemId ? `-wi-${slugifyWorkItem(workItemId)}` : '';
  const runIdentity = runId ? `-run-${slugifyWorkItem(runId).slice(-12)}` : '';
  const branch = `feature/${slugifyWorkItem(workItemSlug)}${identity}${runIdentity}`;
  if (/(^|[-/_])(agent|ai|codex|personal)(?=$|[-/_])/i.test(branch)) {
    throw capabilityError(
      'branch name contains an Agent/AI/Codex/personal marker; use a descriptive Work Item-oriented name (FR-020)',
    );
  }
  return branch;
}

export class LocalRunnerAdapter implements RunnerAdapter {
  private readonly serializer = new Serializer();
  private readonly cloneRoot: string;

  constructor(cloneRoot: string) {
    this.cloneRoot = cloneRoot;
  }

  async create(runId: string, branch: string, from?: string, protectedTarget = 'refs/heads/main'): Promise<string> {
    if (toHeadRef(branch) === toHeadRef(protectedTarget)) {
      throw conflictError(`protected integration target ${toHeadRef(protectedTarget)} cannot be used as a sandbox branch`);
    }
    const worktreePath = join(this.cloneRoot, '.worktrees', runId);
    return this.serializer.run(async () => {
      try {
        await access(worktreePath);
        const actualBranch = (
          await execFileAsync('git', ['-C', worktreePath, 'branch', '--show-current'], { encoding: 'utf8' })
        ).stdout.trim();
        if (actualBranch !== branch) {
          throw conflictError(
            `sandbox ${runId} already exists on branch ${actualBranch}; refusing to reuse it for ${branch}`,
          );
        }
        return `sandbox-${runId}`;
      } catch (error) {
        if (isWorkspaceError(error)) throw error;
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          const message = (error as { stderr?: string }).stderr ?? 'could not inspect existing sandbox';
          if (!message.includes('not a git repository')) throw capabilityError(message);
        }
      }
      try {
        if (from) {
          try {
            await execFileAsync('git', ['-C', this.cloneRoot, 'cat-file', '-e', `${from}^{commit}`], { encoding: 'utf8' });
          } catch {
            try {
              await execFileAsync('git', ['-C', this.cloneRoot, 'fetch', 'origin', branch], { encoding: 'utf8' });
            } catch {
              // The final worktree add below reports the classified failure;
              // local-only repositories do not need a remote fetch.
            }
          }
        }
        const source = from ?? 'HEAD';
        await execFileAsync('git', ['-C', this.cloneRoot, 'worktree', 'add', worktreePath, '-b', branch, source]);
      } catch (error) {
        const e = error as { stderr?: string };
        if (e.stderr?.includes('branch') && e.stderr?.includes('already exists')) {
          try {
            await execFileAsync('git', ['-C', this.cloneRoot, 'worktree', 'add', worktreePath, branch]);
            return `sandbox-${runId}`;
          } catch (existingBranchError) {
            const existing = existingBranchError as { stderr?: string };
            throw conflictError(`could not reuse existing branch ${branch}: ${existing.stderr ?? 'git failed'}`);
          }
        }
        throw capabilityError(`could not create sandbox worktree: ${e.stderr ?? 'git failed'}`);
      }
      return `sandbox-${runId}`;
    });
  }

  async destroy(sandboxId: string): Promise<void> {
    const runId = sandboxId.replace(/^sandbox-/, '');
    if (!/^[A-Za-z0-9._-]+$/.test(runId)) {
      throw conflictError('invalid sandbox id; refusing to remove an ambiguous path');
    }
    const worktreePath = resolve(this.cloneRoot, '.worktrees', runId);
    const root = resolve(this.cloneRoot);
    const outside = relative(root, worktreePath).startsWith('..') || isAbsolute(relative(root, worktreePath));
    if (outside) throw conflictError('sandbox path is outside the clone root');
    await this.serializer.run(async () => {
      try {
        await execFileAsync('git', ['-C', this.cloneRoot, 'worktree', 'remove', '--force', worktreePath]);
      } catch (error) {
        const e = error as { stderr?: string };
        throw capabilityError(`could not remove sandbox worktree: ${e.stderr ?? 'git failed'}`);
      }
    });
  }
}

function toHeadRef(ref: string): string {
  return ref.startsWith('refs/heads/') ? ref : `refs/heads/${ref}`;
}
