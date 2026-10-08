# IAM UI 009 — exact Linux Node.js 24.21.0 intake

| Control | Value |
|---|---|
| Stable ID / class / version | `IE-RES-IAM-UI-NODE24210-INTAKE-20261007` / controlled external-source intake and scoped dependency/license inventory / `0.1` |
| Document status / engineering disposition | `Draft` record / `APPROVED-WITH-OBLIGATIONS` for the exact current use below |
| Product normativity / repository instruction | `INFORMATIVE`; no new product requirement / `NOT-APPLICABLE` |
| Owner / author | Engineering intake and development-host operator / Codex bounded research worker |
| Reviewer / acceptance authority | Project Reviewer Nguyen Huynh Phuc Lam; independent review of this record `NOT-RUN` / current human instruction to inspect and pin the existing Linux runtime before admitting scoped internal use; no separate Legal Review approval claimed |
| Baseline / evidence date | Issue #46, `009-iam-rbac-ui-integration`, readiness continuation after `5b2fb9fbeec9e2edc23532de7b2a81d84289a664`; inspected repository head `4c98f2266dd159c7609afcab4c95eb4479ae0384` / `2026-10-07`, project date label Asia/Ho_Chi_Minh (UTC+7) |
| Effective date / classification / retention | Product effective date `NOT-APPLICABLE` / `INTERNAL` / retain this identity, evidence and disposition with the increment and future inventory; preserve exact full legal texts with every tool copy |
| Upstream trace | [Intake procedure](../agents/external-source-intake.md), [authoring standard](../agents/product-document-authoring-standard.md), [P04 runtime intake](2026-09-23-p04-ubuntu-native-runtime-intake.md), [Node 24.19.0 admission](2026-10-05-node24190-project-admission.md), [T036 current-use rights](2026-10-06-t036-current-use-rights.md), [bounded T036 closure](2026-10-06-t036-bounded-closure.md) |
| Downstream trace | [009 readiness](../../specs/009-iam-rbac-ui-integration/integration-readiness.md), [readiness utilities](../../tools/iam-ui-readiness/README.md), [existing Web build script](../../apps/server/scripts/build-web-static.mjs); exact tool inventory is section 2 of this record |
| Change / supersession | Fresh exact-version/platform/current-use admission for Issue #46; supersedes no historical observation or project-wide 24.19.0 decision; no old F03/F04/F05 process exception is extended |
| Review trigger | Binary, archive, legal-text hash, version, selected packages, modification, execution scope or distribution model changes; actual missing/incompatible right or unmet obligation |
| Standards tailoring / evidence limit | `STD-INFO-001`, ISO/IEC/IEEE 15289:2019, and `STD-CM-001`, ISO 10007:2017, `STANDARD-GUIDED`: identity, trace, status and change control tailored to a build-tool intake; no standards conformity, complete compiled-component SBOM, legal opinion or product-gate approval |

## 1. Intended use and authority

Classification: `DEPENDENCY`, an existing unmodified Linux x64 engineering tool. The intended
use is internal Issue #46 / increment 009 build/test readiness, including the authorized offline
predecessor Web/Server package check. It does not admit new npm packages or change the locked Web
graph. Later T008+ implementation, live adoption, product deployment and release retain their own
applicable execution gates; this tooling record does not resolve PG4 by itself.

The selected execution form is a private Node-only projection containing the byte-identical
`bin/node` and complete `LICENSE`. It contains no npm, npx or corepack executable, script or module
tree. The existing Web script checks for adjacent npm and, when absent, invokes the retained
locked TypeScript and Vite CLIs using `process.execPath`. Their cache, platform-native inputs and
application notices require the separate exact-cache preflight recorded by the readiness owner.
Node admission alone does not admit those dependencies.

The current human instruction authorizes inspection/pinning before admission and continued
bounded internal readiness work. The recorded T036 comply-and-use decision supplies the rule
that identifiable usable grants with satisfiable obligations are treated as
`APPROVED-WITH-OBLIGATIONS`, rather than blocked solely by license classification. This record
applies that rule to fresh exact 24.21.0 evidence. The prior Windows 24.19.0 approval is comparison
evidence, not automatic approval of this successor/platform. No waived right or renewed historical
exception is inferred.

## 2. Exact source and dependency/license inventory

