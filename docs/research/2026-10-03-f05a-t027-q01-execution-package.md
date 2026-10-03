# T027 Q01 — JDK key-separation execution package

| Control | Value |
|---|---|
| ID / class | `IE-VEV-F05A-T027-Q01-20261003` / qualification procedure and prospective scoped tooling inventory |
| Version / status | `0.1 / Proposed`; execution approval pending |
| Product normativity / process instruction | `INFORMATIVE / NOT-APPLICABLE` |
| Owner / author | Project Reviewer Nguyễn Huỳnh Phúc Lâm / Codex, `CODEX_ONLY` |
| Reviewer / acceptance authority | Project Reviewer; execution review `NOT-RUN` |
| Date / classification | 2026-10-03, Asia/Ho_Chi_Minh / `INTERNAL` |
| Baseline / Work Item | [#37](https://github.com/devphuclam/IDEAEngineering/issues/37); source identity recorded in separate publication receipt before execution |
| Upstream | [Frozen F05 preparation](2026-09-28-ph1-f05-gateway-qualification.md), [preflight v0.3](2026-10-03-f05a-t027-preflight.md), [native runtime intake](2026-09-23-p04-ubuntu-native-runtime-intake.md), [intake procedure](../agents/external-source-intake.md) |
| Downstream | [Q01 source/README](../../tests/ph1/f05-qualification/README.md); T027 current handoff; future qualification evidence |
| Change / retention / supersession | Successor to preparation-only authority following user Q1/Q2 approval in conversation; retain with F05 evidence; supersedes no historical authorization |
| Trigger / evidence | Tool/source/hash/module/use/target changes reopen gate; live read-only file observations, test execution `NOT-RUN` |
| Standards tailoring | [Authoring standard](../agents/product-document-authoring-standard.md), verification/configuration identity for one procedure; no conformity claim |

## 1. Authorization received and remaining approval

User approved writing a minimal qualification harness and the isolated environment boundary
through “Theo khuyến nghị hết.” Execution commands must still be presented before use.
This package requests **Q01 only**, not blanket T027 build/provisioning authority.
No Gateway product code, T028–T034, dependency download/install, inherited F04 exception,
verifier, merge, database, certificate or tunnel action follows.

## 2. Exact used inventory and intended use

Use only the existing, unmodified Temurin JDK25.0.4.1+1 on Ubuntu through its public APIs.
`DEPENDENCY` in the intake vocabulary: internal engineering qualification, not redistribution
of the JDK. No Maven/plugin/library graph is needed for source-file launch. No Node module,
third-party fixture or crypto implementation is imported into this first-party test.

Historical exact source: official Adoptium
[jdk-25.0.4.1+1 release](https://github.com/adoptium/temurin25-binaries/releases/tag/jdk-25.0.4.1%2B1),
Linuxx64 HotSpot archive `OpenJDK25U-jdk_x64_linux_hotspot_25.0.4.1_1.tar.gz`, recorded archive
SHA-256 `dbb698396d478e7fa2b1e50f4103324b2a99b90569ee27c33f2261f9215cf41e`.
No fresh archive verification is claimed: retained archive was not found under the inspected
`/opt/idea/tools` maxdepth2 search. Live installed-file pins below are successor observations.

All paths below are relative to `/opt/idea/tools/jdk-25.0.4.1+1`.

| Used configuration / identity file | Live SHA-256 |
|---|---|
| `bin/java` | `7380ce48ed5013735d2c8414db54adb8f981e7933ff594bd36f3baccddaafba3` |
| `lib/modules` | `6b11db4c84e8ac3b9500397753e02ad03450e904fa8656eb8fd2a2197e536b57` |
| `lib/server/libjvm.so` | `5e0fb6e83a5676090f28ff0b453e9199df06af1ff90d473c1b9837e41096114c` |
| `lib/libjli.so` | `7e7f36f97914708f5289433fc52b0787ffc66ecb0f4f31d09ad16bcd9e3c25aa` |
| `release` | `44be64b383baa18668afefbe9a780ae3a9d730a066eaaa92500f77bd1e4b934c` |
| `conf/security/java.security` | `7c43432bc33b890d4e750f6886f383785a35a9b6021c34c84fcde11bb15c152d` |
| `NOTICE` | `c02756bcd9fa8191bf0fda4451bc018414dd44ee35bf09922c24377a475e4b5a` |
| `legal/java.base/LICENSE` | `4b9abebc4338048a7c2dc184e9f800deb349366bdf28eb23c2677a77b4c87726` |
| `legal/java.base/ASSEMBLY_EXCEPTION` | `75292f03bf23d3db7c985aecc191029b93883200721ed23ed34a2e601463df33` |
| `legal/java.base/ADDITIONAL_LICENSE_INFO` | `a69bce275ba7a3570af6579cb0f55682cd75fedfcd49e0e8e9022270c447c916` |

Read actual NOTICE/LICENSE/Assembly Exception/additional information in full before authoring
this record. Compiler, crypto.ec and internal.ed module LICENSE paths resolve to the same
java.base LICENSE; observed crypto.ec additional/assembly hashes also match the table.
The historical internal unmodified-JDK disposition remains `APPROVED-WITH-OBLIGATIONS`;
this records exact F05 Q01 use, not inheritance of a Maven exception or a new Legal Review.
Retain all installed legal notices unmodified. Do not copy/modify/bundle JDK binaries or source.
Engineering checks do not approve distribution, patents, local regulatory obligations or T036.
Changed runtime/module/use requires new intake; unclear rights stop execution.

**Reference-only** sources read 2026-10-03:
[RFC8032](https://www.rfc-editor.org/rfc/rfc8032.txt) (IRTF, January2017),
[RFC8410](https://www.rfc-editor.org/rfc/rfc8410.html) (August2018), and
[IETF TLP5.0](https://trustee.ietf.org/documents/trust-legal-provisions/tlp-5/).
No RFC code/vector/text is imported. RFC8032 is an alternate-stream document; do not assume
the standard Code Components BSD grant applies merely because another RFC uses it.
This reference review creates no crypto-conformance PASS.

### Existing host harness utilities

Prospective Q01-only inventory: existing unmodified Ubuntu utilities, not product dependencies
or an F05/general tooling blanket approval. No install, resolution or redistribution.

| Utility / installed package | Version / license record | Binary SHA-256 |
|---|---|---|
| `/usr/bin/bash`; `bash 5.3-2ubuntu1` | `5.3.9(1)-release`; GPL-3+ | `3efccc187bafa75ff1e37d246270ab3e7aa559f242c7a52bf3ec2a1b5450bdbd` |
| `/usr/bin/sha256sum`, `readlink`, `stat`, `mkdir`, `chmod`; `rust-coreutils 0.10.0-1ubuntu2~26.04.1` | uutils `0.10.0`; upstream MIT; packaged dependencies MIT/Apache-2.0 | `f84e76ea4da1e0c4e92254bd0d7dccdabe2c8b3098e734f27997dae3ee5d8e02` |

Read installed package copyright records in full. Retain their installed notices; import no
implementation, documentation or vendored crate. `/usr/share/doc/bash/copyright` SHA-256
`06319d84c3e5ed096036f6a9310a030c7e84e50dff2b8a6792285c83ec0ada73`;
`/usr/share/doc/rust-coreutils/copyright` SHA-256
`f1ea5d8870ff83301cc4c129ecd5e0e3c998bd566a9b0036df899e84d9336bd6`.
The installed coreutils wrapper is not evidence that these binaries are GNU coreutils.
SSH/SCP use the existing Windows OpenSSH transport and pinned host key, not a new dependency.
Any utility/runtime/hash expansion reopens this scoped execution package.

## 3. Procedure and execution seam

First-party source:
`tests/ph1/f05-qualification/Ed25519KeySeparationQualification.java`.
No input credential and no arguments. Confirm exact committed source/hash from the publication
receipt, not a floating branch. After approval, copy only this source and `run-q01.sh` to the absent run root
`/home/phuclam/idea-f05a-20261003-37/qualification/`; create private directories with umask077,
stop if root already exists, and verify copied source hash before launch. No clone/download.

Before launch, match installed runtime pins and clear/reject Java option injection variables
(`JAVA_TOOL_OPTIONS`, `_JAVA_OPTIONS`, `JDK_JAVA_OPTIONS`) and external CLASSPATH for that
child process only. Do not edit host environment/security files. Capture runtime version,
provider name, exit status and hash of the bounded output. Record exact operator command,
source SHA and runtime file pins. Source-file launch may compile in-process; no build plugin.

Proposed provisioning through the existing strict-host-key SSH connection, only after approval:

```bash
umask 077
test ! -e /home/phuclam/idea-f05a-20261003-37 && test ! -L /home/phuclam/idea-f05a-20261003-37 || exit 3
/usr/bin/mkdir -- /home/phuclam/idea-f05a-20261003-37
/usr/bin/mkdir -- /home/phuclam/idea-f05a-20261003-37/qualification
```

Do not use `mkdir -p`, reuse an existing directory or automatically remove it. Copy the two
exact committed blobs with SCP to those exact filenames; set both files to mode600 using
the commands below. Compare both SHA-256 values with the publication receipt
before launch; mismatch stops, without overwriting/retrying. No remote build or clone.

```bash
/usr/bin/chmod 600 -- /home/phuclam/idea-f05a-20261003-37/qualification/Ed25519KeySeparationQualification.java /home/phuclam/idea-f05a-20261003-37/qualification/run-q01.sh
/usr/bin/sha256sum -- /home/phuclam/idea-f05a-20261003-37/qualification/Ed25519KeySeparationQualification.java /home/phuclam/idea-f05a-20261003-37/qualification/run-q01.sh
```

Proposed command (SSH child environment; no host-wide environment change):

```bash
BASH_ENV= ENV= LD_PRELOAD= LD_LIBRARY_PATH= /usr/bin/bash --noprofile --norc /home/phuclam/idea-f05a-20261003-37/qualification/run-q01.sh
```

The runner pins source/runtime/utility hashes, canonical location and UID/mode before
`java --source 25 <exact-source-file>`. It clears Java/classpath injection variables.
The qualification procedure's copy/directory/hash/launch commands are NOT-RUN. The published
runner and this command set must be reviewed before executing; this code-writing
approval alone is not permission to launch it. No DB, network listener, TLS or private key file.

## 4. Oracle and evidence limits

| Item | Oracle | Actual |
|---|---|---|
| Q01 independent signing keys | Correct public key verifies; other independent key refuses; required runtime/vendor; exit0 and `F05_Q01=PASS; checks=1; algorithm=Ed25519` | `NOT-RUN` |
| Error/refusal | Runtime mismatch, unavailable provider or failed oracle: exit1 and bounded category; unexpected arguments: exit2 | `NOT-RUN` |
| Provenance | Exact committed source SHA + source hash; runtime/config hashes; command; observed provider; stdout/stderr exit result + log hash | Publication/command receipt required before execution |

Treat first GREEN as qualification of previously implemented JDK behavior; no fabricated RED
or Gateway implementation claim. Key pairs exist only in memory; harness prints no key bytes,
signature, password or proof. No evidence is retained until authorized execution.
Round-trip/key separation does not independently validate Ed25519 conformance, key entropy,
deterministic encoding, Grant/Receipt scope, TLS, Adapter containment or custody acceptance.
Those remain separate T027 or later F05 checks. T027 stays unchecked and F05-A IN_PROGRESS.

## 5. Next unit and stop boundary

Next: publish exact Q01 source/hash/runner and obtain execution approval; then observe first
result. Boot qualification still needs exact complete used graph/license/plugin intake before
POM/import/build. Do not select JDK-only as the Gateway runtime just because this probe is small.
The accepted Gateway direction remains Boot4.1.1 executable JAR. TLS/Adapter/fixture-size slices
follow their agreed seams and bounded approvals; no full imagined suite in advance.

## 6. Publication receipt — execution candidate, not execution evidence

Source/runner commit: `d01ad4a057a8a14c840320f0c664f6838d12a47e`.
These are exact Git blob byte hashes (LF), not inferred checkout identities:

| File | SHA-256 |
|---|---|
| `Ed25519KeySeparationQualification.java` | `ccf7e62043ccb072631410bf351d42b00b8442a93930e9425e2e99d439cba2a4` |
| `run-q01.sh` | `d92221a2c04642665c2b33f9adefd1bbfba2235d807fd48693edebf8bfa87670` |

Before SCP, require local file bytes to match these hashes; Windows CRLF conversion is a
mismatch, not a reason to change the pin. Any source/runner change requires a successor receipt.
This receipt is published after the candidate commit; it does not imply qualification ran.

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-10-03 | First-party JDK key-separation procedure and prospective scoped runtime inventory; no qualification execution |
