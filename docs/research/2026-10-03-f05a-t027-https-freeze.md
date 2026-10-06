# T027 HTTPS — pre-listener TLS identity freeze

| Control | Value |
|---|---|
| Stable ID / class | IE-RES-F05A-T027-HTTPS-FREEZE-20261003 / exact execution identity receipt |
| Version / status | 1.0 / Frozen identity receipt; HTTPS execution NOT-RUN |
| Product normativity / process instruction | INFORMATIVE / NOT-APPLICABLE |
| Owner / author / worker | Project Reviewer Nguyễn Huỳnh Phúc Lâm / Codex / CODEX_ONLY |
| Authority / date / timezone | Explicit bounded HTTPS contract authorization, no further approval inside contract / 2026-10-03 / Asia/Ho_Chi_Minh |
| Baseline / change | Source 64ee0b0c34a4fefca45c1098852d511ffc19e3a2; fresh https-qualification-01 |
| Classification / retention | INTERNAL; public certificate/opaque store hashes only; private keys/passwords stay owned server root mode700/files600 |
| Upstream / downstream | [Execution packet](2026-10-03-f05a-t027-https-contract.md) / later probe result; Issue37/PR38 |
| Supersession / trigger | No predecessor altered; any frozen source/material/tool/hash/target drift STOP |
| Evidence / tailoring | Observed build and TLS preparation output, not handshake PASS; STANDARD-GUIDED configuration/test control under IE-STD-AUTH-001; raw-log access limitation retained |

## 1. Publication prerequisite receipt

Source packet was committed/pushed and published before execution:
[PR comment](https://github.com/devphuclam/IDEAEngineering/pull/38#issuecomment-5968198910).

Local raw exported17/17 and Git blob18/18 checks PASS.
Manifest blob `b6c1f0393fc56312aeb0eb71801103c0828fcbc9`;
SHA-256 `348d9f2525b5c6470ac9631e419557b8ce2fa4f337248f0012fabf20bb3118ed`.
Transferred ZIP SHA-256 `bcdf33a08e760754d6d162fa7f67f25cad6603d89b7666e0884147efd8375ddb`
matched on Ubuntu; extracted17/17 plus manifest PASS.
ROOT absent before creation, resulting owner phuclam / mode700; port18447 had no listener.

Offline direct-goal build exit0, BUILD SUCCESS; 99 JAR /242 POM isolated repository,
JSR305 absent;115 collection rows, four exact plugin realms; package projection
collection38 /payload32 with six pinned metadata-only omissions PASS.
No Boot listener was started by build or prepare.

TLS prepare exit0; six published keytool commands used owned file-path password arguments.
Exact IP-only SAN, two-day validity, dedicated positive store containing the generated
certificate only and unrelated negative store all PASS. Global trust snapshot and original
controlled inputs unchanged. These facts do not claim TLS handshake or endpoint verification.

## 2. Exact frozen certificate and stores

Exact `run/tls-freeze.txt` bytes:

```text
SOURCE=64ee0b0c34a4fefca45c1098852d511ffc19e3a2
ROOT=/home/phuclam/idea-f05a-20261003-37/https-qualification-01
LISTENER=NOT_STARTED
SUBJECT=CN=T027 HTTPS loopback test,O=IDEA synthetic qualification
SAN=IP:127.0.0.1
SERIAL_HEX=d695b1ca64aec5a5
NOT_BEFORE=2026-10-03T10:20:04Z
NOT_AFTER=2026-10-05T10:20:04Z
CERT_SHA256=4d68d8829f21c815b1c9d41ac344f5dfdf9d1b185a1a4a27639b74775cc0c0f0
KEYSTORE_SHA256=5107b45a779ca2e76eb927dbdb88ce82763f767525e055b5aa5d57b0bcc90e8e
TRUSTSTORE_SHA256=496f3e9673b2de951ac253af5660379f778f938f863c8a504b6e404b3e11cbc5
NEGATIVE_TRUSTSTORE_SHA256=7d4d13d064e0a1e1678e747c8a1d85ec91457047897ee14fa839a41d93249394
MATERIAL_MANIFEST_SHA256=787a0e3ca4db201a3e675a5be36752c89adbb3f5aa5b3b9ba0412ad9d3808f06
CONTROLLED_SNAPSHOT_SHA256=fb73da936f3797b698e5f97085fa934aae63bb3e8a26f1ed224d1783af680c0e
SYSTEM_TRUST_SNAPSHOT_SHA256=9fd3f7643df101283afc2b69589dd1bb73e8ae53522d7e6d9a85910e2dd76bff
JAR_SHA256=204276faf7280769df10ec4f9ed235d72c364209cf82f3f3e0a50bbb022b551c
GLOBAL_TRUST_UNCHANGED=PASS
```

Freeze-file SHA-256:
`1b8881d8b3a1be15d92e4767d97dfc1014c9844af6365ade9736bff2fd8cea7f`.

Certificate DER hash above is also its SHA-256 fingerprint.
Validity corresponds to 17:20:04 03/10 through 17:20:04 05/10/2026 project time.
This synthetic self-signed leaf is only trusted by the dedicated positive harness store.
No Windows/system/JDK-global trust installation occurred.

## 3. Authorized next command, after this receipt is pushed

```bash
cd /home/phuclam/idea-f05a-20261003-37/https-qualification-01
bash tests/ph1/f05-qualification/https-loopback/run.sh 64ee0b0c34a4fefca45c1098852d511ffc19e3a2 probe 1b8881d8b3a1be15d92e4767d97dfc1014c9844af6365ade9736bff2fd8cea7f
```

One owned IPv4 HTTPS listener only; normal chain/endpoint verification, untrusted and
localhost/SAN-mismatch negatives, actual TLS evidence, mandatory owned termination and
final rehash. No source or oracle change after preparation.

## 4. Remaining status

HTTPS probe NOT-RUN at this publication. Q01/root05/filesystem predecessors retain
accepted scoped results. T027 incomplete, F05-A IN_PROGRESS, PR38 Draft/Open.
Private raw logs remain on the server: hashes identify them, not independent log review.
No DB/Vault/preview/trust-store modification, download, T028–T034, verifier, timer action
or merge. Preparation is not Gateway, Adapter or production TLS qualification.

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-10-03 | Publish observed TLS identities after prepare and before any HTTPS listener |
