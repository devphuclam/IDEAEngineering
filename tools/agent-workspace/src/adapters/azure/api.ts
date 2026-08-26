import type { ProviderRevision } from '../../domain/types.ts';
import { decodeComment, decodeCommentsPage, decodeWorkItem, type WireComment, type WireWorkItem } from './models.ts';
import type { AzureHttpClient } from './http.ts';

export interface AzureApiOptions {
  projectName: string;
  clock?: () => string;
}

export interface AzureWorkItemSnapshot {
  wire: WireWorkItem;
  revision: ProviderRevision;
  observedAt: string;
}

export interface AzureCommentSnapshot {
  comments: WireComment[];
  observedAt: string;
}

export function projectPath(projectName: string): string {
  return encodeURIComponent(projectName);
}

export function workItemPath(projectName: string, workItemId: string | number): string {
  return `/${projectPath(projectName)}/_apis/wit/workitems/${encodeURIComponent(String(workItemId))}`;
}

export function commentsPath(projectName: string, workItemId: string | number): string {
  return `${workItemPath(projectName, workItemId)}/comments`;
}

export async function readWorkItem(
  client: AzureHttpClient,
  options: AzureApiOptions,
  workItemId: string,
): Promise<AzureWorkItemSnapshot> {
  const raw = await client.get(workItemPath(options.projectName, workItemId), { '$expand': 'relations' });
  const wire = decodeWorkItem(raw);
  return { wire, revision: String(wire.rev), observedAt: options.clock?.() ?? new Date().toISOString() };
}

export async function patchWorkItem(
  client: AzureHttpClient,
  options: AzureApiOptions,
  workItemId: string,
  operations: unknown[],
): Promise<AzureWorkItemSnapshot> {
  if (operations.length === 0) throw new Error('Azure Work Item patch must contain at least one operation');
  const raw = await client.patch(workItemPath(options.projectName, workItemId), operations, {}, '7.1');
  const wire = decodeWorkItem(raw);
  return { wire, revision: String(wire.rev), observedAt: options.clock?.() ?? new Date().toISOString() };
}

export async function createWorkItem(
  client: AzureHttpClient,
  options: AzureApiOptions,
  workItemType: string,
  operations: unknown[],
): Promise<AzureWorkItemSnapshot> {
  const path = `/${projectPath(options.projectName)}/_apis/wit/workitems/$${encodeURIComponent(workItemType)}`;
  const raw = await client.patch(path, operations, {}, '7.1');
  const wire = decodeWorkItem(raw);
  return { wire, revision: String(wire.rev), observedAt: options.clock?.() ?? new Date().toISOString() };
}

export async function listComments(
  client: AzureHttpClient,
  options: AzureApiOptions,
  workItemId: string,
): Promise<AzureCommentSnapshot> {
  const comments: WireComment[] = [];
  let continuation: string | null = null;
  do {
    const raw = await client.get(commentsPath(options.projectName, workItemId), continuation ? { continuationToken: continuation } : {}, '7.1-preview.4');
    const page = decodeCommentsPage(raw);
    comments.push(...page.comments);
    continuation = page.continuationToken;
  } while (continuation !== null);
  return { comments, observedAt: options.clock?.() ?? new Date().toISOString() };
}

export async function appendComment(
  client: AzureHttpClient,
  options: AzureApiOptions,
  workItemId: string,
  text: string,
): Promise<WireComment> {
  const raw = await client.post(commentsPath(options.projectName, workItemId), { text, format: 'markdown' }, { format: 'markdown' }, '7.1-preview.4');
  return decodeComment(raw);
}

export async function queryWorkItems(
  client: AzureHttpClient,
  options: AzureApiOptions,
  wiql: string,
): Promise<string[]> {
  const raw = await client.post(`/${projectPath(options.projectName)}/_apis/wit/wiql`, { query: wiql }, {}, '7.1');
  if (typeof raw !== 'object' || raw === null) throw new Error('WIQL response must be an object');
  const value = (raw as { workItems?: unknown }).workItems;
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== 'object' || item === null) return [];
    const id = (item as { id?: unknown }).id;
    return typeof id === 'number' || typeof id === 'string' ? [String(id)] : [];
  });
}

export function testRevision(revision: ProviderRevision): { op: 'test'; path: '/rev'; value: number } {
  const value = Number(revision);
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`invalid Azure Work Item revision ${revision}`);
  return { op: 'test', path: '/rev', value };
}

export function replaceField(path: string, value: unknown): { op: 'add' | 'replace'; path: string; value: unknown } {
  return { op: 'replace', path, value };
}
