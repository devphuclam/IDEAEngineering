# T033/T034 actual client qualification

This first-party Node harness uses the project-admitted Node24.19.0 Windows x64
binary only (SHA-2563602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237).
No npm package, installation, network resolution, listener or trust-store change.

## First vertical slice — source publication before execution

Approved seam: client file-to-range preparation for the frozen 1MiB range profile.
Input: a fresh OS-temp `idea-f05-client-*` directory containing synthetic bytes.
Command, from repository root:

```powershell
& 'C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --test tests/ph1/transfer-smoke/client-transfer.test.mjs
```

Before execution commit/push source, record Git SHA and SHA-256 of both `.mjs`
inputs, and verify the admitted binary hash/version. Rehash inputs/tool afterwards.
RED oracle: named CLIENT_RANGE_READER_NOT_IMPLEMENTED failure, not a missing tool.
GREEN oracle: exact half-open range, original bytes and known literal chunk digest.
Successor qualification also reads a sparse 64MiB synthetic zero file, requiring
64 contiguous ranges of exactly1MiB with known literal SHA-256 per range. This
qualifies the existing bounded reader, not network transfer or throughput.
Next tracer tests the frozen Gateway response interface: i64 verified bytes,
u32 Receipt length, exact opaque Receipt bytes. Zero Receipt is progress only;
truncated/trailing/oversized response or impossible progress must refuse. Named
CLIENT_PROGRESS_NOT_IMPLEMENTED is the RED witness. This parser does not verify
Receipt authority; that remains the independent Server acceptance boundary.
The next qualification reuses the existing first-party P05 generator through the
same admitted Node binary (never the historical server runtime). Fresh temp
`p05-fixtures` target only, expected governing P05 literal size/hash pairs; stream
both via the client reader and independently compare complete digests. Include
`tools/p05-fixtures/generate-fixtures.mjs` in input hashes before/after execution.
Previously implemented preparation may already be GREEN; do not manufacture RED.
Cleanup removes only the exact fresh synthetic fixture in the test's `finally`.
Hash/version drift STOP; no silent download/replacement. Retain safe test output,
source identities and counts. No password, Grant, Receipt, cookie or CSRF capture.

This test is client preparation only, **not** actual HTTPS/Server/PostgreSQL/Gateway
qualification. T033/T034 remain unchecked until real-transfer and refusal matrices
execute. Actual transfer must use ordinary Server session/CSRF, direct Gateway
bytes, normal TLS verification and independent Server custody acceptance.
Private storage paths are never client-selected; no permission-free product route
or manufactured Receipt is introduced by this local slice. PR38 Draft/Open;
verifier NOT-RUN; no merge or timer action.

## Actual end-to-end attempt01 — published execution contract

Attempt25 transferred both actual P05 fixtures and accepted same-Receipt retries,
but final logout failed CLIENT_COOKIE_REFUSED: Spring clears a cookie using an
empty value/Max-Age0 without the positive-cookie HttpOnly attribute. Whole attempt
remains FAIL and cleaned its exact marked schema/listeners. Fresh26 accepts only
Secure/host-only/Path=/ empty Max-Age0 deletion of the already-known IDEA_SESSION;
positive cookies still require Secure/HttpOnly and now explicitly SameSiteStrict.
No product/authentication/TLS change. This is the observed client parser RED;
rerun all actual flow on fresh26 for GREEN and independent custody/file oracles.

Attempt24 identified CERT_NOT_YET_VALID: observed Windows UTC09:53:20 vs Ubuntu
09:54:41 on2026-10-05; fresh cert NotBefore09:54:06. TLS correctly refused.
Fresh25 recipe issues a new harness-only certificate with explicit NotBefore
host-local now minus5 minutes and unchanged2-day certificate lifetime. This
accommodates observed clock difference in certificate issuance, not TLS bypass,
Grant/Receipt validity grace, system-clock change or system trust modification.
Freeze actual interval/fingerprint as before. All prior failed roots retained.

Attempt23 failed at TLS_READY/CLIENT_NETWORK_REFUSED and cleaned owned listeners/
marked schema. Standalone owned SSH-forward TCP connection succeeds. Fresh24 adds
only bounded OS/TLS error code (uppercase/digits/underscore max64, no message or
proof) to distinguish network from trust refusal. No TLS validation weakened.

Attempt22 failed at TLS_READY with safe ASSERTION before transfer; owned listeners
and schema cleaned. Fresh23 retains the last fixed client readiness error code,
not a generic assertion. No trust/endpoint bypass or changed oracle. Paths follow23.

