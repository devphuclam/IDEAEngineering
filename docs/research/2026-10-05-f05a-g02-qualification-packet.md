# G02 eligibility / allocation — controlled qualification packet

| Control | Value |
|---|---|
| Stable ID / class / version / status | IE-VEV-F05A-G02-20261005 / qualification packet / 0.1 / Draft |
| Owner / author / worker | Engineering / Codex / CODEX_ONLY |
| Reviewer / authority | Approved T028/T030 G02; execution NOT-RUN at publication |
| Normativity / instruction | Product INFORMATIVE / NOT-APPLICABLE |
| Date / timezone / retention | 2026-10-05 / Asia/Ho_Chi_Minh / INTERNAL, retain predecessor evidence |
| Upstream / downstream | [input freeze](2026-10-05-f05a-t028-t030-input-freeze.md), [G01 receipt](2026-10-05-f05a-g01-green-packet.md) → G02 / remaining G03–G06 |
| Supersession / trigger / tailoring | Successor qualification, no historical rewrite; drift STOP; STANDARD-GUIDED under IE-STD-AUTH-001, no conformity claim |

## Predeclared seam and expected outcome

Existing G01 production guards already implement eligible IAM context, exact mandatory owner
decision and eligible configured Vault. This is qualification of those previously implemented
guards; do not manufacture RED or production changes if the first execution is GREEN.
G01 regression plus two G02 test methods = expected **3/3 PASS**.

One fresh schema/one owned Server; fixture opens once and closes after all tests. Every sign-in
clears only the test client's cookie jar and establishes a fresh real HTTP principal. Negative
IAM fixtures mutate only synthetic records inside this owned schema, through migrator. Cover
anonymous, disabled account, revoked session, stale security version and current valid Actor
not meeting the owner's Organization requirement. Core's singleton operating Organization is
preserved: no fabricated second organization or caller-provided authority.

Owner tests cover wrong object, missing/ineligible configured Vault and explicit configured
Gateway-unavailable owner decision. The latter proves respecting the test-owned allocation
decision, not reaching or qualifying a real Gateway. Forged ActorId header/query is exercised
by the real session capture in every sign-in. No new role/permission or product endpoint.

Every refusal must be `GRANT_NOT_COMMITTED` with IAM/security-refusal cause (storage/fixture
failure cannot masquerade as refusal), and zero transfer/grant/Audit rows for that OperationId.
G01 still verifies unchanged full signed/persisted scope and zero accepted custody/event rows.
No production change in this successor; G03–G06 and migration regressions remain NOT-RUN.

## Published command / fresh target / guards

Exact pushed successor SHA and raw manifest are supplied to:

```bash
bash tests/ph1/f05-qualification/server-grant/run-g02-qualification.sh <source-sha> <manifest-sha256>
```

Owned target `/home/phuclam/idea-f05a-t028-t030-20261005-37/run-g02-qualification-01/source`;
only existing new database `idea_ddm_f05a_20261005_t028`, marked fresh `f05_<32lowerhex>`.
Same direct five offline goals/JDK/Maven/cache/rights/pins as G01; no dependency/POM/tool change.
Full local/transfer/remote hash checks before execution; actual observed cached inputs and source
rehash after. No credentials in Maven properties/environment or public evidence. Stop owned
Server before exact schema marker/owner cleanup; retain DB and all prior attempts.
STOP unexpected failures/drift/targets, preserve raw result and do not dynamically repair.
No public migration, Gateway/T029/T031/Receipt/T032+, preview/TLS, download/install, verifier,
timer/Tracker or merge; PR #38 Draft/Open; T028/T030/F05-A incomplete.
