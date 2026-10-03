# T027 — HTTPS loopback transport execution packet

| Control | Value |
|---|---|
| Stable ID / class | IE-RES-F05A-T027-HTTPS-20261003 / synthetic transport qualification contract |
| Version / document status | 1.0 / Approved for the exact conversation-authorized contract; actual execution NOT-RUN |
| Product normativity / process instruction | INFORMATIVE / NOT-APPLICABLE |
| Owner / author / worker | Project Reviewer Nguyễn Huỳnh Phúc Lâm / Codex / CODEX_ONLY |
| Reviewer / authority | Project Reviewer, explicit “Authorize the next bounded T027 HTTPS transport qualification” instruction on 2026-10-03; no additional approval required inside that contract |
| Date / timezone / baseline | 2026-10-03 / Asia/Ho_Chi_Minh / predecessor f62b30d18cece4db61d3e16632806430828a83a7 |
| Classification / retention | INTERNAL; retain source, public certificate/store identities and private owned logs with T027 evidence; no private key/password in Git |
| Upstream | [Frozen preparation](2026-09-28-ph1-f05-gateway-qualification.md), [accepted root05](2026-10-03-f05a-q02-jsr305-root05-results.md#6-human-acceptance-successor--2026-10-03), [process exception](2026-10-03-t027-process-exception.md), [JDK intake](2026-10-03-f05a-t027-q01-execution-package.md), [filesystem evidence](2026-10-03-f05a-t027-filesystem-results.md) |
| Downstream | [Harness](../../tests/ph1/f05-qualification/https-loopback/README.md), future HTTPS freeze/result record, [tasks](../../specs/005-ph1-foundation-custody/tasks.md), [handoff](../../specs/005-ph1-foundation-custody/worker-handoff.md) |
| Change / supersession / trigger | New bounded transport execution authority; frozen predecessors and old STOP evidence unchanged. Any source/tool/hash/graph/target/scope drift requires STOP; no automatic repair/retry |
| Evidence / standards tailoring | Attributed human authorization plus read-only prerequisite observations, not an execution PASS; control/test records STANDARD-GUIDED under IE-STD-AUTH-001; no standards conformity or production claim |

## 1. Objective and exact boundary

Question: can the accepted Boot4.1.1 / Temurin25.0.4.1+1 stack serve one properly
validated HTTPS loopback endpoint on Ubuntu? It is an internal synthetic qualification,
not a Gateway implementation or supported product API.

Authorized predecessor dispositions: Q01 PASS; root05 JSR305 excluded graph QUALIFIED;
filesystem prerequisite PASS8/8. The current user instruction explicitly accepts these
predecessors. T027 is incomplete, F05-A remains IN_PROGRESS, PR38 stays Draft/Open.

Owned target, required absent before transfer:
`/home/phuclam/idea-f05a-20261003-37/https-qualification-01`.
Only listener: IPv4 `127.0.0.1:18447`.
Only endpoint: `GET /synthetic-probe` → 200 and exact UTF-8
`T027_HTTPS_PROBE_OK\n`.
No DB, Vault, file transfer, Grant/Receipt, product IAM/API/custody or apps/gateway code.

The qualification POM is byte-identical to accepted root05. Its first-party artifactId
`t027-jsr305-exclusion` is retained solely to keep the already-qualified packaging
model and narrow metadata exemption unchanged; it does not introduce JSR305 or a product artifact.

## 2. Exact admitted inputs, rights and preflight

The [source manifest](../../tests/ph1/f05-qualification/https-loopback/inputs.sha256)
pins every exported controlled input except the manifest itself. Its exact Git blob and
SHA-256 are recorded in the publication receipt before execution.

The [toolchain manifest](../../tests/ph1/f05-qualification/https-loopback/toolchain.tsv)
pins the existing JDK, Maven3.9.16, host utilities, legal files and installed JDK native
libraries. Extra installed-native pins are integrity guards, not selection of GUI/attach tooling.
The JDK archive lineage and unmodified internal-use APPROVED-WITH-OBLIGATIONS disposition
remain those of the linked Q01 intake. keytool is part of that same exact installed JDK,
explicitly authorized here; no new JDK/package/source is acquired or redistributed.
Installed notices remain unchanged. Actual legal files and keytool hash are pinned before use.

Exact unchanged external model inputs:
115 acquisition rows / 99 JAR coordinates, 242 cached POMs after excluding JSR305,
52 Maven-core distribution JARs, four qualified plugin realms, application collection38
and executable payload32 after six exact hash-pinned metadata-only starters are omitted.
The old JSR305 BLOCKED-LEGAL rights record remains historical and unchanged.

Only offline isolated-copy use of the already admitted cache is permitted.
The T027 known-term process exception does not create rights or legal/commercial approval.
Retain all embedded LICENSE/NOTICE/acknowledgement/source-handling evidence. No newly
discovered external component/version is admitted implicitly.

Preflight: raw exported-file hashes match committed bytes; manifest blob identity matches;
transfer archive hash matches; remote extracted inputs match; ROOT is fresh, private and not
symlinked; injected JVM/Maven variables absent; existing tooling/models/graphs hash match.
Missing or changed input → STOP, no Internet resolution/replacement.

## 3. Published phase commands

Run from the exact owned root with source S (the committed/pushed packet SHA):

```bash
bash tests/ph1/f05-qualification/https-loopback/run.sh "$S" build
bash tests/ph1/f05-qualification/https-loopback/run.sh "$S" prepare
# Publish run/tls-freeze.txt and its exact SHA F to PR38 before starting Boot:
bash tests/ph1/f05-qualification/https-loopback/run.sh "$S" probe "$F"
```

The build command reconstructs a new isolated repository, verifies JSR305 absence, then
runs only the four direct goals with both settings explicitly empty:

```text
mvn --offline --batch-mode --no-transfer-progress -X -Dstyle.color=never
 --settings <owned-package>/empty-settings.xml
 --global-settings <owned-package>/empty-settings.xml
 -Dmaven.repo.local=<owned-root>/run/repository -f <owned-root>/run/application/pom.xml
 org.apache.maven.plugins:maven-resources-plugin:3.5.0:resources
 org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile
 org.apache.maven.plugins:maven-jar-plugin:3.5.1:jar
 org.springframework.boot:spring-boot-maven-plugin:4.1.1:repackage
```

No lifecycle goal, test runner, Clean/Exec/Surefire/download/install is used.
The unchanged graph/realm/loader/provider/runtime payload oracles run before TLS creation.
The new first-party BootProbe is packaged only in this synthetic artifact.

## 4. Fresh TLS preparation and pre-listener freeze

prepare creates run/tls, mode700, all files600, with three independently random one-run
passwords in private files, never in command arguments/output/Git. keytool -storepass:file
and -keypass:file refer only to those paths.

Exact keytool recipe is source-controlled in TlsQualification.java:

- server alias listener, PKCS12 listener.p12; EC secp256r1, SHA256withECDSA;
  DN CN=T027 HTTPS loopback test,O=IDEA synthetic qualification; validity2days;
  SAN=ip:127.0.0.1, KU=digitalSignature, EKU=serverAuth.
- export certificate.der; import only that certificate into positive-trust.p12.
- generate a separate unrelated synthetic trust anchor (EC, two-day validity, BC=ca:true),
  export unrelated.der; import only it into negative-trust.p12. It is never a listener,
  is not a company/system root and is not trusted by the positive client.
- all six concrete keytool commands are retained with file-path password arguments only.

Before listener launch, publish the exact source, subject, SAN, serial, notBefore/notAfter,
certificate DER SHA-256/fingerprint, listener-keystore hash, both truststore hashes,
material-manifest hash, qualified-JAR hash and original-input/global-trust snapshot hashes.
prepare finishes with LISTENER=NOT_STARTED. probe requires the externally published freeze
hash and revalidates all frozen material before process start.

Ubuntu /etc/ssl/certs, /usr/local/share/ca-certificates, /etc/ca-certificates.conf and the
pinned JDK cacerts are read-only before/after snapshots. No trust-store import targets them.
Windows trust stores and global/user JVM/Maven settings are not accessed or changed.

## 5. Real HTTPS seam and oracles

Boot is one owned child PID, environment cleared, no external arguments/config, hard-pinned
address/port/HTTPS/owned PKCS12. IPv4-only JVM preference is a binding determinism setting,
not TLS-policy weakening. No second connector or HTTP fallback is configured.

JDK HttpClient uses standard TrustManagerFactory with an explicitly supplied dedicated
store, SSLContext TLS, HTTPS endpoint identification, no proxy and no redirect.
No trust-all manager, permissive hostname verifier, TLS-disable property or global SSL override.

| Check | PASS oracle |
|---|---|
| Exact build/source/tool preflight | All hashes/models/115-row graph/four realms/package oracles match before listener |
| TLS material | Fresh private stores; exact IP-only SAN; two-day validity; positive cert-only store; unrelated negative anchor; published freeze matches |
| Actual binding | /proc/<owned PID>/fd socket inode joined to /proc/net/tcp{,6}: exactly one LISTEN row, IPv4 127.0.0.1:18447; system port also exactly one row |
| Positive | Normal chain trust and endpoint identity; 200, exact body; application probe count1; SSLSession cert matches frozen leaf |
| Untrusted | SSLHandshakeException with PKIX/certpath cause against unrelated truststore, no application response |
| Mismatched identity | https://localhost:18447 with positive store: SSLHandshakeException identifying localhost SAN mismatch |
| No negative dispatch | Second valid IP request returns count2, so neither negative reached application |
| Actual TLS evidence | Successful SSLSession protocol, cipher, peer subject/SAN/serial/SHA-256; no wider TLS policy inference |
| Cleanup | Finally SIGTERM only owned child, normal exit within10s; no remaining18447 listener; shutdown total2 |
| Final integrity | All controlled source/tools/cache and TLS material unchanged; system-trust snapshot identical; no generated password in retained Boot log |

## 6. STOP, cleanup and result semantics

Any preflight/tooling/build/material/handshake/identity/binding/oracle defect stops its exact
stage. Do not dynamically repair or retry. Single-use run/TLS/probe guards prevent overwrite
or silent reuse. If started, always terminate only the owned child in finally. A forced-kill
fallback is safety cleanup, not PASS. Never kill unrelated processes or delete another root.

Retain private raw logs and synthetic TLS material under the owned root for review;
do not publish keys/passwords. Hashes identify files but do not replace independent raw-log
review. Only sanitized records and certificate identities enter Git.

All listed oracles PASS → T027 HTTPS LOOPBACK QUALIFICATION = PASS.
This qualifies transport capability only; not production TLS, Gateway, Adapter, wire formats,
whole T027 or F05-A. No preview/trust-store/firewall/database action, T028–T034, verifier,
timer restart or merge is authorized.

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-10-03 | Record explicit transport authorization and exact packet before execution; predecessor bytes/evidence preserved |
