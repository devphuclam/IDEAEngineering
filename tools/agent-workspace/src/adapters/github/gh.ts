// gh CLI wrapper per research.md §2:
// - spawns gh, never concurrent content-creating writes (>=1s spacing)
// - classifies 403/429/abuse as quota failures; auth failures as credential;
//   DNS/connectivity failures as network (FR-019, no silent fallback).

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { credentialError, networkError, quotaError, regionError, WorkspaceError } from '../../errors.ts';

const execFileAsync = promisify(execFile);

const CONTENT_CREATING = new Set([
  'issue',
  'comment',
  'pr',
  'create',
  'edit',
  'delete',
  'merge',
]);

/** Content-creating writes are serialized with >=1s spacing (secondary rate limits). */
export class SerializedGh {
  private lastWriteAt = 0;
  private queue: Promise<unknown> = Promise.resolve();
  private readonly spawn: (args: string[], options?: { cwd?: string }) => Promise<string>;

  constructor(
    spawn?: (args: string[], options?: { cwd?: string }) => Promise<string>,
  ) {
    this.spawn =
      spawn ??
      ((args, options) =>
        execFileAsync('gh', args, {
          cwd: options?.cwd,
          encoding: 'utf8',
          maxBuffer: 16 * 1024 * 1024,
        }).then((r) => r.stdout.trim()));
  }

  async run(args: string[], options?: { cwd?: string }): Promise<string> {
    const operation = async (): Promise<string> => {
      const isWrite = args.some((arg) => CONTENT_CREATING.has(arg));
      if (isWrite) {
        const wait = this.lastWriteAt + 1000 - Date.now();
        if (wait > 0) {
          await new Promise((resolve) => setTimeout(resolve, wait));
        }
      }
      try {
        const stdout = await this.spawn(args, options);
        if (isWrite) this.lastWriteAt = Date.now();
        return stdout;
      } catch (error) {
        throw classifyGhError(error);
      }
    };
    const result = this.queue.then(operation);
    this.queue = result.catch(() => undefined);
    return result;
  }
}

export function classifyGhError(error: unknown): WorkspaceError {
  const e = error as { code?: string; stderr?: string; message?: string; status?: number };
  const stderr = `${e?.stderr ?? ''} ${e?.message ?? ''}`.toLowerCase();
  if (e?.code === 'ENOENT') {
    return new WorkspaceError('GH_MISSING', 'capability', 'gh CLI is not installed');
  }
  if (e?.code === 'ECONNREFUSED' || e?.code === 'ENOTFOUND' || e?.code === 'ETIMEDOUT' || e?.code === 'ECONNRESET') {
    return networkError(`network failure reaching GitHub (${e.code})`);
  }
  if (stderr.includes('abuse') || stderr.includes('secondary rate limit') || stderr.includes('429')) {
    return quotaError('GitHub rate limit reached; wait and retry');
  }
  if (stderr.includes('403')) {
    return quotaError('GitHub rejected the write (403); check permissions or rate limits');
  }
  if (stderr.includes('404')) {
    return new WorkspaceError(
      'REPOSITORY_NOT_FOUND',
      'capability',
      'GitHub returned Not Found; check the git remote and repository access',
    );
  }
  if (stderr.includes('not logged in') || stderr.includes('auth') || stderr.includes('401')) {
    return credentialError('gh is not authenticated; run `gh auth login`');
  }
  if (stderr.includes('not available in this region') || stderr.includes('unsupported region')) {
    return regionError('the requested GitHub capability is unavailable in this region');
  }
  return new WorkspaceError('GH_FAILED', 'capability', `gh failed: ${e?.stderr ?? e?.message ?? 'unknown error'}`);
}
