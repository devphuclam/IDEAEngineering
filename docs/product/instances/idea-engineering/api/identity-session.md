# Identity and Session HTTP contract — observed baseline

| Control field | Value |
|---|---|
| Stable ID / class | `IE-API-IAM-001` / supporting HTTP contract description |
| Version / status / normativity | `0.1` / `Draft` / `INFORMATIVE` |
| Owner / author | Principal Product Author / Codex; domain owner: Identity and Accounts |
| Reviewer / acceptance authority | Project Reviewer / Product Decision Authority; this edition `NOT-RUN` |
| Baseline / evidence date | `9dab479db929bce88f101cdcbeee91dec50bc25a` / 2026-10-06 |
| Upstream | DOC-04 `REQ-IAM-001…007`, `REQ-AUTH-*`; DOC-05 `IF-ACCOUNT-SESSION`, `IF-DIRECTORY-ADMIN`; DOC-06 |
| Control tailoring | Effective date, classification, retention, change record, supersession, instruction state and standards/evidence limits inherit the [catalogue envelope](README.md); review on relevant source/contract change |
| Downstream | Client integration and QA reading example; [Vietnamese guide](guide.vi.md) |

## 1. Scope and authority

This edition describes the current Server routes, not the full future Account Management UI or
directory feature set. The [existing OpenAPI asset](../../../../../apps/server/src/main/resources/dev-access/openapi.json)
remains unchanged at OpenAPI `3.0.3`, document version `dev-access-0.1`.

All paths below use prefix `/api/v1/identity`. Relative paths assume the same trusted HTTPS origin
as the IDEA Web application; the development launcher's URL is not a fixed production server URL.
Mutations use the session-backed CSRF header returned by `/csrf`, including anonymous login and
credential redemption. Missing/bad CSRF can return `403` before controller validation or authentication;
the other refusal statuses below assume a valid CSRF submission and a syntactically bound request.

| Authority fact | Current meaning |
|---|---|
| Actor | Derived by the Server from its authenticated session, never an authoritative client `ActorId`. |
| Session cookie | `IDEA_SESSION`, Secure, HttpOnly, SameSite=Strict, host-only. Browser attaches it; JavaScript does not read it. No JWT / localStorage bearer. |
| Session eligibility | Active account, enabled Actor, matching security version, unrevoked DB record, current runtime instance and current deadlines. |
| Lifetime | Idle 2 hours and absolute 8 hours; exactly at either deadline the session is ineligible. Servlet retention is 8 hours, not the eligibility authority. |
| Restart | Old runtime proof cannot be adopted; retained DB session metadata does not recreate authentication. Fresh sign-in is required. |
| Administration | A real applicable `account-administrator@1` or `@2` assignment pins Organization Scope. Authentication alone and Super Administrator status alone grant no account CRUD. |
| Proof issuance | Only explicit `account-administrator@2` includes the separate setup/reset issuance permissions. v1 is not silently upgraded. |

Successful eligible activity can refresh idle eligibility; it cannot extend absolute lifetime.
Public traffic, rejected CSRF and refused account authorization do not keep a session alive.
Each protected Identity operation uses current eligibility; account mutations revalidate it with
authorization before authoritative commit. This does not claim all future product routes exist.

## 2. Route inventory

| ID | Method / suffix | Input | Success | Authority and refusals |
|---|---|---|---|---|
| I01 | `GET /csrf` | No body | `200` JSON `{headerName, token}` | Anonymous permitted. Token is security proof, not an Actor grant. |
| I02 | `POST /login` | `application/x-www-form-urlencoded`: `username`, `password`; CSRF header | `200` JSON `{actorId}` | Generic `401` for invalid/unknown/disabled/blocked login or verification unavailable; CSRF `403`. Session proof rotates. |
| I03 | `GET /session` | Browser session cookie; no body | `200` JSON `{actorId, accountId}` | `401` for anonymous/ineligible/unverifiable session; no sign-in redirect or caller identity fallback. |
| I04 | `POST /logout` | Cookie + CSRF; no body | `204`, no body | Eligible current session required. Ineligible `401`; persistence failure `503`; CSRF `403`. |
| I05 | `POST /accounts` | JSON create fields below | `201` JSON `{actorId, accountId, loginIdentityId, status, securityVersion}` | `account.create` in requested Organization Scope; `400` input, `401` session, `403` authority, `409` login conflict, `503` persistence. |
| I06 | `POST /accounts/{account}/disable` | Account UUID path; JSON transition fields | `200` JSON `{actorId, accountId, status, securityVersion}` | `account.disable`; `400` input, `401` session, `403` authority/last-Super protection, `409` stale version/state, `503` persistence. |
| I07 | `POST /accounts/{account}/re-enable` | Account UUID path; JSON transition fields | Same as I06 | `account.re-enable`; same status classes. Re-enable is not password recovery. |
| I08 | `POST /accounts/{account}/credential-proofs` | Account UUID path; JSON issue fields | Synthetic opt-in: `200` JSON `{proof, expiresAt}` | Separate issuance Permission by purpose; normally `503` because delivery is disabled. In opt-in mode: `400` input, `401` session, `403` authority/target, `503` persistence. |
| I09 | `POST /credentials` | JSON redemption fields; CSRF | `204`, no body | Target-bound proof authorizes redemption; no Account Administrator role required. `400` invalid proof/password/purpose; `503` persistence; CSRF `403`. Does not sign in. |

