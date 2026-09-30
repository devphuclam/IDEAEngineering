# PH1 F03-A Spring Security Crypto Intake

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-PH1-F03A-DEP-001` |
| Document class / title | `RESEARCH-NOTE` / PH1 F03-A Spring Security Crypto Intake |
| Version / status | `0.1` / Draft |
| Product normativity | `INFORMATIVE`; no new product requirement, password policy or Tech choice |
| Owner / author | Engineering / Codex research agent |
| Reviewer / acceptance authority | Project Reviewer / Product Decision Authority acceptance `NOT-RUN` |
| Evidence date | 2026-09-30, Asia/Ho_Chi_Minh |
| Applicable baseline | PH1 F03-A; existing Java 25, Spring Boot 4.1.1, Spring Security 7.1.x selection |
| Intended use / disposition | `DEPENDENCY`; `APPROVED-WITH-OBLIGATIONS` for internal development/build/test only |
| Upstream trace | GitHub Issue [#22](https://github.com/devphuclam/IDEAEngineering/issues/22); `TECH-001`; [external-source intake](../agents/external-source-intake.md) |
| Downstream trace | PH1 F03-A password verification; [PH1 tasks](../../specs/005-ph1-foundation-custody/tasks.md); T036 bundle/license qualification |
| Classification / retention | `INTERNAL`; retain with dependency version and later SBOM/notice review |
| Supersession / change record | New record; supersedes/superseded by `NOT-APPLICABLE` |
| Review trigger | Version, dependency graph, password encoder, source/license, or distribution model changes |
| Evidence status | Exact tagged upstream source and published metadata inspected before dependency resolution. Maven resolution, archive inspection, integration execution and commercial clearance `NOT-RUN` in this record. |

Control tailoring: research uses ISO/IEC/IEEE 15289:2019 and ISO 10007:2017 as `STANDARD-GUIDED`
for identity, source pinning and change control. No conformity or certification claim. Document
approval and the engineering internal-use intake disposition are separate states.

## 1. Exact dependency and source

Add only **`org.springframework.security:spring-security-crypto:7.1.1`**, managed by the existing
Spring Boot `4.1.1` parent. This implements the selected framework password encoder, not the
HTTP/session security starter. It does not claim F03-B authentication has been implemented.

| Evidence claim | First-party source and immutable identity | Observed result |
|---|---|---|
| Boot-managed version | [Spring Boot v4.1.1 BOM build source](https://github.com/spring-projects/spring-boot/blob/6fdf67ea1552691e932604d4bf67a5e08ff0b0ea/platform/spring-boot-dependencies/build.gradle), commit `6fdf67ea1552691e932604d4bf67a5e08ff0b0ea` | `library("Spring Security", "7.1.1")` imports the Security BOM. |
| Security source | [Spring Security 7.1.1 source](https://github.com/spring-projects/spring-security/tree/a825937b8175ee85872c49d9c7fc25eea8cff991), tag `7.1.1`, commit `a825937b8175ee85872c49d9c7fc25eea8cff991` | Exact implementation and license state inspected. |
| Published dependency contract | [Publisher's crypto POM](https://repo.maven.apache.org/maven2/org/springframework/security/spring-security-crypto/7.1.1/spring-security-crypto-7.1.1.pom) and [Gradle module metadata](https://repo.maven.apache.org/maven2/org/springframework/security/spring-security-crypto/7.1.1/spring-security-crypto-7.1.1.module) | No required dependency in main API/runtime variants. Maven POM lists optional AssertJ `3.27.7`; Gradle places AssertJ in the separate test-fixtures variant. Do not import that variant. |
| Optional algorithms | [Tagged crypto build definition](https://github.com/spring-projects/spring-security/blob/a825937b8175ee85872c49d9c7fc25eea8cff991/crypto/spring-security-crypto.gradle) | Spring Core, Bouncy Castle and Password4j are optional. BCrypt does not justify adding those packages. Any later addition needs its own intake. |

No newly required transitive component follows from this one Maven dependency. The existing
application's complete graph is not cleared by that observation; verify the actually resolved graph
and archive metadata in T036. The published module advertises main JAR SHA-256
`6E8BB2337FACCABD30626F917ED1D2BFA9DDE982229B6B373B644D1A01635403`;
this is publisher metadata, **not** a locally downloaded JAR verification result.

## 2. Rights and byte-level evidence

Canonical owner/source: Spring Security project, [spring-projects/spring-security](https://github.com/spring-projects/spring-security).
The exact tagged [LICENSE.txt](https://github.com/spring-projects/spring-security/blob/a825937b8175ee85872c49d9c7fc25eea8cff991/LICENSE.txt)
grants Apache-2.0 rights. Its tagged
[notice.txt](https://github.com/spring-projects/spring-security/blob/a825937b8175ee85872c49d9c7fc25eea8cff991/notice.txt)
contains redistribution acknowledgement and name/endorsement restrictions.
The [BCrypt.java source header](https://github.com/spring-projects/spring-security/blob/a825937b8175ee85872c49d9c7fc25eea8cff991/crypto/src/main/java/org/springframework/security/crypto/bcrypt/BCrypt.java)
also retains Damien Miller's copyright and ISC-style permission/disclaimer. Preserve it with later
distributed license/notice material; do not describe the entire crypto implementation as containing
only Apache-licensed material.

Hashes below were calculated over the **raw response bytes in memory** from exact-tag official
URLs using SHA-256; no package JAR, source archive or third-party implementation was imported.

| Material | SHA-256 |
|---|---|
| Boot v4.1.1 `platform/spring-boot-dependencies/build.gradle` | `7BBC2D3BCC33D6CCA9E6CE0AC942718AC730F2D05A5AD7AFA11377DE40FCE05B` |
| Security 7.1.1 `LICENSE.txt` | `7200000367E0E8B47822D563A5DDD2DD3A97CC05B32BD7DBCC7B4EEB92B76628` |
| Security 7.1.1 `notice.txt` | `A9682ACB2E05CE58E0091B1CC2205A1F301318D6523A1B3ED927B9766FDF11F9` |
| Security 7.1.1 `BCrypt.java` (includes separate permission header) | `F69FE972407BC89DD21B0F73EEFD5BFA9A635F51E8B870E99F9EA0D01F8AC688` |
| Security 7.1.1 `PasswordEncoderFactories.java` | `371736BFE532EA8D2E46BD8B196ED196FE083721EF5E7973DADD993BFD40624A` |
| Published crypto 7.1.1 POM | `1424B8FD27FD47AC9F644CDA0B7467A6EEE136C22CDDF689CD2FB250518F7D93` |
| Published crypto 7.1.1 Gradle module metadata | `6CF04D8D2403D1D0E94E405E52FD5A3042E544A3FCFB1897F78F65F70C3A78C4` |

## 3. F03-A use recommendation, not production policy

Use the framework `PasswordEncoder` interface, encode secrets with salted adaptive BCrypt, and
retain an algorithm identifier such as `{bcrypt}` for future upgrades. A narrow
`DelegatingPasswordEncoder` map containing only BCrypt avoids enabling legacy plaintext/digest
matches just because the framework's default factory includes compatibility encoders. The
[tagged factory source](https://github.com/spring-projects/spring-security/blob/a825937b8175ee85872c49d9c7fc25eea8cff991/crypto/src/main/java/org/springframework/security/crypto/factory/PasswordEncoderFactories.java)
and [official password storage guide](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)
explain the delegated format. Do not implement a custom password hash or store/log raw passwords.

Tagged BCrypt converts strings to UTF-8 and rejects **encoding** inputs over 72 bytes. Its
verification path does not apply that same length rejection. Engineering recommendation: reject
over-72-byte candidates before both encode and match; never silently truncate or measure only
Java character count. Test multibyte input. This is an implementation constraint of this encoder,
not a new approved minimum length/complexity or production password policy.

Production cost tuning, password/reset rules and session policy remain outside this intake.
Explicit test-only encoder settings are not evidence of operational security/performance.

## 4. Disposition and obligations

The inspected grants are compatible with linking the unchanged crypto component for internal
F03-A build/test. Engineering disposition is **`APPROVED-WITH-OBLIGATIONS`**, limited to the exact
version and intended use above; this is not legal advice or commercial-release acceptance.

| Action | Owner / timing |
|---|---|
| Keep dependency version managed as `7.1.1`; compare actual resolved graph and JAR bytes with the pinned evidence. | F03-A implementer / first resolution and T036 |
| Keep Apache license, Spring notice and BCrypt third-party permission/disclaimer available; retain applicable copyright/attribution and mark any later source modifications. | Engineering / later packaging or redistribution |
| Respect trademark/no-endorsement and Apache patent-retaliation terms. No third-party endorsement claim. | Engineering / all use |
| Record full shipped-component inventory, notices, source obligations and distribution model; obtain required legal/company review before any customer/commercial distribution. | Engineering + Legal Review Authority / T036 and commercial-release gate |
| Reopen before adding optional algorithm packages, security starters or a newer version. | F03 implementer / before new import |

No package was resolved, installed, copied into IDEA, or executed by this research task. The
implementer must retain this pre-use chronology and inspect the actual archive after resolution;
the note does not waive that follow-up or any acceptance test.

## 5. Implementer follow-up — 2026-09-30

After this pre-use disposition was saved, the first F03-A Maven test compilation on the Ubuntu
host resolved the one new crypto package. SHA-256 of the locally downloaded JAR is
`6E8BB2337FACCABD30626F917ED1D2BFA9DDE982229B6B373B644D1A01635403`, matching the publisher's
main-variant metadata. No optional crypto algorithm dependency was added. Full resolved archive
notice reconciliation remains T036; this hash match is not commercial clearance.
