# Canonical Record Contract

## Authority order

1. Validated managed block plus its provider revision controls current state.
2. Immutable operation/evidence comments control historical receipts and duplicate recognition.
3. Azure Work Item relations connect queue, candidate, and PR records.
4. Adapter-owned tags and titles support discovery only.
5. Local `.workspace/` files are disposable mirrors and have no authority over provider state.

When a lower layer disagrees with a higher layer, the adapter reports the mismatch and follows the
higher layer. It never repairs ambiguity by guessing.

## Description markers

The literal marker text is:

```text
AGENT-WORKSPACE:COORDINATION-STATE:V1:BEGIN
AGENT-WORKSPACE:COORDINATION-STATE:V1:END

AGENT-WORKSPACE:CHANGE-SCOPE:V1:BEGIN
AGENT-WORKSPACE:CHANGE-SCOPE:V1:END

AGENT-WORKSPACE:QUEUE-MANIFEST:V1:BEGIN
AGENT-WORKSPACE:QUEUE-MANIFEST:V1:END
```

Each pair surrounds exactly one `<pre>` containing HTML-escaped canonical JSON. Markers are visible
text rather than HTML comments. Parsers reject duplicate, nested, reversed, mixed-version, or
partially present markers. The replacement algorithm changes only the bytes from BEGIN through END
for its block and preserves all other Description content.

Canonical JSON uses UTF-8, lexicographically ordered object keys, no insignificant whitespace for
hashing, normalized ISO-8601 UTC timestamps, sorted/deduplicated semantic-set arrays, and preserved
sequence order for queue entries. `payloadHash` is SHA-256 of canonical JSON input, prefixed
`sha256:`.

## Coordination State

Required top-level fields:

| Field | Rule |
|---|---|
| `schema` | exactly `agent-workspace/coordination-state` |
| `version` | integer `1` |
| `workItemId` | equals containing Work Item ID |
| `claim` | one valid claim or `null` |
| `run` | one current run reference or `null` |
| `lastAppliedOperation` | latest applied operation receipt header or `null` |
| `pendingPublication` | one publication outbox entry or `null` |

Current claim/run invariants are defined in [`data-model.md`](../data-model.md). Unknown fields are
rejected in V1 so a newer writer cannot be silently downgraded by an older adapter.

## Change Scope

Required fields are `schema`, `version`, `paths`, `semanticSeams`, `prerequisites`, and
`integrationTarget`. `paths` is a non-empty normalized set of paths/patterns; `semanticSeams` is a
normalized set that may be empty when no semantic seam is known; prerequisites are unique decimal
Work Item IDs; target is a fully qualified `refs/heads/...` ref matching provider configuration.

## Immutable operation receipt comment

Every state transition comment starts with:

```text
AGENT-WORKSPACE:OPERATION-RECEIPT:V1 <operation-id>
```

and contains one fenced JSON object with:

- schema/version, operation ID, operation kind, normalized payload hash;
- Work Item, run, actor, provider revision, occurred/published timestamps;
- disposition and domain outcome;
- relevant claim/checkpoint/handoff/PR/policy/queue/evidence references;
- classified blocker and next action when not successful.

The adapter treats comments with malformed payload, mismatched marker/operation ID, wrong Work Item,
or mismatched hash as corrupt evidence and fails closed. It never edits or deletes a receipt.

## Pending-publication protocol

`pendingPublication` contains the complete redacted receipt payload and an optional publisher lease:

```json
{
  "receipt": {
    "operationId": "op-uuid",
    "kind": "checkpoint",
    "payloadHash": "sha256:...",
    "outcome": "applied",
    "actor": "identity-id",
    "occurredAt": "2026-08-14T00:00:00.000Z"
  },
  "publisher": {
    "publisherId": "process-uuid",
    "leaseExpiresAt": "2026-08-14T00:01:00.000Z"
  }
}
```

- Publication lease duration is 60 seconds and uses an injected clock in tests.
- Lease acquisition/renewal/clear is revision-guarded.
- A holder searches all matching comments immediately before append.
- Another holder may take over only after expiry, then searches before append.
- A new domain mutation first drains any pending publication; it cannot overwrite it.
- Clearing pending state retains `lastAppliedOperation`.

This protocol provides crash recovery without claiming a transaction across Azure's Work Item and
comment APIs.

## Queue coordination Work Item

### Identity and discovery

- `queueKey = sha256(canonicalOrganizationUrl + "\n" + projectId + "\n" + repositoryId + "\n" + targetRef)`.
- Adapter-owned title: `Agent Workspace Integration Queue - <repository>/<target>`.
- Discovery tag: `agent-workspace:integration-queue` plus a non-secret queue-key tag/field where
  supported.
