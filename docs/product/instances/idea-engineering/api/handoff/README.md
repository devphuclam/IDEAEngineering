# API contract handoff hub

| Control field | Value |
|---|---|
| Stable ID / class | `IE-API-HANDOFF-001` / supporting handoff package |
| Version / status | `0.1` / `Draft — proposed for review` |
| Normativity / repository instruction state | `INFORMATIVE` / `NOT-APPLICABLE`; proposed documentation workflow, no new product authority |
| Owner / author | Principal Product Author / Codex |
| Reviewer / acceptance authority | Project Reviewer / Product Decision Authority; this successor package acceptance `NOT-RUN` |
| Baseline / publication date | Main `54233b4cb016ae1a6c5b025707d2dc18a1a93151` / 2026-10-06, Asia/Ho_Chi_Minh |
| Classification / retention | `INTERNAL`; retain version and supersession history in Git |
| Upstream | [Catalogue](../README.md), [Identity/Session](../identity-session.md), DOC-04/05/06 linked there |
| Downstream | Dev/QA handoff, management overview, separately approved partner disclosure |
| Change / worker mode | [Issue #42](https://github.com/devphuclam/IDEAEngineering/issues/42) / `CODEX_ONLY`; successor to #40 |
| Effective date / supersession | `NOT-APPLICABLE` until accepted / does not replace accepted v0.1 contract |
| Review trigger | Contract, owner, implementation, package baseline, recipient or sharing scope changes |
| Evidence | Source/document inspection only; no new application execution or standards-conformity claim |

## One entry point, three audiences

| Reader | Start here | What the reader can determine |
|---|---|---|
| Backend, Web/Desktop, QA | [Developer handoff](developer.md) | Exact contract, implementation boundary, examples, historical evidence and integration prerequisites |
| Management | [Vietnamese overview](overview.vi.md) | Delivered scope, remaining scope and decisions needed before delivery |
| Partner assessment | [Partner brief draft](partner-brief.md) | Capabilities and exclusions; no internal deployment details or promise of public API access |
| Author of the next domain contract | [Operation and release template](template.md) | Consistent fields, compatibility review and attributable handoff receipt |

These are projections of one contract set, not three independently maintained API specifications.
The detailed contract owns operation facts; views link to it rather than duplicating its schemas.
No documentation website, generator, new dependency or runtime is introduced.

## Current baseline register

| Package / coverage | Contract disposition | Implementation / qualification | Handoff readiness |
|---|---|---|---|
| Core catalogue v0.1 | Accepted through PR #41; all 17 semantic interfaces indexed | Mixed HTTP, internal, qualification, design and deferred families | Suitable for scope discussion, not full Core implementation handoff |
| Identity/Session v0.1 | Accepted through PR #41; nine routes detailed | Existing source and referenced historical executed evidence; no new execution here | Internal developer reference; deployment/access and recipient-specific receipt still required |
| Existing development OpenAPI | OpenAPI 3.0.3, `dev-access-0.1`; unchanged | Development documentation asset; conditional semantics also require human contract | Companion, not a complete machine-readable contract for all Core domains |
| Discovery / locale and other DESIGN families | Semantic scope indexed | Exact wire contracts `UNKNOWN` | Not ready to implement from catalogue alone |
| This handoff hub / audience views | Proposed successor, acceptance `NOT-RUN` | Documentation only | Reviewable internal draft |
| Partner interface offer | No supported public integration interface in Core v0 | No external access qualification claimed | Sharing approval and an agreed integration scope `UNKNOWN` |

The accepted v0.1 files retain their original Draft/NOT-RUN authoring headers as historical
publication metadata. Later acceptance is recorded at
[PR #41 acceptance](https://github.com/devphuclam/IDEAEngineering/pull/41#issuecomment-6011538163).
Reviewed head was `2aefd831137bb572ac80b4da28113d54661745ec`; authorized final crosswalk correction
was `a476d2088781a33b54bdae5f230c83abde802f2f`, integrated at the main baseline above.
This register records that lineage without rewriting historical claims.

## Lightweight maintenance and delivery

1. Select the domain and operation family from the catalogue. Name provider and consumer roles.
2. Populate the template using governing requirements and exact source. Keep design decisions
   separate from observed behavior; unresolved wire details stay UNKNOWN.
3. Review request/response, permission, state, failures, concurrency and retry with the affected
   teams. A contract review does not itself prove implementation or authorize deployment.
4. Publish an immutable Git revision through the repository's ordinary Work Item/PR workflow.
   Record contract version, source revision, evidence and recipient scope.
5. Deliver links pinned to that revision, not only a moving main link. Record recipient/date,
   received revision, open questions and acceptance separately using the template.
6. For a change, state affected consumers and compatibility impact before updating the contract.
   Breaking semantics require an explicit decision and migration plan; this procedure does not
   invent a URL-version scheme. Preserve old editions and their evidence.

Issue #42 review can accept the documentation arrangement; it cannot authorize sharing internal
files externally. Named team contacts, partner recipient, permitted disclosure and production
base URL are UNKNOWN. Owner: project delivery owner; resolve when an actual handoff is scheduled.
No fake contact, deadline, SLA or partner access is created to fill those blanks.