JSON success IDs are UUID strings; `status` is an account state and `securityVersion` is the current
numeric concurrency/security version. `expiresAt` is an instant string. Fields in this table are
case-sensitive. Do not add an `ActorId` to gain authority or send credentials in a URL.
Unsupported methods/routes are not alternate ways to perform these operations; GET does not log out.

There is no product HTTP route here for public signup, bootstrap, account listing/status lookup,
role assignment, Project/Group membership or company identity login.

## 3. JSON input definitions

| Request | Defined fields and validation |
|---|---|
| Create account | Required `operationId`: UUID; `organizationId`: UUID; `displayName`: nonblank string, at most 160 Java UTF-16 code units; `login`: nonblank string, at most 254 Java UTF-16 code units. Text rejects ISO control characters. |
| Disable / re-enable | Required `operationId`, `organizationId`; `expectedSecurityVersion`: integer at least 1; `reason`: nonblank string, at most 500 Java UTF-16 code units, no ISO control characters. Account UUID comes from the path. |
| Issue proof | Required `operationId`, `organizationId`, `purpose` (`FIRST_SETUP` or `RESET`), `expectedSecurityVersion` at least 1 and `reason` with the same 500-unit bound. `loginIdentityId` is a required exact UUID **for RESET**; it is not a first-setup selector. |
| Redeem proof | Required `operationId`, `accountId`, `proof`, `password`; `purpose`: `FIRST_SETUP` or `RESET`. Current controller treats omitted/null purpose as `FIRST_SETUP`; any other value is refused. |

Login comparison uses `strip().toLowerCase(Locale.ROOT)` and a unique normalized login identifier;
it does not merge Accounts or infer identity from display name/email. Passwords are never trimmed,
normalized or truncated. New credentials use at least 15 Unicode code points and at most 72 UTF-8
bytes, reject blank input and unpaired surrogates, and use the qualified BCrypt verifier. Character
count and byte count are different constraints. This new-credential rule does not retroactively
reject an existing bootstrap credential merely for being under 15 characters.

The proof is a 43-character unpadded URL-safe value issued from 32 random bytes. Its stored digest
is not the redeemable proof. It is one-use, bound to Account + Login Identity + purpose + security
version, and valid from issuance until **before** its 15-minute expiry. Exactly at expiry it fails.
Client code treats it as an opaque secret; diagnostics/examples/evidence contain no actual value.

Malformed JSON and UUID binding can be rejected by the framework before these service checks.
Unknown-field handling and a canonical-only UUID spelling are not qualified promises in this
edition. Internal refusal reason codes are not a new public error-code contract.

### Synthetic create-account example

I05 uses JSON, unlike the form-urlencoded login. This example assumes a current session, CSRF
header and a scoped `account.create` grant; the UUIDs are documentation fixtures, not deployable
authority. Real returned IDs are Server-generated.

```json
{
  "operationId": "00000000-0000-4000-8000-000000000401",
  "organizationId": "00000000-0000-4000-8000-000000000400",
  "displayName": "Synthetic Contract Reader",
  "login": "contract.reader"
}
```

Illustrative `201` body:

```json
{
  "actorId": "00000000-0000-4000-8000-000000000402",
  "accountId": "00000000-0000-4000-8000-000000000403",
  "loginIdentityId": "00000000-0000-4000-8000-000000000404",
  "status": "PENDING",
  "securityVersion": 1
}
```

These are shape examples, not execution evidence. No password, proof, cookie or CSRF value is retained.

## 4. Effects and atomicity

