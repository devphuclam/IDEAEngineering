# PH1 F03-B HTTP Security Dependency Intake

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-PH1-F03B-DEP-001` |
| Document class / title | `RESEARCH-NOTE` / PH1 F03-B HTTP Security Dependency Intake |
| Version / status | `0.3` / `Draft` |
| Product normativity | `INFORMATIVE`; no new product requirement, live security policy or Tech selection |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Engineering / Codex research agent |
| Reviewer / acceptance authority | Project Reviewer / Product Decision Authority acceptance `NOT-RUN`; commercial Legal Review Authority review `NOT-RUN` |
| Evidence date / effective date | 2026-09-30, Asia/Ho_Chi_Minh / `NOT-APPLICABLE` |
| Applicable baseline | PH1 F03-B synthetic development profile; existing Java 25, Spring Boot 4.1.1 and Spring Security 7.1.x selection |
| Intended use / current disposition | `DEPENDENCY`; Engineering `APPROVED-WITH-OBLIGATIONS` for the exact five-coordinate delta and internal development/build/test only; no commercial-release or Product Decision Authority acceptance. |
| Upstream trace | Work Item [#24](https://github.com/devphuclam/IDEAEngineering/issues/24); [PH1 spec](../../specs/005-ph1-foundation-custody/spec.md), User Story 3 / `FR-005` / `FR-014`; [external-source intake](../agents/external-source-intake.md); [F03-A crypto intake](2026-09-30-ph1-f03a-security-crypto-intake.md), `IE-RES-PH1-F03A-DEP-001` |
| Downstream trace | F03-B implementation planning and HTTP/PostgreSQL verification; PH1 T036 resolved dependency, archive, notice and eventual bundle review |
| Classification / retention | `INTERNAL`; retain with the exact dependency version, intake chronology and later inventory/SBOM review |
| Change record / supersession | v0.1 research; v0.2 admission before POM change/first resolution; v0.3 implementer archive/resolution follow-up, Work Item #24. No Feature/Spec/Tech baseline change. Supersedes / superseded by `NOT-APPLICABLE`. |
| Review trigger | Exact package/version, resolved graph, source/license, test mechanism, linking/hosting or distribution-model change |
| Evidence status | Original research inspected immutable source, metadata and legal files without package import. Subsequent implementer resolution/archive checks are in section 8; no commercial clearance or whole-card acceptance. |

Control tailoring: ISO/IEC/IEEE 15289:2019 and ISO 10007:2017 are `STANDARD-GUIDED` for
research identity, source pinning and change control. This is a dependency research note, not a
technology decision, acceptance record or standards-conformity claim. Document approval,
Engineering admission, runtime qualification and commercial authority remain separate states.

## 1. Candidate scope and exact source

The recommended direct candidate is
**`org.springframework.boot:spring-boot-starter-security:4.1.1`**, with an explicit exclusion of
`org.springframework.boot:spring-boot-starter-logging`. Keep version management under the existing
Boot parent. The new runtime-coordinate delta is the five entries below, including that direct
starter; this is a published-metadata comparison, not an executed Maven resolution result.

| Candidate coordinate | Reach / purpose | Exact upstream source identity |
|---|---|---|
| `org.springframework.boot:spring-boot-starter-security:4.1.1` | Direct; standard Boot HTTP security starter | Spring Boot `v4.1.1`, commit `6fdf67ea1552691e932604d4bf67a5e08ff0b0ea`; [starter build](https://github.com/spring-projects/spring-boot/blob/6fdf67ea1552691e932604d4bf67a5e08ff0b0ea/starter/spring-boot-starter-security/build.gradle) |
| `org.springframework.boot:spring-boot-security:4.1.1` | Required transitive; Boot security configuration module | Same Boot commit; [module build](https://github.com/spring-projects/spring-boot/blob/6fdf67ea1552691e932604d4bf67a5e08ff0b0ea/module/spring-boot-security/build.gradle) |
| `org.springframework.security:spring-security-config:7.1.1` | Required transitive; framework security configuration | Spring Security tag `7.1.1`, commit `a825937b8175ee85872c49d9c7fc25eea8cff991`; [config build](https://github.com/spring-projects/spring-security/blob/a825937b8175ee85872c49d9c7fc25eea8cff991/config/spring-security-config.gradle) |
| `org.springframework.security:spring-security-web:7.1.1` | Required transitive; HTTP session, CSRF and security filters | Same Security commit; [web build](https://github.com/spring-projects/spring-security/blob/a825937b8175ee85872c49d9c7fc25eea8cff991/web/spring-security-web.gradle) |
| `org.springframework.security:spring-security-core:7.1.1` | Required transitive; authentication and authorization interfaces | Same Security commit; [core build](https://github.com/spring-projects/spring-security/blob/a825937b8175ee85872c49d9c7fc25eea8cff991/core/spring-security-core.gradle) |

Publisher/owner: Spring projects, canonical
[Spring Boot repository](https://github.com/spring-projects/spring-boot) and
[Spring Security repository](https://github.com/spring-projects/spring-security). The exact Boot
[BOM build](https://github.com/spring-projects/spring-boot/blob/6fdf67ea1552691e932604d4bf67a5e08ff0b0ea/platform/spring-boot-dependencies/build.gradle)
manages Security `7.1.1`. Versioned official Maven POMs inspected on the evidence date confirm the
same candidate coordinates:
[starter](https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-starter-security/4.1.1/spring-boot-starter-security-4.1.1.pom),
[Boot module](https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-security/4.1.1/spring-boot-security-4.1.1.pom),
[config](https://repo.maven.apache.org/maven2/org/springframework/security/spring-security-config/7.1.1/spring-security-config-7.1.1.pom),
[web](https://repo.maven.apache.org/maven2/org/springframework/security/spring-security-web/7.1.1/spring-security-web-7.1.1.pom),
[core](https://repo.maven.apache.org/maven2/org/springframework/security/spring-security-core/7.1.1/spring-security-core-7.1.1.pom).
No upstream implementation, example or documentation text is copied into IDEA.

## 2. Dependency comparison and reuse limits

| Evidence claim | Observed fact | Limit / IDEA interpretation |
|---|---|---|
| `F03B-DEP-C01` | The published starter POM requires Boot starter `4.1.1`, Boot security `4.1.1` and Spring AOP `7.0.9`. Boot security requires Boot core `4.1.1` and Security config/web `7.1.1`. | The new starter path needs its own logging exclusion. An exclusion attached only to the existing direct Boot starter does not exclude another dependency path. |
| `F03B-DEP-C02` | Published Security config/web POMs require Security core `7.1.1` and subsets of Spring AOP/Beans/Context/Core/Expression/Web `7.0.9`. Core requires crypto `7.1.1` and Micrometer observation `1.17.1` in addition to the Spring subset. | Framework `7.0.9`, Micrometer observation/commons `1.17.1` and their existing graph are in the retained [F01 dependency tree](../../specs/005-ph1-foundation-custody/evidence/F01-A-server-dependency-tree.json). Crypto `7.1.1` is already directly declared and separately admitted in F03-A. No further required runtime coordinate is identified by this candidate metadata. Compare the actual new resolved graph before making that an execution claim. |
| `F03B-DEP-C03` | The exact [Boot starter build](https://github.com/spring-projects/spring-boot/blob/6fdf67ea1552691e932604d4bf67a5e08ff0b0ea/starter/spring-boot-starter/build.gradle) includes `spring-boot-starter-logging`; the [F01 intake](2026-09-28-ph1-f01-dependency-intake.md) records the retained Log4j2 graph with no Logback. | Preserve the exclusion on the new starter and check that the resulting runtime tree still contains no Logback or competing logging backend. |
| `F03B-DEP-C04` | HTTP session security and the default session-backed CSRF repository are provided by the framework web module. [Official session guidance](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html) and [CSRF guidance](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html). | Ordinary container HTTP sessions plus IDEA's PostgreSQL eligibility record do not require a Spring Session JDBC/Redis package for this tracer bullet. Restart survival, replication and horizontal session storage are separate requirements, not inferred here. |
| `F03B-DEP-C05` | The existing [server POM](../../apps/server/pom.xml) contains crypto only and Boot starter-test. The [F03-A intake](2026-09-30-ph1-f03a-security-crypto-intake.md) expressly excludes HTTP/session security admission. | Reuse crypto's exact source/license evidence and qualified BCrypt path; do not extend its admitted scope silently to config/web/core or the Boot security packages. |

The tagged Security build files list optional integrations and upstream test dependencies that do
not become mandatory dependencies of the published main POMs. There is no need in this scope to
add OAuth, SAML, WebAuthn, LDAP, Reactor, Bouncy Castle or Password4j packages. A later addition
would reopen intake. Java 25's HTTP client and the already present test framework can drive a real
server over TCP, so `spring-security-test` is not necessary for the proposed acceptance tests.

No workstation Maven cache was found at `C:/Users/TD-999/.m2/repository/org/springframework`.
The retained F01 tree is a historical comparison baseline; it is not represented as the complete
current F02/F03-A graph. The Ubuntu cache and current application graph were not accessed.

## 3. Rights and immutable evidence

The exact Boot and Security tagged
[Boot LICENSE.txt](https://github.com/spring-projects/spring-boot/blob/6fdf67ea1552691e932604d4bf67a5e08ff0b0ea/LICENSE.txt) /
[Security LICENSE.txt](https://github.com/spring-projects/spring-security/blob/a825937b8175ee85872c49d9c7fc25eea8cff991/LICENSE.txt)
grant Apache-2.0 rights. Security's exact
[notice.txt](https://github.com/spring-projects/spring-security/blob/a825937b8175ee85872c49d9c7fc25eea8cff991/notice.txt)
adds acknowledgement and name/endorsement conditions. These source grants support a candidate
internal linking intake; package metadata alone is not the rights evidence. The existing crypto
record also retains the BCrypt third-party permission header. That obligation remains relevant
when the existing crypto package enters a later shipped bundle.

The following hashes were calculated from raw official HTTP response bytes held in memory on
2026-09-30. No package JAR or source archive was downloaded or imported.

| Exact legal material | SHA-256 |
|---|---|
| Boot LICENSE.txt at the pinned commit | `7200000367E0E8B47822D563A5DDD2DD3A97CC05B32BD7DBCC7B4EEB92B76628` |
| Security LICENSE.txt at the pinned commit | `7200000367E0E8B47822D563A5DDD2DD3A97CC05B32BD7DBCC7B4EEB92B76628` |
| Security notice.txt at the pinned commit | `A9682ACB2E05CE58E0091B1CC2205A1F301318D6523A1B3ED927B9766FDF11F9` |

| Candidate package | Published POM raw-byte SHA-256 | Published Gradle module raw-byte SHA-256 |
|---|---|---|
| Boot starter-security 4.1.1 | `37EC153C9B2AB4DD9E962035863EC2F1538611C11BE91389821E6415D69786BD` | `876E1334117CFA5A5B10E70BF235482F1FCF4F944249BCFF18405B73563117A0` |
| Boot security 4.1.1 | `51A0D7306D5BB8612716A45303B2A2288EFAE842FF2F17D0A570618BB4B32B69` | `12E669639D8307E7A8CEA6E30157E0CFE883387D777CFD7463BF3B7CA05EA742` |
| Security config 7.1.1 | `897DDD133B4D030A4CDE109BD5A93A6C32C07446F530068CF48B0626891E2765` | `D6F8E144302525FB2E533CC71048F7FA0390CBDE133712300806B4FA93E4D4B7` |
| Security web 7.1.1 | `C2973FB16CDAB4E3A58B230BDC8D9CB5E022A3D09C2EFC4EC0CADD1FCA03A2E1` | `A5753185A939362255CC0024AD81EE6F9D7C9746E07CEF5B188E0DDE88A14C2C` |
| Security core 7.1.1 | `ACE492A3CD6802F4AF8009AF31A8582F1973D96AEE4E7848823359D93BC08AC7` | `AB1BEC55FF103C325A7C2ADF8C8B924AC6DCB8DFA19643C6C96BD896462B5CEC` |

Each module document is at the same official versioned POM URL with its final `.pom` changed to
`.module`. Its main-variant advertised JAR hashes are recorded below as **publisher metadata**;
they are not local JAR verification results.

| Candidate main JAR | Advertised SHA-256 |
|---|---|
| spring-boot-starter-security-4.1.1.jar | `38628875b75cbed6ba4642f3b0a4baf4735bd4f82b49450e4ae5a5e4d1b7b4a9` |
| spring-boot-security-4.1.1.jar | `c940697be9bc67820d5011b86d58105836b7cae7c8fb5d4e61d635b51b392cbe` |
| spring-security-config-7.1.1.jar | `1f947c853f14cab76563464ee22e72f6672f3913db52647d2f5d1df5f2b1e5a5` |
| spring-security-web-7.1.1.jar | `dece134a2332c976a2c94ecf13f816c64e8ea7f2139795485afe655fba0408f3` |
| spring-security-core-7.1.1.jar | `98a5011baa78df36fb184e6ce0e8e086ca9a64fcdd8f161c0a96475a3a0907bd` |

Boot's actual packaged NOTICE/legal-file set and any bundled non-coordinate material remain
`NOT-RUN`; a root-level NOTICE lookup is not evidence that a JAR lacks applicable notices.
Security web's tagged build includes project JavaScript resources, so the final archive inventory
also needs to cover bundled material rather than only Maven coordinates.

## 4. Admission and qualification follow-up

Engineering implementer disposition recorded on 2026-09-30 **before POM change or first
resolution**: `APPROVED-WITH-OBLIGATIONS` for the exact five-coordinate delta, logging exclusion
and internal development/build/test use above. The inspected source grants support unchanged
linking for this use; no custom, non-commercial or incompatible right was identified in this
scope. This is an engineering intake decision, not Legal Review Authority clearance or approval
of the future offering. The coordinate table in section 1 is also the bounded F03-B
dependency/license inventory: each of its five entries is Apache-2.0, with the applicable
Boot/Security and packaged notice obligations below. Actual resolution/archive reconciliation
is a separate follow-up, not represented as already executed.

| Follow-up / evidence gap | Owner / timing | Current state |
|---|---|---|
| Record the exact proposed use, pre-import admission disposition and inventory entry for these new packages; preserve chronology. | F03-B implementer / before POM change and first resolution | Completed in v0.2 before new dependency use; exact section 1 delta only |
| Resolve only the admitted graph, retain the actual dependency tree, compare exact versions/delta and verify logging exclusion. | F03-B implementer / first authorized resolution | `NOT-RUN` |
| Compute local main-JAR hashes against advertised values; inspect each actual archive's LICENSE/NOTICE and bundled material. | Engineering / first authorized resolution and T036 reconciliation | `NOT-RUN` |
| Preserve Apache license, Security notice, crypto's existing third-party permission and all applicable packaged notices; record any future source modifications. | Engineering / copied or distributed material | Obligation proposed; final bundle `NOT-RUN` |
| Respect Apache patent-retaliation and trademark/no-endorsement conditions. | Engineering / all admitted use | Obligation proposed |
| Qualify the actual shipped bundle, SBOM, notices, offering and required Legal/company authority. | Engineering + Legal Review Authority / T036 and commercial-release gate | Commercial clearance remains open / `BLOCKED-LEGAL` |

F01/F02 intake evidence can be referenced for unchanged packages and source families. It does not
admit a new dependency coordinate automatically, waive archive reconciliation or qualify a
commercial distribution. No external/customer distribution, live-company credential delivery,
MFA waiver or production security policy is approved here.

## 5. Smallest proposed tracer bullet

Start with one synthetic, already credentialed eligible account and one protected identity probe.
Reuse the F03-A password verifier. Establish framework authentication through the real HTTP login
path, rotate the container session identity on successful login, associate it with an opaque IDEA
session record in PostgreSQL, and derive Actor Context only from that server-established state.
Exercise CSRF-protected logout and refuse the old cookie on a protected retry. This proves one
thin end-to-end path before adding the full setup-proof, throttling, account-administration and
reset flows required by F03-B; it does not complete the card by itself.

Use the framework security filter chain, ordinary container `HttpSession`, its security-context
repository and session-backed CSRF repository. Prefer the framework authentication filter to a
manual controller login. The official
[session guidance](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html)
explains that a custom authentication mechanism must invoke the session authentication strategy
and explicitly save its context. The default modern-container fixation protection changes the
session ID. A manual login that only authenticates a password and sets a thread-local context
would miss those persistence/protection obligations.

For this HTTP probe, acquire the framework CSRF token through a same-origin token endpoint, submit
it in the expected request header, and acquire a fresh token after authentication/logout. Keep
login, logout and other unsafe methods covered by CSRF; the
[official CSRF guidance](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
documents session storage, token renewal and header submission. This recommendation avoids copying
an upstream example and does not choose the future Web/Desktop UX.

The existing PostgreSQL `session_record` has `issued_at`, `expires_at`, `revoked_at`, Actor and
security-version fields, but no persisted eligible-activity timestamp. Plan an additive migration
and a session service that represents both deadlines explicitly. Account status, Actor status,
security version, revocation and time eligibility remain authoritative on the Server. The existing
F03-A disable/re-enable operation increments the account security version; F03-B's persisted
session version check can refuse old sessions without reviving them after re-enable. F04 still
owns proof that committed invalidation before an owner commit prevents successful business change.

## 6. Fast real HTTP / PostgreSQL test recommendation

Inject one authoritative `java.time.Clock` into all F03-B time-dependent services. Use UTC system
time in ordinary operation and a test-only controllable implementation within the test JVM.
The Java 25 [Clock API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/time/Clock.html)
provides the seam for replacing the time source. No new test dependency, host-clock change or
client-accessible time-control endpoint is needed.

Start the actual embedded Server on a random TCP port and use Java's HTTP client with independent
cookie stores. Apply the actual migrations to an isolated migrator-owned PostgreSQL schema and
use the application role for Server operations, following the existing F03-A separation. Inspect
the persisted session state through approved test diagnostics. Clock replacement accelerates the
policy deadline only; it does not substitute for HTTP, PostgreSQL or an eight-hour soak.

Use the unchanged 2-hour idle and 8-hour absolute profile values. Capture `now` consistently per
operation and align persisted instants with PostgreSQL timestamp precision. Treat expiry equality
as expired. Avoid relying on servlet last-access time as eligible activity: CSRF-rejected,
unauthenticated or unauthorized requests can still touch a container session. Update the policy's
persisted eligible-activity time only after the defined eligibility checks succeed; renewal never
changes the sign-in time or absolute deadline.

| Scenario / oracle | Controlled-time procedure | Expected result; actual result |
|---|---|---|
| Idle boundary | Use separate session fixtures immediately before, exactly at and after `lastEligibleActivity + 2h`. A successful pre-boundary probe refreshes idle time, so it cannot be reused as an untouched boundary fixture. | Before: eligible; at/after: refused. `NOT-RUN`. |
| Idle renewal | Send an eligible protected request before idle expiry, then check the persisted activity timestamp and the deadline relative to that new value. | Idle deadline advances; absolute deadline does not. `NOT-RUN`. |
| Absolute boundary | Keep a separate session active with eligible intervals shorter than 2h through almost 8h; advance to exactly and beyond `issuedAt + 8h`. | At/after 8h: refused regardless of activity. `NOT-RUN`. |
| Rejected traffic | Before idle expiry, send wrong/missing CSRF, denied-permission and anonymous/non-eligible requests, then reach the original idle deadline. | No eligible-activity update; expired protected retry refused. `NOT-RUN`. |
| Earlier deadline | Arrange an idle deadline earlier than absolute and another session whose absolute deadline is earlier than its renewed idle deadline. | The earlier boundary always refuses. `NOT-RUN`. |
| Invalidation | Logout/revoke the current session; disable/reset an account with multiple sessions; re-enable and retry old cookies before a fresh sign-in. | Current/all affected sessions refused as applicable; re-enable revives none; fresh eligible sign-in succeeds. `NOT-RUN`. |
| CSRF / fixation / attribution | Attempt unsafe requests without/with wrong proof; obtain valid proof, authenticate, compare old/new cookie identities and retry with the old cookie; try caller-supplied Actor IDs. | Invalid CSRF refused; successful login rotates identity; old authenticated proof cannot select an Actor; returned Actor is server-derived. `NOT-RUN`. |

The same injected clock can cover the approved 15-minute setup-proof deadline, failed-login
observation window and block deadline when those slices are implemented. Record fixture instant,
clock-control method, profile values, source identity, commands, actual test count and PostgreSQL
role/schema boundary in verification evidence. Skipped tests or unexecuted checks remain
`NOT-RUN`; nothing in this research record is an HTTP/session acceptance `PASS`.

## 7. Author checks

Author verification on 2026-09-30: seven relative Markdown targets exist; the focused whitespace
and recorded-hash-length checks found no errors. Author source review checked candidate/admitted,
publisher/local-hash and recommendation/acceptance distinctions. No general research-note
validator was identified in the repository instructions. Application, HTTP and PostgreSQL tests
are `NOT-RUN` because this task is limited to research and this one note.

## 8. Implementer follow-up — 2026-09-30

Admission in v0.2 was saved before the POM change and first resolution. The first authorized
HTTP Security Maven run on Ubuntu resolved the five exact coordinates above. All five local
main-JAR SHA-256 values match section 3's publisher hashes. No optional algorithm, Spring
Session or Security-test package was introduced.

Each actual JAR contains `META-INF/LICENSE.txt`, SHA-256
`7200000367E0E8B47822D563A5DDD2DD3A97CC05B32BD7DBCC7B4EEB92B76628`, matching the pinned
source license. Both Boot JARs also contain `META-INF/NOTICE.txt`, SHA-256
`64E8C092D64CCAECAC2D81D324C84A4DFF29FDC2CB777F3B1ABD910AC2E8555D`, identifying Spring
Boot 4.1.1 and the upstream copyright. The three Security JARs do not contain that NOTICE
entry; this does not waive the applicable tagged-source Security notice already retained in
section 3. Inspection used the installed JDK ZIP API against actual cache archives,
without installing an archive tool or copying third-party implementation into IDEA.

The actual runtime tree was retained on the development server at
`/home/phuclam/idea-f03b-Qw74tmdH/dependency-tree.json`, SHA-256
`A1A2B2AAEF870ADF23C4DE4F94DFAF5726810500D61D4F717384D14E7584E1C5`, using the already
available `org.apache.maven.plugins:maven-dependency-plugin:3.8.1:tree` in offline mode.
The security coordinates have the admitted versions, Log4j2 remains, and no Logback or
`spring-boot-starter-logging` appears. Original research and these executed checks are separate
evidence classes. Final shipped-bundle reconciliation, bundled-resource rights, T036 and
commercial authority remain open.
