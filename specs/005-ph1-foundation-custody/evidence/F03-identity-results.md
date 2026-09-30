# F03 Identity Results — Account Administration, HTTP Sessions and Credential Recovery

| Control field | Value |
|---|---|
| Stable Evidence ID / class | `IE-VEV-PH1-F03-001` (new F03 record) / verification record |
| Version / status | 0.15 / Draft |
| Product normativity | INFORMATIVE; no changed product requirement or gate |
| Owner / author | Engineering / Codex, assisting the Project Reviewer |
| Reviewer / acceptance authority | GPT Web technical reviews relayed by the Project Reviewer; internal Standards/Spec review below. Project Reviewer accepted F03-A on 2026-09-30. GPT Web reviewed the initial repaired F03-B checkpoint and first-setup head `153d0258108cfe1fdc490d42d57f64aa9098e82f` as PASS WITH NOTES; whole-F03-B acceptance remains pending |
| Evidence date | 2026-09-30, Asia/Ho_Chi_Minh |
| Applicable baseline | Exact-login reset successor source `1e69ac61d2e8f53c742fd1041c36a5bf2c3bf142`, based on the reviewed reset head `064f55ffa62e8f67ee6e062e3ab1c827e5509c23`; prior F03-A/B sources below remain historical |
| Upstream trace | [Work Item #22](https://github.com/devphuclam/IDEAEngineering/issues/22), [Work Item #24](https://github.com/devphuclam/IDEAEngineering/issues/24), [PH1 spec](../spec.md) FR-013/014 / clarifications 2026-09-30, [PH1 tasks](../tasks.md), DOC-04 REQ-IAM-002/003/005/007 / REQ-AUTH-004/009/010, DOC-05 IF-DIRECTORY-ADMIN / IF-RBAC-ADMIN / ARCH-VIEW-SEQ-008, [ADR-0012](../../../docs/adr/0012-use-principal-role-scope-rbac.md), [HTTP Security intake](../../../docs/research/2026-09-30-ph1-f03b-http-security-intake.md) |
| Downstream trace | F03-A accepted; F03-B IN_PROGRESS in published Execution Register revision 29 (`19587d1b43635822e6a27d86dcae01db9c0220d8` on main); reset checkpoint for PR #25 review, not whole-card acceptance |
| Classification / retention | INTERNAL; retain with F03 source and acceptance evidence |
| Change / supersession | Supersedes v0.14 for the T046 successor only; §20 remains historical and unchanged. v0.15 records the exact Login Identity reset repair, 63-test successor and external-review handoff. No dependency, migration or card-state change. Earlier claims retain historical scope. |
| Review trigger | Bootstrap, migration, password encoder, account administration, HTTP security/session or test-scope change |
| Evidence status | F03-A accepted; initial repaired F03-B and first-setup checkpoints reviewed PASS WITH NOTES. T046 exact-login source executed 63 scoped tests PASS with internal Standards/Spec review; external reset review and whole-F03-B acceptance remain pending. Main integration and official progress publication remain separate |

Tailoring: use the repository authoring standard's verification fields, guided by
ISO/IEC/IEEE 15289:2019, ISO 10007:2017 and the selected ISO/IEC/IEEE 29119 evidence approach.
No conformity claim. This new card-scoped evidence ID remains independent of its existing
Spec Kit path; it is not an added Core Product Document, architecture view or product requirement.

Sections 1–5 retain the earlier bootstrap checkpoint. Sections 6–9 describe the newer
Account Administrator checkpoint and remaining work; section 10 records its external review,
sections 11–12 record the subsequently authorized fresh public and interactive operator runs,
section 13 records the received whole-card technical-readiness review, and section 14 records
the subsequent Project Reviewer acceptance. Section 15 records the initial F03-B HTTP session
checkpoint; section 16 records its requested repairs and successor execution; section 17 records
the received review of that repaired checkpoint. Section 18 records the next approved first-setup
checkpoint; section 19 records its received external technical review; section 20 records the reset
successor. Earlier pending dispositions are historical.

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
  synthetic identity in section 12. Whole-card technical-readiness review is recorded in
  section 13; Project Reviewer acceptance is pending. No real company account was provisioned.
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

## 13. Whole-F03-A technical-readiness review received

On 2026-09-30 the Project Reviewer relayed a GPT Web read-only review of PR #23 at exact head
`79373e95502474e64dd2a72604c2d9629daa9e36`, against Issue #22 and this record v0.5.
The reported conclusion is **PASS WITH NOTES for the whole agreed F03-A technical scope**:
no remaining technical implementation or test gap was found before Project Reviewer acceptance.

The reviewer closed both prior execution notes using sections 11–12: fresh real public-schema
V1/V2/V3 with separate roles and zero repeat migrations, plus positive interactive operator
initialization and same-identity/state repeat. They confirmed the reviewed head changes only
evidence/tasks from executed source `89eab7129a72844e45807f13baedfbee39a9ac92`.

The conclusion covers local Super bootstrap, separate exact-version/Organization-scoped audited
Account Administrator assignment, account create/disable/re-enable, authorization/scope refusal,
preserved identity/history and atomic failure on the agreed Server + real PostgreSQL boundary.
T019/T037 are technically complete. Unchecked tasks containing F03-B work do not imply an
unimplemented F03-A obligation or authorize marking F03-B complete.

The remaining note is **INFO: the reviewer did not independently read private raw host logs**.
They inspected repository source, recorded commands/hashes, state oracle and commit trace.
This user-relayed AI review is not a GitHub approval event, a new test run, qualified independent
security review or Project Reviewer card acceptance. Its limits remain explicit: verifier NOT-RUN,
F03-B unaccepted, T036/commercial clearance open, and no production/backup/restore/multi-Vault claim.

Engineering verified the current PR head and recorded task/evidence split before recording this
feedback. No code change or further F03-A technical test is requested by this review.
**Next action: explicit Project Reviewer acceptance and `Hoàn thành F03-A`, with attributable actual
effort through the existing Tracker.** Until then, keep F03-A IN_PROGRESS, Issue #22 OPEN and PR #23
DRAFT; this local review record neither merges nor changes the timer/progress files.

## 14. Project Reviewer acceptance and Tracker completion

On 2026-09-30 the Project Reviewer instructed: if no blocker remains, `Hoàn thành F03-A`.
Engineering checked Issue #22, the approved A/B task split, source at
`79373e95502474e64dd2a72604c2d9629daa9e36` and the executed evidence in sections 6–12.
A read-only factual cross-check found no remaining F03-A implementation/test blocker.
The instruction therefore accepts the agreed whole-card scope; no additional vote was inferred.

The existing Tracker `complete` action recorded **COMPLETED / PASS** at
`2026-09-30T11:43:28.233063+07:00`, Execution Register **revision 28**, evidence
`F03-A-EVIDENCE-1` pinned to that reviewed commit. It closed the existing session started at
`09:28:18.8836947+07:00`: **135 minutes / 2.25 actual hours**, remaining **0 hours**.
No planned-hour substitution or retrospective effort correction was made.

The private-host-log independent-access limitation remains INFO. F03-B, T036/commercial
clearance and production/backup/restore/multi-Vault claims remain excluded;
`verify-template` is **NOT-RUN**. No new test run or GitHub approval event is claimed.
Acceptance and progress files are local drafts in this turn; PR #23 integration and official
progress publication to main are not performed by the Tracker completion action.

## 15. Initial F03-B HTTP session checkpoint

### Scope and approved test boundary

On 2026-09-30 the Project Reviewer instructed `Bắt đầu F03-B` and approved real Server HTTP
with real PostgreSQL, accelerated test time, synthetic identities and no verifier. The current
checkpoint implements login, the session probe, logout, CSRF and the two session deadlines.
It is **not** the complete credential/account-administration/client qualification scope.

The accepted synthetic development profile is in spec v0.3: idle **2 hours**, absolute
**8 hours**, whichever expires first; equality is expired. Only an eligible authenticated
activity refreshes idle time. The proof/password/failed-login rules remain requirements for
later slices; their presence in the spec is not executed evidence.

The implementation follows DOC-05 `ARCH-VIEW-SEQ-008` and the qualified Spring Security
HTTP-session boundary. PostgreSQL records eligibility metadata, not a replayable login cookie.
There is no generated administrator, public bootstrap endpoint, custom JWT or persistent-session
restoration. A runtime-instance binding rejects metadata belonging to another Server instance;
an executed restart test and complete request/commit-time eligibility remain open.

T038's exact pre-use intake was admitted before the new dependency resolution. Intake v0.3
records matching publisher hashes for five JARs and the actual dependency graph: Log4j2 retained,
no Logback or `spring-boot-starter-logging`. T036 and commercial redistribution clearance remain
open. No additional library was added for the HTTP harness or controlled Clock.

### Exact source, environment and procedure

Authoritative checkpoint execution uses a **clean Git archive**, not the earlier iterative overlay:

- Source: `441b2e9a9b15b7046f67005a18ad15598844fa32` on `codex/f03b-authentication-sessions`.
- Base: `79373e95502474e64dd2a72604c2d9629daa9e36`.
- Archive SHA-256: `13BB98831B590273B979015919C3B53E0F72539BF82924289C7F518828C83F9D`.
- Extracted directory: `/home/phuclam/idea-f03b-committed-441b2e9-F34PnKTp`, mode `700`,
  owner `phuclam`; retained `source.tar` mode `600`.
- Host: `ideaddmserver`, `192.168.137.33`, Linux `7.0.0-34-generic`;
  Temurin `25.0.4.1+1`; PostgreSQL server `18.6` observed by Flyway.
- Database: **`idea_ddm_f03a_20260930_c91e7a42`**, not the F02 or development database.
- Migrator: `idea_ddm_migrator`; runtime: `idea_ddm_app`, authenticated separately.
- HTTP: real Server on random loopback port; Java HttpClient with ordinary cookie custody.

From the extracted source:

```bash
bash apps/server/scripts/run-f03b-postgresql-checks.sh HttpSessionFlowTest,IdentityFlowTest,ServerSmokeTest
```

The runner reads the existing operator-owned, non-symlink mode-600 credential file, with shell
tracing disabled. No credential value is in this command, Git evidence or test output excerpt.
HTTP fixtures generate unique synthetic logins/passwords in memory. They do not provision
company accounts or use the operator-bootstrap identity in `public`.

Each HTTP test migrates V1–V4 into its own `f03b_<32-hex UUID>` schema; the F03-A regression
tests use their own `f03a_<32-hex UUID>` schemas in the same authorized database. Cleanup is
limited to each test's regex-validated generated schema. V1–V3 source is unchanged; V4 is additive.
These runs do not migrate `public`, `idea_ddm_dev`, the F02 database or the Vault.

A subsequent read-only check authenticated as the app role and returned PostgreSQL server
`18.6`, **0 remaining** schemas matching `^f03[ab]_[a-f0-9]{32}$`, and successful `public`
Flyway versions **1,2,3**. This confirms temporary-schema cleanup and that public V4 was not
executed; it is not a byte-for-byte comparison of every public row.

Production configuration retains Secure/HttpOnly/SameSite=Strict cookies. **Only this loopback
HTTP harness overrides Secure=false.** It does not qualify actual browser HTTPS/cookie behavior
or Desktop protected custody. No mock/H2/database substitute is used.

### Executed results

Run start **13:44:20 +07**; Maven completion **13:44:43 +07**; Maven elapsed **21.064 seconds**.
Sanitized result excerpt from the retained log:

```text
Tests run: 8, Failures: 0, Errors: 0, Skipped: 0 -- HttpSessionFlowTest
Tests run: 20, Failures: 0, Errors: 0, Skipped: 0 -- IdentityFlowTest
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0 -- ServerSmokeTest
Tests run: 30, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
F03B_SCOPED_TESTS=PASS
```

| HTTP scenario | Observed result | Disposition |
|---|---|---|
| Anonymous session probe | 401; no ActorId or login redirect | PASS |
| Anonymous CSRF acquisition | Token available; still no identity privilege | PASS |
| Login and caller-supplied ActorId | Correct Server-derived Actor/account; session proof rotates; old proof refused | PASS |
| Logout | GET and bad CSRF do not log out; valid POST returns 204, old proof refused; other session remains usable | PASS |
| Idle boundary | Before 2h accepted; exactly 2h and after refused; eligible activity renews idle only | PASS |
| Absolute boundary | Activity through the eighth hour does not extend the limit; exactly 8h and after refused | PASS |
| Missing/bad CSRF and wrong/unknown credentials | 403 for invalid CSRF; identical safe 401 responses for credential refusals; no identity granted | PASS |
| Ineligible traffic | Failed CSRF, public health and CSRF fetch do not renew eligible idle activity | PASS |

The test-only injected Clock begins at `2026-09-30T06:00:00Z`. Tests advance it to literal
before/at/after boundary instants, including microsecond offsets; they do not change the host
clock, sleep for hours or expose a public clock-control route. These are boundary checks, not
eight-hour soak, scheduling or concurrency qualification.

The affected 20 F03-A service tests remain green with V4 in their fresh temporary schemas.
The two health tests still prove process 200/UP and unreachable-database 503/DOWN without
credential disclosure. DataBaselineTest and a fresh public V1–V4 successor were **NOT-RUN**
in this checkpoint; previous public V1–V3 evidence remains historical, not a V4 claim.

### Red/green history and retained evidence

Development used vertical test/code slices in `/home/phuclam/idea-f03b-Qw74tmdH`. The first
corrected RED archive combines base `79373e9...` (archive SHA-256
`4027C8D4237986EDCF613579EDCF648ED40C43872B91CE8248E2D2753BC35657`) with retained
`red-overlay.tar` SHA-256 `0479D30AF82ED2B85B5DD21035E494EC9463D3F071F71EECDE8FD22196A5F257`.
The anonymous-session test then observed **404 instead of required 401**.

Later RED failures observed missing CSRF endpoint (401 instead of 200), missing login
(401 instead of 200), missing logout (404 instead of 204), missing idle refusal
(200 instead of 401), and anonymous invalid-CSRF mapping (401 instead of 403).
Initial test-harness compilation/Clock wiring errors were corrected but are **not** claimed as
intended behavior RED. The 8h test is supplementary coverage of an already introduced cutoff;
it is not falsely recorded as an earlier RED cycle.

All log paths below are under `/home/phuclam/`, owner `phuclam`, mode `600`.

| Retained log | Result / phase | SHA-256 |
|---|---|---|
| `idea-f03b-test-6EC2Zw8z.log` | Anonymous session RED | `51836A5C6F3A47DAE051FD435158BC4878D91B4781806D3836580B55851D9308` |
| `idea-f03b-test-T7paKTNU.log` | Anonymous session + health GREEN, 3 tests | `B231575F0DDF8362ACF35D6D48614816C5D0E601FAF6685A600906B261CB00DF` |
| `idea-f03b-test-zh2qmCTN.log` | CSRF endpoint RED | `35D0506792F6816816B92FACF0942F00A2F8FCA79B16452F80C26949601869ED` |
| `idea-f03b-test-R9fWaK7X.log` | CSRF GREEN, 2 tests | `0DA183BE0CCB03ADCAA8DEDAB9B22FA6CC0C2479A2971B5ADA76304582C58769` |
| `idea-f03b-test-ZBoF4jvN.log` | Login RED | `260556117B543082FA6E97D7E86A80068077C5CDE35A4F39924025C786A13590` |
| `idea-f03b-test-f86TB4hL.log` | Login + health GREEN, 5 tests | `0B727741FB3C0AE9571CB6AE528958E11A8765BACAB61DFBF1EE177D3B11EABD` |
| `idea-f03b-test-XNU7EAdO.log` | Logout RED | `D7D10E5C8BFA3B60FB3873F5139F8DBD714CFC911C7D2B2E1DF03DF60E9E90CD` |
| `idea-f03b-test-Vcpv9gNF.log` | Logout + health GREEN, 6 tests | `3A8DD80E5760E0BDDEFC4E3AD3F1595438D8365D75DC44EF2B835C375203E7A5` |
| `idea-f03b-test-CQDrkoGp.log` | Idle boundary RED | `D81D61DAC522DD5BB5481B22B4742C4F6D01D76712A8158FE6E60E872C8FBB7B` |
| `idea-f03b-test-UrVUI4Hf.log` | Idle + health GREEN, 7 tests | `5405518608A112A51B8699A7C4866A7C39CCFCE63167A53DC8FB3C9D9FD12430` |
| `idea-f03b-test-4fimjXud.log` | Absolute limit + health GREEN, 8 tests | `2AB17793B4ABDB6052C58D7680A72896EA06312E4F24FF6481B6561481579214` |
| `idea-f03b-test-clny9Pax.log` | Invalid anonymous CSRF mapping RED | `83EBD4D5BF8DDB95A2B5AF3B83B2BF605B009D5A1948889FE3F55838967ED736` |
| `idea-f03b-test-UlGQHlgy.log` | Final iterative worktree GREEN, 30 tests | `A8A16DA7055C43D5EAFF208E2273B854C242D8CBE834C338B2BFC2FCCE800050` |
| `idea-f03b-test-MZMGtWtI.log` | Authoritative committed-source GREEN, 30 tests | `08B4462C6B8CC317B48A65B9D3C6025CC8E0CE134BDBCAE5D098068FA7A05434` |

Later iterative overlays were replaced during development and not retained individually as
exact source archives. Their logs document observed iteration, **not independently reproducible
commit-pinned executions**. The authoritative result is the clean archive of `441b2e9...` and
its last log above. Private host logs still require host access; this summary/hash record is
not an independent remote raw-log review. The checked-in sanitized excerpt exposes counts only.

### Current disposition and remaining work

**Historical initial run: 30 tests passed; the subsequent review returned REQUEST CHANGES.
See section 16 for repair evidence. F03-B remains IN_PROGRESS.**

T038 and the initial T039 test slices are checked; shared F03 tasks and T040–T044 remain open
for their unimplemented/unqualified portions. Before whole-card acceptance, finish:

- target-bound one-use setup/reset proof, exact password bounds and atomic redemption;
- race-safe 5-failure/15-minute temporary login block and refusal evidence;
- authenticated account-administration HTTP routes through the existing role/scope evaluator;
- session invalidation on disable/reset, no resurrection on re-enable/restart, required
  failure/atomicity cases, and verified eligibility on all applicable requests;
- the verified ActorContext/session reference needed for later F04 commit-time checking;
- actual Web HTTPS/CSRF/cookie and native Desktop binding/protected-custody qualification;
- affected migration/data regression and any required fresh public-schema successor evidence;
- checkpoint/full-scope review and explicit Project Reviewer whole-card acceptance.

Tracker start remains the explicit `2026-09-30T13:01:00.9631915+07:00` action, register revision
29. The open timer is not counted here as final actual effort. No stop, complete, retrospective
estimate, official progress publication, push, PR creation or merge is performed by this record.
No production, multi-Vault, backup/restore, T036 or commercial-clearance claim is made.
`verify-template` remains **NOT-RUN**.

Historical local checks for section 15: tracked-secret scan PASS (10 recognized synthetic fixtures,
233 known binary files skipped), 68 focused relative Markdown targets PASS, and git diff --check
PASS. At that publication, only F03-identity-results.md changed after executed source `441b2e9...`;
these historical checks do not cover the repair source below.

## 16. F03-B review repair: servlet budget and rejected-login work

The Project Reviewer returned **REQUEST CHANGES** for the initial F03-B checkpoint at head
`fcbc7b70ecd07a2b06e3cf92c177bd04f3f475bd` (base `d4268d8d16e6287b7cde937eab4688fc59754fa7`).
The two findings were limited to the implemented HTTP/session checkpoint and were repaired in
the following two vertical slices. This section supersedes the initial checkpoint's technical
disposition; it does not turn the remaining F03-B tasks into PASS.

### Repair R1 — effective servlet session budget

The reviewer observed that Spring Boot's default Servlet `HttpSession` inactivity interval was
30 minutes, which could end the container session before IDEA's PostgreSQL eligibility policy of
2 hours idle / 8 hours absolute. `apps/server/src/main/resources/application.properties` now
sets `server.servlet.session.timeout=8h`. `HttpSessionFlowTest` creates a real loopback HTTP
session and captures `HttpSession.getMaxInactiveInterval()` through a test-only listener; it
requires **28,800 seconds**. The test is about the actual container configuration, not the
injected eligibility clock and not an eight-hour soak.

Red result on the pre-fix source: **1,800 seconds** (the default), assertion failure. Green result
after the property: `F03B_EFFECTIVE_SERVLET_IDLE_SECONDS=28800`.

### Repair R2 — unknown and disabled login password work

The reviewer also observed that the old `SessionService` condition could reject an unknown or
disabled login before BCrypt, while a known active login with a wrong password performed BCrypt.
`SessionService` now creates one generated, qualified BCrypt dummy verifier per service instance
(never an account credential or logged value) and always evaluates the candidate against the real
verifier or that dummy before refusing. For valid password candidates within the qualified BCrypt
input bounds, unknown/disabled logins perform the same encoder work; existing malformed-input
rejection remains. The HTTP regression prepares a synthetic disabled account through the reviewed
F03-A services, warms all three paths, then interleaves nine wall-clock samples per path. It checks
the empty 401 response and requires the unknown/disabled medians to be at least 65% of active/wrong.
That tolerance detects the gross bypass gap; it is not a constant-time guarantee, load test or
failed-login-throttling qualification.

Red result on the pre-fix source: median active/wrong **142.846 ms**, unknown **3.557 ms**, disabled
**3.636 ms**; both assertions failed. Green result: active/wrong **138.520 ms**, unknown **138.572
ms**, disabled **138.644 ms** (9 samples per path).

### Retained red/green sources and logs

Iterative repair directory: `/home/phuclam/idea-f03b-review-red-Eves4Ne1`, owner `phuclam`,
mode 700. Start with the archive of reviewed head `fcbc7b70ecd07a2b06e3cf92c177bd04f3f475bd`
and apply the following retained overlays in order. R1 and R2 were tested separately before
their corresponding production repair; no test-harness compile failure is counted as behavior RED.

| Retained archive | SHA-256 |
|---|---|
| `f03b-review-base.tar` | `18AD89F5850CB9CB8FB4F8D850E573AD1FD98F64B266BDB7EE7AE5B1C5F9DA97` |
| `f03b-review-r1-test.tar` | `DBF6D8C7B016ED9198FB367E38BF41E8B16F014A9AD4F5DE49B27924E4B8B22D` |
| `f03b-review-r1-green.tar` | `C4C78F4FEDCC65C99F89AD467BAFE2ADA61B531A67445BA158DCFE6473F8A728` |
| `f03b-review-r2-test.tar` | `107485CFF459BA56ABD2FDC1632A241B53E6AE61304E3FE6119CC5F080916A02` |
| `f03b-review-r2-green.tar` | `E403D5CB7AA5AE103C0D0F4D5D7198E811BFDF15FEE8FC0E145F763A94D0E3AA` |

Run R1 with runner filter `HttpSessionFlowTest#effectiveServletSessionBudgetDoesNotPreemptIdeaPolicy`;
run R2 with `HttpSessionFlowTest#unknownAndDisabledLoginsDoNotBypassPasswordWork`. Each run
contains one test. Logs below are under `/home/phuclam/`, owned by `phuclam`, mode 600.

| Retained log | Result | SHA-256 |
|---|---|---|
| `idea-f03b-test-BhsN1mKF.log` | R1 RED: 1 failure, observed 1800 | `0B204D09B52ECFEA284D781D932DEF2E628D112DBD65B430BA92D64834E7BAB9` |
| `idea-f03b-test-WkWWremj.log` | R1 GREEN | `3EF5DFDC13667E6C93EA3827060FCC711B597991D22A53A71D84328E569032DD` |
| `idea-f03b-test-RLyMdHx7.log` | R2 RED: both timing assertions failed | `3817BC710BA3659556F3B89C6E8E9CBC73251D46241B0B1E6C5C1CD446746FE4` |
| `idea-f03b-test-B3sLMnWc.log` | R2 GREEN: medians 139.869 / 139.660 / 139.345 ms | `7090E3D5DC24C87E30D2217545106FC8CB01068CF69E94FC702C03B07E8A867F` |

### Successor execution

- Exact committed source: `4ec5471c6a8f8b05e0293b32b6194e1b904e16b6`.
- Clean source archive SHA-256: `12F6E7CAD4D31257EB437A09F05CE273331DC145CEECF3FBF4B14D5E5F1D2257`.
- Retained clean extraction: `/home/phuclam/idea-f03b-review-committed-7ODRzC8c`, mode 700;
  `f03b-review-source.tar` mode 600, owner `phuclam`.
- Host: `ideaddmserver` / `192.168.137.33`; Temurin `25.0.4.1+1`; PostgreSQL `18.6`.
- Database: `idea_ddm_f03a_20260930_c91e7a42`; runtime `idea_ddm_app`; migration
  `idea_ddm_migrator`; temporary schemas are UUID-scoped and cleanup is bounded to each test.
- Command: `bash apps/server/scripts/run-f03b-postgresql-checks.sh HttpSessionFlowTest,IdentityFlowTest,ServerSmokeTest`.
- Result: **32 tests, 0 failures, 0 errors, 0 skipped** — HttpSessionFlowTest 10, IdentityFlowTest
  20, ServerSmokeTest 2; Maven elapsed 28.173 seconds; `F03B_SCOPED_TESTS=PASS`.
- Maven completed at `2026-09-30T14:19:00+07:00`. Container session budget 28,800 seconds;
  timing medians active/wrong 138.520, unknown 138.572, disabled 138.644 ms.
- Retained host log: `/home/phuclam/idea-f03b-test-cJf8mNEG.log`, mode `600`, SHA-256
  `F8F77D06CA595EDA198A0B3736ABEE14F4EDA756620BE9343E86C255DD4C57C7`.
- Post-run read-only check: PostgreSQL `18.6`, `0` remaining `f03a_`/`f03b_` UUID test schemas,
  and public Flyway versions `1,2,3`. Public V4 remains NOT-RUN in this checkpoint.

From executed source `4ec5471...` to the publication, only this evidence file and tasks.md change;
no application, test, dependency or migration changes occur after the successor run. T044 remains
open for its full F03-B and migration/data coverage. The raw host log remains an
INFO limitation because it is not independently readable through GitHub. `verify-template` remains
**NOT-RUN** by explicit instruction. Credential setup/reset, temporary login blocking, HTTP account
administration, complete disable/reset/re-enable/restart invalidation, all-request/F04 eligibility,
Web/Desktop qualification, fresh public V4 evidence and whole-card Project Reviewer acceptance
remain open.

Repair publication checks: tracked-secret scan **PASS** (10 recognized exact synthetic fixtures;
233 known binary files skipped); repository hygiene **PASS**; 17 relative Markdown targets in
this evidence and tasks.md **PASS**; git diff --check **PASS**.

## 17. Received repaired-checkpoint review and next slice

On 2026-09-30 the Project Reviewer relayed GPT Web's read-only **PASS WITH NOTES** for
PR #25 at base `d4268d8d16e6287b7cde937eab4688fc59754fa7`, reviewed head
`3fdf9f56238bb3f0b18ec5004143a699d0f9f27e` and executed source
`4ec5471c6a8f8b05e0293b32b6194e1b904e16b6`. This is a conversation-sourced technical
review record, not a claim of a submitted GitHub approval or whole-card Project Reviewer acceptance.

The review closes both prior MAJOR findings: the effective servlet timeout no longer pre-empts
the 2-hour idle policy, and unknown/disabled login paths no longer bypass BCrypt work. The
reviewer found no new defect in the initial checkpoint. Its source trace and 32-test successor
execution remain those in section 16; this record does not rerun or broaden those results.

The reviewer could inspect source, retained result summaries and file hashes through GitHub,
but could not independently read the private host logs. Timing evidence detects the gross
password-work bypass, not constant-time authentication. Fresh public V4 remains **NOT-RUN**.
All remaining F03-B work listed in section 16 remains open, including client qualification.
`verify-template` remains **NOT-RUN**; no production, commercial or T036 clearance is implied.

The next planned slice is first credential setup through real HTTP and PostgreSQL. Before its
implementation, the permission-version choice needs confirmation: V3 seeds
`account-administrator@1` with only `account.create`, `account.disable` and `account.re-enable`,
while T041 requires explicit setup/reset permissions. CONTEXT Role Definition and DOC-04
`REQ-AUTH-002/004` prohibit silently extending a version-pinned assignment's authority.

Engineering recommendation, **NOT APPROVED / NOT IMPLEMENTED**: introduce protected
`account-administrator@2` with the three predecessor actions plus
`account.credential.setup.issue` and `account.credential.reset.issue`; keep version 1 and its
assignments unchanged. Permit Super to grant only the supported Account Administrator versions
through the ordinary organization-scoped, reasoned and audited assignment path, including
explicit self-assignment. No Super-only credential authority or automatic assignment upgrade.
This exact version/permission selection is a decision pending Project Reviewer confirmation;
it does not change the approved requirement for independently assigned Account Administrator
authority. After confirmation, execute the first-setup slice by TDD; reset and throttling remain
separate subsequent slices. T040–T044 and F03-B remain open.

Documentation checks: tracked-secret scan **PASS** (10 exact synthetic fixtures, 233 known
binary files skipped); repository hygiene **PASS**; 17 relative Markdown targets **PASS**;
git diff --check **PASS**. No runtime retest: only this record and tasks.md changed after the
reviewed head. No Tracker, acceptance or integration state was changed.

## 18. Approved Account Administrator v2 and first-setup checkpoint

### Decision and scope

After section 17, the Project Reviewer explicitly approved the v2 recommendation on 2026-09-30.
This supersedes that section's pending recommendation, not the approved F03-A implementation:

- `account-administrator@1` keeps `account.create`, `account.disable`, `account.re-enable`.
- Protected `account-administrator@2` adds separate `account.credential.setup.issue` and
  `account.credential.reset.issue` Permissions. Neither v1's permission set nor its assignments
  is overwritten or retargeted.
- Super may grant a separate exact supported v1/v2 assignment using its existing scoped
  assignment Permission. The assignment retains assigner, reason, Access Policy outcome and Audit.
  Super alone has no credential issuance authority.
- First setup applies only to a PENDING account with no credential. Redemption is authorized by
  the target-bound, one-use, expiring proof, not an Account Administrator role.
- Execute v2/first setup, redemption/activation, separate reset/invalidation, then failed-login
  blocking. The last two slices remain unimplemented. `SPEC-OPEN-03/06` and full F03-B stay open.

Impact: add V5 and setup HTTP/service behavior; retain the existing scoped evaluator, stable
identities, required evidence and least-privilege runtime/migrator separation. Spec v0.4,
plan, data model and contract record this clarification. No new dependency, roadmap hours,
product gate, public signup, live proof-delivery channel, company account or commercial approval.
Standard JDK random/digest primitives and the already-qualified BCrypt/HTTP stack are reused.

### Executed behavior

`CredentialSetupService` issues 256-bit random URL-safe proof, stores only its SHA-256 digest,
and binds target Account/Login Identity, purpose FIRST_SETUP, security version and 15-minute expiry.
The protected synthetic harness opt-in defaults off; issuance then gives empty 503 and creates
no proof. Enabled synthetic responses use no-store. No live/browser delivery is qualified.

Session eligibility is checked before permission/scope evaluation and again under the shared
security-write lock. An ineligible issuer returns 401; eligible but unauthorized scope/permission
returns 403. Only accepted owner activity refreshes idle time, within the same transaction.
V1/Super-only, wrong scope, anonymous and bad-CSRF issuance attempts were refused.

An anonymous proof holder with CSRF may redeem at its bound pending target. Success atomically
consumes proof, writes BCrypt verifier, activates the same account, increments security version
and retains IAM outcome, account-change evidence and Audit. No membership/role is created.
Replay, wrong target, expired proof, ACTIVE/DISABLED target and stale proof after re-enable were
refused without credential change. Concurrent redemption accepted exactly one password/outcome.
Suppressed IAM outcome or Audit forced 503 and rollback; the same proof/OperationId worked after
the injected fault was removed. Invalid password input did not consume the proof.

Password tests cover 14 versus 15 Unicode code points, 72 versus 73 UTF-8 bytes, surrogate refusal,
and preservation of leading/trailing spaces. Test Clock covers before/at/after proof expiry;
the host clock and the default 2-hour/8-hour session policy were not shortened or changed.

### TDD snapshots and execution

Initial iterations used clean `b29df705db6ffc0770d387986a6e52c95017115f` archive SHA-256
`6BB5EED865DB35F6FA596990246EA85026CB0FE7C31DB9EC07FD15253775E97E`, then ordered overlays
in `/home/phuclam/idea-f03b-setup-TvQEb3VP`. These were uncommitted worktree snapshots,
not tests executed from the eventual PR head. Overlay hashes matched local/server copies.
To rebuild a listed snapshot, apply the listed overlays in order over that base:

| Order / archive | SHA-256 |
|---|---|
| 1 `f03b-v2-red.tar` | `6032125DC30A352F90DC7B6D33F1843E9637351C437BB7B3DB54DFEC456F644C` |
| 2 `f03b-v2-green.tar` | `28372D16061674051046530FCF84B3B747E16F3B58ED244B0BD534DDED1C352F` |
| 3 `f03b-setup-red.tar` | `59DB9037DD3E2FECC97DA5BAA019128A8637B2B653FA0593056670FB4B2D94A0` |
| 4 `f03b-setup-green.tar` | `C7F70B9852A9604CEA24C5660BDD906D0AFB6525027DCB82A89703D4D8B81C42` |
| 5 `f03b-authorization-tests.tar` | `6F51ED324AE1CE12CE5D15A002C4650BE43954A777F53468304C0BFAFC0D37BE` |
| 6 `f03b-unicode-red.tar` | `E05EFC340F6A9FD85DE8DB31320B968EFE1F4F6AF960FC97BAB3EE50CA285561` |
| 7 `f03b-unicode-green.tar` | `87CDFEE118BA9AC033AB28F6CBFB87C22B4FAC2B85A3FDE6C5F29A0F71CE5E80` |
| 8 `f03b-unicode-http-green.tar` | `E410377D8AC515C55B6A706BC07AB136A143B01ACCDFC72689EF28FEFDE8206E` |
| 9 `f03b-binding-tests.tar` | `BE0DE6B487FF6E6ED8F7176297AEAB66352B70C99BE5FA8AA654D1A449FC0AAD` |
| 10 `f03b-expiry-tests.tar` | `3FC626F811B4AC05CD867D0E3EA8E8A21F84174ED6C005F476064E82905247A0` |
| 11 `f03b-state-tests.tar` | `9110A7B2E5BAB5C246032479DE338FF1D349648673534CC49BEFF97B6F98BDE5` |
| 12 `f03b-password-tests.tar` | `3B1912E15C464A5CBDE9168E7BD2042FA7BBAE50137593BCA45BB05B5600A8D7` |
| 13 `f03b-audit-fault-tests.tar` (corrected helper) | `397EB207A2ABCD0073CBECDF72D917E07A9770100FCD3912ECD3DC7957757031` |
| 14 `f03b-iam-fault-tests.tar` | `EC1BB021ECEDABF1D738F2A65E3C72B9AB51C5C12E56BFDC1FF3E44970EC09A1` |
| 15 `f03b-final-boundary-tests.tar` | `BC57A4F8D3CD5BF9A4A293BC2632BB59A003D6AF2AC5A0DEA80C688CC7DCCF31` |

Command: `bash apps/server/scripts/run-f03b-postgresql-checks.sh HttpSessionFlowTest#<method>`.
Compilation was forced after overlays by updating source mtimes; no content changed in that step.

| Method / snapshot | Actual result | Private log basename / SHA-256 |
|---|---|---|
| `accountAdministratorV2IsAnExplicitAuditedAssignmentWithoutRetargetingV1`, order 1 | RED: unsupported role version, 1 error | `idea-f03b-test-nk4Evt3L.log` / `93628BA4A5023DEBB8BD2FB464447C738D901312E77A1692C2631F6489262598` |
| Same, through order 2 | GREEN: 1 PASS | `idea-f03b-test-RzX5SHyj.log` / `526FDF2DBEA6957F2FA902AD5A23ED0CA65DFA53E87F686D892D98B32E7AD3C5` |
| `explicitV2CanIssueFirstSetupAndProofHolderActivatesOnlyItsBoundAccount`, through order 3 | RED: expected 200, got 404 | `idea-f03b-test-pxxi4LrV.log` / `426728779E61ADD43DF6A46FC88EDD64238C23B664AEA490DB2433671C3578C0` |
| Same, through order 4 | GREEN: 1 PASS | `idea-f03b-test-qfNkl8WQ.log` / `71C07E3D0F1309DDACC85AFE483A0ED4C914619B565E3A53E028C760E1A8B5A5` |
| `malformedUnicodeCannotBecomeAReplacementCharacterCredential`, through order 6 | RED: expected 400, got 204 | `idea-f03b-test-LOagaadm.log` / `CB433584DCE7CCAD863E14B28F53265571BF54260D62BBBFA46CE9B564F43E6C` |
| Same, through order 8 | GREEN: 1 PASS | `idea-f03b-test-byIVx7YE.log` / `3F38E30AD9C9B593B75775B619AA4AEE31EF13EC59F983693E1A0C3F737CB062` |

An intermediate Unicode run rejected input but returned 401 through error dispatch; the controller
was corrected to return empty responses directly. A stale incremental build, incomplete archive
transfer and test-helper compilation mistake also occurred during iteration; none is PASS evidence.
Final authority below uses a clean committed archive without build outputs or overlays.

Internal review of `2ab07a1cbf9217a108aaad46e3eb7fb0b17103ef` found the ineligible-issuer
401/403 mismatch. Its clean archive was SHA-256
`51ECD50341909CA62844EFA55A17BE1555AA4200DAD5F86DEBC1FDAC992C62E3`;
45 tests passed at that revision, but they did not cover the newly identified case.
The repair's RED run used the iterative base/overlays through order 15 (whose runtime changes
were committed at `2ab07a1`), then `f03b-review-session-red.tar`, SHA-256
`72537A69F767C048C0E09E0A265287C8DEE390466FF27AC9406253BBECCCB4BA`.
`expiredSessionIsRefusedBeforeRoleOrScopeEvaluation` failed expected 401/actual 403;
log `idea-f03b-test-t4GRhIHC.log`, SHA-256
`6F0840C83491431A68668697F97B76FDE58B5DC1EA7C5D7A421E5E33DE95F295`.
Apply repair overlay `f03b-review-session-green.tar`, SHA-256
`9AF2AD474E9F5930AEB45442CCB6F9496B069147857A0C3960BFBA5C0892C0A9`;
the expired unauthorized/scope and disabled/re-enabled issuer methods passed 2/2:
log `idea-f03b-test-tIsdnmXn.log`, SHA-256
`3B2BA3917498A43A3A22F712355107552E9D5B6D2A8FF08D958A431128845ED3`.
This is intermediate repair evidence; the final commit additionally checks that near-deadline
permission refusals cannot renew the idle deadline.

