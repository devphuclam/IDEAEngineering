# PH1 Requirements Checklist: Foundation and Single-Vault Custody

**Purpose**: Reviewer checks whether the F01–F05 requirements are clear enough to implement
without changing the approved product baseline.
**Created**: 2026-09-28
**Feature**: [PH1 spec](../spec.md)

**Review Ownership**: This checklist belongs to the Project Reviewer. Mark `[x]` only after the
reviewer accepts that the **requirements wording** meets the criterion. It does not mean code or
runtime tests have passed. The built-in [requirements checklist](requirements.md) has a separate
Spec Kit lifecycle.

## Scope and authority

- [x] CHK001 Are F01–F05 and the one-Gateway/one-Vault limit stated consistently in the scope, stories, requirements and success criteria? [Consistency, Spec §Authority and Scope]
- [x] CHK002 Are multi-Vault implementation, Format Worker, production rollout and commercial readiness clearly outside PH1, while the Core v0 document flow remains explicitly scheduled for PH2–PH4 rather than implied to be cancelled or already delivered? [Boundary, Spec §Authority and Scope]
- [x] CHK003 Is each delivery requirement traceable to its governing source without presenting its local `FR-*` number as a new controlled product requirement? [Traceability, Spec §Governing-Source Trace]

## Identity, outcome and evidence

- [x] CHK004 Is the distinction between stable Actor, account/login and verified session clear enough to reject client-supplied identity? [Clarity, Spec FR-004–005]
- [x] CHK005 Are bootstrap, sign-out, disable and revocation outcomes specified for both valid and invalid session attempts? [Coverage, Spec §User Story 3]
- [x] CHK006 Are permitted, refused and failed owner-command outcomes defined separately from Audit Evidence, including the no-partial-success condition? [Consistency, Spec FR-006–007]

## Transfer and failure boundaries

- [x] CHK007 Is the control-plane/data-plane split explicit: Server grants and accepts metadata, while Client sends bytes to Gateway? [Clarity, Spec FR-008–009]
- [x] CHK008 Are a staged candidate, Gateway Receipt and accepted Artifact custody clearly distinguished from document Check-in/publication? [Clarity, Spec §User Story 5]
- [x] CHK009 Are wrong/expired Grant, size or digest mismatch, interruption, duplicate request and lost acknowledgement covered with an observable refusal or reconciliation outcome? [Coverage, Spec FR-011 and Edge Cases]
- [x] CHK010 Is the multi-Vault extension seam specified through separate Artifact, Vault, Location and private Adapter-path identities without claiming that a second Vault has been tested? [Boundary, Spec FR-010 and SC-006]

## Measurability and legal intake

- [x] CHK011 Are F01–F05 acceptance outcomes objectively checkable using the stated environment and synthetic 1 KiB/64 MiB fixtures, without adding a multi-GB or throughput claim? [Measurability, Spec SC-001–006]
- [x] CHK012 Is exact source/version/license intake required before first use, and is future commercial permission kept separate from internal-development evidence? [Completeness, Spec FR-012]

## Notes

- CHK012 accepted by the Project Reviewer on 2026-09-28. All 12 requirements-quality items are
  accepted. Exact dependency intake and implementation/test evidence remain pending execution;
  this review grants neither package-specific clearance nor commercial distribution permission.

- CHK011 accepted by the Project Reviewer on 2026-09-28, with the instruction that all previously
  accepted checklist content must be fulfilled in its applicable delivery scope. The worker handoff
  maps every checklist group to execution/review tasks and required evidence. Requirement acceptance
  does not imply completed code, nor activate features explicitly deferred outside PH1.

- CHK010 accepted by the Project Reviewer on 2026-09-28. The reviewer requested actionable
  implementation guidance for GPT 6 Luna; see [worker handoff](../worker-handoff.md).
  This accepts the extension-seam requirements, not implemented multi-Vault behavior.

- CHK009 accepted by the Project Reviewer on 2026-09-28, with the explicit instruction to deliver
  these behaviors. T028/T029 define the failure tests; T030–T033 implement the boundaries;
  T034 retains executed results and T035 reviews coverage. Approval of this item does not close
  those tasks or count an unexecuted scenario as PASS.

- Leave unresolved items unchecked and record the issue in a comment or change record.
- `$speckit-implement` reads checklist state; it must not edit these markers.
