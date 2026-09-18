# PH0 Readiness Register

**Increment**: `IE-INC-READY-001` — Technical Pilot Implementation Readiness
**Version / status**: `0.5` / Draft; author preparation through T020 recorded, readiness results remain `NOT-RUN`
**Prepared**: 2026-09-17
**Purpose**: Sổ theo dõi P01–P07 và bằng chứng cần có trước quyết định `PG4`.
**Authority**: [tasks.md](tasks.md) và các contract trong [contracts/](contracts/).
**Product boundary**: Không thay thế DOC-04, DOC-05 hoặc các quyết định Feature/Spec/Tech.

## 1. Cách đọc sổ

- `Task state` theo dõi tiến độ của PH0; `Gate Execution State` và `Gate Outcome` chỉ áp dụng
  cho PG4 và không được dùng thay cho nhau.
- Kết quả của một readiness check chỉ là `PASS`, `FAIL`, `BLOCKED` hoặc `NOT-RUN` khi có
  phương pháp, baseline và bằng chứng tương ứng.
- PG4 có `Gate Execution State`: `NOT-RUN`, `IN-PROGRESS`, `COMPLETE`. Trước khi có quyết định,
  `Gate Outcome` là `NOT-APPLICABLE`; khi hoàn tất, kết quả là `PASS`, `PASS-WITH-ACTIONS`,
  `FAIL` hoặc `BLOCKED` theo [PG4 contract](contracts/pg4-gate-record.md).
- `NOT-RUN` không có nghĩa là đạt. `BLOCKED` phải nêu rõ thứ còn thiếu, người xử lý và ảnh hưởng.

## 2. Control envelope

| Trường | Giá trị |
|---|---|
| Stable record ID | `IE-INC-READY-001-REG-001` |
| Owner / executor | Principal Product Author; tên người chịu trách nhiệm cụ thể `BLOCKED` trước khi review |
| Reviewer | Project reviewer; disposition `NOT-RUN` vì chưa có bản ghi review có thể truy nguyên |
| Historical P01 review input | `IE-INC-READY-001-BL-001` at `a2cb58961c9f264152ff7395c9158b78f3cfe224`; this is the immutable input for T006 and is not the current PH0 package baseline |
| Current PH0 package baseline | Source set analyzed at `ad49bbf67a291f542b6464532185f7d701a9f298`; includes the PH0 scenario, environment, data and recovery preparation plus the author-side T021 reconciliation |
| Approved product predecessor | `f269a0445737a7efd7f406ee51517149a8967afa`; the approved predecessor source remains separate from this PH0 planning package |
| Draft successor source set | The successor inputs and their exact hashes are listed in [baseline-manifest.md](baseline-manifest.md), Section 2; they are not approved by inclusion |
| Source/change trace | [IE-CHG-PH0-CORR-001](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-ph0-readiness-correction.md) |
| Evidence rule | Không ghi `PASS` nếu chưa có bằng chứng chạy trên đúng baseline |
| Retention | `INTERNAL`; giữ cùng increment PH0 |

## 3. Work-package status

