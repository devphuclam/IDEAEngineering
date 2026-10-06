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

## Exact legal-text acquisition and retained-copy identity

Reference retrieval on 2026-10-06 used HTTPS HttpClient into RAM only; no binary/package/source
archive was acquired. Prior applicable grants and the COPY-OR-ADAPT disposition above preceded
resource import. Exact raw source hashes are:

| Legal text | Raw source SHA-256 | Exact source |
|---|---|---|
| jspecify-1.0.1-LICENSE.txt | cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30 | https://raw.githubusercontent.com/jspecify/jspecify/ce9bec0b8895f424d999d31e3a1bd33694ee4c0c/LICENSE |
| jspecify-1.0.1-AUTHORS.txt | e70db5d4e0bd433a8b9357518dd8f8847c434826d9587cfc35eca1e1d5a57d3f | https://raw.githubusercontent.com/jspecify/jspecify/ce9bec0b8895f424d999d31e3a1bd33694ee4c0c/AUTHORS |
| HikariCP-7.0.2-LICENSE.txt | 73ba74dfaa520b49a401b5d21459a8523a146f3b7518a833eea5efa85130bf68 | https://raw.githubusercontent.com/brettwooldridge/HikariCP/HikariCP-7.0.2/LICENSE |
| jmolecules-2.0.1-LICENSE.txt | c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4 | https://raw.githubusercontent.com/xmolecules/jmolecules/2.0.1/LICENSE |
| archunit-1.4.2-LICENSE.txt | cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30 | https://raw.githubusercontent.com/TNG/ArchUnit/v1.4.2/LICENSE |
| archunit-1.4.2-NOTICE.txt | 60a54e77051d8d8fc6099934b335751254ea19f0ee3069fc090a263884a17c6f | https://raw.githubusercontent.com/TNG/ArchUnit/v1.4.2/NOTICE |
| guava-33.5.0-LICENSE.txt | cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30 | https://raw.githubusercontent.com/google/guava/v33.5.0/LICENSE |
| flyway-12.4.0-LICENSE.txt | 6707b7b3ba3220ab64a81a5ab869ffecc3a6a023e9488ea08b897471b069c078 | https://raw.githubusercontent.com/flyway/flyway/flyway-12.4.0/LICENSE.txt |
| snakeyaml-2.6-LICENSE.txt | a6cba85bc92e0cff7a450b1d873c0eaa2e9fc96bf472df0247a26bec77bf3ff9 | https://codeberg.org/snakeyaml/snakeyaml/raw/commit/9f02cc56e5afb989ca5baac1e0052c3f006cdbec/LICENSE.txt |

All nine retained license/copyright/notice texts match these raw hashes except ArchUnit NOTICE:
its original CRLF bytes have hash 60a54e77051d8d8fc6099934b335751254ea19f0ee3069fc090a263884a17c6f;
the wording-identical LF resource has hash dc30acf8d923ab6d9dc86090d35efe43eb9ec02f233fc53a62f5cd5012e58117.
This is legal-text line-ending formatting, not replacement of terms or an archive-input hash PASS.
Narrow .gitattributes rules keep only these resource texts LF on checkout; no Git configuration changes.

The accompanying IDEA-authored SOURCES-NOTICE identifies exact grants, Google/SnakeYAML and
JSpecify copyright sources, ArchUnit's actual NOTICE and Guava exact version, and covered
Jakarta/Tomcat source availability. EPL-2.0 is the applicable Jakarta route for unchanged current
use under the human disposition; alternative upstream text is retained, not erased. The exact
component source locations accompany current internal copies. No unrelated IDEA-source license
or future external offering is inferred. Maven/build tools remain absent from application payload.

## Performed successor execution

On 2026-10-06, checker source 4005ef19f0694a10a6e2dfd50cf22cb997def741 was committed/pushed
before RED. Both retained packages failed `SUPPLEMENTAL_NOTICE_MISSING=snakeyaml-2.6-LICENSE.txt`.
Legal resources/projection were published at e0477bebb0064a5efe95ab503415516ccffb834e before use.
The initial `.NET ZipArchiveMode.Update` projection produced corrupt old local ZIP headers;
`server-green-01.jar` / `gateway-green-01.jar` are retained as FAILED, not a package PASS.
Original inputs remained readable and hash-identical. The repair was published at
527c49f27de824a4e8151680425b37575b574890 before executing fresh `*-green-02.jar` outputs:
create a new ZIP, copy every original uncompressed entry, add only legal resources.

Final detector/negative harness source f4937a77448edcd41d675f7e78425e50545052e3 was published
before repeat/negative checks. All outputs remain in `.tmp/t036-supplemental-20261006-01`.

| Actual artifact / oracle | Result / exact SHA-256 |
|---|---|
| Server green-02 and independently checked repeat-03 | PASS; 269 original entries byte-identical, 10 supplemental legal entries only; 5a31ecd4ce54e5862ec4e9fa4040ec24c94361d0c00abd11e4e4a6966eb965d8 |
| Gateway green-02 and independently checked repeat-03 | PASS; 186 original entries byte-identical, 4 supplemental legal entries only; d2198eef968f0462462c9f1a4bde7dc0815360888f48a4d1d0094471a33adc7a |
| Server/Gateway negative-01 with only SnakeYAML legal bytes damaged | Both correctly refused: SUPPLEMENTAL_NOTICE_HASH_MISMATCH=snakeyaml-2.6-LICENSE.txt |
| Original Server/Gateway rehash | PASS; dde3f36b…bcc151 / c26b870e…a14e1 unchanged |

Commands use existing PowerShell/.NET, from repository root:

```powershell
pwsh -NoProfile -File tests/ph1/web-qualification/project-supplemental-notices.ps1 -Profile Server -OutputName server-green-02.jar
pwsh -NoProfile -File tests/ph1/web-qualification/project-supplemental-notices.ps1 -Profile Gateway -OutputName gateway-green-02.jar
# Same commands with server-repeat-03.jar / gateway-repeat-03.jar, on final harness source.
pwsh -NoProfile -File tests/ph1/web-qualification/check-supplemental-negative.ps1 -Profile Server
pwsh -NoProfile -File tests/ph1/web-qualification/check-supplemental-negative.ps1 -Profile Gateway
```

The positive checker reads each expected legal entry and its exact hash and compares original
entry names/uncompressed bytes. Negative fixtures never modify original inputs or checked-in
legal resources. After an interrupted tool response, repeated artifacts and both negative
fixtures were independently reopened/rechecked; no completion was inferred from an interrupted
call alone. Console results are retained in the task transcript, not claimed as new host logs.

This proves notice projection/retention only. No JAR was launched; a fresh complete F05 Server
package, executable-launch qualification or deployment is not inferred. Nested library bytes,
Java classes, migrations and static application bytes were unchanged. No Maven/npm execution,
new binary/tool acquisition, graph change, database, TLS/listener, verifier, preview or merge.

Current known-term disposition is APPROVED-WITH-OBLIGATIONS in the successor rights map.
Full external native Rust component/grant coverage remains UNKNOWN in R36-02; whole T036
NOT-CLOSED is explicit in the current matrix. Historical exceptions and missing-right findings
are preserved, not rewritten as previously approved.
