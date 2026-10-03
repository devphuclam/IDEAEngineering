# F05 Preparation Decision and Exact-Byte Freeze Record

| Control field | Value |
|---|---|
| Stable record ID | `IE-CMP-F05-PREP-FREEZE-20261003` |
| Class / normativity | Configuration/decision receipt; product `INFORMATIVE` |
| Record version / status | `1.1 / Approved`; timezone metadata correction authorized by Project Reviewer |
| Owner / author | Project Reviewer / Codex |
| Reviewer / acceptance authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm, explicit project-conversation freeze instruction |
| Actual publication / freeze date | 2026-10-03, Asia/Ho_Chi_Minh; original date unchanged |
| Classification / retention | `INTERNAL`; retain with frozen package and successor history |
| Work Item / worker mode | [#35](https://github.com/devphuclam/IDEAEngineering/issues/35), PRE-T027 preparation / `CODEX_ONLY` |
| Package | [IE-RES-PH1-F05-GATEWAY-QUAL-001](2026-09-28-ph1-f05-gateway-qualification.md) |
| Canonical path / version | `docs/research/2026-09-28-ph1-f05-gateway-qualification.md` / `1.0` |
| Package disposition | `FROZEN / APPROVED PREPARATION BASELINE` |
| Package source commit | `87376bba753004f5a7fa5121b50b41bbe0179fd3` |
| Package Git blob | `72ecbbfbb2a73aee948d48a5b9ea95b1f10b9d52` |
| Exact committed content SHA-256 | `a14a58ce17549d39097ed192e0a6195cadc3ee820eae2b736743f26b13544cef` |
| Hash convention | All 25,598 committed file bytes, UTF-8 without BOM, LF; not rendered Markdown or CRLF worktree bytes |
| Governing repository inputs | `4e43bc58d94f7eae17346e02ba484e9d0fe4a678`; exact paths/versions in package §1 |
| Authority input | User-supplied `CODEX TASK — FREEZE F05 PREPARATION BASELINE`, project conversation, 2026-10-03 |
| Authority attachment checksum | SHA-256 `5cde1e0f29455619cdb7f3dc3bba1b8def615246b83d4a99468148ffe16e109f` of the original supplied text attachment; decision text retained below |
| Supersedes / superseded by | Unidentified-package wording only, not F04 acceptance/evidence / `NOT-APPLICABLE` |
| Review trigger | Frozen content, accepted direction, governing authority or future qualification profile changes |
| Evidence status | Exact-byte publication/decision receipt only; T027 runtime/transport/environment execution `NOT-RUN` |

## Human disposition retained

- Q1: Java Temurin25.0.4.1+1, Boot4.1.1, Maven3.9.16 and a separate Ubuntu Gateway JAR are
  **approved for T027 qualification**, not qualified. Windows Node24.19.0 is a test-harness
  candidate subject to exact F05 intake, not Desktop/Workspace acceptance.
- Q2: Ed25519 Grant/Receipt direction, separate signing purposes and pinned public keys approved.
  F05 uses a narrowly scoped **bearer Grant over qualified TLS**. Ephemeral client-key registration,
  request signatures/client nonce subsystem were evaluated and not selected. Actor provenance
  is not cryptographic presenter proof. No JWT/JOSE or new crypto dependency.
- Grant TTL, Receipt window and chunk/range size remain **T027 QUALIFICATION PARAMETERS**.
  Neither five minutes nor one MiB is frozen as product authority. Exact deterministic encoding
  and runtime/provider behavior remain to be qualified.
- Q3: isolated run-owned root/private staging/one test Vault/new separately authorized F05 DB
  and owned ports/tunnels are approved preparation. Ports18446/18447 are availability-checked
  execution parameters. TLS trust/certificates are qualified separately before connection.
- Q4: prepare exact-used F05 tooling intake. F03/F04 admissions/exceptions do not expand by
  assumption; missing artifact/hash/graph/rights/runtime blocks use. No Internet install/download.
- Create/commit/hash/freeze this package, repair current references, append historical correction,
  refine only T029/T031/T033 candidate paths, then run local read-only Spec Kit analyze.

The human decision came through the project conversation. No GitHub approval-review event is
claimed. This freeze binds the narrowed contents above, not every proposal in the preceding review.

## Publication mechanics and historical correction

The package was committed first. SHA-256 was computed by reading the committed Git blob as binary
bytes through `git cat-file blob`, not by hashing a shell-decoded text pipeline. This successor
record contains that earlier commit/hash; no record hashes its own future commit.

Read-only review at input4e43bc5 found three navigation references (quickstart, handoff, tasks)
and one F04 closure reference claiming an already frozen package without an identifiable
path/version/hash/freeze record. Available main/history/attached-worktree inspection did not find
such a package. The original wording cannot establish an earlier freeze. Actual first publication
and freeze are **2026-10-03**; the canonical filename's 2026-09-28 date is not an approval date.
F04's original §38 wording remains intact, with a truthful successor correction in §39.

PR #32 was independently read as MERGED, merge commit
`5e034cf0d107d49f5217a4150d410c19a2781917`; Issue #31 was CLOSED/COMPLETED.
Those F04 results establish ordering only, not F05 tooling or execution authorization.

## Downstream and stop boundary

Current quickstart/handoff/tasks reference this record plus the canonical package/version/hash.
T029/T031/T033 paths are candidate refinements only; there are no new files under apps/gateway
or tests/ph1/transfer-smoke. The separate analyze step reads spec/plan/data/contracts/tasks/package;
its report is returned for review, not inserted into this immutable package or used to auto-fix
unrelated findings.

T027 remains unchecked and `NOT-STARTED`; qualification is `NOT-RUN`. Gateway code and F05-A
timer are `NOT-STARTED`. Tracker and actual effort remain unchanged. No database, certificate,
tunnel, runtime process, migration, dependency or application/test code is created or changed.
This publication grants no implementation, execution, merge, production or commercial authority.

## Clerical successor and integration authority — 2026-10-03

The Project Reviewer disposition for PR #36 is **PASS WITH ONE CLERICAL FIX**. It authorizes
correcting the project timezone label to `Asia/Ho_Chi_Minh`, rebinding exact package bytes,
and then merge-commit integration / completed closure of Issue #35 without another review
round if technical decisions remain unchanged. This later integration authority supersedes
only the original publication's no-merge boundary, not its no-execution boundary.

| Freeze lineage | Exact identity / disposition |
|---|---|
| Original package publication, 2026-10-03 | Source `878f975f1a20bd8226fcfe760541fed0842ac538`; blob `e5f041e2ac8ea8384b2968a6f96af717c8da677a`; 25,594 bytes; SHA-256 `4973d522c6cd7e8f6d76205556f88691e3c7d105c8d0c6b4a99590454ec7105e` |
| Original freeze record | Version1.0 at `7a10b23ecc5871e3197cf2541d3f0ae1b4059d7b`; the prior timezone label was `Asia/Bangkok` |
| Corrected package metadata | Source `87376bba753004f5a7fa5121b50b41bbe0179fd3`; blob `72ecbbfbb2a73aee948d48a5b9ea95b1f10b9d52`; 25,598 bytes; SHA-256 `a14a58ce17549d39097ed192e0a6195cadc3ee820eae2b736743f26b13544cef` |

The package correction changes exactly one timezone label. Package content version1.0 and
all accepted decisions, technical contents, governing inputs and original publication/freeze
date remain unchanged. This receipt is version1.1 so the metadata correction is attributable;
the original bytes and record remain available at their exact historical commits. Nothing is
backdated. The corrected package was committed first and hashed as a binary Git blob before
this successor record was updated; no self-referential hash is created.

### Bounded pre-T027 follow-up

These read-only Spec Kit LOW findings do not invalidate the preparation baseline and do not
block PR #36. They must be reconciled **before T027 execution**, not silently waived:

| Finding | Owner / bounded action | Due condition / retained state |
|---|---|---|
| I1: stale F03/F04 current-status summaries (`spec.md:8`, `tasks.md:100–116`) | Codex aligns current summaries with accepted evidence/handoff; preserve all historical results and attribution | Before T027 execution; OPEN, not repaired in this clerical integration |
| C1: `plan.md` Constitution Check omits PrincipleVI | Codex adds the current worker-governance assessment without changing product/architecture authority | Before T027 execution; OPEN, not repaired in this clerical integration |

After integration, preparation remains FROZEN / APPROVED; T027 remains NOT-STARTED / NOT-RUN,
Gateway code and F05-A timer NOT-STARTED, and Tracker unchanged. No qualification, provisioning,
application/test/migration/dependency change or verifier execution is authorized by this receipt.