| Work package | Mục tiêu ngắn | Task IDs | Owner | Due condition | Gate effect | Task state | Result | Evidence link | Blocker / deviation |
|---|---|---|---|---|---|---|---|---|---|
| `P01` | Ghim baseline đã duyệt và phân biệt successor | T004–T006 | Principal Product Author / project reviewer | Trước P02 | `BLOCKS_PG4` nếu chưa xác định được baseline | `IN-PROGRESS` | `NOT-RUN` | [baseline-manifest.md](baseline-manifest.md); `P01-BASELINE-001` (chưa thực thi) | T004–T005 hoàn tất ở cấp tác giả; T006 cần project reviewer ghi nhận disposition |
| `P02` | Chốt một canonical Technical Pilot scenario | T007–T011 | Principal Product Author / project reviewer | Sau P01 | `BLOCKS_PG4` | `NOT-RUN` | `NOT-RUN` | [canonical-scenario.md](canonical-scenario.md); [trace-matrix.md](trace-matrix.md) | Hồ sơ scenario đã chuẩn bị; P01 review và P02 walkthrough chưa chạy |
| `P03` | Ghi mọi quyết định và dependency còn mở | T012–T016 | Principal Product Author và authority tương ứng | Sau P01–P02 | `BLOCKS_PG4` hoặc `DEFERRED_SCOPE` theo từng dòng | `NOT-RUN` | `NOT-RUN` | Mục 5 dưới đây | Các decision record đã chuẩn bị; chưa có authority disposition |
| `P04` | Mô tả môi trường delivery được phép | T017, T021–T022 | Principal Product Author / QLHT khi cần | Trước P07 | `BLOCKS_PG4` nếu thiếu điều kiện bắt buộc | `NOT-RUN` | `NOT-RUN` | [environment-profile.md](environment-profile.md) | Profile đã chuẩn bị; host/license/secret review chưa chạy |
| `P05` | Chuẩn bị fixture và ma trận verification | T018–T019, T021–T022 | Principal Product Author / reviewer phù hợp | Trước P07 | `BLOCKS_PG4` nếu thiếu dữ liệu hoặc location cần thiết | `NOT-RUN` | `NOT-RUN` | [test-data-and-verification.md](test-data-and-verification.md) | Matrix đã chuẩn bị; fixture/hash/location chưa được provision |
| `P06` | Lập kế hoạch rollback, recovery và security review | T020–T022 | Principal Product Author / specialist reviewer | Trước P07 | `BLOCKS_PG4` nếu thiếu review material | `NOT-RUN` | `NOT-RUN` | [recovery-and-security-plan.md](recovery-and-security-plan.md) | Kế hoạch đã chuẩn bị; specialist review/restore chưa chạy |
| `P07` | Chuẩn bị và ghi quyết định PG4 | T023–T027 | Gate authority | Sau P01–P06 | Quyết định authorization của PH1 | `NOT-RUN` | `NOT-RUN` | `NOT-RUN` | Chưa tổ chức gate |

`Result` ở trên là kết quả readiness, không phải trạng thái hoàn thành task. P01 chỉ chuyển sang
`COMPLETE` sau khi T006 ghi nhận review và disposition; các work package còn lại vẫn ở trạng thái
khởi tạo `NOT-RUN`.

## 4. Open-decision and dependency index

Đây chỉ là mục điều hướng, không phải bản ghi quyết định thứ hai. P03 phải ghi đủ câu hỏi,
lựa chọn, khuyến nghị, due condition, reopen trigger và impact cụ thể theo
[decision-and-evidence-register.md](contracts/decision-and-evidence-register.md). Các bản ghi
`D0`–`D5` duy nhất nằm ở Mục 5; chúng là hồ sơ tác giả chuẩn bị, chưa phải authority disposition.

## 5. Decision records prepared for P03

