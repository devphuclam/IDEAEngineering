# Phiên bản và nguồn của Feature / Spec / Tech

Ngày cập nhật: 25-09-2026. Bộ tài liệu: IDEA-C1-ANALYSIS-DESIGN-001.

Đây là sổ tra cứu phiên bản, nguồn, review nội bộ và quyết định Feature/Spec/Tech. Không phải báo
cáo kiểm thử hoặc một nguồn yêu cầu mới.

## 0. Quyết định của Product Decision Authority ngày 17-09-2026

Người dùng dự án xác nhận sếp, với vai trò `Product Decision Authority`, đã duyệt toàn bộ nội dung
Feature, Spec và Tech được trình trong gói Management Review ngày 16-09-2026. Quyết định được ghim
vào commit `f269a0445737a7efd7f406ee51517149a8967afa` và các SHA-256 cụ thể tại
[`IE-CHG-PDA-APPROVAL-001`](../registers/CHG-2026-09-17-product-decision-authority-approval.md).

| Trục quyết định | Baseline được duyệt | Kết quả |
|---|---|---|
| Feature | FEATURE-001@0.12 đọc cùng nguồn hiện hành trong gói review; 14 nhóm Feature | `APPROVED` |
| Spec | DOC-04@0.13, 87 dòng yêu cầu có mã; DOC-06@0.16, DOC-08@0.12 và VVP@0.16 là nguồn hỗ trợ | `APPROVED` |
| Tech | TECH-001@0.14, IE-KNW-TECH-DEC-001@0.6 và IE-ARC-TECH-VIEW-001@0.2 | `APPROVED` |

Gói trình bày thể hiện trạng thái `NOT-RUN` trước khi sếp ra quyết định và được giữ nguyên như bằng
chứng lịch sử. Quyết định này không đổi kết quả kiểm thử, Q-15 (`PARTIAL / NO WINNER`), qualification
của Format Worker, PG3 hoặc PG4. Các bản `Approved 1.0` dành cho quản lý vẫn phải được xuất bản có
kiểm soát từ đúng baseline trên.

### Successor Draft sau quyết định

Sau khi baseline trên được duyệt, phản hồi quản lý ngày 17-09-2026 yêu cầu Vault hỗ trợ nhiều nơi
lưu và không buộc toàn bộ byte file lớn đi xuyên qua tiến trình Server. Successor Draft tách control
plane khỏi data plane, dùng scoped Artifact Gateway và cho phép một Artifact có nhiều location đã
xác minh. Bộ nguồn Vault successor ban đầu là DOC-04@0.14, DOC-05@0.21, DOC-06@0.17,
DOC-07@0.14, DOC-08@0.13, VVP@0.17, TECH-001@0.16 và technology view set@0.5. Đây là mốc lịch sử,
không phải danh sách phiên bản hiện hành.

Successor này giữ nguyên 14 Feature groups, Q-15, Product Scope, PG3 và PG4. Node.js 24 LTS được PDA
duyệt riêng cho Web build ngày 23-09-2026 theo
[`IE-CHG-TECH-NODE24-001`](../registers/CHG-2026-09-23-node24-web-build-baseline.md); exact Web build
vẫn `NOT-RUN`. Các phần successor khác không tự kế thừa PDA approval của exact predecessor. Exact
Gateway runtime/toolchain/provider, topology, durability thresholds và runtime evidence đều
`NOT-RUN` hoặc `BLOCKED` như ghi trong từng nguồn. Xem
[`IE-CHG-VAULT-XFER-001`](../registers/CHG-2026-09-17-multi-location-vault-transfer-architecture.md).

### Successor Draft — Approval Policy self-approval

Theo hướng đã chốt, successor tách quyền đủ điều kiện RBAC khỏi quy tắc Approval Policy Version.
`AllowSelfApproval` mặc định tắt; policy mới có thể bật rõ ràng nhưng không tự cấp `Approve`, không
vượt policy khác yêu cầu người độc lập và không cấp `Release`. Review Round ghim đúng Workflow
Definition Version và Approval Policy Version; kết quả tự duyệt được ghi riêng trong Audit.

Ở lần hiệu chỉnh Approval Policy, các nguồn successor là DOC-04@0.15, DOC-05@0.22,
DOC-06@0.18, VVP@0.18 và SPEC-001@0.15.
Thay đổi này giữ nguyên 14 Feature groups, Tech Stack, Q-15, Product Scope, PG3 và PG4. PDA đã duyệt
riêng policy correction này ngày 19-09-2026; các phần successor khác và toàn bộ procedure vẫn
`NOT-RUN`; xem
[`IE-CHG-APPROVAL-POLICY-001`](../registers/CHG-2026-09-19-approval-policy-self-approval.md).
Bằng chứng quyết định được ghi tại
[`IE-CHG-PDA-APPROVAL-002`](../registers/CHG-2026-09-19-pda-approval-approval-policy.md).

Bộ nguồn successor hiện hành tại ngày cập nhật sổ này là DOC-04@0.15, DOC-05@0.25,
DOC-06@0.18, DOC-07@0.17, DOC-08@0.13, VVP@0.19, TECH-001@0.16 và technology view set@0.5.
Mỗi nguồn vẫn giữ trạng thái kiểm soát, qualification và approval riêng; việc có tên trong danh
sách hiện hành không tự tạo kết quả kiểm thử hoặc quyết định duyệt mới.
DOC-05@0.23 chỉ làm rõ sơ đồ quay lui/phục hồi theo
[`IE-CHG-P06-DIAGRAM-001`](../registers/CHG-2026-09-24-p06-recovery-diagram-clarification.md);
P06 review, diễn tập phục hồi và PDA approval cho exact successor này vẫn `NOT-RUN`.

### Quy tắc phạm vi Check-in được duyệt ngày 25-09-2026

Sếp duyệt đủ ba nhánh của `ARCH-VIEW-ACT-004`: không xác định được file phụ thuộc thì chặn
Check-in; file bắt buộc đã sửa nhưng chưa Checkout thì chặn toàn bộ lượt Check-in; file đã sửa
nhưng được xác định là không bắt buộc thì loại khỏi phạm vi gửi và yêu cầu xác nhận lại phạm vi.
Quyết định ghim vào DOC-05@0.24 và hình trước duyệt trong
[`IE-CHG-PDA-APPROVAL-003`](../registers/CHG-2026-09-25-pda-approval-checkin-scope.md).
DOC-05@0.25 cập nhật nhãn theo quyết định; VVP@0.19 thêm WS-09…11 để thử. Chưa có kết quả chạy
phần mềm hay duyệt toàn bộ kiến trúc.

## 1. Bản làm việc hiện tại

| Tài liệu | Phiên bản hiện tại | Trạng thái |
|---|---|---|
| [Feature](FEATURE-001-feature-definition-and-scope.md) | FEATURE-001@0.12 | Working brief vẫn `Draft` và source-pin stale; quyết định 14 nhóm Feature `APPROVED` theo baseline 17-09; bản `Approved 1.0` chưa xuất bản |
| [Spec](SPEC-001-product-specification.md) | SPEC-001@0.15 | Successor brief tách RBAC khỏi Approval Policy; policy correction `APPROVED` theo `IE-CHG-PDA-APPROVAL-002`; các phần successor khác vẫn `NOT-RUN` |
| [Tech](TECH-001-technology-and-architecture-proposal.md) | TECH-001@0.16 | Current successor brief dùng Node.js 24 LTS cho Web build theo quyết định PDA ngày 23-09-2026; exact Web build vẫn `NOT-RUN`; các successor khác giữ authority state riêng; Flutter/Q-15 không đổi |

Feature 0.12 giữ nguyên 14 mã FTR. Normative DOC-04@0.13 được duyệt có 87 dòng yêu cầu. Successor
DOC-04@0.15 có 90 dòng yêu cầu sau khi thêm scoped direct Gateway transfer, multi-location
custody/replication và policy-controlled self-approval clarification. VVP 0.19 có 17 mục tiêu cùng
các bộ PA/RBAC/WS/ST; mọi kết quả sản phẩm vẫn `NOT-RUN`. DOC-01 ở Draft 0.7, DOC-02 ở Draft 0.2,
DOC-03 ở Draft 0.7, DOC-04 ở Draft 0.15, DOC-05 ở Draft 0.25, DOC-06 ở Draft 0.18, DOC-07 ở Draft
0.17, DOC-08 ở Draft 0.13, coverage GOV ở Draft 0.3 và future-commercial GOV ở Draft 0.1. Lịch
56 task/756 giờ cũ được giữ trong Git history. Kế hoạch hiện hành là
`IE-PLAN-DEC2026-003@0.2`: 35 work package, 53 Delivery Card, 512 giờ công việc, 88 giờ dự phòng kỹ
thuật và 32 giờ đệm vận hành. Mốc 31/12 là đợt review Core v0 dùng nội bộ, không phải rollout rộng
hoặc phát hành thương mại. Approval của predecessor không tự chuyển sang toàn bộ nội dung
successor.

**Lưu ý nguồn ngày 05/09/2026:** Feature 0.5 từng ghim DOC-07@0.3. Chuỗi tham chiếu hiện hành đã
được đồng bộ trong lần 09/09/2026; việc đồng bộ nguồn không phải quyết định duyệt tính năng. Các
bản Word đã nộp không bị sửa hoặc tự chuyển thành rendition của các bản Markdown mới.

**Lưu ý nguồn ngày 09/09/2026:** Feature 0.12, Spec 0.14, Tech 0.8 và DOC-07@0.5 đã ghim các nguồn
hiện hành sau các điểm làm rõ ngày 07/09. Đây là thay đổi dẫn chiếu; không đổi hành vi, lựa chọn công
nghệ, lịch, kết quả review hoặc trạng thái quyết định. Các bản Word/Human đã nộp được giữ nguyên.

## 2. Bản được giữ lại

| Bản lịch sử | Tình trạng tại lúc giữ lại | Cách sử dụng |
|---|---|---|
| [FEATURE-001@0.2](FEATURE-001-feature-definition-and-scope.v0.2.md) | Proposed; đã được anh review; sếp chưa quyết định Feature | Dùng để xem lại nội dung được review trước đây. Không chuyển kết quả đó sang Feature 0.3. |
| [SPEC-001@0.3](SPEC-001-product-specification.v0.3.md) | Draft; anh đã rút đồng ý và yêu cầu viết lại cấu trúc Spec | Không sử dụng như Spec đã được duyệt. Bản lưu giữ cả thông tin rút đồng ý. |

