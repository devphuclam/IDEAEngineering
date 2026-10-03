# T027 — JDK filesystem prerequisite execution result

| Control | Value |
|---|---|
| Stable ID / class | IE-VER-T027-FILESYSTEM-20261003 / bounded qualification verification |
| Version / status | 0.1 / Draft; Engineering PASS8/8; result acceptance pending |
| Product normativity / instruction | INFORMATIVE / NOT-APPLICABLE |
| Owner / author / worker | Engineering / Codex / CODEX_ONLY |
| Reviewer / acceptance authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm; execution authorized in conversation; result acceptance NOT-RUN |
| Date / timezone / classification | 2026-10-03 / Asia/Ho_Chi_Minh / INTERNAL |
| Baseline / exact executed source | Issue #37 / PR #38; 01340f8035376c37ad3e55b51e1d11df6c9b87a6 |
| Upstream | [Approved seam/source/command contract](2026-10-03-f05a-t027-filesystem-contract.md); [pre-execution publication](https://github.com/devphuclam/IDEAEngineering/pull/38#issuecomment-5967984950); accepted root05 graph prerequisite |
| Downstream | T027 actual filesystem profile; later real Adapter tests and transport qualification |
| Change / supersession | Executed successor to the prospective contract; no source/oracle/tooling change during execution; superseded by NOT-APPLICABLE |
| Retention / trigger | Retain owned target/archive/source/fixtures/private log; source/tool/module/hash/target/oracle/scope drift requires new review |
| Standards tailoring | IE-STD-AUTH-001; bounded verification and configuration trace STANDARD-GUIDED; no conformity claim |

## 1. Objective, authorization and procedure

The user approved the filesystem prerequisite seam and execution conditional on exact
source/hash/command/target publication in this conversation on2026-10-03. Source
`01340f8035376c37ad3e55b51e1d11df6c9b87a6` was committed/pushed and the linked receipt
published before remote provisioning/launch. This is conversation authority, not a
GitHub independent approval-review event.

The four-file export uses command-local `git -c core.autocrlf=false archive`.
All4 raw committed blob identities and3/3 input-manifest hashes PASS locally;
manifest SHA `f0262fe73473dccea7a8316ae3e4c9b6407aa5347c839e17765852313af8637e`.
Local/remote archive SHA:
`c6efa843ae6af59c5ec1ba1c9ac51499d32d6f9b9d455d343ba57bc17e57cea1`.
Remote extraction by the exact pinned installed JDK jar tool then passed3/3 input hashes,
manifest identity,19/19 installed tool/legal/config pins and Bash syntax before launch.
No normalized/repaired export bytes or dependency install/resolution was used.

Only fresh target `/home/phuclam/idea-f05a-20261003-37/filesystem-qualification-01`
and its private source/fixture children were created. Canonical parent, user ownership,
mode700, source mode600 and absence of target/fixture were guarded. Roots01–05 and
Q01 remained untouched. All sentinel/symlink targets are synthetic and remain inside
this owned run; no external/company/Vault file is touched.

Exact invocation through existing strict-host-key SSH:

```text
BASH_ENV= ENV= LD_PRELOAD= LD_LIBRARY_PATH= /usr/bin/bash --noprofile --norc /home/phuclam/idea-f05a-20261003-37/filesystem-qualification-01/source/tests/ph1/f05-qualification/filesystem/run.sh 01340f8035376c37ad3e55b51e1d11df6c9b87a6 f0262fe73473dccea7a8316ae3e4c9b6407aa5347c839e17765852313af8637e
```

Installed runtime assertions passed: Temurin25.0.4.1+1-LTS / Eclipse Adoptium.
Java public APIs ran against `sun.nio.fs.LinuxFileSystemProvider`, store type `ext4`.
No Maven, framework, mocked filesystem or third-party test library was used.
First GREEN qualifies existing JDK/provider behavior; no product code or fabricated RED.
No performance or durability benchmark is claimed from this short qualification run.

## 2. Actual results

| Named oracle | Actual |
|---|---|
| PRIVATE_STAGING_SIZE_DIGEST | PASS; private directories700/candidate600;1024 zero bytes match independent literal SHA |
| TRAVERSAL_ABSOLUTE_REFUSED | PASS; valid contained control; relative escapes/absolute path refused; sentinel unchanged |
| SYMLINK_REFUSED_SENTINEL_UNCHANGED | PASS; directory/leaf links refused; actual JDK NOFOLLOW open refused leaf link; sentinel unchanged |
| SIZE_DIGEST_REFUSAL_NO_COMPLETED_OBJECT | PASS;1023-byte and changed1024-byte candidates produce no completed objects |
| PRE_PROMOTION_FAILURE_NO_COMPLETED_OBJECT | PASS; injected failure after256-byte staging retains partial file, no completed object |
| FORCE_CLOSE_ATOMIC_MOVE_VERIFIED_BYTES | PASS; forced/closed verified candidate moved atomically; exact size/digest and observed mode400 retained |
| SEQUENTIAL_EXISTING_OBJECT_REFUSED | PASS; original completed object unchanged; retry candidate retained; no second completion |
| EXACT_ONE_COMPLETED_OBJECT | PASS; exact completed set is verified.bin; sentinel remains unchanged |
| Independent Bash post-oracle | PASS; completed size1024/mode400/SHA and sentinel SHA checked separately |
| Final inputs/tooling | PASS;3/3 source inputs and19 tooling/legal/config pins unchanged |
| Runner/SSH exit | 0 |

Bounded observed markers (transcribed from the controlled run, not represented as a raw-log copy):

```text
T027_FILESYSTEM_SOURCE=01340f8035376c37ad3e55b51e1d11df6c9b87a6
T027_FILESYSTEM_PREFLIGHT=PASS
T027_FILESYSTEM_CHECK=PRIVATE_STAGING_SIZE_DIGEST;result=PASS
T027_FILESYSTEM_CHECK=TRAVERSAL_ABSOLUTE_REFUSED;result=PASS
T027_FILESYSTEM_CHECK=SYMLINK_REFUSED_SENTINEL_UNCHANGED;result=PASS
T027_FILESYSTEM_CHECK=SIZE_DIGEST_REFUSAL_NO_COMPLETED_OBJECT;result=PASS
T027_FILESYSTEM_CHECK=PRE_PROMOTION_FAILURE_NO_COMPLETED_OBJECT;result=PASS
T027_FILESYSTEM_CHECK=FORCE_CLOSE_ATOMIC_MOVE_VERIFIED_BYTES;result=PASS
T027_FILESYSTEM_CHECK=SEQUENTIAL_EXISTING_OBJECT_REFUSED;result=PASS
T027_FILESYSTEM_CHECK=EXACT_ONE_COMPLETED_OBJECT;result=PASS
T027_FILESYSTEM_PROVIDER=sun.nio.fs.LinuxFileSystemProvider
T027_FILESYSTEM_STORE=ext4
T027_FILESYSTEM=PASS;checks=8;fixtureBytes=1024;cleanup=RETAINED
T027_FILESYSTEM_EXTERNAL_ORACLE=PASS;INPUTS=UNCHANGED;TOOLING=UNCHANGED
```

Completed object and sentinel SHA-256:
`5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef`.
Private `qualification.log` at the owned run root was observed mode600; SHA-256:
`295507b294cbf7f9ba313ff74c572effef613d773dbb1673efdc681272ba94cf`.
The exact target/source/archive, interrupted/mismatch/retry fixtures and sentinel are
retained; no cleanup/delete was performed. GitHub-only review can inspect source and
these bounded outcomes, not independently read the private raw host log. Hash identifies
retained bytes; it is not independent inspection of their contents.

## 3. Disposition and limits

**JDK filesystem prerequisite = Engineering PASS8/8; Project Reviewer result acceptance pending.**
No production Adapter, Gateway implementation, Grant/Receipt, custody acceptance, concurrent
object arbitration, symlink race defense, power-loss durability, HA or recovery is qualified.
Single-writer pre-existence guarding plus ATOMIC_MOVE is not portable atomic no-replace.
Mode400 does not stop the owning Unix user from chmod/writing. File force/close is observed;
directory durability and physical crash behavior were not tested. Interruption is an
injected Java pre-promotion failure, not process death. The1KiB zero fixture is not P05's
transfer fixture and does not qualify64MiB/large-file streaming.

Accepted root05 graph/package/non-web result and Q01 PASS remain unchanged. T027/F05-A
remain incomplete. Next qualification is actual web/HTTPS transport and its exact controlled
listener/certificate/trust package; wire/control profile and real Adapter remain separate.
No database, TLS/key provisioning, port/listener, preview change, verifier, timer action
or merge occurred. PR #38 stays DRAFT / OPEN; Issue #37 open; T027 unchecked.