### Final exact-source successor

Executed source: **`0d740bddc09456f70753996a59dd5f585805d743`**. A clean archive containing
all tracked `apps/server` and `database` inputs was made by
`git archive --format=tar HEAD apps/server database`. SHA-256:
`7C4953479F76CC5CC9ACAA4B43508E03EB61E723C26A63643F495353C043D537`.
It was unpacked into fresh `/home/phuclam/idea-f03b-setup-final-UQMntH1q`, not an incremental
build directory. Archive hash matched before extraction; Maven compiled 17 source and 6 test files.

```text
bash apps/server/scripts/run-f03b-postgresql-checks.sh HttpSessionFlowTest,IdentityFlowTest,ServerSmokeTest
HttpSessionFlowTest: 25 / failures 0 / errors 0 / skipped 0
IdentityFlowTest:    20 / failures 0 / errors 0 / skipped 0
ServerSmokeTest:      2 / failures 0 / errors 0 / skipped 0
TOTAL:              47 / failures 0 / errors 0 / skipped 0
BUILD SUCCESS; elapsed 43.169 seconds; finished 2026-09-30 15:25:25 +07:00
```

Environment: Ubuntu development host, PostgreSQL `18.6-0ubuntu0.26.04.1`, Temurin `25.0.4.1+1`,
Spring Boot `4.1.1`; distinct actual `idea_ddm_migrator` and `idea_ddm_app` logins.
Only own UUID `f03a_`/`f03b_` schemas in authorized `idea_ddm_f03a_20260930_c91e7a42` were migrated
V1–V5 and dropped. Real HTTP binds loopback with ephemeral port and test-only Secure-cookie false;
synthetic delivery is explicitly enabled except the default-off regression. No mock/H2 database.
Post-run read-only oracle: 0 owned UUID schemas remain; public Flyway versions still `1,2,3`.
No `idea_ddm_dev`, F02 database or Vault mutation.