Publisher: Node.js project / OpenJS Foundation. Canonical source:
[nodejs/node](https://github.com/nodejs/node), tag `v24.21.0`. Official release context:
[Node.js 24.21.0 (LTS)](https://nodejs.org/en/blog/release/v24.21.0). Existing archive/installation
acquisition is historical P04 evidence; the following files were inspected on `2026-10-07`.

| Material | Exact identity / SHA-256 | Evidence |
|---|---|---|
| Retained Linux x64 distribution archive | `/home/phuclam/idea-ddm-downloads/node-v24.21.0-linux-x64.tar.xz`; `fd8e59d5a511510f6a298afb548f18c7d2b1be404d8b4a27d94fbe49f56cb2d6` | Authenticated read-only host hash matches the `node-v24.21.0-linux-x64.tar.xz` row in the [official release checksums](https://nodejs.org/en/blog/release/v24.21.0) and [checksum source](https://nodejs.org/download/release/v24.21.0/SHASUMS256.txt) |
| Existing executable | `/opt/idea/tools/node-v24.21.0-linux-x64/bin/node`; `7fde7b8afa198da66257f42ee2001d874c7355631e6d1579a5fb5ef1f246df4c`; prior authorized version observation `v24.21.0` | Fresh host hash equals the same archive member streamed with `tar -xOJf`; no extraction to disk or installation |
| Existing complete legal text | `/opt/idea/tools/node-v24.21.0-linux-x64/LICENSE`; UTF-8/LF `157609` bytes; `5888dbb9a1d2b18f2c3e6c5f6af1b39de658372b402a0577b002777f14c62ace` | Fresh host hash/size equals streamed archive member and the [exact-tag source LICENSE](https://raw.githubusercontent.com/nodejs/node/v24.21.0/LICENSE), fetched reference-only into memory |
| Intended private projection | Same executable and full legal-text pins above; Node-only layout | Copy/retention/execution preflight `NOT-RUN` by this research worker; readiness owner records actual projection paths and both hashes before execution |

The archive top-level file list includes `LICENSE`, `README.md` and `CHANGELOG.md`, with no separate
top-level `NOTICE`. Bundled legal material is carried in the full `LICENSE`; retain it intact,
including notices for source/tool components omitted from the Node-only projection. These
observations do not assert that every named source component is compiled into the executable.

Supply-chain limitation: the official archive checksum and streamed-member equality establish
byte identity with the published distribution. Independent PGP signature verification,
source-to-binary attestation and reproducible build are `NOT-RUN`. A checksum is not such an
attestation. No runtime archive, package, SDK or dependency was downloaded or installed for this
inspection.

## 3. Exact change from the admitted 24.19.0 legal text

The prior retained [LICENSE](../third-party/node-24.19.0/LICENSE.txt), normalized to its recorded
UTF-8/LF representation, is `157606` bytes with SHA-256
`148eacf7863ef4329224a29398623077200a27194aa075569faf4a0a85566ca5`.
The inspected Windows checkout has CRLF bytes (`160552` bytes, SHA-256
`d9c4eeda951d6d08f4aa1316b61aafcf67e6da5f79b18f8edeb56fa6abdc038c`). This is a checkout
representation difference; normalizing line endings recovers the prior admitted pin. The old
file was not edited.

Both normalized texts contain `2946` lines and the same `44` component-section headers. An ordinal
full-line comparison found exactly two changed lines, both in the zlib section:

| LICENSE line | 24.19.0 text | Installed/tagged 24.21.0 text |
|---|---|---|
| 1788 | `version 1.3.1, January 22nd, 2024` | `version 1.3.2.1, February xxth, 2026` |
| 1790 | Copyright range `1995-2024` | Copyright range `1995-2026` |

All other lines, including the zlib grant/conditions and ICU/Unicode/NAIST–ICOT sections, compare
equal. This legal-text comparison does not mean the binaries or bundled component versions are
identical. The new archive and executable remain pinned independently in section 2.

## 4. Rights finding, obligations and disposition

The [exact LICENSE](https://github.com/nodejs/node/blob/v24.21.0/LICENSE) contains the Node MIT
grant and separate Apache, BSD, ISC, zlib, Unicode-3.0/legacy ICU and other supplied grants/notices.
It identifies NAIST/IPADIC–ICOT notice/disclaimer and lawful-distribution conditions. No
commercial-use prohibition was identified for the current unmodified internal use. Engineering
interprets the inspected grants as compatible with that use, subject to the actions below.

| Obligation / accountable owner | Concrete action / current state |
|---|---|
| Full legal material — development-host operator and readiness owner | Preserve the exact complete LICENSE with the installed tool, retained archive and every private projection. Existing installation/archive retention `PASS`; projection retention/hash check `NOT-RUN` here and required before its execution |
| Attribution, disclaimers, names and endorsement — Engineering and any later packaging owner | Keep applicable notices and disclaimers; do not imply prohibited third-party endorsement. Preserve source-specific marking/notice duties if material is later modified |
| Patent, trademark and special distribution terms — Engineering; release owner for changed delivery | Carry the actual grants and their conditions. Reassess the actual redistributed material, including source-specific ICU/NAIST–ICOT conditions, before a later tool/component delivery |
| Exact source/use stability — readiness owner | Check executable/LICENSE hashes, Node-only layout and retained locked cache before execution; stop on drift, new acquisition, missing grant or unsatisfied applicable duty |

Disposition: **`APPROVED-WITH-OBLIGATIONS` for the exact Node-only internal 009 build/test use**.
This is a bounded engineering admission under current human authority. It does not record counsel
approval, approve general Linux tooling, expand project-wide 24.19.0 approval, or qualify future
customer/native-tool redistribution. T036's accepted bounded closure and residual native-map
limitation remain as recorded; this intake does not reopen or repeat that exhaustive exercise.

## 5. Performed checks and handoff

| Check / oracle | Actual result |
|---|---|
| Authenticated host reads using `BatchMode=yes` and `StrictHostKeyChecking=yes`; public legal files and exact tool/archive paths only | `PASS`; no secret files read or values retained |
| Archive hash equals official release checksum; streamed executable/LICENSE equal installation | `PASS` |
| Exact-tag LICENSE bytes/hash equal installed/archive LICENSE | `PASS` |
| Full legal-text comparison against prior LF pin; count and classify differences | `PASS`; two zlib notice lines only; 44 headers unchanged |
| Node-only projection, locked Web cache and actual build/test | `NOT-RUN` by this research worker; readiness owner records their separate execution evidence |
| PGP verification, reproducible build, complete compiled-component SBOM and independent legal review | `NOT-RUN`; not claimed by this admission |
| Document relative links and whitespace/diff check | `PASS`: 10 relative links resolve; new-file whitespace/conflict-marker checks and `git diff --check` pass |

Next action for the readiness owner: create or select the authorized private Node-only projection,
retain the full exact LICENSE, verify both pins and absence of adjacent npm candidates, then apply
the already prepared scoped offline package procedure and record its actual outcome. This worker
writes only this record and performs no commit, push, tracker write, build or install.
