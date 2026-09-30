# F03 Identity Results — Bootstrap Checkpoint

| Control field | Value |
|---|---|
| Stable Evidence ID / class | `IE-VEV-PH1-F03-001` (new F03 record) / verification record |
| Version / status | 0.1 / Draft |
| Product normativity | INFORMATIVE; no changed product requirement or gate |
| Owner / author | Engineering / Codex, assisting the Project Reviewer |
| Reviewer / acceptance authority | Project Reviewer; checkpoint review and F03-A acceptance pending |
| Evidence date | 2026-09-30, Asia/Ho_Chi_Minh |
| Applicable baseline | PH1 F03-A; source `2acf4dafeb19e52e36d8aa9c280b033ac20be56a` |
| Upstream trace | [Work Item #22](https://github.com/devphuclam/IDEAEngineering/issues/22), [PH1 tasks](../tasks.md), DOC-04 REQ-IAM-007 / REQ-AUTH-009, DOC-05 ARCH-VIEW-SEQ-008, [ADR-0012](../../../docs/adr/0012-use-principal-role-scope-rbac.md) |
| Downstream trace | F03-A service implementation and later card acceptance; F03-B remains unimplemented |
| Classification / retention | INTERNAL; retain with F03 source and acceptance evidence |
| Change / supersession | First checkpoint; no predecessor or superseded result |
| Review trigger | Bootstrap, migration, password encoder, account-administration or test-scope change |
| Evidence status | Six bootstrap tests and two existing Server smoke tests executed and passed; not whole-card PASS |

Tailoring: use the repository authoring standard's verification fields, guided by
ISO/IEC/IEEE 15289:2019, ISO 10007:2017 and the selected ISO/IEC/IEEE 29119 evidence approach.
No conformity claim. This new card-scoped evidence ID remains independent of its existing
Spec Kit path; it is not an added Core Product Document, architecture view or product requirement.

## 1. Exact scope and preconditions

The Project Reviewer approved the F03-A service test boundary on 2026-09-30. This checkpoint
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
IAM owner outcome and append-only required evidence. The remaining account-administration
part of V2 is still pending; this checkpoint has not deployed V2 to the development/public schema.

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

## 4. Limits and next work

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
