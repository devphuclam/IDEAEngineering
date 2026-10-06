# T036 current-use compliance decision and notice repair

| Control | Value |
|---|---|
| ID / class / version | IE-RES-T036-COMPLY-20261006 / decision receipt and bounded verification / 0.1 |
| Status / authority | Approved current-use decision in the human conversation; repair execution NOT-RUN at initial publication |
| Owner / author / reviewer | Engineering / Codex CODEX_ONLY / Project Reviewer Nguyễn Huỳnh Phúc Lâm |
| Date / baseline | 2026-10-06 Asia/Ho_Chi_Minh; PR38 e25b2372230d903379247d23b505538b48d9373e |
| Normativity / scope | INFORMATIVE product; explicit T036 intake disposition direction for current PH1 internal engineering/integration; no new product behavior or future commercial-release acceptance |
| Source / downstream | Human T036 comply-and-use decision; [intake](../agents/external-source-intake.md) / [closure matrix](../../specs/005-ph1-foundation-custody/evidence/PH1-T036-closure-matrix.md) |
| Retention / tailoring | INTERNAL; retain predecessor findings/exceptions unchanged; IE-STD-AUTH-001 STANDARD-GUIDED |
| Trigger | Exact source/version/hash/terms, payload, intended-use or obligation drift reopens affected intake |

## Decision

Known applicable terms permitting the actual use are APPROVED-WITH-OBLIGATIONS, not
BLOCKED-LEGAL merely for notice, attribution, reciprocal/source-availability, patent,
acknowledgement or custom compliance conditions. The human decision supersedes that automatic
classification for T036 only; it does not retroactively rewrite historical authorization.
BLOCKED-LEGAL remains for unidentified applicable rights, genuinely unclear/conflicting terms,
actual use restrictions, or mandatory obligations IDEA cannot or will not satisfy.
T036 is current PH1 rights/compliance review, not every possible future commercial delivery gate.

## Bounded notice-copy intake before import

Use COPY-OR-ADAPT for legal text only, with no external implementation/source vendoring.
Retain complete exact-version grants and copyright/notice texts already attributable in the
linked intake. Ordinary Apache-2.0 legal-text retention is APPROVED-WITH-OBLIGATIONS under
the current decision: preserve original wording, permissions, disclaimers, attribution,
patent/trademark conditions; no implied endorsement or undertaking of upstream warranty.
Source raw hash and retained-copy hash are separate if newline formatting differs.
No dependency, version or execution graph changes; no purchase or stack replacement.

Sources: SnakeYAML 2.6 commit 9f02cc56e5afb989ca5baac1e0052c3f006cdbec LICENSE and Google
2008 source-header attribution; JSpecify 1.0.1 commit ce9bec0b8895f424d999d31e3a1bd33694ee4c0c
LICENSE/AUTHORS; HikariCP HikariCP-7.0.2 LICENSE; jmolecules 2.0.1 LICENSE (both events and
jstereotype); Flyway flyway-12.4.0 LICENSE.txt plus full Apache terms; ArchUnit v1.4.2
LICENSE/NOTICE and shaded Guava v33.5.0 LICENSE. ArchUnit's exact build version catalog pins
Guava 33.5.0-jre and ASM 9.9.1; retained ASM legal bytes are not replaced.
Exact URLs/hashes belong in the supplemental notice manifest before package projection.
Engineering owns notice-copy retention. These files do not approve a new third-party binary.

## Agreed qualification boundary and execution path

The user authorized completion of R36-01–03 and retention/packaging of required legal texts.
Test seam is the actual copied executable JAR's readable supplemental notices, not application
behavior: missing/supplied-wrong notice FAIL; exact hash PASS; all original entry names and
uncompressed bytes unchanged. This extends notice-retention qualification only, not R36-04 Web
behavior or a new feature. No Maven/Boot/npm execution is needed.

Use existing PowerShell/.NET ZIP support to inspect retained Server/Gateway JARs and create
fresh owned copies under `.tmp/t036-supplemental-20261006-01`; refuse existing output files.
Retained input hashes: Server dde3f36b1ad015d46c46585b78d77b660f7a62037e7ca7215574ec7186bcc151;
Gateway c26b870e22a6ffb6ed9acbcbcd1dd20208004226c4d09a399e227983023a14e1.
Add only `BOOT-INF/classes/third-party/ph1-runtime/` legal documents. Normal Maven resource
copying of checked-in resources will retain them in a later separately authorized build;
this projection is not a fresh final-F05 executable build or deployment.

No new binary/archive/package download/install, Java/test-feature/migration/dependency change,
DB, listener, preview, verifier, timer or merge. Reference retrieval of exact legal text only.
STOP on source/hash drift, unclear terms, malformed/unexpected package, mutation of old entries,
missing retained input, unsafe output path or new tooling/dependency requirement.
Preserve predecessor JARs and genuine RED evidence. Publish exact source before projection.

## Result

Initial state: focused checks and package projection NOT-RUN. Successor receipt records actual
source, commands, hashes and outcomes; no planned check is labeled PASS here.
