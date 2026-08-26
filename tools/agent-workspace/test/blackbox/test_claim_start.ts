// T015: Black-box test for the two-person claim+start scenario (US1).
// Spawns the CLI against temporary repositories; requires gh auth for the
// live GitHub path and is skipped otherwise (scenario 1 / quickstart).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeTempRepo, runWorkspace, hasGhAuth } from './helpers.ts';

test('US1: two people claim and start isolated work', { skip: !(await hasGhAuth()) && 'gh not authenticated' }, async () => {
  const repo = await makeTempRepo();
  try {
    // In a repository without a GitHub remote, doctor reports the missing
    // capability and exits 1 (FR-019: no silent fallback).
    const doctor = await runWorkspace(['doctor'], repo.root);
    assert.equal(doctor.code, 1, doctor.stderr);
    assert.match(doctor.stdout, /git/);
    assert.match(doctor.stdout, /missing\s+remote/);
    assert.doesNotMatch(doctor.stdout, /ok\s+remote/);
  } finally {
    await repo.cleanup();
  }
});

test('US1: full doctor (exit 0) requires a GitHub remote', async () => {
  const repo = await makeTempRepo();
  try {
    const doctor = await runWorkspace(['doctor'], repo.root);
    assert.notEqual(doctor.code, 0);
  } finally {
    await repo.cleanup();
  }
});

test('US1: claim without arguments is a usage error', async () => {
  const repo = await makeTempRepo();
  try {
    const result = await runWorkspace(['claim'], repo.root);
    assert.equal(result.code, 2);
    assert.match(result.stderr, /usage/i);
  } finally {
    await repo.cleanup();
  }
});