| ID | Question / current state | Engineering recommendation and options/trade-offs | Accountable owner / authority | Due condition / closure evidence | Affected work / gate effect | Reopen trigger |
|---|---|---|---|---|---|---|
| `D0` | Successor Vault-transfer disposition: `OPEN`; current successor is Draft and exact PDA disposition `NOT-RUN`. | Keep predecessor approval separate; do not inherit the successor. Options: approve exact successor after review, revise it, or defer Vault successor while keeping approved baseline. | Product Decision Authority | Before P07/PG4; decision ID, date, exact source hashes and updated baseline manifest. | P01–P07; `BLOCKS_PG4`. | Any change to successor source, approval record or Vault architecture. |
| `D1` | Artifact Gateway and Format Worker runtime/toolchain/license/qualification: `OPEN` / runtime `UNKNOWN`. | Keep Gateway and Worker as separate boundaries. Select Worker boundary for Core v0, but do not select its runtime/toolchain until qualification. Options: qualify approved Windows toolchain, revise boundary, or defer format jobs. | Engineering + QLHT/Operations + applicable authority | Before P04/P05/P07; approved environment/profile, license intake and qualification evidence. | P03–P06; `BLOCKS_PG4` or `DEFERRED_SCOPE`. | Runtime, licensed application, adapter profile or deployment topology changes. |
| `D2` | Test identities and Vault locations/failure domains: `OPEN`. | Provision two native identities and at least two logical Vault locations only when QLHT/Operations confirms ownership and isolation. Do not infer independent humans or physical failure domains from names. | QLHT / Operations | Before P04/P05; attributable allocation, endpoint/location IDs, access evidence and failure-domain description. | P04–P06; `BLOCKS_PG4`. | Host, network, identity or storage topology changes. |
| `D3` | Specialist reviewer competence and independence: `OPEN`. | Name separate security, recovery/storage and verification reviewers; two identities controlled by one person are not independent-human review. | Project authority / applicable Quality or Security authority | Before P06/P07; named reviewer, scope, competence basis and review record. | P06–P07; `BLOCKS_PG4`. | Scope, reviewer availability or required assurance level changes. |
| `D4` | Multi-GB fixture provenance, digest, retention and disposal: `OPEN`. | Use synthetic, reproducible fixtures; do not commit real company files or unlicensed payloads. Options: qualify a generated large fixture, use a bounded smaller fixture with explicit deferral, or defer large-transfer execution. | Principal Product Author + data custodian | Before P05; dataset profile, generator/version, size/digest, retention/disposal and provenance record. | P05–P06; `BLOCKS_PG4` or `DEFERRED_SCOPE`. | Fixture generator, size, license, retention or test objective changes. |
| `D5` | External source/dependency/license intake: `OPEN`. | No import until exact source/version/license/commercial-use state is recorded. Unresolved source remains `REFERENCE-ONLY` or `BLOCKED-LEGAL`. | Principal Product Author + legal/company owner | Before any inclusion and before P07; completed [external-source-intake.md](../../docs/agents/external-source-intake.md) record and obligation review. | P03–P06; `BLOCKS_PG4`. | Source/version/license or commercial target changes. |

Engineering recommendations above do not close decisions. An authority must record the disposition
and the evidence in a later controlled change/review record.

## 6. Readiness-check index

| Check family | Planned checks | Method / baseline | Result | Evidence |
|---|---|---|---|---|
| P01 baseline | `P01-BASELINE-*` | Hash và authority record | `NOT-RUN` | `NOT-RUN` |
| P02 scenario | `P02-SCENARIO-*` | Walkthrough và trace review | `NOT-RUN` | `NOT-RUN` |
| P03 decisions | `P03-DECISION-*` | Register inspection | `NOT-RUN` | `NOT-RUN` |
| P04 environment | `P04-ENV-*` | Profile review | `NOT-RUN` | `NOT-RUN` |
| P05 dataset | `P05-DATA-*` | Fixture/matrix inspection | `NOT-RUN` | `NOT-RUN` |
| P06 recovery/security | `P06-RECOVERY-*`, `P06-SECURITY-*` | Procedure and reviewer-competence review | `NOT-RUN` | `NOT-RUN` |
| P07 gate | `P07-GATE-*` | Attributable authority decision | `NOT-RUN` | `NOT-RUN` |

## 7. T021 author-side cross-check

T021 đã hoàn tất ở cấp tác giả: các hồ sơ P04–P06 được đối chiếu với D0–D5 và mọi điều kiện
chưa có bằng chứng đều được giữ ở `BLOCKED`, `UNKNOWN` hoặc `NOT-RUN`. Việc này không đóng
decision, không tạo reviewer evidence và không chuyển readiness result sang `PASS`.