| Operation | Committed effects / what it does not do |
|---|---|
| Login | Successful eligible sign-in clears current failures and establishes a session with the same authoritative transaction fate as required IAM outcome/Audit. Success is published only after the ordinary Spring session binding is established and DB commit completes. |
| Logout | Revokes only the current session with its IAM outcome/Audit; clears ordinary context/cookie only after success. Sibling sessions remain independently eligible. Refused logout writes no accepted outcome; storage/commit failure cannot report successful logout. |
| Create | Creates stable Actor, Account and Login Identity; Account starts `PENDING`, without password. Creates no Role Assignment, Project Membership or Group Membership. |
| Disable | Preserves Actor/Account/Login identities and history; sets account/Actor disablement, increments security version and invalidates affected old sessions. Refuses removal of the last effective Super recovery path. |
| Re-enable | Preserves identity and credential; increments security version. Returns to `ACTIVE` if a credential exists, otherwise `PENDING`. Old sessions remain invalid; fresh sign-in is required. |
| First setup | Eligible `PENDING`, enabled Actor, credentialless selected login and matching version. Issuance pins a selected Login Identity; redemption consumes the proof, installs its first credential and activates the Account atomically with required IAM evidence/Audit. |
| Reset | Issuance requires the exact credential-bearing Login Identity within the Account/Organization, matching version, and a consistent `ACTIVE` or `DISABLED` target. Redemption changes **only that login's** credential, increments Account security version and revokes all old Account sessions. Same-version proofs become stale. |
| Reset while disabled | Account stays `DISABLED`; Actor stays disabled. Reset cannot re-enable it. A separate authorized re-enable is needed before fresh sign-in using the new credential. |

For an active multi-login Account, resetting L1 does not change L2's credential. L2 can fresh
sign in using its own credential after the Account-wide old-session invalidation. Disable/re-enable
operate on the Account, not one arbitrarily selected login.

First-setup issuance currently selects an eligible credentialless Login Identity within the target;
this edition does **not** promise deterministic multi-login selection or assert one login per Account.
An exact first-setup selection policy remains `UNKNOWN` for that use case, owned by the next IAM
refinement before promising it to a client. Reset's explicit selector is already implemented.

Accepted administration commits IAM-owned state, owner outcome, authorization evidence and required
Audit together. A required write/commit failure does not permit partial accepted state. No general
product outbox/dispatcher guarantee is invented from this Identity example.

### Temporary failed-login block

For an existing normalized login, five failures in a rolling 15-minute window start a 15-minute
block. A failure exactly 15 minutes old no longer counts. Attempts during a block do not extend
or reset its deadline; exactly at `blocked_until` a new attempt is allowed. Successful eligible
sign-in clears current failure state atomically with session establishment. Normalized aliases
share state; sibling Login Identities have independent state. Account status is not changed.

Unknown identifiers do not create durable throttle rows. Unknown, disabled and blocked paths
retain equivalent qualified password work and the same generic authentication refusal; neither
the response nor this document promises a constant-time implementation or a global network rate limit.

## 5. Client flow, failures and retry

1. Fetch I01 on the actual origin with cookies enabled. Keep the returned header name/token in RAM.
2. Submit I02 as form data with that header. After `200`, obtain a fresh CSRF token and inspect I03.
3. Treat I03's identity as Server-observed display data, not client authorization to act as that Actor.
4. For an authorized administration request, use the exact target, Organization and current version.
   Do not manufacture a newer version after `409` or treat `403` as permission to bypass the owner.
5. Submit I04 with current CSRF. After `204`, clear local identity display, reacquire CSRF for a later
   anonymous flow, and expect I03 to refuse. On error, show refusal/error rather than success.

| Result | Client interpretation |
|---|---|
| `400` | Invalid request or proof. No success inferred; a consumed/expired/stale proof is not reusable. |
| `401` | No eligible current session, or generic sign-in refusal. Require fresh eligible authentication where appropriate. |
| `403` | CSRF/access refusal. Reacquiring CSRF does not grant a missing Role Assignment or Scope. |
| `409` | Account conflict/stale expected version. Inspect controlled current state before deciding a new operation. |
| `503` | Operation unavailable; includes deliberately disabled proof delivery. Not a success. |
| Response loss | Commit may have happened. Do not call it rollback, silently create a new UUID, or claim safe replay. |

Current explicit controller refusals often have an empty body; Spring/framework errors can have
another shape. There is no uniform RFC 9457 envelope, retry-after promise or exposed internal reason
taxonomy. Clients rely on status and the operation's semantics, not a guessed universal JSON body.

