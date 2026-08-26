// GitHub LegacySourceHostAdapter (T036/T054, FR-020/FR-022): branch and checkpoint
// operations are kept separate from the protected integration target. Pull
// requests are the only merge surface; direct target pushes are never issued.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import type { AgentCheckpoint, WorkItemId } from '../../domain/types.ts';
import { SerializedGh } from './gh.ts';
import { capabilityError, normalizeError, WorkspaceError } from '../../errors.ts';
import type { LegacySourceHostAdapter } from '../ports.ts';

const execFileAsync = promisify(execFile);
const CHECKPOINT_MARKER = 'checkpoint';

export interface ProtectionPolicy {
  requiredApprovingReviews: number;
  requiredChecks: string[];
}

export function parseProtectionPolicy(stdout: string): ProtectionPolicy {
  try {
    const parsed = JSON.parse(stdout) as {
      reviews?: number;
      checks?: Array<{ context?: string }> | string[] | null;
    };
    const checks = (parsed.checks ?? [])
      .map((entry) => (typeof entry === 'string' ? entry : entry.context ?? ''))
      .filter((entry): entry is string => entry.length > 0);
    return { requiredApprovingReviews: parsed.reviews ?? 0, requiredChecks: [...new Set(checks)] };
  } catch {
    throw new WorkspaceError(
      'PROTECTION_UNREADABLE',
      'capability',
      'branch protection response was not valid JSON; integration cannot safely continue',
    );
  }
}

export async function readProtectionPolicy(
  gh: SerializedGh,
  repo: string,
  target: string,
): Promise<ProtectionPolicy> {
  try {
    const stdout = await gh.run([
      'api',
      `repos/${repo}/branches/${target}/protection`,
      '--jq',
      '{reviews: (.required_pull_request_reviews.required_approving_review_count // 0), checks: [(.required_status_checks.checks // [])[] | (.context // .name // "")]}',
    ]);
    return parseProtectionPolicy(stdout);
  } catch (error) {
    const normalized = normalizeError(error);
    if (
      normalized.errorCode === 'REPOSITORY_NOT_FOUND' ||
      (normalized.errorCode === 'GH_FAILED' && /422|validation failed/i.test(normalized.message))
    ) {
      throw new WorkspaceError(
        'PROTECTION_UNAVAILABLE',
        'capability',
        `could not read branch protection for ${target}; verify the target exists and is protected`,
      );
    }
    throw normalized;
  }
}

