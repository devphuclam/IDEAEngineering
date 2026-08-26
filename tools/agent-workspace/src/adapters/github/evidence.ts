// GitHub LegacyEvidenceStore (T040): durable attributable evidence records appended
// to the Work Item Issue as structured comments; redaction happens BEFORE
// persistence (FR-015). Local mirror under .workspace/runs/<run-id>/run/.

import { redactEvidence } from '../../domain/redaction.ts';
import { evidencePath, readJson, writeJsonAtomic } from '../local/state-files.ts';
import { SerializedGh } from './gh.ts';
import type { LegacyEvidenceStore } from '../ports.ts';
import type { RunEvidence, RunId } from '../../domain/types.ts';
import { WorkspaceError } from '../../errors.ts';

const EVIDENCE_MARKER = 'evidence';

export function serializeEvidence(evidence: RunEvidence): string {
  return (
    `<!-- ${EVIDENCE_MARKER} -->\n\`\`\`json\n${JSON.stringify(evidence, null, 2)}\n\`\`\`\n` +
    `<!-- /${EVIDENCE_MARKER} -->`
  );
}

export class GitHubEvidenceStore implements LegacyEvidenceStore {
  private readonly gh: SerializedGh;
  private readonly repo: string;
  private readonly cwd: string;

  constructor(gh: SerializedGh, repo: string, cwd = process.cwd()) {
    this.gh = gh;
    this.repo = repo;
    this.cwd = cwd;
  }

  async persist(evidence: RunEvidence): Promise<void> {
    const redacted = redactEvidence(evidence);
    const body = serializeEvidence(redacted);
    await this.gh.run([
      'issue',
      'comment',
      evidence.workItemId,
      '--body',
      body,
      '-R',
      this.repo,
    ]);
    // Local mirror (git-ignored execution aid; never the canonical record).
    await writeJsonAtomic(evidencePath(evidence.runId, this.cwd), redacted);
  }

  async read(runId: RunId): Promise<RunEvidence> {
    const local = await readJson<RunEvidence>(evidencePath(runId, this.cwd));
    if (local) return local;
    throw new WorkspaceError(
      'EVIDENCE_MIRROR_MISSING',
      'capability',
      `no local evidence mirror for run ${runId}; inspect the Work Item issue`,
    );
  }

  async list(workItemId: string): Promise<RunEvidence[]> {
    const stdout = await this.gh.run([
      'api',
      `repos/${this.repo}/issues/${workItemId}/comments`,
      '--jq',
      '.[] | {created_at, body}',
    ]);
    if (!stdout.trim()) return [];
    const records: RunEvidence[] = [];
    for (const line of stdout.split('\n').filter((entry) => entry.trim())) {
      try {
        const comment = JSON.parse(line) as { body?: string };
        const match = comment.body?.match(/<!-- evidence -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- \/evidence -->/);
        if (match) records.push(JSON.parse(match[1]) as RunEvidence);
      } catch {
        // Ignore unrelated or malformed comments; the canonical evidence
        // stream remains inspectable and malformed data never becomes PASS.
      }
    }
    return records;
  }
}
