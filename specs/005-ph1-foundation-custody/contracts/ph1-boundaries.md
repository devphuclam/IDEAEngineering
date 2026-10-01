# PH1 boundary contract

**Status:** Delivery-level contract for F01–F05. Names below identify the minimum interfaces to
build and test; they do not amend controlled Product Documents. The selected
[architecture](../../../docs/product/instances/idea-engineering/DOC-05-architecture-description.md)
and [data contract](../../../docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md)
take precedence. The exact Gateway runtime/toolchain and wire profile remain `NOT-RUN` until F05-A.

## Trust and ownership

| Boundary | Caller → owner | Required proof and outcome |
|---|---|---|
| Bootstrap | Authorized local operator → Identity and Accounts | One-time, non-public command; creates initial administrator and attributable evidence. No client self-registration route. |
| Sign-in/session | Web or Desktop → Server/Identity and Accounts | Credentials establish a server-owned Actor/session. Protected commands use that session, never a caller-supplied Actor ID. Sign-out/disable/revoke make the old proof ineligible. |
| Sample owner command | Authenticated client → Server owner Module | `OperationId` and eligible Actor; result, Audit and required outbox atomically recorded. Repeated operation is resolved idempotently. The sample is not document publication. |
| Grant | Authenticated client → Server/Artifact Custody | Server checks eligibility and returns a short-lived exact Grant for one Transfer/endpoint/expected size and digest. No filesystem key or permanent Vault credential. |
| Byte transfer | Client → addressed Gateway/Vault Adapter | Gateway validates the exact Grant and accepts a private candidate. Business Server does not proxy bytes. Interrupted/range retries retain the same transfer identity. |
| Receipt acceptance | Gateway evidence → Server/Artifact Custody | Server authenticates and matches Receipt to operation, endpoint, size and digest; then accepts or refuses relational custody metadata. No receipt can publish a Generation. |

Transport between Client, Server and Gateway must be protected and the latter must reject an
untrusted or mismatched Grant/Receipt. F05-A must record the exact authentication/wire profile,
version compatibility, expiry and retry rules before endpoint code is accepted; this document
does not silently choose a Gateway runtime or claim an executed security test.

## Outcome meaning

Each material PH1 operation retains its `OperationId`. Responses must distinguish a completed
custody result, a refusal with safe reason, transfer still in progress, and an uncertain result
that requires status lookup/reconciliation under that same identity. The client must not silently
start another operation after an uncertain response. Exact API response names and wire codes are
not selected here; F05 interface qualification must map them to the controlled Transfer, Grant
and Receipt states in DOC-06. Error information may contain a reason and correlation identity but
not credentials, Grant secret, physical path, or another Actor's private details. Gateway byte
acceptance leaves a private candidate; only Server verification of the matching Receipt can
accept Artifact custody. Neither outcome is document Check-in or Generation publication.

## F01–F05 compatibility checks

1. F01: Web, Desktop, Server and test entry points build from the same commit without secrets.
2. F02: Server data health distinguishes process alive from PostgreSQL unavailable; migrations
   are versioned and use the separate migration role.
3. F03: bootstrap, sign-in/out, disable and revoke reject old proofs on protected requests.
4. F04: permitted/refused/forced-failure outcomes retain attributable records without a
   successful owner result missing required Audit.
5. F05: 1 KiB and 64 MiB fixtures use Client→Gateway bytes, with matching SHA-256 receipt and
   distinct logical/physical identities; wrong Grant, digest mismatch and interruption do not
   produce successful custody.

The second Vault, replication, failover, large-file throughput, document Check-in and production
recovery are outside this contract.

## F03-B HTTP refinement

Engineering route mapping for spec FR-005/014; not a new product approval. Tests use actual
Server HTTP and PostgreSQL, with synthetic identities and protected in-memory credential input.

| Route | Observable result and authority |
|---|---|
| `GET /api/v1/identity/csrf` | Obtain the anonymous/current session's CSRF token through the same-origin boundary. No identity privilege is granted. |
| `POST /api/v1/identity/login` | Native login/password plus CSRF proof; verify active account and credential. Establish a fresh/fixation-protected session. Safe success identifies server-derived Actor; failure returns generic 401 without credential, existence or privileged-role disclosure. |
| `GET /api/v1/identity/session` | Current eligible session gives 200 with its Actor/account identity only. Anonymous, expired, revoked or stale-version proof gives 401, never a redirect or client-chosen Actor. |
| `POST /api/v1/identity/logout` | Valid CSRF and session; invalidate the current proof and cookie. Old proof is refused. GET must not log a user out. |
| `POST /api/v1/identity/accounts` and `POST /api/v1/identity/accounts/{id}/disable` or `/re-enable` | Session-derived Actor and CSRF; reuse F03-A's exact scoped permission and mutation path. Creation remains PENDING with no credential or implicit membership/role. |
| `POST /api/v1/identity/accounts/{id}/credential-proofs` | Eligible Account Administrator explicitly requests initial setup or reset for one account. Issue one-use, purpose/target/version-bound proof; retain attributable outcome/Audit, never its secret. Protected delivery is synthetic harness-only in this increment's development profile. |
| `POST /api/v1/identity/credentials` | Target identity, bound one-use proof, new password and CSRF. Redeem atomically; refuse wrong/expired/replayed/stale proof or invalid password without activation/credential mutation. Reset invalidates old sessions and cannot re-enable a disabled account. |

