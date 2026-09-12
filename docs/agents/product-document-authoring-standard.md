# IDEA Engineering Product and Research Authoring Standard

| Field | Value |
|---|---|
| Stable Document ID | `IE-STD-AUTH-001` |
| Document Class | `AGENT-GUIDE` / product-information authoring standard |
| Title | IDEA Engineering Product and Research Authoring Standard |
| Version | `0.2` |
| Status | `Draft` |
| Artifact Role | Repository-local authoring standard for controlled product information, research and decision records; not a Core Product Document |
| Product Normativity | `INFORMATIVE` — creates no IDEA product requirement and does not alter FTR, REQ or product behavior |
| Repository Process Authority | `NORMATIVE` — contributors/agents authoring in-scope records are required to follow this guide while its instruction state is effective |
| Repository Instruction State | `Effective` |
| Owner | Product Decision Authority; named owner `BLOCKED` until assigned |
| Author | Repository maintainers; named attribution `BLOCKED` |
| Reviewer | Product Decision Authority; review `NOT-RUN` |
| Acceptance Authority | Product Decision Authority; acceptance `NOT-RUN` |
| Applicable Baseline | Current IDEA Engineering repository baseline |
| Effective Date | Repository instruction effective 2026-09-12; product baseline: `NOT-APPLICABLE` until accepted |
| Classification | `INTERNAL` |
| Source / Upstream Trace | [standards register](../governance/standards-register.md), [product-definition rules](../product/definition/README.md), [CONTEXT.md](../../CONTEXT.md) |
| Downstream Trace | [AGENTS.md](../../AGENTS.md), controlled product documents, `IE-KNW-*`, research, ADRs, decision briefs and verification records |
| Change Record | Predecessor `IE-STD-AUTH-001@0.1`; governance cleanup 2026-09-12 separates product normativity from repository process authority and records effective instruction state |
| Supersedes / Superseded by | Supersedes `IE-STD-AUTH-001@0.1`; superseded by `NOT-APPLICABLE` |
| Review Trigger | Standards-register edition/applicability change, control-envelope change, or material document-class change |
| Retention Disposition | Retain while the repository governance baseline is active; supersede with an explicit change record |
| Evidence Status | `STANDARD-GUIDED`; no conformity or certification claim |

## 1. Purpose and authority

This guide is the repository-local authoring contract for controlled product information, admitted
research and decision records. It applies the project standards register to the information items
for which each source is relevant. Its document `Status` is `Draft`, while its `Repository
Instruction State` is `Effective`: contributors and agents must follow it for in-scope authoring.
That process state is not Product Decision Authority acceptance, does not make this a Core Product
Document, and does not change IDEA product scope, Feature/Spec/Tech decisions, architecture
semantics or gate state. Product Decision Authority review and acceptance remain `NOT-RUN`.

The [standards register](../governance/standards-register.md) is the authority for standard
identifiers, editions, project classifications and watch status. A citation is not a conformity
claim. Do not copy protected normative standard text into the repository.

## 2. Common information-item control

Every controlled or admitted product-facing item exposes the following fields as applicable. A
research item may use a tailored subset, but it must state the tailoring and must not silently omit
control information.

| Control field | Authoring rule |
|---|---|
| Stable ID | Identity is independent of path, title and Git commit. Never reuse an ID for a different item. |
| Document type/class and title | State one class and a human-readable title; a title is not identity. |
| Version and status | Use a content version and a separate status (`Draft`, `Proposed`, `Approved`, `Superseded`, `Retired`). |
| Product normativity | State `NORMATIVE` or `INFORMATIVE` for product behavior; research and `IE-KNW-*` artifacts are `INFORMATIVE`. Repository process authority is a separate field. |
| Repository process authority / instruction state | For a repository guide, state whether the process instruction is `NORMATIVE` and whether it is `Effective`; this does not imply product-document approval. Use `NOT-APPLICABLE` for non-instructional artifacts. |
| Owner, author, reviewer, acceptance authority | Name the accountable role/person or record `UNKNOWN`/`BLOCKED`; include the authority basis where applicable. |
| Product/baseline applicability | Pin the product, increment, policy, evidence date or gate baseline. |
| Effective/evidence date | Use an exact date/time or `NOT-APPLICABLE`; do not imply an unapproved effective date. |
| Classification and retention | State repository/data classification and retention disposition. |
| Source/upstream trace | Link needs, evidence, predecessor decisions or source records using stable IDs where available. |
| Downstream trace | Link requirements, architecture, data contracts, UI, changes, verification and release records that consume the item. |
| Change record | Record the Work Item/`CHG`, predecessor version/SHA and impact disposition. |
| Supersession | State `Supersedes` and `Superseded by`, or `NOT-APPLICABLE`. |
| Review trigger | Identify the event that requires re-review. |
| Evidence status | For factual claims, record evidence class/status and limitations. |

Use `UNKNOWN`, `BLOCKED`, `NOT-RUN` and `NOT-APPLICABLE` explicitly. They are controlled outcomes,
not invitations to invent values. Before an item becomes `Proposed` or `Approved`, every required
`UNKNOWN` or `BLOCKED` field needs an owner, resolution action and review trigger.

## 3. Standards use and project tailoring

The following mappings are the current project interpretation of the baselined register. They are
`STANDARD-GUIDED` or use the classification shown by the register; they do not assert conformity.

