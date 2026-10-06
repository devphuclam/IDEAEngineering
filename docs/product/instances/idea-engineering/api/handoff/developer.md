# Developer and QA handoff — current Identity/Session baseline

`IE-API-HANDOFF-DEV-001`, v0.1, Draft, INFORMATIVE. Control fields, owner, date, classification,
change record and review state inherit the [hub envelope](README.md).

## Delivered materials

For the proposed v0.2 PH2 increment, read [CPD semantic cards](../controlled-product-data.md),
[CPD guide](../cpd-guide.vi.md), [semantic examples](../cpd-examples.json) and
[OpenAPI decision boundary](../cpd-openapi.json). Main source baseline:
`1fb3f7756ad566c527c1247040054f5e9c719953`. Acceptance NOT-RUN under Issue #44.
These DESIGN contracts do not supply implementation-ready unknown DTOs or endpoints.
Use the current register in the hub to distinguish this successor from the historical Identity
handoff below; pin the actual reviewed successor revision when receiving it.

- [Detailed Identity/Session contract](../identity-session.md): inputs, outputs, permissions,
  state transitions, validation, failures, retry and source/test pointers for nine routes.
- [Vietnamese user flow](../guide.vi.md): readable sequence for login and account lifecycle.
- [Core catalogue](../README.md): domain ownership and semantic interface coverage.
- [Existing development OpenAPI](../../../../../../apps/server/src/main/resources/dev-access/openapi.json):
  syntax companion, unchanged; not the entire Core wire contract.

Pin these documents to main revision `54233b4cb016ae1a6c5b025707d2dc18a1a93151` when referencing
the accepted predecessor contract. Pin this handoff successor to its published PR revision.
Document acceptance, application source and deployed artifact are different identities.

## Provider / consumer responsibilities

| Role | Responsibility |
|---|---|
| Server Identity owner | Server-established Actor, session eligibility, exact role/scope decisions, credential and account transitions |
| Web/Desktop consumer | Ordinary session contract and CSRF submission; no client-authoritative ActorId or alternative bearer mechanism |
| QA | Assert observable state, refusal and atomic outcomes against the exact deployed generation |
| Delivery owner | Confirm environment access, TLS trust, synthetic fixture and recipient receipt; do not put credentials in documents |

Named contacts are UNKNOWN; fill them for the actual delivery. This is not an Account Management
UI delivery, a Desktop binding protocol or supported external integration offer.

## First integration path

Use one approved HTTPS origin. Obtain CSRF protection through the documented acquisition route;
submit login with its required header; let the browser handle the HttpOnly session cookie.
Request the protected session, then logout and confirm subsequent refusal. Reacquire CSRF as
required by the contract after authentication transitions.

Exact routes, bodies and status precedence are in the contract; do not infer permission from
successful login. Administrative calls additionally require the exact scoped assignment.
Use synthetic accounts and never record password, cookie, CSRF token or credential proof.

Before execution confirm:

- Exact application source/artifact and environment owner are recorded.
- TLS trust is valid without bypass; HTTPS URL is supplied through controlled configuration.
- Test identity and permissions exist; secrets are delivered separately.
- Database/data boundary and permitted mutations are agreed.
- Tooling and execution authority are available for the chosen test, not inferred from this document.

No environment is provisioned or tested by this handoff publication.

## Evidence and limits

The contract links to inspected source and historical qualification. For example, accepted
F03-B closure used executed source `989bf5a9fc09c03ee2d5fa88d09b3cee78335616`; later identity
digest refactor PR #39 reports 83/83 HTTP session tests on its recorded source.
See [F03 evidence](../../../../../../specs/005-ph1-foundation-custody/evidence/F03-identity-results.md)
and [PR #39](https://github.com/devphuclam/IDEAEngineering/pull/39) for exact lineage.
These are historical results, not a new run on the handoff revision.

Private raw-log access remains limited. Full Core OpenAPI, production environment qualification,
partner access, Account Management UI and Desktop/Workspace qualification are not delivered here.
The verifier is NOT-RUN for this documentation change.

## Acceptance receipt

Use the [release/receipt fields](template.md) to record what the receiving team actually accepted.
Do not turn “document received” into “client integrated” or “production ready.”
