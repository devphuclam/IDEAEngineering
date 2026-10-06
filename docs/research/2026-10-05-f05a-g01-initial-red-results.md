# T028/T030 — initial G01 compilation witness

| Control | Value |
|---|---|
| Stable ID / class / version / status | IE-VEV-F05A-G01-INITIAL-RED-20261005 / execution record / 0.1 / Draft |
| Owner / author / worker | Engineering / Codex / CODEX_ONLY |
| Reviewer / acceptance | Project Reviewer authorized bounded execution; successor result review NOT-RUN |
| Normativity / instruction | Product INFORMATIVE / NOT-APPLICABLE |
| Upstream / applicability | [G01 packet](2026-10-05-f05a-g01-red-packet.md), [input admission](2026-10-05-f05a-t028-t030-input-freeze.md), Issue37 / PR38 |
| Date / timezone / retention | 2026-10-05 / Asia/Ho_Chi_Minh / INTERNAL, retain original attempts and private logs with PH1 |
| Downstream / supersession | G01 behavioral RED/GREEN still owed; no historical execution superseded |
| Trigger / tailoring | Source/hash/graph/target drift stops execution; STANDARD-GUIDED configuration/test-information fields under IE-STD-AUTH-001, no conformity claim |

## Executed source and inputs

Exact pushed source `c17f63856fca74efed70760e9563db359d06efd0`.
Fresh owned root `/home/phuclam/idea-f05a-t028-t030-20261005-37/run-g01-compile-red-02`.
Archive SHA-256 `ad36ee266159631c5af311bce8118a3ea8a7ffe13b331b27d38d22a6168975ce`.
Manifest SHA-256 `1a20d94e58a0526de1358ea96c8265650b3c612214d4d9645c2dffd482f2dfda`.
Raw local and remote inputs **70/70 PASS**; transfer archive identity matched.
Java/javac/Maven pins matched; preflight **456/456** inventory and **52/52** Maven-core rows matched.

Command: published `run-compile-red.sh c17f63856fca74efed70760e9563db359d06efd0 1a20d94e58a0526de1358ea96c8265650b3c612214d4d9645c2dffd482f2dfda`.
Only direct resources3.5.0 resources/testResources and compiler3.15.0 compile/testCompile executed.
Surefire goal was requested but **not reached**. No lifecycle/exec/Node/Boot packaging, DB, Server,
listener, credential loading, Gateway or verifier execution.

## Compiler observation and separate postflight STOP

Main compilation succeeded. Test compilation failed at the two G01 references only:
`CustodyBoundaryTest.java:24` missing `TransferGrantService.Scope`;
`CustodyBoundaryTest.java:28` missing `TransferGrantService`.
No F05 fixture compiler error or other source error was observed.
This is the intended **initial missing-service compilation RED**, not an executed behavioral test.
No test count/PASS or PostgreSQL behavior is claimed.

After Maven, the first-party log detector stopped: its path regex did not split Unix classpath
colon separators and treated the full joined classpath as one unadmitted path. This was a detector
false positive, not evidence of an unapproved artifact acquisition. The command returned failure;
the postflight control result is not silently called PASS. Preserve this attempt unchanged.

Private Maven log: `run-g01-compile-red-02/maven-private.log`, SHA-256
`445d1604cb92276c5cf0a198df6280bbf9c7f81f9d1c7149a207aee4ed7a5cd1`.
Public error locations/counts are inspected; raw log not independently accessible through GitHub.
No secrets were loaded by this command. Original attempt01/archive remains retained separately.

## Prospective detector correction / read-only verification

Successor `ExecutionPreflight.java` excludes colon from one path token and adds a two-path literal
self-check. No admitted-coordinate set, hash check, POM, goal, dependency or oracle change.
Publish the successor commit/hash before using it to inspect the already-retained log from a fresh
owned `diagnostic-g01-01` directory. This read-only inspection does not rerun Maven, rewrite the old
log, execute G01 or change its exact executed source. Results are appended after inspection.

Read-only successor executed from published commit `2ac1dd2315568837bf91b231c09bd325f56c7619`,
utility SHA-256 `acaf497c9a6ac97085e4aba49bc5fcb570c3ae604de6958f465e56460941b6be`:
original controlled source **70/70 PASS**, inventory **456/456 PASS**, distribution **52/52 PASS**,
**479 actual cache-path observations PASS** against the frozen set; included realm-coordinate
guard also passed. This checks observed inputs, not full provider execution (Surefire never ran).
Original Maven log hash remained unchanged. Read-only diagnostic log SHA-256:
`4df7280220e0223512b8617eb2af3a064839d840aae52945755e59f217a7e668`.
No additional Maven invocation or behavioral qualification was performed.

## Next stage / boundary

The approved database still requires an interactive sudo step; read-only `sudo -n` refused.
The wizard skill supplies an ephemeral one-stage script that creates only
`idea_ddm_f05a_20261005_t028` from template0, refuses existing names, checks existing role flags,
sets bounded grants and witnesses zero public tables. No new roles/credentials or DROP DATABASE.
It must be run by the human at their SSH terminal; never send sudo/password values into chat.
Actual database creation remains NOT-RUN until independently verified after that step.

Ephemeral script deployed at
`/home/phuclam/idea-f05a-t028-t030-20261005-37/diagnostic-g01-01/f05-create-database-wizard.sh`.
Local/remote SHA-256 matched `18c247f22ce7822607694db3f2158c994a734d77e6fe90e03b40f499f908ad7c`;
`bash -n` PASS. Preserves wizard template library verbatim; human stage only below STAGES.
No end-to-end run by the worker. Existing DB creation approval is not being requested again.

G01 behavioral RED/minimum GREEN, G02–G06 and affected regression remain NOT-RUN.
T028/T030 and F05-A incomplete; T027 unchanged COMPLETE/PASS; PR38 Draft/Open, no merge/timer action.