- The Queue Manifest's exact key/IDs/ref, not title/tag, establish identity.
- Zero valid matches permits bootstrap create; one is reused; multiple valid matches stop with an
  explicit administrator remediation report.

### Active manifest

The manifest contains only active entries (`queued`, `blocked`, `preparing`, `incorporating`), a
monotonic `nextEnqueueSequence`, one optional integration lease, last operation, and pending
publication. Completed/rejected entries are forbidden.

Enqueue is idempotent by operation ID and by the tuple `(candidateWorkItemId, runId)`. New entries
receive the current `nextEnqueueSequence`, then increment it in the same revision-guarded PATCH.

### Stale-revision retry bound

`MAX_STALE_REREADS` is exactly `4` per stable queue operation identity. An operation performs at
most one initial conditional mutation plus four reread/re-evaluate retries (five attempts total).
After each stale response it must reread canonical state and retry only while the original
preconditions remain valid. A durable matching receipt returns `duplicate`; a changed precondition
or exhaustion of the fourth reread returns an explicit `conflict`. A retry never receives a new
operation ID and never uses last-write-wins.

### Candidate selection and lease

- Eligibility requires every prerequisite to have durable integrated evidence and every semantic
  overlap to have a dependency or recorded serialization/human decision.
- Select the eligible entry with the lowest enqueue sequence.
- Acquire one integration lease in the same PATCH that moves it to `preparing` and records the
  current target commit.
- Default integration lease is 300 seconds and is renewable under the same operation family while
  local verification/policy evaluation is active.
- A non-expired lease prevents another candidate from beginning.
- If target commit, PR source commit, policy snapshot, owner, or required evidence changes, release
  the attempt to a visible queued/blocked state and require re-evaluation.

### Finalization

One revision-guarded PATCH removes the active entry, clears the integration lease, and installs a
pending Queue Completion Summary. Publication uses the same outbox protocol. The completion comment
marker is:

```text
AGENT-WORKSPACE:QUEUE-COMPLETION:V1 <operation-id>
```

Its payload is compact and links to the candidate Work Item's full Run Evidence. A final candidate
is not reinserted from a stale local mirror.

## GitHub coordination Issue

GitHub derives `queueKey = sha256("github\\n" + canonicalRepositoryId + "\\n" + targetRef)`, where
`canonicalRepositoryId` is the immutable GitHub REST Repository numeric ID serialized as decimal,
then maps that identity to one coordination Issue. It is discoverable only through the exact label
pair `agent-workspace:integration-queue` and
`agent-workspace:queue-key:sha256:<lowercase-hex>`. The title and editable body assist discovery
and humans but are never canonical state. The Issue's recognized immutable queue proposal and
resolution-receipt comments are the sole source for queue sequence, active entries, lease, and
completion summaries.

The revision projection includes only the exact label pair, normalized to lowercase and sorted
lexicographically. A missing, duplicate, malformed, or queue-key-mismatched pair blocks discovery.
Unknown labels and ordinary human comments are excluded from authority and cannot alter queue state.
After local cache loss, recovery rereads the recognized comment stream and uses the same
append-reread-reconcile winner rules as a candidate Issue. GitHub provider preparation remains
read-only `not-applicable`; it never creates a coordination Issue as bootstrap side effect. The
first normal enqueue may create the deterministic Issue/label pair, append its queue proposal, and
reread discovery; a concurrent duplicate create blocks for administrator remediation rather than
choosing an arbitrary record.

## Recovery contract

With `.workspace/` absent, recovery must:

1. resolve target and queue key from non-secret provider configuration;
2. find exactly one valid queue coordination Work Item;
3. parse/reconcile its active manifest and pending publication;
4. follow candidate Work Item relations and validate their Coordination/Change Scope blocks;
5. read immutable completion summaries and candidate Run Evidence;
6. rebuild disposable local indexes atomically.

Recovery never creates, closes, merges, or deletes provider artifacts and never performs a new
domain transition. Its sole provider mutation exception is reconciling an already-recorded
`pendingPublication`: conditionally acquire/renew its publisher lease, append the exact missing
immutable receipt only after marker lookup, and clear that pending field under the normal revision
protocol. Every such repair is reported. Corruption, ambiguity, or unobservable records produce a
classified blocked result with manual repair guidance.

## Retention and deletion

The adapter publishes immutable comments and cannot promise a 30-day deletion deadline. Provider
retention is reported as observed/company-governed. Local mirrors may be removed according to local
policy, but their deletion does not delete Azure records. Live-test cleanup applies only to
artifacts created and tagged by that Validation Run; ordinary Run Evidence is not automatically
deleted.
