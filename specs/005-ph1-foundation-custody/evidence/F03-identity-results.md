# F03 Identity Results — Account Administration and Initial HTTP Session Checkpoints

| Control field | Value |
|---|---|
| Stable Evidence ID / class | `IE-VEV-PH1-F03-001` (new F03 record) / verification record |
| Version / status | 0.11 / Draft |
| Product normativity | INFORMATIVE; no changed product requirement or gate |
| Owner / author | Engineering / Codex, assisting the Project Reviewer |
| Reviewer / acceptance authority | GPT Web checkpoint and whole-F03-A technical reviews relayed by the Project Reviewer; internal Standards/Spec review below; Project Reviewer accepted F03-A on 2026-09-30. GPT Web accepted the initial repaired F03-B checkpoint as PASS WITH NOTES at head `3fdf9f56238bb3f0b18ec5004143a699d0f9f27e`; whole-F03-B acceptance remains pending |
| Evidence date | 2026-09-30, Asia/Ho_Chi_Minh |
| Applicable baseline | PH1 F03-A historical sources below; F03-B repair checkpoint source `4ec5471c6a8f8b05e0293b32b6194e1b904e16b6`, based on `d4268d8d16e6287b7cde937eab4688fc59754fa7` |
| Upstream trace | [Work Item #22](https://github.com/devphuclam/IDEAEngineering/issues/22), [Work Item #24](https://github.com/devphuclam/IDEAEngineering/issues/24), [PH1 spec](../spec.md) FR-013/014 / clarifications 2026-09-30, [PH1 tasks](../tasks.md), DOC-04 REQ-IAM-002/003/005/007 / REQ-AUTH-004/009/010, DOC-05 IF-DIRECTORY-ADMIN / IF-RBAC-ADMIN / ARCH-VIEW-SEQ-008, [ADR-0012](../../../docs/adr/0012-use-principal-role-scope-rbac.md), [HTTP Security intake](../../../docs/research/2026-09-30-ph1-f03b-http-security-intake.md) |
| Downstream trace | F03-A accepted; Execution Register revision 28 / F03-A-EVIDENCE-1; F03-B IN_PROGRESS in local register revision 29, initial HTTP checkpoint only |
| Classification / retention | INTERNAL; retain with F03 source and acceptance evidence |
| Change / supersession | Supersedes v0.10 at `3fdf9f56238bb3f0b18ec5004143a699d0f9f27e`; section 17 records the Project Reviewer's relay of the repaired checkpoint review and the next permission-version decision. No code, migration, dependency or executed result changes. F03-A and earlier F03-B claims retain their stated historical scope. Superseded by NOT-APPLICABLE |
| Review trigger | Bootstrap, migration, password encoder, account administration, HTTP security/session or test-scope change |
| Evidence status | F03-A technical review PASS WITH NOTES and Project Reviewer acceptance PASS; repaired initial F03-B checkpoint technical review PASS WITH NOTES, including closure of the two earlier MAJOR findings. F03-B remains IN_PROGRESS; whole-card acceptance is pending. Main integration and official progress publication remain separate |

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
the received review of that repaired checkpoint. Earlier pending dispositions are historical.

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
