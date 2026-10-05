# IDEA Gateway — current implementation and qualification

Dedicated Boot4.1.1/Java25 executable-JAR data plane; never Server/DB/session/RBAC authority.
Configured pinned Server Grant key verifies the frozen IEPH1ENV v1 scope. Private filesystem
candidate, exact size/full SHA-256, contiguous persisted1MiB ranges and same-transfer query.
Separate Gateway key signs completed Receipt; Server alone can accept relational custody.

Implemented component paths: security/TransferGrantVerifier.java, security/GatewayEnvelope.java,
receipt/TransferReceiptSigner.java, transfer/GatewayTransferService.java and
adapter/FilesystemVaultAdapter.java under src/main/java/com/idea/ddm/gateway.
Public-boundary tests: GatewayTransferTest and adapter/FilesystemVaultAdapterTest under src/test.

Current executed component evidence is in tests/ph1/f05-qualification/gateway/README.md.
Component25-case Gateway and13-case Adapter qualifications are not HTTP/end-to-end PASS.
GatewayApplication now serves HTTPS range/status handlers through the qualified service.
Actual1KiB HTTP tracer and30s stalled-upload refusal passed. Whole-range/control elapsed
deadlines, full negative matrix and Server/client end-to-end qualification remain outstanding.
Never treat this intermediate checkpoint as complete F05/product deployment qualification.

POM derives the already qualified exact38-collection/32-payload runtime and four offline
plugins. No JSR305, JDBC/Flyway/Server, Web assets, security provider or new dependency added.
Main/source/artifact identity are first-party successors, not a runtime graph substitution.
The bounded T029–T034 process exception governs build/test only; no production/legal/commercial
claim. Actual realm/hash/package oracles remain mandatory. No verifier or automatic merge.
