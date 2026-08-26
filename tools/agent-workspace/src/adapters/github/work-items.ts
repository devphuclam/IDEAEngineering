// GitHub LegacyWorkItemAdapter (T016): reads Work Items from Issues via gh,
// parses the Change Scope declaration, and appends attributable evidence.

import type { ChangeScope, RunEvidence, WorkItem, WorkItemId, WorkItemState } from '../../domain/types.ts';
import { redactEvidence } from '../../domain/redaction.ts';
import { normalizeError, usageError, WorkspaceError } from '../../errors.ts';
import { SerializedGh } from './gh.ts';
import type { LegacyWorkItemAdapter } from '../ports.ts';

const SCOPE_MARKER = 'change-scope';
const STATUS_LABELS = [
  'status: claimed',
  'status: in-progress',
  'status: ready-for-integration',
  'status: integrated',
  'status: blocked',
];

export function parseChangeScope(body: string | undefined, workItemId: WorkItemId): ChangeScope {
  const fallback: ChangeScope = {
    paths: [],
    semanticSeams: [],
    prerequisites: [],
    integrationTarget: 'main',
  };
  if (!body) return fallback;
  const match = body.match(new RegExp(`<!-- ${SCOPE_MARKER} -->([\\s\\S]*?)<!-- /${SCOPE_MARKER} -->`));
  if (!match) return fallback;
  try {
    const parsed = JSON.parse(match[1].trim()) as Partial<ChangeScope>;
    return {
      paths: parsed.paths ?? [],
      semanticSeams: parsed.semanticSeams ?? [],
      prerequisites: parsed.prerequisites ?? [],
      integrationTarget: parsed.integrationTarget ?? 'main',
    };
  } catch {
    throw usageError(
      `work item ${workItemId} declares a change-scope block that is not valid JSON; ` +
        'fix the declaration before starting a run (FR-009)',
    );
  }
}

interface IssueJson {
  number: number;
  title: string;
  body?: string;
  state: string;
}

export class GitHubWorkItemAdapter implements LegacyWorkItemAdapter {
  private readonly gh: SerializedGh;
  private readonly repo: string;

  constructor(gh: SerializedGh, repo: string) {
    this.gh = gh;
    this.repo = repo;
  }

  async read(workItemId: WorkItemId): Promise<WorkItem> {
    let issue: IssueJson;
    try {
      const stdout = await this.gh.run(['api', `repos/${this.repo}/issues/${workItemId}`, '--jq', '{number,title,body,state}']);
      issue = JSON.parse(stdout) as IssueJson;
    } catch (error) {
      throw normalizeError(error, 'WORK_ITEM_READ_FAILED', 'capability');
    }
    if (issue.state !== 'open') {
      throw new WorkspaceError('WORK_ITEM_NOT_OPEN', 'conflict', `work item ${workItemId} is not open (state: ${issue.state})`);
    }
    const changeScope = parseChangeScope(issue.body, workItemId);
    return {
      id: String(issue.number),
      title: issue.title,
      description: issue.body,
      dependencies: changeScope.prerequisites,
      changeScope,
    };
  }

  async appendEvidence(workItemId: WorkItemId, evidence: RunEvidence): Promise<void> {
    const redacted = redactEvidence(evidence);
    const body =
      `<!-- evidence -->\n\`\`\`json\n${JSON.stringify(redacted, null, 2)}\n\`\`\`\n` +
      `<!-- /evidence -->`;
    await this.gh.run(['issue', 'comment', workItemId, '--body', body, '-R', this.repo]);
  }

  async setState(workItemId: WorkItemId, state: WorkItemState): Promise<void> {
    const stateLabels: Record<WorkItemState, string> = {
      open: '',
      claimed: 'status: claimed',
      'in-progress': 'status: in-progress',
      'ready-for-integration': 'status: ready-for-integration',
      integrated: 'status: integrated',
      blocked: 'status: blocked',
    };
    const label = stateLabels[state];
    const currentLabels = await this.gh.run([
      'api',
      `repos/${this.repo}/issues/${workItemId}`,
      '--jq',
      '[.labels[].name] | .[]',
    ]);
    for (const current of currentLabels.split('\n').map((value) => value.trim()).filter(Boolean)) {
      if (STATUS_LABELS.includes(current) && current !== label) {
        await this.gh.run(['issue', 'edit', workItemId, '--remove-label', current, '-R', this.repo]);
      }
    }
    if (label) await this.gh.run(['issue', 'edit', workItemId, '--add-label', label, '-R', this.repo]);
  }

  async listOpen(): Promise<WorkItem[]> {
    const stdout = await this.gh.run([
      'api',
      `repos/${this.repo}/issues`,
      '--method',
      'GET',
      '--field',
      'state=open',
      '--field',
      'per_page=100',
      '--paginate',
      '--jq',
      '.[] | select(.pull_request == null) | {number,title,body,state}',
    ]);
    return stdout
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        try {
          const issue = JSON.parse(line) as IssueJson;
          const changeScope = parseChangeScope(issue.body, String(issue.number));
          return {
            id: String(issue.number),
            title: issue.title,
            description: issue.body,
            dependencies: changeScope.prerequisites,
            changeScope,
          };
        } catch (error) {
          throw normalizeError(error, 'WORK_ITEM_LIST_FAILED', 'capability');
        }
      });
  }
}
