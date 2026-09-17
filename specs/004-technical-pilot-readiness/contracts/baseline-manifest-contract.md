# Contract: Baseline Manifest

## Required header

| Field | Required rule |
|---|---|
| Manifest ID/version | Stable and unique within the increment. |
| Prepared/reviewed | Author date plus reviewer/date when reviewed. |
| Status | `Draft`, `Reviewed`, `Superseded` or another controlled repository state. |
| Repository baseline | Exact Git commit for every grouped source set. |

## Entry schema

Each primary entry must contain:

```text
axis
stable_document_id
version
repository_path
git_commit
sha256
authority_record
disposition
evidence_link
```

Supporting sources may use the exact Git commit as their content pin when the authority record did
not publish a separate SHA-256, but the omission must be explicit.

## Consistency rules

1. Approval is attached to exact content and never inherited by a successor version.
2. A hash identifies content; it does not prove a human decision.
3. Approved predecessor and Draft successor entries must appear in separate sections.
4. Discrepancies between status prose, version history, approval records and planning references are
   listed, not normalized silently.
5. A changed primary source invalidates the manifest check until impact and disposition are recorded.

## Review outcome

Manifest review records `PASS`, `FAIL`, `BLOCKED` or `NOT-RUN`, the exact manifest hash, reviewer and
date. `PASS` means the source identity is reproducible; it does not approve the sources.