Hai bản lịch sử được sao chép nguyên nội dung trước khi biên tập. Các liên kết tương đối bên trong
vẫn được giữ; khi một liên kết trỏ đến tên file hiện hành, phải đọc kèm phiên bản được nêu trong
bản lịch sử và bảng này, không mặc nhiên coi bản mới là nội dung đã được review lúc trước.

### Bản trình trước khi ghi nhận lời duyệt

| Bản đã được xem xét | Mục đích giữ lại |
|---|---|
| [FEATURE-001@0.3 — bản trình](FEATURE-001-feature-definition-and-scope.v0.3-review-input.md) | Giữ đúng nội dung anh đã duyệt; trạng thái “chờ review” trong bản chụp là trạng thái lúc trình, trước xác nhận tại mục 5. |
| [SPEC-001@0.4 — bản trình](SPEC-001-product-specification.v0.4-review-input.md) | Giữ đúng 61 yêu cầu và tám điểm còn mở tại thời điểm anh duyệt; không biến điểm còn mở thành đã giải quyết. |

Tại lần ghi nhận review Feature 0.3 / Spec 0.4, chỉ phần thông tin review được cập nhật; không đổi
nội dung tính năng, yêu cầu, điều kiện kiểm tra hoặc điểm còn mở. Các dấu kiểm tra dưới đây thuộc
lần ghi nhận lịch sử đó. Bản sau review được giữ nguyên trong archive ở mục 6; file hiện hành đã có
nội dung mới và dấu kiểm tra riêng tại mục 7.

### Dấu kiểm tra nội dung

| Bản tài liệu | SHA-256 tại lần ghi này |
|---|---|
| FEATURE-001@0.2 — bản lưu | ec7c4fc1764123c9bcaadc612e9154f874326e8ead6482d2ebf2b11606b92612 |
| SPEC-001@0.3 — bản lưu | 1bd4a1c5798127d35fe4169aeeeffd6cade061643ff92681653a59d5a403533a |
| FEATURE-001@0.3 — bản trình được duyệt | 30f144b3071abd106709a0073276c330d2e72f194dcac24204815b6525cf5e6a |
| FEATURE-001@0.3 — sau ghi nhận review | 4d222a4df8cf2b0fbdca5c3bbfa9bcab9a3089fac71d83b7839c8fb9cb470772 |
| SPEC-001@0.4 — bản trình được duyệt | 368460c04131cbe5660dc58c0e8d150073a6813b6a47f6472f2887b3fdd9db6a |
| SPEC-001@0.4 — sau ghi nhận review | b8859ff45c2b76da751d981ac42a7d9d03b84bac86b75250c3e5ea19ce2a3ccd |

Dấu kiểm tra của các bản lưu khớp với nội dung trước lần biên tập hoặc ghi nhận review tương ứng.
SHA-256 chỉ giúp xác định
đúng nội dung và phát hiện thay đổi, không chứng minh tài liệu đã được review hay phần mềm đã đạt.

## 3. Nguồn lịch sử của Feature 0.3 và Spec 0.4

Các nguồn bên dưới là nội dung Draft 0.1 đã dùng khi viết Feature 0.3 / Spec 0.4. Chúng được giữ
nguyên tại lần review ở mục 5. Đường dẫn trong bảng chỉ để tra cứu tên tài liệu: hiện nay đường dẫn
đó mở bản mới. Muốn xem đúng nội dung lịch sử, lấy file cùng đường dẫn trong archive ở mục 6 và
đối chiếu SHA-256; không coi bản mới là nguồn đã được review lúc trước.

| Nguồn | Mã / phiên bản | Được dùng cho | SHA-256 |
|---|---|---|---|
| [DOC-01](../DOC-01-product-vision-and-scope.md) | IE-PROD-VISION-001@0.1 — Draft | Feature | b9e67ad05b9f37dfdb560a1fc684ff84b53065b98fd945e553721146de2a0786 |
| [DOC-02](../DOC-02-feasibility-and-options-assessment.md) | IE-PROD-FEAS-001@0.1 — Draft | Feature | 70bd0176660a0b81ee0374435b6fc2e8a9a9a8a1087d5322e3335325576f01b1 |
| [DOC-03](../DOC-03-business-requirements.md) | IE-PROD-BREQ-001@0.1 — Draft | Feature; Spec | 9f7329b3d10e25308b4cd68f13d0fd7c40d8bf175355328af6984ec4ef592bcf |
| [DOC-04](../DOC-04-software-requirements-specification.md) | IE-PROD-SREQ-001@0.1 — Draft | Spec — nguồn 61 mã REQ; liên kết FTR → REQ của Feature | 5c722590d08e6dbdf841aef1c4cf5d99042093e221d8890630c610bea8b8e3a3 |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | IE-PROD-DATA-001@0.1 — Draft | Spec — dữ liệu và giao tiếp | 35f8c9ac3b97981e8260c36f51b4a8553914c6cd68bd8457d46c1f91faa6ea38 |
| [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md) | IE-PROD-ROADMAP-001@0.1 — Draft | Feature | 7672b4e71a112ec05e7f9d56fc1a7a61f2121edf9acb3fae044482d48483de75 |
| [DOC-08](../DOC-08-ui-ux-and-interaction-specification.md) | IE-PROD-UX-001@0.1 — Draft | Spec — giao diện và ngôn ngữ | cad6bcfdf2917cd5b65c0ee15b05e18c4eb880190b3d80015616cb0c0f6b0916 |
| [GOV](../registers/GOV-material-and-behavioral-coverage.md) | IE-GOV-COVERAGE-001@0.1 — Draft | Feature | 0e8c0ddba8eb5058af718ceab34fd8896cf72f1b07ef28a9d6d38bf3084a7f68 |
| [VVP](../registers/VVP-core-v0-verification-validation-plan.md) | IE-VVP-CORE-001@0.1 — Draft | Spec — kế hoạch kiểm tra | e1c7c30d457504d21bc7eee6547962165ed33fe98771a79afdbecb20ad0a037e |
| [CONTEXT.md](../../../../../CONTEXT.md) | Bản làm việc ngày 03-09-2026; không tự gán Document Version | Thuật ngữ, ranh giới sản phẩm và làm việc offline trong Spec | d1edce5278ee732bbc4a2b88719be4c270f50e2f34b8d9f6be3a5135025b4bcd |

Feature 0.3 kế thừa mã FTR từ Feature 0.2 (bản lưu có dấu kiểm tra tại mục 2), đối chiếu nhu cầu/quy
tắc nghiệp vụ ở DOC-03 và trace ở DOC-04. Spec 0.4 còn phụ thuộc phạm vi FEATURE-001@0.3; dấu kiểm
tra của Feature cũng nằm tại mục 2.
Không có nguồn trong bảng này được đổi trạng thái sang Approved.

## 4. Các tham chiếu cũ tại thời điểm review Feature 0.3 / Spec 0.4

Tại thời điểm review, DOC-03 và DOC-07 bản 0.1 vẫn có dòng nói FEATURE-001@0.2 đã qua self-review;
một số nguồn khác còn tham chiếu SPEC-001@0.3. Những dòng đó chỉ áp dụng cho phiên bản lịch sử,
không xác nhận mức sẵn sàng của Feature 0.3 hoặc Spec 0.4. Các nguồn hiện hành đã được đồng bộ ở
mục 6–7.

Tại lần ghi nhận review ở mục 5, DOC-01…08, GOV, VVP, Tech, prototype, CONTEXT.md và các file
Spec Kit không bị sửa. Khi đó chỉ cập nhật trạng thái review, dấu kiểm tra và điều hướng của các
bản trình. Lần bổ sung bối cảnh Tech sau đó đã cập nhật các nguồn được liệt kê ở mục 6–7; những
mô tả trạng thái cũ nói trên không còn là chỉ dẫn cho bản hiện hành.

Trước khi trình một bộ tài liệu để quyết định:

1. Review nội bộ hai bản đã được ghi nhận tại mục 5. Tiếp tục giải quyết hoặc ghi quyết định có
   điều kiện cho các mục còn mở đúng phạm vi và thẩm quyền; không tự ghi điểm chưa giải quyết là đạt.
2. Nếu nội dung thay đổi yêu cầu hoặc phạm vi, cập nhật tài liệu nguồn, phiên bản và liên kết theo
   quy trình kiểm soát; không chỉ sửa riêng bản trình sếp.
3. Đồng bộ các dòng chỉ trạng thái/phụ thuộc cũ trong DOC-03/04/05/07 và các nguồn liên quan.
4. Ghim lại đúng phiên bản/nội dung, ghi người review và quyết định Feature → Spec → Tech.
5. Khi nguồn đổi, đánh dấu bản trình cần đối chiếu lại; không giữ nguyên kết quả duyệt của nội dung cũ.

Việc có đủ bản nháp không cho phép bắt đầu production code hoặc sử dụng hệ thống thật.

## 5. Ghi nhận review nội bộ ngày 03-09-2026

| Trường | Nội dung ghi nhận |
|---|---|
| Mã ghi nhận | RVW-FEATURE-SPEC-20260903-001 |
| Người review | Người dùng dự án — reviewer nội bộ đã được phân công; không ghi nhận như người duyệt độc lập hoặc Product Decision Authority |
| Ngày ghi nhận | 03-09-2026 |
| Xác nhận trực tiếp | “ok con dê duyệt nha” |
| Tài liệu được duyệt | FEATURE-001@0.3 và SPEC-001@0.4, đúng hai bản trình đã lưu tại mục 2 |
| Phạm vi / kết quả | PASS — chấp thuận hai bản thảo trong review nội bộ; không phải kết quả kiểm thử sản phẩm hoặc kết luận mọi yêu cầu đã đủ điều kiện triển khai |
| Điểm còn mở | SPEC-OPEN-01…08 giữ nguyên; không tự đóng, không tự bổ sung giá trị hoặc bỏ điều kiện |
| Quyết định của sếp | Feature và Spec vẫn NOT-RUN; lời duyệt này không được ghi thay quyết định của sếp |
| Phần không nằm trong xác nhận | Tech, review độc lập/chuyên môn, kiểm thử, các gate và cho phép viết production code hoặc sử dụng thật |
| Thay đổi khi ghi nhận | Chỉ cập nhật thông tin review và điều hướng/hashes; giữ nguyên phiên bản nội dung, danh mục tính năng, yêu cầu và điều kiện kiểm tra |
| Lịch sử trước đó | Không kế thừa review FEATURE-001@0.2; không phục hồi lời đồng ý đã rút đối với SPEC-001@0.3 |

