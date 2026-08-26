# GitHub Compatibility Adapter Contract

## Purpose

GitHub remains a supported Platform Adapter while Azure DevOps is added. It implements the same
provider-neutral revision, mutation, queue, policy, evidence, and source-host ports without
importing Azure DTOs or pretending that GitHub comments provide an atomic compare-and-set write.

## Opaque revision projection

The adapter derives `ProviderRevision` as a deterministic SHA-256 hash of canonical JSON containing:

- the Issue number, state, exact recognized provider-owned labels, and canonical managed state;
- recognized immutable proposal and operation-receipt comment IDs in provider order;
- each recognized comment's schema version, operation ID, kind, and normalized payload hash; and
- any provider object identity or head SHA that is a precondition of the current operation.

The recognized-label projection is deliberately closed: it contains only
`agent-workspace:integration-queue` and exactly one
`agent-workspace:queue-key:sha256:<lowercase-hex>` when the Issue is a queue coordination Issue;
the labels are normalized to lowercase and sorted lexicographically before hashing. All other
labels, including unknown `agent-workspace:` labels, are excluded from authority and surfaced only
as diagnostics. A missing, duplicate, malformed, or queue-key-mismatched recognized label makes a
coordination Issue corrupt and fails closed. Unrecognized human comments do not become machine
authority. Malformed recognized markers fail closed rather than being omitted. Domain code treats
the resulting hash as opaque.

## Canonical queue, preparation, and runtime compatibility

For each GitHub Repository and fully qualified target ref,
`queueKey = sha256("github\\n" + canonicalRepositoryId + "\\n" + targetRef)` identifies one
coordination Issue. `canonicalRepositoryId` is the immutable GitHub REST Repository numeric ID
serialized as decimal, not an owner/name string. Discovery uses the two exact recognized queue
labels above, then validates the Issue's canonical immutable proposal/receipt stream. The current
queue manifest, sequence allocation,
lease, active-entry compaction, and completion history are deterministic projections of recognized
queue proposal and resolution-receipt comments; an editable Issue body, title, arbitrary label, or
local cache is never authoritative.

`CanonicalQueueStore.enqueue()` may create the initial coordination Issue as part of the normal
queue mutation (never as provider preparation): it creates only the deterministic title and exact
label pair, appends the normal queue proposal, and immediately rereads discovery. Zero valid Issues
before the mutation or exactly one after reconciliation is valid; multiple valid Issues, including
a create race, fail closed with administrator remediation rather than selecting an arbitrary Issue.
Every stale queue operation uses the shared `MAX_STALE_REREADS = 4` limit in
[`canonical-records.md`](canonical-records.md): one initial operation plus at most four
reread/re-evaluate attempts, then an explicit conflict.

GitHub implements `CanonicalQueueStore` through that coordination Issue. It implements
`ProviderPreparationAdapter.preview()` and `.readiness()` as read-only compatibility reports and
returns `not-applicable` for `.apply()` without creating or modifying a coordination Issue. The
shared `RuntimeReadinessAdapter` is selected independently of the provider, so GitHub and Azure
produce the same `not-selected` / `local-agent-v1` runtime outcomes.

## Append-reread-reconcile mutation protocol

Every proposal comment starts with:

```text
AGENT-WORKSPACE:GITHUB-PROPOSAL:V1 <operation-id>
```

Its redacted canonical payload includes expected revision, operation ID, operation kind, payload
hash, actor, requested time, target Work Item/queue key, and original domain preconditions.

The adapter MUST:

1. reread canonical Issue state and all recognized proposal/receipt comments;
2. return `duplicate` only for the same operation ID and payload hash with an authoritative receipt;
3. reject operation-ID reuse with a different payload hash;
4. validate expected revision and domain preconditions;
5. append one immutable proposal when no matching proposal exists;
6. reread the complete recognized stream;
7. discard proposals whose original expected revision or domain preconditions no longer hold;
8. choose the earliest provider comment ID among valid competing proposals, using operation ID only
   as a deterministic tie-breaker; and
