# T027 — JDK filesystem prerequisite seam and execution contract

| Control | Value |
|---|---|
| Stable ID / class | IE-VEV-T027-FILESYSTEM-20261003 / proposed qualification contract |
| Version / status | 0.2 / Approved for the named seam and conditional execution; source published with this package; execution NOT-RUN |
| Product normativity / instruction | INFORMATIVE / NOT-APPLICABLE; no new product requirement |
| Owner / author / worker | Engineering / Codex / CODEX_ONLY |
| Reviewer / acceptance authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm; explicit seam and conditional-execution approval received in conversation 2026-10-03 |
| Date / timezone / classification | 2026-10-03 / Asia/Ho_Chi_Minh / INTERNAL |
| Baseline / upstream | Issue #37 / PR #38; accepted [root05 result](2026-10-03-f05a-q02-jsr305-root05-results.md#6-human-acceptance-successor--2026-10-03); frozen [preparation §3/§8/§9](2026-09-28-ph1-f05-gateway-qualification.md) |
| Downstream | T027 filesystem evidence and future Adapter contract; not apps/gateway implementation |
| Change / supersession | v0.2 records approval and exact source/tooling/procedure; v0.1 proposal at this worktree was not executed; changes no frozen preparation or historical execution |
| Retention / trigger | Retain exact source/commands/hash receipts and owned fixtures; tool/module/hash/target/oracle/scope drift reopens approval |
| Evidence / standards tailoring | Proposal only; verification/configuration control under IE-STD-AUTH-001; no conformity claim |

## 1. Objective and seam

Observe actual installed Ubuntu/JDK filesystem capabilities needed by the selected
filesystem Adapter direction. The external seam is a launched first-party Java
qualification process: exit code and bounded named results, independently checked
file existence, byte count, SHA-256 and permissions inside an owned synthetic target.
There is no simulated filesystem or mocked provider.

This is a prerequisite harness, not a Gateway Adapter implementation or qualification
of a supported product endpoint. Test-only containment/refusal logic demonstrates only
the exact exercised profile; future product Adapter tests must qualify its real public
interface. Do not infer race-free custody, power-loss durability or production isolation
from a single-user process and synthetic files.

## 2. Approved boundary

The user selected: “Duyệt phạm vi này và cho chạy sau khi công bố exact
source/hash/command/target (khuyến nghị)” on 2026-10-03. This is a relayed conversation
authorization, not a GitHub approval-review event. No further permission is needed merely
to launch the exact named unit after the publication and hash prerequisites pass.

- Use existing unmodified Temurin25.0.4.1+1-LTS and Java standard library (`java.base`),
  with source-file launch; no Maven/plugin, third-party test framework or new package.
- Fresh owned target only:
  `/home/phuclam/idea-f05a-20261003-37/filesystem-qualification-01`.
  Refuse if present or symlinked. Verify canonical parent, expected user ownership and
  private permissions. Roots qualification/Q01 and jsr305-exclusion-01 through05 remain untouched.
- Use synthetic bytes only. Keep staging, candidate objects, interruption fixtures,
  symlink destinations and an outside-Adapter-root sentinel within this new run target.
  “Outside Adapter root” never means outside the owned qualification target.
- Demonstrate lexical traversal and symlink refusal without modifying the sentinel.
  Record the real filesystem/provider and limits; do not claim defense against a hostile
  concurrent same-user process or administrator from these static checks.
- Write to private staging, independently verify expected size/digest, and qualify the
  selected promotion primitive. A digest/size mismatch or injected pre-promotion failure
  leaves no file classified as a completed object. Existing completed-object bytes must
  not be overwritten by retry. Unsupported behavior is FAIL/BLOCKED, not a reason to
  silently substitute weaker copy/move semantics.
- Any flush/force observation describes Java/provider behavior only. No machine crash,
  power interruption, disk fault or cross-store atomicity test is authorized or claimed.
- Retain this small new target and evidence after the run. No recursive deletion,
  database, certificate/key creation, network listener/tunnel, preview, verifier, merge
  or timer action. No reusable credential/proof/key or company file is an input/output.

## 3. Tooling and source publication controls

