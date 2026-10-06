# Core v0 API domain and operation catalogue

| Control field | Value |
|---|---|
| Stable ID / class | `IE-API-CATALOGUE-001` / supporting interface catalogue |
| Version / status | `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; describes and indexes existing authority, not a new source of requirements |
| Repository instruction state | `NOT-APPLICABLE` |
| Owner / author | Principal Product Author / Codex |
| Reviewer / acceptance authority | Project Reviewer / Product Decision Authority; this package's review and acceptance `NOT-RUN` |
| Applicable baseline | IDEA Core v0; repository `9dab479db929bce88f101cdcbeee91dec50bc25a` |
| Evidence date / effective date | 2026-10-06, `Asia/Ho_Chi_Minh` / `NOT-APPLICABLE` until accepted |
| Classification / retention | `INTERNAL` / retain in Git with supersession history |
| Upstream trace | `IE-PROD-SREQ-001` DOC-04@0.15; DOC-05@0.26; DOC-06@0.18; source and evidence below |
| Downstream trace | Backend, Web/Desktop and QA wayfinding; [Identity/Session example](identity-session.md); [Vietnamese guide](guide.vi.md) |
| Change record / worker mode | [Work Item #40](https://github.com/devphuclam/IDEAEngineering/issues/40) / `CODEX_ONLY`; initial documentation-only edition |
| Supersedes / superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Review trigger | Owner contract, route, security behavior or source baseline changes; detailing another operation family |
| Evidence status | Source-inspected description plus referenced historical qualification; no new runtime execution or standards-conformity claim |

## 1. Read this package

Start with the [Vietnamese flow guide](guide.vi.md) for the user journey. Use this catalogue to find
the owning domain and its interface. Use [Identity/Session](identity-session.md) for the detailed
request, response, authority, state effects and retry example.

This is a supporting refinement, not a ninth Core Product Document. The governing sources remain:

- [DOC-04: requirements](../DOC-04-software-requirements-specification.md).
- [DOC-05: ownership and semantic interfaces](../DOC-05-architecture-description.md#6-semantic-interface-catalogue).
- [DOC-06: data and integration semantics](../DOC-06-data-integration-and-migration-specification.md).
- [Pinned approval record](../registers/CHG-2026-09-25-pg2-pg3-approval.md), whose approval scope is
  not enlarged by this catalogue. Draft headers in the source documents do not erase that record;
  conversely, approved design does not prove a route has been implemented.

The [primary-source research](../../../../research/2026-10-06-api-contract-primary-source-practice.md)
explains the tailoring: OpenAPI 3.0.3 for existing HTTP syntax, HTTP semantics for transport,
and short human-readable operation descriptions for meaning. RFC 9457 errors, a new API versioning
scheme, generators, validators and a generic API framework are **not adopted** here.

### Reading the status column

| Label | What it means at this baseline |
|---|---|
| `HTTP` | A non-test HTTP adapter exists in source. Availability still depends on configuration, session and deployment. |
| `INTERNAL` | A service/module seam exists; not a promised client-facing HTTP endpoint. |
| `QUALIFICATION` | A synthetic test adapter or sample, not a supported product operation. |
| `DESIGN` | A semantic operation family is specified; this package does not claim an implemented wire adapter. |
| `DEFERRED` | A separately governed successor, not part of the current adapter contract. |

Rows are operation **families**, not invented endpoints or new permission codes. The local index
does not replace `REQ-*`, `IF-*` or an OpenAPI `operationId`. A `DESIGN` row's exact URL, payload,
errors and wire retry behavior remain `UNKNOWN` until the owning increment refines them.

## 2. Domain and operation families

| Index | Owner and operations | Authority / interface | Current surface and important boundary |
|---|---|---|---|
| IAM-1 | Identity and Accounts: obtain CSRF, sign in, inspect current session, sign out | `REQ-IAM-001/004/006`; `IF-ACCOUNT-SESSION` | `HTTP`; detailed below. The Server establishes Actor identity. |
| IAM-2 | Identity and Accounts: create account; disable; re-enable | `REQ-IAM-002/005/006`; `IF-DIRECTORY-ADMIN` | `HTTP`; scoped Account Administrator assignment required; no product access is created. |
| IAM-3 | Identity and Accounts: issue first-credential or reset proof; redeem proof | `REQ-IAM-003`; `IF-ACCOUNT-SESSION`, `IF-DIRECTORY-ADMIN` | `HTTP`; issuance has synthetic delivery opt-in only. Setup and reset have different permissions and state effects. |
| IAM-4 | Identity and Accounts: one-time Super Administrator bootstrap | `REQ-IAM-007` | `INTERNAL` operator console command; no HTTP signup/bootstrap route or startup auto-bootstrap. |
| IAM-5 | Identity and Accounts: resolve current session/account eligibility | `REQ-IAM-004`; `IF-IAM-ELIGIBILITY-QUERY` | `INTERNAL`; current eligibility and security version, not client-supplied Actor authority. |
| IAM-6 | Identity and Accounts: other directory maintenance / login-method linking | `REQ-IAM-002/006`; `IF-DIRECTORY-ADMIN` | `DESIGN` beyond the listed routes. Do not infer account-list, rename, delete or link endpoints. |
| ACC-1 | Access Policy: assign exact Account Administrator role version and Organization Scope | `REQ-AUTH-004/009/010`; `IF-RBAC-ADMIN` | `INTERNAL` implemented subset; v1 and v2 remain distinct. No production role-assignment HTTP adapter is claimed. |
| ACC-2 | Access Policy: validate/activate Custom Role successor; preview/replace/revoke assignments | `REQ-AUTH-001/002/004/010`, `REQ-GOV-005`; `IF-RBAC-ADMIN` | `DESIGN` for the complete governed administration family; no implicit retargeting or administrator content bypass. |
| ACC-3 | Access Policy: evaluate and explain a current scoped authorization decision | `REQ-AUTH-003…008`, `REQ-GOV-002`; `IF-AUTHORIZATION-DECISION` | `INTERNAL` IAM/custody subsets; complete Core product resource coverage is `DESIGN`. Permission does not bypass owner business gates. |
| PRJ-1 | Project Governance: maintain Project Membership, Business Groups and direct Actor membership | `REQ-AUTH-003/005/009/010`; `IF-PROJECT-ACCESS-ADMIN` | `DESIGN`; account creation grants none of these; nested Groups are not supported by Core design. |
| CPD-1 | Controlled Product Data: New / Store Existing; inspect duplicate candidates; confirm new identity | `REQ-ID-001…006`; `IF-PRODUCT-COMMAND` | `DESIGN`; stable DocumentId, no silent merge and no empty published Generation. |
| CPD-2 | Controlled Product Data: query exact document/head/history and authorized placement navigation | `REQ-ID-001/002/007`, `REQ-GOV-001/002`; `IF-PRODUCT-QUERY` | `DESIGN`; name/path is not identity; exact historical pins do not mean floating latest. |
| CPD-3 | Controlled Product Data: move/link/unlink placement; alias rename; controlled-name change; Create Copy | `REQ-ID-007…009`; `IF-PRODUCT-COMMAND` | `DESIGN`; alias-only change differs from controlled content; Copy creates new identity without inherited entitlement. |
| CPD-4 | Controlled Product Data: confirm Checkout/Reference scope; acquire/renew/end/recover Reservation | `REQ-WS-001…003/013/014`; `IF-PRODUCT-COMMAND` | `DESIGN`; exact Actor/Workspace/Generation binding, no hidden cascade. Lease duration remains the upstream policy open item. |
| CPD-5 | Controlled Product Data: prepare/confirm Check-in; commit changed or No Change; resolve/retry outcome | `REQ-WS-006…012`; `IF-PRODUCT-COMMAND` | `DESIGN`; all-or-none publication and operation-specific identical-input retry. Custody completion is not Check-in success. |
| WS-1 | Managed Workspace: materialize/verify; open via OS association; scan local changes; retain/recover candidates | `REQ-WS-004/005/010/011/014/015`; `IF-WORKSPACE-IPC` | `DESIGN`; local state is not Server publication; loss of a session does not authorize deletion of local work. |
| CUS-1 | Artifact Custody: allocate transfer; issue/resolve/renew signed Grant; accept signed Receipt | `REQ-WS-016`, `REQ-SEC-001/002`, `REQ-OPS-001/006/007`; `IF-ARTIFACT-CUSTODY` | `INTERNAL` Server services qualified in PH1. Server HTTP grant/renew/receipt routes in the end-to-end fixture are `QUALIFICATION`, not deployed product adapters. |
| CUS-2 | Gateway / FilesystemVaultAdapter: transfer a range; resolve transfer status | `REQ-WS-015/016`, `REQ-SEC-002`; `IF-ARTIFACT-TRANSFER` | `HTTP` Gateway `/transfer/range` and `/transfer/status`; signed Grant authority, not ordinary Server session authority. Separate byte plane. |
| CUS-3 | Artifact Custody: private-candidate reconciliation; location selection; replicate/repair/retire locations | `REQ-OPS-001/006…008`; `IF-ARTIFACT-CUSTODY` | `DESIGN` beyond the PH1 bounded one-Vault thread; no multi-Vault/runtime/backup claim. |
| STR-1 | Product Structure: resolve immutable Structure Snapshot; explicitly adopt changed components | `REQ-STR-001/002`; `IF-STRUCTURE-BOM`, `IF-PRODUCT-QUERY` | `DESIGN`; stable occurrences and exact Generation pins; child change cannot rewrite parent history. |
| STR-2 | Product Structure: query versioned BOM view; export/retain pinned BOM Representation | `REQ-STR-004/005`; `IF-STRUCTURE-BOM` | `DESIGN`; spreadsheet bytes are not structure authority; old output remains historical / Needs update. |
| STR-3 | Named BOM Import coordinator: validate candidate; show diff; confirm atomic snapshot + Generation | `REQ-STR-006`; `IF-STRUCTURE-BOM` | `DESIGN`; Product Structure and Controlled Product Data retain ownership in one coordinated unit of work. |
| LC-1 | Lifecycle Governance: submit exact review scope; withdraw; approve; reject | `REQ-LC-002…005`; `IF-PRODUCT-COMMAND` | `DESIGN`; pinned scope/policy and independent-approver default; Approval is not Release permission. |
| LC-2 | Lifecycle Governance: preview/confirm Release; resolve immutable Release Record; create exact Release Package | `REQ-LC-006…008`, `REQ-STR-003/005`; `IF-PRODUCT-COMMAND`, `IF-PRODUCT-QUERY` | `DESIGN`; revalidate all required pins at commit; no unconfirmed tree cascade. |
| LC-3 | Lifecycle Governance / Controlled Product Data: Create Revision | `REQ-LC-009`, `REQ-ID-002`; `IF-PRODUCT-COMMAND` | `DESIGN`; old Release remains immutable; new Revision has its own Version 1 baseline. |
| CFG-1 | Lifecycle Governance: validate/activate Workflow Definition and Approval Policy versions | `REQ-LC-001/003/005`, `REQ-GOV-005`; `IF-WORKFLOW-ADMIN` | `DESIGN`; running instances retain their pins; configuration cannot create personnel or role authority. |
| CFG-2 | Information Model: govern metadata/classification/validation/numbering definitions; allocate Business Number | `REQ-GOV-003…005`; `IF-PRODUCT-COMMAND`, `IF-PRODUCT-QUERY` | `DESIGN`; versioned candidate/preview/activation; Business Number differs from DocumentId. Stored operational reference data does not create an ERP transaction. |
| FMT-1 | Format Intelligence: declare Capability Profile; request isolated format job; accept manual/produced derivative | `REQ-FMT-001…005`, `REQ-SEC-004`; `IF-FORMAT-JOB` | `DESIGN`; exact source/output pins and producer provenance; no IDEA code inside CAD/Office and no floating-latest derivative. |
| AUD-1 | Audit: retain attributable evidence; authorized Audit query; committed projection/notification | `REQ-AUD-001/002`, `REQ-OPS-002`; `IF-COMMITTED-EVENT`, `IF-PRODUCT-QUERY` | `INTERNAL` evidence writes exist. Audit query/dispatcher/product projections are `DESIGN`; no editable Audit or consumer-owned business success. |
| EVT-1 | Owner Modules: append committed event with owner outcome and Audit | `REQ-AUD-001`, `REQ-OPS-002`; `IF-COMMITTED-EVENT` | `INTERNAL` foundation qualified by F04. Synthetic sample result/replay access is `QUALIFICATION`, not a universal product result-access rule. |
| DSK-1 | Desktop: allowlisted Web/native intent bridge; Workspace binding and per-user protected custody | `REQ-SEC-003`; `IF-DESKTOP-BRIDGE`, `IF-WORKSPACE-IPC` | `DESIGN` / separate successor qualification. Accepted PH1 Web evidence does not qualify Desktop. |
| OPS-1 | Operations: controlled backup/restore drill; capacity and availability qualification | `REQ-OPS-003…005` | `DESIGN` operational work, not an invented public API; PH1 does not establish production readiness. |
| EXT-1 | Future company login / external business integration | `IF-COMPANY-IDENTITY`; DOC-05 scope boundary | `DEFERRED`; no provider, auto-link-by-email, ERP write-back or public-integration promise. |

## 3. Semantic interface coverage

This crosswalk covers all 17 `IF-*` contracts in DOC-05 section 6. It is an index, not a claim that
all Core requirements or adapters have passed qualification.

| DOC-05 interface | Catalogue families |
|---|---|
| `IF-PRODUCT-QUERY` | CPD-2, STR-1, LC-2, CFG-2, AUD-1 |
| `IF-PRODUCT-COMMAND` | CPD-1…5, LC-1…3, CFG-2 |
| `IF-ARTIFACT-CUSTODY` | CUS-1, CUS-3 |
| `IF-ARTIFACT-TRANSFER` | CUS-2 |
| `IF-WORKSPACE-IPC` | WS-1, DSK-1 |
| `IF-FORMAT-JOB` | FMT-1 |
| `IF-COMMITTED-EVENT` | EVT-1, AUD-1 |
| `IF-ACCOUNT-SESSION` | IAM-1, IAM-3 |
| `IF-IAM-ELIGIBILITY-QUERY` | IAM-5 |
| `IF-DIRECTORY-ADMIN` | IAM-2, IAM-3, IAM-6 |
| `IF-PROJECT-ACCESS-ADMIN` | PRJ-1 |
| `IF-RBAC-ADMIN` | ACC-1, ACC-2 |
| `IF-AUTHORIZATION-DECISION` | ACC-3 |
| `IF-WORKFLOW-ADMIN` | CFG-1 |
| `IF-STRUCTURE-BOM` | STR-1…3 |
| `IF-DESKTOP-BRIDGE` | DSK-1 |
| `IF-COMPANY-IDENTITY` | EXT-1 |

## 4. Current HTTP description, not a new universal convention

The existing [OpenAPI 3.0.3 asset](../../../../../apps/server/src/main/resources/dev-access/openapi.json)
describes 11 paths: nine Identity paths and two health paths. This package supplements it with
human-readable semantics; it does not replace or modify the runtime asset. Its schemas do not
fully express the validation/conditional fields described in the Identity example.

- Existing `/api/v1` paths remain unchanged. No date header, new URI version or compatibility
  policy is selected. An OpenAPI operation name is not a request's UUID `operationId`.
- Server-established Actor context and current authorization precede owner business checks.
  A session is not a product Permission. Gateway Grant authentication is a different boundary.
- Concurrency uses the owner-specific expected state; Identity currently uses
  `expectedSecurityVersion`, not an invented ETag / `If-Match` requirement.
- Retry is defined per operation. A UUID alone does not guarantee canonical replay. The
  [F04 sample policy](../../../../../docs/adr/0014-retain-owner-committed-event-foundation.md)
  and qualified custody retry behavior are not automatically applied to Identity or future APIs.
- There is no new common error envelope. Clients distinguish HTTP failure from success and
  treat uncertain response loss separately from a proven rollback. They do not turn a refusal
  into success or expose credentials, session cookies or proofs in diagnostics.

Health is operational, not identity authority: `GET /health` returns `200 {"status":"UP"}`;
`GET /health/database` returns `200 {"status":"UP"}` or `503 {"status":"DOWN"}`. Both are
public in the current Server filter chain. Neither grants access or proves an operation committed.
Development Swagger is a dev-only aid, not the product contract or an authentication method.

## 5. Source and review boundary

| Claim | Source / existing evidence |
|---|---|
| Identity HTTP surface and validation | [IdentityController](../../../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityController.java), [IdentityHttpSecurity](../../../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityHttpSecurity.java); detailed links in the example |
| Internal Grant and Receipt services | [TransferGrantService](../../../../../apps/server/src/main/java/com/idea/ddm/custody/TransferGrantService.java), [TransferReceiptService](../../../../../apps/server/src/main/java/com/idea/ddm/custody/TransferReceiptService.java) |
| Actual Gateway routes | [GatewayApplication](../../../../../apps/gateway/src/main/java/com/idea/ddm/gateway/GatewayApplication.java) |
| Test-only Server transfer routes | [TransferClientBoundaryTest](../../../../../apps/server/src/test/java/com/idea/ddm/identity/TransferClientBoundaryTest.java); `/qualification/f05/*` is not a product route |
| Historical PH1 qualification / limits | [PH1 coverage review](../../../../../specs/005-ph1-foundation-custody/evidence/PH1-coverage-review.md), [F03-B closure matrix](../../../../../specs/005-ph1-foundation-custody/evidence/F03-B-closure-matrix.md) |

Edition 0.1 review asks whether the catalogue uses the right owner/authority, the Identity example
matches source, and a client/QA reader can distinguish supported behavior from design. It does
not reopen accepted PH1 behavior or approve new product implementation.

Unknown wire definitions belong to their future owner increment, not to a global framework task.
Before another family becomes a detailed contract, its owner identifies the exact operation,
input/output, access policy, expected-state check, commit result, errors and retry semantics.
Only choices absent from governing authority require a product decision.
