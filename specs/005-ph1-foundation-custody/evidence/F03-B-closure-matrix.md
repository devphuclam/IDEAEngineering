# F03-B closure matrix — Server and accepted Web

| Control field | Value |
|---|---|
| Stable ID / class | `IE-VEV-PH1-F03B-CLOSURE-001` / verification coverage and closure record |
| Version / status / normativity | `0.2` / Draft / INFORMATIVE; delivery reconciliation and scoped tooling authority, not a new requirement or execution result |
| Owner / author | Engineering / Codex |
| Reviewer / acceptance | Project Reviewer approved reconciliation and closure procedure on 2026-10-01; whole-F03-B external review and Project Reviewer acceptance PENDING |
| Applicability / date | F03-B, Issue #24, PR #25; spec v0.7, FR-005/014, SC-003 / 2026-10-01 +07:00 |
| Inspection baseline | `b0e0e6d68e5dc50b4dce26691c219d14b317264b`, before these delivery-only edits; no Maven/PostgreSQL/browser execution in this revision |
| Upstream | [Issue #24](https://github.com/devphuclam/IDEAEngineering/issues/24), [spec](../spec.md), [HTTP contract](../contracts/ph1-boundaries.md#f03-b-http-refinement), [F03 evidence](F03-identity-results.md) and the Project Reviewer's approved reconciliation |
| Downstream | [T040/T042/T043/T044](../tasks.md), [plan](../plan.md#f03-b-scope-reconciliation-and-closure-approved-2026-10-01), [worker handoff](../worker-handoff.md#current-f03-b-closure-handoff), whole-card external review |
| Change / supersession | New closure coverage record within existing Issue #24; supersedes NOT-APPLICABLE. No new feature, task register, card hours or implementation checkpoint |
| Classification / retention | INTERNAL; retain with F03-B review and acceptance evidence; no credential, cookie or proof values |
| Review trigger | Scope, source/test/migration/tooling change, new execution or external disposition |
| Evidence status / tailoring | Source inspection plus identified historical executed evidence; tooling AUTHORIZED FOR F03-B CLOSURE ONLY, nine-artifact/descriptor preflight PASS; offline lifecycle resolution and final T044 execution NOT-RUN. Verification/control fields tailored from repository authoring standard; no conformity or production claim |

## 1. Authority and delivery disposition

Issue #24 explicitly keeps Desktop binding qualification separate. On 2026-10-01 the Project
Reviewer accepted Web W01–W10, declined Desktop/Workspace implementation in F03-B, and approved
scope reconciliation followed by whole-card closure. These are user decisions, not an inferred
scope reduction from missing tools or unchecked tasks.

| Boundary | Current disposition |
|---|---|
| T043-Web | SATISFIED by accepted W01–W10 at reviewed head `24ecdf0c9d5246223837ba1c3b349b3005cb5be4`; [actual browser record](T043-web-browser-successor-20261001.md). |
| Historical combined T043 | Keep `[ ]`; its historical Web + Desktop umbrella has not all executed. This marker is not a Desktop condition on F03-B closure. |
| Desktop/WebView2/Workspace binding | Successor Work Item, NOT-RUN, not a F03-B blocker. Successor not yet created; present seam/test contract after F03-B closes, before code. |
| Desktop direction | Retain WPF/WebView2 hosting actual IDEA Web over HTTPS, separate native session context, server-mediated short-lived binding and Windows per-user protected custody. Exact issue/redeem/refresh/revoke/reauth/replay/cross-user/same-user-hostile-client semantics are not qualified here. |
| F04 owner-command race | Future F04 T023/T025/T026. F03-B exposes the verified eligibility seam; it does not claim F04 business-command race execution. |
| Company policy/MFA, live proof delivery/recovery, T036/commercial, deployment | Separate, not claimed accepted or closed. |
| Verifier / integration / progress | `verify-template` NOT-RUN; merge separate. F03-B IN_PROGRESS, Issue #24 OPEN; no Tracker action or invented effort. |

The task list is the only execution register. Rows below are requirement/evidence references,
not new tasks. `COVERED / FINAL PENDING` means identified historical implementation, execution
and scoped review, not current-head T044 or whole-card acceptance. `OPEN-COVERAGE` is not a
confirmed defect. A skip is NOT-RUN, never PASS.

## 2. Source, test and execution keys

### Current source/test pointers

| Key | Source or test location |
|---|---|
| S1 | [IdentityHttpSecurity](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityHttpSecurity.java), [normal session configuration](../../../apps/server/src/main/resources/application.properties) |
| S2 | [SessionService](../../../apps/server/src/main/java/com/idea/ddm/identity/SessionService.java), [ActorContext](../../../apps/server/src/main/java/com/idea/ddm/identity/ActorContext.java), [V4](../../../database/migrations/V4__native_http_sessions.sql) |
| S3 | [SignInBoundary](../../../apps/server/src/main/java/com/idea/ddm/identity/SignInBoundary.java) |
| S4 | [IdentityController](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityController.java), [IdentityAdministration](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityAdministration.java), [IdentityTransactions](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityTransactions.java) |
| S5 | [CredentialSetupService](../../../apps/server/src/main/java/com/idea/ddm/identity/CredentialSetupService.java), [CredentialResetService](../../../apps/server/src/main/java/com/idea/ddm/identity/CredentialResetService.java), [NativePasswordVerifier](../../../apps/server/src/main/java/com/idea/ddm/identity/NativePasswordVerifier.java), [V5](../../../database/migrations/V5__first_credential_setup.sql), [V6](../../../database/migrations/V6__credential_reset.sql) |
| S6 | [LoginFailures](../../../apps/server/src/main/java/com/idea/ddm/identity/LoginFailures.java), S2/S3, [V7](../../../database/migrations/V7__bounded_login_failures.sql) |
| S7 | [RoleAssignmentAdministration](../../../apps/server/src/main/java/com/idea/ddm/identity/RoleAssignmentAdministration.java), [IdentityAccessPolicy](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityAccessPolicy.java) |
| S8 | [DatabaseMigrationCommand](../../../apps/server/src/main/java/com/idea/ddm/migration/DatabaseMigrationCommand.java), [migration directory](../../../database/migrations), [health controller](../../../apps/server/src/main/java/com/idea/ddm/health/DataHealthController.java) |
| S9 | [actual Web](../../../apps/web/src/App.tsx), S1, [Server build integration](../../../apps/server/pom.xml) |
| H | [HttpSessionFlowTest](../../../apps/server/src/test/java/com/idea/ddm/identity/HttpSessionFlowTest.java); method names below identify the specific oracle, not merely the suite |
| P | [ServerRestartFlowTest](../../../apps/server/src/test/java/com/idea/ddm/identity/ServerRestartFlowTest.java) |
| A | [IdentityFlowTest](../../../apps/server/src/test/java/com/idea/ddm/identity/IdentityFlowTest.java); accepted F03-A regression |
| D | [DataBaselineTest](../../../apps/server/src/test/java/com/idea/ddm/DataBaselineTest.java), [DatabasePrivilegeTest](../../../apps/server/src/test/java/com/idea/ddm/DatabasePrivilegeTest.java), [privilege assertions](../../../apps/server/src/test/java/com/idea/ddm/DatabasePrivilegeAssertions.java), [ServerSmokeTest](../../../apps/server/src/test/java/com/idea/ddm/ServerSmokeTest.java) |
| W | [W01–W10 contract](../contracts/ph1-boundaries.md#t043-web-qualification-contract), [actual Chrome harness](../../../tests/ph1/web-qualification/qualify-chrome.mjs) |

### Exact executed SHA and received disposition

Keys expand to the **full executed SHA**, not the review head. All received GPT Web reviews are
user-relayed read-only dispositions, not GitHub approval events or independent raw-log access.

| Run | Executed SHA | Evidence section / received external disposition |
|---|---|---|
| R0 | `4ec5471c6a8f8b05e0293b32b6194e1b904e16b6` | F03 §16–17: repaired initial HTTP/session, PASS WITH NOTES at `3fdf9f56238bb3f0b18ec5004143a699d0f9f27e`. |
| R1 | `0d740bddc09456f70753996a59dd5f585805d743` | F03 §18–19: first setup/v2, PASS WITH NOTES at `153d0258108cfe1fdc490d42d57f64aa9098e82f`. |
| R2 | `1e69ac61d2e8f53c742fd1041c36a5bf2c3bf142` | F03 §21–22: exact-login reset T046, PASS WITH NOTES at `281e46651e774b44a0b2e1c18fe30bd50a1f3151`. Historical T045/§20 at `976bd031913edb3e4554af6e23744a1dd55d8527` remains unchanged. |
| R3 | `b08709c581de195e05aea26450495cd593722059` | F03 §24–25: throttling/session transaction, PASS WITH NOTES at `74c2d3dbeabc38bc292f22220e358aaa5e0f46d3`. |
| R4 | `a0874f40555f1119b830f043a7aaf5bda8752d8a` | F03 §26–27: HTTP account administration, PASS WITH NOTES at `171173a5266fa5c9a732f2fe1316fb1c5c0f836d`. |
| R5 | `074f62ae713e7a1f627f7fb1bbe600e4e4d37296` | F03 §28: 3 restart + 76 HTTP + 20 F03-A + 2 health checks, 0 failures/errors/skips. Received restart PASS WITH NOTES at `0101cc3ae3fe09fd264d0a50fcd96ae3f9d407b0` is recorded in F03 §34; §28's pending review remains historical. |
| R6 | Qualification `738eb5ae05600b443ad2c107e1352de6dac45def`; packaged Web/Server `2fe89d481842f4cf26078c07d4b78fb3bdacd7c4` | F03 §32–33 and actual browser record: W01–W10 PASS, external PASS WITH NOTES at `24ecdf0c9d5246223837ba1c3b349b3005cb5be4`. |
| R7 | NOT-RUN; pin exact committed source only after gates below | T044 fresh public/data and final affected regression; external whole-card review PENDING. |

At inspection, `git diff 2fe89d4..b0e0e6d -- apps/server apps/web database/migrations` is empty.
Accepted Web evidence therefore needs no repeat merely for this documentation reconciliation.
R5 predates the T043 packaging/public-asset integration; it is historical regression, not a final
run of current packaged source. R7 must reconcile that difference rather than accumulate prior
test counts into a fictitious final run. If source changes affect accepted Web, assess/requalify
the affected W oracles before closure. The two Web harness next-use notes stay applicable before
reuse, not new implementation requirements for current accepted Web.

## 3. Requirement → implementation → executed evidence

### T040 session ownership and protected authority

| Acceptance requirement | Source | Test / oracle | Executed SHA key | Evidence section | External disposition | Final status |
|---|---|---|---|---|---|---|
| FR-005 / US3.3: ordinary Server session; verified, stable, server-derived Actor; no caller identity authority | S1/S2/S4 | H `realLoginRotatesSessionAndServerDerivesActorDespiteCallerSuppliedIdentity`, `anonymousSessionProbeIsRefusedWithoutActorOrLoginRedirect` | R0; affected R5 | F03 §16–17, §28 | Initial HTTP PASS WITH NOTES; final review PENDING | COVERED / FINAL PENDING |
| FR-005: session reference checks current Account version/status, revocation, runtime and deadlines | S2 `context/checkEligibility/requireEligible`, V4 | H idle/absolute, reset and account-transition cases below; P old-cookie refusal | R0/R2/R4/R5 | F03 §16, §21, §26, §28 | Scoped reviews received | COVERED / FINAL PENDING |
| US3 / HTTP contract: CSRF acquisition does not authenticate; login/logout require CSRF; no implicit Basic/public bootstrap/signup | S1/S4; bootstrap operator stays local | H `anonymousClientCanObtainCsrfProofWithoutIdentityPrivilege`, `loginRequiresCsrfAndWrongOrUnknownCredentialsRevealNoIdentity`; A/bootstrap evidence; W04 | R0/R5/R6 | F03 §11–14, §16–17, §28, §32–33 | F03-A accepted; initial HTTP and Web scoped reviews received | COVERED / FINAL PENDING |
| FR-005: protected owner paths use eligibility before permission and after security-write lock; accepted activity shares transaction | S2/S4/S5 | H `expiredSessionIsRefusedBeforeRoleOrScopeEvaluation`, `httpAdministrationRevalidatesSessionAfterWaitingForTheSecurityWriteLock`, accepted/refused activity and required-write cases | R1/R4; affected R5 | F03 §18, §26–28 | Setup/admin scoped PASS WITH NOTES | COVERED / FINAL PENDING; F04 race separate |
| FR-005: restart cannot adopt persisted authentication proof or rewrite identity/credential; fresh session pins new runtime | S2 runtime pin; ordinary servlet session in S1 | P process A→B on same endpoint/schema, metadata/identity digest and fresh-session assertions | R5 | F03 §28; receipt §34 | Restart PASS WITH NOTES | COVERED / FINAL PENDING; no HA/restoration claim |

### T042 scenario coverage

| Acceptance requirement | Source | Test / oracle | Executed SHA key | Evidence section | External disposition | Final status |
|---|---|---|---|---|---|---|
| FR-005 / SC-003: eligible logout revokes only current session, old proof refused; GET/bad CSRF cannot logout | S1 logout chain / S2 `signOut` | H `csrfProtectedLogoutInvalidatesOnlyCurrentSessionAndGetCannotLogOut`; W07 | R0/R5/R6 | F03 §16, §28, §32–33 | Initial HTTP and actual Web PASS WITH NOTES | COVERED for eligible logout / FINAL PENDING |
| Logout HTTP contract with expired/revoked/stale authentication | S1 logout handler / S2 `signOut`; no eligibility evaluator invocation in that method | Existing eligible logout and protected-session refusal are not exact negative-logout execution. Compare valid-CSRF POST logout for idle-expired, absolute-expired, revoked and stale-version proof, including HTTP outcome and accepted IAM/Audit effects | NOT-RUN for these exact logout profiles | Inspection baseline; concern below | No defect disposition yet | OPEN-COVERAGE; do not close T040/T042 from adjacent tests |
| US3.10 / SC-003: idle 2h and absolute 8h, before/at/after; eligible activity cannot extend absolute limit; servlet budget does not pre-empt | S1 config / S2 | H `effectiveServletSessionBudgetDoesNotPreemptIdeaPolicy`, `idleDeadlineRefusesExactlyTwoHoursAndLaterWithoutWaiting`, `activityCannotExtendEightHourAbsoluteDeadline`, `rejectedCsrfAndPublicTrafficCannotRefreshEligibleIdleActivity` | R0/R3; affected R5 | F03 §16, §24, §28 | Initial repair/throttling PASS WITH NOTES | COVERED / FINAL PENDING |
| US3.4/6/8: disable/re-enable preserves identity/history, no implicit access, every old session dead and fresh sign-in usable | S4/S7; session metadata S2 | H `httpDisableAndReenableKeepIdentityHistoryAndRequireFreshSigninForEveryOldSession`, `httpAccountTransitionsSupportZeroLoginIdentitiesWithoutCreatingOrSelectingALogin`, authority/refusal cases | R4/R5 | F03 §26–28 | HTTP administration PASS WITH NOTES | COVERED / FINAL PENDING |
| Issuer routes: expiry/disabled/re-enabled/revoked session refused before authority; explicit scope/version retained | S4/S5 / S2 eligibility seam | H `expiredIssuerSessionCannotIssueProofDespiteHavingV2Permission`, `disabledAndReenabledIssuerCannotReuseItsOldProofIssuanceSession`, `resetIssuanceRequiresExplicitV2ScopeEligibleSessionAndSyntheticOptIn`, `httpAdministrationRefusesDisabledReenabledAndRevokedIssuerSessionsWithoutLosingFreshAuthority` | R1/R2/R4; affected R5 | F03 §18, §21, §26, §28 | Corresponding scoped PASS WITH NOTES | COVERED for named profiles / FINAL PENDING; no new issuer protocol |
| FR-014 / US3.9: explicit v2 assignment; v1 unchanged; first setup target-bound/one-use/15m; pending account activates only on success | S5/S7 / V5 | H `accountAdministratorV2IsAnExplicitAuditedAssignmentWithoutRetargetingV1`, `explicitV2CanIssueFirstSetupAndProofHolderActivatesOnlyItsBoundAccount`, wrong-target/replay/exact-expiry/concurrent-redemption cases | R1; affected R5 | F03 §18–19, §28 | First setup PASS WITH NOTES | COVERED / FINAL PENDING; synthetic delivery only |
| SC-003 / reset clarification: exact Login Identity selector, two-login sibling preserved, Account-wide old-session invalidation; DISABLED reset is not re-enable | S5/S4 / V6 | H `resetRequiresExplicitLoginIdentityEvenWhenAccountHasOnlyOneLogin`, `resetExplicitSecondLoginChangesOnlyItAndInvalidatesEveryAccountSession`, `resetExplicitFirstLoginPreservesSecondCredentialAndRejectsReplay`, `disabledTwoLoginResetPreservesDisablementAndSiblingCredentialUntilSeparateReenable`, refusal/race/fault cases | R2; affected R5 | F03 §21–22, §28 | T046 PASS WITH NOTES | COVERED / FINAL PENDING |
| FR-014 / SC-003: minimum 15 code points, max 72 UTF-8 bytes; reject invalid/malformed input, no trimming | S5 verifier/setup/reset | H `newPasswordBoundsCountUnicodeCharactersAndUtf8BytesWithoutTrimming`, `malformedUnicodeCannotBecomeAReplacementCharacterCredential` | R1; affected R5 | F03 §18–19, §28 | First setup scoped review received | COVERED / FINAL PENDING |
| FR-014 / SC-003: rolling 15m window, fifth failure/block, exact boundary, no deadline extension, normalized-login/sibling independence | S6 | H `rollingWindowExcludesFailuresExactlyFifteenMinutesOld`, `blockDeadlineDoesNotMoveAndIsOpenExactlyAtAndAfterExpiry`, `normalizedAliasesShareFailuresButSiblingLoginsRemainIndependent`, concurrent fifth-failure and required-write cases | R3/R5 | F03 §24–25, §28 | T041 PASS WITH NOTES | COVERED / FINAL PENDING |
| FR-014: bounded existing-identity state; unknown identifiers create zero state; generic refusal and qualified refused-path password work | S6/S2 | H `unknownLoginSprayCreatesNoDurableStateOrInheritedFailures`, `pendingAndDisabledAccountsCannotClearFailuresOrBecomeEnabledThroughLogin`, `unknownDisabledAndBlockedLoginsDoNotBypassPasswordWork` | R3/R5 | F03 §24–25, §28 | T041 PASS WITH NOTES | COVERED / FINAL PENDING; not constant-time/DoS qualification |
| Session/sign-in, setup/reset and administration share required transaction fate; failures publish no partial success | S3/S4/S5/S6 | H missing session/IAM/Audit, suppressed clearing/revocation, concurrent proof use, Spring before/after-binding faults, deferred DB commit failure and admin fault cases | R1/R2/R3/R4; affected R5 | F03 §18, §21, §24, §26, §28 | Corresponding scoped reviews received | COVERED / FINAL PENDING; not servlet/DB XA |
| Restart preserves durable login block and identity/history; pre-revoked/idle-expired proof stays unusable | S2/S6 | P three executed restart cases, old-cookie state oracle and retained DB throttle digest | R5 | F03 §28; receipt §34 | Restart PASS WITH NOTES | COVERED / FINAL PENDING |
| Actual Web consumes ordinary session, CSRF, trusted HTTPS cookie contract and fails closed without retained secrets | S9 | W01–W10, actual headed Chrome/Server; no Java harness substitution | R6 | F03 §32–33; actual browser record | Accepted PASS WITH NOTES | T043-Web SATISFIED; whole-card review still pending |

### T044 final migration/data/regression obligations

| Acceptance requirement | Source | Test / oracle | Executed SHA key | Evidence section | External disposition | Final status |
|---|---|---|---|---|---|---|
| Completely new, initially empty test database; fresh public V1→V7, valid history/checksums and repeat zero/no pending | S8 / immutable V1–V7 | Initial catalog witness; D `freshVersionedMigrationAppliesOnceAndThenDoesNothing`; explicit Flyway validation/info and seven successful history entries | R7 | Future successor in F03 evidence, not old retained public data | PENDING | NOT-RUN; scoped tooling authorized, offline resolution pending |
| Distinct exact app/migrator; all expected migrated objects migrator-owned; app cannot obtain migration authority | S8 / migrations' grants/revokes | D privilege checks plus successor object/function inventory, owner and role-membership/SET ROLE/DDL/mutation denials below | R7 | Future T044 successor | PENDING | NOT-RUN; baseline 12-table assertion alone is insufficient |
| Bounded failed-DDL rollback, process/data health and affected identity/session/restart/F03-A regressions on final exact source | S1–S8 | D three data + one privilege + two health checks; H/P/A scoped runner, actual counts/skips retained; no arbitrary reuse of old results | R7 | Future T044 successor | PENDING | NOT-RUN; no forced RED if existing behavior is correct |
| Whole-card requirement coverage, external review and Project Reviewer acceptance | This matrix / card evidence | Every applicable row has exact source, executed oracle and disposition; excluded scopes remain visible | R7 plus identified inherited runs | Final matrix and review receipt | PENDING | F03-B IN_PROGRESS; Issue #24 OPEN |

### Logout concern: compare before changing

Source inspection confirms `signOut()` serializes and revokes its exact runtime/session row and
records accepted IAM/Audit, but does not call `checkEligibility/requireEligible`. The current HTTP
contract says valid CSRF and session; FR-005 refuses ineligible protected reuse. Existing tests
prove eligible logout and refusal on `/session`, not the exact negative logout profiles above.

Therefore **no defect is concluded in this revision**. First compare the governing contract and
those observable cases: determine whether logout is an explicitly permitted cleanup exception
or must refuse an ineligible session without accepted evidence. Do not invent an exception or
rewrite the contract to match code. If authority remains ambiguous, ask the Project Reviewer for
that narrow decision. If a requirement is demonstrably unmet, present/execute the bounded TDD
repair under the existing card before closure; do not add an unrelated client protocol.

## 4. T044 execution gate and procedure

### Tooling gate — AUTHORIZED FOR F03-B CLOSURE ONLY

The [exact build-tool intake](../../../docs/research/2026-10-01-t043-maven-web-build-intake.md)
admits internal T043 build/test only. Current `pom.xml` binds `exec-maven-plugin:3.6.3` to
`generate-resources`; `test/package` and both scoped runners invoke it. The plugin/transitive
custom-license gate remains BLOCKED-LEGAL outside that exception.

On 2026-10-01, before execution, the Project Reviewer approved the separate
[F03-B closure process exception](../../../docs/research/2026-10-01-f03b-closure-buildtool-exception.md).
It admits only the exact nine previously inventoried JARs for Issue #24 / PR #25 closure
T040/T042/T044 and necessary regression. Historical T043 intake is unchanged. This is not
legal approval, commercial clearance or authority for F04/F05/general development.

Before any closure Maven command, including logout qualification, verify all nine hashes and
the exact plugin runtime graph from the approved cache, then resolve offline. Missing artifacts,
hash/graph changes or any additional execution JAR are BLOCKED; do not download replacements.
Retain the preflight result before execution and check none of the nine enters `BOOT-INF/lib`.
Preserve actual Web packaging. Initial nine-artifact/descriptor preflight PASS is recorded in
the exception; complete offline lifecycle resolution, fresh migration and regression remain
NOT-RUN. This is an execution prerequisite, not a feature checkpoint.

### Procedure after tooling and coverage resolution

1. Pin the committed closure source and exact qualified execution path; record source/archive
   and artifact hashes, Java/PostgreSQL/build-tool versions and time. Verify credentials privately
   and exact distinct roles without printing them. No `mvn clean` or verifier invocation.
2. Resolve and record a new database name such as `idea_ddm_f02_f03b_closure_<run-id>` within the
   PostgreSQL identifier limit. The prefix satisfies current data-test guards; **it does not mean
   reuse the historical F02 database**. Refuse an existing database name. Create only that database
   with controlled least-privilege bootstrap; obtain the admin action through the approved operator
   path if required. No broad cleanup, Ubuntu restart or company/Vault writes.
3. Retain pre-migration witnesses: `current_database`, exact role identities, zero user tables/
   functions/history in its public schema. Set `IDEA_DATABASE_NAME` and
   `IDEA_F02_TEST_DATABASE_NAME` to the exact new database; never use the F02 runner's historical
   default. DataBaselineTest must perform the first migrate itself (expected seven), not encounter
   a schema already migrated by preparation. Record repeat zero. Retain seven successful Flyway
   history entries and explicit successful validation/no-pending result against packaged V1–V7;
   record SQL source/artifact hashes separately from Flyway checksums.
4. Authenticate the actual app connection as `idea_ddm_app`, migration as `idea_ddm_migrator`.
   Inventory every expected migrated table/function, including Flyway history and V2–V7 successors,
   and compare owners to the migration role. DatabasePrivilegeAssertions covers only 12 baseline
   tables; it cannot stand in for this full successor inventory. Check app is not superuser, has
   no DB/public CREATE or migration-role membership/SET ROLE authority; require actual schema/table
   DDL probes to fail with `42501`. Check protected role-definition/assignment/evidence/proof-binding
   mutation restrictions and permitted consumption columns against the exact migrations. Assert
   denials in rollback-controlled probes; never leave altered protected state or claim owner-only
   authority merely from a successful app SELECT.
5. Execute D data/privilege/health checks and bounded generated-schema rollback. Execute H/P/A
   and health affected regressions on the same committed closure source using the existing dedicated
   F03 database's test-owned UUID schemas. Disclose both database contexts: its retained public
   remains unchanged; it is not the fresh-public successor target. Read-only ownership/name checks
   precede any exact-owned schema cleanup; stop owned test JVMs before removal.
6. Retain commands, start/end time, counts/failures/errors/skips, controlled-time settings, role/
   database/schema witnesses and sanitized log hashes. A skipped/unrun suite is NOT-RUN. Append
   successor evidence; leave previous sources, §20/T045, T046 and accepted W evidence unchanged.
   Fill R7 and final row dispositions from actual results, not intended commands or prior sums.
7. Submit this whole-F03-B matrix and exact head to external review. Resolve actual findings,
   recheck affected source/results and then seek Project Reviewer whole-card acceptance. Issue #24
   stays open and F03-B IN_PROGRESS until that acceptance. Publication/merge and tracker completion
   remain separately authorized actions.

## 5. Current result and next action

Reconciliation is documented; T040/T042 have mapped historical source/test/evidence. Their
markers and shared T018/T020/T021/T022 remain unchecked while coverage disposition, T044 and
final review are pending. No Server/client/migration/tooling implementation changed here.

Open closure items: exact negative-logout coverage/contract disposition; pre-use tooling
artifact/cache verification under the scoped exception; fresh isolated V1–V7 and affected
regression; final external review and acceptance.
Desktop is not among the blockers. No matrix-driven defect has yet been established.

Documentation/source checks passed and are recorded in F03 evidence §35: 152 relative targets,
47 heading anchors, zero errors; historical §1–33 unchanged and no application/migration diff.
Maven, PostgreSQL,
browser, Desktop, verifier and merge were NOT-RUN in this reconciliation. Private host-log access
remains a disclosed limitation; recording a hash does not make it independent review.