Dấu kiểm tra của bản trình được duyệt và của file sau khi cập nhật review được ghi tách biệt tại
mục 2. Mọi thay đổi nội dung sau xác nhận này cần được đối chiếu và review cho đúng phiên bản mới;
không dùng lời duyệt hiện tại cho một nội dung được sửa sau đó.

## 6. Bổ sung bối cảnh và đề xuất Tech ngày 03-09-2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-TECH-001@0.1](../registers/CHG-2026-09-03-tech-context-and-proposal.md) |
| Nguồn bối cảnh | Tám nhóm câu trả lời của anh, kết thúc bằng xác nhận “Duyệt”; chi tiết và giới hạn ghi tại TECH-CTX-001…008 |
| Phạm vi được xác nhận | Windows ở máy kỹ sư; khoảng 50–100 người dùng tại một địa điểm; tài khoản IDEA trước và anh quản trị tài khoản ban đầu; máy chủ có thể đề xuất; bối cảnh dữ liệu/vận hành và mục tiêu khôi phục sơ bộ |
| Chưa được xác nhận | Bộ công nghệ, hệ điều hành/cấu hình máy chủ, license/chi phí, khả năng khôi phục thực tế, quyết định của sếp và quyền bắt đầu code/cài đặt/triển khai |
| Phần yêu cầu mới | REQ-IAM-001…007 trong DOC-04 và Spec; vẫn thuộc FTR-011, không tạo thêm mã tính năng |
| Phần thiết kế mới | Lựa chọn server, Web, Desktop, tài khoản và kho file; phân tích phương án thay thế, ranh giới dữ liệu/quyền, backup, vòng đời và license |
| Phần được sửa cho nhất quán | Check-in thành công hoặc No Change đều bỏ giữ, không có tùy chọn tiếp tục giữ; tài khoản công ty không còn là điều kiện ban đầu; phân biệt giao dịch database với việc lưu file |
| Tài liệu mới | Feature 0.4, Spec 0.5, Tech 0.3; cả tám DOC, GOV và VVP 0.2; CHG 0.1 |
| Bối cảnh còn mở | SPEC-OPEN-05/06 được làm rõ một phần; tám SPEC-OPEN vẫn chưa tự đóng. RTO ≤4 giờ làm việc / RPO ≤1 giờ là mục tiêu đánh giá, chưa phải SLA. |
| Kết quả review bản mới | NOT-RUN; kết quả tại mục 5 vẫn chỉ áp dụng cho Feature 0.3 / Spec 0.4 |
| Phần không sửa | Prototype HTML, các ADR đã Accepted, constitution, Spec Kit và production code |
| Bản trình Word/PDF | Đã từng tạo ba rendition DOCX từ Feature 0.4, Spec 0.5 và Tech 0.3; Markdown vẫn là nguồn có thẩm quyền. Các rendition cũ đã được rút khỏi thư mục làm việc ngày 09/09/2026 và giữ trong [archive bản trình bày lỗi thời](../history/2026-09-09-obsolete-presentation-artifacts.zip). |

Trước khi sửa đã giữ nguyên 16 file nguồn/chỉ mục trong
[archive trước bối cảnh Tech](../history/2026-09-03-before-tech-context.zip), với đường dẫn bên trong
tính từ gốc repository. Archive chứa cả Feature 0.3 / Spec 0.4 sau ghi nhận review, Tech 0.2 và nguồn
DOC-01…08/GOV/VVP/CONTEXT/README/sổ phiên bản cũ.

SHA-256 của archive:
`1333d9d578338f475852dd5d329c22046562da6df805ae403b1020c845461c1e`.

Đã đọc lại từng file trong archive và so với SHA-256 trước khi sửa. Các bản lịch sử và bản trình
review riêng tại mục 2 vẫn giữ nguyên. Đây là bảo toàn lịch sử tài liệu, không phải thử khôi phục
hệ thống sản phẩm.

## 7. Ảnh chụp nguồn sau lần làm rõ BOM ngày 07-09-2026

Bảng dưới giữ ảnh chụp nguồn tại thời điểm hoàn thành điểm BOM. Đây không phải danh sách bản hiện
hành sau lần đồng bộ 09-09-2026; xem mục 1 và mục 19 cho trạng thái hiện tại. Tất cả tài liệu có số
phiên bản vẫn ở trạng thái Draft; hash chỉ nhận diện nội dung, không thay thế review hoặc kết quả test.

<!-- SOURCE-SNAPSHOT-20260907:BEGIN -->
| Nguồn | Phiên bản / phạm vi | Được dùng cho | SHA-256 |
|---|---|---|---|
| [DOC-01](../DOC-01-product-vision-and-scope.md) | IE-PROD-VISION-001@0.3 | Feature | b65059d8a810d746b18ff2eaa75360743aba52e9b5bca5966340e9fd94cd3607 |
| [DOC-02](../DOC-02-feasibility-and-options-assessment.md) | IE-PROD-FEAS-001@0.2 | Feature; Tech | 3887504f465593eadcbcca6c4f9c6fbba36150790fa7caa68c4ed1381de70ac7 |
| [DOC-03](../DOC-03-business-requirements.md) | IE-PROD-BREQ-001@0.3 | Feature; Spec | 46019399f52ba32dc00a2446910bf968bff1c81020eaf4a61ba78c75e6642040 |
| [DOC-04](../DOC-04-software-requirements-specification.md) | IE-PROD-SREQ-001@0.8 | 74 yêu cầu; Feature → Spec → Tech; bổ sung ranh giới BOM, Product Structure, file xuất và file nhập | 02d91fe6678170914ddf680948b22e5ac9f5ea326e22993c58c8212b2a14e975 |
| [DOC-05](../DOC-05-architecture-description.md) | IE-PROD-ARCH-001@0.8 | Tech; bổ sung quyền sở hữu BOM profile, import candidate và Representation trong module Product Structure | 5ce8409d7cc5773c17a25cd8ecb294ac65bd7bab9a9fa30b65a46ec0f6d2981e |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | IE-PROD-DATA-001@0.8 | Spec; Tech; dữ liệu BOM có cấu trúc, profile, Representation, import candidate và parts-list được kiểm soát độc lập | 9f23d3b65802fce29756aed84ab1354005f9ec847d5328598f11934dfe2c731a |
| [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md) | IE-PROD-ROADMAP-001@0.4 | Roadmap tại thời điểm chụp; Feature 0.8 đã ghim phiên bản này | ae338e17319c22a70b5a6e3a3842121b957c81935f8f64e1a5c27119648727f9 |
| [DOC-08](../DOC-08-ui-ux-and-interaction-specification.md) | IE-PROD-UX-001@0.5 | Spec; Tech; bổ sung BOM workspace, chọn view/export và preview trước khi nhập | 7d67d780fe57edcdbc3fe5dd5bf1719a04e7d674c3ec377ac702e4f6e9c286e5 |
| [GOV](../registers/GOV-material-and-behavioral-coverage.md) | IE-GOV-COVERAGE-001@0.3 | Feature; 16 phần đối chiếu có giới hạn bằng chứng | 4de0bcf9e28ee2185d48e6cdadb2209b52b081e0b8cbd1970e05f7fa8ee72016 |
| [VVP](../registers/VVP-core-v0-verification-validation-plan.md) | IE-VVP-CORE-001@0.9 | Spec 0.12; 15 mục kiểm chứng, bổ sung BM-01…06; mọi kết quả sản phẩm vẫn `NOT-RUN` | 6eec6c6b1df176f9e10d1ad17cdde86c92d7667d96ba1846501e339dd44b8f8e |
| [CHG Tech](../registers/CHG-2026-09-03-tech-context-and-proposal.md) | IE-CHG-TECH-001@0.1 | Bối cảnh Tech và lịch sử | a322f4f3f80aecca225dac87952b76796b92ba9c898fd61443f730ead77ca3a1 |
| [CHG Version](../registers/CHG-2026-09-04-version-model-clarification.md) | IE-CHG-VERSION-001@0.1 | Quyết định Version và phạm vi đồng bộ | d676263cabda5612b15fc7702f31b4f338d276a0cb75c2dcb0a679b7f1aafe4f |
| [CHG phát hành theo cụm](../registers/CHG-2026-09-07-staged-release-scenario.md) | IE-CHG-STAGED-RELEASE-001@0.1 | Kịch bản, trace, nguồn lưu giữ và phạm vi cập nhật | df8d3946d0ffcd4c9dc85c5bbe355f454ce258efed8bb3ef7ab521f3c3b68000 |
| [CHG CAD Representation](../registers/CHG-2026-09-07-cad-neutral-representation.md) | IE-CHG-CAD-REP-001@0.1 | Quyết định Adapter/worker, Representation và nguồn lưu giữ | 22463799e5bc4189324f78287daff3534dc45fae008ab5e35f8a8bd3a6b0a158 |
| [CHG Workflow](../registers/CHG-2026-09-07-workflow-configuration.md) | IE-CHG-WORKFLOW-001@0.1 | Quyết định workflow có phiên bản, mặc định theo loại tài liệu và nguồn lưu giữ | 40fc291c6b8043f30000a00f41d4b30a3f8e7d2e88dca766b9c4fddfe533f1f0 |
| [CHG phân quyền](../registers/CHG-2026-09-07-authorization-data-boundary.md) | IE-CHG-AUTH-DATA-001@0.1 | Ranh giới Identity, Access Policy, JSON, activation và nguồn lưu giữ | 961746279c7cf384f7ada508503fb5d3e851bb308da3936fcfd01a3a06c5c769 |
| [CHG danh tính item/folder](../registers/CHG-2026-09-07-item-folder-identity.md) | IE-CHG-ITEM-FOLDER-001@0.1 | Quyết định Move/Rename/Create Copy, phạm vi đồng bộ và nguồn lưu giữ | 33f16b2f3e1b22a99ec2e95359013b24ebbf25b798c529a83faaa7e4fb52b923 |
| [CHG BOM/cấu trúc/file](../registers/CHG-2026-09-07-bom-structure-representation.md) | IE-CHG-BOM-STRUCTURE-001@0.1 | Quyết định BOM là cấu trúc được quản lý; file xuất và file nhập không phải nguồn có thẩm quyền | 7760751c278560c27287fb464c0d50f02c787ef66344b2dfcbfee14b8fef297f |
| [Nghiên cứu DDM CAD Representation](../../../knowledge/2026-09-07-ddm-cad-neutral-representation-evidence.md) | IE-KNW-DDM-004 | Bằng chứng công khai và giới hạn cơ chế chuyển đổi | ed10d96b0a33beecdb76f7eab71fcdefa9be5b7ec0c69942e5dc9ee4ab66a90c |
| [Nghiên cứu DDM về item/folder](../../../knowledge/2026-09-07-ddm-item-name-folder-identity-evidence.md) | IE-KNW-DDM-005 | Bằng chứng công khai về Move/Rename/Save-As/Reference và giới hạn suy luận | fedd91e3a14405c6511b78e64f4d9b531c8e401709cabc928b3f1bdbb90db359 |
| [Nghiên cứu DDM về BOM](../../../knowledge/2026-09-07-ddm-bom-structure-representation-evidence.md) | IE-KNW-DDM-006 | Bằng chứng công khai về Product Structure/BOM và khả năng xuất; không suy diễn cấu trúc lưu trữ nội bộ | a2032b532e042f77edcb4f23eb15c8e9effcad9229a92b8a48fa536f3b8f8276 |
| [Chỉ mục kiến thức sản phẩm](../../../knowledge/README.md) | Bản làm việc ngày 07-09-2026 | Điều hướng bằng chứng về Product Structure/BOM | bbd7d36c76a00b342f732e1ecec6786e2eed8eb5c9301d9b668ee5dffb327f8d |
| [Feature](FEATURE-001-feature-definition-and-scope.md) | FEATURE-001@0.10 | Bản trình; 14 mã FTR; review toàn bản `PARTIAL` | 89ecf7274567eae86e87cb287d282895a7902c5aeef82e2f91387ba388dce6e8 |
| [Spec](SPEC-001-product-specification.md) | SPEC-001@0.12 | Bản trình; 74 yêu cầu, bổ sung BM-01…06; bảy điểm còn mở | 731f4f840321476f30b74d7966029e306a9f0899705f190a1f40e3fb03269450 |
| [Tech](TECH-001-technology-and-architecture-proposal.md) | TECH-001@0.7 | Bản trình; kiến trúc CAD Representation, workflow và phân quyền cấu hình bổ sung | 669145050328a71e3717b512b0bf090c1b23faa5a637f6cc1b0757eecb981702 |
| [Chỉ mục tài liệu](../README.md) | Bản làm việc ngày 07-09-2026 | Điều hướng Feature/Spec/Tech/Core/VVP và quyết định BOM tại thời điểm chụp | bd687f93ed04bc1a06c0856958dc45a8b57f152c8691efedc9d290e0fd6000bd |
| [CONTEXT.md](../../../../../CONTEXT.md) | Bản làm việc ngày 07-09-2026 | Thuật ngữ và ranh giới BOM, profile, Representation và import candidate | f63d1cb86eaedfb14ca34517fe52a82e46517f756989b7df691e3fb3c8129ec9 |
| [Kiến trúc vòng đời](../../../../architecture/idea-product-lifecycle-architecture.md) | Bản làm việc ngày 04-09-2026 | Quy tắc chuyển trạng thái và bất biến | ca8790831da7fc79e22a8df258c0faf9003bfb20978205f5d659d475f94b93a3 |
| [Prototype](../../../../../prototypes/controlled-document-workspace.html) | Bản kiểm tra ngày 04-09-2026 | Mô phỏng Revision/Version/Generation và Check-in | 63c0ae7c432b10a200934a7806ecb2629d70273633d9c8438b51f45b29915b7b |
| [Hướng dẫn prototype](../../../../../prototypes/README.md) | Chỉ dẫn cập nhật ngày 05-09-2026 | Kịch bản và giới hạn giữ nguyên; đường dẫn tới bộ DOC hiện hành | 7dd18ec357150d2549eed88b14471bae14bb85174e2ffff0a0ebd267b76be1c4 |
| [Nghiên cứu Tech](../../../../research/2026-09-03-idea-tech-stack-primary-sources.md) | Nguồn tra cứu ngày 03-09-2026 | Nguồn chính thức và giới hạn; không phải kết quả chạy thử | ba0f725ed68ed3aae15eb80267432b03594fde362fbfdaa22cd3350d2041fad7 |
<!-- SOURCE-SNAPSHOT-20260907:END -->

