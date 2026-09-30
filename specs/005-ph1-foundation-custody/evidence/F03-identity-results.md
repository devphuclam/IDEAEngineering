# F03 Identity Results — Bootstrap and Account Administration Checkpoints

| Control field | Value |
|---|---|
| Stable Evidence ID / class | `IE-VEV-PH1-F03-001` (new F03 record) / verification record |
| Version / status | 0.5 / Draft |
| Product normativity | INFORMATIVE; no changed product requirement or gate |
| Owner / author | Engineering / Codex, assisting the Project Reviewer |
| Reviewer / acceptance authority | GPT Web bootstrap and Account Administrator checkpoint reviews relayed by the Project Reviewer; internal Standards/Spec review recorded below; Project Reviewer F03-A acceptance remains pending |
| Evidence date | 2026-09-30, Asia/Ho_Chi_Minh |
| Applicable baseline | PH1 F03-A; bootstrap source `2acf4dafeb19e52e36d8aa9c280b033ac20be56a`; account-checkpoint source `acb772e99b96c13a10dc7ad905d6eb7daec0493a`; fresh public successor source `89eab7129a72844e45807f13baedfbee39a9ac92` |
| Upstream trace | [Work Item #22](https://github.com/devphuclam/IDEAEngineering/issues/22), [PH1 spec](../spec.md) FR-013 / clarification 2026-09-30, [PH1 tasks](../tasks.md), DOC-04 REQ-IAM-002/003/005/007 / REQ-AUTH-004/009/010, DOC-05 IF-DIRECTORY-ADMIN / IF-RBAC-ADMIN / ARCH-VIEW-SEQ-008, [ADR-0012](../../../docs/adr/0012-use-principal-role-scope-rbac.md) |
| Downstream trace | F03-A service implementation and later card acceptance; F03-B remains unimplemented |
| Classification / retention | INTERNAL; retain with F03 source and acceptance evidence |
| Change / supersession | Supersedes published v0.3 at `89eab7129a72844e45807f13baedfbee39a9ac92`; incorporates the local v0.4 received-review record and the user-authorized fresh public successor + positive interactive/repeat verification. Historical results are retained; application source, migrations and card acceptance are unchanged. Superseded by NOT-APPLICABLE |
| Review trigger | Bootstrap, migration, password encoder, account-administration or test-scope change |
| Evidence status | 20 identity tests and 2 Server smoke tests PASS; package/headless boundary PASS; fresh public V1/V2/V3, repeat migration and runtime-role separation PASS; positive interactive initialization/repeat PASS. F03-A IN_PROGRESS; whole-card review/acceptance pending |

Tailoring: use the repository authoring standard's verification fields, guided by
ISO/IEC/IEEE 15289:2019, ISO 10007:2017 and the selected ISO/IEC/IEEE 29119 evidence approach.
No conformity claim. This new card-scoped evidence ID remains independent of its existing
Spec Kit path; it is not an added Core Product Document, architecture view or product requirement.

Sections 1–5 retain the earlier bootstrap checkpoint. Sections 6–9 describe the newer
Account Administrator checkpoint and remaining work; section 10 records its external review,
and sections 11–12 record the subsequently authorized fresh public and interactive operator runs.

## 1. Historical bootstrap scope and preconditions

The Project Reviewer approved the F03-A service test boundary on 2026-09-30. That first checkpoint
implements **only local bootstrap**, not full account administration or HTTP authentication.
The service is not an HTTP controller, public registration path or automatic startup callback.
No real IDEA account was provisioned for the user or company; only synthetic identities were
created inside temporary test schemas.

Environment: Ubuntu development host `ideaddmserver` at `192.168.137.33`, Temurin
`25.0.4.1+1`, native PostgreSQL 18, Spring Boot `4.1.1`, Spring Security Crypto `7.1.1`.
The app and migrator authenticated separately as `idea_ddm_app` and `idea_ddm_migrator`.
The run used existing dedicated database `idea_ddm_f02_20260929_a52f44f6` but created/migrated
only fresh `f03a_<UUID>` schemas. Each test drops only its own generated schema. Database
`idea_ddm_dev`, schema `public` and the Vault were not modified by these runs.

V1 is unchanged. V2 in this checkpoint supplies the one-organization bootstrap state,
exact protected Super Administrator role version, explicit organization-scoped assignment,
IAM owner outcome and append-only required evidence. Account administration was pending at
that source; the later checkpoint adds V3 without changing V1/V2. Neither checkpoint deploys
these changes to the development/public schema.

## 2. Procedure, oracle and actual result

From the clean Git archive of source `2acf4dafeb19e52e36d8aa9c280b033ac20be56a` on Ubuntu:

```bash
bash apps/server/scripts/run-f03a-postgresql-checks.sh IdentityFlowTest,ServerSmokeTest
```

Source archive SHA-256:
`D21ABFFCEC9CF81D306C1C72CF3BC890CDC99322AA70C88C9D003D0271402FF0`.

| Executed scenario | Expected / observed result | Disposition |
|---|---|---|
| First bootstrap | Exactly one Actor, native account, Super Administrator@1 assignment at the named organization, IAM result and Audit | PASS |
| Repeat with different requested identity/organization | Already initialized; same original identity; unchanged counts and evidence | PASS |
| Required IAM evidence raises an error | No partial Actor/account/assignment/Audit; retry succeeds once fault is removed | PASS |
| Two synchronized bootstrap attempts | Exactly one initialized result and one already-initialized result, same Actor/account | PASS |
| Audit INSERT silently writes zero rows | No bootstrap success; identity and assignment roll back | PASS |
| BCrypt UTF-8 bound | 75-byte multibyte candidate refused without identity; 72-byte candidate accepted | PASS |
| Existing Server smoke tests | Process `/health` remains 200/UP; unreachable DB reports 503/DOWN without credential disclosure | PASS, 2 tests |

Final Maven result: **8 tests, 0 failures, 0 errors, 0 skipped** at 09:43:18 +07.

Local `pwsh -NoProfile -File tests/ph1/check-no-secrets.ps1`: PASS for the committed checkpoint;
10 exact synthetic fixtures recognized and 233 known binary files skipped. `git diff --check`:
PASS. These are scoped checks, not execution of `verify-template`.

### Test-first chronology

- Initial test compilation failed because `AdministratorBootstrap` did not exist. This is a
  **compile-red**, not a claim that a behavioral test had executed yet.
- After implementation, the first PostgreSQL bootstrap test passed; four subsequent bootstrap
  regression cases passed. Those additional cases do not have separately observed red runs.
- A new zero-row Audit INSERT test then failed behaviorally: the initial implementation reported
  success despite missing Audit. After mandatory affected-row checks were added, all six bootstrap
  tests and the two existing smoke tests passed. The final clean committed-source run reproduced
  those eight passes.

## 3. Retained logs

Raw operator logs remain on the host, mode 600; no credential value is intentionally printed.
These are external evidence locations, not repository-relative links. A remote reviewer without
host access can inspect source and this summary but cannot independently read the raw host logs.
Log hashes and the final exact source archive support traceability, not independent review.

| Run | Host path | SHA-256 |
|---|---|---|
| Initial compile-red | `/home/phuclam/idea-f03a-test-Y9K9W5hk.log` | `2F765AA56CF5816C42E286DAB26AA49757C65E20E5D9DEEB45FA2D7A7155BAF9` |
| First one-test green | `/home/phuclam/idea-f03a-test-7Ful7pVp.log` | `B233CA6EC65539956034C6EBE624A1AFAF13D1A1E7CB9E71F007F3EFD6588C94` |
| Five-case checkpoint | `/home/phuclam/idea-f03a-test-IVmi0F3p.log` | `9BEF9A1838797C010BBCC6B4A650C633F885C72D2AB349D50291DE835EC886C4` |
| Audit zero-row behavioral-red | `/home/phuclam/idea-f03a-test-gjKPmGde.log` | `F285A19A7C87E4DD1923987A733811F5D11A845A856E1F1C0B037335ED924D87` |
| Clean committed-source final green | `/home/phuclam/idea-f03a-test-JdbwQue9.log` | `BFB25397F259A9E6EE039141CBE9C5E264755C6D2D84C8F15F95E0245A577B37` |

## 4. Limits and next work at the bootstrap checkpoint

- F03-A remains **IN_PROGRESS**. T019 remains unchecked pending a complete operator command
  and bootstrap-scope review; T018/T021/T022 cover additional F03-A/B work and remain unchecked.
- Next: explicit Account Administrator assignment through Access Policy, authorized create,
  disable and re-enable services, wrong-scope/ordinary-user refusal, atomic account evidence.
- Account activation/setup uses one-use expiring proof under REQ-IAM-003. No live credential
  delivery channel, reset duration or production password/session policy is selected by this
  checkpoint. Preserve the existing policy gate before live provisioning.
- F03-B sign-in/out, session-derived Actor context, CSRF, expiry/revocation and old-session
  refusal after re-enable remain NOT-RUN. This checkpoint proves no HTTP admin authorization.
- Fresh public-database F02 rerun is NOT-RUN for this successor. Its test expectation now covers
  V1+V2; temporary-schema migration was exercised by the six F03 tests, not substituted for that
  public-database command's evidence.
- No F04, operational recovery, multi-Vault, production readiness or commercial clearance claim.
- `verify-template`: NOT-RUN at the user's instruction. T036 full notice/bundle review remains open.
- The private test credential file remains for continuing F03-A tests and is to be removed when
  this verification work finishes; its content must never be copied to evidence or Git.

## 5. External checkpoint review received

On 2026-09-30 the Project Reviewer supplied a GPT Web read-only review of
[PR #23](https://github.com/devphuclam/IDEAEngineering/pull/23), head
`560b63e96f567c47d001f97220cccfc1757a54cd` against base
`eb3052171db3aac9a927510724deb90c06540319`. The reported result is
**PASS WITH NOTES for the one-time Super Administrator bootstrap checkpoint only**,
with no reported BLOCKER, MAJOR or MINOR defect in that scope.

Engineering confirmed that the difference between tested source
`2acf4dafeb19e52e36d8aa9c280b033ac20be56a` and the reviewed head adds only this evidence
document; application code, migrations, dependency declarations and tests are unchanged.
This review record does not claim a new test execution.

The review retains two evidence limits:

- The reviewer could not read raw host logs through GitHub; source, recorded hashes and
  commit trace were reviewed, not the contents of those host logs independently.
- A fresh public-database V1+V2 successor run remains **NOT-RUN**. Temporary-schema tests
  do not replace that result.

The supplied AI review is not a GitHub approval, whole-card acceptance or evidence of
qualified independent security review. Issue #22 and F03-A remain open. At that reviewed
head, Account Administrator assignment, account lifecycle, authorization-refusal tests and
the operator command were still required. The next sections record their newer service
checkpoint; HTTP/session work remains in F03-B.

## 6. Account Administrator checkpoint: scope and actual result

The Project Reviewer authorized this Server-service + real PostgreSQL checkpoint after the
bootstrap review. The explicit 2026-09-30 answer permits an effective Super Administrator to
self-assign this exact Account Administrator role using its already granted assignment permission.
The [Spec Kit clarification](../spec.md#clarifications) records that bounded interpretation;
it is not a fabricated new Product Decision Authority approval or an arbitrary self-grant rule.

`RoleAssignmentAdministration` is an Access Policy command. `IdentityAdministration` owns
account CRUD and cannot grant roles. Both use the current permission/assignment evaluator and
commit-time revalidation. The approved seed has only Super's bounded assignment permission and
Account Administrator's create/disable/re-enable permissions. It does not close the full
`SPEC-OPEN-03` permission catalogue or implement Project/Group delegation.

Test configuration remains the Ubuntu host and dedicated database described in section 1.
V1/V2 are unchanged. V3 and every fault injection run only inside newly generated
`f03a_<UUID>` schemas; the runtime authenticates as `idea_ddm_app`, while migration/fixture DDL
uses `idea_ddm_migrator`. No migration, account provisioning or cleanup ran against
`idea_ddm_dev`, the database's `public` schema or the Vault.

| Checkpoint criterion | Executed evidence / observable result | Result |
|---|---|---|
| Independent assignment | `superAdministratorGrantsASeparateExactVersionAndScopeAssignment`: separate Account Administrator@1 assignment; exact principal, version, Organization, assigner, reason, Access Policy outcome and Audit | PASS |
| No implicit Super CRUD | `superAloneCannotCreateAccountsButTheIndependentAssignmentCanCreateAPendingIdentity`: Super alone is refused for create/disable/re-enable; explicit independent grant permits creation | PASS |
| No bootstrap-Actor shortcut | The ordinary-Actor authorization test grants Account Administrator to a non-bootstrap Actor; the same evaluator permits its account creation while refusing its role-grant attempt | PASS |
| Wrong-role, unassigned, wrong-scope and revoked callers | `ordinaryWrongScopeAndRevokedAssignmentsCannotPerformAnyAccountAction` and the Super-alone test refuse all three account operations without changing the target | PASS |
| Exact version and valid assignment input | Wrong role-version target and blank reason return attributable refusals without another grant | PASS |
| Creation grants no product access | A new pending Actor/Account/Login Identity is retrievable, with zero target Role Assignments. Code introduces no Project/Group membership writes; those membership domains are not implemented by this checkpoint | PASS for noncreation boundary, not Project/Group feature acceptance |
| Stable identity and history | Pending and synthetic-active disable/re-enable preserve ActorId, AccountId and LoginIdentityId, retain before/after history and increment security version; stale updates are refused | PASS |
| Last recovery path | Disabling the final effective Super Administrator is refused with unchanged account state and a refused IAM outcome | PASS |
| Atomic required state/evidence | Suppressed Login INSERT, failed IAM outcome, suppressed Audit for disable/re-enable and failed assignment Audit leave no partial mutation or accepted outcome | PASS |
| Runtime cannot rewrite assignments | `runtimeCannotRewriteOrRemoveExistingRoleAssignments`: direct UPDATE, DELETE and TRUNCATE CASCADE each fail with PostgreSQL SQLSTATE `42501`; existing state remains intact | PASS |
| Local operator boundary | Explicit separate main/script, no HTTP controller/startup callback; headless initialization returns 2 before connecting. Packaged JAR reproduces that refusal | PASS for tested boundary; positive interactive initialization NOT-RUN |

Account creation deliberately returns `PENDING` with no password verifier. Re-enabling an
unconfigured identity returns `PENDING`, not a usable login. Active fixtures are synthetic
migrator-created eligibility fixtures, **not** proof of password setup or successful activation.
F03-B owns one-use setup proof, verified authentication/session context and old-session behavior.

Success retains the owner-specific outcome, required change evidence, authorization decisions
and Audit in one transaction. A request denied before owner invocation has an immutable
authorization refusal and Audit only; it does not invent an IAM owner result. An owner business
refusal rolls back mutation and retains its refused outcome/Audit separately. This checkpoint
implements no session/outbox consumer or F04 in-flight command acceptance.

## 7. Exact source and retained account-checkpoint execution

Source progression: reviewed bootstrap head `560b63e96f567c47d001f97220cccfc1757a54cd`
→ account implementation `f47ece35ba37b64802a94d24dd90beaaf2327171`
→ least-privilege fix and approved clarification
`acb772e99b96c13a10dc7ad905d6eb7daec0493a`.

The latest run extracted a clean Git archive of `apps/server` and `database/migrations`
from **`acb772e99b96c13a10dc7ad905d6eb7daec0493a`**, into a new directory with no prior build output:
`/home/phuclam/idea-f03a-account-committed-acb772e`.
Archive SHA-256: `15FD010CF2319AC1A81F7BEA77DA16C268048BF4D05A2A7F7AADAA900E6BAF06`;
local and server hashes matched.

```bash
bash apps/server/scripts/run-f03a-postgresql-checks.sh IdentityFlowTest,ServerSmokeTest
```

Actual result at **10:48:31 +07, 2026-09-30**: **22 tests, 0 failures, 0 errors, 0 skipped**
(20 identity tests including the original six bootstrap tests; 2 existing Server smoke tests).
The pre-existing Mockito dynamic-agent warning remains in the log; no warning was counted as a pass.

Packaging the same committed source with `sh ./mvnw -B -DskipTests package` passed at
10:49:16 +07. `sh -n scripts/bootstrap-administrator.sh` passed. Running the packaged operator
main without a console returned 2 and reported that no initialization was attempted.
Packaging used `-DskipTests`; the 22 executed tests above are separate evidence.

Repository checks before publication: `pwsh -NoProfile -File tests/ph1/check-no-secrets.ps1`
PASS (10 exact synthetic fixtures, 233 known binary files skipped); `git diff --check` PASS.
Focused relative links in spec/tasks/evidence PASS (22 targets). Spec quality was re-evaluated
after the one accepted clarification: 16/16 → 16/16, no checkbox changes, regressions or
unchecked items. No extension hooks are configured for clarification. These document/secret
checks are not a substitute for the application results or the unrun verifier.

| Retained run | Host path (private, external evidence) | SHA-256 |
|---|---|---|
| Last-Super behavioral-red | `/home/phuclam/idea-f03a-test-58WvovCE.log` | `19CB83CF82719386469FD8D8076A4D3C8ABD071A230BE3C991FEF4B51D79758E` |
| Last-Super fix green | `/home/phuclam/idea-f03a-test-IINjx1p6.log` | `DE4F8191EEB763693C868A652B54D20D4595E6D44CB79421A9EF6FBEDCA3182C` |
| Invalid-reason behavioral-red | `/home/phuclam/idea-f03a-test-7ttQV8cK.log` | `92A18CBE58E75ED1201E9824F5181635FD115E06343431880F72642889468A81` |
| Invalid-reason fix / working-snapshot 21-test green | `/home/phuclam/idea-f03a-test-IWRewk8O.log` | `A7A7876C9AB1146E88625567AA77372D2DDF6BA62040C28AF81163044190D6E2` |
| Runtime-assignment privilege behavioral-red | `/home/phuclam/idea-f03a-test-gMNCgBDA.log` | `BBB01FA51C06B14FD3C9CDDFE329A76D626A42A0EAC19F7E74875077EC5E2D0F` |
| Runtime-assignment privilege fix green | `/home/phuclam/idea-f03a-test-IpAh9I5U.log` | `0A3472962ED1EED153ECF90794896CF860EC99F6D6DFFD0DF47444C03051CABA` |
| Latest clean committed-source 22-test green | `/home/phuclam/idea-f03a-test-Uta6pTuN.log` | `DC4B791E358CB8F81A77EA29AAEF96C2FB19F946E72FD9F4C471B033601DBB1B` |
| Same-source package and JAR headless boundary | `/home/phuclam/idea-f03a-account-package-acb772e.log` | `A7E4D0378787148F485E24A68FEB966B14594399104CD621A3F089D695E7EBC8` |

The new grant/create/lifecycle APIs first produced compile-red runs while their interfaces were
absent; those were not executed behavioral failures. The last-Super guard, invalid-reason refusal
and overbroad runtime privilege each have the behavioral-red/green evidence above. Additional
authorization/fault regression cases do not have separately observed red runs; none is invented.

The final test log was verified mode `600`, owner `phuclam`; the package log was created under
umask `077`. Raw logs remain on the host and cannot be independently read through GitHub.
This summary, source and hashes do not replace independent raw-log review.

## 8. Internal two-axis review

Both reviews compared `560b63e…acb772e` read-only. Neither review agent ran tests or approved
whole-card completion. Executed results belong to section 7, not to a static reviewer claim.

### Standards

The first review found excessive runtime UPDATE permission on `identity_role_assignment`.
It was reproduced by the PostgreSQL test, fixed with SELECT/INSERT only plus explicit
UPDATE/DELETE/TRUNCATE revocation, and rechecked. **0 documented violations remain.**

One nonblocking heuristic remains: the two owner services have similar local diagnostic
`Evidence` records and count queries. This is a possible duplication/refactoring opportunity,
not a documented rule violation or an authorization shortcut. Their command ownership remains separate.

### Spec

**0 confirmed findings** in the agreed checkpoint. The original self-assignment interpretation
question is resolved by the Project Reviewer's explicit answer and FR-013. The service uses
ordinary permission evaluation, not a bootstrap Actor or account-type bypass. F03-B and F04
verification remain outside this review.

Summary: Standards 0 documented violations / 1 nonblocking heuristic; Spec 0 confirmed findings.

## 9. Current limits and next review

- F03-A remains **IN_PROGRESS**; Issue #22 stays open. The Account Administrator checkpoint
  review is recorded in section 10; it is not Project Reviewer whole-card acceptance.
- Positive interactive operator initialization and repeat are now **PASS**, using only the
  synthetic identity in section 12. Whole-card review/acceptance is still pending; no real
  company account was provisioned.
- The fresh public-database V1+V2+V3 successor is now **PASS** in the separate database in
  section 11. Earlier NOT-RUN statements remain historical; UUID-schema tests were not used
  as substitute evidence for this run.
- No HTTP authentication, session-derived Actor, sign-in/out, CSRF, credential proof,
  expiry/revocation or old-session acceptance is claimed. Those remain F03-B; in-flight owner
  validation requires F04. The test-only trusted context is not client authentication.
- `verify-template` remains **NOT-RUN** by explicit user instruction. Publication uses a
  `[skip ci]` commit message so the repository's push/PR-triggered verifier is not started;
  skipped checks are not PASS. No workflow or repository security setting is changed.
- No new dependency was introduced in this account checkpoint; the existing Crypto intake
  remains unchanged. T036 full notice/bundle and commercial redistribution clearance remain open.
- No operational backup/restore, production rollout, multi-Vault or independent qualified
  security review claim. The protected test credential file remains for continuing F03-A
  verification and must never be copied to evidence/Git.

## 10. External Account Administrator checkpoint review received

On 2026-09-30 the Project Reviewer relayed a GPT Web read-only review of
[PR #23](https://github.com/devphuclam/IDEAEngineering/pull/23) at exact head
`89eab7129a72844e45807f13baedfbee39a9ac92`. The reported result is **PASS WITH NOTES
for Account Administrator authorization + account lifecycle**, with no BLOCKER, MAJOR or
MINOR defect found in that checkpoint.

Engineering confirmed with `git diff --name-only` that from executed source
`acb772e99b96c13a10dc7ad905d6eb7daec0493a` to the reviewed head only this evidence file
and `tasks.md` changed. Application code, migrations, dependencies and tests are unchanged.
The received review does not add a test execution or independently verify the private raw logs.

The review accepted independent exact-version/scoped assignments through standard permission
evaluation, no implicit Super account CRUD or bootstrap-Actor shortcut, the explicit bounded
self-assignment clarification, account denials, stable identity/history, no implicit product
grant, the final-Super recovery guard and atomic required outcome/Audit behavior. It confirmed
closure of the earlier runtime SQL privilege finding. The operator boundary was considered
reasonable by source review, without claiming positive interactive execution.

Four nonblocking limits were recorded at the reviewed head (subsequent results are separate):

- Positive interactive bootstrap operator execution is **NOT-RUN**; T019 remains unchecked.
- Raw host logs were not independently read through GitHub; the reviewer inspected source,
  test definitions, recorded hashes and commit trace.
- Fresh public-database V1+V2+V3 successor execution is **NOT-RUN**; UUID-schema tests do not
  substitute for it.
- The similar local diagnostic evidence records/queries are a refactoring opportunity, not a
  demonstrated authorization bypass or current reporting inconsistency.

`verify-template` remains **NOT-RUN**, not PASS. This relayed AI result is neither a GitHub
approval event nor qualified independent security review. F03-A remains **IN_PROGRESS**, Issue
#22 stays open and F03-B/whole-card/production acceptance is not inferred. The next verification
step at that checkpoint was the controlled positive interactive operator path. Recording the
review itself created no database or live company account. The later database creation and
successor verification below have their own explicit user authorization.

## 11. Fresh public-schema V1/V2/V3 successor

### Scope and configuration

On 2026-09-30 the Project Reviewer authorized a completely separate database, real `public`
schema migrations, least-privilege checks and synthetic interactive bootstrap. The user ran
the bounded creation helper with local `sudo`; Engineering verified that the new database was
owned by `idea_ddm_migrator` and had no public tables/functions or non-system extra schemas
before executing migrations. No global role grants were changed. Initial database/default ACLs
follow `deploy/development/bootstrap-postgresql.sql`; V1/V3 supply their more restrictive ACLs.

- Database: `idea_ddm_f03a_20260930_c91e7a42`; schema: `public`.
- Server: `ideaddmserver`, PostgreSQL `18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)`.
- Java: Temurin `25.0.4.1+1-LTS`; same qualified dependency versions, no new package.
- Source: clean archive of `89eab7129a72844e45807f13baedfbee39a9ac92`.
- Archive SHA-256: `50E030D4E83BA65166503966236A41106B8799E5535451464D49980F8E45AD4D`.
- Run directory: `/home/phuclam/idea-f03a-successor-c91e7a42`; source subdirectory: `source`.
- Built JAR SHA-256: `9B810F7AC490C4CDAC3C8B5CC590FE312A239EF78FF96202A2FB9B10354031E8`.

The clean build used `sh ./mvnw -o -B -DskipTests package`; it is package evidence, not a new
JUnit execution. The existing 22-test results remain attached to their original source/run.
The successor used fixed host `127.0.0.1:5432`, database name and distinct exact users
`idea_ddm_migrator` / `idea_ddm_app`. Passwords were privately sourced on the server from the
operator-owned mode-600 test file; neither values nor environment dumps are in this record.
Database `idea_ddm_dev`, the F02 database and Vault were not used or modified by this run.

### Commands, oracles and results

Engineering ran `bash /home/phuclam/idea-f03a-successor-c91e7a42/fresh-public.sh`.
After the offline build, the following packaged migration entry point was run **twice** using
the migration environment, without starting the Server or automatically migrating at startup:

```bash
/opt/idea/tools/jdk-25.0.4.1+1/bin/java \
  -Dloader.main=com.idea.ddm.migration.DatabaseMigrationCommand \
  -cp /home/phuclam/idea-f03a-successor-c91e7a42/source/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar \
  org.springframework.boot.loader.launch.PropertiesLauncher
```

| Check | Actual result, 11:17:19–11:17:27 +07 | Disposition |
|---|---|---|
| Fresh public precondition | No public table/function or extra user schema; DB owner and public CREATE belong to migrator | PASS |
| Ordered migration | `MIGRATIONS_APPLIED=3`; successful history `1,2,3`, installed by `idea_ddm_migrator` | PASS |
| Repeat migration | `MIGRATIONS_APPLIED=0`; still exactly three successful versioned rows | PASS |
| Object owners | All 23 public tables (22 product tables + Flyway history), and the public function, owned by migrator | PASS |
| Runtime login / authority | Authenticated `idea_ddm_app`; database CREATE=false, public CREATE=false, no membership in migrator role | PASS |
| Actual app DDL | CREATE SCHEMA and CREATE TABLE on public refused with SQLSTATE `42501` | PASS |
| Restricted assignment/evidence mutation | Assignment UPDATE/DELETE and assignment-evidence TRUNCATE refused with `42501` | PASS |
| Pre-initialization inspect | Packaged `bootstrap-administrator.sh --inspect` returned `BOOTSTRAP_STATE=UNINITIALIZED` | PASS |

Flyway history: V1 checksum `1303435172`, V2 `142124024`, V3 `-732402698`; all successful.
DDL/mutation probes ran in a transaction with rollback; they created no persistent probe object.
The SQL assertion rejected any incorrect target/user, app CREATE authority or table owner.

Log: `/home/phuclam/idea-f03a-successor-c91e7a42/fresh-public.log`, mode `600`, owner `phuclam`.
SHA-256: `F6CD22378987A8A75B9F3D29CD96B608440A730CD5CA8F2A0931EDC66C15F2E9`.
Assertions file SHA-256 (`app-privileges.sql`):
`A32E9A0D0376573083714622721B994167C6B2ADB07AB49D105830B2C007CBCF`.

Before the interactive step, all Actor/account/login/assignment/IAM/Audit counts were confirmed
zero. The credential-excluding snapshot was saved as `before-initialize.txt`, SHA-256
`C6D270BFD9932D7CCD0AA1B1076FC4FBAAE7668EF57E23898C1DA581D8E7BD65`.
An initial read-only snapshot query had a JSON/text concatenation error; the one-run query was
corrected and rerun, retaining the partial file as `before-initialize-partial-sql-error.txt`.
No application code/migration changed and no identity was created by that failed read.

The database is retained for review; no cleanup was run. Positive interactive bootstrap/repeat
were NOT-RUN when this fresh phase finished; their subsequent results are in section 12.
This section closes only the fresh public successor gap, not F03-A acceptance, Issue #22,
F03-B, T036, commercial clearance or production readiness.

## 12. Positive interactive bootstrap and unchanged repeat

### Procedure and synthetic fixture

Same database, packaged JAR and source `89eab7129a72844e45807f13baedfbee39a9ac92` as
section 11. The Project Reviewer ran the one-run wizard in their existing SSH terminal.
Its inner command executed **the actual packaged operator script**:

```bash
sh /home/phuclam/idea-f03a-successor-c91e7a42/source/apps/server/scripts/bootstrap-administrator.sh --initialize
```

`util-linux script --quiet --return --flush --echo never --log-out <output-log> --command <command>`
supplied an interactive terminal and recorded output only. No `--log-in` / `--log-io` option
was used; input echo was disabled. The user's synthetic password was entered twice into
Java Console hidden prompts, not supplied in arguments, piped input or a log. The database
oracle checked only the Boolean BCrypt-verifier condition; the verifier is not exported.

Fixture: organization UUID `96c73e59-6d27-4f2c-bc14-c91e7a420001`, organization name
`F03A Synthetic Organization c91e7a42`, custodian `F03A Synthetic Custodian c91e7a42`,
login `f03a-c91e7a42@example.invalid`. These are test-only values, not a company account.

First operator execution: **11:19:10–11:19:57 +07**, with a real terminal (`/dev/pts/1`),
exit `0`, result `INITIALIZED`, ActorId `1953bd5c-9bab-4a00-b187-bb1ce954ec92`.
The database oracle then verified all exact fixture values, stable identity joins, ACTIVE
account/security_version=1, Super Administrator@1 at that Organization Scope with the same
Actor as `assigned_by`, and exactly one correlated accepted IAM outcome + Audit for the account.

Engineering then used `ssh -tt` and the same operator script in a terminal at **11:20:55 +07**.
`--inspect` confirmed INITIALIZED before/after. The second `--initialize` exited `0` and returned
`ALREADY_INITIALIZED`, **the same ActorId**, without requesting another identity or password.
The safe database oracle was rerun. Runtime CREATE/schema and restricted assignment/evidence
mutation probes were repeated after bootstrap and still refused with `42501`.

### State oracle and actual result

| State | Before initialization | After first run | After second run |
|---|---:|---:|---:|
| Actor | 0 | 1 | 1 |
| Account | 0 | 1 | 1 |
| Login Identity | 0 | 1 | 1 |
| Operating Organization / bootstrap marker | 0 / 0 | 1 / 1 | 1 / 1 |
| Super Administrator@1 assignment | 0 | 1 | 1 |
| Account Administrator assignment | 0 | 0 | 0 |
| IAM owner outcome / Audit | 0 / 0 | 1 / 1 | 1 / 1 |
| Access Policy outcome / authorization / assignment / account-change evidence | all 0 | all 0 | all 0 |
| Session, sample operation, Vault, transfer, Grant, Receipt, Artifact, Location | all 0 | all 0 | all 0 |

The explicit snapshot excludes credentials/session proofs. It includes identity IDs and rows,
organization, exact assignment/version/scope/assigned_by/reason, bootstrap state, IAM/Audit
correlation and occurrence timestamps, and role/permission seed rows. `cmp` found the after-first
and after-repeat files **byte-identical**; each has SHA-256
`0B7942C49B7E1C96C282FB7BE3FD631B7F217B8B495A4CB9C2E7C36C256951E1`.
This proves the listed state/counts are unchanged; it does not export or compare plaintext passwords.

Results: **positive interactive operator path PASS**, **repeat/idempotence PASS**.
This is execution of existing reviewed code; no application implementation or new red/green
cycle is claimed. T019 is technically implemented/verified, not whole-card acceptance.

### Retained evidence and disposition

Files below are under `/home/phuclam/idea-f03a-successor-c91e7a42`, mode `600`, owner `phuclam`;
the directory is mode `700`. Neither logs nor snapshots contain intentionally emitted credentials.

| File | SHA-256 |
|---|---|
| `initialize-output.log` | `0B0FFA3F76224AA1E71CF58ED5642D339E5CF80D16B8127892014251D758AA1F` |
| `repeat-output.log` | `FD0887805E3900311063A3BAB0D866CE0930A5B3A9495D6BE512EC8B461CEB1F` |
| `after-first.txt` / `after-repeat.txt` (identical) | `0B7942C49B7E1C96C282FB7BE3FD631B7F217B8B495A4CB9C2E7C36C256951E1` |
| `snapshot.sql` | `832E011EB92357C9339A95627C393B6C2FE05B4554F8117DF93C3C18AC9CFD7F` |
| `assert-initialized.sql` | `6BD297351525C799C527691F1CA5EE791D5BCA1DD1C325C00DAEAEC04F29FE12` |
| `initialize.sh` | `7CD2FF1C57FD44AC81F4340165FC2B0F40CC5D696D5E9D54315CC3327FCE4118` |
| `repeat.sh` | `1E508981DB77B3EDEF186C43C82F73A534755E0D44699810A8C4155791EAE8D9` |

Final read-only verification receipt at **11:22:36 +07** confirms the two executed gaps PASS
and explicitly records `F03A_CARD_ACCEPTANCE=PENDING`. File `verification-receipt.log` SHA-256:
`964A1A2722AF874F8444B63007C32D4DF72F0952D8D1DE5154C52EC3CDD97D8F`.
Raw files still require host access; this summary and recorded hashes do not pretend to be
independent remote log review.

Both formerly NOT-RUN gaps are now executed PASS. **F03-A remains IN_PROGRESS**, Issue #22
stays open and PR #23 stays draft pending the requested whole-card review and Project Reviewer
acceptance. No card completion, timer stop/effort correction, progress publication or merge was
performed. F03-B, the unrun verifier, T036/commercial and production claims remain excluded.
The isolated database is retained; future cleanup must name this exact database and be controlled.

Publication checks: tracked-secret scan PASS (10 exact synthetic fixtures; 233 known binary
files skipped), focused spec/tasks/evidence relative links PASS (23 targets), `git diff --check`
PASS. Spec Kit checklist gate remains 16/16 + 12/12 with no checkbox changes;
`.specify/extensions.yml` is absent, so no implementation extension hooks apply.
Only this evidence record and `tasks.md` change from executed source `89eab712…`; no application,
migration, dependency or test change needs an inferred rerun. `verify-template` is NOT-RUN.
