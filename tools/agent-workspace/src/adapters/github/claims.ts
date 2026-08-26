// GitHub LegacyClaimStore (T017): append-only claim records as structured comments
// on the Work Item Issue; oldest-valid-wins reconciliation; release/expire
// records preserve the run, branch, and evidence (FR-004).

import type { ClaimRecord, ClaimState, WorkItemId } from '../../domain/types.ts';
import { acquire, handoff, reconcile, renew } from '../../domain/claims.ts';
import { SerializedGh } from './gh.ts';
import type { LegacyClaimStore } from '../ports.ts';

const RECORD_MARKER = 'claim-record';

export function serializeClaimRecord(record: ClaimRecord): string {
  return (
    `<!-- ${RECORD_MARKER} -->\n\`\`\`json\n${JSON.stringify(record)}\n\`\`\`\n` +
    `<!-- /${RECORD_MARKER} -->`
  );
}

export function parseClaimRecords(body: string): ClaimRecord[] {
  const records: ClaimRecord[] = [];
  const pattern = new RegExp(
    `<!-- ${RECORD_MARKER} -->\\s*\`\`\`json\\s*([\\s\\S]*?)\\s*\`\`\`\\s*<!-- /${RECORD_MARKER} -->`,
    'g',
  );
  for (const match of body.matchAll(pattern)) {
    try {
      records.push(JSON.parse(match[1]) as ClaimRecord);
    } catch {
      // Unparseable record is ignored; the claim protocol stays append-only and
      // deterministic over the records that can be read.
    }
  }
  return records;
}

interface CommentJson {
  id: number;
  created_at: string;
  body: string;
}

export class GitHubClaimStore implements LegacyClaimStore {
  private readonly gh: SerializedGh;
  private readonly repo: string;

  constructor(gh: SerializedGh, repo: string) {
    this.gh = gh;
    this.repo = repo;
  }

  private async readComments(workItemId: WorkItemId): Promise<ClaimRecord[]> {
    const stdout = await this.gh.run([
      'api',
      `repos/${this.repo}/issues/${workItemId}/comments`,
      '--jq',
      '.[] | {id, created_at, body}',
    ]);
    if (stdout === '') return [];
    const comments = stdout
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line) as CommentJson)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    return comments.flatMap((comment) => parseClaimRecords(comment.body));
  }

  private async append(workItemId: WorkItemId, record: ClaimRecord): Promise<void> {
    await this.gh.run([
      'issue',
      'comment',
      workItemId,
      '--body',
      serializeClaimRecord(record),
      '-R',
      this.repo,
    ]);
  }

  async acquire(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }> {
    const records = await this.readComments(claim.workItemId);
    const outcome = acquire(records, claim, new Date().toISOString());
    if (outcome.winner) {
      const existing = reconcile(records, new Date().toISOString()).active;
      if (existing?.claimToken === claim.claimToken && existing.claimant === claim.claimant) return outcome;
      await this.append(claim.workItemId, claim);
      const reconciled = reconcile(await this.readComments(claim.workItemId), new Date().toISOString()).active;
      if (!reconciled || reconciled.claimToken !== claim.claimToken || reconciled.claimant !== claim.claimant) {
        return {
          winner: false,
          reason: `claim lost deterministic reconciliation to ${reconciled?.claimant ?? 'another claimant'}`,
        };
      }
    }
    return outcome;
  }

  async renew(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }> {
    const records = await this.readComments(claim.workItemId);
    const outcome = renew(records, claim, new Date().toISOString());
    if (outcome.winner) {
      await this.append(claim.workItemId, claim);
      const reconciled = reconcile(await this.readComments(claim.workItemId), new Date().toISOString()).active;
      if (!reconciled || reconciled.claimToken !== claim.claimToken || reconciled.claimant !== claim.claimant) {
        return { winner: false, reason: `renewal lost reconciliation to ${reconciled?.claimant ?? 'another claimant'}` };
      }
    }
    return outcome;
  }

  async handoff(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }> {
    const records = await this.readComments(claim.workItemId);
    const outcome = handoff(records, claim, new Date().toISOString());
    if (!outcome.winner) return outcome;
    await this.append(claim.workItemId, claim);
    const reconciled = reconcile(await this.readComments(claim.workItemId), new Date().toISOString()).active;
    if (!reconciled || reconciled.claimToken !== claim.claimToken || reconciled.claimant !== claim.claimant) {
      return { winner: false, reason: `handoff lost reconciliation to ${reconciled?.claimant ?? 'another claimant'}` };
    }
    return outcome;
  }

  async release(workItemId: WorkItemId, claimToken?: string): Promise<void> {
    const records = await this.readComments(workItemId);
    const active = reconcile(records, new Date().toISOString()).active;
    if (active && (!claimToken || active.claimToken === claimToken)) {
      await this.append(workItemId, { ...active, kind: 'release' });
    }
  }

  async expire(workItemId: WorkItemId, claimToken?: string): Promise<void> {
    const records = await this.readComments(workItemId);
    const active = reconcile(records, new Date().toISOString()).active;
    if (active && (!claimToken || active.claimToken === claimToken)) {
      await this.append(workItemId, { ...active, kind: 'expire' });
    }
  }

  async active(workItemId: WorkItemId): Promise<ClaimState | undefined> {
    const records = await this.readComments(workItemId);
    return reconcile(records, new Date().toISOString()).active;
  }

  async records(workItemId: WorkItemId): Promise<ClaimRecord[]> {
    return this.readComments(workItemId);
  }
}
