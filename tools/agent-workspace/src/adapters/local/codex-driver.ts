// AgentDriver for Codex Desktop (T019): tells the Run Owner which folder to
// open. Never scrapes Desktop state or injects messages (research.md §5).

import type { RunContext, SandboxId } from '../../domain/types.ts';
import type { AgentDriver } from '../ports.ts';

export class CodexDesktopDriver implements AgentDriver {
  async prepare(sandboxId: SandboxId, runContext: RunContext): Promise<void> {
    void sandboxId;
    // Instruction-only boundary: the owner opens the prepared worktree folder
    // in Codex Desktop. No scraping, no remote injection.
  }

  instruction(runContext: RunContext): string {
    return `Open this folder in Codex Desktop to work on run ${runContext.runId}: ${runContext.worktreePath}`;
  }
}