All other application routes deny anonymous access unless individually designated public.
The existing `/health` and `/health/database` process/data probes retain their accepted contract;
they expose no credentials or internal connection strings. Bootstrap remains a local operator
command, never a controller or startup callback. Clients cannot pass an authoritative ActorId.
Authenticated identity alone is not an administration or product permission.

### HTTP account-administration mapping

The 2026-10-01 authorized slice reuses F03-A's account owner and exact scoped permissions.
Creation accepts `operationId`, `organizationId`, `displayName` and `login`. Success returns
201 with `actorId`, `accountId`, the newly created `loginIdentityId`, `status=PENDING` and
`securityVersion`; no credential, product role or membership is created. Disable/re-enable
accept `operationId`, `organizationId`, `expectedSecurityVersion` and `reason`, with the
Account ID in the route. Success returns 200 with stable Actor/Account IDs, status and version;
this Account-level response does not select or expose an arbitrary sibling Login Identity.
Creation validates the normalized login's existing `validText(..., 254)` input bound
(Java UTF-16 code units) before persistence. Account
enablement also supports zero Login Identities: disable/re-enable does not create a login,
and a credentialless Account returns to PENDING rather than gaining sign-in capability.

All three routes require CSRF and a server-derived session Actor. Check current session
eligibility before scope/permission evaluation and again after the security-write lock;
accepted owner activity refreshes idle time in the same transaction as mutation/IAM/Audit.
Refused or failed mutation does not refresh activity. Super-only identity has no implicit
account authority; exact Account Administrator v1/v2 assignments retain their respective
permissions. Client-supplied Actor fields cannot grant authority or change attribution.

Controller/owner-generated refusals are empty responses: ineligible session 401; absent/revoked/wrong-scope permission,
unknown or foreign target, or last-Super recovery protection 403; invalid input 400; duplicate
login, stale version or invalid transition 409; required persistence failure 503. CSRF refusal
remains 403 at Spring's boundary. These empty-body guarantees do not cover Spring's pre-controller
JSON/UUID binding-error responses; this checkpoint does not qualify their body format.
Disable/re-enable preserves identity/history, increments
the Account security version and cannot revive an old session. Re-enable does not change
credentials; a credentialless Account remains PENDING and otherwise requires fresh sign-in.
Runtime qualification is retained in the successor evidence, not inferred from this mapping.

### Credential issuance and redemption mapping

The first-setup slice uses the explicit v2 permissions in spec's 2026-09-30 clarification.
Its issuer request carries `operationId`, `organizationId`, `purpose=FIRST_SETUP`,
`expectedSecurityVersion` and `reason`; the target Account ID is in the route. Actor/session
authority comes only from authentication. With `idea.identity.synthetic-credential-delivery.enabled`
explicitly enabled in the protected synthetic harness, success returns `proof` and `expiresAt`
with no-store response handling; this opt-in defaults to false (503, no proof). No live or
browser-visible delivery is qualified. The successor reset slice uses `purpose=RESET` and the
separate `account.credential.reset.issue` Permission. RESET additionally requires `loginIdentityId`,
even when the Account has only one login. Validate that exact login belongs to the route Account,
the Account belongs to the requested Organization, the security version matches and the selected
login has a credential in an eligible ACTIVE/DISABLED Account. Missing/null selector returns empty
400; unknown/foreign/ineligible binding returns empty 403 under eligible issuer authority, without
proof or credential mutation. Never choose a first row or fallback. PENDING/no-credential targets
are refused. It uses the same default-off protected synthetic delivery profile, not live recovery.

Redemption carries `operationId`, `accountId`, `proof` and `password`, with CSRF but no
administrative role requirement. Successful first setup returns 204; a rejected proof/password
returns a generic empty 400. Issuance refuses unauthorized scope/permission with 403 and an
ineligible session with 401; required persistence failure returns empty 503, never success or
credential diagnostics. Only a valid, unconsumed proof at its pending target/login/version before
expiry can activate that stable account. It cannot reset an ACTIVE or DISABLED account.

