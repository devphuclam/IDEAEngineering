# P07 T011 Scenario and Diagram Alignment

## Control envelope

| Field | Recorded value |
|---|---|
| Stable record ID | `IE-CHG-P07-T011-001` |
| Class / version / status | `CHG` / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; DOC-04 remains the normative requirement source. This record does not approve DOC-05 or the PH0 scenario. |
| Date / applicability | 2026-09-25 / P07 preparation for T011/P02 review |
| Owner / author | Principal Product Author / assistant drafting support; named author attribution remains pending |
| Reviewer / authority | Project Reviewer accepted the recommended Q9/Q10 editorial corrections during the P07 walkthrough. Exact-source T011 disposition and Product Decision Authority approval of the whole successor remain `NOT-RUN`. |
| Upstream | [DOC-04](../DOC-04-software-requirements-specification.md) `REQ-WS-003/010/011/014`, `REQ-LC-002/005`; [DOC-05](../DOC-05-architecture-description.md) `ARCH-VIEW-STATE-001`, `ARCH-VIEW-SEQ-003/005`; [T011 scenario](../../../../../specs/004-technical-pilot-readiness/canonical-scenario.md) |
| Downstream | [T011 trace](../../../../../specs/004-technical-pilot-readiness/trace-matrix.md); [readiness register](../../../../../specs/004-technical-pilot-readiness/readiness-register.md); [focused rendition evidence](VEV-2026-09-25-p07-t011-diagram-review.md) |
| Source versions / hashes | DOC-05 `Draft 0.26`, SHA-256 `8AD78E1B861BCE9A356E85096D8044588DAFA4E17C0CFAD2E16EAF61A1089323`; scenario `Draft 0.3`, SHA-256 `284E9F829EFE0EABFC4BFEB9AE836B6F86BF1B91A97C4C8F928720697C82B301`; trace `Draft 0.6`, SHA-256 `E9C66CE89F26C6529126265F9DD872E176BF65145B234158B7DCA0182DC0CADD` |
| Change / supersession | DOC-05 `0.25 → 0.26`; scenario `0.2 → 0.3`; trace `0.5 → 0.6`. Historical evidence remains pinned to its own source. |
| Review trigger | Change to Modified Reference safe exits, `Under Review` Check-in guard, Withdraw/Reject or Review Round pinning |
| Access / retention | `INTERNAL`; retain with the PH0 review package |
| Evidence state | Diagram source, focused render, standalone SVG open and author visual QA recorded; T011 reviewer result and product runtime verification `NOT-RUN` |

## Corrections

1. The T011 negative path previously implied that editing local Workspace bytes after Submit itself invalidated Review. The submitted Generation does not change when a local file changes. A content-changing Check-in is refused while the Revision is `Under Review`. Withdraw or Reject closes that Round before a later changed Check-in and new Submit; the new Round inherits no decision from the old one. The scenario and trace now state this and point to `ARCH-VIEW-STATE-001` and `ARCH-VIEW-SEQ-003`.
2. `ARCH-VIEW-SEQ-005` previously combined **Create Copy** and **confirmed local discard** in one diagram branch. The diagram now shows separate choices. Create Copy requests a new Logical Document under normal rules; discard removes only the local candidate after explicit confirmation. Neither writes the original Logical Document.

DOC-04 `REQ-LC-002` already guards the Review state and refers to Withdraw/Reject. Its requirement text is unchanged. This is an alignment of explanations and a diagram, not a new workflow rule.

| Boundary | Effect |
|---|---|
| Feature / Spec / data | No new or changed `REQ-*`, Feature group, data entity or migration. |
| Architecture / UI | One existing UML Sequence view corrected; no new screen or permission. |
| Verification | The focused diagram checks are in `IE-VEV-P07-T011-001`. T011 still needs the Project Reviewer to judge all 13 rows against the exact scenario and trace hashes. No application behavior is claimed. |
| Authority / gates | No Tech selection, Q-15, Product Scope, PDA approval, PG3, PG4 or PH1 authorization changes. |
