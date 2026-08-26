// T012: Azure HTTP transport tests - endpoint-local API versions, URI
// encoding, pagination, malformed responses, Retry-After, bounded jitter,
// unknown mutation delivery, and redacted classifications (FR-035).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  AzureHttpClient,
  RedactedAzureError,
  fetchAllPages,
  rateHeaderDiagnostics,
} from '../../../src/adapters/azure/http.ts';
import { FakeHttpTransport } from '../../../src/adapters/fakes/revised.ts';
import { placeholder, throttlingHeaders, paginationContinuationToken } from '../../../test/fixtures/azure/fixtures.ts';
import { SecretString } from '../../../src/adapters/azure/auth.ts';

const ORG = `https://dev.azure.com/${placeholder.organization}`;
const credential = () => SecretString.from(placeholder.owner);

test('requests carry the endpoint-local api-version and percent-encoded segments', async () => {
  const transport = new FakeHttpTransport();
  transport.handler = async (request) => {
    assert.equal(request.method, 'GET');
    assert.ok(request.url.includes(`/_apis/projects/${encodeURIComponent(placeholder.project)}`));
    assert.ok(request.url.includes(`api-version=7.1`));
    assert.equal(request.headers.Authorization, 'Basic ' + Buffer.from(`:${placeholder.owner}`, 'utf8').toString('base64'));
    return transport.jsonResponse(200, { id: placeholder.projectId, name: placeholder.project });
  };
  const client = new AzureHttpClient(transport, credential, ORG);
  const raw = await client.get(`/_apis/projects/${encodeURIComponent(placeholder.project)}`);
  assert.deepEqual(raw, { id: placeholder.projectId, name: placeholder.project });
});

test('Entra selections use a bearer Authorization header', async () => {
  const transport = new FakeHttpTransport();
  transport.handler = async (request) => {
    assert.equal(request.headers.Authorization, 'Bearer entra-token');
    return transport.jsonResponse(200, { ok: true });
  };
  const client = new AzureHttpClient(transport, () => SecretString.from('entra-token'), ORG, '7.1', () => 'entra');
  assert.deepEqual(await client.get('/_apis/projects'), { ok: true });
});

test('an explicit endpoint-local api-version overrides the default', async () => {
  const transport = new FakeHttpTransport();
  transport.handler = async (request) => {
    assert.ok(request.url.includes('api-version=5.1'));
    return transport.jsonResponse(200, {});
  };
  const client = new AzureHttpClient(transport, credential, ORG);
  await client.get('/_apis/projects', {}, '5.1');
});

test('fetchAllPages walks continuation tokens to exhaustion', async () => {
  const calls: Array<string | null> = [];
  const pages = fetchAllPages<string>({
    fetch: async (token) => {
      calls.push(token);
      if (token === null) return { items: ['a', 'b'], continuationToken: paginationContinuationToken };
      return { items: ['c'], continuationToken: null };
    },
  });
  assert.deepEqual(await pages, ['a', 'b', 'c']);
  assert.deepEqual(calls, [null, paginationContinuationToken]);
});

test('fetchAllPages fails closed when the page bound is exceeded', async () => {
  const pages = fetchAllPages<string>({
    fetch: async () => ({ items: [], continuationToken: 'forever' }),
  }, 3);
  await assert.rejects(pages, RedactedAzureError);
});

test('malformed responses throw AzureWireError, not raw JSON', async () => {
  const transport = new FakeHttpTransport(async () => ({ status: 200, headers: {}, body: 'not json' }));
  const client = new AzureHttpClient(transport, credential, ORG);
  await assert.rejects(client.get('/_apis/projects'), /not valid JSON/);
});

test('429 with Retry-After retries and then reports throttled', async () => {
  const transport = new FakeHttpTransport(async () => ({
    status: 429,
    headers: throttlingHeaders,
    body: '',
  }));
  const client = new AzureHttpClient(transport, credential, ORG);
  await assert.rejects(client.get('/_apis/projects'), (error: unknown) => {
    assert.ok(error instanceof RedactedAzureError);
    assert.equal(error.classification, 'throttled');
    assert.equal(error.status, 429);
    return true;
  });
  assert.ok(transport.requests.length >= 2, 'retried before giving up');
});

test('429 with Retry-After succeeds after a transient 429', async () => {
  let attempts = 0;
  const transport = new FakeHttpTransport();
  transport.handler = async () => {
    attempts += 1;
    if (attempts === 1) return { status: 429, headers: { 'retry-after': '0' }, body: '' };
    return transport.jsonResponse(200, { ok: true });
  };
  const client = new AzureHttpClient(transport, credential, ORG);
  const result = await client.get('/_apis/projects');
  assert.deepEqual(result, { ok: true });
  assert.ok(attempts >= 2);
});

