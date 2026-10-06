# Synthetic T027 HTTPS harness

Scope and human authorization: [controlled execution packet](../../../../docs/research/2026-10-03-f05a-t027-https-contract.md).
Current successor: [attempt02 repair authorization](../../../../docs/research/2026-10-03-f05a-t027-https-retry02.md).
Attempt01 source/material/STOP remains retained; current owned root is https-qualification-02.

This is not apps/gateway or a product API. Keep Q01/root05/filesystem evidence unchanged.
Use the already-qualified POM/cache/realm/package oracles, then fresh dedicated test TLS.
The unchanged first-party artifactId does not select JSR305.

From the fresh owned Ubuntu root:
`bash tests/ph1/f05-qualification/https-loopback/run.sh <source SHA> build`
then `... <source SHA> prepare`.
Publish the TLS freeze and SHA before `... <source SHA> probe <freeze SHA>`.

The build phase first checks the bounded refusal classifier (two positive, six negative
fixtures plus the historical substring-predicate RED witness) before Maven execution.
Per-case safe observations are retained before a later STOP; actual live TLS is still required.
Source-file runners use only JDK standard APIs. Probe uses actual Boot servlet HTTPS and
normal JDK HttpClient PKIX/HTTPS identity verification. Negative clients must not dispatch
the synthetic endpoint. Socket proof joins actual owned process inode to /proc listener rows.

Every phase is single-use. Any unexpected failure STOP; no source edit/retry during execution.
Process cleanup runs even when a TLS oracle fails; only the owned PID may be terminated.
All private stores/passwords stay under run/tls mode700/files600, never Git.
No DB, Vault, preview, system trust-store change, download, verifier, timer action or merge.
