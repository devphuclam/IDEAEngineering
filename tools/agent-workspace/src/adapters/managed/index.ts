// Managed-execution stub adapter (T046, FR-018): stays disabled until an
// approved AI Workload Credential exists. The managed path (Container Apps
// Dynamic Sessions, Service Bus, Table/Blob Storage, Entra ID) maps the same
// ports in a later phase; without an approved credential every call fails
// with a classified capability diagnostic.

import { capabilityError } from '../../errors.ts';
import type { AgentDriver, RunnerAdapter } from '../ports.ts';
import type { RunContext, RunId, SandboxId } from '../../domain/types.ts';

export class ManagedRunnerAdapter implements RunnerAdapter {
  private readonly credentialApproved: () => boolean;

  constructor(credentialApproved: () => boolean) {
    this.credentialApproved = credentialApproved;
  }

  async create(runId: RunId, branch: string): Promise<SandboxId> {
    void runId;
    void branch;
    if (!this.credentialApproved()) {
      throw capabilityError(
        'managed execution is disabled: no approved AI Workload Credential exists (FR-018); use the local runner',
      );
    }
    throw capabilityError('managed runner is not implemented in V1; the Azure-free local workflow remains usable (FR-017)');
  }

  async destroy(sandboxId: SandboxId): Promise<void> {
    void sandboxId;
    if (!this.credentialApproved()) {
      throw capabilityError('managed execution is disabled: no approved AI Workload Credential exists (FR-018)');
    }
  }
}

export class ManagedAgentDriver implements AgentDriver {
  async prepare(sandboxId: SandboxId, runContext: RunContext): Promise<void> {
    void sandboxId;
    void runContext;
    throw capabilityError('managed execution is disabled without an approved AI Workload Credential (FR-018)');
  }
}