function parseCheckpointComments(stdout: string): AgentCheckpoint[] {
  const checkpoints: AgentCheckpoint[] = [];
  for (const line of stdout.split('\n').filter((entry) => entry.trim())) {
    try {
      const comment = JSON.parse(line) as { body?: string };
      const match = comment.body?.match(/<!-- checkpoint -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- \/checkpoint -->/);
      if (match) checkpoints.push(JSON.parse(match[1]) as AgentCheckpoint);
    } catch {
      // Unrelated or malformed comments do not become recovery state.
    }
  }
  return checkpoints.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export class GitHubSourceHostAdapter implements LegacySourceHostAdapter {
  private readonly gh: SerializedGh;
  private readonly repo: string;
  private readonly cwd: string;

  constructor(gh: SerializedGh, repo: string, cwd: string) {
    this.gh = gh;
    this.repo = repo;
    this.cwd = cwd;
  }

  async createBranch(name: string, from: string): Promise<void> {
    try {
      await execFileAsync('git', ['-C', this.cwd, 'fetch', 'origin', from], { encoding: 'utf8' });
      await execFileAsync('git', ['-C', this.cwd, 'checkout', '-b', name, `origin/${from}`], { encoding: 'utf8' });
    } catch (error) {
      throw normalizeError(error, 'SOURCE_BRANCH_FAILED', 'capability');
    }
  }

  async pushCheckpoint(checkpoint: AgentCheckpoint, worktreePath?: string): Promise<void> {
    const workingDirectory = worktreePath ? resolve(this.cwd, worktreePath) : this.cwd;
    let head: string;
    try {
      head = (
        await execFileAsync('git', ['-C', workingDirectory, 'rev-parse', 'HEAD'], { encoding: 'utf8' })
      ).stdout.trim();
    } catch (error) {
      throw capabilityError(`cannot resolve checkpoint HEAD in ${workingDirectory}: ${normalizeError(error).message}`);
    }
    if (head !== checkpoint.commit) {
      throw new WorkspaceError(
        'CHECKPOINT_COMMIT_MISMATCH',
        'conflict',
        `checkpoint commit ${checkpoint.commit} does not match sandbox HEAD ${head}`,
      );
    }
    try {
      await execFileAsync('git', ['-C', workingDirectory, 'push', 'origin', `HEAD:${checkpoint.branch}`], {
        encoding: 'utf8',
      });
      const remote = await execFileAsync(
        'git',
        ['-C', workingDirectory, 'ls-remote', 'origin', `refs/heads/${checkpoint.branch}`],
        { encoding: 'utf8' },
      );
      if (!remote.stdout.split(/\s+/).includes(checkpoint.commit)) {
        throw new WorkspaceError(
          'CHECKPOINT_REMOTE_UNCONFIRMED',
          'network',
          `remote branch ${checkpoint.branch} did not confirm commit ${checkpoint.commit}`,
        );
      }
    } catch (error) {
      if (error instanceof WorkspaceError) throw error;
      throw normalizeError(error, 'CHECKPOINT_PUSH_FAILED', 'network');
    }
  }

  async recordCheckpoint(workItemId: WorkItemId, checkpoint: AgentCheckpoint): Promise<void> {
    await this.gh.run([
      'issue',
      'comment',
      workItemId,
      '--body',
      `<!-- ${CHECKPOINT_MARKER} -->\n\`\`\`json\n${JSON.stringify(checkpoint)}\n\`\`\`\n<!-- /${CHECKPOINT_MARKER} -->`,
      '-R',
      this.repo,
    ]);
  }

  async readCheckpoints(workItemId: WorkItemId): Promise<AgentCheckpoint[]> {
    const stdout = await this.gh.run([
      'api',
      `repos/${this.repo}/issues/${workItemId}/comments`,
      '--jq',
      '.[] | {body}',
    ]);
    return parseCheckpointComments(stdout);
  }

  async remoteCommit(checkpoint: AgentCheckpoint): Promise<boolean> {
    try {
      const stdout = await execFileAsync(
        'git',
        ['-C', this.cwd, 'ls-remote', 'origin', `refs/heads/${checkpoint.branch}`],
        { encoding: 'utf8' },
      );
      return stdout.stdout.split(/\s+/).includes(checkpoint.commit);
    } catch (error) {
      throw normalizeError(error, 'SOURCE_REMOTE_READ_FAILED', 'network');
    }
  }

  async openPullRequest(workItemId: WorkItemId, branch: string, integrationTarget = 'main'): Promise<string> {
    const existing = await this.gh.run([
      'pr',
      'list',
      '--head',
      branch,
      '--base',
      integrationTarget,
      '--state',
      'open',
      '--json',
      'url',
      '--jq',
      '.[0].url',
      '-R',
      this.repo,
    ]);
    if (existing.trim()) return existing.trim();
    return this.gh.run([
      'pr',
      'create',
      '--base',
      integrationTarget,
      '--head',
      branch,
      '--title',
      `Integration: work item ${workItemId}`,
      '--body',
      `Checkpointed change for work item ${workItemId}. Incorporated through the workspace integration queue.`,
      '-R',
      this.repo,
    ]);
  }

  async mergePullRequest(branch: string, integrationTarget: string): Promise<void> {
    await this.gh.run([
      'pr',
      'merge',
      branch,
      '--squash',
      '--delete-branch=false',
      '--repo',
      this.repo,
      '--subject',
      `Integrate ${branch} into ${integrationTarget}`,
    ]);
  }

  async requiredChecks(integrationTarget: string): Promise<string[]> {
    const policy = await readProtectionPolicy(this.gh, this.repo, integrationTarget);
    if (policy.requiredApprovingReviews !== 0) {
      throw new WorkspaceError(
        'PROTECTION_POLICY_MISMATCH',
        'capability',
        `integration target requires ${policy.requiredApprovingReviews} human approvals; ` +
          'the workspace policy is minimum_human_approvals: 0 with required checks enforced (FR-022)',
      );
    }
    if (policy.requiredChecks.length === 0) {
      throw new WorkspaceError(
        'REQUIRED_CHECKS_MISSING',
        'capability',
        `integration target ${integrationTarget} has no configured required checks; refusing unverified integration`,
      );
    }
    return policy.requiredChecks;
  }
}

export { parseCheckpointComments };
