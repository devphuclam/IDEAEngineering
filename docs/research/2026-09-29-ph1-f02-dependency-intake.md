# PH1 F02 Database Dependency Intake

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-PH1-F02-DEP-001` |
| Document class / title | `RESEARCH-NOTE` / PH1 F02 Database Dependency Intake |
| Version / status | `0.2` / Draft |
| Product normativity | `INFORMATIVE` — records source and license evidence; creates no product requirement or Tech selection |
| Owner / author | Engineering / repository maintainer |
| Reviewer / acceptance authority | Project Reviewer / Product Decision Authority acceptance `NOT-RUN` |
| Evidence date | 2026-09-29 (Asia/Ho_Chi_Minh) |
| Applicable baseline | PG4-authorized `IE-INC-PH1-FOUNDATION-CUSTODY-001`; F02; Java 25, Spring Boot 4.1.1, PostgreSQL 18 |
| Intended use | `DEPENDENCY` for internal development and test only; no customer distribution or commercial release approval |
| Upstream trace | F02 / GitHub Issue #20; `TECH-001`; `docs/agents/external-source-intake.md` |
| Downstream trace | F02 T014–T017; PH1 T036 dependency/license review |
| Classification / retention | `INTERNAL`; retain with F02 and later dependency/SBOM review |
| Change record | `0.1` recorded the F02 JDBC/Flyway/driver intake. `0.2` adds the build-only Spring Boot Maven plugin after a packaging failure and records the post-resolution license check; it does not claim the before-import timing rule was met for that plugin. |
| Evidence status | F02 dependencies and corrected package were resolved and built on the Ubuntu host. The full resolved dependency/license/NOTICE inventory remains `NOT-RUN` for T036. |

## 1. Disposition

**`APPROVED-WITH-OBLIGATIONS` for F02 internal build and test only.** This records an engineering
dependency intake under the repository procedure; it is not legal advice, a commercial-release
approval, or an acceptance of every transitive package. The Spring Boot Maven plugin was added
after the first package attempt exposed a missing launcher and resolved during the corrected build;
its exact tagged upstream license was checked after that resolution. This chronology does not meet
the before-import timing rule and is retained as a process exception for T036 review. The plugin is
build-only and is not part of the application runtime. The approved Technology baseline is
unchanged.

| Direct dependency | Exact managed version | Source and license evidence | Obligations / limit |
|---|---:|---|---|
| `org.springframework.boot:spring-boot-maven-plugin` (build-only) | `4.1.1` | Spring Boot `v4.1.1` source tag and exact upstream [`LICENSE.txt`](https://github.com/spring-projects/spring-boot/blob/v4.1.1/LICENSE.txt); Apache License 2.0. | Build tool only; not included in the application runtime. Track its resolved build-plugin dependency graph in T036; this record does not clear any commercial distribution of IDEA. |
| `org.springframework.boot:spring-boot-starter-jdbc` | `4.1.1` | Spring Boot BOM coordinates; Apache-2.0 for this exact Spring Boot family/version is recorded in [`IE-RES-PH1-F01-DEP-001`](2026-09-28-ph1-f01-dependency-intake.md). | Preserve applicable Spring/third-party notices with any later distributed artifact. |
| `org.springframework.boot:spring-boot-starter-flyway` | `4.1.1` | Same pinned Spring Boot `4.1.1` source/license record above. | Preserve applicable Spring/third-party notices with any later distributed artifact. |
| `org.flywaydb:flyway-core` | `12.4.0` | [Flyway `flyway-12.4.0` release source](https://github.com/flyway/flyway/tree/flyway-12.4.0); exact [`LICENSE.txt`](https://github.com/flyway/flyway/blob/flyway-12.4.0/LICENSE.txt), SHA-256 `6707B7B3BA3220AB64A81A5AB869FFECC3A6A023E9488EA08B897471B069C078`; exact [`LICENSE.md`](https://github.com/flyway/flyway/blob/flyway-12.4.0/LICENSE.md), SHA-256 `AE106D1B123C196A0C05465637292C69AE42F49725CE46B93ABBA84572AB14F0`. | Apache-2.0; preserve the license and any applicable attribution/NOTICE material if redistributed. |
| `org.flywaydb:flyway-database-postgresql` | `12.4.0` | Same Flyway tagged source and license files above; this is the PostgreSQL database module at the same tag. | Same Apache-2.0 notice obligations; use only with the selected PostgreSQL baseline. |
| `org.postgresql:postgresql` | `42.7.13` | [pgJDBC `REL42.7.13` source](https://github.com/pgjdbc/pgjdbc/tree/REL42.7.13); exact [`LICENSE`](https://github.com/pgjdbc/pgjdbc/blob/REL42.7.13/LICENSE), SHA-256 `5BE1F67A4D62692CC2FC8B81A71088943FC4C1462BD76FD2F04BC0E965CA6D53`. | BSD-2-Clause; retain the copyright, conditions and disclaimer in source and binary redistributions. |

Spring Boot `4.1.1` manages Flyway `12.4.0` and pgJDBC `42.7.13`; F02 does not override those
versions. The official [Spring Boot managed-coordinates table](https://docs.spring.io/spring-boot/appendix/dependency-versions/coordinates.html)
identifies these versions and the two Boot starter coordinates.

## 2. Conditions and review limit

- Keep this intake with the F02 source. The corrected package build resolved the dependencies;
  T036 must record the actual dependency trees and exact package archive hashes where available.
- T036 must inspect the resolved transitive graph and retain the applicable license/notice files.
- Do not bundle these dependencies or their notices into a customer release under this record.
  Future commercial distribution requires a separate exact-bundle and obligation review.
- Reopen intake if a package/version, source, license, packaging or intended-use boundary changes.