Sổ phiên bản này không tự ghim hash của chính nó. Các ADR Accepted được giữ nguyên tại repository
commit `45f1c43`; danh sách nằm ở [ADR index](../../../../adr/README.md). Các nguồn công nghệ chính
thức cùng ngày tra cứu và giới hạn được ghi trong research note ở bảng trên.

## 8. Kiểm tra của lần biên tập ngày 03-09-2026

| Kiểm tra | Phạm vi | Kết quả |
|---|---|---|
| Bộ kiểm tra tập trung cho nguồn hiện hành | 22 kiểm tra: tập mã/trace của 68 REQ; 61 yêu cầu cũ không đổi; 14 FTR; 15 VVP; 9 ô locale/surface; 8 SPEC-OPEN; 8 TECH-CTX; phiên bản 8 DOC; bảng/heading/fence; link và anchor cục bộ; ID tham chiếu; khoảng trắng/merge marker; hash bản lịch sử/archive và 17 nguồn hiện hành; không còn placeholder; phạm vi Git | `PASS` — 22/22, không có lỗi |
| Kiểm tra archive trước thay đổi | 16 file trong archive đối chiếu từng SHA-256 với nội dung đã chụp trước khi sửa | `PASS` — 16/16 |
| Cấu trúc ba bản Word | Mở gói DOCX; kiểm tra danh tính, metadata, khổ trang, bảng, đánh số, SHA-256 nguồn và SHA-256 rendition | `PASS` tại thời điểm tạo — 3/3; các rendition này đã được rút khỏi thư mục làm việc và giữ trong [archive bản trình bày lỗi thời](../history/2026-09-09-obsolete-presentation-artifacts.zip) |
| Kiểm tra trực quan bản Word | Microsoft Word 16.0 xuất bản kiểm tra; xem toàn bộ Feature 8 trang, Spec 18 trang và Tech 10 trang | `PASS` theo đường kiểm tra thay thế — 36/36 trang không thấy cắt/chồng chữ, mất ký tự, sai đánh số hoặc tách hàng mất ngữ cảnh. Bộ render LibreOffice không chạy vì máy không có `soffice`; không ghi thay thành PASS của bộ render đó. |
| Kiểm tra hỗ trợ tiếp cận DOCX | Quét tự động ba bản Word | Không có lỗi mức cao; bốn cảnh báo mức trung bình thuộc khung trạng thái/sơ đồ chữ dùng bảng bố cục, đã ghi giới hạn trong danh mục rendition |
| `git diff --check` | Thay đổi file đã được Git theo dõi | `PASS`; Git chỉ cảnh báo quy tắc chuyển LF/CRLF của `CONTEXT.md`, không báo lỗi diff |
| Lệnh công khai `./scripts/verify-template` | Toàn bộ Core Workspace được Git theo dõi | `INCOMPLETE`: đã chạy đúng script bằng Git Bash, nhưng tiến trình bị ngắt trước khi có output/exit code sau hơn 25 phút quét dữ liệu repository; không được ghi là PASS. Chạy lại trước khi yêu cầu tích hợp/review repository. |
| Kiểm thử sản phẩm | Giao dịch, PostgreSQL, tài khoản/thu hồi phiên, WebView2, CAD/Office, hiệu năng, backup/restore | `NOT-RUN`; chưa có code, môi trường, dataset hoặc quyền triển khai |

Các kiểm tra nguồn không chứng minh tính đúng của giao dịch, bảo mật, khả năng xử lý CAD, hiệu năng
hoặc khôi phục. Toàn bộ thử nghiệm sản phẩm trong VVP vẫn NOT-RUN. Bước tiếp theo là anh review
phần bổ sung của Feature/Spec và đề xuất Tech, rồi trình đúng phiên bản cho sếp quyết định.

## 9. Đồng bộ mô hình Version và kiểm tra ngày 04-09-2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-VERSION-001@0.1](../registers/CHG-2026-09-04-version-model-clarification.md) |
| Điều đã chốt | Một Version trong mỗi Revision; bắt đầu từ 1; Check-in có thay đổi tăng đúng một lần và tạo một Generation; No Change không tăng số; Revision mới trở lại Version 1; Generation là mã snapshot bất biến |
| Phạm vi xác nhận | Xác nhận nội bộ riêng cho cách dùng Version/Generation và SPEC-OPEN-01; không phải duyệt toàn bộ Feature 0.5, Spec 0.6 hoặc Tech 0.4 |
| Bản Word mới | Đã từng tạo Feature 0.5, Spec 0.6 và Tech 0.4. Các rendition cũ đã được rút khỏi thư mục làm việc ngày 09/09/2026 và giữ trong [archive bản trình bày lỗi thời](../history/2026-09-09-obsolete-presentation-artifacts.zip); các file Word do người dùng biên tập không bị thay đổi. |
| Quyết định của sếp | Feature, Spec và Tech vẫn `NOT-RUN` |

