# Repository scripts

Run commands from the repository root. Use the existing local runtimes and dependencies; these
scripts do not authorize installing tools or modifying a product baseline.

## Choose the right script

| Task | Script | Scope and output |
|---|---|---|
| Check file-placement hygiene | [check-repository-hygiene.ps1](check-repository-hygiene.ps1) | Checks the Git index for tracked temporary directories, application lock files and Python caches. It does not inspect ignored files or verify product behavior. |
| Validate the DDM capability matrix | [validate-ddm-capability-matrix.ps1](validate-ddm-capability-matrix.ps1) | Focused structure/control check for the knowledge matrix, not proof of DDM parity. |
| Render the current Vault review package | [render-vault-transfer-review.cjs](render-vault-transfer-review.cjs) | Reads DOC-05, DOC-06, the technology view set and the Word update guide; writes SVG/PNG, manifests and gallery into `IE-VEV-VAULT-XFER-001`. Requires Playwright, Sharp, Chrome and access to the pinned Mermaid CDN. |
| Render architecture/data views into a new evidence record | [render-architecture.cjs](render-architecture.cjs) | Requires `IDEA_ARCH_EVIDENCE_ID`; reads maintained Markdown rather than a historical Git checkout. |
| Render technology views into a new evidence record | [render-technology-architecture.cjs](render-technology-architecture.cjs) | Requires `IDEA_ARCH_EVIDENCE_ID`; same new-record and source-baseline discipline. |
| Inspect architecture SVG XML | [check-architecture-svg.cjs](check-architecture-svg.cjs) | Focused SVG check; consult its inputs before running it. It does not assess diagram semantics or runtime behavior. |
| Inspect the retained management-review generator | [Presentation generator](presentations/build-idea-core-v0-feature-spec-tech-review.mjs) and [diagram catalogue](presentations/idea-core-v0-diagram-catalog.mjs) | Historical 16-09 presentation source. Pins local runtime paths and the reviewed baseline; writes FINAL, its source map and inventory. Preserve these exact reviewed outputs. |
| Check the inherited workspace contract | [verify-template](verify-template) | Public inherited verification entry point; not the IDEA product's runtime test suite. |

The Vault renderer writes to an existing evidence directory. Use it only to reproduce that record
against its exact sources; a later source change needs a successor evidence record and output path.
The presentation generator also overwrites reviewed deliverables. Do not run it as an automatic
cleanup or refresh step; make a successor with separate outputs when a new presentation is needed.

`docker-wsl-recovery.sh` is retained inherited infrastructure, not a prerequisite for this design
cleanup or permission to change services on the workstation.

## Local working output

Use `.tmp/`, `.tmp-artifact/` or `tmp/` for disposable renders and inspection files. Keep reusable
source in `scripts/`, communication copies in `docs/reports/`, and controlled evidence under its
own record in the product instance. Remove temporary output only after confirming the retained
deliverable and its source are outside that temporary directory.

For a file-placement check:

```powershell
.\scripts\check-repository-hygiene.ps1
```
