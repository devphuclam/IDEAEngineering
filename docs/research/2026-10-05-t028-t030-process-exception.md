# T028/T030 — bounded internal build/test process exception

| Control | Value |
|---|---|
| Stable ID / class / version | `IE-RES-T028-T030-PROCESS-EXCEPTION-20261005` / prospective process-authorization record / `0.1` |
| Status / authority | `Approved` for the bounded process exception, by the Project Reviewer's conversation instruction dated 2026-10-05; final input admission and goal execution remain conditional |
| Normativity / instruction state | Product `INFORMATIVE`; repository process authorization limited to the scope below; not a product requirement or legal disposition |
| Owner / author / mode | Engineering / Codex / `CODEX_ONLY` |
| Reviewer / acceptance authority | Project Reviewer for this process authorization; Legal Review Authority retains legal decisions and hard-grant blockers |
| Date / timezone / applicability | 2026-10-05 / Asia/Ho_Chi_Minh / Issue #37, PR #38, T028/T030 Server Grant qualification only |
| Authority input | User-supplied “APPROVED — create and use a new bounded T028/T030 internal build/test PROCESS EXCEPTION”; reviewed head `f196be9b9eea6b674e500970a17373864c97f032` |
| Classification / retention | `INTERNAL`; retain with the checkpoint, historic intake and eventual successors |
| Upstream | [Graph/rights gate](2026-10-05-f05a-t028-t030-graph-rights-gate.md), [execution proposal](2026-10-05-f05a-t028-t030-execution-proposal.md), [intake procedure](../agents/external-source-intake.md) |
| Downstream | Final admitted-input freeze, G01 RED source publication and bounded G01–G06 execution |
| Supersession | New prospective record; does not supersede or extend the expired T027 exception, or change historical rights findings |
| Evidence / tailoring | Attributable human process authorization; configuration and information control STANDARD-GUIDED; qualification `NOT-RUN` under this record |

## 1. Decision and exact envelope

The Project Reviewer authorizes a **prospective process exception**, solely for unchanged,
internal, offline T028/T030 build/test. This is not Legal Review Authority approval, a license
election, new license rights, commercial/T036 clearance or redistribution/release authority.
It is not authority for T029/T031–T034, all F05, or another Work Item.

The scope is the exact reconciled envelope at the reviewed head above, not a descriptor union:

| Controlled input | Raw SHA-256 / identity |
|---|---|
| [Resolved inputs](inventories/f05a-t028-t030-resolved-inputs.tsv) | `036afc60a252566bcdf72c4026d160bd31c27c477645c2f626aa61588f6039ca`; 456 rows, exact cached paths/hashes, including 264 model POMs, 96 Server JARs and plugin/provider/core-origin roles |
| [Embedded legal entries](inventories/f05a-t028-t030-embedded-legal.tsv) | `4e333caef94b2cc42609d033aaeea5a1cfeb7685f0f7559e48c63f23f7b65ffc`; 220 entry identities/hashes; entry discovery alone is not admission |
| [Maven distribution](inventories/f05a-q02-maven-distribution.tsv) | `9efb5a68868b206ab4a8468d7a3e221f4c9476d243266642ffb31b05c955d48f`; 52 installed core/boot JAR pins |
| Toolchain | Temurin `25.0.4.1+1`, Maven `3.9.16`, Boot `4.1.1`, PostgreSQL `18.6`; existing installed/cache sources only |
| Direct goal envelope | Resources `3.5.0`: `resources`, `testResources`; Compiler `3.15.0`: `compile`, `testCompile`; Surefire `3.5.6`: `test` |

The selected provider acquisition uses JUnit Platform **1.12.2**, followed by the recorded
project alignment to **6.0.3**. Both are controlled inputs, not interchangeable versions.
Core-imported classes remain Maven-owned providers with exact recorded origins. Shaded material
is reconciled as content of its containing JAR, not invented additional acquisitions.

No cache acquisition, new artifact, download/install, replacement or version substitution is
authorized. No lifecycle `test/package/verify`, Node/npm/Web execution, Boot repackage,
Gateway/Adapter/Receipt execution, preview mutation, verifier, progress action or merge follows
from this exception. Existing qualification authorization governs the database/session/test seam;
this record creates no additional behavioral authority.

## 2. Obligations and conditions before execution

Engineering retains the exact LICENSE, NOTICE, copyright, acknowledgement and legal material,
including Plexus/ExtremeLab/Javolution/ThoughtWorks, legacy Interpolation/Codehaus, EPL/CDDL and
GPL+Classpath alternatives. Do not relabel these as uniformly Apache, elect an alternative as a
legal conclusion, remove notices, or rewrite historical `BLOCKED-LEGAL` findings as legal approval.
Known source-handling, name/endorsement, patent, modification and redistribution conditions stay
recorded. Internal unchanged tooling is the sole admitted use proposed here; distribution,
modification or a different linking/hosting model reopens intake and remains outside this scope.

Before any Maven goal, Engineering must map every actual selected plugin/provider/core material
to exact retained rights, finish Shared Utils shaded coverage, confirm the applicable internal-use
grant and obligations, and publish the final admitted-input freeze. Process uncertainty already
covered by this decision does not require another blanket approval. This record alone does not
assert that the remaining reconciliation has passed.

**Hard STOP:** a selected material has no established usable grant, conflicting/contradictory
terms, an intended-use restriction, unsatisfiable source/disclosure or other obligation, or no
exact-byte legal mapping. Report the exact material to Legal Review Authority; do not treat the
process exception as supplying missing rights. JSR305 acquisition/provider appearance is also
STOP, irrespective of an old legal record.

## 3. Expiry and change control

The exception expires when the bounded T028/T030 Server Grant checkpoint finishes or is abandoned,
or immediately on artifact/version/hash/graph drift, missing cache, legal-material mismatch,
new dependency, different intended use or architecture/security expansion. It cannot carry forward
to T029–T034 or commercial use. Engineering owns preflight rehash, graph comparison, obligation
retention and truthful execution evidence; Legal Review Authority owns any hard legal disposition.

## 4. Publication state

At creation: process scope is `AUTHORIZED — CONDITIONAL ON FINAL RIGHTS/INPUT FREEZE`.
Maven goals, DB provisioning, G01–G06 and regressions are `NOT-RUN` in this successor.
T027 remains `COMPLETE / PASS`; PR #38 remains Draft/Open. The expired T027 authorization and
historical source/execution evidence remain unchanged. No prior execution is backdated under this
new prospective exception.