Final log `/home/phuclam/idea-f03b-test-I9elmWq0.log`, mode `600 phuclam`, SHA-256:
`104FB5719FB409AC7A4BE2B8B9222B43F0454576B28F28C13DFF4D095DD2465B`.
Retained raw logs are private and not independently readable through GitHub; hashes identify
files, not independent review of their contents. Logs/proofs/passwords were not published.
Existing timing regression remains only a gross-work-bypass check, not constant-time proof.

V1–V4, dependency graph and `IdentityFlowTest.java` are unchanged from the previous reviewed
F03-B head `3fdf9f5`. The existing F03-A behavior assertions also remain unchanged from accepted
`79373e9`; the earlier F03-B checkpoint only broadened its test DB allowlist to include this
dedicated F03-A database. All 20 tests reran; no accepted v1 regression was removed.

### Standards

Internal source-only review at `0d740bd`: 0 documented-standard breaches, 0 open smell judgments.
The initial nonblocking duplicated eligibility query was removed: session inspection and proof
issuance share the query, preserving transaction ownership and refusal mapping. Reviewers did not
run tests or read credentials/private host logs.

### Spec

Internal source-only review at `0d740bd`: 0 open Spec findings. The initial ineligible-session
HTTP mismatch is closed by admission/commit eligibility checks and new regressions. No scope creep
or missing requirement was identified within this first-setup checkpoint. Counts remain separate:
Standards 0 open; Spec 0 open. These reviews do not substitute for Project Reviewer acceptance.

