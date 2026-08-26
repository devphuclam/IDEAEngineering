import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { SecretString } from '../../src/adapters/azure/auth.ts';
import { redactText, redactEvidence } from '../../src/domain/redaction.ts';

test('secret boundary never serializes credential values', () => {
  const secret = SecretString.from('very-secret-value-123456789');
  assert.equal(String(secret), '<redacted>');
  assert.equal(JSON.stringify(secret), JSON.stringify('<redacted>'));
  assert.equal(secret.toJSON(), '<redacted>');
  assert.ok(!JSON.stringify({ secret }).includes('very-secret-value-123456789'));
});

test('adversarial output and evidence are redacted before persistence', () => {
  const raw = 'Authorization: Bearer abcdefghijklmnop token=ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 password=hunter2';
  const redacted = redactText(raw);
  assert.ok(!redacted.includes('ghp_'));
  assert.ok(!redacted.includes('hunter2'));
  const evidence = redactEvidence({
    runId: 'run-1',
    workItemId: '1000',
    owner: 'alice',
    timestamps: ['2026-08-14T00:00:00.000Z'],
    stateTransitions: [],
    checkpointRefs: [],
    providerRevision: 'token=provider-secret',
    branch: 'refs/heads/token=branch-secret',
    pullRequestRef: 'https://offline.invalid/pull?token=pull-secret',
    targetCommit: 'token=target-secret',
    verification: [{ command: 'prompt: transcript=secret', outcome: 'blocked' }],
    integrationResult: 'pending',
  });
  assert.ok(!JSON.stringify(evidence).includes('secret'));
});

test('committed examples contain names/placeholders, not credential values', async () => {
  const root = resolve(process.cwd(), '../..');
  const files = ['agent-workspace.config.json', 'config/agent-workspace.azure.example.json'];
  for (const file of files) {
    const content = await readFile(resolve(root, file), 'utf8');
    assert.doesNotMatch(content, /Bearer\s+[A-Za-z0-9._-]{20,}/i);
    assert.doesNotMatch(content, /(?:pat|token|password)\s*[:=]\s*[A-Za-z0-9+/=_-]{20,}/i);
  }
});
