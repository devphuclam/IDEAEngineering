# F03 Identity Results — Bootstrap and Account Administration Checkpoints

| Control field | Value |
|---|---|
| Stable Evidence ID / class | `IE-VEV-PH1-F03-001` (new F03 record) / verification record |
| Version / status | 0.3 / Draft |
| Product normativity | INFORMATIVE; no changed product requirement or gate |
| Owner / author | Engineering / Codex, assisting the Project Reviewer |
| Reviewer / acceptance authority | GPT Web bootstrap review relayed by the Project Reviewer; internal Standards/Spec account-checkpoint review recorded below; Project Reviewer F03-A acceptance remains pending |
| Evidence date | 2026-09-30, Asia/Ho_Chi_Minh |
| Applicable baseline | PH1 F03-A; bootstrap source `2acf4dafeb19e52e36d8aa9c280b033ac20be56a`; latest account-checkpoint source `acb772e99b96c13a10dc7ad905d6eb7daec0493a` |
| Upstream trace | [Work Item #22](https://github.com/devphuclam/IDEAEngineering/issues/22), [PH1 spec](../spec.md) FR-013 / clarification 2026-09-30, [PH1 tasks](../tasks.md), DOC-04 REQ-IAM-002/003/005/007 / REQ-AUTH-004/009/010, DOC-05 IF-DIRECTORY-ADMIN / IF-RBAC-ADMIN / ARCH-VIEW-SEQ-008, [ADR-0012](../../../docs/adr/0012-use-principal-role-scope-rbac.md) |
| Downstream trace | F03-A service implementation and later card acceptance; F03-B remains unimplemented |
| Classification / retention | INTERNAL; retain with F03 source and acceptance evidence |
| Change / supersession | Supersedes published v0.1 at `560b63e96f567c47d001f97220cccfc1757a54cd`; incorporates the local v0.2 bootstrap-review record and adds executed account-checkpoint evidence. Historical bootstrap results are retained, not replaced. Superseded by NOT-APPLICABLE |
| Review trigger | Bootstrap, migration, password encoder, account-administration or test-scope change |
| Evidence status | Latest committed-source run: 20 identity tests and 2 Server smoke tests PASS; operator package/headless boundary PASS. F03-A IN_PROGRESS; not whole-card acceptance |

Tailoring: use the repository authoring standard's verification fields, guided by
ISO/IEC/IEEE 15289:2019, ISO 10007:2017 and the selected ISO/IEC/IEEE 29119 evidence approach.
No conformity claim. This new card-scoped evidence ID remains independent of its existing
Spec Kit path; it is not an added Core Product Document, architecture view or product requirement.

Sections 1–5 retain the earlier bootstrap checkpoint. Sections 6–9 describe the newer
Account Administrator checkpoint and current remaining work.

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

- F03-A remains **IN_PROGRESS**; Issue #22 stays open. This record requests review of Account
  Administrator authorization/account lifecycle, not Project Reviewer whole-card acceptance.
- The positive interactive operator-initialization run remains **NOT-RUN**. The command's
  separate entry point, no-console refusal and bootstrap service behavior are tested; no real
  company account was provisioned.
- A fresh public-database successor with V1+V2+V3 is **NOT-RUN**. The prior V1+V2 note remains
  true historically; isolated-schema migrations do not substitute for either successor run.
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
