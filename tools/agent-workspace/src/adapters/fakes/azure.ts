import { SecretString } from '../azure/auth.ts';
import { AzureHttpClient, type HttpRequest, type HttpResponse, type HttpTransport } from '../azure/http.ts';
import { canonicalJson } from '../../domain/mutations.ts';

const fakeIds = {
  organization: 'offline-organization',
  project: '00000000-0000-0000-0000-000000000001',
  repository: '00000000-0000-0000-0000-000000000002',
  area: '00000000-0000-0000-0000-000000000003',
  process: '00000000-0000-0000-0000-000000000004',
};
const projectDto = { id: fakeIds.project, name: 'offline-project' };
const processDto = { id: fakeIds.process, name: 'Agile' };
const repositoryDto = {
  id: fakeIds.repository,
  name: 'offline-repository',
  remoteUrl: 'https://offline.invalid/offline-repository.git',
  defaultBranch: 'refs/heads/main',
  isDisabled: false,
  project: { id: fakeIds.project, name: 'offline-project' },
};
const workItemTypeMetadataDto = { name: 'User Story', states: [{ name: 'New', category: 'Proposed' }, { name: 'Active', category: 'InProgress' }, { name: 'Resolved', category: 'Resolved' }, { name: 'Closed', category: 'Completed' }] };
const areaNodeDto = { id: fakeIds.area, path: '\\offline-project' };

export interface FakeAzureWorkItem {
  id: number;
  rev: number;
  fields: Record<string, string>;
  relations: Array<{ rel: string; url: string }>;
}

export class FakeAzureState {
  readonly workItems = new Map<number, FakeAzureWorkItem>();
  readonly comments = new Map<number, Array<Record<string, unknown>>>();
  readonly requests: HttpRequest[] = [];
  readonly pullRequests: Array<Record<string, unknown>> = [];
  readonly refs = new Map<string, string>([['refs/heads/main', 'offline-target-commit']]);
  beforeRequest?: (request: HttpRequest, state: FakeAzureState) => void | Promise<void>;
  private nextWorkItem = 1000;

  constructor() {
    this.seed({
      'System.Title': 'Offline candidate',
      'System.Description': '<div>Offline candidate</div>',
      'System.State': 'New',
      'System.Tags': '',
    });
  }

  seed(fields: Record<string, string>, id = this.nextWorkItem++): number {
    this.workItems.set(id, { id, rev: 1, fields: { ...fields }, relations: [] });
    this.comments.set(id, []);
    return id;
  }

  transport(base = 'https://offline.invalid/azure'): FakeAzureTransport {
    return new FakeAzureTransport(this);
  }

  client(credential = SecretString.from('offline-token')): AzureHttpClient {
    return new AzureHttpClient(this.transport(), () => credential, `https://offline.invalid/${fakeIds.organization}`);
  }
}

export class FakeAzureTransport implements HttpTransport {
  readonly requests: HttpRequest[] = [];
  readonly state: FakeAzureState;
  constructor(state: FakeAzureState) { this.state = state; }

