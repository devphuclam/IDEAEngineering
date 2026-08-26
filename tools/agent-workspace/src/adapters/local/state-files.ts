// State-file reader/writer per contracts/state-files.md.
// Atomic temp-file replace; writes are serialized per run.

import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const RUN_DIR = 'run';

export function runBase(runId: string, root?: string): string {
  const base = root ?? process.cwd();
  return join(base, '.workspace', 'runs', runId);
}

export function contextPath(runId: string, root?: string): string {
  return join(runBase(runId, root), RUN_DIR, 'context.json');
}

export function claimPath(runId: string, root?: string): string {
  return join(runBase(runId, root), RUN_DIR, 'claim.json');
}

export function checkpointPath(runId: string, checkpointId: string, root?: string): string {
  return join(runBase(runId, root), RUN_DIR, 'checkpoints', `${checkpointId}.json`);
}

export function evidencePath(runId: string, root?: string): string {
  return join(runBase(runId, root), RUN_DIR, 'evidence.json');
}

export function integrationQueuePath(root?: string): string {
  return join(root ?? process.cwd(), '.workspace', 'integration-queue.json');
}

export interface ProviderQueueMirror {
  schema: 'agent-workspace/provider-queue-mirror';
  version: 1;
  queueKey: string;
  providerRevision: string;
  observedAt: string;
}

export function providerQueueMirrorPath(root?: string): string {
  return join(root ?? process.cwd(), '.workspace', 'provider-queue-mirror.json');
}

export async function writeProviderQueueMirrorAtomic(value: ProviderQueueMirror, root?: string): Promise<void> {
  await writeJsonAtomic(providerQueueMirrorPath(root), value);
}

export async function writeJsonAtomic(filePath: string, value: unknown): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  const tmp = `${filePath}.tmp-${process.pid}`;
  await writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(tmp, filePath);
}

export async function readJson<T>(filePath: string): Promise<T | undefined> {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
}

/** Reads checkpoint records for a run, newest first (per createdAt). */
export async function listCheckpoints<T extends { createdAt: string }>(
  runId: string,
  root?: string,
): Promise<T[]> {
  const dir = join(runBase(runId, root), RUN_DIR, 'checkpoints');
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
  const checkpoints: T[] = [];
  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue;
    const record = await readJson<T>(join(dir, entry));
    if (record) checkpoints.push(record);
  }
  return checkpoints.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

/** Lists local run ids without assuming that any one sandbox is active. */
export async function listLocalRunIds(root?: string): Promise<string[]> {
  const dir = join(root ?? process.cwd(), '.workspace', 'runs');
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
  const runIds: string[] = [];
  for (const entry of entries) {
    if (await readJson<unknown>(contextPath(entry, root))) runIds.push(entry);
  }
  return runIds.sort();
}

/** Serializes writes for one process: no concurrent file/git operations. */
export class Serializer {
  private queue: Promise<unknown> = Promise.resolve();

  run<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.queue.then(operation);
    this.queue = result.catch(() => undefined);
    return result;
  }
}