Attempt01 at7d67a6f stopped before client readiness: Server used IPv4-mapped
IPv6 loopback, violating this harness's exact IPv4-only listener oracle. Owned
listeners stopped, marked schema f05_51af2164cbc34f0cbf0f0745bcca0b15 cleaned,
database retained. This is a first-party JVM fixture configuration failure,
not transfer/product/TLS failure or PASS. Preserve run-receipt-green-20 unchanged.
Successor attempt02 uses fresh run-receipt-green-21 with the same contract and
Surefire JVM -Djava.net.preferIPv4Stack=true; no application/graph/oracle change.
client-e2e.mjs exact remote path follows21. Source/hash publication remains mandatory.
Attempt02 client returned generic FAIL without stage detail; do not infer a
transfer PASS. Read-only/safe scoped diagnostics established trusted HTTPS200,
real CSRF/login/session200, actual Gateway1KiB200 and Server Receipt acceptance200,
but these diagnostics are not the declared end-to-end PASS. Preserve attempt02.
Successor22 adds safe fixed stage/error-code diagnostics and actual failure marker
so the JUnit coordinator fails and cleans promptly; no sensitive error payload,
credential or control frame is logged. Same graph/TLS/product/oracles. Fresh root22.

Fresh server export/root `run-receipt-green-20/source` below the existing owned
`/home/phuclam/idea-f05a-t028-t030-20261005-37` boundary. Require absent target,
byte-preserving committed export/manifest/archive identity local and remote,
unchanged existing Server admitted inventory/offline Maven direct resources,
testResources, compile, testCompile, Surefire goals through `run-slice.sh`.
Selector TransferClientBoundaryTest, expected1 test,8-minute actual-client limit.
Same retained approved database; fresh marked `f05_<32hex>` schema only.
No public migration, old DB/preview/company/Vault data. Existing V1–V10 immutable.

Reuse exact previously qualified Gateway package, no rebuild/new graph:
`/home/phuclam/idea-f05-sprint-20261005-37/gateway-boot-08/source/run/application/target/idea-gateway-0.1.0.jar`
SHA-256c26b870e22a6ffb6ed9acbcbcd1dd20208004226c4d09a399e227983023a14e1.
Same JDK25.0.4.1+1; keytool SHA-256
e5e8b3a330267b3fd2b14e5e9f36eceafab0e45fb6e497dfeea59a33f1eb928e.
No dependency or tool installation. Fresh private TLS/key/config under
`apps/server/target/client-e2e-01` of that exact new export. JDK keytool creates
test-only EC PKCS12,2-day SAN IP127.0.0.1 certificate; hash/subject/SAN/serial/
validity freeze before either listener. No global/user/system trust changes.
Server127.0.0.1:18446 + Gateway127.0.0.1:18447 only, refuse occupied ports.
Node trusts only captured test CA and verifies endpoint normally; no bypass.

Run Windows admitted Node `tests/ph1/transfer-smoke/client-e2e.mjs` only after
safe F05_CLIENT_READY marker. Source/hash/node checks before/after. It owns one
SSH loopback tunnel for both exact ports, using existing pinned SSH key/host.
Private ready.json is read via SSH into RAM, never printed; synthetic credential
submission/cookies/CSRF and Grant/Receipt stay out of retained output. Generated
P05 fixtures are new Windows temp only, exact literal manifests, no user files.

Qualification-only HTTP bridge is registered manually by the test, not scanned
or included in production package; ordinary Server SecurityFilterChain/CSRF/
SessionService establish context. It invokes actual TransferGrantService and
TransferReceiptService, no raw/client ActorId, product role or product API added.
Owner fixture limits exact Actor/Organization/fixture/Vault/Gateway/scope.
The allocation oracle reads the exact newly owned Gateway private binding file,
then compares its allocated LocationId with independently verified Receipt.
This is explicitly a same-host **test-controlled allocation**, not qualification
of a production distributed allocation-discovery protocol or Server Vault access.
No permissive owner default and no client-selected storage path.

Node sends actual P05 bytes directly over Gateway HTTPS; Server receives only
metadata/control/Receipt. Both sizes must yield real signed Receipt and exact
Server relational custody + stored full size/digest. Lost status response/retry
resolves identical Receipt; repeated Server accept must retain one Audit/outcome.
Ordinary login/logout and post-logout401 required. JUnit independently verifies
Adapter files and relational companions before claiming PASS. No success from
client preparation or status alone.

On success/failure terminate only owned Gateway/Server/tunnel before exact marked
schema cleanup; retain DB/private run evidence/candidate bytes for review. Remove
only the newly generated ready.json credential handoff; keep historical roots.
Unexpected hashes/graph/target/TLS STOP, ordinary first-party defects repaired in
prospective fresh sources/roots preserving failed attempts. Other T034 matrices
remain open; this first qualification does not close all F05.

### Prospective retry27

