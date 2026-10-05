// T033 client harness; no third-party module or product authority.
import { open, constants } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import https from 'node:https';

/** Dedicated explicit CA, ordinary TLS endpoint verification; no redirects/proxy/global trust. */
export class SecureEndpoint {
  #origin; #ca; #cookies = new Map();
  constructor(origin, ca) {
    const uri = new URL(origin);
    if (uri.protocol !== 'https:' || uri.username || uri.password || uri.search || uri.hash
        || uri.pathname !== '/' || !ca) throw new Error('CLIENT_ENDPOINT_REFUSED');
    this.#origin = uri; this.#ca = ca;
  }
  async request(path, { body = Buffer.alloc(0), headers = {}, method = 'POST', limit = 8192,
    deadline = 30000 } = {}) {
    const uri = new URL(path, this.#origin);
    if (uri.origin !== this.#origin.origin || uri.username || uri.password || uri.hash)
      throw new Error('CLIENT_ENDPOINT_REFUSED');
    const cookies = [...this.#cookies].map(([name, value]) => `${name}=${value}`).join('; ');
    return new Promise((resolve, reject) => {
      let done = false; let timer;
      const finish = (error, result) => {
        if (done) return; done = true; clearTimeout(timer);
        error ? reject(new Error(error)) : resolve(result);
      };
      const request = https.request(uri, { method, ca: this.#ca, rejectUnauthorized: true,
        agent: false, headers: { ...headers, ...(cookies ? { Cookie: cookies } : {}),
          'Content-Length': body.length } }, response => {
        let size = 0; const chunks = [];
        response.on('data', chunk => {
          size += chunk.length;
          if (size > limit) { finish('CLIENT_RESPONSE_LIMIT'); response.destroy(); request.destroy(); }
          else chunks.push(chunk);
        });
        response.on('error', () => finish('CLIENT_NETWORK_REFUSED'));
        response.on('aborted', () => finish('CLIENT_NETWORK_REFUSED'));
        response.on('end', () => {
          for (const line of response.headers['set-cookie'] ?? []) {
            const first = line.split(';', 1)[0]; const equals = first.indexOf('=');
            if (equals < 1 || !/;\s*Secure(?:;|$)/i.test(line)
                || !/;\s*HttpOnly(?:;|$)/i.test(line) || /;\s*Domain=/i.test(line))
              return finish('CLIENT_COOKIE_REFUSED');
            const name = first.slice(0, equals); const value = first.slice(equals + 1);
            value ? this.#cookies.set(name, value) : this.#cookies.delete(name);
          }
          finish(null, { status: response.statusCode, body: Buffer.concat(chunks) });
        });
      });
      timer = setTimeout(() => { finish('CLIENT_DEADLINE'); request.destroy(); }, deadline);
      request.setTimeout(30000, () => { finish('CLIENT_INACTIVITY'); request.destroy(); });
      request.on('socket', socket => {
        const connect = setTimeout(() => { finish('CLIENT_CONNECT_TIMEOUT'); request.destroy(); }, 10000);
        socket.once('secureConnect', () => clearTimeout(connect));
        socket.once('close', () => clearTimeout(connect));
      });
      request.on('error', error => finish('CLIENT_NETWORK_REFUSED_' +
        (/^[A-Z0-9_]{1,64}$/.test(error.code ?? '') ? error.code : 'UNKNOWN')));
      request.end(body);
    });
  }
  close() { this.#cookies.clear(); }
}

export async function uploadRanges(gateway, path, grant, expectedSize) {
  let progress = { verifiedBytes: 0, receipt: null };
  for await (const range of fileRanges(path)) {
    const response = await gateway.request('/transfer/range', { body: range.bytes, deadline: 60000,
      limit: 4108, headers: { 'X-IDEA-Grant': grant,
        'X-IDEA-Range-Start': String(range.start), 'X-IDEA-Range-End': String(range.end),
        'X-IDEA-Chunk-SHA256': range.digest } });
    if (response.status !== 200) throw new Error('CLIENT_RANGE_REFUSED');
    progress = gatewayProgress(response.body, expectedSize);
    if (progress.verifiedBytes < range.end) throw new Error('CLIENT_PROGRESS_REFUSED');
  }
  if (!progress.receipt || progress.verifiedBytes !== expectedSize) throw new Error('CLIENT_TRANSFER_INCOMPLETE');
  return progress.receipt; // Only Server acceptance can establish authoritative custody.
}

export function gatewayProgress(body, expectedSize) {
  const refuse = () => { throw new Error('CLIENT_GATEWAY_RESPONSE_REFUSED'); };
  if (!Buffer.isBuffer(body) || body.length < 12 || body.length > 4108
      || !Number.isSafeInteger(expectedSize) || expectedSize < 1) refuse();
  const verified = body.readBigInt64BE(0);
  const receiptLength = body.readUInt32BE(8);
  if (verified < 0n || verified > BigInt(expectedSize) || receiptLength > 4096
      || body.length !== 12 + receiptLength || (receiptLength > 0 && verified !== BigInt(expectedSize))) refuse();
  return { verifiedBytes: Number(verified), receipt: receiptLength === 0 ? null : Buffer.from(body.subarray(12)) };
}

export async function* fileRanges(path) {
  const file = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const stat = await file.stat();
    if (!stat.isFile() || !Number.isSafeInteger(stat.size) || stat.size < 1)
      throw new Error('CLIENT_INPUT_REFUSED');
    let start = 0;
    while (start < stat.size) {
      const bytes = Buffer.alloc(Math.min(1048576, stat.size - start));
      let received = 0;
      while (received < bytes.length) {
        const read = await file.read(bytes, received, bytes.length - received, start + received);
        if (read.bytesRead === 0) throw new Error('CLIENT_INPUT_CHANGED');
        received += read.bytesRead;
      }
      yield { start, end: start + bytes.length, bytes,
        digest: createHash('sha256').update(bytes).digest('hex') };
      start += bytes.length;
    }
    const after = await file.stat();
    if (after.size !== stat.size || after.mtimeMs !== stat.mtimeMs || after.ctimeMs !== stat.ctimeMs)
      throw new Error('CLIENT_INPUT_CHANGED');
  } finally {
    await file.close();
  }
}
