# ADR-0014 — Retain owner committed-event provenance independently of delivery

| Control | Value |
|---|---|
| Stable ID / class | `ADR-0014` / bounded architecture decision |
| Version / status | `0.1` / Accepted for the F04 design scope below |
| Product normativity | `INFORMATIVE` — realization of existing requirements, not a new Core SRS obligation |
| Repository instruction state | `NOT-APPLICABLE` |
| Owner / author | Principal Product Author / Codex |
| Reviewer / decision authority | Project Reviewer, Nguyễn Huỳnh Phúc Lâm, explicit decisions in this chat on 2026-10-02 |
| Baseline | `IE-INC-PH1-FOUNDATION-CUSTODY-001`; source `7a3ebd8b6ea9c5f70976ae400f712dd5fcba0d70` |
| Effective date / classification | 2026-10-02 / `INTERNAL` |
| Change / downstream trace | [Work Item #29](https://github.com/devphuclam/IDEAEngineering/issues/29); [spec v0.8](../../specs/005-ph1-foundation-custody/spec.md), [data model](../../specs/005-ph1-foundation-custody/data-model.md#f04-persistence-design), [plan](../../specs/005-ph1-foundation-custody/plan.md#f04-design-baseline), T023–T026 |
| Supersedes / superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Review trigger / retention | First real owner adopts the seam; contract/provenance/retention/access-policy change / retain with the applicable delivery baseline |
| Evidence | `DECISION-RECORDED`; implementation and qualification `NOT-RUN` |

## Context and authority

F04 qualifies the shared owner/Audit/transaction seam before F05, not a product command or
event-delivery system. `REQ-AUD-001/002` in [DOC-04](../product/instances/idea-engineering/DOC-04-software-requirements-specification.md),
the owner unit of work, `IF-COMMITTED-EVENT` and `ARCH-VIEW-SEQ-004` in
[DOC-05](../product/instances/idea-engineering/DOC-05-architecture-description.md), and Organization
ownership in [DOC-06](../product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md)
remain controlling. This decision refines their PH1 sample implementation; it changes no Core
document, gate, role permission or broader product authorization rule.

The Project Reviewer approved ENVELOPE-9, sample terminal-result semantics, and the narrowly
scoped result-access policy. Physical schema and lock choices below are Engineering realization
choices for T023–T026, not claims that the infrastructure has been executed or accepted.
Standards tailoring: `STD-INFO-001` (ISO/IEC/IEEE 15289:2019, STANDARD-GUIDED) supplies this control
record; `STD-ARC-001` (ISO/IEC/IEEE 42010:2022, STANDARD) supplies concern/decision/alternative
trace; `STD-TEST-001…004` supplies planned verification trace. No conformity claim.

## Decision: ENVELOPE-9

| Logical field | Retained meaning |
|---|---|
| `event_id` | Stable event identity, independently generated; a different concept from OperationId. |
| `operation_id` | Original owner operation; multiple events per operation remain possible for later owners. |
| `producer_owner` | Stable logical owner machine code, not a class, package, bean, host, process or display name. |
| `organization_id` | Authoritative Operating Organization snapshot at commit; direct FK, non-destructive deletion behavior. |
| `event_kind` | Stable kind within that producer's namespace. |
| `contract_version` | Positive semantic event-contract version, not schema, application or business-state version. |
| `actor_id` | Original Server-established stable Actor; direct FK, non-destructive deletion behavior. |
| `correlation_id` | Original correlation shared with the owner result and required Audit; retries retain it. |
| `recorded_at` | Event retention time, not a global commit sequence. |

The F04 producer is **`PH1_SAMPLE_OWNER`**, matching the existing PH1 sample authoritative owner
vocabulary. Its ACCEPTED kind is **`OPERATION_ACCEPTED`**, contract version **`1`**. This means only
that the sample operation was accepted and committed with its retained event. It promises no
publication, projection, notification, consumer receipt or external integration.

The envelope is immutable. Ordinary app authority is SELECT/INSERT, never UPDATE/DELETE/TRUNCATE;
use database privileges and an append-only mutation guard following the existing Audit pattern.
Audit and event retention are distinct policies; future delivery bookkeeping is separate from
historical content. No payload, delivery state or generic source-pin model is part of F04.

Logical event meaning remains owned by the producer. The planned common `CommittedEventStore`
is only a connection-scoped append boundary; it cannot decide owner results, read sample tables,
commit independently or depend on the sample service. The physical store has no FK to
`sample_owner_operation`, generic operation table or producer registry. Direct Actor/Organization
FKs enforce globally authoritative identities; domain-specific source relationships remain with
future owners' typed contracts.

## Bounded sample outcome and access

Use existing `sample_owner_operation` as the synthetic authoritative result; create no mutable
content entity. ACCEPTED result + required Audit + envelope share one PostgreSQL commit/rollback.
Committed business REFUSED is terminal for that sample OperationId, with its refusal Audit in
the refusal-evidence transaction and **no** F04 event. Changed conditions require a new operation
for a genuine new attempt. These are sample semantics, not a universal future domain rule.

Confirmed technical rollback leaves no successful result or accepted event; retain attributable
qualification failure/rollback evidence, not an invented durable FAILED owner result. Unknown
commit outcome is neither confirmed rollback nor a new operation; classify it separately, without
importing F05 reconciliation machinery.

Result access is a separate **sample-owner query policy**: current Server-established Actor,
current Account/session eligibility and the originating stable ActorId are required. Fresh valid
sessions of that Actor are allowed. Another Actor, even in the same Organization, receives a
bounded non-disclosing refusal without the original outcome/details, mutation, re-execution or
duplicate original Audit/event. Invalid proof cannot obtain a result through idempotent replay.
No HTTP status taxonomy is chosen because F04 exposes no HTTP/product/Swagger command.

This rule is not a common store constraint or universal operation-service rule. Future owner
queries may authorize other Actors/system principals for governed administration or status work.
Original Actor provenance stays immutable regardless of the authorized reader. Separately
governed access-attempt Audit remains possible later; it is not a duplicate owner-outcome Audit.

## Engineering duplicate/concurrency realization

Keep the sample's existing OperationId primary key. Serialize sample resolve/create on a bounded
PostgreSQL advisory lock for that sample operation, including a rollback → refusal-evidence
handoff. Retain it until the final result is committed or the attempt exits; release explicitly
before returning its connection. The same-ID loser resolves the winner, never appends companions.
Acquire the existing IAM security-write transaction lock only after the sample-operation lock;
revalidate current session/Account immediately before the final owner commit and retain that
security lock through commit. No new general coordinator or lock framework is required.

As a second guard, propose a partial unique event index on `(organization_id, operation_id)`
**only where** producer=`PH1_SAMPLE_OWNER` and kind=`OPERATION_ACCEPTED`. Exclude contract version
from that uniqueness key: a successor contract cannot turn replay into another accepted event.
The common store has no global `UNIQUE(operation_id)` or global one-kind-per-operation rule.
The owner lock and result transaction, not this index alone, prevent duplicate Audit and arbitrate
concurrent ACCEPTED/REFUSED. After any rollback, recheck committed state under the retained
operation lock before recording a business refusal. Technical failures do not enter that path.

## Alternatives and evolution cost

| Option | Cost now | Next real owner / compatibility cost | Coupling and replacement risk | Additive later |
|---|---|---|---|---|
| MINIMAL: operation-only sample outbox | Few columns and sample-specific append | Add/backfill event identity, owner/version/Org/provenance after data exists; old meaning may be unrecoverable | Sample FK and one-operation-one-event shortcut require semantic replacement | Delivery could be added, but on a weak historical contract |
| FOUNDATION ENVELOPE (selected) | Nine fields, identity FKs, append protection, bounded sample guard and connection-scoped append | Next owner supplies its own stable namespace/typed contract; existing envelope stays readable | No sample-table dependency; provenance/access/delivery remain separate | Typed domain content, owner query policy and separate delivery bookkeeping |
| FULL FOUNDATION | Payload/source-pin/registry/dispatch/coordinator APIs and schema now | Unknown domain contracts cause later migrations and may require replacing premature generic semantics | No second demonstrated owner/consumer; speculative cross-module coupling | Builds capabilities without current acceptance authority |

### Decision classification

| Element | Classification / disposition |
|---|---|
| EventId versus OperationId; contract version; original Actor/Org/correlation | HARD-TO-CHANGE FOUNDATION — establish now; no retry-time rewrite. |
| Producer ownership; caller-owned transaction; immutable content versus delivery | HARD-TO-CHANGE FOUNDATION — establish now; logical contract independent of physical store. |
| Sample FK/common lookup, global event cardinality, sample-only reader rule in generic infrastructure | THROWAWAY COUPLING — rejected. |
| Dispatcher, separate delivery state, broker integration | ADDITIVE LATER — defer; preserve event identity/content. |
| Document/Lifecycle/Structure/Custody payload/source pins, authorized result readers | DOMAIN-SPECIFIC — governed by the next owner's requirements, not this sample. |
| Generic registry, canonical payload/fingerprint, routing/ordering/multi-owner protocol | PREMATURE ABSTRACTION — defer until authority and demonstrated consumers exist. |

## Verification and limits

T023–T026 qualify real PostgreSQL atomicity, immutable provenance, privilege/FK guards, same-ID
concurrency and IAM disable/revoke ordering. They also insert a separately named synthetic
non-F04 producer fixture with multiple events under one operation to prove the common schema
has no F04 cardinality leak; this is a schema seam check, not real multi-owner qualification.
See [test contract](../../specs/005-ph1-foundation-custody/contracts/ph1-boundaries.md#f04-internal-qualification-contract).
All runtime results remain NOT-RUN. A reusable engineering foundation is the intent, not a
production/security/commercial/dispatcher/HA claim. Reopening the accepted sample access decision
requires a direct governing-authority conflict, not a preferred implementation shortcut.
