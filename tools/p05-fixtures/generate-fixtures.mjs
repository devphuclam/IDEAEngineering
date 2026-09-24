#!/usr/bin/env node

import { createCipheriv, createHash } from 'node:crypto';
import { closeSync, existsSync, lstatSync, mkdirSync, openSync, readdirSync, writeFileSync, writeSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const FIXTURE_ROOT = '/srv/idea/artifacts/p05-fixtures';
const DATASET_ID = 'IE-DATA-CANONICAL-001';
const SMALL_BYTES = 1024;
const LARGE_BYTES = 64 * 1024 * 1024;
const BLOCK_BYTES = 1024 * 1024;
const RETENTION_REVIEW_DATE = '2027-01-31';
const SEED = 'IDEA-PH0-P05-DATA-001|IE-DATA-CANONICAL-001|fixture-v1';

function outputDirectoryFromArgs(args) {
  const index = args.indexOf('--output-dir');
  if (index === -1 || !args[index + 1]) return FIXTURE_ROOT;
  return resolve(args[index + 1]);
}

function writeAll(fd, buffer) {
  let offset = 0;
  while (offset < buffer.length) {
    offset += writeSync(fd, buffer, offset, buffer.length - offset);
  }
}

function writeHashedFile(path, content) {
  const fd = openSync(path, 'wx', 0o600);
  const hash = createHash('sha256');
  try {
    writeAll(fd, content);
    hash.update(content);
  } finally {
    closeSync(fd);
  }
  return hash.digest('hex');
}

function writeLargeSyntheticFile(path) {
  const key = createHash('sha256').update(`${SEED}|key`).digest();
  const iv = createHash('sha256').update(`${SEED}|iv`).digest().subarray(0, 16);
  const cipher = createCipheriv('aes-256-ctr', key, iv);
  const zeroes = Buffer.alloc(BLOCK_BYTES);
  const fd = openSync(path, 'wx', 0o600);
  const hash = createHash('sha256');
  let written = 0;

  try {
    while (written < LARGE_BYTES) {
      const length = Math.min(BLOCK_BYTES, LARGE_BYTES - written);
      const encrypted = cipher.update(length === BLOCK_BYTES ? zeroes : zeroes.subarray(0, length));
      writeAll(fd, encrypted);
      hash.update(encrypted);
      written += encrypted.length;
    }
    const finalBytes = cipher.final();
    if (finalBytes.length > 0) {
      writeAll(fd, finalBytes);
      hash.update(finalBytes);
      written += finalBytes.length;
    }
  } finally {
    closeSync(fd);
  }

  if (written !== LARGE_BYTES) {
    throw new Error(`Generated ${written} bytes; expected ${LARGE_BYTES}.`);
  }
  return hash.digest('hex');
}

const outputDirectory = outputDirectoryFromArgs(process.argv.slice(2));
if (outputDirectory.startsWith('/srv/') && outputDirectory !== FIXTURE_ROOT) {
  throw new Error(`Server output is restricted to ${FIXTURE_ROOT}.`);
}
if (basename(outputDirectory) !== 'p05-fixtures') {
  throw new Error('Output directory must be named p05-fixtures.');
}
if (existsSync(outputDirectory)) {
  if (lstatSync(outputDirectory).isSymbolicLink()) {
    throw new Error('Refusing to write through a symbolic-link output directory.');
  }
  if (readdirSync(outputDirectory).length > 0) {
    throw new Error(`Refusing to overwrite non-empty output directory: ${outputDirectory}`);
  }
} else {
  mkdirSync(outputDirectory, { recursive: false, mode: 0o700 });
}

const smallName = `${DATASET_ID}-small-1KiB.bin`;
const largeName = `${DATASET_ID}-transfer-64MiB.bin`;
const smallContent = Buffer.alloc(SMALL_BYTES, 0x20);
Buffer.from('IDEA P05 synthetic transfer fixture. No CAD/Office payload.\n', 'utf8')
  .copy(smallContent);
const smallSha256 = writeHashedFile(resolve(outputDirectory, smallName), smallContent);
const largeSha256 = writeLargeSyntheticFile(resolve(outputDirectory, largeName));

const manifest = {
  recordId: 'IE-PH0-P05-DATA-001',
  datasetId: DATASET_ID,
  datasetVersion: '0.2',
  generatedAtUtc: new Date().toISOString(),
  classification: 'INTERNAL / SYNTHETIC',
  source: 'First-party deterministic generator; no third-party code, data, CAD/Office files, fonts, or licensed assets.',
  generator: {
    file: 'tools/p05-fixtures/generate-fixtures.mjs',
    version: '1.0.0',
    runtime: process.version,
    largeArtifactAlgorithm: 'AES-256-CTR over a zero stream with a fixed SHA-256-derived test-only key and IV',
  },
  physicalLocation: outputDirectory,
  dataCustodian: 'Project Reviewer (also performs the P05 review; not independent-human evidence)',
  retentionReviewDate: RETENTION_REVIEW_DATE,
  deletionRule: 'Review and delete the generated server files by the retention review date; record any extension before that date.',
  files: [
    { name: smallName, purpose: 'Small transfer and digest fixture', sizeBytes: SMALL_BYTES, sha256: smallSha256 },
    { name: largeName, purpose: 'Bounded transfer and digest fixture; not a performance benchmark', sizeBytes: LARGE_BYTES, sha256: largeSha256 },
  ],
  limitations: [
    'Files are synthetic byte payloads; they are not valid CAD or Office documents.',
    'This preparation does not test IDEA application behavior, upload speed, multi-GB transfer, concurrency, or a second Vault location.',
    'Two test-persona profiles do not create native IDEA accounts or prove independent human review.',
  ],
};

writeFileSync(resolve(outputDirectory, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
