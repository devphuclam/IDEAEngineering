# PH1 — Which transfer diagrams to use

Reading guide, updated 2026-09-28. This page selects existing controlled views; it adds no
requirement, technology choice or implementation approval. DOC-05@0.26 and DOC-06@0.18 remain
the architecture and contract sources. [Correction and verification record](registers/VEV-2026-09-28-ph1-transfer-diagram-review.md).

## Start here

| Question | View and full-size image | Use in PH1 |
|---|---|---|
| Which process handles control, and which handles file bytes? | [TECH-D04 — Runtime & Protocol View](evidence/IE-VEV-TECH-VIEW-004/TECH-D04.svg) | Workspace calls the Server for control and the Gateway for bytes. The picture also contains Format Worker and future Vault B: neither is implemented in PH1. |
| Which technology owns each responsibility? | [TECH-D03 — Technology Layer Mapping](evidence/IE-VEV-TECH-VIEW-005/TECH-D03.svg) | Dashed arrows are control/responsibility relationships. Thick arrows carry file bytes. It is not a time sequence. |
| How does transfer fit into later Check-in? | [ARCH-VIEW-SEQ-002 — Atomic Check-in publication](evidence/IE-VEV-PH1-TRANSFER-001/ARCH-VIEW-SEQ-002.svg) | Context only beyond F05 custody. PH1 does not implement Checkout, Check-in publication, Review or Release. The optional replica branch is not active in PH1. |

The first image is reused from the pinned 0.5 technology gallery because its diagram source is
unchanged in 0.6. TECH-D03 is a focused 0.6 successor. The sequence is freshly rendered from
DOC-05@0.26, without changing that source. Click an SVG link to zoom without losing resolution.

## Read the two paths separately

- **Control:** Client asks the Server; the Server checks eligibility and issues a scoped Transfer
  Grant. The Gateway returns an authenticated Transfer Receipt for Server revalidation.
- **Bytes:** Workspace transfers directly through the selected Gateway to one configured Vault.
  The Server application does not relay file payloads. The Gateway does not publish a Generation.
- **Later Check-in:** the owning Server Modules still decide and commit the business result.
  A completed upload or a Receipt alone is not successful Check-in.

One Vault is the PH1 deployment scope, not a hardcoded identity model. Artifact, Vault and location
identities remain distinct from the private Adapter path. Multi-vault, replication and failover
implementation are deferred; the seams remain in the approved design.

## Do not implement from historical images

`IE-VEV-ARCH-CORR-005/ARCH-VIEW-SEQ-002` predates the direct-transfer decision: it shows upload
through the Server and has no Gateway. It is retained as historical evidence, not the F05 design.
The full `IE-VEV-VAULT-XFER-002` gallery also remains pinned historical evidence; use the focused
current sequence above instead. `TECH-D03` inside `IE-VEV-TECH-VIEW-004` is superseded by the
focused TECH-D03 link above. Historical files and their hashes are unchanged.

Rendering these views does not prove transfer, authorization, retry or Check-in runtime behavior.
F05 must retain its own executed evidence using the approved fixtures.