Reset redemption additionally carries `purpose=RESET`; omitted purpose preserves the reviewed
FIRST_SETUP contract. A reset proof cannot redeem as first setup or vice versa. A valid reset
returns 204 after atomically replacing only the proof-pinned Login Identity's verifier, incrementing Account security_version, revoking all
affected sessions and recording IAM outcome/Audit. It leaves account status and actor.disabled_at
unchanged. Existing proofs pinned to the previous version are stale. A DISABLED target still
cannot sign in; separate re-enable at the new version is required, followed by fresh sign-in with
the selected login's new password. Other Login Identity credentials remain unchanged and may
establish fresh sessions when the Account is ACTIVE; their old sessions and version-pinned proofs
are still invalidated by the Account-wide transition. Redemption cannot override the proof's login
target. Invalid proof/state/purpose/password returns empty 400; persistence failure
returns empty 503 with no partial credential, revocation or evidence change.

Use Spring Security session-fixation and CSRF mechanisms, deny cross-origin credential access,
and use Secure/HttpOnly/SameSite cookies with host-only scope under same-origin HTTPS. Expiry,
failed-login block and setup proof behavior follows spec's development profile. Test-only
loopback transport/timing overrides must be recorded and cannot weaken the normal profile or
be exposed as a client-accessible control route. Native Desktop binding/protected-custody
qualification is separate from a Java HTTP harness; no password or session secret enters page
JavaScript. F04 retains the owner-commit race test, using a verified session reference.

T046 did not implement throttling. The separate T041 successor exercises this contract and spec
v0.6's rolling failure window and before/at/after block deadlines, generic refusal with equivalent
qualified password work on blocked paths, atomic concurrent updates and success/session clearing,
and the existing-identity state bound below. Actual Web/Desktop qualification proceeds through agreed seam,
failing-test/evidence contract, implementation if needed, then real-client execution; unrun stays
NOT-RUN/BLOCKED. The Java HTTP harness alone cannot qualify either client.

### Throttling qualification contract (planned)

Use the already-approved real Server HTTP/PostgreSQL seam and controlled Clock. These are
vertical RED → GREEN cases in `HttpSessionFlowTest`; the original planned heading is retained
as a stable link. Actual results are in
[T041 execution evidence](../evidence/F03-identity-results.md#24-t041-throttling-checkpoint),
not inferred from this contract.
Perform sign-in through the existing login/CSRF contract and observe protected-session eligibility.
Reuse owned-schema fixtures and bounded persistence witnesses only where HTTP cannot expose a
resource/transaction invariant; do not add a public counter, test hook or clock route.

| Case | Required oracle |
|---|---|
| Four failures / fifth failure | Use separate fixtures: after four failures, correct eligible credentials succeed and clear state; after five failures on another login, a correct password during the block still gets the same empty 401. No Account disablement or identity replacement. |
| Rolling-window boundary | Independently worked timestamps just before, exactly at and after 15 minutes demonstrate that an exactly 15-minute-old failure is excluded; do not substitute a fixed window. |
| Block boundary | Correct eligible credentials are refused immediately before `blocked_until`, allowed exactly at/after it; intervening blocked attempts do not extend it. |
| Known-login state bound | At most one record, five timestamps and one deadline per existing Login Identity, including repeated attempts while blocked and after expiry. Expired observations no longer count on access. |
| Unknown identifiers | A deterministic batch of 100 distinct unknown names creates zero failure-observation records, Actor/Account/Login Identity or authenticated session records. Anonymous servlet sessions for CSRF are permitted, not authenticated proof. Refusals retain the same empty 401 and qualified dummy-password work. Provision a previously unknown name and prove earlier attempts are not inherited. The batch is a state-bound test, not load/DoS qualification. |
| Normalization and two logins | Case/outer-whitespace variants resolve to the same existing login and failure state. Two logins on one Account have independent state: blocking L1 does not block an otherwise eligible L2; successful L2 sign-in does not clear L1's block. |
| Concurrent failures | Synchronized real HTTP requests reach one atomic fifth-failure transition; no lost updates or moving block deadline. Use controlled barriers, not an arbitrary sleep. |
| Successful clearing / refusal | Successful eligible sign-in clears its current state with the new session/IAM outcome/Audit. Wrong credentials, disabled/PENDING accounts and active blocks cannot clear it or produce an eligible session. |
| Required-write or framework-binding failure | Forced PostgreSQL/session-binding failure leaves no eligible new proof and does not clear prior failures. After removing the fault, the next wrong attempt still reaches the expected threshold. No successful sign-in is published before the required transaction and ordinary Spring binding succeed. |
| Timing and regressions | Interleave warmed-up valid-length active/wrong, unknown, disabled and blocked attempts to detect gross password-work bypass, without claiming constant time. Keep F03-A, exact-login setup/reset, expiry, CSRF/fixation and health regressions. |

Migrate only a test-owned UUID schema using the separate migrator; runtime remains the app role.
Keep V1–V6 immutable. Additive V7 enforces the identity/size bound and preserves
runtime least privilege. Retain exact source, expected/actual boundary instants, result and sanitized
log hash; no proof, cookie, password or submitted unknown-name history in evidence.
