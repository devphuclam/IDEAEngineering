"use strict";

(() => {
  const status = document.getElementById("documentation-status");
  if (location.protocol !== "https:") {
    status.textContent = "Cần HTTPS được trust. Hãy mở bằng IDEA-Dev.cmd; không bỏ qua lỗi chứng chỉ.";
    return;
  }
  const documentationOnly = (path) => path === "/api/v1/identity/login"
    || path === "/api/v1/identity/csrf"
    || path === "/api/v1/identity/credentials"
    || /^\/api\/v1\/identity\/accounts\/[^/]+\/credential-proofs$/.test(path);

  SwaggerUIBundle({
    url: "/dev-api/openapi.json",
    dom_id: "#swagger-ui",
    validatorUrl: null,
    persistAuthorization: false,
    withCredentials: true,
    showMutatedRequest: false,
    requestSnippetsEnabled: false,
    supportedSubmitMethods: ["get", "post"],
    plugins: [(system) => ({
      // This console has no credential/cookie entry or alternative authorization mechanism.
      components: {
        authorizeBtn: () => null,
        authorizeOperationBtn: () => null,
        authorizationPopup: () => null,
      },
      statePlugins: { spec: { wrapSelectors: {
        allowTryItOutFor: (original) => (path, method) => original(path, method)
          && !system.specSelectors.specJson().getIn(["paths", path, method, "x-idea-documentation-only"], false),
      } } },
    })],
    requestInterceptor: async (request) => {
      const target = new URL(request.url, location.origin);
      if (target.origin !== location.origin || documentationOnly(target.pathname)) {
        throw new Error("Chỉ gọi API cùng origin; API credential/CSRF chỉ để đọc tài liệu.");
      }
      request.credentials = "same-origin";
      if (!["GET", "HEAD", "OPTIONS"].includes(request.method.toUpperCase())) {
        const response = await fetch("/api/v1/identity/csrf", { credentials: "same-origin", cache: "no-store" });
        if (!response.ok) throw new Error("Không lấy được CSRF; chưa gửi yêu cầu thay đổi.");
        const csrf = await response.json();
        if (csrf.headerName !== "X-CSRF-TOKEN" || typeof csrf.token !== "string" || !csrf.token) {
          throw new Error("CSRF không hợp lệ; chưa gửi yêu cầu thay đổi.");
        }
        request.headers[csrf.headerName] = csrf.token;
      }
      return request;
    },
    onComplete: () => { status.textContent = "Tài liệu đã tải. Mỗi yêu cầu vẫn được Server kiểm tra phiên, quyền và CSRF."; },
  });
})();
