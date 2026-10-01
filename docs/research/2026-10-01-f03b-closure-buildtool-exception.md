# F03-B Closure Build-Tool Process Exception

| Field | Value |
|---|---|
| Stable ID / class | `IE-RES-F03B-CLOSURE-BUILDTOOL-EXCEPTION-20261001` / bounded process-exception record |
| Version / status | `0.3` / Approved for the process scope below; preflight and scoped offline execution PASS |
| Product normativity | INFORMATIVE; no product requirement or license/legal approval |
| Owner / author | Engineering / Codex |
| Authorization / authority | Project Reviewer, explicit user approval on 2026-10-01 before closure execution |
| Applicability / date | Issue #24 / PR #25 / F03-B closure T040, T042, T044 and necessary affected regression only / 2026-10-01 +07:00 |
| Classification / retention | INTERNAL; retain with F03-B closure and the referenced historical intake |
| Upstream | [Historical exact-artifact intake](2026-10-01-t043-maven-web-build-intake.md), [source-intake rule](../agents/external-source-intake.md), Project Reviewer's scoped approval |
| Downstream | [Closure execution gate](../../specs/005-ph1-foundation-custody/evidence/F03-B-closure-matrix.md#4-t044-execution-gate-and-procedure), T040/T042/T044 Maven build/test commands |
| Change / supersession | Supersedes v0.2 control envelope; append actual scoped execution. Does not rewrite or supersede historical T043 intake/evidence |
| Review trigger | Any artifact, version, graph, hash, use-scope or distribution change; missing approved cache/source |
| Expiry / remediation | Expires at F03-B whole-card acceptance or earlier withdrawal/scope change. Further use requires separate intake/authorization; no authority carries into F04/F05. Engineering retains the inventory, attribution and open T036/Legal Review obligations. |
| Evidence / limits | Prior artifact inspection is not a legal determination. Scoped offline build/test, realm and package exclusion PASS; whole-card acceptance PENDING; Legal Review and T036 separate |

## Authorization

The Project Reviewer authorizes a bounded internal engineering process exception for the exact
previously inspected and checksummed Maven build-tool artifacts recorded in
`IE-RES-T043-MAVEN-WEB-INTAKE-20261001`, solely for F03-B closure execution under Issue #24 /
PR #25, including T040/T042/T044 build and regression commands. This does not constitute legal
approval, commercial clearance, redistribution approval, or authorization for F04/F05/general
development. Any artifact/version/dependency-graph/hash/scope change reopens intake and blocks
execution until separately authorized.

The admitted inventory is exactly `org.codehaus.mojo:exec-maven-plugin:3.6.3` and its eight
runtime dependencies in the historical intake's **Exact artifact inventory** table: nine JARs
total. That table is the single source of truth for coordinates and SHA-256 values. Original
license and notice files remain with the unmodified cached artifacts. The exception waives the
process gate for this use; it grants no additional license rights and does not replace Legal
Review or T036.

## Before each closure execution

1. Verify all nine cached JARs against the referenced SHA-256 values and the plugin descriptor's
   exact runtime graph. Retain the preflight result before invoking Maven. Missing artifacts,
   changed hashes or any additional plugin execution JAR are BLOCKED.
2. Use the existing approved Maven/runtime and locked application dependencies with offline
   resolution. No new Internet artifact/package acquisition, version, plugin or dependency graph.
   Check cache prerequisites first; an offline resolution failure is BLOCKED, not permission to
   download a substitute.
3. Keep these artifacts build-only. Inspect the resulting executable JAR: none of the nine may
   occur in `BOOT-INF/lib` or become an application dependency. Preserve actual Web packaging.
4. Retain exact source, commands, artifact/preflight hashes and results in successor closure
   evidence. No credentials or session/proof values in retained output. No `mvn clean` or verifier.

Current tooling authority: **AUTHORIZED FOR F03-B CLOSURE ONLY**, conditional on successful
pre-execution artifact/cache verification. This is not a test PASS, whole-card acceptance,
authorization to merge, or an expanded intake for future work.

## Initial artifact preflight — 2026-10-01

Authenticated SSH as `phuclam` on `ideaddmserver`; no package acquisition. SHA-256 checks of
the nine existing JARs in `/home/phuclam/.m2/repository` all matched the historical inventory.
The plugin's embedded `META-INF/maven/plugin.xml` lists exactly the eight admitted runtime
dependencies, no additional coordinate. Descriptor SHA-256:
`186E94C4147FC6600DBB0865B50FF3783D19B6F9A0FA06732521706AE2605A96`.

The standard-library inspection helper SHA-256 was
`72FAACE51D6284AA94C4FE8E602E15BD64CAFA65EAA96C95C45370593C405CAC`;
the copied historical intake SHA-256 was
`54C9BE2508166410B50E9B19EC0437031A510D3249C5FD5E85ADF80AC94E536C`.
Its first attempt included supplemental-license rows in the inventory count and stopped before
JAR inspection; narrowing its parser to Maven coordinates yielded the nine-artifact PASS.
No Maven lifecycle goal was invoked during this check.

Existing Maven distribution reports `3.9.16` at
`/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38` with qualified Temurin
`25.0.4.1+1`; Node reports `24.21.0`. `mvn -v` is a version probe only. Complete offline
build/test resolution and resulting package exclusion remain NOT-RUN and must be recorded
separately; artifact preflight does not assert every lifecycle dependency is cached.

## Scoped execution receipt — 2026-10-01

The initial NOT-RUN wording above remains the historical pre-execution state. Subsequent runs
completed offline with all nine hashes/descriptor rechecked before Maven. Fresh public V1–V7,
successor ownership/privileges, final 108-test regression and actual Web requalification passed;
prior failed tests and repairs remain explicit in [F03 evidence §39](../../specs/005-ph1-foundation-custody/evidence/F03-identity-results.md#39-f03-b-closure-execution-and-review-submission).

Credential-free offline realm inspection included seven admitted JARs (plugin, plexus-utils,
plexus-xml, commons-exec, asm, asm-commons, asm-tree); provided Maven API was imported from its
existing realm. No additional plugin execution JAR was present. This does not claim all nine
inventoried artifacts were loaded. The resulting executable JAR contained none of the nine in
`BOOT-INF/lib`; all packaged SQL matched V1–V7 and actual Web remained packaged.

Execution receipts identify exact sources, package/helper/log hashes and commands in §39.
No artifact/version/graph/download was added. The exception remains bounded and expires as
specified above; no authority carries into F04/F05/general development or legal/commercial use.
