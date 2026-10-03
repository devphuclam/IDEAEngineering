# T027 Internal Build/Test — Bounded Process Exception

| Control | Value |
|---|---|
| Stable ID / class | `IE-RES-T027-PROCESS-EXCEPTION-20261003` / bounded successor process authorization |
| Version / status | `1.0 / Approved` for the process scope below; exact-byte freeze is a separate receipt |
| Product normativity / repository instruction | `INFORMATIVE / NOT-APPLICABLE`; records attributed authorization, creates no product requirement |
| Owner / author / worker mode | Engineering, accountable worker Codex / Codex / `CODEX_ONLY` with bounded research assistance |
| Approver / authority source | Project Reviewer Nguyễn Huỳnh Phúc Lâm; explicit project-conversation instruction “APPROVE bounded T027 process exception”, 2026-10-03 |
| Evidence / effective date / timezone | 2026-10-03 / authorization effective for the bounded process scope only / Asia/Ho_Chi_Minh |
| Work Item / PR | [Issue #37](https://github.com/devphuclam/IDEAEngineering/issues/37) / [PR #38](https://github.com/devphuclam/IDEAEngineering/pull/38) |
| Input baseline | `10151a51d1492c48c96f5df038d1f03031bebbc3`; exact inventories below |
| Intended use / classification | Existing unmodified components, internal engineering T027 qualification build/test only / `INTERNAL` |
| Upstream | [Q02 intake v0.2](2026-10-03-f05a-t027-q02-intake.md), [decision brief](2026-10-03-f05a-q02-license-repair-and-decision.md), [intake procedure](../agents/external-source-intake.md), Project Reviewer instruction |
| Downstream | Exact-byte freeze receipt and final Q02 execution-package review; package approval remains `NOT-RUN` |
| Change / supersession / retention | New T027-only authority, not an amendment of F03/F04/#26 exceptions; supersedes the pending process-exception proposal only; preserve original blockers and actual terms; retain with T027 evidence |
| Expiry / reopen trigger | T027 qualification ends, authorization withdrawn, or artifact/version/hash/graph/use/obligation/scope changes; STOP and reopen intake |
| Evidence / tailoring | Attributed human authorization, not a test result; information/configuration control `STANDARD-GUIDED` under IE-STD-AUTH-001; no legal or standards-conformity claim |

## 1. Decision and exact limits

The Project Reviewer authorizes one exception to the repository's pre-use Legal Review
**process gate**, only for actual known license terms and the exact existing artifact/version/
hash/graph envelope below. This record does not approve the licenses legally, grant rights,
select away contrary terms or claim company license approval.

It permits the bounded process route for internal engineering T027 build/test, offline only.
Engineering preserves all identified LICENSE, NOTICE, copyright, acknowledgement, patent,
name/endorsement and source-handling obligations. Legal Review and T036 remain separate and
open where applicable. Fulfilment of obligations is not established by hashes or this exception.

The exception covers the current known-term acquisition components (99 of the 100 rows;
JSR305 excluded unless a separate exact-grant evidence disposition is established) and the
52 installed Maven distribution rows, including their previously escalated known terms.
It is not authority to acquire, install or replace a build artifact, change its graph, or execute
the final package before its separate review. Missing actual grant is not waived.

## 2. Immutable input envelope

Hashes below identify committed UTF-8 LF bytes at input `10151a51...`, not rendered text.
Rights metadata may gain a separately reviewed evidence successor without changing any artifact,
version or graph pin. Such a successor cannot expand this exception to unknown rights.

| Inventory at exact input baseline | Count / SHA-256 |
|---|---|
| [Effective acquisition graph](inventories/f05a-q02-effective-graphs.tsv) | 116 rows / 100 distinct coordinates; `f7eddbca7c6b102d3fc6778573a7fc9b05e5e8f046f06b5e6e75a93c9b900257` |
| [Acquisition rights](inventories/f05a-q02-rights-dispositions.tsv) | 100 rows; 88 ordinary conditional +1 XZ +11 blocked at this input; `3d45fb13ec8159ef8374cb699a98b76605ac545f1f129fcc3bd772c56156649a` |
| [Installed Maven distribution](inventories/f05a-q02-maven-distribution.tsv) | 52 JAR paths/GAV/classifiers/hashes; 47 ordinary rights +5 legal gates; `9efb5a68868b206ab4a8468d7a3e221f4c9476d243266642ffb31b05c955d48f` |
| [Model POMs](inventories/f05a-q02-models.tsv) | 243 exact cached model inputs; `bda4ba9754184f9ac5ea912cd0d9d9ce6e652d241ac0ad217aa258cd92c6944f` |
| [Profiles](inventories/f05a-q02-profiles.tsv) | 183 retained profiles, candidate activation rules unchanged; `eb403e9c2ac41f24cec3cbeec2aa4282492d46291acbe53e85979e8efdb6c3f5` |
| [Omission paths](inventories/f05a-q02-omitted.tsv) | 465 path decisions; `bd3611e6a5d13c25315ddda8cda90910b364e6dbc9b410e794cbc1da12e43da6` |
| [Embedded legal entries](inventories/f05a-q02-used-legal-files.tsv) | 164 entries / 62 texts; `8adfd62fd0936d2935c6f092200a88e11dd820903c1f2edbe1075df268996c48` |

Application38, Resources9, Compiler14, Jar16 and Boot39 static graph identities remain unchanged.
Shade3.6.0 is a Boot acquisition dependency, not an authorized executable goal.
Installed Temurin25.0.4.1+1 and Maven3.9.16 are the existing candidate toolchain; retain the
[exact executable/runtime pins](2026-10-03-f05a-t027-q01-execution-package.md) and
[core-realm identity](2026-10-03-f05a-q02-maven-core-realm.md).
No Python, Node, Playwright, Surefire, Clean, Exec, database, broker or new tool is admitted
as a qualification dependency by this exception.

## 3. Known terms remain visible

| Material with a retained Legal Review gate | Bounded scope and obligations |
|---|---|
| Acquired Utils3.5.1/3.6.0/4.0.2/4.0.3, XML3.0.1; core Utils3.6.1 | Preserve Apache, ExtremeLab1.1.1, JavolutionBSD2, ThoughtWorksBSD3 and exact NOTICE text; acknowledgement and name/endorsement restrictions survive |
| Acquired/core Interpolation1.29 | Preserve the original legacy/altered Apache1.1 headers and actual Apache2 text; no relabeling or removal of source-coverage concerns |
| Acquired SisuPlexus0.9.0.M4; core SisuInject/Plexus1.0.0 | Preserve actual EPL2 legal/source-handling material; no inferred secondary-license election |
| Runtime JakartaAnnotation3.0.0, TomcatCore11.0.24 material | Preserve actual EPL/GPL+Classpath alternatives and bundled CDDL/EPL schemas; no legal applicability or distribution clearance inferred |
| Core JavaxAnnotationAPI1.3.2 | Preserve both embedded CDDL1.0 and adjacent CDDL1.1/GPL+Classpath evidence; recorded version/choice concern remains a legal follow-up |
| Acquired JDOM2 2.0.6.1 | Preserve actual custom four-condition grant and name/endorsement restrictions; acknowledgement request remains optional |

Engineering owns retention and pre-execution obligation checks. The Project Reviewer owns
scope/expiry enforcement. Legal Review Authority owns legal interpretation, license-option/
distribution/source-handling clearance and T036 follow-up. An obligation that cannot be met
within the exact intended use stops execution even though the process gate has an exception.

Rights rows may remain `BLOCKED-LEGAL` for Legal Review while a separate process field records
`T027_PROCESS_EXCEPTION_AUTHORIZED`. Neither field means an execution or legal PASS.

## 4. Separate JSR305 investigation authorization

The same human instruction separately permits `REFERENCE-ONLY` investigation of
`com.google.code.findbugs:jsr305:3.0.2`: official source/repository/release and the exact
matching source/legal artifact, actual license/header/notice inspection, source identity and
hash/provenance recording.

Keep any inspected archive outside the project dependency cache. Inspect only by a
policy-permitted method; respect any restriction on retaining an external archive. No install,
execution, dependency addition, copy into `.m2`, build use or version change is permitted.
Do not infer the grant from metadata, a fork, another version or the historical RI.
If the bounded investigation cannot establish an attributable exact grant, preserve
`JSR3053.0.2 = BLOCKED-LEGAL` and report the precise gap. Section1 cannot waive that gap.

## 5. Gate ordering and stop boundary

1. Commit and freeze this controlled exception before any first T027 Maven/Boot execution.
2. Complete the exact JSR305 evidence disposition separately.
3. Only if the exact-grant gap closes, submit the final Q02 package with rights/process states,
   exact offline command, committed first-party POM/source hashes, package oracle and STOP rules.
4. Wait for human package review before creating/running its qualification target or invoking
   Maven/Boot. Do not turn this exception into that package review.

Q01 remains accepted Ed25519-only PASS and is not rerun. Q02 remains IN_PROGRESS.
PR38 stays Draft/Open; T027 and F05-A are not complete. No Gateway product implementation,
DB/TLS/listener/preview change, production/commercial/redistribution, other Work Item, whole-F05
admission, verifier, merge or timer/Tracker action is authorized. The exception expires at the
end of T027 qualification or any scope change.

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-10-03 | Record the explicit bounded T027 process exception and separate reference-only JSR305 authorization prospectively; no execution approval or history rewrite |
