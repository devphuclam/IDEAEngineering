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

Use Spring Security session-fixation and CSRF mechanisms, deny cross-origin credential access,
and use Secure/HttpOnly/SameSite cookies with host-only scope under same-origin HTTPS. Expiry,
failed-login block and setup proof behavior follows spec's development profile. Test-only
loopback transport/timing overrides must be recorded and cannot weaken the normal profile or
be exposed as a client-accessible control route. Native Desktop binding/protected-custody
qualification is separate from a Java HTTP harness; no password or session secret enters page
JavaScript. F04 retains the owner-commit race test, using a verified session reference.
