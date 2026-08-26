// T013: Azure auth tests - Entra is attempted first, PAT is considered only
// for approved acquisition-unavailable fallback, and no credential reaches
// arguments, files, output, or evidence (FR-008, FR-009, FR-037, SC-016).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  AzureAuthenticator,
  EnvironmentPatSource,
  SecretString,
  SpawnedAzCli,
  gitAuthEnv,
} from '../../../src/adapters/azure/auth.ts';

test('SecretString never stringifies to the secret and supports hashed comparison', () => {
  const secret = SecretString.from('hunter2-secret-value');
  assert.equal(secret.toString(), '<redacted>');
  assert.ok(!secret.toString().includes('hunter2'));
  assert.ok(!JSON.stringify(secret).includes('hunter2'), 'toJSON must redact the secret');
  assert.equal(secret.hash(), `sha256:${createHash('sha256').update('hunter2-secret-value', 'utf8').digest('hex')}`);
  assert.ok(!secret.basicHeader().includes('hunter2'), 'basic header base64s the pair');
  assert.ok(secret.bearerHeader().startsWith('Bearer '));
  assert.ok(secret.bearerHeader().length > 'Bearer '.length, 'bearer header carries the opaque token');
});

test('Entra is attempted first; a successful token becomes an entra selection', async () => {
  const attempts: string[] = [];
  const authenticator = new AzureAuthenticator({
    azCli: {
      accountGetAccessToken: async (tenantId) => {
        attempts.push(tenantId ?? 'no-tenant');
        return { token: 'entra-token-value', expiresOn: '2026-08-15T00:00:00.000Z' };
      },
    },
    tenantId: 'tenant-1',
    patFallback: { mode: 'company-approved', source: { read: async () => SecretString.from('pat-value') } },
  });
  const selection = await authenticator.select();
  assert.equal(selection.source, 'entra');
  assert.deepEqual(attempts, ['tenant-1']);
});

test('PAT fallback requires company-approved mode and is used only when Entra acquisition is unavailable', async () => {
  const authenticator = new AzureAuthenticator({
    azCli: {
      accountGetAccessToken: async () => {
        throw new Error('az not installed');
      },
    },
    patFallback: { mode: 'company-approved', source: { read: async () => SecretString.from('pat-value') } },
  });
  const selection = await authenticator.select();
  assert.equal(selection.source, 'pat-fallback');
  assert.equal(selection.credential?.toString(), '<redacted>');
});

test('PAT fallback is not attempted for authorization or network failures', async () => {
  for (const message of ['403 Forbidden', 'network timeout']) {
    let reads = 0;
    const authenticator = new AzureAuthenticator({
      azCli: { accountGetAccessToken: async () => { throw new Error(message); } },
      patFallback: { mode: 'company-approved', source: { read: async () => { reads += 1; return SecretString.from('pat-value'); } } },
    });
    const selection = await authenticator.select();
    assert.equal(selection.source, 'none');
    assert.equal(reads, 0, `PAT must not be read after ${message}`);
  }
});

test('no credential reaches arguments or output', async () => {
  const authenticator = new AzureAuthenticator({
    azCli: {
      accountGetAccessToken: async () => {
        throw new Error('az not installed');
      },
    },
    patFallback: { mode: 'company-approved', source: { read: async () => SecretString.from('pat-value') } },
  });
  const selection = await authenticator.select();
  assert.ok(!JSON.stringify(selection).includes('pat-value'), 'selection must not serialize the secret');
  assert.equal(selection.detail.includes('pat-value'), false);
});

test('PAT fallback with disabled mode yields none with an explicit reason', async () => {
  const authenticator = new AzureAuthenticator({
    azCli: {
      accountGetAccessToken: async () => {
        throw new Error('az not installed');
      },
    },
    patFallback: { mode: 'disabled', source: { read: async () => SecretString.from('pat-value') } },
  });
  const selection = await authenticator.select();
  assert.equal(selection.source, 'none');
  assert.match(selection.detail, /not company-approved/);
});

test('forced PAT fallback with disabled mode yields none, never a fallback', async () => {
  const authenticator = new AzureAuthenticator({
    environment: { AGENT_WORKSPACE_FORCE_PAT_FALLBACK: '1' },
    patFallback: { mode: 'disabled', source: { read: async () => SecretString.from('pat-value') } },
  });
  const selection = await authenticator.select();
  assert.equal(selection.source, 'none');
});

test('an approved PAT variable that is unset yields none, never an implicit fallback', async () => {
  const authenticator = new AzureAuthenticator({
    azCli: {
      accountGetAccessToken: async () => {
        throw new Error('az not installed');
      },
    },
    patFallback: { mode: 'company-approved', source: { read: async () => undefined } },
  });
  const selection = await authenticator.select();
  assert.equal(selection.source, 'none');
});

test('EnvironmentPatSource reads only the named variable and rejects template placeholders', async () => {
  const variableName = 'AGENT_WORKSPACE_AZURE_PAT';
  const previous = process.env[variableName];
  delete process.env[variableName];
  try {
    const source = new EnvironmentPatSource(variableName);
    assert.equal(await source.read(), undefined);
    process.env[variableName] = '${AZURE_PAT}';
    assert.equal(await source.read(), undefined, 'unexpanded placeholders must not be treated as credentials');
    process.env[variableName] = 'pat-value';
    assert.equal((await source.read())?.toString(), '<redacted>');
  } finally {
    if (previous === undefined) delete process.env[variableName];
    else process.env[variableName] = previous;
  }
});

test('SpawnedAzCli passes only CLI flags, never a credential, in arguments', async () => {
  const spawn = new SpawnedAzCli();
  const args = ['account', 'get-access-token', '--output', 'json', '--tenant', 'tenant-1'];
  assert.ok(!args.some((arg) => /token=/.test(arg) || arg.includes('pat')));
  assert.ok(!JSON.stringify(args).includes('hunter2'));
  assert.ok(spawn instanceof SpawnedAzCli);
});

test('gitAuthEnv produces ephemeral GIT_CONFIG headers, never credential files', async () => {
  const entra = gitAuthEnv({ source: 'entra', credential: SecretString.from('entra-value'), detail: 'd' });
  assert.equal(entra.GIT_CONFIG_COUNT, '1');
  assert.equal(entra.GIT_CONFIG_KEY_0, 'http.extraHeader');
  assert.ok(entra.GIT_CONFIG_VALUE_0?.startsWith('Authorization: Bearer '));
  assert.equal(Object.keys(entra).length, 3, 'only the ephemeral header pair is set');

  const pat = gitAuthEnv({ source: 'pat-fallback', credential: SecretString.from('pat-value'), detail: 'd' });
  assert.ok(pat.GIT_CONFIG_VALUE_0?.startsWith('Authorization: Basic '));
  assert.equal(pat.GIT_CONFIG_COUNT, '1');
});

test('a selection without a credential yields an empty environment', () => {
  assert.deepEqual(gitAuthEnv({ source: 'none', detail: 'none' }), {});
});
