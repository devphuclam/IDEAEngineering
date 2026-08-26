import type { ReadinessReport } from '../domain/types.ts';

export function readinessOutcome(report: ReadinessReport): { outcome: 'passed' | 'failed'; evidence: string[] } {
  const evidence = [
    `authentication:${report.authentication.outcome}`,
    `target:${report.target.outcome}`,
    `queue:${report.queue.outcome}`,
    `network:${report.network.outcome}`,
    `permissions:${report.permissions.filter((item) => item.effective === 'allowed').length}/${report.permissions.length} allowed`,
  ];
  const permissionsPassed = report.permissions.length > 0
    && report.permissions.every((item) => item.effective === 'allowed' && item.capabilityReads.length > 0 && item.capabilityReads.every((read) => read.outcome === 'passed'));
  const policyVisibilityPassed = report.policyVisibility.inventorySources.length > 0
    && report.policyVisibility.inventorySources.every((source) => source.outcome === 'read');
  const processPassed = Boolean(report.processMapping) && !report.processMapping?.drift;
  const passed = report.configuration.outcome === 'passed'
    && report.runtime.outcome === 'passed'
    && report.authentication.outcome === 'passed'
    && report.target.outcome === 'passed'
    && report.queue.outcome === 'passed'
    && report.network.outcome === 'passed'
    && permissionsPassed
    && policyVisibilityPassed
    && processPassed;
  return { outcome: passed ? 'passed' : 'failed', evidence };
}
