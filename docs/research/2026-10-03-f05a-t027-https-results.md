# T027 HTTPS loopback — attempt01 STOP receipt

| Control | Value |
|---|---|
| Stable ID / class | IE-RES-F05A-T027-HTTPS-RESULT-20261003 / qualification execution evidence |
| Version / status | 0.1 / Draft; attempt01 STOP; whole HTTPS NOT-QUALIFIED |
| Product normativity / process instruction | INFORMATIVE / NOT-APPLICABLE |
| Owner / author / worker | Project Reviewer Nguyễn Huỳnh Phúc Lâm / Codex / CODEX_ONLY |
| Reviewer / acceptance authority | Project Reviewer; result review pending, no PASS acceptance inferred |
| Date / timezone / environment | 2026-10-03 / Asia/Ho_Chi_Minh / actual Ubuntu, existing pinned Temurin25.0.4.1+1, Maven3.9.16, Boot4.1.1 |
| Exact execution source | 64ee0b0c34a4fefca45c1098852d511ffc19e3a2; no source/oracle change after start |
| Pre-listener freeze publication | 93b34630d086c002365ec4ea54e14043ced84a18; successor changed only the freeze receipt |
| Classification / retention | INTERNAL; private raw logs and fresh test stores retained under owned root mode700/files600, no credentials/private keys in Git |
| Upstream | [Approved execution contract](2026-10-03-f05a-t027-https-contract.md), [exact TLS freeze](2026-10-03-f05a-t027-https-freeze.md), accepted Q01/root05/filesystem predecessors |
| Downstream / trigger | Issue37/PR38, current handoff; bounded detector/diagnostic repair and fresh-root retry require explicit authority |
| Supersession / change | New actual STOP record, not a rewrite of PASS predecessors or frozen packet; no retry/source repair performed |
| Evidence / standards tailoring | Actual command exits and retained raw-log hashes, plus explicitly identified control-flow inference; STANDARD-GUIDED under IE-STD-AUTH-001; no conformity/production claim |

## 1. Execution order and immutable lineage