| Kiểm tra | Phạm vi | Kết quả |
|---|---|---|
| Prototype chuyển trạng thái | 10 kịch bản: bản đầu A/V1, Check-in có đổi, No Change, Submit/Approve/Release, Revision B/V1, Check-in tiếp theo, stale conflict và 10 item ở VI/EN/JA | `PASS` — 10/10 trong phạm vi prototype; không phải kiểm thử production |
| Nguồn Markdown hiện hành | Đếm mã kiểm soát; kiểm tra khoảng trắng, merge marker, code fence, 21 hash hiện hành và các liên kết file cục bộ trong bộ instance | `PASS` — 14 FTR, 68 REQ, 15 VVP, 8 SPEC-OPEN; hash và liên kết đều khớp |
| Cấu trúc và nội dung ba DOCX | Mở gói, kiểm tra lỗi thành phần, ID/phiên bản, field, mô hình Version, SPEC-OPEN-01 và không có trường `Version Sequence` | `PASS` — 3/3 |
| Mục lục và kiểm tra trực quan | Microsoft Word 16.0 cập nhật field và xuất bản QA; xem Feature 9, Spec 20, Tech 12 trang | `PASS` theo đường kiểm tra thay thế — 41/41 trang; không thấy cắt chữ, chồng lấn hoặc trang trắng thừa. Máy không có LibreOffice nên không ghi kết quả này thay cho bộ render LibreOffice. |
| Hỗ trợ tiếp cận DOCX | Quét tự động ba bản Word | Không có lỗi mức cao. Ba cảnh báo mức trung bình là bảng bố cục trạng thái/sơ đồ kiến trúc, không phải bảng dữ liệu. |
| `git diff --check` | Các thay đổi ở file đã được Git theo dõi | `PASS`; chỉ có cảnh báo chuyển LF/CRLF, không có lỗi diff. Các file instance chưa được Git theo dõi đã được kiểm tra riêng ở hàng nguồn Markdown. |
| Kiểm thử sản phẩm | Database, giao dịch, quyền, bảo mật, CAD/Office, hiệu năng, backup/restore | `NOT-RUN`; chưa có production code hoặc môi trường kiểm thử |

Các kết quả `PASS` ở mục này chỉ chứng minh tính nhất quán của tài liệu và hành vi mô phỏng. Chúng
không phải bằng chứng rằng sản phẩm đã được triển khai, đạt VVP hoặc được phép dùng thật.

## 10. Đưa roadmap và 56 task vào DOC-07 — 05/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Thay đổi | [IE-CHG-ROADMAP-001](../registers/CHG-2026-09-05-roadmap-task-integration.md) |
| Tài liệu chủ quản | [DOC-07@0.4](../DOC-07-mvp-roadmap-and-delivery-plan.md), Draft |
| Kế hoạch | IE-PLAN-DEC2026-001@0.1 — mục tiêu có điều kiện 07/09–31/12/2026 |
| Chi tiết | [Phụ lục A: 56 task](../planning/DOC-07-appendix-A-task-breakdown-december-2026.md), Draft 0.4 |
| Minh họa | [Gantt](../planning/idea-roadmap-december-2026.html), giữ nguyên file HTML được cung cấp |
| Quỹ giờ | 676 giờ công việc + 80 giờ dự phòng = 756 giờ; 11 thứ Bảy cần được xác nhận |
| Bản trước thay đổi | [Archive DOC-07@0.3 và các chỉ mục liên quan](../history/2026-09-05-before-roadmap-sync.zip); SHA-256 trong CHG |
| Ảnh hưởng bản trình | Feature 0.5 giữ pin DOC-07@0.3, `Stale` so với roadmap hiện hành; chưa cập nhật hay xuất lại Word |
| Quyết định và thực hiện | Không đổi trạng thái Feature/Spec/Tech, không đóng điểm Spec mở, không ghi gate đạt và chưa code Core |

Hash DOC-07@0.3 trước thay đổi: `a33d4a4334c5236d36a839a2cb5a5904755b13c2fea5f592ad7ba65dec71b028`. Các hash/review trước đây được giữ trong
archive và các mục lịch sử; không đổi chúng thành hash hay kết quả của Draft 0.4.

## 11. Làm gọn chỉ dẫn dự án — 05/09/2026

README dự án phân biệt rõ template với bộ DOC đã viết cho IDEA, trỏ tới bộ Feature/Spec/Tech và
kế hoạch trong DOC-07. Quy tắc soạn Word được gom tại
[hướng dẫn dành cho tài liệu trình sếp](../../../../agents/management-documents.md), dùng đúng
thư mục Human hiện có. Hướng dẫn prototype và danh mục báo cáo dẫn tới tài liệu hiện hành.

Hướng dẫn prototype chỉ đổi phần tra cứu và bước dùng tiếp theo; hash trước sửa là
`8238165ff9f316958d9462c42f6bd153956161d162a800338ea7d38ec8ca1703`. Hash mới nằm ở mục 7.
File HTML, tám DOC, Feature/Spec/Tech, bản Word, lịch và 56 task được giữ nguyên.
Đây là chỉnh chỉ dẫn, không phải review nội dung mới, thay đổi yêu cầu hay quyết định cho phép code.

## 12. Bổ sung kịch bản phát hành theo từng cụm — 07/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-STAGED-RELEASE-001](../registers/CHG-2026-09-07-staged-release-scenario.md) |
| Xác nhận của anh | Đồng ý phát hành theo cụm và yêu cầu bổ sung kịch bản, tiếp tục sau khi hết token; chưa phải review toàn bộ nội dung vừa viết |
| Spec | 0.6 → 0.7; mục 8.1 giải thích việc phát hành cụm bơm khi tủ điện và toàn bộ máy còn In Work |
| Kế hoạch kiểm thử | VVP 0.3 → 0.4; bộ thủ tục IE-VVP-STAGED-RELEASE-001@0.1 với SR-01…06 trong VVP-005/006 |
| Điều kiện được làm rõ | Phạm vi riêng; phụ thuộc bắt buộc; quyền/phê duyệt tại lúc ghi nhận; không phát hành dở dang; hồ sơ cũ không đổi khi tài liệu có bản mới |
| Mã yêu cầu/tính năng | Giữ nguyên 68 REQ, 14 FTR và 15 VVP; các trường hợp mới cụ thể hóa yêu cầu đã có |
| Bản trước thay đổi | [Archive](../history/2026-09-07-before-staged-release-scenario.zip) chứa Spec 0.6, VVP 0.3, chỉ mục và sổ phiên bản cũ; hash từng file ở CHG |
| File khác | DOC-01…08, Feature, Tech, prototype và các bản Word/Human giữ nguyên; các tham chiếu cần cập nhật được ghi ở chỉ mục |
| Kết quả sản phẩm | Tất cả SR-01…06 là NOT-RUN; không đóng điểm Spec mở hoặc chuyển trạng thái quyết định của sếp |

Đối chiếu tài liệu tập trung gồm tập mã yêu cầu, sáu tình huống và trace giữa Spec/VVP, bảng và
liên kết Markdown, hash nguồn hiện hành và bốn file trong archive. Kết quả kiểm tra tài liệu được
ghi trong Work Item; không dùng thay kết quả thực thi các kịch bản trên sản phẩm.

## 13. Làm rõ cách tạo PDF và neutral file từ CAD — 07/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-CAD-REP-001](../registers/CHG-2026-09-07-cad-neutral-representation.md) |
| Xác nhận của anh | Đồng ý theo hướng Format Adapter/worker, dùng chức năng export/converter đã kiểm chứng và giữ đường tải lên thủ công; yêu cầu cập nhật rồi chuyển sang điểm cần sửa tiếp theo |
| Feature | 0.5 → 0.6; giữ 14 FTR, làm rõ FTR-013 |
| Spec | 0.7 → 0.8; giữ 68 REQ, làm rõ REQ-FMT-002/004/005 và thêm CR-01…05 tại mục 8.2 |
| Core sources | DOC-04/05/06 0.3 → 0.4; yêu cầu, kiến trúc và dữ liệu dùng cùng Representation boundary |
| Tech | 0.4 → 0.5; đề xuất Adapter riêng cho từng CAD, không giả định universal renderer hoặc headless conversion |
| Kế hoạch kiểm thử | VVP 0.4 → 0.5; VVP-008 có CR-01…05; vẫn giữ 15 VVP và mọi kết quả `NOT-RUN` |
| Trạng thái điểm 08 | Đã giải quyết ở mức thiết kế/specification; PDF/neutral file gắn đúng Generation nguồn, có `Current`/`Needs update`, Release chặn/cảnh báo theo policy |
| Phần còn mở | SPEC-OPEN-04 vẫn cần phiên bản IRONCAD/ứng dụng, đường export, Adapter/converter, license, nơi chạy, file mẫu và giới hạn đo được |
| Bản trước thay đổi | [Archive](../history/2026-09-07-before-cad-neutral-representation-decision.zip) chứa chín nguồn trước thay đổi; hash archive và từng file nằm trong CHG |
| File không đổi | DOC-01/02/03/07/08, GOV, prototype, Spec Kit, production code và các bản Word/Human đã nộp |

Kiểm tra tài liệu cho lần này phải xác nhận tập mã 14 FTR/68 REQ/15 VVP không đổi, CR-01…05 khớp
giữa Spec và VVP, nguồn/phiên bản/hash đúng và archive giữ được nội dung trước thay đổi. Các kiểm tra
này không chứng minh IRONCAD hoặc converter thực tế đã chạy thành công.

## 14. Làm rõ cấu hình workflow — 07/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-WORKFLOW-001](../registers/CHG-2026-09-07-workflow-configuration.md) |
| Xác nhận của anh | Đồng ý theo đề xuất: nhiều workflow có phiên bản, một mặc định theo loại tài liệu, quy trình Core v0 ban đầu và chưa làm giao diện kéo-thả |
| Feature | 0.6 → 0.7; giữ 14 FTR, làm rõ FTR-008 |
| Spec | 0.8 → 0.9; giữ 68 REQ, làm rõ REQ-LC-001/003/005 và thêm WF-01…06 tại mục 8.3 |
| Core sources | DOC-04/05/06 0.4 → 0.5; yêu cầu, kiến trúc và dữ liệu dùng cùng mô hình workflow có phiên bản |
| Tech | 0.5 → 0.6; workflow là cấu hình do Server kiểm tra, designer kéo-thả để sau |
| Kế hoạch kiểm thử | VVP 0.5 → 0.6; VVP-006/007 có WF-01…06; vẫn giữ 15 VVP và mọi kết quả `NOT-RUN` |
| Trạng thái điểm 09 | Đã giải quyết ở mức thiết kế/specification; chưa có engine, màn hình quản trị hoặc kết quả chạy |
| Bản trước thay đổi | [Archive](../history/2026-09-07-before-workflow-configuration-decision.zip) chứa chín nguồn trước thay đổi; hash archive và từng file nằm trong CHG |
| File không đổi | DOC-01/02/03/07/08, GOV, prototype, Spec Kit, production code và các bản Word/Human đã nộp |

Kiểm tra tài liệu cho lần này phải xác nhận tập mã 14 FTR/68 REQ/15 VVP không đổi, WF-01…06 khớp
giữa Spec và VVP, nguồn/phiên bản/hash đúng và archive giữ được nội dung trước thay đổi. Các kiểm tra
này không chứng minh workflow thực tế đã được triển khai hoặc vận hành thành công.

