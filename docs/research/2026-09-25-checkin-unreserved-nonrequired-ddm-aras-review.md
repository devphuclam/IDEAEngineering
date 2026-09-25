# Q2 — Locally modified, unreserved file outside a Check-in scope

| Control field | Value |
| --- | --- |
| Research ID | `RS-WS-Q2-20260925` |
| Class / version / status | Research record / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; this record creates no IDEA requirement or approval |
| Question | Do DDM or Aras visibly exclude a locally modified, unreserved, non-required file from a multi-document Check-in and require the user to reconfirm the reduced exact scope? |
| Evidence date | 2026-09-25; earlier DDM and Aras runtime work is identified separately below |
| Author / review / acceptance | Engineering research; Project Reviewer review `NOT-RUN`; Product Decision Authority acceptance `NOT-RUN` |
| Applicable baseline | IDEA Core v0 Check-in scope discussion, Q2; no claim about a particular DDM target or all Aras configurations |
| Classification / retention | `INTERNAL`; retain with the Check-in scope decision history |
| Upstream / downstream | [DDM/Aras Q26–Q28 comparison](2026-09-10-ddm-aras-checkout-reference-checkin-comparison.md); [DDM conflict study](2026-08-31-ddm-checkout-checkin-conflict-model.md); [Aras runtime experiment](2026-09-10-aras-runtime-workspace-experiment.md); IDEA decision and verification remain separate |

## Finding

**The exact Q2 interaction is not established for either product by the admitted evidence.** DDM publicly demonstrates distinct Reserve/Reference and related-file selection, but its public material does not establish how a locally changed, unreserved, *non-required* file is handled during Store/Check-in. Aras Office Connector 27 demonstrates per-document Claim, unclaimed View, prompts before Claim/Save, and explicit choices when a local file differs; those are useful safety precedents, **not** evidence of a multi-document scope screen that excludes an unrelated changed file and requires reconfirmation. The local Aras experiment did not execute Q2 and used a custom connector, not the vendor's general CAD Check-in UI.

Thus the proposed IDEA behavior—show `ModifiedWithoutReservation`, exclude the non-required file from the proposed publish set, preserve its local bytes, and require explicit confirmation of the resulting exact scope—is an **IDEA design choice** informed by narrower precedents, not DDM parity or an Aras feature copied verbatim. A changed *required* dependency is a different case: it cannot be relabelled “non-required” merely to proceed; its completeness rule must be evaluated separately.

## Evidence and limits

| ID / evidence class | First-party source and precise claim | Does it establish Q2? |
| --- | --- | --- |
| `Q2-DDM-01` — `VENDOR-PUBLIC`, historical | CSI's [DDM Office Working with Folders tutorial](https://www.youtube.com/watch?v=rlH1fXReZ9Q&t=305s) is admitted as `VP-06` in the [DDM vendor-public baseline](../product/knowledge/ddm-vendor-public-baseline.md): Reserve and Reference are distinct user flows with modification-rights language. The [2016.03 Reserve/Reference-to enhancement](https://www.designdatamanager.com/2016/05/09/ddm-2016-03-whats-new-reserve-to-reference-to-manager-window-enhanced-to-include-drawings/) lists an option to include component drawings. The [DDM conflict study](2026-08-31-ddm-checkout-checkin-conflict-model.md) explicitly leaves local save without Reserve and scope/partial-acquisition behavior `UNKNOWN`. | **No.** Related-file inclusion at Reserve/Reference time is not modified-file detection or Check-in reconfirmation. The DDM site was not independently retrievable in this 2026-09-25 pass; this row reuses the admitted, earlier first-party review rather than claiming a new runtime observation. |
| `Q2-ARAS-01` — `VENDOR-PUBLIC`, Office Connector 27 | Aras [Document Claiming and Unclaiming, “Edit Control”](https://docs.aras.com/office-connector-oc27/document-claiming-and-unclaiming/0000019e-86f8-d30e-abff-8fff51920000): View does not Claim; saving from View asks whether to Claim; Save retains Claim; Save and Close unclaims. Unclaim with local changes asks before their loss. | **Partly analogous.** The connector does not silently grant edit authority or discard local changes. It does not describe a batch of documents or an unrelated changed sibling. |
| `Q2-ARAS-02` — `VENDOR-PUBLIC`, Office Connector 27 | Aras [View and Edit Options, “Opening Documents from Aras”](https://docs.aras.com/office-connector-oc27/view-and-edit-options/0000019e-86f9-d30e-abff-8fff903f0000): View opens unclaimed; Edit opens claimed; a document changed on the server while the View copy is open cannot then be claimed from that outdated copy. | **Partly analogous.** This is per-document authority/freshness, not the proposed exclusion and exact-scope confirmation. |
| `Q2-ARAS-03` — `VENDOR-PUBLIC`, Office Connector 27 | Aras [Local File Checks, “Other Capabilities”](https://docs.aras.com/office-connector-oc27/local-file-checks/0000019e-86f8-d30e-abff-8fffa6a70000): when opening a file already in the connector's local working directory, a differing copy triggers choices such as keep the current local file, fetch the Aras file, or cancel. | **Partly analogous.** The documented check occurs on **open**, not as a Check-in scan; its choices are not Q2's exclude/reconfirm sequence. |
| `Q2-ARAS-04` — `TARGET-RUNTIME FACT` with `NOT-RUN` boundary | The identified Aras `14.35.0.44037` [runtime experiment, `ARAS-RT-07…13`](2026-09-10-aras-runtime-workspace-experiment.md) tested one custom CAD Check-in path, lock enforcement, file attachment and stale/current-head gaps. No multi-document, non-required-unreserved-file exclusion or user reconfirmation test was run. | **No.** A custom Method and one fixture cannot establish native Aras/Office/CAD connector Q2 behavior. |

## IDEA interpretation and disposition

1. Keep the two facts separate: a Workspace file may be locally changed, but only the confirmed, authorized Check-in set can publish. Per-document Claim/Reserve patterns support that boundary; they do not select the exact IDEA UI.
2. For Q2, explicit exclusion plus reconfirmation is a defensible IDEA safety design because it avoids silent publication **and** avoids failing an otherwise independent operation. This is an inference from IDEA's exact-scope/local-work rules, not a documented DDM or Aras outcome. The user chose the recommendation in discussion on 2026-09-25; this research record does not itself grant Product Decision Authority approval or change the controlled requirement baseline.
3. Before implementation, the controlled specification should identify what counts as “non-required” for the selected root and dependency closure, which local-file evidence produces `ModifiedWithoutReservation`, what the confirmation screen displays, and what happens if the scope or server state changes between confirmation and commit. Verify with both a non-required sibling and a required dependency; no IDEA runtime result is claimed here.

## What remains unknown

- An identified, authorized DDM build's exact behavior for this local-modification/Check-in scenario (`UNKNOWN`; target audit needed).
- Whether any specific Aras CAD integration implements the Q2 interaction (`UNKNOWN`; the cited Office Connector and custom runtime test do not answer it).
- The Project Reviewer selected a candidate rule to block Check-in when dependency closure cannot be resolved; Product Decision Authority acceptance and runtime verification remain `NOT-RUN`. Uncertainty is not treated as “non-required.”

No third-party source code, assets, binaries or licensed manuals were imported. This record preserves first-party source links and evidence limits only.
