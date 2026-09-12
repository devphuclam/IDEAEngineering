# Architecture Consistency Correction Audit

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-VEV-ARCH-CORR-001` |
| Supporting Class / Version | `VEV` / `Draft 0.1` |
| Date | 12-09-2026 |
| Scope | Successor architecture/data-view source and rendition audit for DOC-05@0.14 and DOC-06@0.14; cross-source alignment checked against CONTEXT, ADR-0012, DOC-08@0.10 and VVP@0.14. |
| Change source | [IE-CHG-ARCH-CORR-001](CHG-2026-09-12-architecture-consistency-correction.md). |
| Exact Markdown baseline | DOC-05 SHA-256 `31796D3A9D41B06DE789EBBA7ABBE034026C879E5B8E57DC9F323BB6F3B156B0`; DOC-06 SHA-256 `D63FFB32CA4226083A94682F210AE571406A7B144D0E30A4DF109BEC6F4482A3`. |
| Author / internal reviewer | Principal Product Author performs the bounded source/rendition audit; project user approved the correction direction. Independent architecture, security, HCD and verification reviewers are not assigned. |
| Tooling | `scripts/render-architecture.cjs` and `scripts/check-architecture-svg.cjs`; Mermaid `11.12.0`; Chrome `152.0.7977.84`. |
| Evidence class | Controlled source/rendition evidence only. It is not implementation, runtime-test, threat-model, technology-selection, controlled-DOCX/PDF or product-approval evidence. |
| VVP / gate disposition | Author source/rendition checks below are `PASS`; `VVP-016` qualified review and controlled-rendition acceptance remain `BLOCKED`. PG4 is not assessed or passed by this record. |
| Access / retention | `INTERNAL`; retain with the exact Markdown, generated rendition, CHG and earlier VEV evidence. |

[Mở gallery 30 view](../evidence/IE-VEV-ARCH-CORR-001/index.html) ·
[Kết quả render và source hash](../evidence/IE-VEV-ARCH-CORR-001/render-results.json) ·
[Kết quả mở SVG độc lập](../evidence/IE-VEV-ARCH-CORR-001/svg-open-results.json).

## 1. Method and bounded result

The correction audit was run only against the successor evidence folder
`IE-VEV-ARCH-CORR-001`. The rendering scripts now require an explicit
`IDEA_ARCH_EVIDENCE_ID`; this prevents an ordinary re-render from overwriting an earlier controlled
evidence record.

The audit performed these separate checks:

1. inventory each Mermaid block in DOC-05/DOC-06, requiring one unique catalogue View ID and a
   non-empty `accTitle` and `accDescr`;
2. render every source view to SVG and PNG with the pinned Mermaid version;
3. open every standalone SVG through a Chrome `file:` URL and reject an XML parser error;
4. inspect the rendered image of every one of the 30 views at its rendered/full-size form for
   clipping, missing elements, visible overlap, arrow direction and readable scope; wide sequence
   and data views are explicitly retained as full-size SVG views rather than compressed into a narrow
   document column; and
5. perform a cross-source search for the two ID guards, Reservation lifecycle, custody/coordinator
   boundary, server-established authorization, `AuthorizationDecision` versus
   `OwnerCommandOutcome`, transfer/trust path, two-axis Reference condition, recovery and
   Structure-Pin semantics.

| Check | Result | Evidence / finding |
|---|---|---|
| View inventory and alternative text | `PASS` | 30 headings, 30 unique View IDs, and no duplicate ID reported by the renderer. |
| Existing-ID guard | `PASS` | Exactly one catalogue definition each for `ARCH-VIEW-SEC-001` and `ARCH-VIEW-SEQ-011`; both are refactored existing views, not newly numbered views. |
| Mermaid source rendition | `PASS` | 30/30 rendered at `2026-09-12T10:36:19.54Z`; no render failure. |
| Standalone SVG opening | `PASS` | 30/30 opened at `2026-09-12T10:36:21.476Z`; `0` XML parser/open failures. |
| Visual author inspection | `PASS` (bounded) | All 30 rendered images were opened and inspected. No clipping, missing rendered element or XML fallback was observed. Dense/wide sequence and data views remain intentionally full-size gallery artifacts. |
| Qualified architecture/security/HCD review | `BLOCKED` | Not performed by a qualified independent reviewer; this record does not substitute for it. |

## 2. Correction-specific cross-view audit

| Required guard or boundary | Audit result |
|---|---|
| Reservation lifecycle | `ARCH-VIEW-STATE-002` contains `Active`, `Ended`, `Expired` and `Recovered`; no `Released` Reservation state node exists. Current source states `Active → Ended / Expired / Recovered`; `Released` remains only the Business Revision lifecycle term or a negative guard against Reservation use. |
| Artifact Custody | DOC-05 module/sequence/security/evolution views and DOC-06 data view give custody only Artifact identity/location, private candidate, transfer and provider-migration responsibilities. `ArtifactReference` remains in the Controlled Product Data Generation manifest; custody does not publish a Generation or own product heads. |
| Transaction Coordinator | `ARCH-VIEW-MOD-001`, `MOD-002` and `SEQ-002` constrain it to a named declared operation and a shared relational UoW. It has no generic CRUD, product-state or authorization authority. |
| Atomic authoritative outcome | `SEQ-002`, `SEQ-003`, `SEQ-004`, `DATA-VIEW-WS-001` and the interface/data narrative separate `AuthorizationDecision` from `OwnerCommandOutcome`; authoritative owner state/outcome, Audit Evidence and transactional outbox are recorded in one relational UoW. |
| Authorization provenance / TOCTOU | The client supplies session proof only. Server/IAM establishes `ActorContext`; Access Policy resolves IAM/project/group/role/version/scope facts; the owner applies business gates and requests commit-time revalidation. No client-supplied `ActorId` is trusted. |
| Core transfer and trust chain | `SEQ-001` records Store → Server → Workspace. Existing `SEC-001` now explicitly shows `WebView → Desktop → Workspace → CAD/Office`; the editor receives ordinary managed files only, never session/database/store credentials. |
| Reference condition | `STATE-003`, DOC-06 and DOC-08 show independent `LocalIntegrity × ServerFreshness` observations with `Unknown`; unknown/missing/out-of-date evidence cannot claim currentness or publishability. |
| Recovery | Existing `SEQ-011` enters Restricted Recovery Mode, invalidates restored sessions, requires independent security/change evidence and a named reconciliation/reopen decision; it makes no automatic security-reconciliation claim. |
| Release structure evidence | `SEQ-003`, `DATA-VIEW-CORE-001`, DOC-06 and DOC-08 express `ReleaseRecord → 0..* StructurePin`; Release Policy chooses which selected Structure Pins are required. No universal-structure assertion is made. |

## 3. Defects found and disposition during this audit

Two Mermaid message labels introduced during the correction used separators that Mermaid parsed as
syntax; they were rewritten without changing their intended architecture meaning before the final
30-view rendition. `SEC-001` was refactored for an explicit client-to-editor trust path and
`ACT-001` was corrected so action/resource and immutable authorization decision precede the owner
business-gate/outcome step. The final result in section 1, not an intermediate render, is the
controlled audit result.

## 4. Remaining work before PG4 consideration

This audit closes neither product verification nor qualified review. Before any PG4 disposition,
the project still needs the VVP-016 qualified architecture/security/HCD review and controlled-rendition
acceptance, together with the separately planned product, recovery, performance, security and
operational evidence. Any future change to a maintained view must repeat the exact-source/rendition
audit under a new evidence identity; it must not overwrite this record or its historical predecessors.
