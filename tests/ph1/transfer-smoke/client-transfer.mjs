// T033 client harness; no third-party module or product authority.
import { open, constants } from 'node:fs/promises';
import { createHash } from 'node:crypto';

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
