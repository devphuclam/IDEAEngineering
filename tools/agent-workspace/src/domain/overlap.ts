// Overlap classification (T034, FR-010): path overlap warns; semantic-seam
// overlap requires an explicit dependency or serialized decision.

import type { ChangeScope } from './types.ts';

export type OverlapKind = 'none' | 'path' | 'semantic';

export interface OverlapResult {
  kind: OverlapKind;
  overlappingPaths: string[];
  overlappingSeams: string[];
}

function patternsOverlap(a: string[], b: string[]): string[] {
  const overlaps: string[] = [];
  for (const left of a) {
    const normLeft = left.replace(/\/$/, '');
    for (const right of b) {
      const normRight = right.replace(/\/$/, '');
      if (
        normLeft === normRight ||
        normLeft.startsWith(`${normRight}/`) ||
        normRight.startsWith(`${normLeft}/`)
      ) {
        overlaps.push(left);
        break;
      }
    }
  }
  return [...new Set(overlaps)];
}

/**
 * Classifies overlap between two Change Scopes:
 * - semantic-seam overlap with no recorded dependency => 'semantic' (blocks)
 * - path overlap only => 'path' (warning only)
 * - otherwise => 'none'
 */
export function classifyOverlap(
  a: ChangeScope,
  b: ChangeScope,
  recordedDependency: boolean,
): OverlapResult {
  const overlappingPaths = patternsOverlap(a.paths, b.paths);
  const overlappingSeams = a.semanticSeams.filter((seam) => b.semanticSeams.includes(seam));

  if (overlappingSeams.length > 0 && !recordedDependency) {
    return { kind: 'semantic', overlappingPaths, overlappingSeams };
  }
  if (overlappingPaths.length > 0) {
    return { kind: 'path', overlappingPaths, overlappingSeams };
  }
  return { kind: 'none', overlappingPaths: [], overlappingSeams: [] };
}