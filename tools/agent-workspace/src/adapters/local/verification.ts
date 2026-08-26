// Configured local-command runner (contracts/provider-ports.md): executes
// project-relative verification commands and reports their raw outcomes. It
// never interprets or impersonates provider policy.

import { spawn } from 'node:child_process';
import type { VerificationResult } from '../../domain/types.ts';
import type { LocalVerificationRunner } from '../ports.ts';

export class LocalVerificationRunnerImpl implements LocalVerificationRunner {
  private readonly shell: boolean;

  constructor(shell: boolean = process.platform !== 'win32') {
    this.shell = shell;
  }

  async run(commands: string[], cwd: string): Promise<VerificationResult[]> {
    const results: VerificationResult[] = [];
    for (const command of commands) {
      results.push(await this.runOne(command, cwd));
    }
    return results;
  }

  private runOne(command: string, cwd: string): Promise<VerificationResult> {
    return new Promise((resolve) => {
      const child = this.shell
        ? spawn(command, { cwd, shell: true, stdio: ['ignore', 'pipe', 'pipe'] })
        : spawn(command, { cwd, shell: false, stdio: ['ignore', 'pipe', 'pipe'] });
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
      }, 600_000);
      let stderr = '';
      child.stderr?.on('data', (chunk: Buffer) => {
        stderr += chunk.toString('utf8');
      });
      child.on('error', (error) => {
        clearTimeout(timer);
        resolve({
          command,
          outcome: 'blocked',
          evidenceRef: `local-command-unavailable: ${error.message}`,
        });
      });
      child.on('close', (code, signal) => {
        clearTimeout(timer);
        if (timedOut) {
          resolve({ command, outcome: 'blocked', evidenceRef: 'local-command-timeout' });
          return;
        }
        const outcome = code === 0 ? 'passed' : 'failed';
        resolve({
          command,
          outcome,
          evidenceRef: signal ? `terminated-by-${signal}` : stderr.trim() || undefined,
        });
      });
    });
  }
}