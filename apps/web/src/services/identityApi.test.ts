import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  createAccount,
  disableAccount,
  reenableAccount,
  fetchCsrf,
  fetchSession,
  DEFAULT_ORGANIZATION_ID,
} from "./identityApi";

describe("identityApi service", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("fetchCsrf", () => {
    it("returns CSRF proof on success", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ headerName: "X-CSRF-TOKEN", token: "csrf_token_123" }),
      } as unknown as Response);

      const csrf = await fetchCsrf();
      expect(csrf.headerName).toBe("X-CSRF-TOKEN");
      expect(csrf.token).toBe("csrf_token_123");
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/v1/identity/csrf", expect.any(Object));
    });

    it("throws error when fetch fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      } as unknown as Response);

      await expect(fetchCsrf()).rejects.toThrow("CSRF_FETCH_FAILED: 500");
    });
  });

  describe("fetchSession", () => {
    it("returns session view when authenticated", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ actorId: "actor_001", accountId: "acc_001" }),
      } as unknown as Response);

      const session = await fetchSession();
      expect(session).toEqual({ actorId: "actor_001", accountId: "acc_001" });
    });

    it("returns null when session is unauthenticated (401)", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      } as unknown as Response);

      const session = await fetchSession();
      expect(session).toBeNull();
    });
  });

  describe("createAccount", () => {
    const csrf = { headerName: "X-CSRF-TOKEN", token: "valid_csrf" };

    it("creates account with correct body and headers", async () => {
      const mockResult = {
        actorId: "actor_new_uuid",
        accountId: "acc_new_uuid",
        loginIdentityId: "login_new_uuid",
        status: "PENDING",
        securityVersion: 1,
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResult,
      } as unknown as Response);

      const result = await createAccount(
        {
          displayName: "Nguyễn Văn Bình",
          login: "binh.nguyen",
        },
        csrf
      );

      expect(result).toEqual(mockResult);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/v1/identity/accounts",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": "valid_csrf",
          }),
        })
      );

      const callArgs = (globalThis.fetch as any).mock.calls[0];
      const parsedBody = JSON.parse(callArgs[1].body);
      expect(parsedBody.displayName).toBe("Nguyễn Văn Bình");
      expect(parsedBody.login).toBe("binh.nguyen");
      expect(parsedBody.organizationId).toBe(DEFAULT_ORGANIZATION_ID);
      expect(parsedBody.operationId).toBeDefined();
    });

    it("handles 409 Conflict (LOGIN_IDENTIFIER_EXISTS)", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
      } as unknown as Response);

      await expect(
        createAccount({ displayName: "Trùng Tên", login: "existing.login" }, csrf)
      ).rejects.toThrow("LOGIN_IDENTIFIER_EXISTS");
    });

    it("handles 403 Forbidden (PERMISSION_DENIED)", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
      } as unknown as Response);

      await expect(
        createAccount({ displayName: "Kỹ sư", login: "test.login" }, csrf)
      ).rejects.toThrow("PERMISSION_DENIED");
    });
  });

  describe("disableAccount and reenableAccount", () => {
    const csrf = { headerName: "X-CSRF-TOKEN", token: "valid_csrf" };

    it("calls disable endpoint with expectedSecurityVersion and reason", async () => {
      const mockResult = {
        actorId: "actor_001",
        accountId: "acc_001",
        status: "DISABLED",
        securityVersion: 2,
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResult,
      } as unknown as Response);

      const result = await disableAccount(
        {
          accountId: "acc_001",
          expectedSecurityVersion: 1,
          reason: "Tạm khóa theo yêu cầu kiểm toán",
        },
        csrf
      );

      expect(result).toEqual(mockResult);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/v1/identity/accounts/acc_001/disable",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({ "X-CSRF-TOKEN": "valid_csrf" }),
        })
      );
    });

    it("calls reenable endpoint with expectedSecurityVersion", async () => {
      const mockResult = {
        actorId: "actor_001",
        accountId: "acc_001",
        status: "ACTIVE",
        securityVersion: 3,
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResult,
      } as unknown as Response);

      const result = await reenableAccount(
        {
          accountId: "acc_001",
          expectedSecurityVersion: 2,
          reason: "Kích hoạt lại tài khoản",
        },
        csrf
      );

      expect(result).toEqual(mockResult);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/v1/identity/accounts/acc_001/re-enable",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({ "X-CSRF-TOKEN": "valid_csrf" }),
        })
      );
    });
  });
});