### Remaining work and disposition

This successor is scoped technical evidence for PR #25, not F03-B completion. Reset proof and
all-session invalidation, temporary failed-login block, HTTP account administration, complete
protected-request/F04 commit-race eligibility, client Web HTTPS/Desktop custody qualification,
fresh public V4/V5 and affected migration/data regression remain open. Reset Permission is seeded
but its operation is not implemented. `verify-template` is **NOT-RUN** by instruction.
`SPEC-OPEN-03/06`, T036 and production/commercial readiness remain open. No timer, actual hours,
Tracker completion, Issue closure or merge was inferred from generic continuation.

After executed `0d740bd`, changes are this evidence/tasks and synchronization of the three
progress files already published on main at `19587d1b43635822e6a27d86dcae01db9c0220d8`.
This sync made no new Tracker action. Runtime source, tests, dependencies and migrations did not
change after the final run. Next runtime slice:
separate password-reset proof and session invalidation after review of this checkpoint.

Publication checks: tracked-secret scan PASS (10 exact synthetic fixtures recognized, 233 known
binary files skipped); repository hygiene PASS; 37 relative targets across the changed PH1
documents PASS; git diff --check PASS. No verifier was run. Post-implementation extension hooks
are NOT-APPLICABLE: `.specify/extensions.yml` is absent.

