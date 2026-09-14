import type { DocumentDetail, OperationStatus, Problem, ProfileName, SearchPage, SessionView, TreePage } from "./types";

const baseUrl = import.meta.env.VITE_Q15_API_URL ?? "http://127.0.0.1:5115";

export class ApiProblem extends Error {
  constructor(public readonly problem: Problem) {
    super(problem.detail);
    this.name = "ApiProblem";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers
    }
  });
  if (!response.ok) {
    let problem: Problem;
    try {
      problem = (await response.json()) as Problem;
    } catch {
      problem = { status: response.status, code: "HTTP_FAILURE", title: response.statusText, detail: "No bounded error body was returned." };
    }
    throw new ApiProblem(problem);
  }
  return (await response.json()) as T;
}

export const api = {
  login: (username: string, password: string) => request<SessionView>("/api/v1/session/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  }),
  session: () => request<SessionView>("/api/v1/session"),
  search: (query: string, profile: ProfileName, offset = 0, limit = 200) =>
    request<SearchPage>(`/api/v1/search?q=${encodeURIComponent(query)}&profile=${profile}&offset=${offset}&limit=${limit}`),
  tree: (profile: ProfileName, offset = 0, limit = 500) =>
    request<TreePage>(`/api/v1/tree?profile=${profile}&offset=${offset}&limit=${limit}`),
  document: (id: string) => request<DocumentDetail>(`/api/v1/documents/${encodeURIComponent(id)}`),
  checkout: (documentId: string, expectedGenerationId: string, scenario: string) => request<OperationStatus>(
    `/api/v1/documents/${encodeURIComponent(documentId)}/checkout`,
    { method: "POST", body: JSON.stringify({ operationId: crypto.randomUUID(), workspaceId: "WS-Q15-001", expectedGenerationId, scenario }) }
  ),
  checkin: (detail: DocumentDetail, reservationId: string, digest: string, scenario: string) => request<OperationStatus>(
    `/api/v1/documents/${encodeURIComponent(detail.documentId)}/checkin`,
    { method: "POST", body: JSON.stringify({ operationId: crypto.randomUUID(), workspaceId: "WS-Q15-001", reservationId,
      expectedGenerationId: detail.generationId, declaredDigest: digest, scenario }) }
  ),
  operation: (operationId: string) => request<OperationStatus>(`/api/v1/operations/${encodeURIComponent(operationId)}`)
};