Attempt26 again transferred both P05 fixtures and accepted identical Receipt
retries, but stopped at the client logout cookie parser. Independent final
custody oracle remained NOT-RUN. Preserve that failure, not an end-to-end PASS.
The successor client parser accepts the exact quoted-empty deletion form only
for an existing IDEA_SESSION, host-only Secure Path=/ Max-Age=0; positive proof
still requires Secure/HttpOnly/SameSite=Strict. Synthetic guard RED at531a190
was4 PASS/1 FAIL; GREEN at3c9ecaa was5/5. No credential/cookie value captured.
Fresh run-receipt-green-27, same published commands, source101-input manifest,
TLS recipe, package hash, scopes, graph, retained DB and final oracles above.

Retry27 still refused logout. Fresh28 retains the same detector and emits only
nine Boolean attribute flags on refusal: expected name, known name, empty value,
Max-Age0, Path=/, Secure, Domain present, HttpOnly, SameSiteStrict. No cookie value
or header is output. This prospectively published diagnostic distinguishes the
exact ordinary deletion attributes before any further parser change. Same full
flow/oracles, fresh root28; no historical PASS inferred and no product changes.

Fresh29 repairs the now-explained deletion: cached Tomcat11.0.24 bytecode
Rfc6265CookieProcessor emits ANCIENT_DATE for MaxAge0 without a Max-Age attribute;
CookieProcessorBase defines that date as Thu,01Jan1970 00:00:10GMT. Client accepts
that exact Expires form only when no competing Max-Age is present and all existing
known-empty-host-only-Secure-Path=/ deletion guards hold. It never creates a proof.
Safe observed flags at28 were1_1_1_0_1_1_0_0_1, matching synthetic regression RED
bc98ca0 (5 PASS/1 FAIL), GREEN1ac6997 (6/6). Same published full flow, fresh29,
same101-input preflight and all package/TLS/bytes/custody/shutdown oracles.

### Actual refusal/interruption/resume tracer30

Fresh run-receipt-red-30; same preflight/tooling/DB/package/TLS/loopback/cleanup
contract and source publication before execution. Expected client RED: after
one verified1MiB prefix and deliberately disconnected partial second request,
status must retain only that prefix with no Receipt. Existing uploadRanges sends
range0 again, violating resume-only-missing verified ranges. Observe actual HTTPS
request offsets/count, not a fake Gateway: next offset1048576,63 remaining ranges.
No product implementation change yet. Test also qualifies existing actual
missing-CSRF refusal, same-operation Grant response, modified signature refusal,
wrong chunk digest with zero progress, unchanged completed retry/changed bytes,
modified Receipt refusal and final canonical custody oracle. Inputs/frames remain
RAM/private only. Disconnection uses admitted Node HTTPS, normal CA/endpoint
verification, no intermediary/mock or Server byte relay. Other matrices stay open.

Actual RED30 source7d9c1e142a2642bf14b830e98a4e984382c8c4a1 reached
GATEWAY_UPLOAD_67108864 and refused offset0 instead of1048576 after interruption.
JUnit1 failure, no whole-flow PASS; owned listeners stopped. Fresh GREEN31 asks
actual status first, resumes only contiguous missing ranges, rejects impossible
progress and resolves existing Receipt without uploading again. Same commands,
101-input manifest, retained DB, package/hash/tool/TLS/oracles. Close the fixture
reader explicitly, no reliance on garbage collection. No product graph change.

Fresh qualification32 adds only a test-clock issuance and manually registered
test-only renewal bridge, never production clock/config/HTTP API. Issue64MiB
with injected issuance Clock hostnow-301seconds; actual Gateway UTC must refuse
expired signed Grant403 without creating bytes/Receipt. Explicit authenticated
CSRF renewal through actual Server service retains OperationId/TransferId/scope,
new GrantId/frame,300second validity. Old Grant stays refused, renewed transfer
passes the same full actual interruption/resume/custody matrix. Missing CSRF
cannot renew. No waiting300seconds or OS/Gateway clock changes. Existing behavior
qualification may first run GREEN; no manufactured RED. Same101-input/tool/graph/
package/target guards; fresh root32 and preserved prior attempts. This proves
expiry+explicit renewal before transfer, not renewal mid-range or production API.

Fresh33 tests lost completed-operation response after custody consumption:
unchanged same OperationId issue while still within original Grant lifetime must
resolve its canonical original frame/TransferId, not try inserting a second
transfer. Actual client expects200/same result after Receipt accepts, before
logout. Current find filters ISSUED only, so expected genuine RED at that seam.
Same exact recipe/owned fresh target/schema/tool/graph/TLS/package; no production
change yet. This does not authorize reusing consumed Grants for another operation.