## 19. Received first-setup checkpoint review

On 2026-09-30 the Project Reviewer supplied GPT Web's read-only review of PR #25:

| Pin | Revision |
|---|---|
| Review base | `19587d1b43635822e6a27d86dcae01db9c0220d8` |
| Reviewed head | `153d0258108cfe1fdc490d42d57f64aa9098e82f` |
| Executed source | `0d740bddc09456f70753996a59dd5f585805d743` |
| Disposition | PASS WITH NOTES for first credential setup only |
| Source record | Human-relayed GPT Web text, SHA-256 `CA08DB1C77F7BCEC641B4301410EBD9B2DF027890A15DC9F04E55ED0F43A8125` |

The review reports no BLOCKER, MAJOR or MINOR in exact v2 assignment, unchanged v1 authority,
first-setup issuance/redemption, binding/expiry/password boundaries, concurrency, atomic failure,
default-off synthetic delivery, or admission/commit session eligibility. It accepts section 18's
47-test execution as scoped technical evidence, not whole-card acceptance. Local comparison
confirms that the executed-source-to-head delta contains only this evidence, tasks and the three
already-published progress files; accepted V1–V4 and F03-A regression source did not change.

The reviewer did not independently read private raw host logs. Public V4/V5 remain NOT-RUN;
the 47 tests migrated only their own UUID schemas. Reset/all-session invalidation, temporary
login blocking, full HTTP administration/request eligibility, F04's owner-commit race, client
qualification and affected migration/data regression remain open. SPEC-OPEN-03/06, T036 and
production/commercial clearance are not closed. No verifier was run or inferred PASS.

