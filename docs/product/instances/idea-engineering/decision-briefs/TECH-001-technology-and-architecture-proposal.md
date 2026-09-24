# TECH-001 — Quyết định kỹ thuật đề xuất cho IDEA Engineering Core v0

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu / Stable ID | `TECH-001` |
| Phiên bản / ngày soạn | `0.16` / `23-09-2026` |
| Trạng thái | `Draft` — Engineering Technology Selection đã hoàn tất; Node.js 24 LTS Web-build successor được Product Decision Authority duyệt; các successor khác giữ trạng thái riêng |
| Vai trò | Brief tiếng Việt để sếp xem xét trục Tech; không phải Core Product Document và không tự phê duyệt stack |
| Người soạn / review | Principal Product Author — trợ lý soạn; review nội bộ đầy đủ `NOT-RUN` |
| Người quyết định | Sếp — `Product Decision Authority` |
| Product Normativity | `INFORMATIVE` — không tạo FTR/REQ và không đổi hành vi sản phẩm |
| Cơ sở chi tiết | [`IE-KNW-TECH-DEC-001@0.7`](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md); [`IE-STD-TECH-STACK-001@0.1`](../../../../agents/technology-stack-documentation-standard.md); Q-15 [`Phase 1`](../registers/VEV-2026-09-14-q15-client-ui-architecture-qualification.md), [`Phase 2`](../registers/VEV-2026-09-15-q15-client-ui-architecture-qualification-phase2.md), [`Phase 3`](../registers/VEV-2026-09-15-q15-client-ui-architecture-qualification-phase3.md); các nguồn chính thức được ghim trong matrix |
| Baseline sản phẩm | `IDEA-C1-ANALYSIS-DESIGN-001`; DOC-01@0.6, DOC-02@0.2, DOC-03@0.7, DOC-04@0.14, DOC-05@0.21, DOC-06@0.17, DOC-07@0.12, DOC-08@0.13, GOV@0.3, VVP@0.17 và các ADR đã Accepted/Proposed theo trạng thái ghi trong từng ADR |
| Sơ đồ kỹ thuật | [`IE-ARC-TECH-VIEW-001@0.5`](../technology/IDEA-core-v0-technology-architecture-views.md) gồm `TECH-D01…D08`; Core v0 hiển thị một Vault đang dùng và giữ đường mở rộng multi-vault; successor render/review được ghi riêng, bằng chứng cũ giữ lịch sử |
| Change Record | [`IE-CHG-PH0-CORR-002`](../registers/CHG-2026-09-23-post-analysis-consistency-correction.md); [`IE-CHG-TECH-NODE24-001`](../registers/CHG-2026-09-23-node24-web-build-baseline.md); [`IE-CHG-VAULT-XFER-001`](../registers/CHG-2026-09-17-multi-location-vault-transfer-architecture.md); [`IE-CHG-TECH-BASELINE-001@0.1`](../registers/CHG-2026-09-15-core-v0-technology-stack-baseline.md) |
| Supersedes / Superseded by | Supersedes `TECH-001@0.15`; superseded by `NOT-APPLICABLE` |
| Giới hạn | Chỉ ghi nhận lựa chọn ở cấp Engineering để trình sếp. Chưa viết production code, chưa cài đặt/triển khai, chưa mua license/hạ tầng và không tuyên bố PG3/PG4 `PASS`. |
| Trạng thái quyết định | Engineering Technology Selection: `COMPLETE`; Node.js 24 LTS successor: PDA `APPROVED` ngày 23-09-2026; exact predecessor Tech baseline 0.14: PDA `APPROVED`; exact Vault successor: PDA state giữ theo record riêng; Q-01…Q-14: `NOT-RUN`; Q-15: `PARTIAL / NO WINNER`; PG3/PG4: `NOT-RUN` |

## 1. Kết luận để sếp phản biện

Engineering đã chọn **một bộ baseline Core v0 cụ thể để trình sếp xem xét**:

```text
Ubuntu Server 26.04 LTS — SELECT platform direction; exact build Q-14 NOT-RUN
Java 25 LTS / Eclipse Temurin 25 / Spring Boot 4.1.x + Spring Modulith 2.1.x
PostgreSQL 18 + Spring JDBC/JdbcClient/pgJDBC + Flyway versioned SQL
Maven Wrapper + Boot BOM; Spring Security với ordinary server-side sessions
Bounded Spring tasks + transactional outbox dispatcher; Actuator/Micrometer/OTel/JFR
React 19.3 + TypeScript 7 + Vite 8.3 / Node.js 24 LTS build
WPF net10.0-windows + WebView2 Evergreen
Workspace .NET 10 riêng theo từng Windows user, IPC named pipe có xác thực
Multi-location Artifact Gateway/Vault boundary; initial filesystem-backed Vault Adapter remains the Core v0 implementation direction; exact Gateway runtime/toolchain/provider `NOT-RUN`
Separate Windows Format Worker khi CAD/Office/license yêu cầu
Signed/versioned executable-JAR bundle + systemd trên một Server VM/company-managed; Core v0 dùng một Vault và giữ seam để bổ sung nhiều Vault sau; Server vẫn không HA
Actuator/Micrometer/OpenTelemetry/JFR + PostgreSQL PITR/WAL và backup độc lập
```

Kết luận Client/UI là:

> **Option A — React + WPF/WebView2 + `.NET Workspace` — là baseline Engineering cho Core v0.**
>
> **Option B — Flutter Web/Windows + Dart + narrow Win32 C++ shim + `.NET Workspace` — là phương án đã đánh giá nhưng chưa chọn cho Core v0.**

Q-15 vẫn là `PARTIAL / NO WINNER`. Điều đó có nghĩa thí nghiệm A/B chưa chứng minh bên nào thắng;
không có nghĩa Engineering bị cấm chọn một baseline dựa trên toàn bộ bối cảnh sản phẩm. Tài liệu này
không nói Flutter thất bại, React thắng benchmark hay Option A luôn ít rủi ro hơn.

Đây là **khuyến nghị kỹ thuật**, không phải quyết định của sếp. Bối cảnh mới do anh cung cấp:
ưu tiên Linux-first cho Server; hạ tầng Windows Server hiện có được tính **0 điểm lợi thế**; Server
được phép khác runtime với Windows client. Vì thế quyết định OS Server, runtime Server và runtime
Desktop/Workspace được tách ra. Sau khi tính lại, Engineering chọn Java/Spring với lợi thế **hẹp** nhờ
Spring Modulith phù hợp trực tiếp với modular monolith, nền tảng Linux Server trưởng thành và khả năng
lựa chọn nguồn phân phối/hỗ trợ JDK.
.NET/ASP.NET Core là runner-up mạnh nhờ một ngôn ngữ chung và hệ công cụ gọn hơn. Spring Integration/
Batch chỉ là optionality có điều kiện; JDBC không phải lợi thế riêng của Java. Không có kết luận Java
nhanh hơn, scale hơn hoặc “enterprise-grade” hơn.

## 2. Recommended Core v0 Stack