| Register ID | Standard edition | Register classification | Project use and tailoring |
|---|---|---|---|
| `STD-INFO-001` | ISO/IEC/IEEE 15289:2019 | `STANDARD-GUIDED` | Information-item structure, identity, ownership, status, traceability and controlled-document discipline; tailor fields to the artifact class. |
| `STD-REQ-001` | ISO/IEC/IEEE 29148:2018 | `STANDARD` | Stakeholder needs and software requirements; use one independently verifiable obligation per `REQ-*`. |
| `STD-ARC-001` | ISO/IEC/IEEE 42010:2022 | `STANDARD` | Architecture entity of interest, stakeholders, concerns, viewpoints, views, models, rationale and trade-offs. |
| `STD-QUAL-001` | ISO/IEC 25010:2023 | `STANDARD` | Product-quality concern coverage; do not call a quality characteristic satisfied without an explicit measure and evidence. |
| `STD-QUAL-002` | ISO/IEC 25030:2019 | `STANDARD` | Convert quality needs into measurable quality requirements and evaluation evidence. |
| `STD-TEST-001…004` | ISO/IEC/IEEE 29119-1:2022, -2:2021, -3:2021, -4:2021 | `STANDARD-GUIDED` | Verification vocabulary, process, test information items and test-design techniques; combine records only when identity, configuration, ownership and result remain clear. |
| `STD-CM-001` | ISO 10007:2017 | `STANDARD-GUIDED` | Configuration identification, baseline, change control, status accounting and audit; the 2026 draft edition is watch-only. |

If the standards register changes an edition or applicability, record the difference and impact;
do not silently update a document's claimed baseline. Use the exact identifier, edition/year,
project classification, applicability and local tailoring in the document's standards section.

## 4. Requirement-writing rule (`DOC-04`)

One requirement ID is one independently verifiable obligation. Prefer:

`<condition> the system SHALL <observable behavior> <object/scope> <measurable constraint>.`

Every requirement records its stable `REQ-*` ID, source/need trace, rationale, priority and
applicability, acceptance criterion, verification method and upstream/downstream trace.

Avoid vague adjectives (`fast`, `easy`, `flexible`, `user-friendly`, `secure`, `robust`) without a
measure; `and/or`; unrelated obligations joined into one sentence; unapproved implementation
choices; architecture decisions copied into requirements; and obligations that cannot be tested.
Normative language belongs in normative documents. Research, evidence, architecture rationale and
decision briefs must not accidentally create obligations through `SHALL` or `MUST`.

## 5. Architecture-writing rule (`DOC-05` and architecture records)

Distinguish the system/entity of interest, stakeholders, concerns, viewpoints, views, model/model
kind, architectural decision, rationale, trade-off, interface/ownership boundary, requirement
trace and verification/risk implication. Architecture answers **how an approved requirement is
realized and who owns the decision/state**; it does not duplicate the SRS or silently create a new
product obligation.

## 6. Data and interface-writing rule (`DOC-06`)

For each data/interface contract state identity, owner, authoritative state, immutable versus
mutable data, cardinality, invariant, validation, transaction boundary, concurrency expectation,
failure/refusal outcome, idempotency/retry, reconciliation/recovery, security/authorization
boundary and requirement trace. A contract may refine an approved obligation, but it does not
introduce a new product obligation without a new approved `REQ-*` identity.

## 7. Evidence and research-writing rule

`IE-KNW-*` and research artifacts are `INFORMATIVE`. Keep this chain visible:

`Source → Evidence Claim → Capability/Observation → IDEA Interpretation → Product Decision`

Each claim records a claim ID where available, source ID, publisher/source authority,
publication/version context, accessed date, directly documented/observed fact, evidence strength,
temporal applicability, limitation and any inference. Silence means `UNKNOWN`, not absence.
Competitor behavior is evidence for comparison, never an IDEA requirement by itself.

## 8. Decision-writing rule

ADR and product-decision records separate `Context`, `Decision`, `Alternatives considered`,
`Rationale`, `Consequences`, `Risks`, requirement/architecture trace, verification impact and
supersession rule. A research paragraph, matrix cell or diagram is not a hidden product decision.

## 9. Verification-writing rule

Every verification item separates objective, preconditions, configuration/baseline, test data,
method/procedure, expected result/oracle, evidence to retain, actual result and disposition.
`PASS`, `FAIL`, `BLOCKED` and `NOT-RUN` are outcomes. A plan or intended test is never `PASS`.

## 10. Language, terminology and style

Controlled technical source documents use English unless their artifact class explicitly calls for
Vietnamese management-facing prose. Use Vietnamese for boss-facing Feature/Spec/Tech decision
briefs under their existing convention.

Use one controlled IDEA term for one concept, define an acronym on first use, write one concept per
paragraph, use active voice where ownership matters, and distinguish fact, inference,
recommendation and decision. Avoid marketing language and unsupported claims such as “clearly”,
“obviously”, “robust”, “powerful” or “best practice”. Do not change IDEA terminology merely to
match a reference product.

## 11. Author self-check

Before review, confirm the item has a stable identity and control envelope, correct normativity,
current baseline and standards tailoring, complete typed traces, explicit unknown/block states,
separate evidence from interpretation/decision, verifiable obligations where normative, and no
scope/architecture/technology decision hidden in prose. Run the applicable document/link validator
and record checks that are `PASS`, `FAIL`, `BLOCKED` or `NOT-RUN`. For the DDM matrix, the focused
validator is:

```powershell
pwsh -NoProfile -File scripts/validate-ddm-capability-matrix.ps1
```

This guide is a repository authoring standard, not a ninth Core Product Document and not evidence
that any product gate or standards conformity claim has been achieved.