This records received technical feedback, not a GitHub approval, new gate decision, merge,
Issue #24 closure, Tracker action or actual-effort estimate. F03-B remains IN_PROGRESS.
No runtime rerun was needed to record this review because runtime source did not change.
The next approved implementation slice is separate password reset and session invalidation;
the initially unresolved DISABLED state branch was subsequently clarified in spec v0.5:
reset preserves disablement; re-enable remains a separate operation.

## 20. Reset recovery without account enablement

### Decision, impact and scope

On 2026-09-30 the Project Reviewer authorized the relayed reset proposal if Engineering found it
consistent. Code inspection confirmed that re-enable activates an account with a verifier:
requiring re-enable before reset would allow the compromised old password between those actions.
The proposal matches REQ-IAM-003/004 and the existing contract: reset cannot re-enable a disabled
account. [Spec v0.5](../spec.md), story 3 scenario 12 and its synthetic profile record the decision;
[contract](../contracts/ph1-boundaries.md), [plan](../plan.md) and [data model](../data-model.md) carry
the implementation trace. No new product-gate or live-company security approval is claimed.

`CredentialResetService` uses the existing exact scoped reset permission, shared security-write
lock, password validator and assignment/session eligibility. ACTIVE and DISABLED targets must
already have a verifier. RESET has a separate V6 proof table bound to account, login identity,
purpose and security version; only the digest is stored. Redemption is proof-authorized, not
role-authorized. Omitted purpose retains FIRST_SETUP compatibility.