9. append or find one immutable resolution receipt for the winning proposal, then reread and return
   `applied` only if that proposal remains the authoritative winner.

The resolution marker is:

```text
AGENT-WORKSPACE:OPERATION-RECEIPT:V1 <operation-id>
```

A losing proposal remains immutable historical evidence and returns `conflict`. It never grants a
claim, Agent Run, sandbox, queue lease, or integration authority. If concurrent resolution receipts
exist because of delayed visibility, the same deterministic winner projection controls and every
non-winning receipt is non-authoritative history.

Same-process writes are serialized by canonical Issue or queue key to reduce avoidable races, but
the append-reread-reconcile projection is the cross-process correctness boundary.

## Policy inventory

`PolicyAdapter.inspectTarget()` MUST read:

1. all active effective rules for the exact target branch, including repository- and
   organization-level Rulesets;
2. applicable classic branch protection for compatibility; and
3. enough repository/branch identity to prove both inventories apply to the selected target.

If an inventory request is unavailable or forbidden, it may be treated as inapplicable only when a
separate provider capability response proves that source cannot apply. Otherwise the inventory is
incomplete and the normalized outcome is `unavailable`. Rulesets in evaluate/disabled mode are not
invented as blocking active rules.

## Pull-request policy evaluation

`PolicyAdapter.evaluatePullRequest()` evaluates the exact pull request head SHA and target branch.
The snapshot contains:

- active effective branch rules and classic protection requirements;
- pull-request state, draft state, requested changes, required approving reviews, code-owner or
  conversation-resolution requirements when effective;
- check runs on the exact head SHA, including conclusion and source application;
- commit statuses on the exact head SHA, including context and state; and
- completeness and observation time for every inventory/result source.

Required check runs and commit statuses are not collapsed merely because they share a display name.
The adapter preserves the provider-required context and application/source identity. A missing,
queued, in-progress, pending, failed, errored, cancelled, timed-out, action-required, stale-head,
unknown, or unreadable required result cannot pass. Only conclusions GitHub treats as satisfying
the effective requirement normalize to `passed`.

The template value `minimum_human_approvals: 0` adds no approval requirement. It does not weaken an
effective GitHub approval requirement, and author self-review counts only when GitHub's own policy
accepts it. Local verification remains a separate gate and never fills a provider requirement.

Immediately before merge, the Integration Coordinator rereads the target head and policy snapshot.
The adapter uses GitHub's ordinary merge operation without bypass; GitHub remains the final policy
enforcement boundary.

## Required compatibility tests

- simultaneous valid claim proposals produce exactly one authoritative winner;
- stale and losing proposals remain non-authoritative and create no sandbox;
- same operation/payload retries return one durable result;
- operation-ID reuse with a different payload fails closed;
- queue-label projection accepts only the exact two recognized labels, sorts them deterministically,
  and rejects malformed, duplicate, or mismatched queue identity while ignoring unknown labels;
- normal GitHub enqueue creates/reuses one coordination Issue safely, detects create-race duplicates,
  and reconstructs queue order, lease, and completion history after local cache loss; GitHub
  preparation reports `not-applicable` without mutation;
- organization/repository Rulesets and classic protection are both inventoried;
- stricter approval requirements override the template's zero-approval intent;
- required check runs and statuses are evaluated on the exact head SHA;
- missing/unreadable/pending/failing requirements never pass; and
- local verification and provider policy remain separate in output and evidence.

## Sources

- [Rules for a branch](https://docs.github.com/en/rest/repos/rules?apiVersion=2026-03-10)
- [Branch protection](https://docs.github.com/en/rest/branches/branch-protection)
- [Check runs](https://docs.github.com/en/rest/checks/runs)
- [Combined commit status](https://docs.github.com/en/rest/commits/statuses)