  async request(request: HttpRequest): Promise<HttpResponse> {
    this.requests.push(request);
    this.state.requests.push(request);
    const url = new URL(request.url);
    if (/dev\.azure\.com/i.test(url.hostname)) throw new Error('production Azure network access is denied by the offline fake');
    await this.state.beforeRequest?.(request, this.state);
    const path = decodeURI(url.pathname);
    if (request.method === 'GET' && /\/_apis\/projects\//i.test(path)) return this.json(200, projectDto);
    if (request.method === 'GET' && /\/_apis\/git\/repositories\/[^/]+$/i.test(path)) return this.json(200, repositoryDto);
    if (request.method === 'GET' && /\/_apis\/git\/repositories\//i.test(path) && /refs/.test(path)) {
      const filter = url.searchParams.get('filter')?.replace(/^heads\//, '') ?? '';
      const values = [...this.state.refs.entries()]
        .filter(([name]) => !filter || name.startsWith(`refs/heads/${filter}`))
        .map(([name, objectId]) => ({ name, objectId }));
      return this.json(200, { count: values.length, value: values });
    }
    if (request.method === 'GET' && /\/_apis\/git\/repositories\//i.test(path) && /pullrequests\/\d+$/i.test(path)) {
      const id = Number(path.split('/').at(-1));
      const pr = this.state.pullRequests[id - 1];
      return pr ? this.json(200, pr) : this.json(404, { message: 'not found' });
    }
    if (request.method === 'GET' && /\/_apis\/git\/repositories\//i.test(path) && /pullrequests/.test(path)) return this.json(200, { count: this.state.pullRequests.length, value: this.state.pullRequests });
    if (request.method === 'POST' && /\/_apis\/git\/repositories\/.*\/refs$/i.test(path)) {
      const updates = this.parseBody(request);
      if (!Array.isArray(updates)) return this.json(400, { message: 'ref updates must be an array' });
      const zero = '0000000000000000000000000000000000000000';
      const results: Array<Record<string, unknown>> = [];
      for (const update of updates) {
        const name = String(update.name ?? '');
        const oldObjectId = String(update.oldObjectId ?? '');
        const newObjectId = String(update.newObjectId ?? '');
        const current = this.state.refs.get(name);
        if ((current ?? zero) !== oldObjectId) return this.json(409, { message: 'ref oldObjectId conflict' });
        if (newObjectId === zero) this.state.refs.delete(name);
        else this.state.refs.set(name, newObjectId);
        results.push({ name, oldObjectId, newObjectId, success: true, updateStatus: 'succeeded' });
      }
      return this.json(200, { count: results.length, value: results });
    }
    if (request.method === 'POST' && /\/_apis\/git\/repositories\/.*\/pullrequests/.test(path)) {
      const body = this.parseBody(request);
      const pr = { pullRequestId: this.state.pullRequests.length + 1, status: 'active', sourceRefName: body.sourceRefName, targetRefName: body.targetRefName, mergeStatus: 'succeeded', url: `${request.url}/1`, title: body.title, description: body.description ?? '', workItemRefs: Array.isArray(body.workItemRefs) ? body.workItemRefs : [], sourceCommit: this.state.refs.get(body.sourceRefName) ?? 'offline-source-commit', targetCommit: this.state.refs.get(body.targetRefName) ?? 'offline-target-commit' };
      this.state.pullRequests.push(pr);
      return this.json(200, pr);
    }
    if (request.method === 'PATCH' && /\/_apis\/git\/repositories\/.*\/pullrequests\//.test(path)) {
      const id = Number(path.split('/').at(-1));
      const pr = this.state.pullRequests[id - 1];
      if (!pr) return this.json(404, { message: 'not found' });
      const body = this.parseBody(request);
      if (body.status === 'completed') {
        const sourceCommit = String(body.lastMergeSourceCommit?.commitId ?? '');
        const targetCommit = String(body.lastMergeTargetCommit?.commitId ?? '');
        if (sourceCommit !== pr.sourceCommit || this.state.refs.get(String(pr.sourceRefName)) !== sourceCommit) return this.json(409, { message: 'source commit compare-and-set conflict' });
        if (targetCommit !== pr.targetCommit || this.state.refs.get(String(pr.targetRefName)) !== targetCommit) return this.json(409, { message: 'target commit compare-and-set conflict' });
        const mergeCommit = `offline-merge-commit-${id}`;
        Object.assign(pr, body, { status: 'completed', mergeStatus: 'succeeded', lastMergeCommit: { commitId: mergeCommit } });
        this.state.refs.set(String(pr.targetRefName), mergeCommit);
        return this.json(200, pr);
      }
      Object.assign(pr, body);
      pr.status = typeof body.status === 'string' ? body.status : String(pr.status);
      return this.json(200, pr);
    }
    if (request.method === 'GET' && /\/_apis\/wit\/classificationnodes\/areas/i.test(path)) return this.json(200, areaNodeDto);
    if (request.method === 'GET' && /\/_apis\/work\/processconfiguration/i.test(path)) return this.json(200, processDto);
    if (request.method === 'GET' && /\/_apis\/wit\/workitemtypes\//i.test(path)) return this.json(200, workItemTypeMetadataDto);
    if (request.method === 'POST' && /\/_apis\/wit\/wiql/i.test(path)) {
      const body = this.parseBody(request);
      const query = String(body.query ?? '');
      const ids = [...this.state.workItems.values()].filter((item) => query.includes('integration-queue') ? item.fields['System.Tags']?.includes('agent-workspace:integration-queue') : true).map((item) => ({ id: item.id, url: `${request.url}/${item.id}` }));
      return this.json(200, { queryType: 'flat', workItems: ids });
    }
    const commentsMatch = path.match(/\/_apis\/wit\/workitems\/(\d+)\/comments/i);
    if (commentsMatch) {
      const id = Number(commentsMatch[1]);
      const comments = this.state.comments.get(id) ?? [];
      if (request.method === 'GET') return this.json(200, { totalCount: comments.length, comments, continuationToken: null });
      if (request.method === 'POST') {
        const body = this.parseBody(request);
        const comment = { id: comments.length + 1, rev: 1, text: String(body.text ?? ''), createdBy: { displayName: 'offline-user', uniqueName: 'offline@example.invalid' }, createdDate: '2026-08-14T00:00:00.000Z', version: 1 };
        comments.push(comment);
        this.state.comments.set(id, comments);
        return this.json(200, comment);
      }
    }
    const itemMatch = path.match(/\/_apis\/wit\/workitems\/(\$[^/]+|\d+)$/i);
    if (itemMatch) {
      const idToken = itemMatch[1];
      if (request.method === 'PATCH' && idToken.startsWith('$')) {
        const id = this.state.seed({});
        const item = this.state.workItems.get(id)!;
        this.applyPatch(item, this.parseBody(request));
        return this.json(200, item);
      }
      const id = Number(idToken);
      const item = this.state.workItems.get(id);
      if (!item) return this.json(404, { message: 'not found' });
      if (request.method === 'GET') return this.json(200, item);
      if (request.method === 'PATCH') {
        const operations = this.parseBody(request);
        if (!Array.isArray(operations)) return this.json(400, { message: 'patch must be an array' });
        const test = operations.find((op) => op.path === '/rev');
        if (test && item.rev !== test.value) return this.json(412, { message: 'revision conflict' });
        this.applyPatch(item, operations);
        item.rev += 1;
        return this.json(200, item);
      }
    }
    if (request.method === 'GET' && /\/_apis\/git\/policy\/configurations/i.test(path)) return this.json(200, { count: 0, value: [] });
    if (request.method === 'GET' && /\/_apis\/policy\/evaluations/i.test(path)) return this.json(200, { count: 0, value: [] });
    if (request.method === 'GET' && /securitynamespaces/i.test(path)) {
      const namespaceId = path.split('/').at(-1);
      const isWorkItem = namespaceId === '83e28ad4-2d72-4ceb-97b0-c7726d5502c3';
      return this.json(200, {
        namespaceId,
        name: isWorkItem ? 'Work Item Tracking' : 'Git Repositories',
        actions: isWorkItem
          ? [{ bit: 1, name: 'WORK_ITEM_READ' }, { bit: 32, name: 'WORK_ITEM_WRITE' }]
          : [{ bit: 1, name: 'GenericRead' }, { bit: 2, name: 'GenericContribute' }, { bit: 32, name: 'PullRequestContribute' }, { bit: 32768, name: 'ForcePush' }],
      });
    }
    if (request.method === 'POST' && /permissionevaluationbatch/i.test(path)) {
      const body = this.parseBody(request);
      const tokens = Array.isArray(body.tokens) ? body.tokens : [];
      return this.json(200, { count: tokens.length, value: tokens.map((token: string) => ({ token, effectivePermissions: 65535 })) });
    }
    return this.json(404, { message: `offline fake has no route for ${request.method} ${path}` });
  }

  private applyPatch(item: FakeAzureWorkItem, operations: Array<Record<string, unknown>>): void {
    for (const operation of operations) {
      if (operation.op === 'test') continue;
      const path = String(operation.path ?? '');
      if (path === '/rev') continue;
      if (path.startsWith('/fields/')) item.fields[path.slice('/fields/'.length)] = String(operation.value ?? '');
    }
  }

  private parseBody(request: HttpRequest): any {
    return request.body ? JSON.parse(request.body) : {};
  }

  private json(status: number, body: unknown): HttpResponse {
    return { status, headers: {}, body: JSON.stringify(body) };
  }
}

export function fakeAzureCanonicalState(state: FakeAzureState): string {
  return canonicalJson({ workItems: [...state.workItems.values()], comments: [...state.comments.entries()], pullRequests: state.pullRequests, refs: [...state.refs.entries()] });
}
