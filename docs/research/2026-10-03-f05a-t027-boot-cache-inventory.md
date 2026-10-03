# T027 Boot qualification — read-only candidate inventory

| Control | Value |
|---|---|
| ID / class | `IE-RES-F05A-T027-BOOT-CACHE-20261003` / execution-readiness research record |
| Version / status | `0.1 / Draft`; candidate inventory, not dependency admission or execution approval |
| Product normativity / process instruction | `INFORMATIVE / NOT-APPLICABLE` |
| Owner / author / mode | Project Reviewer Nguyễn Huỳnh Phúc Lâm / Codex / `CODEX_ONLY` |
| Reviewer / acceptance authority | Project Reviewer; candidate/result review `NOT-RUN`; custom terms require Legal Review or an explicitly bounded process disposition |
| Evidence date / classification | 2026-10-03, Asia/Ho_Chi_Minh / `INTERNAL` |
| Baseline / change | [Work Item #37](https://github.com/devphuclam/IDEAEngineering/issues/37), [PR #38](https://github.com/devphuclam/IDEAEngineering/pull/38); inspection starts from `7daf6965ecf1e751ee920b3b309a19d8ed4ed9ce` |
| Upstream | [Frozen preparation](2026-09-28-ph1-f05-gateway-qualification.md), [current preflight](2026-10-03-f05a-t027-preflight.md), [Q01 receipt](2026-10-03-f05a-t027-q01-execution-package.md), [intake rules](../agents/external-source-intake.md) |
| Downstream / retention | Exact future Boot qualification intake/command package; retain these tables with T027 evidence |
| Supersession / trigger | No historical/frozen record superseded; reopen on source/hash/version/graph/use/target change |
| Evidence / tailoring | Observed cached bytes and descriptor facts; static candidate interpretation, NOT-RUN qualification. Control/verification identity tailored under [authoring standard](../agents/product-document-authoring-standard.md); no standards conformity or legal-clearance claim |

## 1. Purpose and current authorization

Prepare the next internal Boot qualification slice without creating `apps/gateway`, a product
endpoint or a POM before its exact pre-use intake. User approved harness preparation and ordered
current-state reconciliation. Only Q01 execution was separately approved/executed.

Selected direction remains Temurin25.0.4.1+1, Boot4.1.1 and Maven3.9.16. This inventory does not
replace it with a JDK-only HTTP implementation, rebuild the Server or reuse a prior exception.
No Maven goal, resolver, build, download/install, DB, certificate, tunnel or listener ran.

## 2. Runtime candidate graph and observed cache

Candidate roots: Boot `spring-boot-starter-webmvc:4.1.1` and
`spring-boot-starter-log4j2:4.1.1`, excluding `spring-boot-starter-logging` on the WebMVC root's
entire dependency path. No Server JDBC/Flyway/Modulith/Security/Web/Swagger graph is copied.
The WebMVC starter carries Jackson and Tomcat EL/WebSocket dependencies; their presence in the
candidate table is not implementation of JSON business APIs or WebSockets.

[Runtime cache table](inventories/f05a-q02-runtime-cache.tsv) identifies **38 candidate JARs
and their 38 POMs**, all present with observed SHA-256. Paths are derived from each coordinate
under `/home/phuclam/.m2/repository/<group path>/<artifact>/<version>/<artifact>-<version>.*`.
These are cached bytes, not freshly downloaded or independently authenticated publisher releases.
Source and rights provenance must be reconciled before admission.

Read cached Boot/Spring/Log4j descriptors and relevant Jackson/Micrometer POMs. Root Boot BOM
mediation matters: it selects commons-logging1.3.6 instead of Spring's declared1.3.5,
Micrometer1.17.1 instead of declared1.16.7, and JSpecify1.0.1 instead of Spring's declared1.0.0.
The tables use those managed candidates; Jackson3.1.5 uses annotations2.21. Do not choose the
first installed version or equate a static list with a resolved effective Maven graph.

This is **not** a complete effective-model/resolver certificate: parent/imported BOM closure,
scope/exclusion/mediation and actual package contents still require controlled reconciliation.
No runtime package has been admitted solely because it appears here.

## 3. Rights evidence: identified, not blanket approved

[Embedded legal-file table](inventories/f05a-q02-runtime-legal-files.tsv) identifies **74**
license/notice/copyright-named entries in the candidate runtime JARs and their SHA-256.
Listing/hashing is not full-text obligation review. SnakeYAML2.6 and JSpecify1.0.1 had no matching
embedded legal entry in this inspection; exact upstream/package evidence remains Codex's task.
Metadata alone must not substitute for the missing legal files.

Jackson-core includes FastDoubleParser, its third-party terms and Schubfach notices in addition
to its main Apache license. Tomcat-core and Log4j-core have distinct license files from their
siblings. Jakarta Annotation carries dual-license choices. Inspect the exact files and choose
the intended-use disposition rather than calling every runtime JAR simply Apache-2.0.
Existing F01 source/rights observations may be cited as history; their Server-scoped admission
does not approve this Gateway graph or commercial distribution.

Intended later use: `DEPENDENCY`, unchanged components for internal T027 build/runtime
qualification only; preserve bundled notices. Current disposition for every table row is
`NOT_ADMITTED`, not a substitute for the intake procedure's final disposition.
Codex owns remaining rights evidence/reconciliation; unresolved/custom terms return to the
appropriate authority before import/use. No copy of third-party code or legal text enters here.

## 4. Build plugin candidates and genuine tooling gaps

Inspected embedded `META-INF/maven/plugin.xml` without executing plugin code:

- resources3.5.0: eight described dependency coordinates;
- compiler3.15.0: twelve;
- jar3.5.1: fifteen;
- Boot Maven plugin4.1.1: descriptor has an empty dependency list although its POM declares
  runtime dependencies. An empty descriptor is **not** evidence of an empty execution graph.

[Plugin cache table](inventories/f05a-q02-plugin-cache.tsv) records four roots and 32 distinct
described coordinates: **36 candidates, 34 JAR/POM pairs present** in `.m2/repository`.
This is incomplete: Boot plugin transitive closure, Maven distribution/core-provided artifacts,
parent/BOM descriptors and any lifecycle/test tooling selected later still need reconciliation.
Surefire, help/dependency plugins, clean, exec/Web build hooks and test libraries are not admitted
by this inventory; do not run a normal lifecycle assuming they are harmless or already covered.

Two described repository pairs were absent:

| Coordinate | Observation / bounded next action |
|---|---|
| `org.codehaus.plexus:plexus-component-annotations:2.2.0` | Missing repository pair; same-version JAR observed in existing Maven `lib`. Determine legitimate core-provided filtering before concluding that a download is required. |
| `org.codehaus.plexus:plexus-classworlds:2.9.0` | Missing repository pair; Maven `boot` contains2.11.0, not2.9.0. Determine actual realm provision/filter semantics; no silent replacement or cache download. |

Plexus-utils3.6.0/4.0.2/4.0.3 and Plexus-xml3.0.1 enter even without the Server exec plugin.
Observed all three utils JARs contain the ExtremeLab/Javolution/ThoughtWorks legal entries.
Read those three supplemental terms from the exact4.0.2 JAR in full; other exact versions and
xml obligations still require reconciliation. The existing T043/F03-B/#26/F04 exception does
not authorize any of these versions for F05. **Custom-terms reuse remains BLOCKED-LEGAL pending
applicable disposition**; do not declare it absent merely by dropping the Web hook.

## 5. Smallest next preparation unit

Finish Boot plugin/Maven realm and parent/BOM closure; inspect all used legal files and retain
exact sources/hashes. Resolve missing-cache/core-provided questions with evidence, not substitute
versions. Then present one exact scoped intake and command package for the Boot qualification
slice. It must pin its first-party source, all actual-used inputs and fresh owned subdirectory,
remain offline, fail on graph/hash drift and use no DB or preview.

No test code/POM/import/build follows from this candidate inventory. Prepare its external-process
oracle before implementation: separate packaged Boot process starts/stops at an owned loopback
target and exposes only a synthetic qualification probe; this is not a supported Gateway route.
The exact seam/command and any TLS provisioning remain subject to their reviewed package.
Do not pre-build transfer/Grant/Receipt business endpoints or silently authorize T028–T034.

## 6. Disposition

Current metadata reconciliation: Q01 PASS; remaining T027 NOT-RUN. All 46 task identities/markers
stay unchanged; requirement checklists remain 12/12 and16/16 accepted, not runtime evidence.
F05-A IN_PROGRESS; PR #38 DRAFT; no merge, card completion, timer action or verifier execution.
This record makes the next intake work reproducible; it is not a technical PASS for Boot/TLS/Adapter.

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-10-03 | Read-only runtime/plugin/embedded legal-file candidate inventory, mediation observations and unresolved tooling/rights gates |
