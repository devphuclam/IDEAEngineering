export type Locale = "en" | "vi" | "ja";
export type ProfileName = "small" | "medium" | "large" | "stress";

export interface SessionView {
  displayName: string;
  locale: Locale;
  expiresAtUtc: string;
}

export interface DocumentSummary {
  documentId: string;
  title: string;
  revision: string;
  version: number;
  generationId: string;
  state: string;
  values: string[];
}

export interface DocumentDetail extends DocumentSummary {
  documentClass: string;
  metadata: Record<string, string>;
  allowedActions: string[];
  readOnly: boolean;
}

export interface SearchPage {
  total: number;
  offset: number;
  limit: number;
  columns: string[];
  items: DocumentSummary[];
}

export interface TreeNode {
  nodeId: string;
  parentId: string | null;
  label: string;
  depth: number;
  hasChildren: boolean;
}

export interface TreePage {
  total: number;
  maxDepth: number;
  offset: number;
  limit: number;
  nodes: TreeNode[];
}

export interface OperationStatus {
  operationId: string;
  kind: "Checkout" | "Checkin";
  status: "Committed" | "Refused" | "Pending" | "NeedsReconciliation";
  documentId: string;
  expectedGenerationId: string;
  reservationId: string | null;
  reasonCode: string | null;
  preservedLocalCandidate: boolean;
}

export interface Problem {
  status: number;
  code: string;
  title: string;
  detail: string;
}

export type WorkspaceOperation =
  | "GetWorkspaceStatus"
  | "OpenDocument"
  | "OpenFolder"
  | "SelectFile"
  | "LaunchApprovedApplication";

export interface WorkspaceResult {
  requestId: string;
  status: "Accepted" | "Refused";
  code: string;
  payload: Record<string, unknown>;
  preservesLocalCandidate: boolean;
}
