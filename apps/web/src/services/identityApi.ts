import { generateUuid } from "../utils/identity";

export interface CsrfProof {
  headerName: string;
  token: string;
}

export interface SessionView {
  actorId: string;
  accountId: string;
  organizationId?: string;
}

export interface CreatedAccountResponse {
  actorId: string;
  accountId: string;
  loginIdentityId: string;
  status: "PENDING" | "ACTIVE" | "DISABLED";
  securityVersion: number;
}

export interface AccountStateResponse {
  actorId: string;
  accountId: string;
  status: "PENDING" | "ACTIVE" | "DISABLED";
  securityVersion: number;
}

export interface CreateAccountParams {
  displayName: string;
  login: string;
  organizationId?: string;
  operationId?: string;
}

export interface ChangeAccountStatusParams {
  accountId: string;
  expectedSecurityVersion: number;
  reason: string;
  organizationId?: string;
  operationId?: string;
}

/** Fallback organization ID for single-tenant installation when not explicitly provided */
export const DEFAULT_ORGANIZATION_ID = "00000000-0000-4000-8000-000000000001";

/**
 * Fetch CSRF proof token from server.
 */
export async function fetchCsrf(): Promise<CsrfProof> {
  const response = await fetch("/api/v1/identity/csrf", {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`CSRF_FETCH_FAILED: ${response.status}`);
  }
  return response.json() as Promise<CsrfProof>;
}

/**
 * Fetch current authenticated session view.
 */
export async function fetchSession(): Promise<SessionView | null> {
  const response = await fetch("/api/v1/identity/session", {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    return null;
  }
  return response.json() as Promise<SessionView>;
}

/**
 * Create a new engineer account in the Backend PostgreSQL database.
 * Requires an authenticated session with Account Administrator privileges.
 */
export async function createAccount(
  params: CreateAccountParams,
  csrf?: CsrfProof | null
): Promise<CreatedAccountResponse> {
  const operationId = params.operationId || generateUuid();
  const organizationId = params.organizationId || DEFAULT_ORGANIZATION_ID;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (csrf) {
    headers[csrf.headerName] = csrf.token;
  }

  const response = await fetch("/api/v1/identity/accounts", {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({
      operationId,
      organizationId,
      displayName: params.displayName.trim(),
      login: params.login.trim().toLowerCase(),
    }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("LOGIN_IDENTIFIER_EXISTS: Tên tài khoản đã tồn tại trong hệ thống.");
    }
    if (response.status === 403) {
      throw new Error("PERMISSION_DENIED: Bạn không có quyền Account Administrator để tạo tài khoản.");
    }
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED: Phiên làm việc đã hết hạn hoặc không hợp lệ.");
    }
    if (response.status === 400) {
      throw new Error("INVALID_INPUT: Dữ liệu nhập không hợp lệ hoặc chứa ký tự bị cấm.");
    }
    throw new Error(`ACCOUNT_CREATE_FAILED: Máy chủ từ chối yêu cầu (${response.status})`);
  }

  return response.json() as Promise<CreatedAccountResponse>;
}

/**
 * Disable an active account in PostgreSQL.
 */
export async function disableAccount(
  params: ChangeAccountStatusParams,
  csrf?: CsrfProof | null
): Promise<AccountStateResponse> {
  const operationId = params.operationId || generateUuid();
  const organizationId = params.organizationId || DEFAULT_ORGANIZATION_ID;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (csrf) {
    headers[csrf.headerName] = csrf.token;
  }

  const response = await fetch(`/api/v1/identity/accounts/${params.accountId}/disable`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({
      operationId,
      organizationId,
      expectedSecurityVersion: params.expectedSecurityVersion,
      reason: params.reason || "Yêu cầu khóa tài khoản từ Quản trị viên",
    }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("STALE_VERSION: Phiên bản bảo mật tài khoản đã bị thay đổi, vui lòng tải lại trang.");
    }
    if (response.status === 403) {
      throw new Error("PERMISSION_DENIED: Bạn không có quyền Account Administrator để khóa tài khoản này.");
    }
    throw new Error(`ACCOUNT_DISABLE_FAILED: Không thể khóa tài khoản (${response.status})`);
  }

  return response.json() as Promise<AccountStateResponse>;
}

/**
 * Re-enable a disabled account in PostgreSQL.
 */
export async function reenableAccount(
  params: ChangeAccountStatusParams,
  csrf?: CsrfProof | null
): Promise<AccountStateResponse> {
  const operationId = params.operationId || generateUuid();
  const organizationId = params.organizationId || DEFAULT_ORGANIZATION_ID;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (csrf) {
    headers[csrf.headerName] = csrf.token;
  }

  const response = await fetch(`/api/v1/identity/accounts/${params.accountId}/re-enable`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({
      operationId,
      organizationId,
      expectedSecurityVersion: params.expectedSecurityVersion,
      reason: params.reason || "Kích hoạt lại tài khoản kỹ sư",
    }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("STALE_VERSION: Phiên bản bảo mật tài khoản đã bị thay đổi, vui lòng tải lại trang.");
    }
    if (response.status === 403) {
      throw new Error("PERMISSION_DENIED: Bạn không có quyền Account Administrator để kích hoạt lại tài khoản.");
    }
    throw new Error(`ACCOUNT_REENABLE_FAILED: Không thể kích hoạt lại tài khoản (${response.status})`);
  }

  return response.json() as Promise<AccountStateResponse>;
}