| Prerequisite | Source | Current evidence state | Decision / gate effect |
|---|---|---|---|
| Host allocation and network path | [environment-profile.md](environment-profile.md), Sections 1–2 | Server host, network path and exact allocation `BLOCKED` / `NOT-RUN` | D2 remains `OPEN`; P04/P05/P06 remain `NOT-RUN`; PG4 blocked if this is required for the selected pilot |
| OS, runtime and tool versions | [environment-profile.md](environment-profile.md), Section 2 | Baseline is a planning profile; installed versions and qualification evidence `NOT-RUN` | D1 remains `OPEN`; no runtime/toolchain is implied for the Format Worker |
| License and external-source intake | [environment-profile.md](environment-profile.md), Section 2; D5 | Exact license/usage evidence `BLOCKED` until intake and company/legal review | D5 remains `OPEN`; no external asset may be included by assumption |
| Test identities | [test-data-and-verification.md](test-data-and-verification.md), Section 2; D2 | Synthetic identity profiles are defined; allocation and access evidence `BLOCKED` / `NOT-RUN` | D2 remains `OPEN`; two profiles do not imply two independent humans |
| Vault locations and failure domain | [test-data-and-verification.md](test-data-and-verification.md), Section 3; D0/D2 | `VAULT-LOC-A/B` are logical candidates; exact topology, isolation and failover `UNKNOWN` / `BLOCKED` | D0 and D2 remain `OPEN`; no multi-location guarantee is claimed |
| Dataset, provenance and retention | [test-data-and-verification.md](test-data-and-verification.md), Sections 1 and 5; D4 | Synthetic fixtures are specified; generation, digest, retention and disposal evidence `NOT-RUN` | D4 remains `OPEN`; P05 remains `NOT-RUN` |
| Secret/configuration ownership | [environment-profile.md](environment-profile.md), Section 3 | Owner and approved handling path still require confirmation; `NOT-RUN` | P04 remains `NOT-RUN`; no secrets are requested or stored in this package |
| Specialist reviewer competence and independence | [recovery-and-security-plan.md](recovery-and-security-plan.md), Section 4; D3 | Reviewer names, scope and competence evidence `BLOCKED` | D3 remains `OPEN`; P06 remains `NOT-RUN` |
| Backup, restore and rollback | [recovery-and-security-plan.md](recovery-and-security-plan.md), Sections 2.4–2.5 | Procedure is prepared; execution and restore evidence `NOT-RUN` | P06 remains `NOT-RUN`; no recoverability claim is made |
| Security review and abuse cases | [recovery-and-security-plan.md](recovery-and-security-plan.md), Section 3 | Threat/control plan is prepared; specialist review and runtime evidence `NOT-RUN` | P06 remains `NOT-RUN`; D3 remains `OPEN` |
| Artifact Gateway / Format Worker qualification | [environment-profile.md](environment-profile.md), Section 2; D1 | Worker boundary is selected for Core v0; exact runtime/toolchain/license qualification `NOT-RUN` | D1 remains `OPEN`; no deployment choice is implied |

**T021 disposition:** `COMPLETE` as an author-side reconciliation only. P04, P05 and P06
readiness results remain `NOT-RUN`; D0–D5 remain `OPEN`; no prerequisite is presented as closed.

## 8. T006 review evidence and human action

| Field | Recorded value |
|---|---|
| Check ID | `P01-BASELINE-001` |
| Exact input baseline | `IE-INC-READY-001-BL-001`; current repository commit `a2cb58961c9f264152ff7395c9158b78f3cfe224` |
| Exact manifest hash | `SHA-256 21F6E196E7786924BF5B9A20C377F9B3BA5E9D6C7AAC7FAC8020EB1001E09B93` |
| Reviewer / date | Project reviewer / `NOT-RUN` — no attributable review record exists in the repository |
| `BL-DISC-001` disposition | Author reconciliation: later attributable approval record governs the exact predecessor; historical status prose is retained. Reviewer confirmation: `NOT-RUN`. |
| `BL-DISC-002` disposition | Successor sources remain separate Draft inputs; exact Product Decision Authority disposition is still `NOT-RUN` and tracked as `D0`. |
| `BL-DISC-003` disposition | Appendix A@0.6 contains the author correction under `IE-CHG-PH0-CORR-001`; reviewer confirmation that the planning discrepancy is acceptable remains `NOT-RUN`. |
| Result | `NOT-RUN` — this is not P01 acceptance and does not approve any successor. |
| Required human action | Project reviewer must inspect the manifest, approval record, Appendix A@0.6 and the three discrepancy dispositions, then record reviewer identity, date, exact manifest hash and `PASS`, `FAIL` or `BLOCKED` with evidence. |
| Gate effect | Until that action is recorded, P01 remains `IN-PROGRESS`, its readiness result remains `NOT-RUN`, and `PG4` cannot be decided. |