`operationId` identifies an attempt/outcome but the Identity adapters do not resolve a previous
canonical result for replay. Reusing it is **not** a promised idempotent success. In particular:

- After committed logout, the same old session is ineligible; retry can return `401`, not another `204`.
- A consumed redemption proof is refused, not returned as an already-successful redemption.
- Account mutations can hit operation uniqueness or stale-state checks; there is no HTTP account
  status/operation-result endpoint in this slice. Controlled inspection is needed for an uncertain
  administrative result. Fresh I03 proves only session eligibility, not completion of that mutation.

Passwords may exist transiently in a password control and request submission; they are not copied
to URL, storage, logs, DOM text or retained evidence. Clear them after submit/unmount. CSRF stays in
RAM; HttpOnly session cookies stay outside JavaScript. The dev Swagger disables Try out for
credential/proof inputs; it is not a secret-entry UI.

## 6. Trace to source and existing qualification

| Behavior group | Source | Existing test/evidence |
|---|---|---|
| Routes / authority / session publication | [IdentityController](../../../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityController.java), [IdentityHttpSecurity](../../../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityHttpSecurity.java), [SignInBoundary](../../../../../apps/server/src/main/java/com/idea/ddm/identity/SignInBoundary.java), [SessionService](../../../../../apps/server/src/main/java/com/idea/ddm/identity/SessionService.java) | `anonymousClientCanObtainCsrfProofWithoutIdentityPrivilege`, `realLoginRotatesSessionAndServerDerivesActorDespiteCallerSuppliedIdentity`, idle/absolute tests |
| Logout refusal / failure / siblings | [LogoutBoundary](../../../../../apps/server/src/main/java/com/idea/ddm/identity/LogoutBoundary.java), SessionService | `csrfProtectedLogoutInvalidatesOnlyCurrentSessionAndGetCannotLogOut`, `expiredLogoutIsRefusedWithoutAcceptedEvidenceOrRevocation`, `logoutCommitFailureRollsBackRevocationAndKeepsOrdinaryProofForRetry` |
| Administration / version / role separation | [IdentityAdministration](../../../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityAdministration.java), [IdentityTransactions](../../../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityTransactions.java), [RoleAssignmentAdministration](../../../../../apps/server/src/main/java/com/idea/ddm/identity/RoleAssignmentAdministration.java) | `httpAccountCreationUsesTheSessionActorAndCreatesOnlyAPendingIdentity`, `httpAccountAuthorityRequiresCurrentScopedAssignmentAndCsrfNotSuperOrClientIdentity`, `accountAdministratorV2IsAnExplicitAuditedAssignmentWithoutRetargetingV1` |
| Setup / exact-login reset / password bounds | [CredentialSetupService](../../../../../apps/server/src/main/java/com/idea/ddm/identity/CredentialSetupService.java), [CredentialResetService](../../../../../apps/server/src/main/java/com/idea/ddm/identity/CredentialResetService.java), [NativePasswordVerifier](../../../../../apps/server/src/main/java/com/idea/ddm/identity/NativePasswordVerifier.java) | `resetRequiresExplicitLoginIdentityEvenWhenAccountHasOnlyOneLogin`, `disabledTwoLoginResetPreservesDisablementAndSiblingCredentialUntilSeparateReenable`, `newPasswordBoundsCountUnicodeCharactersAndUtf8BytesWithoutTrimming`, `syntheticProofDeliveryIsUnavailableWithoutExplicitOptIn` |
| Throttle / restart / actual Web | [LoginFailures](../../../../../apps/server/src/main/java/com/idea/ddm/identity/LoginFailures.java), [HTTP tests](../../../../../apps/server/src/test/java/com/idea/ddm/identity/HttpSessionFlowTest.java), [restart tests](../../../../../apps/server/src/test/java/com/idea/ddm/identity/ServerRestartFlowTest.java) | [F03 closure matrix](../../../../../specs/005-ph1-foundation-custody/evidence/F03-B-closure-matrix.md), [W01–W10 evidence](../../../../../specs/005-ph1-foundation-custody/evidence/T043-web-browser-successor-20261001.md) |

The named methods are reading pointers, not tests executed for this document change. The closure
matrix records historical 108-test Server/IAM/restart/health execution at
`989bf5a9fc09c03ee2d5fa88d09b3cee78335616`; later affected execution remains in repository evidence.
This edition introduces no new runtime PASS. Raw private-log access remains limited as recorded
there. Runtime requalification and `verify-template` for Work Item #40 are `NOT-RUN`.
