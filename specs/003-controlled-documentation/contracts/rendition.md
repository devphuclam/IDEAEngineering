# Contract: DOCX and PDF Renditions

## Purpose

Renditions make the controlled documentation readable and shareable without creating a second
editable authority. Markdown remains the source unless a separately approved information-item
format says otherwise.

## Required rendition metadata

Every DOCX or PDF rendition records:

| Field | Requirement |
|---|---|
| Rendition ID | Stable identity for this generated representation |
| Source document ID | Stable ID of the controlled document instance |
| Source document version | Exact `major.minor` version used to generate the rendition |
| Source baseline | Immutable baseline/commit or controlled package identifier |
| Rendition date | Generation timestamp |
| Rendition status | `Current`, `Stale`, `Superseded` or `Withdrawn`, with rationale where not current |
| Producer/tool identity | Tool and version when material to reproducibility |
| Access classification | Same or stricter handling than the source |
| Retention rule | Applicable retention/hold instruction |
| Trace links | Source, gate decision, change record and release references as applicable |

## State rules

1. A rendition starts as `Current` only when it is generated from the identified source baseline.
2. A source version change makes the previous rendition `Stale` until a new rendition is produced.
3. A deliberate replacement makes the old rendition `Superseded`; withdrawal records the reason and
   handling action.
4. A rendition cannot be edited into authority or used to approve a different source baseline.
5. Comments or approvals against a stale rendition are redirected to the authoritative source and
   recorded as a change/review action where applicable.

## Verification checks

- Compare source document ID and version embedded in the rendition with the source baseline.
- Confirm the rendition is distinguishable from a current source without opening repository history.
- Confirm no restricted evidence, licensed normative text or competitor implementation material was
  copied into the rendition.
- Confirm the rendition's classification and retention handling are not weaker than its source.
