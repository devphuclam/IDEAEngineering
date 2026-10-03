# T027 JSR305 exclusion — authorized root02 retry

| Control | Value |
|---|---|
| Stable ID / class | IE-VER-T027-JSR305-RETRY-20261003 / bounded qualification verification |
| Version / status | 0.2 / Draft; unrelated first-party compile defect recorded |
| Product normativity / instruction state | INFORMATIVE / NOT-APPLICABLE |
| Owner / author / worker | Engineering / Codex / CODEX_ONLY |
| Reviewer / acceptance authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm; result review NOT-RUN |
| Evidence date / timezone | 2026-10-03 / Asia/Ho_Chi_Minh |
| Baseline / source | Issue37 / PR38; exact attempted source a51ff70775480e97ceb1c19d61fdb5ae7b2c2042 |
| Authorization | Explicit user approval: exactly two literal root01→root02 changes, changed hashes, publish before execution, automatically continue after packaging PASS; no behavioral repair after execution |
| Classification / retention | INTERNAL; keep both owned attempts, source ZIPs and private logs for review |
| Upstream trace | [Exact packet](../../tests/ph1/f05-qualification/jsr305-exclusion/README.md), [original execution authorization](2026-10-03-t027-jsr305-experiment-authorization.md), [accepted root01 STOP](2026-10-03-f05a-q02-jsr305-preflight-stop.md) |
| Downstream trace | Q02 result/review and current worker handoff, not whole T027/F05 acceptance |
| Change record / supersession | New successor execution record; original STOP remains unchanged; superseded by NOT-APPLICABLE |
| Review trigger | Source/hash/model/graph/runtime/goal/target/scope change or proposed probe repair |
| Standards tailoring | IE-STD-AUTH-001; ISO/IEC/IEEE15289:2019 and ISO10007:2017 identity/trace STANDARD-GUIDED; no conformity claim |

## Objective, unchanged contract and publication

Qualify the approved same-version Boot plugin exclusion without JSR305 in actual inputs.
Expected acquisition99 JARs /115 collection rows /242 model POMs; application38 unchanged.
Maven core52 unchanged. Rights dispositions, frozen process exception, original JSR305
BLOCKED-LEGAL finding and Q01 accepted PASS remain unchanged.

Source successor commit:
`a51ff70775480e97ceb1c19d61fdb5ae7b2c2042`.
Diff from85d87a0 changes exactly the ROOT literal in Experiment.java, cd literal in
run.sh, and their two manifest hashes. No other source/behavior/POM/oracle change.

