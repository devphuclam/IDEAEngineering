// Azure permission evaluation (contracts/azure-adapter.md): security
// namespace/action discovery and effective permission batch evaluation for an
// exact operation matrix. Read-only capability calls only; zero write probes.
// Cleanup branch deletion separately probes ForcePush on the exact source ref.

import type { PermissionProbeResult } from '../../domain/types.ts';
import { decodePermissionBatch, decodeSecurityNamespace, type WirePermissionBatchEntry, type WireSecurityNamespace } from './models.ts';
import type { AzureHttpClient } from './http.ts';

export class PermissionProbeError extends Error {
  constructor(message: string) {
    super(`permission probe: ${message}`);
    this.name = 'PermissionProbeError';
  }
}

export interface PermissionOperation {
  operation: string;
  namespaceId: string;
  token: string;
  permissionName: string;
  permissionBit: number;
}

export interface NamespaceDiscovery {
  getNamespace(namespaceId: string): Promise<WireSecurityNamespace>;
}

export interface PermissionBatchReader {
  readBatch(
    namespaceId: string,
    tokens: string[],
    identities: string[],
  ): Promise<WirePermissionBatchEntry[]>;
}

/** Read-only Azure REST seams used by bootstrap readiness. */
export class AzureNamespaceReader implements NamespaceDiscovery {
  private readonly client: AzureHttpClient;

  constructor(client: AzureHttpClient) {
    this.client = client;
  }

  async getNamespace(namespaceId: string): Promise<WireSecurityNamespace> {
    const raw = await this.client.get('/_apis/securitynamespaces/' + encodeURIComponent(namespaceId), {}, '7.1');
    return decodeSecurityNamespace(raw);
  }
}

export class AzurePermissionBatchReader implements PermissionBatchReader {
  private readonly client: AzureHttpClient;

  constructor(client: AzureHttpClient) {
    this.client = client;
  }

  async readBatch(namespaceId: string, tokens: string[], identities: string[]): Promise<WirePermissionBatchEntry[]> {
    const raw = await this.client.post('/_apis/security/permissionevaluationbatch', {
      securityNamespaceId: namespaceId,
      tokens,
      identityDescriptors: identities,
      alwaysAllowAdministrators: false,
    }, {}, '7.1');
    return decodePermissionBatch(raw);
  }
}

export interface CapabilityProbe {
  name: string;
  probe(): Promise<'passed' | 'denied' | 'unavailable'>;
}

export const GIT_REPOSITORIES_NAMESPACE = '2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87';
export const WORK_ITEM_NAMESPACE = '83e28ad4-2d72-4ceb-97b0-c7726d5502c3';
export const FORCE_PUSH_BIT = 32768;

export function bitIsSet(effectivePermissions: number, bit: number): boolean {
  return (effectivePermissions & bit) === bit;
}

export async function probePermissionBatch(
  discovery: NamespaceDiscovery,
  batchReader: PermissionBatchReader,
  operations: PermissionOperation[],
  identity: string,
  capabilities: CapabilityProbe[],
  now: string,
): Promise<PermissionProbeResult[]> {
  const results: PermissionProbeResult[] = [];
  for (const operation of operations) {
    let namespace: WireSecurityNamespace;
    try {
      namespace = await discovery.getNamespace(operation.namespaceId);
    } catch {
      results.push(
        deniedResult(operation, 'unknown', [], `security namespace ${operation.namespaceId} is unavailable`, now),
      );
      continue;
    }
    const action = namespace.actions.find((entry) => entry.name === operation.permissionName);
    if (!action || action.bit !== operation.permissionBit) {
      throw new PermissionProbeError(
        `namespace ${namespace.name} does not declare ${operation.permissionName} at bit ${operation.permissionBit}`,
      );
    }
    let batch: WirePermissionBatchEntry[];
    try {
      batch = await batchReader.readBatch(operation.namespaceId, [operation.token], [identity]);
    } catch {
      results.push(deniedResult(operation, 'unavailable', [], 'permission batch could not be read', now));
      continue;
    }
    const entry = batch.find((candidate) => candidate.token === operation.token);
    if (!entry) {
      results.push(deniedResult(operation, 'unknown', [], 'no effective permission entry returned', now));
      continue;
    }
    const capabilityReads: PermissionProbeResult['capabilityReads'] = [];
    for (const capability of capabilities) {
      let outcome: 'passed' | 'denied' | 'unavailable';
      try {
        outcome = await capability.probe();
      } catch {
        outcome = 'unavailable';
      }
      capabilityReads.push({ name: capability.name, outcome });
    }
    const effective = bitIsSet(entry.effectivePermissions, operation.permissionBit) ? 'allowed' : 'denied';
    results.push({
      operation: operation.operation,
      namespaceId: operation.namespaceId,
      token: operation.token,
      permissionName: operation.permissionName,
      permissionBit: operation.permissionBit,
      effective,
      capabilityReads,
      observedAt: now,
      nextAction: effective === 'denied' ? `request ${operation.permissionName} for ${operation.token}` : undefined,
    });
  }
  return results;
}

function deniedResult(
  operation: PermissionOperation,
  effective: 'unknown' | 'unavailable',
  capabilityReads: PermissionProbeResult['capabilityReads'],
  detail: string,
  now: string,
): PermissionProbeResult {
  void detail;
  return {
    operation: operation.operation,
    namespaceId: operation.namespaceId,
    token: operation.token,
    permissionName: operation.permissionName,
    permissionBit: operation.permissionBit,
    effective,
    capabilityReads,
    observedAt: now,
  };
}

/**
 * Exact-source-ref ForcePush probe: verifies the cleanup source ref's
 * ForcePush bit before a validation branch deletion may proceed. Reads only.
 */
export function forcePushAllowed(batch: WirePermissionBatchEntry[], sourceRef: string): boolean {
  const entry = batch.find((candidate) => candidate.token === sourceRef);
  if (!entry) return false;
  return bitIsSet(entry.effectivePermissions, FORCE_PUSH_BIT);
}