Use the already inspected unmodified JDK and host utilities from
[Q01 inventory §2](2026-10-03-f05a-t027-q01-execution-package.md#2-exact-used-inventory-and-intended-use).
This contract requests prospective reuse of those exact pins/obligations for the named
filesystem prerequisite, not inheritance of Q01-only authority or a general F05 exception.
Installed legal companions remain unmodified; no runtime/source redistribution occurs.
The Q02 Maven process exception is unnecessary for this JDK-only unit.

The harness follows one private-staging-to-completed-object qualification flow, with
the agreed refusal/interruption/retry oracles. A first GREEN is not fabricated
RED→GREEN evidence or proof of product code. If first-party harness defects occur,
report the exact stage and preserve the failed attempt; no dynamic repair during a run.

Before remote execution, publish a successor with exact first-party source/runner,
manifest and commit, command, target and test oracle. Require command-local
byte-preserving export, every committed source hash matching local exported bytes,
transfer hash identity and every remote extracted source hash matching. No post-export
normalization or overwrite of a failed attempt. Clear child-process Java/classpath
injection variables; verify tool/version/module/hash pins and fresh-target guards.

Exact Java launch (performed only through the pinned runner after preflight):

```text
/opt/idea/tools/jdk-25.0.4.1+1/bin/java --source 25 /home/phuclam/idea-f05a-20261003-37/filesystem-qualification-01/source/tests/ph1/f05-qualification/filesystem/FilesystemPrerequisite.java
```

The user's approval permits the named seam, harness writing, prospective exact-tool reuse
and execution only after the exact-source publication/hash checks above. Any tool/module/source-oracle expansion
or changed target outside the approved boundary requires separate direction.

## 4. Result and remaining gates

All filesystem checks are NOT-RUN. Root05 and Q01 remain accepted within their own scopes.
Success would qualify only this actual JDK/filesystem prerequisite, not whole T027/F05-A.
Later TLS/certificate trust, owned listeners, control authentication, exact Grant/Receipt
wire profile, transfer parameters and any Server/database execution still need their
named scoped packages. They do not block preparation of this filesystem prerequisite.
PR #38 stays DRAFT / OPEN; Issue #37 open; T027 unchecked; verifier NOT-RUN; timer unchanged.

## 5. Exact execution candidate and oracles

First-party input directory: `tests/ph1/f05-qualification/filesystem/`.
Only four files are exported/transferred: Java source, Bash runner, tooling pins and
input manifest. Publish their source commit and manifest/archive hashes in PR #38
before provisioning/launch; later status-only publication is not executed-source identity.

| Controlled file | SHA-256 |
|---|---|
| FilesystemPrerequisite.java | 1fd678c604485bae79e91cab5e0c337bc95610f1773ce8234c689ae7e3c4cd11 |
| run.sh | c7d4ef4b7d8c08bf839dfac29ca03fb2e82f3dc2cd7d9b73b9c2a55f032e83fe |
| tools.sha256 | ad5eaa4c2f4b5ad980846e9eb1be35dc0501fbb48b4db7725e5821998df3615a |

Provision only the fresh owned target and `source` child with umask077 and existing
hash-pinned mkdir/chmod utilities. Refuse an existing target, canonical-parent/mode/owner
mismatch or changed utility. Export exact source through command-local
`git -c core.autocrlf=false archive`; verify3/3 input hashes plus manifest committed bytes
locally, archive SHA after transfer, and the same3/3 input/manifest identities remotely.
ZIP extraction uses existing admitted JDK `jar` tool only; exact pin
`033a730b1e74f26f7345ec4754bd6fa8a0d075973475d18695b386da516738b2`
at `/opt/idea/tools/jdk-25.0.4.1+1/bin/jar` from root05's qualified tool inventory.
No external ZIP extractor is introduced. Exported archive paths are restricted to the
four listed first-party files; extraction is into this fresh owned `source` directory.

The publication receipt supplies literal source SHA and manifest SHA arguments to:

```text
BASH_ENV= ENV= LD_PRELOAD= LD_LIBRARY_PATH= /usr/bin/bash --noprofile --norc /home/phuclam/idea-f05a-20261003-37/filesystem-qualification-01/source/tests/ph1/f05-qualification/filesystem/run.sh <exact published source SHA> <exact published manifest SHA-256>
```

The harness creates only its absent `fixture` child and synthetic subdirectories/files.
Oracle is8 named PASS checks: private staging/size/digest; traversal/absolute refusal;
directory/leaf symlink refusal and actual NOFOLLOW; size/digest refusal with no completed
object; injected pre-promotion failure; force/close/atomic move of verified bytes;
sequential existing-object refusal; exact one completed object and unchanged sentinel.
Runner then independently checks mode400, size1024, literal SHA, unchanged source/tools.
Any mismatch/nonzero result stops the unit and is retained, with no dynamic repair/rerun.

Fixture is1024 zero bytes; independent Windows PowerShell SHA256 observation before
publication yields `5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef`.
This is not the P05 1KiB/64MiB transfer fixture or large-file qualification.

Selected test-only promotion profile uses a private single-writer root, refuses an existing
object, then `Files.move(..., ATOMIC_MOVE)`. Sequential retry is covered; no portable atomic
no-replace/concurrent-CAS guarantee is inferred. Read-only mode400 is observed, not proof
that the owning Unix user cannot chmod/write. Interrupted staging is a controlled Java
pre-promotion failure, not a killed process or disk/power-loss test.

Reference-only primary documentation inspected 2026-10-03:
[Java25 Files](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/nio/file/Files.html)
and [FileChannel](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/nio/channels/FileChannel.html).
The specified atomic-move existing-target behavior is provider-dependent; force guarantees
are bounded by storage/platform. No third-party text/code/example is copied into the harness.
These source facts bound claims and do not supply an executed PASS or a product selection.