| Layer | Trạng thái | Lựa chọn đề xuất | Vai trò và điều kiện |
|---|---|---|---|
| Server language/runtime | `SELECT` | Java 25 LTS / Eclipse Temurin 25 | Named distribution có feed Ubuntu 26.04 và community runway tới ít nhất 09/2031; SLA thương mại và patch owner chưa được duyệt. |
| Server framework | `SELECT` | Spring Boot 4.1.x + Spring Modulith 2.1.x | HTTPS API, kiểm tra cycle/API/dependency Module, module-scoped test; owner boundary vẫn do IDEA định nghĩa. |
| Build/dependency authority | `SELECT` | Maven Wrapper + Spring Boot BOM | Ghim toolchain/dependency graph, build lặp lại, SBOM/license/CVE và lịch patch riêng cho JDK/Boot. |
| Architecture style | `SELECT` | Deep-module modular monolith | Một Server deployable, Module sở hữu state/Interface; Coordinator chỉ orchestration/UoW, không CRUD authority. |
| Database | `SELECT` | PostgreSQL 18 | Metadata, workflow, structure, authorization, Audit, search projection và outbox; Artifact bytes ở kho riêng. Minor dùng bản supported tại qualification. |
| Persistence | `SELECT` | Spring JDBC/`JdbcClient` + Boot-managed pgJDBC | SQL/mapping thuộc từng owner Module; shared Spring relational UoW cho operation cần atomicity. JPA/Data JDBC/jOOQ không là default song song. |
| Schema migration | `SELECT` | Boot-managed Flyway + reviewed versioned SQL, expand–migrate–contract | Một schema authority; preflight release riêng, không tự destructive down migration; rollback DB bằng forward repair/restore. |
| Account/authentication | `SELECT` | Spring Security 7.1.x ordinary server-side sessions + IDEA Actor/Account/Login Identity domain | Framework cho authentication/session/CSRF; one-instance registry/invalidation và request/commit revalidation xử lý revoke. Restart kết thúc session an toàn; Spring Session JDBC chỉ `CONDITIONAL`. |
| Authorization | `SELECT` | IDEA Access Policy | Server/IAM establish `ActorContext`; policy resolve IAM eligibility + Project/Group + Role Assignment/version + Scope; owner gate và commit-time revalidation sau đó. |
| API | `SELECT` | Versioned HTTPS JSON REST + OpenAPI 3.1 | Stable Resource/Operation ID, expected state và idempotency key; client không truy cập DB và không tự gửi ActorId có thẩm quyền. |
| Integration publication | `SELECT` | PostgreSQL transactional outbox + bounded Spring dispatcher + plain owner-specific Adapter | Outcome/Audit/outbox atomic trong relational UoW; consumer idempotent. Spring Integration chỉ `CONDITIONAL` khi có contract cụ thể; broker chưa bắt buộc. |
| Web frontend | `SELECT — CORE V0 ENGINEERING BASELINE` | React 19.3 CSR | Một business UI dùng cho browser và trong WebView2; static build được Server phục vụ; không thêm SSR/RSC. Q-15 vẫn `PARTIAL / NO WINNER`. |
| Web compiler | `SELECT` | TypeScript 7.0 | CLI/type-checking line được chọn; TS6 chỉ là compatibility lane cho plugin dùng compiler API chưa ổn định. |
| Web build | `SELECT` | Vite 8.3 + Node.js 24 LTS build line | Dùng Node.js 24 LTS đã được duyệt; máy hiện quan sát `v24.16.0`. `npm ci` + `package-lock.json` và SBOM; Node không chạy như production Server. Exact patch/build vẫn phải được kiểm tra. |
| Web routing | `SELECT` | React Router 7 data APIs | Loaders/actions/error boundaries ở client; API/authorization vẫn do Server quyết định. |
| Search | `SELECT` | Rebuildable PostgreSQL Discovery Projection | ID/title/filter/sort/page/permission predicates; Japanese tokenization và FTS semantics chưa được chứng minh. |
| Desktop shell | `SELECT — CORE V0 ENGINEERING BASELINE` | WPF `net10.0-windows` + embedded React | Giữ bề mặt Web/Desktop/Web-rendered Desktop; native code chỉ nhận các intent command được phép và không viết lại business UI bằng XAML. Q-10/Q-11 `NOT-RUN`; Q-15 `PARTIAL / NO WINNER`. |
| Embedded renderer | `SELECT` | WebView2 Evergreen | Ưu tiên runtime được IT cập nhật tập trung; Fixed chỉ là fallback khi policy/offline bắt buộc. |
| Workspace runtime | `SELECT` | Separate per-user `.NET 10` process | Local materialization/custody, hash, journal, resume, external CAD/Office launch và recovery; không sở hữu Product Definition. |
| Workspace IPC | `SELECT` | Current-user named pipes + authenticated/versioned/scope-bound messages | ACL không đủ một mình; có replay/size/version checks, cross-user refusal và reconnect an toàn. |
| Artifact custody / Vault | `SELECT — ARCHITECTURE BOUNDARY`; exact Gateway runtime/toolchain/provider `NOT-RUN` | Multi-location Artifact Gateway/Vault + provider-neutral Adapter; initial Vault Adapter direction remains filesystem-backed | Server authorizes, selects location and commits product state. Workspace transfers large bytes directly through a selected Gateway using a short-lived scoped grant. Gateway verifies bytes and returns a Transfer Receipt but cannot publish a Generation. Raw SMB/path and permanent Vault credential are not exposed. Exact host count, durability threshold and failure domains remain open. |
| Format Worker | `SELECT` | Separate Windows worker + exact Format Adapter profile | Worker tạo candidate; owner Module mới verify/accept Representation theo Generation nguồn. Manual upload vẫn có. |
| Server OS | `SELECT — platform direction` | Ubuntu Server 26.04 LTS | Canonical lifecycle, Temurin 25 và PGDG PostgreSQL 18 package paths đã có official source; Q-14 vẫn phải qualify exact operational build. |
| Deployment packaging | `SELECT` | Signed/versioned executable-JAR bundle + systemd, Temurin host-managed; config/secrets ngoài bundle | Ít lớp hơn custom `.deb`; preflight Flyway, signature/SBOM, health check, patch và rollback phải thử. |
| Reverse proxy/TLS | `SELECT` | Company-approved Nginx baseline + managed certificate | TLS/origin/header policy thuộc deployment; Nginx không thay Access Policy. |
| Background jobs | `SELECT` | Bounded Spring task execution/scheduling; Format Worker tách riêng | Outbox/maintenance có Operation ID, persisted state, bounded retry/lease và idempotency. Spring Batch chỉ `CONDITIONAL` khi có workload restartable/chunked thực tế. |
| Observability | `SELECT` | Spring Actuator/Micrometer + OpenTelemetry/OTLP + structured JSON logs + JFR/`jcmd` | Audit Evidence tách khỏi log; backend/export/retention để company chọn và phải qualify. |
| Backup/recovery | `SELECT` có điều kiện | PostgreSQL base backup + WAL/PITR + coordinated Artifact/config/policy/key backup ở failure domain khác | Vault replication supports online custody but is not backup. RTO ≤4 giờ làm việc và RPO ≤1 giờ chỉ là mục tiêu sơ bộ; chưa có đo đạt. Nhiều Vault không làm Server thành HA. |

### 2.1 Phân loại dependency

| Class | Thành phần | Quy tắc |
|---|---|---|
| `CORE BASELINE` | Java 25/Temurin; Boot Web; Modulith; Security với ordinary server-side sessions; JDBC/`JdbcClient`/pgJDBC; Flyway/versioned SQL; PostgreSQL 18; Maven Wrapper/BOM; bounded task scheduling + outbox dispatcher; Actuator/Micrometer/OpenTelemetry/JFR; React/TypeScript/Vite; WPF/WebView2; `.NET Workspace` | Có trong dependency graph ban đầu. Q-01…Q-14 vẫn `NOT-RUN`; Q-15 `PARTIAL / NO WINNER`. |
| `CONDITIONAL` | Spring Session JDBC | Chỉ thêm khi có yêu cầu được duyệt về multi-instance/session survival hoặc measured coordination need mà one-instance design không đáp ứng an toàn. |
| `CONDITIONAL` | Spring Integration | Chỉ thêm khi một external contract cụ thể được duyệt chứng minh EIP/adapter value tốt hơn plain owner-specific Adapter. |
| `CONDITIONAL` | Spring Batch | Chỉ thêm khi có workload restartable/chunked/skippable và recovery contract thực tế. |
| `DEFERRED` | JPA/Hibernate, Spring Data JDBC, jOOQ, broker, Redis, Elasticsearch/OpenSearch và infrastructure authority khác | Không cài mặc định; cần owner, measured need, lifecycle/recovery impact và change decision. |

## 3. Server decision: vì sao Engineering chọn Java sau khi tách khỏi Windows client

### 3.1 Hai finalist nghiêm túc