test('network errors are retried with bounded jitter and classified as network', async () => {
  let attempts = 0;
  const transport = new FakeHttpTransport();
  transport.handler = async () => {
    attempts += 1;
    if (attempts <= 2) throw new Error('fetch failed: ECONNRESET');
    return transport.jsonResponse(200, { ok: true });
  };
  const client = new AzureHttpClient(transport, credential, ORG);
  assert.deepEqual(await client.get('/_apis/projects'), { ok: true });
  assert.ok(attempts >= 2);
});

test('persistent network failure is classified as network after retries', async () => {
  const transport = new FakeHttpTransport(async () => {
    throw new Error('fetch failed: network');
  });
  const client = new AzureHttpClient(transport, credential, ORG);
  await assert.rejects(client.get('/_apis/projects'), (error: unknown) => {
    assert.ok(error instanceof RedactedAzureError);
    assert.equal(error.classification, 'network');
    return true;
  });
});

test('401/403 classify as auth and never fall back', async () => {
  const transport = new FakeHttpTransport(async () => ({ status: 403, headers: {}, body: '' }));
  const client = new AzureHttpClient(transport, credential, ORG);
  await assert.rejects(client.get('/_apis/projects'), (error: unknown) => {
    assert.ok(error instanceof RedactedAzureError);
    assert.equal(error.classification, 'auth');
    return true;
  });
});

test('404/409/412 classify as not-found/conflict', async () => {
  const client = new AzureHttpClient(
    new FakeHttpTransport(async () => ({ status: 404, headers: {}, body: '' })),
    credential,
    ORG,
  );
  await assert.rejects(client.get('/_apis/projects'), (error: unknown) => {
    assert.ok(error instanceof RedactedAzureError);
    assert.equal(error.classification, 'not-found');
    return true;
  });
  const conflictClient = new AzureHttpClient(
    new FakeHttpTransport(async () => ({ status: 409, headers: {}, body: '' })),
    credential,
    ORG,
  );
  await assert.rejects(conflictClient.post('/_apis/foo', {}), (error: unknown) => {
    assert.ok(error instanceof RedactedAzureError);
    assert.equal(error.classification, 'conflict');
    return true;
  });
});

test('server errors retry with bounded jitter then classify as server', async () => {
  const transport = new FakeHttpTransport(async () => ({ status: 500, headers: {}, body: '' }));
  const client = new AzureHttpClient(transport, credential, ORG);
  await assert.rejects(client.get('/_apis/projects'), (error: unknown) => {
    assert.ok(error instanceof RedactedAzureError);
    assert.equal(error.classification, 'server');
    return true;
  });
  assert.ok(transport.requests.length > 1, 'server errors are retried');
});

test('unknown mutation delivery is reported as invalid, never silently accepted', async () => {
  const transport = new FakeHttpTransport(async () => ({ status: 418, headers: {}, body: '' }));
  const client = new AzureHttpClient(transport, credential, ORG);
  await assert.rejects(client.patch('/_apis/foo', {}), (error: unknown) => {
    assert.ok(error instanceof RedactedAzureError);
    assert.equal(error.classification, 'invalid');
    return true;
  });
});

test('redacted errors never include the credential or response detail', async () => {
  const transport = new FakeHttpTransport(async () => ({ status: 401, headers: {}, body: 'denied for ' + placeholder.owner }));
  const client = new AzureHttpClient(transport, credential, ORG);
  await assert.rejects(client.get('/_apis/projects'), (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    assert.ok(!message.includes(placeholder.owner), 'error must not leak identity detail');
    return true;
  });
});

test('the Authorization header never reaches URLs or bodies', async () => {
  const transport = new FakeHttpTransport();
  transport.handler = async (request) => {
    const auth = request.headers.Authorization;
    assert.ok(!request.url.includes(encodeURIComponent(auth)));
    assert.ok(!(request.body ?? '').includes(auth));
    return transport.jsonResponse(200, {});
  };
  const client = new AzureHttpClient(transport, credential, ORG);
  await client.post('/_apis/workitems', { title: 'x' });
  transport.assertNoAuthorizationLeak();
});

test('rateHeaderDiagnostics extracts only known rate headers', () => {
  const diagnostics = rateHeaderDiagnostics({ ...throttlingHeaders, 'content-type': 'application/json' });
  assert.deepEqual(Object.keys(diagnostics).sort(), ['retry-after', 'x-ratelimit-limit', 'x-ratelimit-remaining']);
  assert.equal(diagnostics['retry-after'], '2');
});
