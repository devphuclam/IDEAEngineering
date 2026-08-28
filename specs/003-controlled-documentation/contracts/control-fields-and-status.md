# Contract: Control Fields, Status and Versioning

## Required control envelope

Every one of the eight core-document and nine supporting-record templates must expose the following
fields. A field marked conditional is still required when the information item or gate makes it
applicable; otherwise the template records `NOT APPLICABLE` with rationale. The same envelope and
authored-content/instruction delimiter apply to indexed `DOC-02` feasibility instances and `DOC-07`
increment records; an index is a navigation aid, not a second authority.

| Field | Contract |
|---|---|
| Stable ID | Semantic unique ID; independent of class code, path, filename and Git commit |
| Class/type | One of eight core classes or nine supporting classes |
| Title | Human-readable title, not identity |
| Owner | Named accountable role/person and authority basis |
| Status | Controlled lifecycle status, never a gate outcome |
| Version | `major.minor` content version |
| Applicable baseline | Exact product, gate, increment or policy baseline |
| Effective date | Date/time the approved content becomes authoritative |
| Authors | Attributable preparation identities |
| Reviewers | Review identities and independence/competence note when applicable |
| Approvers | Attributable approval identities and authority basis |
| Source links | Upstream evidence, need, decision or governing artifact |
| Downstream links | Requirements, design, changes, verification and release references |
| Evidence/claim status | Required for research, pilot and capability claims |
| Change history | Prior versions and `CHG`/Work Item links |
| Access classification | Repository or approved-storage classification |
| Retention rule | Rule, hold or explicit `NOT APPLICABLE` |

For each indexed instance, `Stable ID`, `Class/type`, `Owner`, `Status`, `Version`, `Applicable
baseline`, first/later gate, source links, downstream links and change history are instance fields,
not properties inferred from the index row. An instance may link to its class template and index, but
the index cannot redefine its decision or roadmap content.

## Document status vocabulary

The allowed status values are:

| Status | Meaning | Exit/entry rule |
|---|---|---|
| `Draft` | Editable preparation | May move to `Proposed` only when required sections are complete or explicitly dispositioned |
| `Proposed` | Ready for review but not authoritative | Returns to `Draft` for material rework or moves to `Approved` after the required decision |
| `Approved` | Current authoritative content for its scope | A newer approved version may mark it `Superseded`; retirement requires retention/dependency checks |
| `Superseded` | Older approved content replaced by a newer baseline | May be retained for history; it must not be presented as current authority |
| `Retired` | No longer active after controlled retirement | Terminal for normal use; retention evidence remains |

The transition events, actor eligibility, decision evidence and effective baseline are recorded in
`CMP`, `CHG` and the applicable `Gate Decision`. There is no direct `Draft` → `Approved` shortcut
without the required review/approval evidence.

## Gate outcome vocabulary

Gate decisions use exactly one of:

- `PASS`
- `PASS-WITH-ACTIONS`
- `FAIL`
- `BLOCKED`

`PASS-WITH-ACTIONS` requires an owner, affected baseline, due condition or date, expiry and
escalation path for every action. A missing independent reviewer, required evidence or accountable
authority keeps the applicable gate `BLOCKED`; it cannot be disguised as a status transition.

## Standards classification and applicability

Every standards or policy source is classified using exactly one of:

- `STANDARD`
- `STANDARD-GUIDED`
- `STANDARD-GUIDED, CONDITIONAL`
- `REFERENCE/WATCH`
- `PROJECT-CONVENTION`

Its applicability record separately uses exactly one of `APPLY`, `TAILOR`, `NOT-APPLICABLE`, or
`BLOCKED`, with rationale, affected surface/baseline, owner, evidence expectation and review trigger.
Classification is not proof of conformity.

## Version, revision and generation distinction

| Concept | When it increases | Example boundary |
|---|---|---|
| Document Version | Minor for compatible content; major for an authority/contract change; first approved content is `1.0` | `DOC-08` template `0.2` → `0.3` for compatible guidance; `1.0` after approval |
| Product Generation | Only when changed Product Definition is successfully published within a Business Revision | A changed controlled file creates the next immutable Generation |
| Business Revision | When the Revision Policy creates a new business milestone from the applicable released baseline | `A` → `B` is not a document-template version increment |
| Git commit | Every repository snapshot that supplies immutable evidence | A commit can support a baseline but does not itself approve a document |

`Start` and `In Work` are workflow states of a Business Revision, not document statuses. A document
status must never be inferred from a product Generation, a save count, or a Git branch name.

## Placeholder and completeness rules

- Templates clearly delimit instructions/examples from authored product content.
- An approved baseline contains no unresolved prompt, sample value or blank required section.
- Genuine gaps use `UNKNOWN`, `BLOCKED`, `NOT APPLICABLE`, a conditional action or a deferred decision
  with owner and resolution path.
- A document's status, a gate outcome, a verification outcome and a pilot claim status are distinct
  fields and are reported separately.
