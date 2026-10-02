# Development Swagger qualification contract

Issue #26 US2; public HTTP/browser seam approved by the user on 2026-10-02 before tests/code.

## Boundary and outcomes

- Actual IDEA Server-served documentation over trusted same-origin HTTPS; actual browser, not
  test-only HTML. Default disabled. When disabled, UI/OpenAPI resources are unavailable even to
  an authenticated developer.
- Sign in through the existing IDEA Web. Documentation requires that ordinary session and reuses
  its HttpOnly cookie. No JWT, Basic authentication, cookie copy/paste or localStorage bearer.
- Describe implemented methods, fields and real refusals, including filter-based login/logout.
  Password/proof submission operations are documentation-only: no interactive request or generated
  curl that can retain their values. Credential delivery remains disabled; no new business API.
- An eligible Swagger `GET /api/v1/identity/session` returns 200 with Server-derived Actor.
- An eligible Swagger `POST /api/v1/identity/logout` acquires the current JSON CSRF token in RAM,
  submits it in the Server-specified header and returns 204. Refresh acquisition for each unsafe
  request; do not assume a cookie-based CSRF convention.
- Anonymous session request returns 401; invalid CSRF on logout returns 403 and does not become
  success. No authoritative ActorId is supplied by the client.
- Ordinary permission rules remain in force. Preview Super Administrator does not implicitly gain
  Account Administrator; do not grant roles or enable proof delivery to make documentation pass.

## Evidence and limits

Server HTTP tests first, one observable behavior per TDD cycle. Dependency and build-tool intake
are prerequisites, not RED behavior. Then qualify real browser Try out with exact Web/Server source,
JAR checksum, browser/version, HTTPS trust and request/status oracles. Retain sanitized status/results,
not password, cookie, proof, CSRF values, HAR or sensitive generated curl. Confirm default-off behavior,
Log4j2/no Logback and exclusion of build tools from the executable package.

Automation may support the actual browser boundary only after its own tooling scope is admitted.
Do not infer all F03-B regressions, Account Management UI, Desktop, production or commercial readiness.
Verifier remains NOT-RUN; human acceptance and merge are separate actions.
