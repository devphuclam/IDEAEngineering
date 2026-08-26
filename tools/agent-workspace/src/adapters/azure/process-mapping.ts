// Azure process mapping (contracts/azure-adapter.md): built-in Agile/Scrum/
// Basic profiles, deterministic observedProcessFingerprint, complete custom
// override validation, and fail-closed drift/unmapped state resolution.

import { createHash } from 'node:crypto';
import type { ProcessMappingReport, ProcessOverride } from '../../domain/types.ts';
import type { WireProcess, WireWorkItemTypeMetadata } from './models.ts';

export const BUILTIN_PROCESS_PROFILES = {
  'agile@1': {
    workItemType: 'User Story',
    states: { open: 'New', claimed: 'Active', 'in-progress': 'Active', 'ready-for-integration': 'Resolved', integrated: 'Closed', blocked: 'Removed' },
  },
  'scrum@1': {
    workItemType: 'Product Backlog Item',
    states: { open: 'New', claimed: 'Committed', 'in-progress': 'Committed', 'ready-for-integration': 'Done', integrated: 'Done', blocked: 'Removed' },
  },
  'basic@1': {
    workItemType: 'Issue',
    states: { open: 'New', claimed: 'Active', 'in-progress': 'Active', 'ready-for-integration': 'Resolved', integrated: 'Closed', blocked: 'Removed' },
  },
} as const;

export type BuiltinProfileName = keyof typeof BUILTIN_PROCESS_PROFILES;

export interface ProcessObservation {
  process: WireProcess;
  workItemType: WireWorkItemTypeMetadata;
  observedAt: string;
}

export function observedProcessFingerprint(observation: ProcessObservation): string {
  const canonical = `${observation.process.id}\n${observation.process.name}\n${observation.workItemType.name}\n${observation.workItemType.states
    .map((state) => `${state.name}:${state.category}`)
    .sort()
    .join('\n')}`;
  return `sha256:${createHash('sha256').update(canonical, 'utf8').digest('hex')}`;
}

export class ProcessMappingError extends Error {
  constructor(message: string) {
    super(`process mapping: ${message}`);
    this.name = 'ProcessMappingError';
  }
}

export function resolveProcessMapping(
  profile: string,
  configuredWorkItemType: string,
  observation: ProcessObservation,
  override: ProcessOverride | null,
  expectedFingerprint: string | null,
  now: string,
): ProcessMappingReport {
  const observed = observedProcessFingerprint(observation);
  if (expectedFingerprint !== null && expectedFingerprint !== observed) {
    throw new ProcessMappingError(
      `observed process fingerprint ${observed} does not match expected ${expectedFingerprint}; fail closed`,
    );
  }

  let states: Record<string, string>;
  if (override !== null) {
    const available = new Set(observation.workItemType.states.map((state) => state.name));
    for (const [neutral, azureState] of Object.entries(override)) {
      if (!available.has(azureState)) {
        throw new ProcessMappingError(
          `override state ${neutral} maps to ${azureState} which is absent from observed Work Item Type metadata`,
        );
      }
    }
    states = { ...override };
  } else {
    const builtin = BUILTIN_PROCESS_PROFILES[profile as BuiltinProfileName];
    if (!builtin) {
      throw new ProcessMappingError(`profile ${profile} is not a built-in profile and has no override`);
    }
    if (builtin.workItemType !== configuredWorkItemType && configuredWorkItemType !== observation.workItemType.name) {
      throw new ProcessMappingError(
        `configured Work Item Type ${configuredWorkItemType} does not match profile ${profile}`,
      );
    }
    states = { ...builtin.states };
  }

  const neutralStates = new Set(Object.keys(states));
  for (const [neutral, azureState] of Object.entries(states)) {
    const known = observation.workItemType.states.find((state) => state.name === azureState);
    if (!known) {
      throw new ProcessMappingError(`mapped state ${azureState} for ${neutral} is not observed in the process`);
    }
  }

  if (neutralStates.size !== 6) {
    throw new ProcessMappingError('a complete mapping must cover all six neutral states');
  }

  return {
    profile,
    workItemType: observation.workItemType.name,
    observedProcessFingerprint: observed,
    stateMap: states,
  };
}