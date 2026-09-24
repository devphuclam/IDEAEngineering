# Node.js 24 Web-Build Baseline Evidence for IDEA Engineering

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-NODE24-20260923-001` |
| Document class | `RESEARCH-NOTE` |
| Title | Node.js 24 Web-Build Baseline Evidence for IDEA Engineering |
| Version | `0.1` |
| Status | `Draft` |
| Artifact role | `INFORMATIVE RESEARCH INPUT` |
| Product normativity | `INFORMATIVE` — this note creates no product requirement and does not by itself revise or approve the controlled Tech baseline |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner | Product Decision Authority; named owner `UNKNOWN` |
| Author | Repository maintainers; named attribution `UNKNOWN` |
| Reviewer / acceptance authority | Product Decision Authority; review and acceptance of this research note `NOT-RUN` |
| Evidence date / retrieval | `2026-09-23` (Asia/Bangkok) |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; approved predecessor Tech baseline plus the 2026-09-23 user-reported Product Decision Authority direction to use the workstation Node.js 24 line |
| Source / upstream trace | Official Node.js release index, Release Working Group schedule, Node.js v24.21.0 release page and tagged license; official Vite 8 documentation; local read-only workstation observation; repository search |
| Downstream trace | Controlled successor of `IE-KNW-TECH-DEC-001`, `TECH-001`, `IE-ARC-TECH-VIEW-001`, PH0 environment profile and local-development configuration; a successor render/verification package where applicable |
| Supersedes / superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Decision status | Official lifecycle and compatibility facts verified; the user reports that the project user and Product Decision Authority approved Node.js 24 on 2026-09-23; controlled successor status is owned by downstream change/decision records, not this note |
| Evidence status | `OFFICIAL-PRODUCT-FACT + OFFICIAL-LIFECYCLE-LICENSING + LOCAL-OBSERVATION`; Web build qualification remains `NOT-RUN` |

## 1. Purpose and authority boundary

This note verifies whether Node.js 24 is an LTS release suitable for the selected Vite 8 Web-build
boundary, records the exact Node.js/npm versions already installed on the inspected workstation and
defines the evidence boundary for the controlled Node.js 24 baseline.

The authority chain is:

```text
official Node.js/Vite facts + local observation
→ informative research note
→ controlled Tech successor and change record
→ later exact package/build qualification
```

The project user stated on 2026-09-23 that use of the workstation Node.js 24 line had been approved
by both the project user and the Product Decision Authority. That is decision context for the
controlled successor; it does not make this research note an approval record or turn an unexecuted
Web build into `PASS`.

## 2. Verified official facts

| Question | Verified fact | Source and evidence class |
|---|---|---|
| Is Node.js 24 LTS? | Yes. Node.js lists v24, codename `Krypton`, as `LTS`; the Release Working Group more precisely lists the 24.x line as `Active LTS` on the retrieval date. | [Node.js releases](https://nodejs.org/en/about/previous-releases) and [Node.js Release Working Group schedule](https://github.com/nodejs/Release/blob/main/README.md) — `OFFICIAL-PRODUCT-FACT` / `OFFICIAL-LIFECYCLE-LICENSING` |
| What is its support schedule? | Initial release `2025-05-06`; Active LTS start `2025-10-28`; scheduled Maintenance start `2026-10-20`; scheduled EOL `2028-04-30`. The Release Working Group explicitly says schedule dates are subject to change. | [Release schedule](https://github.com/nodejs/Release/blob/main/README.md) and [schedule.json](https://github.com/nodejs/Release/blob/main/schedule.json) — `OFFICIAL-LIFECYCLE-LICENSING` |
| What is the current 24.x release? | The official release index identifies `v24.21.0`, codename `Krypton`, as LTS and bundles npm `11.19.0`. The release page identifies version `24.21.0` as LTS and provides signed SHA-256 release-file checksums. | [Official distribution index](https://nodejs.org/dist/index.json), [latest-v24.x directory](https://nodejs.org/dist/latest-v24.x/) and [v24.21.0 release page](https://nodejs.org/en/blog/release/v24.21.0) — `OFFICIAL-PRODUCT-FACT` |
| Does Vite 8 permit Node.js 24? | Yes. Node.js 24 satisfies Vite 8's published supported-Node ranges. This is compatibility availability, not an IDEA build result. | [Vite 8 announcement](https://vite.dev/blog/announcing-vite8) and [Vite getting started](https://vite.dev/guide/) — `OFFICIAL-PRODUCT-FACT`; compatibility inference is `IDEA-INFERENCE` |
| What is the license? | Node.js states that Node.js code not covered as an externally maintained library is under its permissive MIT terms. The tagged distribution license also carries the licenses and notices for bundled externally maintained libraries; therefore the binary distribution should not be represented as if every bundled component had only the Node.js MIT notice. | [Node.js v24.21.0 tagged LICENSE](https://github.com/nodejs/node/blob/v24.21.0/LICENSE) — `OFFICIAL-LIFECYCLE-LICENSING` |

The `v24.21.0` Windows x64 ZIP is an official release asset. Its release-page SHA-256 is
`158f7685b44de51f6c0df1d153526cbcd3e1bc739a8dfc607721cef75de9e541`. This is provenance
information only: the project direction is to use the Node.js already installed on the workstation,
so this note does not download, install or replace Node.js.

## 3. Exact workstation observation

Read-only commands executed on 2026-09-23 returned:

```text
node --version  → v24.16.0
npm --version   → 12.0.2
```

The same exact values were already recorded in
[`specs/004-technical-pilot-readiness/environment-profile.md`](../../specs/004-technical-pilot-readiness/environment-profile.md).
They are the observed local toolchain, not the latest official 24.x patch. The controlled baseline
should therefore distinguish:

- selected major/support line: `Node.js 24 LTS`;
- current local observation: `Node.js 24.16.0` with npm `12.0.2`;
- current upstream release snapshot: `Node.js 24.21.0` with npm `11.19.0`;
- qualification result: `NOT-RUN` until the exact locked Web dependency graph and build commands run
  successfully with the selected local toolchain.

Using the installed toolchain does not justify claiming that npm must equal the version bundled in
the latest Node.js release. The repository should record the actually executed Node/npm versions in
future build evidence.

## 4. Controlled update scope

The Node.js 24 baseline must be consistent in the following IDEA-controlled surfaces:

| Controlled surface | Required Node.js 24 treatment |
|---|---|
| [`config/idea-core-v0.env.example`](../../config/idea-core-v0.env.example) | Identify Node.js 24 LTS as the approved Web-build family. |
| [`specs/004-technical-pilot-readiness/environment-profile.md`](../../specs/004-technical-pilot-readiness/environment-profile.md) | Retain the observed Node `24.16.0` / npm `12.0.2`; keep exact lockfile/build qualification `NOT-RUN`. |
| [`docs/product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md`](../product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md) | Select Node.js 24 LTS while retaining qualification and update-policy boundaries. |
| [`docs/product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md`](../product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md) | Present the approved Node.js 24 Web-build family in management language. |
| [`docs/product/instances/idea-engineering/technology/IDEA-core-v0-technology-architecture-views.md`](../product/instances/idea-engineering/technology/IDEA-core-v0-technology-architecture-views.md) | Label the npm/Vite build line as Node.js 24 LTS and publish a successor rendition. |
| [`qualification/q15/option-a/web/package.json`](../../qualification/q15/option-a/web/package.json) | Require Node.js 24 at the project-owned engine boundary. Transitive lockfile ranges remain third-party package metadata. |

Repository search found no active workflow pin such as `setup-node` or `node-version` that needs a
separate update. Historical evidence packages remain retained for traceability; the current
catalogue routes readers to the Node.js 24 successor rendition.

## 5. Evidence-safe disposition

The official evidence supports the statement **“Node.js 24 is an Active LTS line and is compatible
with Vite 8's documented Node version floor.”** The local evidence supports the statement **“this
workstation currently runs Node.js 24.16.0 and npm 12.0.2.”** Neither source supports claiming that
the Web dependency graph, lint, tests or production asset build has passed; those outcomes remain
`NOT-RUN` until executed and retained against the exact lockfile and tool versions.

The controlled successor should use a major-line policy (`Node.js 24 LTS`) plus exact-version build
evidence, rather than presenting upstream `v24.21.0` as if it were already installed or qualified.
