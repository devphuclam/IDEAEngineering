# Node.js24.19.0 — IDEAEngineering project-wide admission

| Control | Value |
|---|---|
| Stable ID / class / version / status | IE-RES-NODE24190-PROJECT-ADMISSION-20261005 / external-source intake disposition /1.0 /Approved |
| Disposition / use | APPROVED-WITH-OBLIGATIONS /DEPENDENCY: normal project tooling/runtime |
| Owner / author | IDEAEngineering project maintainers /Codex, recording the human decision |
| Acceptance authority / date | Explicit Project Reviewer/user decision in this conversation /2026-10-05 /Asia/Ho_Chi_Minh |
| Applicability | IDEAEngineering, current and future work items/increments; not limited to PR38/F05/T033/T034 |
| Normativity | No new product requirement; controlled project intake decision |
| Source / upstream | Exact Node publisher v24.19.0 binary/checksums/tagged LICENSE; predecessor IE-RES-T033-NODE-INTAKE-20261005@0.1 |
| Downstream / retention | Project license inventory/future SBOM and build/runtime users; INTERNAL, preserve decision/history and full applicable notices |
| Supersession | Supersedes predecessor Node BLOCKED-LEGAL/proposed T033–T034-only exception; no earlier granted Node-only exception is falsely claimed |
| Tailoring / evidence | STANDARD-GUIDED IE-STD-AUTH-001; human disposition plus exact observed source identity, not blanket product readiness |

## Decision and exact approved binary

Node.js24.19.0 is APPROVED-WITH-OBLIGATIONS for development, build/test, otherwise permitted
CI/qualification, internal company use, production, development/operation of commercial IDEA
products, and future IDEAEngineering work items/increments. Ordinary use does not require a
new process exception and is not BLOCKED-LEGAL merely because bundled ICU/NAIST–ICOT notices
exist. The approving human states the identified terms impose no non-commercial-use
restriction on the intended IDEAEngineering use. This records that authority; it does not
invent an independent Legal Review approval event or declare whole-product/T036 clearance.

Current approved Windows x64 executable:
`C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.
SHA-256 `3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237`;
matches [publisher v24.19.0 win-x64/node.exe](https://nodejs.org/download/release/v24.19.0/SHASUMS256.txt).
This approval does not pin an unobserved binary of another platform or authorize installation,
network exposure, deployment, access to company data or any new feature by itself.

## Obligations and accountable actions

| Obligation | Owner / action |
|---|---|
| Preserve Node and bundled third-party legal material | Project maintainers retain the full exact [LICENSE](../third-party/node-24.19.0/LICENSE.txt), including ICU/Unicode/NAIST–ICOT notices and warranty disclaimers; include applicable material whenever runtime/components are copied or redistributed. |
| Applicable attribution/disclaimers and no prohibited endorsement | Release/packaging owner carries the applicable notices with redistributed components and checks output does not suggest third-party endorsement. |
| Inventory and future SBOM | Engineering tracks exact Node runtime and bundled terms in [inventory](inventories/node-24.19.0-project-runtime.tsv); release owner maps actual packaged components into future SBOM. Full notice retention is not a claim that every source-only component is in the executable. |
| Continued actual rights | Engineering stops and routes any actual missing/unusable right or unsatisfied applicable obligation; this decision never creates missing rights. |

The exact [tagged LICENSE](https://raw.githubusercontent.com/nodejs/node/v24.19.0/LICENSE)
is retained unchanged, UTF-8/LF157606 bytes, SHA-256
`148eacf7863ef4329224a29398623077200a27194aa075569faf4a0a85566ca5`.
No single MIT-only classification replaces separately bundled legal terms.

## Reopen only for materially relevant change

New intake is required for Node version change, new third-party Node/npm dependency,
modification/vendor use, materially changed redistribution/packaging, changed applicable
terms, or an actual missing/unusable right. Existing exact-tool/source preflight and safe
execution boundaries still apply; unchanged ordinary approved Node use is not a repeated
license approval gate. Packages/npm/other runtimes are not admitted by implication.

Other F05 implementation/qualification obligations, PR38 Draft/Open, no merge/verifier and
Delivery Card/timer rules remain unchanged. The old gate record stays historical with a
successor pointer rather than rewriting the earlier observations as prior approval.