Accepted reset replaces the verifier, advances security version, revokes all affected sessions,
consumes proof and retains IAM outcome, history and Audit in one transaction. Account status and
the exact `actor.disabled_at` timestamp remain unchanged. Prior proofs become ineligible by
version, not deleted. DISABLED targets reject both passwords until separate expected-version
re-enable; afterward only fresh new-password sign-in works. Other accounts' sessions and pinned
v1 assignments are unaffected. No dependency, live delivery channel or HTTP account-lifecycle
route was added; issuance still requires explicit synthetic-delivery opt-in.

V1–V5 source and all 20 F03-A regression tests are unchanged. One prior setup test's unsupported
purpose changes from RESET to UNSUPPORTED because RESET now has a separate path; its FIRST_SETUP
state/refusal assertions remain intact.

### TDD and source trace

Iterations used reviewed `153d025` archive of `apps/server` + `database`, SHA-256
`6265342E14D238A95041E1ED1E71ACDEDEABE9FB4359614228595FD743CDE1FF`, in
`/home/phuclam/idea-f03b-reset-5pQjV0yv`. Apply RED `f03b-reset-red-01.tar`, SHA-256
`D57FEC44D17C60CA1C70AE2357A5560EEDB330D00BC5AF415E908807F0220CA7`:
`HttpSessionFlowTest#resetWhileDisabledChangesCredentialButRequiresSeparateReenableAndFreshSignin`
failed expected 200 / actual 400. Log `idea-f03b-test-JcmVh0ZB.log`, SHA-256
`40EC587829D00791EAFBD5FE8C066197734B49F4F1D17336A4691EE125DFE789`.
Apply GREEN production `f03b-reset-green-01.tar`, SHA-256
`DFF7A009E088C19E0EAFE86D359FBEC11C42B9D7737D3C34028ECA4036EA2BE9`:
same method passed 1/1. Log `idea-f03b-test-lmYjZvlW.log`, SHA-256
`59CFAF7F393D6EB06E3D2E02342B720F6D3E569B18C1A620287C14F333453147`.

Regression extensions covered the ten reset cases below. An intermediate issuer test incorrectly
compared assignment counts captured before its explicit v1/v2 grants. That oracle error was
corrected, not treated as a production failure or PASS.

Initial committed `78ce36575c884c54dde82eb9f47c49a33f3d9444` ran 57 tests PASS, but internal review
found a DB invariant not covered: PostgreSQL CHECK accepts UNKNOWN, allowing a consumption
OperationId without timestamp. Its new regression used that runtime plus test overlay
`f03b-reset-check-07-red.tar`, SHA-256
`E0A20404AAED0E19008732378AFCA0FC82E00A0439040FDB1088C45224209AC7`; app's malformed update
succeeded, so the test failed. RED log `idea-f03b-test-oLiJ68Hg.log`, SHA-256
`23832BB816A0C29F5BCFA6E76268C46972408B0BC13F5F865C6CF7D87AA34994`.

Successor V6 explicitly requires a non-null consumption timestamp and additively enforces the
same complete-pair invariant on setup proof, without rewriting V5. Both malformed app updates
now fail `23514`. Existing contradictory predecessor rows make migration fail closed; no
evidence is repaired silently. The affected public-data migration remains NOT-RUN.

### Final exact-source execution

Executed source: **`976bd031913edb3e4554af6e23744a1dd55d8527`**. Clean archive command:
`git archive --format=tar HEAD apps/server database`. SHA-256
`4AE5C5CC2884AC44AB24CD79E0B545875E898A7E89A41B929296241ABC9880D6` matched on the server;
fresh extraction `/home/phuclam/idea-f03b-reset-final-oRLdeafN` contained no build outputs/overlays.

```text
bash apps/server/scripts/run-f03b-postgresql-checks.sh HttpSessionFlowTest,IdentityFlowTest,ServerSmokeTest
HttpSessionFlowTest: 35 / failures 0 / errors 0 / skipped 0
IdentityFlowTest:    20 / failures 0 / errors 0 / skipped 0
ServerSmokeTest:      2 / failures 0 / errors 0 / skipped 0
TOTAL:              57 / failures 0 / errors 0 / skipped 0
BUILD SUCCESS; elapsed 57.418 seconds; finished 2026-09-30 16:29:41 +07:00
```

Actual Ubuntu PostgreSQL `18.6-0ubuntu0.26.04.1`, Temurin `25.0.4.1+1`, Spring Boot `4.1.1`;
distinct authenticated `idea_ddm_migrator` and `idea_ddm_app`. Only test-owned UUID `f03a_`/`f03b_`
schemas in authorized `idea_ddm_f03a_20260930_c91e7a42` were migrated V1–V6 and dropped. Postflight:
0 owned UUID schemas remain; public Flyway still `1,2,3`. No dev/F02 database or Vault mutation.
Loopback HTTP, test-only Secure-cookie false and controlled Clock do not qualify Web HTTPS.
Real idle/absolute budgets stay 2h/8h; proof expiry stays 15 minutes, without wall-clock waiting.