Source packet commit/push and [publication comment](https://github.com/devphuclam/IDEAEngineering/pull/38#issuecomment-5968198910)
preceded every phase. Exact local exported inputs17/17 and committed blob identities18/18
PASS. Manifest SHA-256:
`348d9f2525b5c6470ac9631e419557b8ce2fa4f337248f0012fabf20bb3118ed`.
Transferred ZIP SHA-256:
`bcdf33a08e760754d6d162fa7f67f25cad6603d89b7666e0884147efd8375ddb`;
remote archive identity and raw extracted17/17 plus manifest PASS.

Fresh owned root:
`/home/phuclam/idea-f05a-20261003-37/https-qualification-01`.
Port18447 and target were absent before provisioning. Root owner phuclam, mode700.
The three exact phase commands in the contract ran once, from unchanged source.

1. build: exit0; isolated99JAR/242POM, no JSR305; actual115-row graph and four realms PASS.
   Loader/provider/build-tool guards and collection38/payload32 projection PASS.
2. prepare: exit0; fresh short-lived IP-only leaf, dedicated stores, hashes/identity PASS.
3. Freeze was committed/pushed and [published](https://github.com/devphuclam/IDEAEngineering/pull/38#issuecomment-5968219031)
   before probe. Freeze SHA:
   `1b8881d8b3a1be15d92e4767d97dfc1014c9844af6365ade9736bff2fd8cea7f`.
4. probe: exit2; STOP at the endpoint-identity refusal classifier. No source repair/retry.

Qualified synthetic package SHA-256:
`204276faf7280769df10ec4f9ed235d72c364209cf82f3f3e0a50bbb022b551c`.
Certificate/store/source identities remain exactly those published in the freeze.

## 2. Exact STOP and evidence limits

Retained probe output:
```text
TLS_NEGATIVE_TRUST=SSLHandshakeException
STOP: IllegalStateException: wrong TLS refusal category
```

This STOP occurs inside TlsQualification.refusal() for the localhost negative after an
SSLHandshakeException was caught. The first-party classifier requires cause text containing
both “subject alternative” and “localhost”. It rejected the encountered cause text.

The current harness does not persist that cause chain before throwing its own generic STOP.
Therefore the exact underlying message is UNKNOWN in retained evidence. Do not manufacture it
or count the endpoint-identity oracle as qualified merely because SSLHandshakeException occurred.

Read-only reference inspection of official
[OpenJDK25-GA HostnameChecker](https://raw.githubusercontent.com/openjdk/jdk/jdk-25-ga/src/java.base/share/classes/sun/security/util/HostnameChecker.java)
on2026-10-03 shows separate DNS-SAN and common-name fallback rejection messages. A leaf with
IP SAN but no DNS SAN can take the fallback path. **Inference only:** this explains why a
classifier requiring the DNS-SAN wording can reject a correct hostname refusal.
That reference is not proof of the exact live Temurin patch message or cause in this run.
No source text was imported. No exception category was relaxed and no new probe ran.

The listener-scope and first positive response/peer-certificate assertions precede the logged
trust-negative success in executed source. Their guards therefore completed before STOP.
Boot log also identifies connector https-jsse-nio-127.0.0.1-18447, owned PID76907 and one
application dispatch (shutdown count1). However the current runner retains negotiated
protocol/cipher and socket rows only in its final result file, which was NOT created.
Thus their exact values are UNKNOWN in the durable record. No broader TLS-policy claim.

| Oracle | Actual disposition |
|---|---|
| Source/export/transfer/tool/graph/package preflight | PASS, executed and retained |
| Fresh dedicated TLS material and published freeze | PASS, executed and retained |
| Initial owned loopback and positive IP guards | Completed before STOP; control-flow inference plus Boot connector log, not a complete final TLS receipt |
| Untrusted-chain refusal | PASS for this executed negative; logged SSLHandshakeException and PKIX/certpath classification |
| localhost endpoint-identity refusal classifier | FAIL / STOP; underlying cause message not retained |
| Post-negative count2/negotiated TLS receipt/final in-harness oracle | NOT-RUN / not durably retained; do not report them PASS |
| Whole HTTPS qualification | NOT-QUALIFIED; no final PASS record |

This is a first-party harness/oracle/diagnostic gap, not evidence of JSR305 dependency failure
or a reason to bypass trust/hostname checking. The exact live TLS failure classification
needs a properly retained successor witness.

## 3. Owned cleanup and post-STOP read-only integrity audit

The process was terminated in finally, not left running:
```text
OWNED_PID=76907
NORMAL_TERMINATION=true
PROCESS_ALIVE=false
REMAINING_18447_LISTENERS=0
```

Boot log records graceful shutdown completed, T027_PROBE_TOTAL=1. Independent read-only
checks confirmed /proc/76907 absent and ss showed no18447 listener.
No other process was stopped, no second listener or plaintext fallback started.

Since STOP precedes the normal final audit section, a separate read-only post-STOP audit
checked existing records without executing Java/Maven/Boot again:

- sha256sum -c run/controlled-originals.sha256: exit0,497 distinct source/tool/cache records
  unchanged, including all82 tooling/configuration pins and the manifest.
- sha256sum -c run/tls-material.sha256: all6 generated material hashes unchanged.
- A checksum-only audit manifest was derived from the previously recorded system-trust
  snapshot, then sha256sum checked all247 file/symlink-target content hashes: exit0.
  This confirms existing trust content unchanged, **not** a re-execution of the in-harness
  full directory/link-metadata snapshot oracle (that remained unexecuted after STOP).
- Generated password-file patterns were checked against retained build/prepare/probe/Boot/
  keytool logs using grep -q -F -f: no match; no password value printed.
- All retained logs600; owned root/private TLS directory700.

No Windows certificate-store operation, system trust import, cacerts/global JVM/Maven
configuration change, DB/Vault/preview/firewall change or external artifact acquisition occurred.

## 4. Retained raw-file hashes

Paths relative to the exact owned root above. Public hashes identify private files; the Project
Reviewer has not independently read raw host logs through GitHub.

| Retained file | SHA-256 |
|---|---|
| build.log | fe9f5225a02316025ccda54fb8bf531fd94a428fdc74748f094042627f702247 |
| prepare.log | 350e4bcc4ce1f3b3946f74d69d398a6a1dace2f9b87b089360d3b2d065c13566 |
| run/logs/maven.log | 92d3750169a09f7fe323b08fb6475cd839d3551d88e64183cbc0eb9ef46054df |
| probe.log | a52a3172f5bf96ed940f2a7c02119445b61cbbf8338c2c73dee915f9f03aabbd |
| run/logs/https-boot.log | ef054e6b521cdba92bd6156b094e90b4c0fc1f4e96cb3298cc7a7ac8a0c3a4f7 |
| run/cleanup.txt | 3fa0d602200d823a8ccc22cd1a1e3c54fd5dc1979d9cf715d9b1b72d1b509f72 |
| run/probe-started.txt | b4d5ddb6e8820e7612ce13727e03e669cbcf2eb0b5094a51b01a8017392ad5e4 |
| run/controlled-originals.sha256 | fb73da936f3797b698e5f97085fa934aae63bb3e8a26f1ed224d1783af680c0e |
| final-originals-check.log | 5430e33029cd1b623a5400630f18c3a42693e1e1fb13558ad5b1b2e42b661dde |
| system-trust-audit.sha256 | 2ea895c338d72a44bb7360719d21ac2b689d457f38571e6fc1dacaaa5281e637 |
| final-system-trust-check.log | f7e6a165cec43575243fdc88393a89511fad6b7be02cba5353962159e5614ca5 |

run/https-result.txt is absent. Certificate/store/material/snapshot hashes remain in the
pre-listener freeze; nothing was rewritten as PASS.

## 5. Proposed smallest successor — NOT AUTHORIZED / NOT IMPLEMENTED

For reviewer direction only:

- Keep standard trust and HTTPS endpoint verification unchanged.
- Correct only the bounded localhost refusal classifier to recognize the applicable
  CertificateException identity-mismatch cause forms; do not accept arbitrary handshake failures.
- Persist safe per-case protocol/cipher/socket/result facts and sanitized failure category
  before STOP so a future detector failure does not lose the actual witness.
- Publish exact successor inputs/hashes/commands before execution.
- Use a new owned https-qualification-02 root with fresh test-only material; preserve01.
- No POM/graph/version/rights/product/trust-policy expansion.

This proposal is not permission to implement or retry. STOP remains in force.

Q01 PASS, root05 QUALIFIED and filesystem8/8 PASS unchanged.
T027 incomplete; F05-A IN_PROGRESS; Issue37 open; PR38 Draft/Open.
No T028–T034, Gateway product code, verifier, timer action or merge.

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-10-03 | Preserve attempt01 endpoint-refusal-classifier STOP, exact cleanup and read-only rehash; no dynamic repair or retry |