[Pre-execution publication receipt](https://github.com/devphuclam/IDEAEngineering/pull/38#issuecomment-5967420163).
Manifest SHA-256:
`07534aa2e1589ef4ba17fe776cf224e4e06cb990a39d133cac0a788bb6e329df`.
Changed first-party file hashes:

- Experiment.java: `38d6ae011d4be33b3f8ada0c1177004aabe6dab2726d38f9c6a089c9f71de63a`.
- run.sh: `11b8fff28bdaa224db1405c10462fb38f7d5348466a7be338dd9b60fce61f83b`.

## Packaging and preflight evidence

Command-local `git -c core.autocrlf=false archive` exported the exact successor.
The 15 exported input bytes were compared directly against the committed manifest:
**15/15 PASS before transfer**, no normalization. No global/repository Git config change.

Archive SHA-256 on Windows and Ubuntu:
`34f06ca7ad2fdcbbc8b6c35d058442b86fdc6f6a32a98c61729520984cdda7c7`.

Fresh guarded owned directory:
`/home/phuclam/idea-f05a-20261003-37/jsr305-exclusion-02`.
The guard refused pre-existing targets. The old root01 attempt was not overwritten/reused.

Pinned JDK jar/java hashes passed before extraction. On Ubuntu run.sh checked the
same manifest: **15/15 PASS**. Java runner then verified input hashes, environment,
Maven/JDK/core/tool hashes, fixed graph delta, exact cached bytes, fresh run directory,
isolated repository counts/hashes and legal companions before emitting:

```text
PREFLIGHT=PASS;JARS=99;POMS=242;JSR305=ABSENT
STOP: IllegalStateException: Maven failed; inspect retained bounded log
```

The JSR305 absence claim is **pre-Maven repository evidence**, not proof of actual
resolution/realm behavior. The runner did attempt the single predeclared offline
Maven command after preflight and then rejected its result at the first Maven oracle.

## Actual result and current limitation

| Stage | Actual result |
|---|---|
| Source publication / literal-only diff | PASS |
| Raw local exported input hashes | 15/15 PASS |
| Complete archive transfer hash | PASS |
| Remote extracted input hashes | 15/15 PASS |
| Fresh owned target / toolchain / input preflight | PASS |
| Isolated repository before Maven | 99 JAR /242 POM; JSR305 absent; PASS |
| Approved direct Maven goals | Resources executed; compile FAIL; jar/repackage NOT-RUN |
| Actual dependency collection / plugin realm | NOT-QUALIFIED; parser stage not reached |
| Output JAR existence | ABSENT under the exact owned application target |
| Executable package oracle | NOT-RUN |
| Non-web Boot smoke | NOT-RUN |
| Original cache post-execution hash recheck | NOT-RUN; final runner stage not reached |
| Graph repair final disposition | NOT-QUALIFIED; do not infer GRAPH REPAIR NOT JUSTIFIED |
| Whole T027 / F05-A | Not completed |
| Q01 / PR / verifier | Q01 PASS; PR38 Draft/Open; verifier NOT-RUN; no merge |

The runner's Maven condition requires both exit0 and BUILD SUCCESS in the retained log.
Its initial message alone did not establish the cause. After connectivity returned,
read-only log inspection confirmed BUILD FAILURE at compiler3.15.0 for the first-party
BootProbe.java import, not a missing JSR305 artifact/class.
No automatic repair/rerun/alternate artifact/library/version was attempted.

Immediately after this result, two bounded SSH attempts to192.168.137.33 timed out.
Windows had no192.168.137.x IPv4 address; a single ping also timed out.
This temporarily blocked **read-only failure classification**, not execution authority.
The user was asked to restore hotspot/server connectivity; no network/security setting
was changed by the worker.

The user restored hotspot connectivity. Retained private records and verified SHA-256:

- root02/run/preflight.txt: `1c5612a671bde1d00d0131fa7f4eefb9ddbe2a3015f4dc72eda2ef07b7695a87`.
- root02/run/maven-command.txt: `2b71b7e7f3b4ed1d9c6e9de2ec737e85a577f4e4de46137aad12f2b39f19faf0`.
- root02/run/logs/maven.log: `177de722dfe9e8f91fd4a1014bae23d0bba4d78b6685fb67a8f8f4341e7fa5af`.

The Maven log is mode600. Its copied local archive-side log has the identical hash.
Private full host logs are not independently accessible to the Web reviewer through GitHub;
the exact first-party error excerpt below is retained publicly for review.

## Confirmed unrelated failure — first-party BootProbe import

Maven log lines725–750, finished2026-10-03T15:58:25+07:00:

```text
[INFO] Compiling 1 source file with javac [debug parameters release 25] to target/classes
[ERROR] BootProbe.java:[4,32] cannot find symbol
  symbol:   class SpringBootApplication
  location: package org.springframework.boot
[ERROR] BootProbe.java:[11,2] cannot find symbol
  symbol: class SpringBootApplication
[INFO] 2 errors
[INFO] BUILD FAILURE
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile
```

The probe imports `org.springframework.boot.SpringBootApplication`, but the repository's
already-qualified Server uses `org.springframework.boot.autoconfigure.SpringBootApplication`
in IdeaServerApplication.java:4. This is a worker-authored probe source defect.
No dependency/version replacement or rights investigation is implicated by this error.
Actual diagnostics show only Resources and Compiler plugin realms created. Boot
repackage was not reached. Output JAR and boot.log were confirmed absent; a bounded
find of the isolated repository returned no jsr305-named path after the failed build.
That does not substitute for qualifying the unexecuted Boot acquisition/realm path.

Disposition: **FAIL at first-party compile; JSR305 repair remains NOT-QUALIFIED**.
Do NOT classify it as GRAPH REPAIR NOT JUSTIFIED: actual JSR305 requirement was not shown.
No dynamic repair or rerun was performed. Preserve root01/root02 and all failed evidence.

Smallest proposed successor, NOT IMPLEMENTED: correct that one import, prospectively
retarget only the two owned-root literals to a fresh root03, update affected hashes,
publish exact source, re-export byte-preserving and rerun the existing bounded contract.
POM/dependencies/versions/rights/goals/graph/oracles stay unchanged. This requires a
separately explicit source-repair authorization under the no-dynamic-repair boundary.

No Gateway product implementation, T028–T034, DB/TLS/listener/preview change,
dependency download/install, verifier, timer action or merge was authorized or performed.
