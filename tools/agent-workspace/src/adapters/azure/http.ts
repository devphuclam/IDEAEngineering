// Azure REST transport (contracts/azure-adapter.md): injected HttpTransport,
// endpoint-local API versions, pagination, throttling with Retry-After,
// strict response validation, unknown-delivery reconciliation hooks, and
// redacted errors. The credential is attached as a header at request time and
// never logged, serialized, or placed in evidence.

import { decodeCommentsPage, type WireCommentsPage } from './models.ts';
import { AzureWireError } from './models.ts';
import type { AuthSource, SecretString } from './auth.ts';

export interface HttpRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface HttpTransport {
  request(request: HttpRequest): Promise<HttpResponse>;
}

/** Production transport: Node's built-in fetch, kept behind the injected seam. */
export class FetchHttpTransport implements HttpTransport {
  async request(request: HttpRequest): Promise<HttpResponse> {
    const response = await fetch(request.url, { method: request.method, headers: request.headers, body: request.body });
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => { headers[key] = value; });
    return { status: response.status, headers, body: await response.text() };
  }
}

export class RedactedAzureError extends Error {
  readonly classification: 'network' | 'auth' | 'not-found' | 'conflict' | 'throttled' | 'server' | 'invalid';
  readonly status?: number;

  constructor(
    message: string,
    classification: 'network' | 'auth' | 'not-found' | 'conflict' | 'throttled' | 'server' | 'invalid',
    status?: number,
  ) {
    super(`azure: ${message} (${classification})`);
    this.name = 'RedactedAzureError';
    this.classification = classification;
    this.status = status;
  }
}

export interface PageFetcher<T> {
  fetch(continuationToken: string | null): Promise<{ items: T[]; continuationToken: string | null }>;
}

export async function fetchAllPages<T>(fetcher: PageFetcher<T>, maxPages = 100): Promise<T[]> {
  const items: T[] = [];
  let token: string | null = null;
  for (let page = 0; page < maxPages; page += 1) {
    const result = await fetcher.fetch(token);
    items.push(...result.items);
    if (result.continuationToken === null) return items;
    token = result.continuationToken;
  }
  throw new RedactedAzureError('pagination exceeded the page bound', 'invalid');
}

function redactHeaders(headers: Record<string, string>): Record<string, string> {
  const redacted: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (/authorization|token|pat|secret|password|key/i.test(key)) {
      redacted[key] = '<redacted>';
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

const RATE_HEADERS = ['x-ratelimit-limit', 'x-ratelimit-remaining', 'retry-after', 'x-ms-ratelimit-remaining'];

export class AzureHttpClient {
  private readonly baseUrl: string;
  private readonly apiVersion: string;
  private readonly transport: HttpTransport;
  private readonly credential: () => SecretString | undefined;
  private readonly authSource: () => AuthSource;

  constructor(
    transport: HttpTransport,
    credential: () => SecretString | undefined,
    organizationUrl: string,
    apiVersion = '7.1',
    authSource: () => AuthSource = () => 'pat-fallback',
  ) {
    this.transport = transport;
    this.credential = credential;
    this.authSource = authSource;
    this.baseUrl = organizationUrl.replace(/\/+$/, '');
    this.apiVersion = apiVersion;
  }

  private headers(): Record<string, string> {
    const credential = this.credential();
    if (!credential) {
      throw new RedactedAzureError('no Azure credential is available in this process', 'auth');
    }
    const authorization = this.authSource() === 'entra' ? credential.bearerHeader() : credential.basicHeader();
    return {
      Authorization: authorization,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  async get(path: string, query: Record<string, string> = {}, apiVersion?: string): Promise<unknown> {
    const url = this.buildUrl(path, query, apiVersion);
    return this.roundTrip({ method: 'GET', url, headers: this.headers() });
  }

  async patch(path: string, body: unknown, query: Record<string, string> = {}, apiVersion?: string): Promise<unknown> {
    const url = this.buildUrl(path, query, apiVersion);
    return this.roundTrip({ method: 'PATCH', url, headers: this.headers(), body: JSON.stringify(body) });
  }

  async post(path: string, body: unknown, query: Record<string, string> = {}, apiVersion?: string): Promise<unknown> {
    const url = this.buildUrl(path, query, apiVersion);
    return this.roundTrip({ method: 'POST', url, headers: this.headers(), body: JSON.stringify(body) });
  }

  async fetchComments(path: string, apiVersion?: string): Promise<WireCommentsPage> {
    const raw = await this.get(path, {}, apiVersion);
    return decodeCommentsPage(raw);
  }

  private buildUrl(path: string, query: Record<string, string>, apiVersion?: string): string {
    const url = new URL(`${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`);
    for (const [key, value] of Object.entries(query)) {
      if (value !== '') url.searchParams.set(key, value);
    }
    url.searchParams.set('api-version', apiVersion ?? this.apiVersion);
    return url.toString();
  }

  private async roundTrip(request: HttpRequest): Promise<unknown> {
    for (let attempt = 0; attempt <= 4; attempt += 1) {
      let response: HttpResponse;
      try {
        response = await this.transport.request(request);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (attempt < 4 && /ECONNRESET|ETIMEDOUT|EAI_AGAIN|network/i.test(message)) {
          await sleep(jitterMs(attempt));
          continue;
        }
        throw new RedactedAzureError('transport failure', 'network');
      }

      if (response.status === 429 || response.status === 503) {
        const retryAfter = Number.parseInt(response.headers['retry-after'] ?? '', 10);
        const waitMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : jitterMs(attempt);
        if (attempt < 4) {
          await sleep(Math.min(waitMs, 5_000));
          continue;
        }
        throw new RedactedAzureError('rate limit exceeded', 'throttled', response.status);
      }
      if (response.status === 401 || response.status === 403) {
        throw new RedactedAzureError('request was denied; credential or permission issue', 'auth', response.status);
      }
      if (response.status === 404) {
        throw new RedactedAzureError('resource not found', 'not-found', response.status);
      }
      if (response.status === 409 || response.status === 412) {
        throw new RedactedAzureError('resource revision conflict', 'conflict', response.status);
      }
      if (response.status >= 500) {
        if (attempt < 4) {
          await sleep(jitterMs(attempt));
          continue;
        }
        throw new RedactedAzureError('server error', 'server', response.status);
      }
      if (response.status >= 400) {
        throw new RedactedAzureError(`unexpected status ${response.status}`, 'invalid', response.status);
      }
      if (response.body === '') return null;
      try {
        return JSON.parse(response.body) as unknown;
      } catch {
        throw new AzureWireError('response body is not valid JSON');
      }
    }
    throw new RedactedAzureError('request failed after retries', 'network');
  }
}

function jitterMs(attempt: number): number {
  const base = 100 * 2 ** attempt;
  return base + Math.floor(Math.random() * base);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function rateHeaderDiagnostics(headers: Record<string, string>): Record<string, string> {
  const diagnostics: Record<string, string> = {};
  for (const key of RATE_HEADERS) {
    const value = headers[key];
    if (value !== undefined) diagnostics[key] = value;
  }
  return diagnostics;
}