## 9. Review handoff preparation

Các mục dưới đây đã được chuẩn bị để reviewer dùng khi thực hiện T011, T016, T022 và T031.
Chúng không thay thế review hoặc runtime evidence.

| Review task | Prepared source identity | Reviewer state | Required action |
|---|---|---|---|
| T011 — scenario walkthrough | `canonical-scenario.md` SHA-256 `1704BBA06BA13CD31310D624E6705450FAC99F0C87D6751D4EE803AF22E22134`; `trace-matrix.md` SHA-256 `DF62D919A965D81205631291B2ED1465C4A41D511B9E8D809399617ECF75F7E1` | `NOT-RUN` | Project reviewer walks the normal, no-change and negative paths and records attributable disposition |
| T016 — decision review | Mục 5, `D0`–`D5`, analyzed package baseline `ad49bbf...` | `NOT-RUN` | Authority records one disposition per decision with ID, date, baseline, evidence and reopen trigger |
| T022 — P04/P05/P06 result review | `environment-profile.md` SHA-256 `D0EFD96FA8D857398E199FCC72F4961C9F2149D00DBA803E3C75D149E0779A07`; `test-data-and-verification.md` SHA-256 `5EF6F8D9F31FA62FEFE5E4C8BFDB39058E50309F71542ED460AD54756E39E07`; `recovery-and-security-plan.md` SHA-256 `F9950E46CB39C49EC8D3E584D79B330450799927ED0394EBAE9A4C2D0B87CBA8` | `NOT-RUN` | Reviewer records separate P04, P05 and P06 outcomes; missing prerequisites stay `BLOCKED`/`NOT-RUN` |
| T031 — checklist review | [readiness checklist](checklists/readiness.md), all unchecked items; analyzed package baseline `ad49bbf...` | `NOT-RUN` | Project reviewer evaluates unchecked items; checklist approval is quality evidence only and cannot authorize PG4 |

## 10. Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-17 | Initial PH0 register; all work packages and checks initialized `NOT-RUN`. | T001 |
| 0.2 | 2026-09-17 | Ghi nhận T001–T005 hoàn tất ở cấp tác giả; P01 vẫn `IN-PROGRESS`, readiness result và reviewer disposition vẫn `NOT-RUN`. | T004–T005; T006 còn mở |
| 0.3 | 2026-09-18 | Hoàn tất phân tích chéo và remediation A1–A6; các readiness result P01–P07 không thay đổi. | T028–T030; [analysis-findings.md](analysis-findings.md) |
| 0.4 | 2026-09-18 | Chuẩn bị hồ sơ T006 với manifest hash, disposition của BL-DISC-001…003 và hành động reviewer; không tự ghi nhận review hoặc PASS. | `P01-BASELINE-001`; T006 vẫn mở |
| 0.5 | 2026-09-18 | Chuẩn bị canonical scenario, trace cụ thể, P03 decision records và hồ sơ P04–P06; không chuyển readiness result khỏi `NOT-RUN`. | T007–T010, T012–T015, T017–T020 |
| 0.6 | 2026-09-18 | Tách baseline lịch sử T006 khỏi baseline gói PH0 hiện tại; bỏ bảng D0–D5 trùng; ghi T021 cross-check và chuẩn bị các handoff review nhưng giữ nguyên `NOT-RUN`/`OPEN`. | T021; [IE-ANALYSIS-PH0-002](analysis-findings-002.md) |
