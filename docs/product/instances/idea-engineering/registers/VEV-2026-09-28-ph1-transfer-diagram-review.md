# PH1 Transfer Diagram Clarification — Verification Record

| Control field | Value |
|---|---|
| Stable Supporting Record ID | `IE-VEV-PH1-TRANSFER-001` |
| Class / version / status | `VEV` / `0.1` / `Draft` |
| Date / operator / author | 2026-09-28 / Principal Product Author (assistant) |
| Owner / reviewer | Project reviewer; focused author review below is not independent review |
| Acceptance authority | Project reviewer for this editorial correction; no product-gate decision |
| Authority basis / change request | User approved clarifying TECH-D03, correcting PH1 navigation and refreshing renditions: “Ok, duyệt. Làm đi bạn” on 2026-09-28 |
| Normativity / process authority | `INFORMATIVE` / `NOT-APPLICABLE` |
| Applicable baseline | DOC-05@0.26, DOC-06@0.18; technology views 0.5 → 0.6; PH1 F01–F05 |
| Source / upstream trace | [DOC-05](../DOC-05-architecture-description.md), [technology view source](../technology/IDEA-core-v0-technology-architecture-views.md), [ADR-0013](../../../../adr/0013-separate-artifact-control-and-data-planes.md) |
| Downstream trace | [PH1 diagram guide](../ph1-diagram-guide.md), [PH1 validation guide](../../../../../specs/005-ph1-foundation-custody/quickstart.md) |
| Predecessor / supersession | TECH-D03 rendition in `IE-VEV-TECH-VIEW-004` and sequence rendition in `IE-VEV-VAULT-XFER-002` superseded only for these focused views; historical files unchanged |
| Source pins | Exact document, Mermaid and SVG SHA-256 values in the two render manifests linked below; TECH-D03 manifest also pins PNG. Sources are the working copy, not a claim that HEAD alone contains these changes. |
| Classification / retention | `INTERNAL`; retain sources and focused render evidence with this correction |
| Review trigger | Any change to diagram source, PH1 transfer scope, linked rendition or rendering toolchain |
| Evidence boundary | Source/rendition and focused author visual review only; runtime and independent acceptance `NOT-RUN` |

## Changes and limits

1. TECH-D03 labels dashed control/responsibility relationships separately from thick byte arrows.
   Workspace connects directly to Gateway, then one configured Vault. Security and persistence
   are no longer drawn as sequential hops. Cross-cutting operations remain in the text alternative,
   not as an intervening transport node. No responsibility or technology selection is removed.
2. `ARCH-VIEW-SEQ-002` is rendered from unchanged DOC-05@0.26. Its upload path uses Gateway;
   Check-in publication remains a later-phase use of the custody seam. Its optional replica is
   not activated by PH1.
3. The PH1 guide and catalogue point to the focused current views and warn against the historical
   pre-Gateway sequence. The old galleries and their manifests are not edited.

This changes no normative requirement, DOC-05/06 content, architecture decision, F01–F05 scope,
technology selection, Q-15 result, Product Decision Authority approval, PG3 or PG4 state.
The one-Vault deployment and future multi-vault seam remain. No tracker timer or actual effort
was inferred from the request.

## Verification

Configuration: existing repository renderer convention, Mermaid `11.12.0`, Chrome
`154.0.8037.57`, bundled Playwright. No new application dependency was introduced.

| Objective / method | Expected | Actual result / evidence |
|---|---|---|
| Render TECH-D03 using `IDEA_TECH_VIEW_ID=TECH-D03`, `IDEA_ARCH_EVIDENCE_ID=IE-VEV-TECH-VIEW-005`, `node scripts/render-technology-architecture.cjs` | One SVG/PNG pair, source pin and accessible metadata | `PASS`; [render manifest](../evidence/IE-VEV-TECH-VIEW-005/render-results.json) |
| Render sequence using `IDEA_ARCH_VIEW_ID=ARCH-VIEW-SEQ-002`, `IDEA_ARCH_EVIDENCE_ID=IE-VEV-PH1-TRANSFER-001`, `node scripts/render-architecture.cjs` | One SVG/PNG pair matching current DOC-05 source | `PASS`; [render manifest](../evidence/IE-VEV-PH1-TRANSFER-001/render-results.json) |
| Standalone browser SVG open, including `node scripts/check-architecture-svg.cjs` for the sequence | SVG root, zero XML/parser errors | `PASS`, 2/2; [TECH-D03 result](../evidence/IE-VEV-TECH-VIEW-005/svg-open-results.json), [sequence result](../evidence/IE-VEV-PH1-TRANSFER-001/svg-open-results.json) |
| Recompute source, extracted Mermaid and SVG hashes; compare technology Mermaid blocks to HEAD | All retained hashes match; only TECH-D03 changes | `PASS`; seven other technology diagrams unchanged |
| Author inspects both PNGs against source | Visible Gateway, direct byte path, readable labels, no node/label clipping; control is not payload | `PASS — focused author review`; [TECH-D03](../evidence/IE-VEV-TECH-VIEW-005/TECH-D03.png), [sequence](../evidence/IE-VEV-PH1-TRANSFER-001/ARCH-VIEW-SEQ-002.png). Sequence is a full-resolution reference, not a presentation slide. |
| Renderer syntax and tracked whitespace | `node --check scripts/render-technology-architecture.cjs`; `git diff --check` | `PASS`; Git emitted line-ending conversion warnings only |
| New navigation links | Local targets exist | `PASS`, 24 local targets in the PH1 diagram guide, this record and PH1 validation guide |
| Existing-output guard | Re-running the renderer against the same evidence directory refuses before writes | `PASS`; exit 1 with `Evidence target already exists` |
| Full repository verifier | `bash scripts/verify-template` | Started; no final result at this handoff. Not counted as `PASS`. Focused checks above remain separate. |
| IDEA runtime transfer/security/retry tests | Executed F05 evidence | `NOT-RUN`; not part of this documentation correction |

The focused-render option prevents duplicating the entire eight-view gallery for one correction.
The renderer now refuses an existing output directory, preserving historical evidence by default.