Ten new reset tests cover disabled/active recovery, exact disablement preservation, old passwords
and sessions, separate re-enable, other-account isolation, explicit v2/scope/session authorization,
default-off issuance, target/purpose/password/CSRF refusal, replay/staleness, before/at/after expiry,
IAM/Audit/session-revocation fault rollback, concurrent redemption with one winner, and DB
owner/immutable binding/complete-consumption constraints.

Final raw log `/home/phuclam/idea-f03b-test-sKJg4Gif.log`, `600 phuclam`, SHA-256
`7CA74ED7066EFEC703B0F0D27BB32E3A363EAFB2D20A22692B7F1B704E7DB609`.
Raw host logs stay private, not independently read by GPT Web. Hashes identify files; they do not
replace independent raw-log review. No password or proof value is published.

### Standards

Source-only review at `78ce365`: one proof-integrity finding, repaired and rechecked at `976bd03`.
Final Standards: 0 open findings; no material smell judgment identified.

### Spec

Source-only review at `78ce365` and repair `976bd03`: 0 open Spec findings in this reset slice.
No scope creep. Reviewers did not execute tests/read credentials. Standards 0 open; Spec 0 open;
external reset review remains pending. These reviews do not accept the whole card.

### Clarification coverage and remaining work

No extra question: one supplied decision integrated. Spec quality 16/16 → 16/16, no checkbox
change/regression; reviewer checklist stays 12/12. Sections touched: Clarifications, story 3
acceptance scenario and synthetic profile, with contract/plan/data-model trace.

| Clarification category | Status |
|---|---|
| Functional scope/behavior; domain/data; edge cases/failure | Resolved: disabled reset and separate enablement explicit |
| Interaction/UX; non-functional attributes; integration/dependencies; constraints/tradeoffs; terminology; completion signals; placeholders | Clear within the approved synthetic reset slice |

No reset-slice ambiguity remains; continue the existing implementation plan. Temporary failed-login
blocking is next. Full HTTP administration, all applicable protected requests/F04 commit race,
Web/Desktop qualification, fresh public V4–V6 and affected migration/data regression remain open.
T040–T044, SPEC-OPEN-03/06, T036 and whole-F03-B acceptance are not closed. `verify-template` is
NOT-RUN. No timer/hours/Tracker action, Issue closure or merge was inferred. Extension hooks are
NOT-APPLICABLE: `.specify/extensions.yml` is absent. Changes after executed source are evidence
and tasks only; runtime/tests/migrations/dependencies remain pinned to the final run.

Publication checks: tracked-secret scan PASS (10 exact synthetic fixtures recognized; 233 known
binary files skipped); repository hygiene PASS; 41 relative targets across changed PH1 documents
PASS; git diff --check PASS. None is `verify-template`. No new progress publication occurred.

## 21. T046 exact Login Identity reset successor

### Scope and disposition

External review of reset checkpoint `064f55ffa62e8f67ee6e062e3ab1c827e5509c23` found one
MAJOR: RESET issuance selected an arbitrary Login Identity when an Account could have more than
one. T046 repairs that contract without reopening T045 or changing historical §20. The request
now requires `loginIdentityId`, even for a single-login Account. The Server validates the exact
Account, Organization, expected `security_version`, existing credential and ACTIVE/DISABLED state;
the proof stores that exact Login Identity. Redemption updates only the pinned credential, advances
the Account version and revokes all old Account sessions/proofs. Sibling credentials remain intact.
V1–V6 are unchanged and no migration was added.

The existing F03 schema deliberately has one `operating_organization` row (the singleton/check
and Account foreign key in V2/V3). Therefore a valid second-Organization fixture cannot be created
without violating the approved schema. Tests cover wrong requested scope, foreign Login Identity,
unknown selector, credentialless selector and stale version; the production predicate still
checks target Organization explicitly. This is not a waiver of the Organization check and does
not justify weakening the schema merely to force a mutation-sensitivity test.

### RED → GREEN and exact-source execution

The first RED used the reviewed source archive plus a test overlay (archive SHA-256
`671F0270B1B539A2FF72597D0880019BBFF2DC71C8FA2F01C127C5E61AB0DE66`).
`resetRequiresExplicitLoginIdentityEvenWhenAccountHasOnlyOneLogin` expected HTTP 400 but the
unrepaired controller returned 200. Its private sanitized runner log was
`/home/phuclam/idea-f03b-test-xe9Ojrzo.log`, SHA-256
`376F421220EB3033ADEB6857AAB75C1A2B84EE24F316ED31F0F7A8CC2A18774`.

The minimal GREEN overlay added the request field, service parameter and exact predicate (overlay
SHA-256 `D850CA6F0900F0673C983D5EC048D5D4154C671EB187AAE51B56D140B7CD20C1`). The same test then
passed 1/1 with no failure/error/skip; its private log was
`/home/phuclam/idea-f03b-test-o7GBjHT3.log`, SHA-256
`91F9A5A6EA91CF83D8E06DAB926668CBA5E733C5E23729885FB298AE95DCBBD5`.

The successor matrix added real HTTP/PostgreSQL cases for explicit L1 and L2 selection, sibling
credential preservation, missing/unknown/foreign/credentialless/stale selectors, Account-wide
session invalidation, sibling-proof staleness, disabled reset followed by separate re-enable, and
Audit-failure rollback. The committed exact-source archive for `1e69ac61d2e8f53c742fd1041c36a5bf2c3bf142`
was SHA-256 `A18910563B6BA8566F2A9BCB325EC44B46CBA47979C82B8B6C7E072FE0DDD815`; the server
matched it before extraction into a fresh directory.

```text
bash apps/server/scripts/run-f03b-postgresql-checks.sh HttpSessionFlowTest,IdentityFlowTest,ServerSmokeTest
HttpSessionFlowTest: 41 / failures 0 / errors 0 / skipped 0
IdentityFlowTest:    20 / failures 0 / errors 0 / skipped 0
ServerSmokeTest:      2 / failures 0 / errors 0 / skipped 0
TOTAL:              63 / failures 0 / errors 0 / skipped 0
BUILD SUCCESS; elapsed 01:06 min; finished 2026-09-30 17:44:25 +07:00
```

Final runner log was `/home/phuclam/idea-f03b-test-qM08P9q4.log`, mode `600` owned by `phuclam`,
SHA-256 `40C0F0652389F73E818C00D2E408CE640BE8419B64FF78C78F8AC29F2424FC55`. The run used
PostgreSQL `18.6-0ubuntu0.26.04.1`, Temurin `25.0.4.1+1`, distinct `idea_ddm_migrator` and
`idea_ddm_app`, and only test-owned UUID `f03b_` schemas in the authorized F03 database. Postflight
left zero owned UUID schemas; public Flyway remains V1–V3. No F02/dev database or Vault was touched.

### Review and limits

Internal Standards review found 0 hard findings and one optional duplicated-test-assertion smell.
Spec review found no implementation or scope issue after the schema-singleton clarification; the
Organization predicate remains in production and the accepted refusal matrix is retained. The
late Maven Clean Plugin intake was a one-time internal cleanup exception explicitly accepted by
the Project Reviewer; its Apache LICENSE/NOTICE and JAR hash were checked, and no new dependency
was added. This exception does not qualify future imports or commercial distribution.

T046 technical execution is complete, but the external reset review is **PENDING**. F03-B remains
`IN_PROGRESS`; Issue #24 remains open; T040–T044, T041 throttling, T043 client qualification,
fresh public V4–V6, affected migration/data regression, T036, `verify-template` and whole-card
acceptance remain open. A1 throttling is still documentation/test-plan only. No merge or Tracker
completion was performed.