## 15. Làm rõ Identity, Access Policy và JSON — 07/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-AUTH-DATA-001](../registers/CHG-2026-09-07-authorization-data-boundary.md) |
| Xác nhận của anh | Đồng ý dùng Identity cho tài khoản/xác thực; Access Policy của IDEA quyết định quyền chủ yếu qua nhóm/vai trò theo loại/phạm vi/trạng thái tài liệu; quyền trực tiếp chỉ là ngoại lệ; JSON chỉ là định dạng nhập/xuất ứng viên có kiểm soát |
| Feature | 0.7 → 0.8; giữ 14 FTR, làm rõ FTR-011 |
| Spec | 0.9 → 0.10; giữ 68 REQ, làm rõ REQ-GOV-002/005 và thêm AC-01…05 tại mục 8.4 |
| Core sources | DOC-04/05/06 0.5 → 0.6; yêu cầu, kiến trúc và dữ liệu dùng cùng ranh giới Identity/Access Policy/candidate activation |
| Tech | 0.6 → 0.7; đề xuất ASP.NET Core Identity cho tài khoản, Access Policy cho quyền sản phẩm; PostgreSQL vẫn chờ quyết định Tech |
| Kế hoạch kiểm thử | VVP 0.6 → 0.7; VVP-007/011/015 có AC-01…05; vẫn giữ 15 VVP và mọi kết quả `NOT-RUN` |
| Trạng thái điểm 10 | Đã giải quyết ở mức thiết kế/specification; chưa có account store, policy engine, màn hình quản trị, JSON importer hoặc kết quả chạy |
| Bản trước thay đổi | [Archive](../history/2026-09-07-before-authorization-data-boundary-decision.zip) chứa mười nguồn trước thay đổi; hash archive và từng file nằm trong CHG |
| File không đổi | DOC-01/02/03/07/08, GOV, prototype, Spec Kit, production code và các bản Word/Human/PDF đã nộp |

Kiểm tra tài liệu cho lần này phải xác nhận tập mã 14 FTR/68 REQ/15 VVP không đổi, AC-01…05 khớp
giữa Spec và VVP, nguồn/phiên bản/hash đúng và archive giữ được nội dung trước thay đổi. Các kiểm tra
này không chứng minh Identity, database hoặc phân quyền thực tế đã được triển khai hay vận hành an toàn.

## 16. Làm rõ danh tính item, folder và bản sao — 07/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-ITEM-FOLDER-001](../registers/CHG-2026-09-07-item-folder-identity.md) |
| Xác nhận của anh | Đồng ý theo cách tổ chức quen thuộc của DDM: folder là vị trí logic; Move và Rename không tạo tài liệu mới; Create Copy/Save-As tạo tài liệu mới và phải giữ nguồn gốc |
| Feature | 0.8 → 0.9; giữ 14 mã FTR, làm rõ FTR-001/002 |
| Spec | 0.10 → 0.11; thêm REQ-ID-007…009 và IF-01…06, nâng tổng số lên 71 mã REQ |
| Core sources | DOC-04/05/06 0.6 → 0.7 và DOC-08 0.3 → 0.4; yêu cầu, kiến trúc, dữ liệu và tương tác dùng cùng mô hình Folder/Placement/Move/Rename/Create Copy |
| Kế hoạch kiểm thử | VVP 0.7 → 0.8; VVP-001 có IF-01…06; vẫn giữ 15 mục kiểm chứng và mọi kết quả sản phẩm `NOT-RUN` |
| Bằng chứng tham khảo | [IE-KNW-DDM-005](../../../knowledge/2026-09-07-ddm-item-name-folder-identity-evidence.md) chỉ chứng minh DDM công khai các lệnh Move, Rename, Save-As, Reserve To và Reference To; không được dùng để khẳng định cấu trúc database nội bộ của DDM |
| Bản trước thay đổi | [Archive](../history/2026-09-07-before-item-folder-identity-decision.zip) chứa mười nguồn trước thay đổi; SHA-256 archive là `16e1f7f8a879ef0a16b6c41b1222d86935cd8514b2ec678b84d6da86dc9358a9` |
| File không đổi | DOC-01/02/03/07, GOV, Tech, prototype, Spec Kit, production code và các bản Word/Human/PDF đã nộp |

Lần đồng bộ này chốt mô hình tài liệu ở mức phân tích và thiết kế. Đối chiếu tài liệu ngày
07/09/2026 đạt: 14 FTR; 71 REQ khớp giữa DOC-04 và Spec; 15 VVP; IF-01…06 khớp giữa Spec và VVP;
không thiếu liên kết file cục bộ hoặc placeholder; hash 11 nguồn hiện hành khớp; archive có đúng
10/10 file và từng hash trước thay đổi khớp; DOC-01…08 không chứa tên sản phẩm tham khảo. Kiểm tra
Markdown và `git diff --check` không phát hiện lỗi. Đây chỉ là `PASS` về tính nhất quán tài liệu;
mọi kiểm thử sản phẩm cho Move, Rename và Create Copy vẫn `NOT-RUN`.

## 17. Làm rõ BOM, Product Structure và file Excel/PDF — 07/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-BOM-STRUCTURE-001](../registers/CHG-2026-09-07-bom-structure-representation.md) |
| Quyết định đã chốt | BOM là dữ liệu Product Structure được hệ thống quản lý. Excel, CSV và PDF chỉ là file xuất hoặc nguồn đề nghị nhập; không tự trở thành cấu trúc có thẩm quyền. |
| Feature | 0.9 → 0.10; giữ 14 mã FTR, làm rõ FTR-007 và FTR-010 |
| Spec | 0.11 → 0.12; thêm REQ-STR-004…006, nâng tổng số lên 74 mã REQ và thêm BM-01…06 |
| Core sources | DOC-04/05/06 0.7 → 0.8 và DOC-08 0.4 → 0.5; yêu cầu, kiến trúc, dữ liệu và giao diện dùng cùng mô hình BOM/profile/Representation/import candidate |
| Kế hoạch kiểm thử | VVP 0.8 → 0.9; bổ sung thủ tục BM-01…06; vẫn giữ 15 mục kiểm chứng và mọi kết quả sản phẩm `NOT-RUN` |
| Bằng chứng tham khảo | [IE-KNW-DDM-006](../../../knowledge/2026-09-07-ddm-bom-structure-representation-evidence.md) chỉ ghi nhận khả năng Product Structure/BOM và xuất file công khai; không dùng để khẳng định database hoặc cơ chế nội bộ của sản phẩm tham khảo |
| Quy tắc file xuất | Mỗi BOM Representation phải ghim đúng cấu trúc, phiên bản view/profile và định dạng đã dùng. Khi nguồn đổi, file cũ phải được nhận biết là đã lạc hậu, không tự cập nhật âm thầm. |
| Quy tắc file nhập | File Excel/CSV được kiểm tra và cho xem trước như một import candidate; chỉ một lần chấp nhận nguyên vẹn mới được thay đổi cấu trúc. Không chấp nhận một phần rồi để lại BOM dở dang. |
| Parts-list độc lập | Nếu danh sách vật tư cần vòng đời hoặc phê duyệt riêng, nó là một tài liệu có kiểm soát độc lập, liên kết tới đúng snapshot BOM thay vì thay thế BOM. |
| Bản trước thay đổi | [Archive](../history/2026-09-07-before-bom-structure-representation-decision.zip) chứa 11 nguồn trước thay đổi; SHA-256 archive là `cdf549eb250bf9da4b4ed524a0a958a0d94838f8cfdcf90bbada15bf028c77ac` |
| File không đổi | DOC-01/02/03/07, GOV, Tech, prototype, Spec Kit, production code và các bản Word/Human/PDF đã nộp |

Lần đồng bộ này chỉ chốt điểm 12 ở mức phân tích và thiết kế. Đối chiếu tài liệu ngày 07/09/2026
đạt: 14 FTR; 74 REQ khớp chính xác giữa DOC-04 và Spec; 15 VVP; BM-01…06 khớp giữa Spec và VVP;
285 liên kết file cục bộ đều tồn tại; 31 hash nguồn hiện hành khớp; archive có đúng 11/11 file và
từng hash trước thay đổi khớp; DOC-01…08 không chứa tên sản phẩm tham khảo. Kiểm tra fence,
whitespace, merge marker và `git diff --check` không phát hiện lỗi nội dung. Đây chỉ là `PASS` về
tính nhất quán tài liệu: BOM import/export chưa được cài đặt hoặc kiểm thử trong sản phẩm và mọi
kết quả liên quan vẫn `NOT-RUN`. DOC-07 và Tech sẽ được đối chiếu một lần sau khi xử lý xong điểm
12–15 để tránh sửa cùng một tài liệu nhiều lần.

## 18. Làm rõ phạm vi đầu ra phòng ban — 07/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-DEPT-SCOPE-001](../registers/CHG-2026-09-07-departmental-deliverable-scope.md) |
| Quyết định đã chốt | Tài liệu, cấu trúc và bằng chứng kỹ thuật thuộc phạm vi kiểm soát hiện có; giờ, chi phí, mua hàng, chế tạo, tiến độ và hoàn thành chỉ là dữ liệu tham khảo nếu chưa có Feature hoặc hợp đồng tích hợp riêng. |
| Feature / Spec | Feature 0.10 → 0.11, giữ 14 FTR; Spec 0.12 → 0.13, giữ 74 REQ và bổ sung DH-01…04 vào cách kiểm tra. |
| Core / VVP | DOC-01/03 lên 0.4, DOC-04/06 lên 0.9, VVP lên 0.10; không tạo thẩm quyền nghiệp vụ mới. |
| Giới hạn | Đây là quyết định phạm vi ở mức phân tích và thiết kế; không phải bằng chứng triển khai, kiểm thử hay quyết định của sếp. |
| Bản trước thay đổi | [Archive](../history/2026-09-07-before-departmental-deliverable-scope-decision.zip); hash và danh sách file nằm trong CHG. |