| Candidate | Phân loại | Kết luận |
|---|---|---|
| `Java 25 LTS + Eclipse Temurin 25 + Spring Boot 4.1.x` | `SELECT` | Server Core v0 được Engineering khuyến nghị; Temurin SLA/commercial support còn phải quyết định. |
| `.NET 10 LTS + ASP.NET Core 10` | `ALTERNATIVE` | Runner-up Linux hợp lệ; không bị loại vì thiếu Ubuntu 26.04 support. |

Microsoft đã có .NET 10 trong Ubuntu 26.04 package feeds; PostgreSQL PGDG có `resolute`/18; Adoptium
có `temurin-25-jdk` trong feed `resolute`; Boot 4.1.1 chấp nhận Java 25 và có hướng dẫn `systemd`.
Các fact và link first-party nằm ở [matrix §2B](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md#2b-fresh-linux-first-platform-support-check).
Đây là support/availability công bố, **không** là Q-14 PASS cho bản IDEA triển khai.

| Tiêu chí Server trên Linux | .NET/ASP.NET Core | Java/Spring | Kết luận |
|---|---|---|---|
| Linux/systemd, PostgreSQL, transaction, security/session, streaming, telemetry, container tùy chọn và tách service sau này | Có đường chính thức/có thể làm | Có đường chính thức/có thể làm | `DRAW` hoặc phụ thuộc Q-01/Q-04/Q-12/Q-14; không có kết luận hiệu năng. |
| Kiểm tra ranh giới modular monolith | Tự ghép project/analyzer/architecture tests | Spring Modulith kiểm tra cycle, API package và dependency, hỗ trợ module-scoped tests | Java lợi thế trực tiếp với architecture đã chọn. |
| Explicit SQL/query ownership | Raw Npgsql bộc lộ SQL, lock và owner transaction rõ | Spring JDBC/`JdbcClient` bộc lộ SQL, lock và owner transaction rõ | `DRAW`; JDBC được chọn bên trong Java vì hợp convention IDEA, không phải Java superiority. |
| ORM path | EF Core/Npgsql là ORM trưởng thành | JPA/Hibernate/Spring Data là ORM trưởng thành | `DRAW / QUALIFY`; cả hai không là default ban đầu và phải có module-specific evidence. |
| Adapter doanh nghiệp | Plain adapter + thư viện .NET; integration library tùy nhu cầu | Plain adapter + thư viện Java; Spring Integration có điều kiện | `DRAW`; chưa có contract Core v0 bắt buộc Integration. |
| Batch/import/export | Worker/persisted-operation pattern; library tùy nhu cầu | Task/persisted-operation pattern; Spring Batch có điều kiện | `DRAW / CONDITIONAL`; chưa có workload restartable đủ để chọn Batch. |
| Runtime distribution/support | .NET 10 tới 14-11-2028 theo Microsoft | Temurin 25 community tới ít nhất 09/2031 và có nhiều distribution/support channel | Java chỉ lợi thế về runtime optionality; entitlement chưa chốt. |
| Full-stack lifecycle | Runtime/ASP.NET Core/NuGet dependencies đều phải theo dõi | JDK/Boot/Modulith/Maven/transitives có các clock riêng | `UNKNOWN / QUALIFY`; JDK runway không kéo dài Spring, và mốc .NET 2028 không chứng minh tổng burden cao hơn. |
| Số toolchain toàn hệ thống | C#/.NET/NuGet dùng chung với Windows client | Java/JVM/Maven/Spring thêm vào C#/.NET/NuGet/WPF/WebView2 | .NET lợi thế maintainability; mức chi phí thật Q-13 `NOT-RUN`. |
| Tải tương đương của IDEA | Chưa chạy | Chưa chạy | Relative performance `UNKNOWN`; không gán Java hoặc .NET thắng scale. |

Java được chọn với lợi thế hẹp nhờ Spring Modulith kiểm tra cycle/API/dependency và hỗ trợ module test/documentation/
observability khi áp dụng, cộng với một Linux Server platform trưởng thành và optionality phân phối/
hỗ trợ JDK. IDEA domain ownership vẫn là architecture authority; framework không tự tạo boundary.
Spring Integration/Batch không góp điểm vì chưa có contract/workload bắt buộc. Spring JDBC cũng không
góp điểm so với raw Npgsql. .NET thắng về đơn giản ngôn ngữ/toolchain và có ASP.NET Core/Kestrel,
async I/O, Worker Services, EF/Npgsql và diagnostics rất tốt, nhưng điểm dùng chung C# không phải yêu
cầu architecture Server. Linux Server và Windows Workspace vốn đã tách OS, triển khai, patch,
supervision, security, incident và failure domain. Câu hỏi nếu Desktop/Workspace là hộp đen độc lập
ngôn ngữ: Engineering vẫn chọn Java, nhưng chỉ với chênh lệch hẹp này.

Hai runtime là chi phí có thật, không bị che. Q-13 phải đo build, cập nhật CVE, SBOM, onboarding,
debug/incident rotation và support owner cho cả Java Server lẫn .NET Windows. Ngôn ngữ không rò qua
boundary: Server/Workspace dùng HTTPS, JSON, OpenAPI, stable Resource/Operation ID, expected state,
idempotency và Server authority; named pipe chỉ ở nội bộ Windows client.

### 3.2 Điều kiện chuyển lại .NET

Chỉ chuyển khi Q-01/Q-12/Q-14 cho thấy Java không qua điều kiện correctness/security/diagnostics/
platform bắt buộc mà equivalent .NET candidate qua; hoặc Q-13 đo staffing, patching, onboarding,
incident và SBOM burden vượt ngưỡng material do management duyệt trong khi equivalent .NET candidate
đạt mọi mandatory behavior với tổng rủi ro thấp hơn; hoặc công ty có một .NET Server support platform
thực sự an toàn hơn.
Windows Server đang có sẵn, PC kỹ sư chạy Windows, hay DDM/Aras dùng stack nào đều không phải lý do.

## 4. Database và persistence

### 4.1 PostgreSQL là lựa chọn ban đầu

PostgreSQL 18 được chọn vì transaction isolation/row lock, JSON, index, Unicode/ICU options,
PITR/WAL, major support đến 2030-11-14 và license optionality phù hợp topology Ubuntu. SQL Server
2025 có extended-support horizon dài hơn, nhưng hiện chưa có bằng chứng company entitlement/DBA/
restore advantage đủ lớn để bù chi phí license/edition và Linux portability ở giai đoạn này. “Không
thu phí license” không có nghĩa không tốn DBA, backup, monitoring hay incident response.

SQL Server 2025 là `ALTERNATIVE`: có thể thắng nếu công ty đã có DBA, license/edition, toolchain và
restore support thực tế. Không chọn nó chỉ vì DDM dùng SQL Server; cũng không chọn PostgreSQL chỉ vì
open source. Q-02/Q-03/Q-07/Q-14 là căn cứ chuyển đổi.

Không dùng database để lưu byte Artifact. DB giữ metadata, authorization, workflow, structure,
Audit, projection, configuration và outbox; các Vault giữ byte, còn DB giữ location/digest/policy.

### 4.2 Cách truy cập dữ liệu

- Spring JDBC/`JdbcClient` + Boot-managed pgJDBC là default SQL-first. Từng Module sở hữu query,
  mapping, lock và projection của mình; `COPY`/bulk, outbox và search đều theo boundary owner.
- Đây là lựa chọn bên trong Java vì hợp với explicit transaction/query ownership của IDEA. Raw Npgsql
  cho .NET cung cấp cách explicit-SQL tương đương; ở tầng ORM, EF Core và JPA/Hibernate/Spring Data
  đều là mature candidates cần qualify theo Module. Không dùng JDBC làm lý do Java thắng.
- JPA/Hibernate và Spring Data JDBC là lựa chọn bổ sung có giới hạn nếu một aggregate cụ thể chứng
  minh lợi ích; jOOQ cần xác nhận Java 25 edition/license. Không có hai default convention hay
  generic repository/CRUD authority.
- Coordinator không sở hữu entity hay policy; chỉ mở shared relational UoW cho operation được khai
  báo. Owner outcome, Audit Evidence và outbox commit theo boundary hiện hành.

Boot-managed Flyway (`flyway-core` + `flyway-database-postgresql`) với reviewed versioned SQL là schema
authority duy nhất cho mọi Core component được cài; tắt framework schema auto-initialization cạnh
tranh. Conditional dependency nào được thêm sau cũng phải đưa migration đã review vào cùng authority.
PostgreSQL 18 có trong danh sách Flyway verified versions. Release dùng
expand–migrate–contract và chạy migration như bước preflight riêng, không tự migrate lúc app start.
Application rollback không tự rollback schema; destructive change cần forward repair hoặc restore.

## 5. Identity và authorization

Spring Security 7.1.x với ordinary server-side sessions được chọn cho authentication, password
encoding, session-fixation và CSRF. IDEA vẫn sở hữu Actor, Account, Login Identity, eligibility,
lockout/recovery policy và Audit. Web dùng secure HttpOnly/SameSite cookie và CSRF protection; không
tạo OAuth/OIDC server mới.

Core v0 ban đầu là một Server instance. `REQ-IAM-004` được đáp ứng bằng one-instance session registry/
invalidation, từ chối ở protected request kế tiếp và revalidate eligibility/authorization trước
commit. Restart làm mọi session hết hiệu lực; đây là fail-safe vì Workspace giữ local candidates.
Spring Session JDBC là `CONDITIONAL`, chỉ thêm khi có yêu cầu được duyệt về multi-instance/session
survival hoặc measured coordination need đủ bù DB tables, cleanup, backup và lifecycle burden.

Desktop/WebView2 khởi tạo một binding session ngắn hạn do Server cấp; Workspace lưu material theo
Windows user bằng protected storage (DPAPI là candidate). Password/token không đi qua page JavaScript.
Bootstrap, refresh, revoke, re-authentication và same-user hostile client vẫn `NOT-RUN` trong Q-06,
Q-08, Q-11.

Luồng quyền bắt buộc giữ nguyên:

```text
Client gửi session proof
  ↓
Server/IAM establish ActorContext (không tin ActorId tự gửi)
  ↓
Access Policy: IAM eligibility + Project/Group + Role Assignment/version + Scope
  ↓
AuthorizationDecision
  ↓
Owner business gates
  ↓
commit-time revalidation
  ↓
COMMIT owner outcome + Audit + outbox theo UoW
```

IDEA Access Policy là product authority. Spring Security roles/authorities không thay thế Principal–Role–
Scope của IDEA. `AuthorizationDecision` cũng không phải `OwnerCommandOutcome`.

## 6. Web

Chọn React 19.3, TypeScript 7.0, Vite 8.3 và Node.js 24 LTS build line. Máy phát triển hiện
quan sát `v24.16.0`; exact package graph và build vẫn phải được kiểm tra bằng lockfile.
Package phải ghim trong lockfile/SBOM và dùng `npm ci`; patch current được cập nhật theo policy,
không ghi cứng “latest” vào Product Spec.

Đây là CSR SPA với React Router 7 data APIs, static assets phục vụ từ IDEA Server. Server vẫn là
authority cho dữ liệu và quyền. SSR, RSC, Next.js/full-stack Node và TypeScript 6 production compiler
đều `DEFER/REJECT FOR CORE V0`; TS6 chỉ tồn tại như compatibility lane nếu một plugin cần compiler
API ổn định hơn trong quá trình qualify.

Flutter Web 3.47.2 đã được đánh giá như một app-centric SPA hợp lệ, không bị loại bằng nhận xét “chỉ
dành cho mobile”. Nó có JavaScript target và Wasm target kèm JavaScript fallback. Tuy vậy, Core v0
hiện cần browser là bề mặt hạng nhất, chưa cần mobile hay desktop ngoài Windows, và bằng chứng
browser/renderer, accessibility, history, grid/tree, EN/VI/JA IME, copy/paste, printing và Release
vẫn chưa đầy đủ. Engineering chọn React cho Core v0 vì phù hợp trực tiếp với browser DOM, dùng lại
cùng business UI trong WebView2 và giảm công việc thay toàn bộ presentation path ở giai đoạn này.
Đây không phải kết quả chứng minh React thắng Q-15 hoặc luôn ít rủi ro hơn Flutter.

## 7. Desktop và Workspace

### 7.1 Shell được chọn

SRS hiện có Web, Desktop và Web-rendered Desktop obligations. Vì vậy browser-only + agent không thể
được chọn âm thầm mà không có follow-up Product Decision. Engineering chọn **WPF + WebView2
Evergreen** làm shell cài trên Windows cho Core v0.

WPF chỉ làm shell hẹp: window/lifecycle, WebView2 host, Workspace status và approved native intent
bridge. Business UI không được viết lại song song bằng WPF/XAML. Lựa chọn này phù hợp với máy kỹ sư
Windows, dùng cùng họ runtime `.NET 10` với Workspace và tái sử dụng React; không phải vì WPF mới
hơn, ít seam hơn hoặc đã được chứng minh luôn lower-risk. WinUI 3 là alternative nếu Q-10 chứng minh
lợi ích material về UI, accessibility, packaging hoặc support.

Flutter Windows có thể bỏ cả WPF và WebView2 khỏi installed presentation, dùng Dart/Flutter chung
với Flutter Web. Q-15 đã tạo bằng chứng từng phần cho direct Dart FFI/Win32 và narrow C++ shim,
nhưng không có cặp Release đầy đủ để chọn người thắng. FFI cũng không tự giải quyết authentication,
framing, replay, native handle/memory, async/cancellation hoặc recovery với external `.NET
Workspace`. Vì vậy Flutter được ghi đúng là `EVALUATED ALTERNATIVE — NOT SELECTED FOR CORE V0`,
không phải lựa chọn bị bác hay thất bại.

Hai topology lịch sử của Q-15 được giữ lại để giải thích bằng chứng, không dùng để suy diễn winner:

```text
A selected: React → WebView2 message → WPF → Win32 named pipe → .NET Workspace
B evaluated: Dart → FFI → Win32 named pipe → .NET Workspace
B evidence path: Dart → narrow C ABI/C++ shim or plugin → Win32 named pipe → .NET Workspace
```

Evergreen được chọn khi IT cho phép runtime cập nhật tập trung. Fixed Version chỉ dùng khi offline hoặc
policy cấm Evergreen; khi đó IDEA phải sở hữu binary, CVE response, rollout và rollback renderer.

### 7.2 Vì sao chọn Option A dù Q-15 chưa có người thắng

| Căn cứ | Ý nghĩa đối với Core v0 |
|---|---|
| Phạm vi sản phẩm | Core v0 cần Web và Windows; chưa có nhu cầu được duyệt cho mobile, macOS hoặc Linux desktop. |
| Dùng lại giao diện | React là business UI chung cho browser và WebView2; WPF không được trở thành một bộ giao diện thứ hai. |
| Tích hợp Windows | WPF shell và Workspace cùng dùng `.NET 10`, giao tiếp qua Named Pipe có xác thực và version. |
| Mức độ bằng chứng | Option A hiện có nhiều bằng chứng Web/Windows hơn. Thiếu môi trường Flutter chỉ là giới hạn bằng chứng, không phải bằng chứng Flutter thất bại. |
| Chi phí cơ hội | Với một người phát triển chính, thay cả Web lẫn Desktop presentation path trước khi có nhu cầu mới sẽ lấy thời gian khỏi các nghiệp vụ Core v0. |

Q-15 là thí nghiệm so sánh trong một phạm vi cố định. Quyết định Engineering còn phải xét toàn bộ
phạm vi sản phẩm, kiến trúc hiện có, năng lực vận hành và công việc chưa làm. Hai kết luận vì vậy
không mâu thuẫn: **baseline đã chọn**, nhưng **Q-15 vẫn `PARTIAL / NO WINNER`**.

### 7.3 Workspace là boundary riêng

Workspace `.NET 10` chạy per-user, không phải machine-wide service và không sở hữu Product Definition.
Nó giữ local file, hash, transfer journal, resumable transfer, phát hiện local change, mở Office/CAD
và recovery state. Lệnh nghiệp vụ vẫn đi qua Server. Với file lớn, Server cấp `Transfer Grant` ngắn hạn
cho đúng Operation, Artifact, Gateway, phạm vi byte, kích thước/digest và thời hạn; Workspace truyền
byte trực tiếp với Gateway đã chọn. Client không nhận credential lâu dài hoặc đường dẫn thô của Vault.
Gateway trả `Transfer Receipt` để Server kiểm tra lại; truyền xong chưa đồng nghĩa Check-in thành công.

Named pipe `CurrentUserOnly` chỉ là lớp OS đầu tiên. Message phải có authentication, protocol version,
session/Workspace scope, size limit, replay refusal và reconnect an toàn. Không expose generic
filesystem/shell/host object từ WebView2. Q-08/Q-11 vẫn `NOT-RUN`.

### 7.4 Khi nào phải xem lại Flutter

Không xem lại chỉ vì framework nổi tiếng hoặc khẩu hiệu “một codebase”. Phải có change record và ít
nhất một điều kiện sau:

| Mã | Điều kiện mở lại quyết định Client |
|---|---|
| `TRIGGER-CLIENT-01` | Mobile trở thành client hạng nhất trong roadmap đã duyệt. |
| `TRIGGER-CLIENT-02` | macOS hoặc Linux desktop trở thành client hạng nhất trong roadmap đã duyệt. |
| `TRIGGER-CLIENT-03` | Một yêu cầu bảo mật bắt buộc của WPF/WebView2 không thể xử lý trong kiến trúc đã chấp nhận. |
| `TRIGGER-CLIENT-04` | Option A không đạt ngưỡng hiệu năng bắt buộc đã được duyệt. |
| `TRIGGER-CLIENT-05` | Option A không đạt ngưỡng accessibility bắt buộc đã được duyệt. |
| `TRIGGER-CLIENT-06` | Sếp duyệt thay đổi khiến Web không còn là bề mặt sản phẩm hạng nhất. |
| `TRIGGER-CLIENT-07` | Số đo cho thấy chi phí làm hoặc bảo trì bridge WPF/WebView2 vượt ngưỡng đã duyệt. |
| `TRIGGER-CLIENT-08` | Qualification sau này cho thấy Flutter có lợi thế material về tổng chi phí hoặc tổng rủi ro và lợi thế đó được chấp nhận. |

## 8. Search, Artifact Gateway/Vault và Format Worker

### Search

Dùng rebuildable relational Discovery Projection trong PostgreSQL. Exact ID/title/metadata/filter/
sort/page/permission predicates là baseline; ICU/`pg_trgm`/full-text và Japanese tokenization phải
được đo trên corpus được duyệt (Q-03). Elasticsearch/OpenSearch/Lucene chỉ được xem lại khi relational
projection không đạt latency/recall/rebuild/index-size hoặc cần workload search scale độc lập.

### Artifact Gateway và Vault

Core v0 tách **control plane** khỏi **data plane**. Server giữ authentication, authorization, scope,
expected Generation, Reservation, chuẩn bị/hoàn tất Operation và commit trạng thái có thẩm quyền trong
PostgreSQL. Artifact Custody chọn một Gateway/Vault phù hợp theo policy, health, locality và capacity.
Workspace dùng grant ngắn hạn để truyền byte trực tiếp với Gateway; Server không proxy toàn bộ payload.

Một Artifact logic có thể có nhiều `Artifact Location` đã xác minh. Vault-to-Vault replication/repair
không bắt người dùng tải lại và không tạo Artifact identity mới. Replica giúp đáp ứng chính sách lưu
trữ trực tuyến nhưng **không phải backup**. Bản backup độc lập vẫn cần cho recovery. Initial Vault
Adapter direction vẫn là filesystem-backed; exact Gateway runtime/toolchain/provider, số vị trí tối
thiểu, failure domain, replication lag và ngưỡng chặn Check-in/Release đều `NOT-RUN`/`BLOCKED` cho đến
khi có quyết định và qualification riêng. Raw SMB/direct Vault path bị loại; scoped Gateway transfer
được phép. Write byte hoặc replication thành công không tự là Generation/Representation/BOM accepted.

### Format Worker

Worker tách riêng, thường chạy Windows khi license hoặc CAD/Office yêu cầu. Adapter profile ghim
application/version/OS/bitness/license/limits. Worker trả candidate; Format Intelligence/Product
Structure revalidate source Generation và commit metadata/outcome/Audit/outbox. Manual upload theo
cùng provenance là fallback. Không tuyên bố universal converter hay IRONCAD headless automation đã chạy.

## 9. Deployment và vận hành

### 9.1 Topology đề xuất

```text
Company-managed Ubuntu Server 26.04 LTS VM (single control-plane candidate, non-HA)
├── Nginx / managed TLS
├── IDEA Server Temurin 25 / Spring Boot 4.1.x modular monolith
│   ├── owner Modules + narrow Interfaces
│   ├── bounded outbox/jobs + per-system Adapters
│   └── Actuator/Micrometer/OpenTelemetry + structured diagnostics
└── PostgreSQL 18

Artifact data plane (multi-location capability; exact topology NOT-RUN)
├── Artifact Gateway A ↔ Vault location A
└── Artifact Gateway B ↔ Vault location B
    └── policy-governed Vault-to-Vault replication/repair

Workspace ↔ selected Artifact Gateway
└── scoped resumable byte transfer; Server is not the payload proxy

Independent backup target
└── DB base/WAL + Artifact + config/policy + required cryptographic material

Optional separate Windows Format Worker
└── exact licensed CAD/Office/converter profile

Windows engineering PC
├── IDEA Desktop (WPF + WebView2)
└── IDEA Workspace (.NET 10 + current-user named pipe)
```

Chọn executable-JAR bundle có version, signature/checksum, SBOM và systemd service account; Temurin
25 được cập nhật qua host-managed package source, config/secrets nằm ngoài bundle. Spring Boot chính
thức hướng dẫn JAR + systemd. Release phải preflight Flyway, health check và có rollback application
bundle kèm phương án forward repair/restore schema. Custom `.deb` không là application-delivery
authority ban đầu; chỉ chọn nếu IT bắt buộc hoặc Q-14 chứng minh provenance/rollback tốt hơn.
Self-contained `jlink` image cũng `DEFER` vì chuyển trách nhiệm patch JDK vào từng bundle. Container
có thể dùng trong development, nhưng production Docker/Kubernetes không bắt buộc. Một VM không phải
HA. Nhiều Vault location không thay thế HA của Server/PostgreSQL. Q-07 phải restore DB + bytes +
config/policy + keys ở failure domain độc lập; Q-04/Q-07 còn phải xác minh grant/receipt, location
failover, replication/repair và việc replica không bị ghi nhận nhầm là backup.

Server OS **`SELECT — platform direction`** là Ubuntu 26.04 LTS: Canonical bảo trì security tiêu
chuẩn tới 05/2031; Temurin 25 và PGDG PostgreSQL 18 có feed `resolute`, Nginx có package Ubuntu.
Microsoft cũng công bố .NET 10 cho Ubuntu 26.04, nên .NET không bị loại do OS. Ubuntu 24.04 LTS
(tới 05/2029) là alternative khi một dependency/policy cụ thể không qua 26.04. Windows Server 2025
chỉ là `ALTERNATIVE / CONTINGENCY` nếu IT bắt buộc, một Server component/integration yêu cầu,
Linux qualification thất bại, hoặc chứng minh được lợi thế security/operations có người sở hữu và
material. Máy Windows hiện có không tạo lợi thế. Q-14 vẫn `NOT-RUN` cho exact build, provenance,
hardening, certificate, patch, monitoring, backup/restore và company policy. Không triển khai SQL
Server trên Ubuntu 26.04 khi chưa có support evidence.

### 9.2 Observability và version policy

OpenTelemetry + OTLP là protocol baseline; log/metric/trace backend do công ty chọn sau. Tối thiểu
phải quan sát request outcome, DB pool/lock, transfer, outbox lag, worker health, storage, process/GC,
Operation ID, authorization denial và recovery. Audit Evidence là record riêng, không thay bằng log.

Policy là chọn **family** rồi qualify patch hiện hành:

| Family | Policy |
|---|---|
| Java/Temurin | Java 25 LTS, patch Temurin 25 có provenance; community availability tới ít nhất 09/2031 không phải SLA và không kéo dài lifecycle Spring |
| Spring Boot/Modulith | Boot 4.1.x + Modulith 2.1.x tương thích; Boot/Modulith/transitive dependencies có support clock riêng |
| Maven/pgJDBC/Flyway | Maven Wrapper và Boot BOM ghim graph; exact driver/migration patch + license/SBOM phải build/test |
| PostgreSQL | Major 18, minor supported hiện hành tại qualification; support table recheck |
| React/TypeScript/Vite | React 19.3, TS7, Vite 8.3; exact packages/lockfile/SBOM |
| Node | Node.js 24 LTS build line; máy phát triển hiện quan sát `v24.16.0`, exact patch/build qualification `NOT-RUN` |
| Windows .NET/WPF/WebView2 | `.NET 10` per-user Workspace, `net10.0-windows` shell; Evergreen theo IT; Fixed có lịch patch riêng nếu buộc dùng |
| Ubuntu | 26.04 `SELECT — platform direction`, 24.04 compatibility alternative; Q-14 chứng minh operational build |
| Bundles/dependencies | Signed/versioned app bundle + systemd + host-managed JDK, monthly security review và quarterly planned update đề xuất; chưa phải SLA đã duyệt |

### 9.3 Bộ sơ đồ để review kỹ thuật

Mỗi hình trả lời một câu hỏi riêng, tránh gom mọi đường nối vào một hình quá lớn. Có thể mở trực tiếp
bản SVG để xem đầy đủ ở độ phân giải cao.

| View | Loại / mục đích | Bản xem đầy đủ |
|---|---|---|
| `TECH-D01` | Technology Stack Overview — nhìn toàn bộ stack và luồng chính | [Nguồn hiện hành](../technology/IDEA-core-v0-technology-architecture-views.md#tech-d01--technology-stack-overview) |
| `TECH-D02` | C4-style Container / Technology Boundary — thấy ứng dụng, data store và contract giữa chúng | [Nguồn hiện hành](../technology/IDEA-core-v0-technology-architecture-views.md#tech-d02--c4-container--technology-boundary-view) |
| `TECH-D03` | Technology Layer Mapping — biết công nghệ nào làm trách nhiệm nào | [Nguồn hiện hành](../technology/IDEA-core-v0-technology-architecture-views.md#tech-d03--technology-layer-mapping) |
| `TECH-D04` | Runtime & Protocol — thấy process, protocol và trust boundary | [Nguồn hiện hành](../technology/IDEA-core-v0-technology-architecture-views.md#tech-d04--runtime--protocol-view) |
| `TECH-D05` | Deployment — thấy Server, nhiều Vault location, backup boundary và giới hạn HA | [Nguồn hiện hành](../technology/IDEA-core-v0-technology-architecture-views.md#tech-d05--deployment-view) |
| `TECH-D06` | Technology Dependency — thấy chiều phụ thuộc trực tiếp, không liệt kê package bắc cầu | [Nguồn hiện hành](../technology/IDEA-core-v0-technology-architecture-views.md#tech-d06--technology-dependency-view) |
| `TECH-D07` | Build / Packaging / Deployment Pipeline — thiết kế delivery đã chọn, implementation `NOT-RUN` | [Nguồn hiện hành](../technology/IDEA-core-v0-technology-architecture-views.md#tech-d07--build--packaging--deployment-pipeline) |
| `TECH-D08` | Technology Decision & Reopen Map — thấy selection, alternative và trigger mở lại | [Nguồn hiện hành](../technology/IDEA-core-v0-technology-architecture-views.md#tech-d08--technology-decision--reopen-map) |

Nguồn Mermaid và metadata đầy đủ nằm trong
[`IE-ARC-TECH-VIEW-001@0.3`](../technology/IDEA-core-v0-technology-architecture-views.md). Render/open
cho bản 0.3 là `NOT-RUN`; kết quả 8/8 của bản cũ không được dùng để xác nhận bản này.

## 10. Alternatives not selected

Client comparison đầy đủ theo 12 tiêu chí nằm ở
[`IE-KNW-TECH-DEC-001@0.6` §6.4](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md#64-client-technology-decision-matrix).
Không candidate nào được chấm numeric score hoặc giả định đã benchmark.

| Lựa chọn | Phân loại | Vì sao chưa chọn / khi nào xem lại |
|---|---|---|
| .NET 10 + ASP.NET Core | `ALTERNATIVE` | Linux support, async I/O, EF/Npgsql/Worker/diagnostics và một ngôn ngữ chung với client là lợi thế thật; xem lại khi Q-01/Q-12/Q-13/Q-14 chứng minh tổng rủi ro thấp hơn. |
| SQL Server 2025 | `ALTERNATIVE` | Xem lại khi company DBA/license/edition/restore support có bằng chứng vượt PostgreSQL. |
| Ubuntu 24.04 | `ALTERNATIVE` compatibility | Dùng khi exact 26.04 dependency hoặc policy không qua Q-14; không phải bị loại về chất lượng. |
| Windows Server 2025 | `ALTERNATIVE / CONTINGENCY` | Chỉ dùng khi IT policy, dependency/integration, Linux qualification failure hoặc lợi thế operations/security material; không vì máy Windows hiện có. |
| Flutter Web + Flutter Windows + Dart + narrow Win32 C++ shim + `.NET Workspace` | `EVALUATED ALTERNATIVE — NOT SELECTED FOR CORE V0` | Một Dart presentation model là lợi thế thật; Q-15 vẫn `PARTIAL / NO WINNER`. Không coi thiếu bằng chứng là thất bại. Chỉ mở lại theo `TRIGGER-CLIENT-01…08`. |
| WinUI 3 | `ALTERNATIVE` | Q-10 phải chứng minh lợi ích UI/accessibility/packaging bù servicing clock. |
| Browser + agent only | `CONDITIONAL` + `FOLLOW-UP PRODUCT DECISION REQUIRED` | Không được tự xóa Web-rendered Desktop surface; LNA/IPC/install chưa qualify. |
| Tauri/Rust | `ALTERNATIVE` + `QUALIFICATION REQUIRED` challenger | React reuse tốt nhưng thêm Rust/updater/IPC và chưa có multi-year Tauri LTS evidence; Q-08/Q-10/Q-11/Q-15 phải pass. |
| Electron | `REJECT FOR CORE V0` | Bundled Chromium/Node và cadence patch thêm burden không được chứng minh cần. |
| JavaFX / Qt | `DEFER` | Support evidence không đóng unknown WebKit/native/installer/CAD; thêm runtime/licensing boundary. |
| TypeScript 6 production | `REJECT FOR CORE V0` | Chỉ compatibility lane cho tooling. |
| Spring Session JDBC | `CONDITIONAL` | One-instance Core v0 dùng ordinary Spring Security sessions; chỉ thêm khi approved multi-instance/session-survival hoặc measured coordination need xuất hiện. |
| Spring Integration | `CONDITIONAL` | Không thêm cho optionality giả định; cần external contract cụ thể chứng minh EIP/adapter value. |
| Spring Batch | `CONDITIONAL` | Không thêm khi chưa có restartable/chunked/skippable workload và recovery contract thực tế. |
| JPA/Hibernate hoặc Spring Data JDBC default | `DEFER` | Chỉ thêm theo aggregate có bằng chứng; SQL-first owner path hiện chọn không được mất transaction/query ownership. |
| jOOQ default | `DEFER` | Phải qualify exact Java 25 edition/license/support; không tạo convention thứ hai mặc định. |
| Custom application `.deb` / self-contained `jlink` | `DEFER` | Chỉ thêm nếu IT provenance/patch/rollback policy hoặc kết quả Q-14 yêu cầu. |
| Elasticsearch/OpenSearch, Redis | `DEFER` / `REJECT FOR CORE V0` | Chưa có search/cache workload trigger hay recovery owner. |
| Kafka/RabbitMQ/broker bắt buộc | `DEFER` | Outbox + bounded worker đủ cho Core v0; thêm khi volume/isolation/platform yêu cầu. |
| CloudEvents | `DEFER` | Chưa có external consumer contract cần version này. |
| S3/MinIO/object storage | `DEFER` | Provider-neutral adapter giữ đường nâng cấp; chưa cần service storage thứ hai. |
| SSR/RSC/Next.js | `DEFER` | Không có SEO/server-rendering need; thêm Node production runtime. |
| Microservices/Kubernetes/service mesh/HA cluster | `REJECT FOR CORE V0` | Không có measured independent-scale need hoặc platform team; không biến một VM thành HA. |
| Raw SMB/direct Vault path, universal CAD converter, CAD add-in | `REJECT FOR CORE V0` | Raw path/credential vi phạm custody boundary; scoped direct Workspace–Gateway transfer là đường được thiết kế. Converter/add-in chưa có app/license/format evidence. |
| OAuth/OIDC server mới | `DEFER` | Native IDEA account trước; company OIDC là integration evolution. |

## 11. Architecture Review Challenge

### Strongest case FOR Flutter

Một Dart UI/component/state model có thể dùng cho Web và Windows, giảm khác biệt presentation và
tạo optionality thật cho Android/iOS/macOS/Linux nếu roadmap sau này yêu cầu. Flutter Web được hãng
định vị cho app-centric SPA; Flutter Windows có native host, AOT và FFI/plugin seams. Bỏ WPF/WebView2
khỏi Desktop cũng bỏ WebView2 message bridge ở installed presentation.

### Strongest case AGAINST Flutter

Core v0 hiện cần browser + Windows Workspace/CAD/Office, không cần mobile. Flutter không bỏ `.NET
Workspace`; nó thêm Dart/Flutter, JS/Wasm Web branches và direct FFI/Win32 IPC phải tự sở hữu, cộng
thêm shim/plugin chỉ khi direct FFI gặp blocker.
Grid/tree enterprise, browser behavior, Web/Windows accessibility, EN/VI/JA IME, DPI/multi-monitor,
installer/rollback và servicing đều chưa có IDEA result. Đổi ngay sẽ tăng unknown chứ chưa chứng minh
giảm total risk.

### Strongest case FOR selected React + WPF/WebView2

React đi thẳng vào browser DOM và cùng business UI chạy trong WebView2; WPF chỉ là shell hẹp, còn
`.NET` có named-pipe/current-user primitives cho Workspace. Shape này giữ đúng ba surface hiện có và
đã được mô tả đủ để làm baseline; số seam thực tế và total risk chưa được Q-15 kết luận. Evergreen có thể chuyển
renderer servicing cho managed runtime khi IT cho phép.

### Strongest case AGAINST selected React + WPF/WebView2

Nó vẫn có nhiều release/runtime boundary; WebView2 bridge là privileged surface và Evergreen tạo
version skew, trong khi Fixed bắt IDEA tự patch Chromium. WPF Windows-only có nguy cơ phình thành UI
thứ hai. Nếu installed shell không tạo giá trị đo được, Browser + Workspace có thể đơn giản hơn. Nếu
một reopen trigger xuất hiện và Flutter chứng minh total risk thấp hơn, giữ WPF/WebView2 chỉ vì lịch
sử sẽ không còn hợp lý.

### Existing full-stack challenges

1. **Java còn thắng nếu bỏ Integration/Batch khỏi baseline không?** Có, nhưng thắng hẹp nhờ Modulith
   alignment và JDK distribution/support optionality. Integration/Batch không góp điểm quyết định.
2. **So persistence đã công bằng với raw Npgsql chưa?** Có: raw Npgsql và Spring JDBC/`JdbcClient`
   đều là explicit-SQL path nên `DRAW`; EF Core và JPA/Hibernate/Spring Data là ORM paths cần qualify.
3. **Lợi thế lifecycle Java còn bao nhiêu khi nhìn full stack?** Chỉ xác lập runtime distribution/
   support optionality. JDK runway không kéo dài Boot/Modulith/Maven/transitives; mốc .NET 2028 cũng
   không chứng minh tổng burden cao hơn. Full-stack result là Q-13 `NOT-RUN`.
4. **Spring Session JDBC có bắt buộc không?** Không. Ordinary session + one-instance invalidation +
   request/commit revalidation đáp ứng design ban đầu; restart invalidates sessions an toàn. Chỉ thêm
   khi approved session-survival/multi-instance hoặc measured coordination need xuất hiện.
5. **DOC-05 đã bỏ volatile technology details chưa?** Có: giữ Linux-first Server boundary và Windows
   Format Worker riêng; exact distro/runtime/framework/database/package thuộc TECH/matrix hiện hành.
6. **Q-13 trigger chính xác để đổi sang .NET?** Measured staffing/patch/onboarding/incident/SBOM burden
   vượt management-approved threshold và equivalent .NET candidate đáp ứng toàn bộ mandatory behavior
   với total risk thấp hơn; hoặc Java fail mandatory qualification mà equivalent .NET qua.
7. **Phản biện mạnh nhất với Java:** hai runtime/toolchain và nhiều dependency clock có thể quá sức
   đội nhỏ; Q-13 phải ghi owner và đo burden.
8. **Phản biện mạnh nhất với PostgreSQL:** company SQL Server DBA/license/restore path có thể tốt hơn;
   Q-02/Q-07/Q-14 có thể đảo DB độc lập với runtime.
9. **Nếu Desktop/Workspace là language-neutral black box?** Engineering vẫn chọn Java hẹp; HTTPS/
   JSON/OpenAPI giữ Java Server và .NET Windows client tách biệt.

## 12. PG3 readiness / pre-decision (không PASS)

| Câu hỏi | Trạng thái | Ý nghĩa |
|---|---|---|
| Chọn Server runtime/framework | `RESOLVED BY ENGINEERING RECOMMENDATION` | Java 25/Temurin 25 + Spring Boot 4.1.x/Modulith; PDA review và Q-01/Q-13 chưa chạy. |
| Chọn DB/persistence/migration | `RESOLVED BY ENGINEERING RECOMMENDATION` | PostgreSQL 18 + Spring JDBC/pgJDBC + một Flyway/SQL migration authority; Q-02/Q-07/Q-14 `NOT-RUN`. |
| Identity/Access Policy boundary | `RESOLVED BY ENGINEERING RECOMMENDATION` | Ordinary Spring Security sessions + one-instance invalidation được chọn; Spring Session JDBC `CONDITIONAL`; Identity không thay Access Policy; Q-06/Q-08/Q-11 `NOT-RUN`. |
| Web/Desktop/Workspace shape | `RESOLVED BY ENGINEERING SELECTION` | React + WPF/WebView2 + per-user Workspace là Core v0 Engineering baseline; Q-15 vẫn `PARTIAL / NO WINNER`; Flutter là evaluated alternative sau `TRIGGER-CLIENT-01…08`; bỏ surface cần Product Decision riêng. |
| Ubuntu 26.04 platform / full operational build | `SELECT — platform direction` / `QUALIFICATION REQUIRED` | Official Temurin/Boot/PGDG base path đã có; Q-14 vẫn phải xác nhận exact bundle/driver/migration/backup/monitoring/hardening và company policy. |
| License, certificate, signing, support/on-call | `BLOCKED` | Cần người/đơn vị công ty xác nhận; repository chưa có evidence. |
| Transaction/concurrency/outbox/module boundary | `QUALIFICATION REQUIRED` | Q-01/Q-02/Q-05 và architecture tests, toàn bộ `NOT-RUN`. |
| Transfer/storage/recovery | `QUALIFICATION REQUIRED` | Q-04/Q-07 phải kiểm tra scoped direct Gateway transfer, Transfer Receipt, location failover, replication/repair và backup độc lập; không dùng demo nhỏ làm bằng chứng. |
| Unicode/Japanese search | `QUALIFICATION REQUIRED` | Q-03 với corpus và threshold được duyệt. |
| CAD/Office/IRONCAD | `QUALIFICATION REQUIRED` | Q-09 exact app/version/license/worker. |
| Client UI/install/update/native attack | `QUALIFICATION REQUIRED` | Q-10/Q-11 và Q-15 follow-up kiểm tra residual risk của Option A trên cùng clean image, data/locale fixture, threat cases và Workspace có local work cần bảo toàn. Chỉ chạy lại Flutter sau reopen trigger. |
| Observability/maintainability | `QUALIFICATION REQUIRED` | Q-12/Q-13 runbook/SBOM/support rotation. |
| Sếp duyệt Node.js 24 LTS cho Web build | `APPROVED` | Người dùng xác nhận ngày 23-09-2026 rằng người dùng và Product Decision Authority đã duyệt Node.js 24 LTS làm baseline Web build. Quyết định này không làm Q-01…Q-15 hoặc PG3/PG4 thành `PASS`. |
| Sếp duyệt toàn bộ TECH-001@0.16 | `PARTIAL / MIXED` | Node.js 24 LTS successor đã được duyệt; các successor khác trong brief giữ nguyên trạng thái authority của change record tương ứng, không được suy diễn từ quyết định Node. |
| PG3 | `NOT-RUN` | Gate owner phải đánh giá theo GOV/DOC-07/VVP; không có PASS trong tài liệu này. |

Minimum evidence trước khi sếp có thể quyết định Tech: xem đúng matrix/brief/source pins; xác nhận
OS/DB edition/license/certificate/signing/support owner; có Q-01/Q-02/Q-05 transaction evidence,
Q-06/Q-08/Q-11 security/IPC evidence, Q-14 complete-stack compatibility và review đúng sự thật Q-15
`PARTIAL / NO WINNER`. Các Q-03/Q-04/Q-07/Q-09/Q-10/Q-12/Q-13 và phần còn thiếu của Q-15 là
qualification triển khai/operational theo gate owner, không được đổi thành PASS bằng cách viết brief.

## 13. Qualification backlog

Q-01…Q-14 giữ `NOT-RUN`. Q-15 đã có bằng chứng từng phần nhưng chưa đủ để chọn người thắng.

| ID | Cần chứng minh trên Engineering baseline này | Trạng thái |
|---|---|---|
| `Q-01` | Java/Boot/Modulith/JDBC/Flyway Server vertical slice: Check-out/Reference/Check-in/Release, module verification, immutable Generation, owner outcome/Audit/outbox atomic và idempotent retry | `NOT-RUN` |
| `Q-02` | PostgreSQL transaction, optimistic/pessimistic lock, deadlock/timeout/retry và không lost update | `NOT-RUN` |
| `Q-03` | PostgreSQL projection với Vietnamese/Japanese, normalization/width/case, permission filter, p95/p99 và rebuild | `NOT-RUN` |
| `Q-04` | Temurin/Boot Server control plane + .NET Workspace ↔ Artifact Gateway data plane: scoped grant, multi-GB stream, digest, interruption/resume, location reselection, authenticated receipt, journal và duplicate OperationId | `NOT-RUN` |
| `Q-05` | Plain owner-specific Adapter + bounded Spring outbox dispatcher: crash/duplicate/reorder/replay và consumer idempotency; Spring Integration `CONDITIONAL` | `NOT-RUN` |
| `Q-06` | Spring Security ordinary session: fixation, CSRF, one-instance revoke/suspend, next-request refusal, commit race, restart invalidation, expiry/reauth và Workspace binding; Spring Session JDBC `CONDITIONAL` | `NOT-RUN` |
| `Q-07` | Restore DB + Artifact locations + config/policy/key về mốc dùng được; kiểm tra replication/repair tách khỏi backup và đo RTO/RPO | `NOT-RUN` |
| `Q-08` | `.NET` Named Pipe baseline: cross-user/cross-Workspace refusal, replay, size/version, reconnect và cancellation; alternate client chỉ chạy sau reopen/selection | `NOT-RUN` |
| `Q-09` | Selected WPF/WebView2 + `.NET Workspace` + Format Worker: exact Office/IRONCAD open/save, stale/in-use/error và Representation provenance | `NOT-RUN` |
| `Q-10` | Selected Option A: install/runtime, online/offline update, rollback khi Workspace có local work, signing/SBOM trên clean company image | `NOT-RUN` |
| `Q-11` | Selected WebView2/WPF/Named Pipe chain: navigation/message/origin/IPC attack boundary, CSRF/DNS rebinding và hostile-client refusal | `NOT-RUN` |
| `Q-12` | Actuator/Micrometer/OpenTelemetry/JFR/log/metric/trace incident diagnosis, redaction/cardinality/runbook | `NOT-RUN` |
| `Q-13` | So equivalent Java Server + .NET Windows với unified-.NET candidate: staffing, patch, onboarding, incident rotation, full dependency clocks, hai-ecosystem SBOM/support burden; đổi chỉ khi vượt management threshold và .NET đạt mandatory behavior với lower total risk | `NOT-RUN` |
| `Q-14` | Exact `CORE BASELINE`: Temurin + Boot Web/Modulith/Security ordinary sessions/JDBC/Flyway/task-outbox/observability + PostgreSQL/Ubuntu 26.04 bundle/systemd/backup/monitoring/restore; conditional dependencies không có trong graph nếu chưa trigger; 24.04/.NET/Windows branches `DEFERRED` | `NOT-RUN` |
| `Q-15` | Phase 1–3 giữ nguyên bằng chứng A/B và kết luận `NO WINNER`. Follow-up tập trung residual risk của selected Option A trên Login → Search → Browser → Detail → Checkout → Open/Workspace → Check-in, grid/tree, keyboard, accessibility, EN/VI/JA IME, multi-window/DPI, authenticated IPC, startup/resources, install/update/rollback và security. So lại Flutter chỉ sau `TRIGGER-CLIENT-01…08`. | `PARTIAL / NO WINNER` |

Không có comparative branch nào được giả làm đã chạy. “Deferred” chỉ nghĩa chưa thực hiện vì không
phải Core v0 baseline.

## 14. Product impact và governance

`TECH-001@0.16` trình bày baseline đã chọn ở cấp Engineering và ghi nhận quyết định Node.js 24 LTS:

- **No Product Scope Change.** Không thêm Feature group hoặc capability family. Successor bổ sung ba
  `REQ-*` và hai `QRS-*` để kiểm soát cách hiện thực nhu cầu Vault nhiều vị trí/file lớn đã được nêu;
  DOC-04/05/06/07/08 và VVP được tăng phiên bản có kiểm soát.
- Không đổi Tech Stack selection, Q-15 hoặc Product Scope. Successor làm rõ architecture semantics:
  Artifact Custody chọn location/cấp grant/xác minh receipt; Workspace truyền byte trực tiếp với
  Artifact Gateway; Server vẫn sở hữu authorization và commit; một Artifact có thể có nhiều location;
  replication không phải backup. Transaction Coordinator, server-established ActorContext, Access
  Policy/owner outcome, shared relational UoW, Reservation `Active → Ended / Expired / Recovered`,
  Representation acceptance và Restricted Recovery Mode vẫn theo DOC-05/DOC-06.
- Không tạo God Module mới, không thêm microservices/Kubernetes/broker/search service/CAD add-in.
- Product Decision Authority đã duyệt riêng Node.js 24 LTS cho Web build. Quyết định này không đổi
  PG3/PG4, Q-01…Q-14 hoặc Q-15; các successor khác giữ trạng thái authority riêng.

Decision brief này phải được review lại nếu source baseline, company platform/support, license,
qualification result hoặc Product Decision Authority thay đổi.
