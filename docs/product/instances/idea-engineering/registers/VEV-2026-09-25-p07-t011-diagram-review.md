# Modified Reference Diagram Rendition Check

## Control envelope

| Field | Recorded value |
|---|---|
| Stable record ID | `IE-VEV-P07-T011-001` |
| Class / version / status | `VEV` / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; source/rendition evidence only, not a product test or architecture approval |
| Date / applicability | 2026-09-25 / DOC-05@0.26 `ARCH-VIEW-SEQ-005` |
| Owner / operator | Principal Product Author / assistant renderer and focused author QA |
| Reviewer / authority | Independent architecture/HCD review and T011 Project Reviewer disposition `NOT-RUN` |
| Source | [DOC-05@0.26](../DOC-05-architecture-description.md), SHA-256 `8AD78E1B861BCE9A356E85096D8044588DAFA4E17C0CFAD2E16EAF61A1089323`; [retained Mermaid](../evidence/IE-VEV-P07-T011-001/ARCH-VIEW-SEQ-005.mmd), SHA-256 `73BD8F823AB1C382E5F794F6851B0729F14982EAB85AF807215FF8186AB3F9E2` |
| Renditions | [Full-resolution SVG](../evidence/IE-VEV-P07-T011-001/ARCH-VIEW-SEQ-005.svg), SHA-256 `BD84C32D0F793E10852DB9169C43A1FB7867DDBB35E92922061CFE35D228CBA7`; [PNG](../evidence/IE-VEV-P07-T011-001/ARCH-VIEW-SEQ-005.png), SHA-256 `27CFA9578EECC5B6C134CDED9391A54A830AA2D9362742A5EDDFA9F0D9BB19A9` |
| Reproduction | [Render manifest](../evidence/IE-VEV-P07-T011-001/render-results.json); [focused gallery](../evidence/IE-VEV-P07-T011-001/index.html); `scripts/render-architecture.cjs` with `IDEA_ARCH_VIEW_ID=ARCH-VIEW-SEQ-005` and a new evidence ID |
| Change trace | [IE-CHG-P07-T011-001](CHG-2026-09-25-p07-t011-diagram-alignment.md) |
| Access / retention | `INTERNAL`; retain source, rendition, manifest and this check with DOC-05 |

## Checks and limits

| Check | Result |
|---|---|
| Mermaid render | `PASS — RENDER`; Mermaid 11.12.0 and Chrome 154.0.8037.57 rendered one view. |
| Standalone SVG | `PASS — OPEN`; Chrome reported `image/svg+xml`, one SVG root, zero parser errors and zero page errors. SVG XML also parsed locally. |
| Source/rendition identity | `PASS — SOURCE`; the retained Mermaid and SVG SHA-256 values match the render manifest and files. DOC-05 source hash is recorded above. |
| Focused visual QA | `PASS — AUTHOR QA`; native PNG inspected. Create Copy and confirmed discard are separate, labels are legible, and the branches have no observed clipping or crossing that changes their meaning. |

This check proves the diagram can be opened and read. It does not prove that IDEA software implements these paths, accept the whole DOC-05 architecture, or close T011/P02, P07 or PG4.