## 19. Đồng bộ nguồn hiện hành — 09/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-SOURCE-RECON-001](../registers/CHG-2026-09-09-cross-document-reconciliation.md) |
| Bản hiện hành | Feature 0.12; Spec 0.14; Tech 0.8; DOC-01/03/07 0.5; DOC-04/06 0.10; DOC-05 0.9; DOC-08 0.6; VVP 0.11; DOC-02 0.2; GOV 0.3. |
| Nội dung không đổi | 14 FTR, 74 REQ, bảy điểm Spec còn mở, 15 VVP, stack đề xuất, lịch 56 task / 756 giờ và mọi trạng thái review/decision/gate. |
| Sửa vệ sinh | Xóa hai nhãn file thừa; thay các liên kết “future” đã lỗi thời; DOC-08 trỏ tới prototype IDEA DDM hiện hành; cập nhật số TECH-Q và số yêu cầu trong Roadmap. |
| Bản trước thay đổi | [Archive](../history/2026-09-09-before-cross-document-reconciliation.zip), SHA-256 `dc4865df645e3dd9b08fd47b5f715e01173479bf5a6e74d7849c6839076fb8ac`. |
| Word/Human/PDF | Không sửa, không xuất lại và không coi là tự động đồng bộ với Markdown. |

## 20. Dọn bản trình bày lỗi thời — 09/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-ARTIFACT-CLEANUP-001](../registers/CHG-2026-09-09-obsolete-artifact-cleanup.md) |
| Đã rút khỏi thư mục làm việc | Prototype DDM tiền nhiệm; hai báo cáo dùng UI cũ; các rendition Word Feature 0.4/0.5, Spec 0.5/0.6 và Tech 0.3/0.4; bốn hình kiến trúc đi kèm; logo JPG không còn được dùng. |
| Được giữ nguyên | Markdown có thẩm quyền, lịch sử thay đổi, prototype IDEA DDM hiện hành, prototype Engineering Explorer dùng làm bằng chứng lịch sử, logo PNG, bản Word người dùng đang dùng và tài liệu nguồn quản lý cung cấp. |
| Khả năng khôi phục | 18 file nằm trong [archive bản trình bày lỗi thời](../history/2026-09-09-obsolete-presentation-artifacts.zip), SHA-256 `2b071c1d597f4536851e5e479f18ed2a8c97257b0cfc6769b73c187a9ddf48cb`. |
| Ảnh hưởng nội dung | Không đổi Feature, Spec, Tech, DOC-01…08, yêu cầu, roadmap, trạng thái review hay quyết định của sếp. |

## 21. Đề xuất một bộ công nghệ Core v0 — 13/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-TECH-DEC-001](../registers/CHG-2026-09-13-technology-decision-recommendation.md) |
| Ma trận quyết định | [IE-KNW-TECH-DEC-001@0.1](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md) — artifact `INFORMATIVE`, recommendation kỹ thuật, không phải Product Decision |
| Tech | `0.8 → 0.9`; chọn rõ `.NET 10/ASP.NET Core`, PostgreSQL 18, EF/Npgsql, React/TypeScript/Vite, WPF/WebView2, Workspace .NET, filesystem Artifact Store và Ubuntu-first native topology; Java/Spring và SQL Server giữ làm runner-up |
| Engineering status | `COMPLETE` ở mức recommendation; Q-01…Q-14 vẫn `NOT-RUN`, các nhánh so sánh không chạy được ghi `DEFERRED` |
| Product Decision Authority | `NOT-RUN`; brief chỉ trình sếp xem xét, không ghi nhận approval |
| Gate | PG3/PG4 không đổi và không `PASS`; gate owner vẫn phải xét theo GOV/DOC-07/VVP |
| Product impact | **No Product Scope Change**; không đổi FTR, REQ, DOC-01…DOC-08, DDM capability semantics, architecture semantics hay VVP result |
| Bản trước | `TECH-001@0.8`; SHA-256 `F9B7959B94EF854AB1E08651FD81BB4AA9C03E84F0D9C1CAF08EB3F59A39136F` |
| Roadmap metadata | `DOC-07@0.5 → DOC-07@0.6`; chỉ cập nhật route của `TECH-001@0.9` và các ô tham chiếu Tech; lịch, task, giờ, semantics và gate giữ nguyên. |

Ma trận và brief phân biệt rõ `Research evidence → Engineering recommendation → Product Decision
Authority approval`. Recommendation có thể bị đảo bởi Q-01…Q-14, company support/license evidence
hoặc phản biện của sếp; không có kết quả kiểm chứng nào được suy diễn từ việc viết tài liệu.

## 22. Mở lại Server runtime theo bối cảnh Linux-first — 13/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-TECH-LINUX-001](../registers/CHG-2026-09-13-linux-first-server-runtime-re-evaluation.md) — predecessor hashes, scope và kết quả verification thực chạy |
| Nguồn fact mới | [IE-RES-TECH-LINUX-20260913-001](../../../../research/2026-09-13-linux-first-server-platform-support-check.md) — first-party Ubuntu, Temurin, Boot, PGDG, backup/monitoring; informative only |
| Tech context của anh | Ưu tiên Linux-first Server; hạ tầng Windows Server sẵn có không có lợi thế chọn stack; Server được phép khác runtime với Windows Desktop/Workspace. Không phải Product Scope hoặc approval. |
| Ma trận quyết định | `IE-KNW-TECH-DEC-001@0.1 → @0.2`; tách Server OS, Server runtime và Windows client runtime; chọn một Server stack Java 25/Temurin 25/Spring Boot 4.1.x/Modulith |
| Tech | `TECH-001@0.9 → @0.10`; .NET 10/ASP.NET Core thành runner-up, PostgreSQL 18 giữ độc lập; Server-dependent JDBC/Flyway/Spring Security/Session/Integration/Batch/Actuator/Maven thay lựa chọn .NET tương ứng |
| Server OS/packaging | Ubuntu 26.04 `SELECT — platform direction`; official base support có nguồn; exact build Q-14 `NOT-RUN`; signed/versioned executable-JAR bundle + systemd thay custom application `.deb` |
| Windows client | WPF/WebView2 Desktop, .NET 10 per-user Workspace và Windows Format Worker riêng khi cần giữ nguyên; server/client contract HTTPS/JSON/OpenAPI, stable IDs và idempotency |
| Core/roadmap | DOC-05 `0.16 → 0.17` chỉ đồng bộ candidate Server Tech rows; 30 diagram và architecture semantics không đổi. DOC-07 `0.6 → 0.7` chỉ route Tech mới; 56 task, 756 giờ và gate không đổi. |
| Review, authority và qualification | Engineering Recommendation `COMPLETE`; Product Decision Authority Approval `NOT-RUN`; Q-01…Q-14 `NOT-RUN`; PG3/PG4 không `PASS` |
| Product impact | **No Product Scope Change**; không đổi FTR, REQ, DOC-04/05/06/08 semantics, DDM capability semantics hoặc ADR meaning |

Mục 21 và các ảnh chụp/version cũ ở trên là lịch sử đúng tại thời điểm ghi. Chúng không phải stack
Server đang được khuyến nghị sau bản kế nhiệm này.

## 23. Chỉnh lý rationale và dependency của Linux Server — 13/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-TECH-LINUX-002](../registers/CHG-2026-09-13-linux-server-technology-rationale-refinement.md) — focused correction, predecessor hashes và verification thực chạy |
| Ma trận quyết định | `IE-KNW-TECH-DEC-001@0.2 → @0.3`; Java vẫn thắng hẹp nhờ Modulith alignment và JDK distribution/support optionality; không dùng JDBC, Integration/Batch, performance, scale hay “enterprise” làm lợi thế |
| Tech | `TECH-001@0.10 → @0.11`; persistence so đối xứng, full-stack lifecycle tách khỏi JDK runway, session choice và Q-05/Q-06/Q-13/Q-14 được làm rõ |
| Dependency classes | Core baseline không chứa Spring Session JDBC, Spring Integration hay Spring Batch; ba thành phần này chỉ `CONDITIONAL` theo trigger cụ thể; ORM/broker/Redis/dedicated search và authority khác tiếp tục `DEFERRED` |
| DOC-05 | `0.17 → 0.18`; giữ Linux-first Server và Windows Format Worker riêng, nhưng exact distro/runtime/framework/database/package thuộc TECH/matrix; toàn bộ Mermaid source và architecture semantics không đổi |
| DOC-07 | Giữ nguyên `0.7` và historical route tới TECH@0.10; catalogue/change record route TECH@0.11 hiện hành; lịch, task, giờ và gate không đổi |
| Independent choices | PostgreSQL 18, Ubuntu 26.04 platform direction, executable-JAR/systemd và .NET Windows client giữ nguyên |
| Review, authority và qualification | Product Decision Authority `NOT-RUN`; Q-01…Q-14 `NOT-RUN`; PG3/PG4 không `PASS` |
| Product impact | **No Product Scope Change**; không đổi FTR, REQ, Feature, Spec, DDM capability semantics, architecture invariant, ADR hay gate state |

## 24. Mở lại Client/UI stack với Flutter challenger — 14/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-TECH-CLIENT-001](../registers/CHG-2026-09-14-client-ui-stack-re-evaluation.md) — baseline, predecessor hashes, phạm vi và trạng thái kiểm tra |
| Nguồn research | [IE-RES-TECH-CLIENT-20260914-001](../../../../research/2026-09-14-flutter-client-ui-stack-evidence.md) `0.1 → 0.2`; trả lời 16 câu Flutter/Dart bằng nguồn first-party và giữ mọi kết quả IDEA-specific là `NOT-RUN`/`QUALIFICATION-UNKNOWN` |
| Ma trận quyết định | `IE-KNW-TECH-DEC-001@0.3 → @0.4`; so sánh A–F: React/WPF/WebView2, Flutter Web/Windows, browser-only, Electron, Tauri và WinUI 3; thêm bốn strongest-case challenge và Q-15 |
| Tech | `TECH-001@0.11 → @0.12`; kết luận `KEEP CURRENT BASELINE, BUT FLUTTER REMAINS QUALIFICATION CHALLENGER`; Server Linux/Java/Spring/PostgreSQL không đổi |
| Roadmap metadata | `DOC-07@0.8 → @0.9`; chỉ route matrix@0.4, TECH@0.12 và Q-15; lịch, 56 task, 756 giờ, requirement và gate không đổi |
| Candidate disposition | A `SELECT` + qualification; B Flutter `ALTERNATIVE` + qualification challenger; C cần Product Decision riêng; D reject cho Core v0; E/F alternative cần qualification |
| Qualification | Q-15 same-slice PoC có acceptance envelope đo được nhưng chưa thực hiện; mọi test/benchmark/approval vẫn `NOT-RUN`, ngưỡng chưa được authority chốt giữ `BLOCKED` |
| Product impact | **No Product Scope Change**; không đổi FTR, REQ, Feature, Spec, DOC-01…06/08 semantics, architecture, DDM capability semantics, ADR hay PG state |

