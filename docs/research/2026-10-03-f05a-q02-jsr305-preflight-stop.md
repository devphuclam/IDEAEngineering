# T027 JSR305 exclusion — first-party archive preflight STOP

| Control | Value |
|---|---|
| ID / class | IE-VER-T027-JSR305-PREFLIGHT-STOP-20261003 / verification record |
| Version / status | 0.1 / STOP recorded; Maven/Boot NOT-RUN |
| Date / project timezone | 2026-10-03 / Asia/Ho_Chi_Minh |
| Owner / worker | Engineering / Codex / CODEX_ONLY |
| Authority | Explicit bounded experiment user instruction; mandatory hash-drift STOP applied |
| Scope / baseline | Issue37 / PR38; exact attempted published source 3efad42448ff6950de6dfa57f5c04f5d14871aeb |
| Product normativity | INFORMATIVE, no product/runtime or license approval |
| Review / tailoring | Project Reviewer review pending; IE-STD-AUTH-001 identity/lineage STANDARD-GUIDED |
| Retention | INTERNAL; owned source archive retained, public seven-file byte witness, execution transcript in this chat |
| Review trigger | New source-export procedure, target, input hash or execution packet |

## Publication and transfer

Exact source was pushed before execution. Publication receipt:
[PR38 comment](https://github.com/devphuclam/IDEAEngineering/pull/38#issuecomment-5967260012).
All15 input hashes were independently checked against exact committed Git blob bytes:
15/15 PASS. This is a source-control check only.
Committed manifest SHA-256:
`76c635fc345efa452e09d86471beade875d92e156e7d311c3417945be4f042c6`.

Git archive ZIP SHA-256 on Windows and Ubuntu:
`c472d327446b01cc58075e292b4028773f0abb9248904840dc95d16787472f1b`.
JDK jar/java binary hashes matched before archive extraction.
Owned retained directory:
`/home/phuclam/idea-f05a-20261003-37/jsr305-exclusion-01`.
No overwrite/reuse/cleanup of another directory occurred.

## Observed STOP

The first run.sh action checks all source inputs using sha256sum -c.
Eight package-local inputs matched. Seven documentation/inventory inputs failed.
Bash set -e stopped **before Java Experiment.java invocation**.
The remote run directory is confirmed absent; no repository was populated.

[Exact failed-byte witness](inventories/f05a-q02-jsr305-exclusion-preflight-stop.tsv)
retains expected Git-blob hash and actual archive-entry hash for each failed input.
Read-only inspection of those seven archive entries proves each is byte-identical to
the expected input after CRLF-to-LF normalization. This diagnostic comparison is
NOT an execution admission or permission to ignore hash drift.

Git for Windows system core.autocrlf=true was observed. Archive export materialized
CRLF for text outside the package-local LF attributes. Package-local POM, Java,
settings, runner, pins and README remained LF and matched.
Thus transfer was intact, but the exported source package did not preserve all
committed byte identities. This is a **first-party source packaging blocker**, not
evidence that JSR305 is required or that the dependency exclusion is invalid.

## Actual stage disposition

| Stage | Actual result |
|---|---|
| Published-source Git blob checks | 15/15 PASS |
| Transfer/archive/JDK extraction hash checks | PASS |
| Extracted experiment input hash checks | 8 PASS / 7 FAIL; STOP |
| Java qualification runner | NOT-RUN |
| Isolated repository construction | NOT-RUN; run directory absent |
| Maven direct goals / actual plugin graph | NOT-RUN |
| Executable JAR/package oracle | NOT-RUN; no output JAR |
| Conditional non-web Boot smoke | NOT-RUN |
| JSR305 graph repair | NOT-QUALIFIED / awaiting corrected source-export authorization |
| Historical JSR305 rights | BLOCKED-LEGAL unchanged |
| Q01 | Accepted PASS unchanged |
| Whole T027/F05-A | Not completed |

No dependency was selected, resolved, installed or downloaded by this attempt.
Original Maven cache and Server/preview/DB/TLS/listeners were not touched.
No verifier, timer action or merge. PR38 remains Draft/Open.

## Smallest proposed continuation — not executed

Use a command-local Git archive override `git -c core.autocrlf=false archive ...`
to preserve the same accepted source commit and all existing committed hashes,
rather than changing the checksums to accept transformed bytes.
Do not change machine Git configuration, POM, dependency graph, versions or rights.
Inspect the new archive entries locally against all15 committed hashes before transfer.
Preserve this failed archive and STOP evidence. A fresh, explicitly approved owned
target/source-export packet is needed before another attempt; no dynamic repair
or rerun was performed under this hash-drift STOP.
