#!/usr/bin/env node
// CLI dispatch (T023): command routing, --json flag, exit codes 0/1/2.

import { createContext } from './context.ts';
import { runClaimCommand } from './claim.ts';
import { runStartCommand } from './start.ts';
import { runDoctorCommand } from './doctor.ts';
import { providerAdopt, providerPrepare } from './provider.ts';
import { recoverProvider } from './recovery.ts';
import { runStatusCommand } from './status.ts';
import { runCheckpointCommand } from './checkpoint.ts';
import { runHandoffCommand } from './handoff.ts';
import { runReleaseCommand } from './release.ts';
import { runIntegrateCommand } from './integrate.ts';
import { runRetryCommand } from './retry.ts';
import { reportCommandError } from './output.ts';
import { usageError } from '../errors.ts';

const HELP = `usage: workspace <command> [options]

commands:
  doctor                     check required capabilities
  claim <work-item>          claim a Work Item [--lease <duration>]
  start <work-item>          start an isolated run in a sandbox
  status [work-item]         inspect run state and evidence
  checkpoint <work-item>     create a durable checkpoint
  handoff <work-item> --to <identity>
  release <work-item>        release the claim
  retry <work-item>          start a new run from the latest checkpoint
  integrate <work-item>      request dependency-aware incorporation [--approve-semantic <run-id> --by <identity>]
  provider prepare|adopt     preview/apply provider preparation or one-way remote adoption
  recover [work-item]        rebuild disposable indexes from canonical provider state

global options:
  --json                     machine-readable JSON output
  --help, -h                 show this help
`;

const ARG_COUNTS: Record<string, { min: number; max: number; options: string[]; flags?: string[] }> = {
  doctor: { min: 0, max: 0, options: [], flags: ['--live'] },
  claim: { min: 1, max: 1, options: ['--lease', '--token', '--operation-id'] },
  start: { min: 1, max: 1, options: ['--operation-id'] },
  status: { min: 0, max: 1, options: [] },
  checkpoint: { min: 1, max: 1, options: ['--operation-id'] },
  handoff: { min: 1, max: 1, options: ['--to', '--operation-id'] },
  release: { min: 1, max: 1, options: ['--operation-id'] },
  retry: { min: 1, max: 1, options: ['--operation-id'] },
  integrate: { min: 1, max: 1, options: ['--approve-semantic', '--by'] },
  recover: { min: 0, max: 1, options: [] },
};

function validateArgs(command: string, args: string[]): string | undefined {
  const spec = ARG_COUNTS[command];
  if (command === 'provider') {
    const subcommand = args[0];
    if (subcommand !== 'prepare' && subcommand !== 'adopt') return `provider command must be prepare or adopt`;
    for (let index = 1; index < args.length; index += 1) {
      const arg = args[index];
      if (['--apply', '--preview'].includes(arg)) continue;
      if (['--plan-digest', '--operation-id'].includes(arg)) {
        if (!args[index + 1] || args[index + 1].startsWith('--')) return `option '${arg}' requires a value`;
        index += 1;
        continue;
      }
      return `unknown option '${arg}'`;
    }
    return undefined;
  }
  if (!spec) return `unknown command '${command}'`;
  const positionals: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (spec.flags?.includes(arg)) continue;
    if (spec.options.includes(arg)) {
      if (args[index + 1] === undefined || args[index + 1].startsWith('--')) {
        return `option '${arg}' requires a value`;
      }
      index += 1;
      continue;
    }
    if (arg.startsWith('--')) return `unknown option '${arg}'`;
    positionals.push(arg);
  }
  if (positionals.length < spec.min || positionals.length > spec.max) {
    return `invalid arguments for '${command}'`;
  }
  return undefined;
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    process.stdout.write(HELP);
    return 0;
  }
  const json = args.includes('--json');
  const command = args[0];
  const rest = args.slice(1).filter((arg) => arg !== '--json');

  const validationError = validateArgs(command, rest);
  if (validationError) {
    return reportCommandError(usageError(validationError), json);
  }

  let ctx;
  try {
    ctx = await createContext(process.cwd());
  } catch (error) {
    return reportCommandError(error, json);
  }

  switch (command) {
    case 'doctor':
      return runDoctorCommand(ctx, json, rest.includes('--live'));
    case 'claim':
      return runClaimCommand(ctx, rest, json);
    case 'start':
      return runStartCommand(ctx, rest, json);
    case 'status':
      return runStatusCommand(ctx, rest, json);
    case 'checkpoint':
      return runCheckpointCommand(ctx, rest, json);
    case 'handoff':
      return runHandoffCommand(ctx, rest, json);
    case 'release':
      return runReleaseCommand(ctx, rest, json);
    case 'retry':
      return runRetryCommand(ctx, rest, json);
    case 'integrate':
      return runIntegrateCommand(ctx, rest, json);
    case 'provider':
      return rest[0] === 'prepare' ? providerPrepare(ctx, rest.slice(1), json) : providerAdopt(ctx, rest.slice(1), json);
    case 'recover': {
      try {
        const result = await recoverProvider(ctx, rest[0]);
        if (json) process.stdout.write(`${JSON.stringify(result)}\n`); else process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
        return 0;
      } catch (error) {
        return reportCommandError(error, json);
      }
    }
    default:
      return reportCommandError(usageError(`unknown command '${command}'`), json);
  }
}

main().then(
  (code) => {
    process.exitCode = code;
  },
  (error) => {
    process.stderr.write(`unexpected failure: ${(error as Error).message}\n`);
    process.exitCode = 1;
  },
);