## 25. Sửa review Client/UI control và Flutter IPC — 14/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-TECH-CLIENT-002](../registers/CHG-2026-09-14-client-ui-stack-review-correction.md) — successor correction với predecessor hashes và verifier provenance |
| Nguồn research | `IE-RES-TECH-CLIENT-20260914-001@0.2 → @0.3`; A trở thành `SELECT — PROVISIONAL QUALIFICATION CONTROL`; không claim fewer seams/lower risk |
| Ma trận quyết định | `IE-KNW-TECH-DEC-001@0.4 → @0.5`; sửa Q-08 và Q-10 để Flutter là active Q-15 challenger thay vì deferred |
| Tech | `TECH-001@0.12 → @0.13`; làm rõ topology A/B và giữ nguyên recommendation `KEEP CURRENT BASELINE, BUT FLUTTER REMAINS QUALIFICATION CHALLENGER` |
| Flutter IPC | Q-15 thử direct Dart FFI → Win32 named pipe trước; chỉ thêm narrow C ABI/C++ shim hoặc Flutter plugin khi có blocker đo được và ghi nhận |
| Roadmap metadata | `DOC-07@0.9 → @0.10`; chỉ route research/matrix/Tech correction; lịch, 56 task, 756 giờ, requirement và gate không đổi |
| Verification | Repository/diagram validators tiếp tục `NOT-RUN` theo direct user execution override; không có GitHub status-check evidence và không suy diễn PASS |
| Product impact | **No Product Scope Change**; không đổi FTR, REQ, Feature, Spec, DOC-01…06/08 semantics, architecture, Server stack, DDM capability semantics, ADR hay PG state |

## 26. Chọn Core v0 Technology Stack Engineering Baseline — 15/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-TECH-BASELINE-001](../registers/CHG-2026-09-15-core-v0-technology-stack-baseline.md) — decision boundary, predecessor hashes, Client reopen triggers và non-impact |
| Chuẩn tài liệu | [IE-STD-TECH-STACK-001@0.1](../../../../agents/technology-stack-documentation-standard.md) — reusable repository process standard; product normativity `INFORMATIVE`; không tuyên bố conformity |
| Ma trận quyết định | `IE-KNW-TECH-DEC-001@0.5 → @0.6`; Engineering Technology Selection `COMPLETE`; Core v0 Engineering Baseline `SELECTED` |
| Tech | `TECH-001@0.13 → @0.14`; trình bày stack, rationale, alternatives, risks, qualification và tám `TRIGGER-CLIENT-*` cho sếp phản biện |
| Client | Option A React/WPF/WebView2 + `.NET Workspace` là `SELECT — CORE V0 ENGINEERING BASELINE`; Flutter là `EVALUATED ALTERNATIVE — NOT SELECTED FOR CORE V0` |
| Q-15 | Giữ nguyên bằng chứng Phase 1–3 và kết luận `PARTIAL / NO WINNER`; không nói Flutter thất bại hoặc React thắng thí nghiệm |
| Technology views | [IE-ARC-TECH-VIEW-001@0.1](../technology/IDEA-core-v0-technology-architecture-views.md) có `TECH-D01…D08`; [IE-VEV-TECH-VIEW-001](../registers/VEV-2026-09-15-technology-architecture-view-set.md) ghi 8/8 render/open `PASS`; architecture approval và implementation `NOT-RUN` |
| Roadmap metadata | `DOC-07@0.10 → @0.11`; chỉ cập nhật route/trạng thái Tech; lịch, 56 task, 756 giờ, requirements và gate không đổi |
| Approval và gate | Product Decision Authority review/approval `NOT-RUN`; Q-01…Q-14 `NOT-RUN`; PG3/PG4 `NOT-RUN` |
| Product impact | **No Product Scope Change**; không đổi Feature, Spec, FTR, REQ, DOC-01…06/08, architecture authority hoặc accepted ADR |

## 27. Lập lại roadmap Technical Pilot — 17/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-ROADMAP-TP-001](../registers/CHG-2026-09-17-technical-pilot-roadmap-rebaseline.md) |
| Roadmap | `DOC-07@0.12 → @0.13`; mốc 31/12 được định nghĩa là Technical Pilot, không phải full Core v0 hoặc rollout |
| Kế hoạch | `IE-PLAN-DEC2026-002@0.1`; 35 work package, 512 giờ công việc và 88 giờ dự phòng trong 600 giờ ngày thường |
| Phase và milestone | PH0–PH5 là sáu khoảng thực hiện; MS0–MS5 là sáu điểm review/decision không có thời lượng; D0 là checkpoint quyết định Vault successor trước MS0 |
| Kanban CARIO | `IE-PLAN-DEC2026-002-KANBAN@0.2`; 53 card thực hiện/512 giờ và 7 card quyết định-mốc/0 giờ, theo trạng thái board công ty; card được viết theo ba ý “mục đích – cần làm – xong khi”; 88 giờ dự phòng không được biến thành task |
| Lịch cũ | `IE-PLAN-DEC2026-001@0.1` với 56 task/756 giờ được giữ ở Git commit `aabf02ffdef4ca901a84d39af5a467d39fd2c0d2`, không còn là execution baseline |
| Capacity | Một coder; không tính thứ Bảy vào baseline; bắt buộc reforecast sau MS0 và MS3 |
| Approval và gate | Project user duyệt hướng roadmap; Product Decision Authority vẫn chỉ quyết định Feature/Spec/Tech; exact Vault successor approval và PG4 `NOT-RUN` |
| Product impact | **No Product Scope Change**; không đổi 14 Feature groups, 90 successor REQ rows, Tech Stack, Q-15, Product Decision Authority predecessor approval, PG3 hoặc PG4 |

## 28. Ghi nhận hướng nội bộ trước, thương mại sau — 17/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-COMMERCIAL-DIR-001](../registers/CHG-2026-09-17-internal-first-commercial-direction.md) |
| Mục đích hiện tại | IDEA Engineering tiếp tục chỉ phục vụ nội bộ trong vài năm tới; không có mục tiêu bán hàng, SaaS, thu phí hoặc khách hàng ngoài công ty trong Core v0 và Technical Pilot 2026 |
| Hướng dài hạn | Giữ khả năng phát triển thành sản phẩm thương mại qua một quyết định và gate riêng; không coi kết quả nội bộ là bằng chứng sẵn sàng thương mại |
| Vision / roadmap | `DOC-01@0.6 → @0.7`; `DOC-07@0.13 → @0.14`; chỉ làm rõ trajectory và claim boundary, không đổi lịch, effort, task hay milestone |
| Sổ kiểm soát | [IE-GOV-COMMERCIAL-001](../registers/GOV-future-commercial-readiness.md) tách safeguards dùng ngay, việc để sau, trigger bên ngoài, thẩm quyền và Commercial Readiness Gate |
| Kanban | `IE-PLAN-DEC2026-002-KANBAN@0.2 → @0.3`; thêm nguyên tắc dùng khi card liên quan, không thêm card, giờ, dependency, ngày hoặc milestone |
| Pháp lý | Tạo watchlist theo nguồn pháp luật chính thức; Legal Review Authority vẫn `BLOCKED`, mọi kết luận áp dụng/compliance `NOT-RUN` |
| Authority | Product Decision Authority vẫn chỉ quyết định Feature/Spec/Tech; boss được đề xuất làm Commercial Decision Authority, nhưng việc chấp nhận vai trò bổ sung chưa được ghi nhận chính thức |
| Product impact | Không đổi 14 Feature groups, 90 successor REQ rows, Tech Stack, Q-15, PDA approval hiện có, PG3, PG4 hoặc phạm vi Technical Pilot |

## 29. Chọn Node.js 24 LTS cho Web build — 23/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-TECH-NODE24-001](../registers/CHG-2026-09-23-node24-web-build-baseline.md) |
| Quyết định | Product Decision Authority duyệt Node.js 24 LTS làm major line dùng để build Web; Node.js không trở thành runtime của IDEA Server. |
| Ma trận và Tech brief | `IE-KNW-TECH-DEC-001@0.6 → @0.7`; `TECH-001@0.15 → @0.16`. |
| Technology views | `IE-ARC-TECH-VIEW-001@0.3 → @0.4`; [IE-VEV-TECH-VIEW-003](../registers/VEV-2026-09-23-node24-technology-view-refresh.md) ghi source/render/open và focused author review. |
| Qualification | Exact package graph, lockfile, Web build, test và release vẫn `NOT-RUN`. Retained Q-15 harness/evidence không bị sửa thành bằng chứng Node.js 24. |
| Product impact | Không đổi Feature, Spec, Product Scope, Q-15 (`PARTIAL / NO WINNER`), Format Worker toolchain, PG3 hoặc PG4. |

## 30. Làm rõ một Vault trong Core v0 — 23/09/2026

| Nội dung | Ghi nhận |
|---|---|
| Bản ghi thay đổi | [IE-CHG-PH0-CORR-002](../registers/CHG-2026-09-23-post-analysis-consistency-correction.md) |
| Technology views | `IE-ARC-TECH-VIEW-001@0.4 → @0.5`; TECH-D01/D02/D04/D05 thể hiện một Vault đang dùng trong Core v0 và một seam `DEFER` cho multi-vault tương lai. |
| Bằng chứng | [IE-VEV-TECH-VIEW-004](../registers/VEV-2026-09-23-one-vault-core-v0-technology-view-correction.md) giữ SVG/PNG, render manifest, standalone-open result và focused author review. |
| P01 | Chuẩn hóa reviewed planning baseline thành `IE-PLAN-DEC2026-003@0.2`, Appendix A@0.9 và Kanban@0.5 tại commit `303b7225...`; P01 `PASS` chỉ áp dụng cho exact input đó. |
| Product impact | Không đổi Feature, Spec, Tech selection, Product Scope, Q-15, PDA approval, PG3 hoặc PG4. Multi-vault runtime vẫn ngoài Core v0. |
