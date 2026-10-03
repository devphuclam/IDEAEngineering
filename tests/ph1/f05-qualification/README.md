# F05 T027 qualification harness

Internal qualification source only. It is not `apps/gateway`, a supported endpoint, or an
IDEA Grant/Receipt implementation. Work Item [#37](https://github.com/devphuclam/IDEAEngineering/issues/37)
owns the preparation and the [execution package](../../../docs/research/2026-10-03-f05a-t027-q01-execution-package.md).

## First vertical slice: Q01

Agreed seam: actual installed JDK Ed25519 public signing/verification APIs. Observe exit status
and bounded summary output from an external process. No mocked provider or first-party crypto.

- Generate two independent synthetic key pairs in memory.
- Sign one synthetic message using the first private key.
- Its public key must verify; the other public key must refuse the same signature.
- Observe the actual provider name and require the approved runtime version/vendor.
- Never print/write private keys, public keys, signatures, credentials or payload bytes.

One logical check: key separation. This does **not** independently prove algorithm conformance,
entropy strength, cross-runtime interoperability, deterministic IDEA encoding, production key
custody, purpose enforcement inside a future verifier or complete transfer security.
An independent known-answer vector remains a later qualification check, not inferred from this
round-trip. RFC8032/8410 are reference-only in this slice; no external vector/source imported.

Q01 execution is **PASS**, 2026-10-03, exact source/runner `d01ad4a057a8a14c840320f0c664f6838d12a47e`;
see execution package §7. This is first GREEN of existing provider behavior, not invented
RED→GREEN implementation evidence. A failing
runtime/vendor/provider remains FAIL; do not substitute another crypto library or runtime.

Run only after approval of the exact-source execution package. This slice requires no POM,
Maven, npm, Node, JUnit, Python, DB, HTTPS, certificate, port or Gateway process. Subsequent Boot,
TLS and Adapter slices need their exact graph/contracts/execution records before use. Do not
prewrite a full imagined test suite or mark T027 complete from Q01.
