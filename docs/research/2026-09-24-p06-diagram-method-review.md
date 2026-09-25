# P06 diagram method review: rollback choice and security abuse cases

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-P06-DIAGRAM-METHOD-20260924-001` |
| Class / version / status | `RESEARCH-NOTE` / `0.2` / `Draft` |
| Product normativity | `INFORMATIVE`; no new requirement, architecture or technology decision, View ID, approval, or conformity claim |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Author / owner | Assistant research author / accountable research owner `UNKNOWN` |
| Reviewer / acceptance authority | `UNKNOWN` / `NOT-APPLICABLE`; review `NOT-RUN` |
| Applicable baseline | IDEA Engineering `IE-INC-READY-001` P06 working tree read on 2026-09-24: [P06 plan](../../specs/004-technical-pilot-readiness/recovery-and-security-plan.md) `@0.3`, [DOC-05](../product/instances/idea-engineering/DOC-05-architecture-description.md) `@0.22`; this note does not pin an immutable source commit |
| Evidence and access date | Official-source documentation checked 2026-09-24 (Asia/Bangkok); local source comparison only; runtime verification `NOT-RUN` |
| Classification / retention | `INTERNAL`; retain with P06 research and supersede after a material source or design change |
| Upstream trace | [Authoring standard `IE-STD-AUTH-001@0.2`](../agents/product-document-authoring-standard.md), [standards register](../governance/standards-register.md), P06 plan, DOC-05 §§3.1–3.2, 9.3–9.4, 10 |
| Downstream trace | [DOC-05@0.23 `ARCH-VIEW-ACT-003`](../product/instances/idea-engineering/DOC-05-architecture-description.md) and [focused VEV](../product/instances/idea-engineering/registers/VEV-2026-09-24-p06-recovery-diagram-review.md); requirement, test, or gate change `NOT-RUN` |
| Change / supersession | 0.2 records the bounded downstream diagram outcome while preserving the original @0.22 source observation; predecessor note @0.1, supersedes/superseded-by `NOT-APPLICABLE`; Product Scope impact `NONE` |
| Review trigger | Controlled rollback/recovery path changes; threat boundaries or P06 abuse-case coverage changes; cited official source changes materially |

Tailoring: this short research item records official-source facts, a bounded observation of current IDEA drafts, and an Engineering recommendation separately. The register classifies `STD-ARC-001` (ISO/IEC/IEEE 42010:2022) as `STANDARD` for viewpoints/views/models and `STD-TEST-001…004` (ISO/IEC/IEEE 29119-1:2022, -2:2021, -3:2021, -4:2021) as `STANDARD-GUIDED` for test information and coverage. `STD-SSD-001` (NIST SP 800-218 v1.1) is `STANDARD-GUIDED`; `STD-WEB-001` (OWASP ASVS 5.0.0) is `STANDARD-GUIDED, CONDITIONAL` for Web/API surfaces. These are local applicability mappings, not claims that P06 conforms to those standards.

## Official evidence

| Source | Directly supported observation | Limit |
|---|---|---|
| `OMG-01`: Object Management Group, [UML specification listing, version 2.5.1](https://www.omg.org/spec/UML/2.5.1/About-UML) and OMG-hosted [ISO/IEC 19505-2:2012 UML Superstructure PDF](https://www.omg.org/spec/UML/ISO/19505-2/PDF), §§12.3.20–12.3.22, 14.4 | Activity control nodes include guarded decisions/merges; Sequence Diagrams focus on messages among lifelines. A Sequence Diagram can also express guarded alternatives. | Detailed semantics were checked in the accessible 2012 OMG-hosted edition; the large 2.5.1 PDF was linked but not inspected here. This supports a view-kind choice, not an IDEA or UML-conformity mandate. |
| `C4-01`: C4 model creator, [Dynamic diagram](https://c4model.com/diagrams/dynamic) | Dynamic diagrams show runtime collaboration for a scoped feature/use case; the author advises using them sparingly for interesting or complicated interaction patterns. | C4 does not prescribe a rollback decision flow or one diagram per threat. |
| `NIST-01`: NIST, [SP 800-34 Rev. 1](https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final), §§4.3.1–4.4 ([PDF](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf)) | Recovery procedures should identify ordered steps, responsible teams and escalation when conditions change, restore to a known state, and validate recovered operation before normal service resumes. | Federal information-system contingency guidance; it neither requires a diagram nor approves IDEA's recovery route. |
| `OWASP-01`: OWASP, [Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html), “System Modeling” | A data-flow or comparable model should make trust boundaries, flows, stores, processes and external actors clear; multiple focused diagrams may be useful when scope or complexity warrants them. | Method guidance, not a one-diagram-per-abuse-case rule. |
| `OWASP-02`: OWASP SAMM, [Requirements-driven Testing](https://owaspsamm.org/model/verification/requirements-driven-testing/) and OWASP WSTG v4.2, [Testing for the Circumvention of Work Flows](https://wstg.owasp.org/v4.2/4-Web_Application_Security_Testing/10-Business_Logic_Testing/06-Testing_for_the_Circumvention_of_Work_Flows/) | Negative testing uses misuse/abuse cases; workflow tests examine steps skipped or performed out of order. | These sources concern security verification, especially Web applications. They require neither a separate diagram for each test case nor proof that an unexecuted test passed. |

## Bounded IDEA source observation

DOC-05 `ARCH-VIEW-SEQ-011` models coordinated restore **after an approved recovery point is selected**, including Restricted Recovery Mode, validation and an explicit reopen decision. DOC-05 §9.4 and P06 §2.5 state that a change failure may require forward repair or a proven full recovery path and that replacing binaries alone does not prove schema compatibility. They do not yet show the selection guards, decision owner, or the unresolved-evidence branch as one flow. The missing item is the route-selection logic, not a duplicate restore sequence.

DOC-05 `ARCH-VIEW-SEC-001` already shows principal trust boundaries and has a neighboring threat/control table. P06 §3 already lists abuse cases, safe outcomes and planned evidence, all `NOT-RUN`. Existing interaction views cover several specific paths. This review did not execute the tests or establish that every case has sufficient control detail.

## Engineering recommendation, not a decision

**Rollback choice:** An explicit, compact UML-style Activity decision flow is warranted for guided P06 review because route selection has materially different consequences. Show the failed change/health trigger; containment in Restricted Recovery Mode; evidence and compatibility checks; guarded branches for forward repair, proven coordinated recovery, and unresolved evidence; the named authority and escalation; then validation and the separate reopen decision. Keep `ARCH-VIEW-SEQ-011` for participant exchanges during the recovery branch. A decision table can accompany the flow with exact guards and evidence. This is an IDEA inference from the gap and source semantics, not a requirement imposed by OMG or NIST. Any later controlled view needs the DOC-05 §3.2 view profile, cross-view trace, source/render check and review; no View ID is assigned here.

**Security cases:** Do not create one diagram for every abuse case by default. Use the existing trust-boundary view as the shared system model and maintain a traceable case record for each threat: attempted path, protected boundary and owner, expected denial or safe result, test setup/oracle, and actual evidence/result. Add a focused activity or sequence view only where the attack path, order of checks, or failure outcome cannot be reviewed unambiguously from that model and case record. For example, a forged receipt can be checked against the existing transfer/commit sequence before drawing another view. This follows OWASP's risk and scope based modeling/testing guidance; it is not a security review result. P06 and its planned runtime tests remain `NOT-RUN`.

## Downstream outcome recorded in 0.2

The project user approved the bounded diagram clarification. DOC-05@0.23 adds the guarded
`ARCH-VIEW-ACT-003` and corrects one contradictory return label in `ARCH-VIEW-SEQ-011` without
changing the selected recovery obligations. [IE-CHG-P06-DIAGRAM-001](../product/instances/idea-engineering/registers/CHG-2026-09-24-p06-recovery-diagram-clarification.md)
records impact and [IE-VEV-P06-DIAGRAM-001](../product/instances/idea-engineering/registers/VEV-2026-09-24-p06-recovery-diagram-review.md)
records only source/rendition checks. No runtime, security-case or P06 acceptance result follows
from this research note.
