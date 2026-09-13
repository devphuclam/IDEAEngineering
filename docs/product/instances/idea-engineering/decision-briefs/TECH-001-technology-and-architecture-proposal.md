# TECH-001 — Đề xuất công nghệ và kiến trúc IDEA Engineering Core v0

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu / Stable ID | `TECH-001` |
| Phiên bản / ngày soạn | `0.10` / `13-09-2026` |
| Trạng thái | `Draft` — Engineering Recommendation đã hoàn tất; Product Decision Authority review/approval `NOT-RUN` |
| Vai trò | Brief tiếng Việt để sếp xem xét trục Tech; không phải Core Product Document và không tự phê duyệt stack |
| Người soạn / review | Principal Product Author — trợ lý soạn; review nội bộ đầy đủ `NOT-RUN` |
| Người quyết định | Sếp — `Product Decision Authority` |
| Product Normativity | `INFORMATIVE` — không tạo FTR/REQ và không đổi hành vi sản phẩm |
| Cơ sở chi tiết | [`IE-KNW-TECH-DEC-001@0.2`](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md); [`IE-RES-TECH-20260913-001`](../../../../research/2026-09-13-technology-selection-evidence-synthesis.md); first-party Linux support pins trong matrix §2B |
| Baseline sản phẩm | `IDEA-C1-ANALYSIS-DESIGN-001`; DOC-01@0.6, DOC-02@0.2, DOC-03@0.7, DOC-04@0.13, DOC-05@0.17 (chỉ cập nhật candidate Tech rows), DOC-06@0.16, DOC-07@0.7, DOC-08@0.12, GOV@0.3, VVP@0.16 và các ADR đã Accepted |
| Change Record | [`IE-CHG-TECH-LINUX-001@0.1`](../registers/CHG-2026-09-13-linux-first-server-runtime-re-evaluation.md); predecessor `TECH-001@0.9`, SHA-256 `B1A67D253066765B9834EF232648394B5F585B2A7B2B30ACF7D5B79984BCE04C` |
| Supersedes / Superseded by | Supersedes `TECH-001@0.9`; superseded by `NOT-APPLICABLE` |
| Giới hạn | Chỉ phân tích và đề xuất. Chưa viết production code, chưa cài đặt/triển khai, chưa mua license/hạ tầng, chưa có kết quả qualification và không tuyên bố PG3/PG4 `PASS`. |
| Trạng thái quyết định | Engineering Recommendation: `COMPLETE`; Product Decision Authority Approval: `NOT-RUN` |

## 1. Kết luận để sếp phản biện

Engineering đề xuất **một bộ Core v0 cụ thể**:

```text
Ubuntu Server 26.04 LTS — SELECT platform direction; exact build Q-14 NOT-RUN
Java 25 LTS / Eclipse Temurin 25 / Spring Boot 4.1.x + Spring Modulith 2.1.x
PostgreSQL 18 + Spring JDBC/JdbcClient/pgJDBC + Flyway versioned SQL
Maven Wrapper + Boot BOM; Spring Security/Session JDBC; Spring Integration/Batch
React 19.3 + TypeScript 7 + Vite 8.3 / Node 22 LTS build
WPF net10.0-windows + WebView2 Evergreen
Workspace .NET 10 riêng theo từng Windows user, IPC named pipe có xác thực
Private server-managed filesystem Artifact Store
Separate Windows Format Worker khi CAD/Office/license yêu cầu
Signed/versioned executable-JAR bundle + systemd trên một VM/company-managed, không HA
Actuator/Micrometer/OpenTelemetry/JFR + PostgreSQL PITR/WAL và backup độc lập
```

Đây là **khuyến nghị kỹ thuật**, không phải quyết định của sếp. Bối cảnh mới do anh cung cấp:
ưu tiên Linux-first cho Server; hạ tầng Windows Server hiện có được tính **0 điểm lợi thế**; Server
được phép khác runtime với Windows client. Vì thế quyết định OS Server, runtime Server và runtime
Desktop/Workspace được tách ra. Sau khi tính lại, Java/Spring thắng ở kiểm tra ranh giới Module,
Integration/Batch và lựa chọn vòng đời JDK; .NET/ASP.NET Core là runner-up mạnh nhờ một ngôn ngữ
chung và hệ công cụ gọn hơn. Không có kết luận Java nhanh hơn hoặc “enterprise-grade” hơn.

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
| Account/authentication | `SELECT` | Spring Security 7.1.x + Spring Session JDBC + IDEA Actor/Account/Login Identity domain | Framework cho authentication/session/CSRF; IDEA Access Policy tự quyết định quyền sản phẩm. Web dùng HttpOnly SameSite cookie. |
| Authorization | `SELECT` | IDEA Access Policy | Server/IAM establish `ActorContext`; policy resolve IAM eligibility + Project/Group + Role Assignment/version + Scope; owner gate và commit-time revalidation sau đó. |
| API | `SELECT` | Versioned HTTPS JSON REST + OpenAPI 3.1 | Stable Resource/Operation ID, expected state và idempotency key; client không truy cập DB và không tự gửi ActorId có thẩm quyền. |
| Integration publication | `SELECT` | PostgreSQL transactional outbox + bounded Spring dispatcher + per-system Spring Integration Adapter | Outcome/Audit/outbox atomic trong relational UoW; consumer idempotent. Broker chưa bắt buộc. |
| Web frontend | `SELECT` | React 19.3 CSR | Web workbench nội bộ; static build được Server phục vụ; không thêm SSR/RSC. |
| Web compiler | `SELECT` | TypeScript 7.0 | CLI/type-checking line được chọn; TS6 chỉ là compatibility lane cho plugin dùng compiler API chưa ổn định. |
| Web build | `SELECT` | Vite 8.3 + Node.js 22 LTS build line | `Node >=22.12` cho Vite 8; `npm ci` + `package-lock.json` và SBOM. Node không chạy như production Server. |
| Web routing | `SELECT` | React Router 7 data APIs | Loaders/actions/error boundaries ở client; API/authorization vẫn do Server quyết định. |
| Search | `SELECT` | Rebuildable PostgreSQL Discovery Projection | ID/title/filter/sort/page/permission predicates; Japanese tokenization và FTS semantics chưa được chứng minh. |
| Desktop shell | `SELECT` | WPF `net10.0-windows` + embedded React | Giữ bề mặt Web/Desktop/Web-rendered Desktop hiện có, native code chỉ expose intent commands. |
| Embedded renderer | `SELECT` | WebView2 Evergreen | Ưu tiên runtime được IT cập nhật tập trung; Fixed chỉ là fallback khi policy/offline bắt buộc. |
| Workspace runtime | `SELECT` | Separate per-user `.NET 10` process | Local materialization/custody, hash, journal, resume, external CAD/Office launch và recovery; không sở hữu Product Definition. |
| Workspace IPC | `SELECT` | Current-user named pipes + authenticated/versioned/scope-bound messages | ACL không đủ một mình; có replay/size/version checks, cross-user refusal và reconnect an toàn. |
| Artifact store | `SELECT` | Private server-managed filesystem-backed adapter | Digest-addressed immutable bytes, provider-neutral IDs, Server-mediated access; không expose SMB. |
| Format Worker | `SELECT` | Separate Windows worker + exact Format Adapter profile | Worker tạo candidate; owner Module mới verify/accept Representation theo Generation nguồn. Manual upload vẫn có. |
| Server OS | `SELECT — platform direction` | Ubuntu Server 26.04 LTS | Canonical lifecycle, Temurin 25 và PGDG PostgreSQL 18 package paths đã có official source; Q-14 vẫn phải qualify exact operational build. |
| Deployment packaging | `SELECT` | Signed/versioned executable-JAR bundle + systemd, Temurin host-managed; config/secrets ngoài bundle | Ít lớp hơn custom `.deb`; preflight Flyway, signature/SBOM, health check, patch và rollback phải thử. |
| Reverse proxy/TLS | `SELECT` | Company-approved Nginx baseline + managed certificate | TLS/origin/header policy thuộc deployment; Nginx không thay Access Policy. |
| Background jobs | `SELECT` | Bounded Spring task execution/scheduling + Spring Batch cho import/export cần restart | Outbox/maintenance có Operation ID, bounded retry/lease và idempotency; Format Worker tách riêng. |
| Observability | `SELECT` | Spring Actuator/Micrometer + OpenTelemetry/OTLP + structured JSON logs + JFR/`jcmd` | Audit Evidence tách khỏi log; backend/export/retention để company chọn và phải qualify. |
| Backup/recovery | `SELECT` có điều kiện | PostgreSQL base backup + WAL/PITR + coordinated Artifact/config/policy/key backup ở failure domain khác | RTO ≤4 giờ làm việc và RPO ≤1 giờ chỉ là mục tiêu sơ bộ; chưa có đo đạt. Một VM không phải HA. |

## 3. Server decision: vì sao Java thắng sau khi tách khỏi Windows client

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
| Adapter doanh nghiệp, batch/import/export | Worker Services và adapter tự tổ chức | Spring Integration EIP/adapters; Spring Batch restart/skip/chunk/partition | Java có breadth giảm hạ tầng tự viết khi contract được duyệt. |
| SQL/query ownership | EF/Npgsql mạnh nhưng cần quy tắc query/raw path | JDBC-first bộc lộ SQL, lock và owner transaction rõ | Java stack được chọn có lợi thế về sự tường minh, không phải tốc độ. |
| Runtime/framework lifecycle | .NET 10 tới 14-11-2028, lịch Microsoft đơn giản | Temurin 25 community tới ít nhất 09/2031, nhưng Boot minor có lịch riêng | Java lợi thế runtime optionality; .NET lợi thế đơn giản lịch patch. |
| Số toolchain toàn hệ thống | C#/.NET/NuGet dùng chung với Windows client | Java/JVM/Maven/Spring thêm vào C#/.NET/NuGet/WPF/WebView2 | .NET lợi thế maintainability; mức chi phí thật Q-13 `NOT-RUN`. |
| Tải tương đương của IDEA | Chưa chạy | Chưa chạy | Relative performance `UNKNOWN`; không gán Java hoặc .NET thắng scale. |

Java thắng vì ba lợi thế Server-specific có bằng chứng (Modulith, Integration/Batch, JDK support
optionality) có liên hệ trực tiếp với mục tiêu Module sâu và khả năng giao tiếp ERP/MES/BI lâu dài.
.NET thắng về đơn giản ngôn ngữ/toolchain và có ASP.NET Core/Kestrel, async I/O, Worker Services,
EF/Npgsql và diagnostics rất tốt, nhưng điểm dùng chung C# không phải yêu cầu architecture Server.
Linux Server và Windows Workspace vốn đã tách OS, triển khai, patch, supervision, security, incident
và failure domain. Vì thế lợi thế hợp nhất này không đủ đảo các điểm Server-specific. Câu hỏi nếu
Desktop/Workspace là hộp đen độc lập ngôn ngữ: Engineering vẫn chọn Java.

Hai runtime là chi phí có thật, không bị che. Q-13 phải đo build, cập nhật CVE, SBOM, onboarding,
debug/incident rotation và support owner cho cả Java Server lẫn .NET Windows. Ngôn ngữ không rò qua
boundary: Server/Workspace dùng HTTPS, JSON, OpenAPI, stable Resource/Operation ID, expected state,
idempotency và Server authority; named pipe chỉ ở nội bộ Windows client.

### 3.2 Điều kiện chuyển lại .NET

Chỉ chuyển khi Q-01/Q-12/Q-14 cho thấy Java không qua điều kiện correctness/security/diagnostics/
platform bắt buộc mà .NET qua, hoặc Q-13 chứng minh chi phí hỗ trợ hai runtime material đến mức
management không chấp nhận, hoặc công ty có một .NET Server support platform thực sự an toàn hơn.
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
Audit, projection, configuration và outbox; Artifact Store giữ bytes/digest/location.

### 4.2 Cách truy cập dữ liệu

- Spring JDBC/`JdbcClient` + Boot-managed pgJDBC là default SQL-first. Từng Module sở hữu query,
  mapping, lock và projection của mình; `COPY`/bulk, outbox và search đều theo boundary owner.
- JPA/Hibernate và Spring Data JDBC là lựa chọn bổ sung có giới hạn nếu một aggregate cụ thể chứng
  minh lợi ích; jOOQ cần xác nhận Java 25 edition/license. Không có hai default convention hay
  generic repository/CRUD authority.
- Coordinator không sở hữu entity hay policy; chỉ mở shared relational UoW cho operation được khai
  báo. Owner outcome, Audit Evidence và outbox commit theo boundary hiện hành.

Boot-managed Flyway (`flyway-core` + `flyway-database-postgresql`) với reviewed versioned SQL là schema
authority duy nhất, kể cả bảng hạ tầng Spring Session/Batch; tắt framework schema auto-initialization
cạnh tranh. PostgreSQL 18 có trong danh sách Flyway verified versions. Release dùng
expand–migrate–contract và chạy migration như bước preflight riêng, không tự migrate lúc app start.
Application rollback không tự rollback schema; destructive change cần forward repair hoặc restore.

## 5. Identity và authorization

Spring Security 7.1.x và Spring Session JDBC được chọn cho authentication, password encoding,
session-fixation/CSRF và persisted session primitives. IDEA vẫn sở hữu Actor, Account, Login Identity,
eligibility, lockout/recovery policy và Audit. Web dùng secure HttpOnly/SameSite cookie và CSRF
protection; không tạo OAuth/OIDC server mới.

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

Chọn React 19.3, TypeScript 7.0, Vite 8.3 và Node.js 22 LTS build line (Vite 8 cần Node 22.12+).
Package phải ghim trong lockfile/SBOM và dùng `npm ci`; patch current được cập nhật theo policy,
không ghi cứng “latest” vào Product Spec.

Đây là CSR SPA với React Router 7 data APIs, static assets phục vụ từ IDEA Server. Server vẫn là
authority cho dữ liệu và quyền. SSR, RSC, Next.js/full-stack Node và TypeScript 6 production compiler
đều `DEFER/REJECT FOR CORE V0`; TS6 chỉ tồn tại như compatibility lane nếu một plugin cần compiler
API ổn định hơn trong quá trình qualify.

## 7. Desktop và Workspace

### 7.1 Shell được chọn

SRS hiện có Web, Desktop và Web-rendered Desktop obligations. Vì vậy browser-only + agent không thể
được chọn âm thầm mà không có follow-up Product Decision. Core v0 chọn **WPF + WebView2 Evergreen**.

WPF thắng WinUI 3 cho first bake vì mature Windows compatibility/hosting/installer/accessibility
boundary và ít unknown hơn trong sản phẩm nội bộ cần CAD/Office/file custody. Windows App SDK có
servicing clock riêng và ngắn hơn .NET LTS; vendor guidance khuyến nghị WinUI không tự biến thành
bằng chứng risk thấp hơn. WinUI 3 là alternative nếu Q-10 chứng minh lợi ích material.

Evergreen được chọn khi IT cho phép runtime cập nhật tập trung. Fixed Version chỉ dùng khi offline hoặc
policy cấm Evergreen; khi đó IDEA phải sở hữu binary, CVE response, rollout và rollback renderer.

### 7.2 Workspace là boundary riêng

Workspace `.NET 10` chạy per-user, không phải machine-wide service và không sở hữu Product Definition.
Nó giữ local file, hash, transfer journal, resumable transfer, phát hiện local change, mở Office/CAD
và recovery state. Core v0 dùng `Store → Server → Workspace`; không cấp credential để client đi thẳng
vào Artifact Store.

Named pipe `CurrentUserOnly` chỉ là lớp OS đầu tiên. Message phải có authentication, protocol version,
session/Workspace scope, size limit, replay refusal và reconnect an toàn. Không expose generic
filesystem/shell/host object từ WebView2. Q-08/Q-11 vẫn `NOT-RUN`.

## 8. Search, Artifact Store và Format Worker

### Search

Dùng rebuildable relational Discovery Projection trong PostgreSQL. Exact ID/title/metadata/filter/
sort/page/permission predicates là baseline; ICU/`pg_trgm`/full-text và Japanese tokenization phải
được đo trên corpus được duyệt (Q-03). Elasticsearch/OpenSearch/Lucene chỉ được xem lại khi relational
projection không đạt latency/recall/rebuild/index-size hoặc cần workload search scale độc lập.

### Artifact Store

Dùng private filesystem-backed adapter trên volume do Server quản lý, content-addressed và immutable
ở mức application contract. Artifact Custody sở hữu byte/location/candidate/transfer; Module sở hữu
metadata/reference/provenance. Write byte thành công không tự là Generation/Representation/BOM accepted.
SMB/direct path bị loại khỏi Core v0.

### Format Worker

Worker tách riêng, thường chạy Windows khi license hoặc CAD/Office yêu cầu. Adapter profile ghim
application/version/OS/bitness/license/limits. Worker trả candidate; Format Intelligence/Product
Structure revalidate source Generation và commit metadata/outcome/Audit/outbox. Manual upload theo
cùng provenance là fallback. Không tuyên bố universal converter hay IRONCAD headless automation đã chạy.

## 9. Deployment và vận hành

### 9.1 Topology đề xuất

```text
Company-managed Ubuntu Server 26.04 LTS VM (single, non-HA candidate)
├── Nginx / managed TLS
├── IDEA Server Temurin 25 / Spring Boot 4.1.x modular monolith
│   ├── owner Modules + narrow Interfaces
│   ├── bounded outbox/jobs + per-system Adapters
│   └── Actuator/Micrometer/OpenTelemetry + structured diagnostics
├── PostgreSQL 18
└── protected private Artifact volume

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
HA; Q-07 phải restore DB + bytes + config/policy + keys ở failure domain độc lập.

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
| Java/Temurin | Java 25 LTS, patch Temurin 25 có provenance; community availability tới ít nhất 09/2031 không phải SLA |
| Spring Boot/Modulith | Boot 4.1.x + Modulith 2.1.x tương thích; Boot minor có support clock riêng |
| Maven/pgJDBC/Flyway | Maven Wrapper và Boot BOM ghim graph; exact driver/migration patch + license/SBOM phải build/test |
| PostgreSQL | Major 18, minor supported hiện hành tại qualification; support table recheck |
| React/TypeScript/Vite | React 19.3, TS7, Vite 8.3; exact packages/lockfile/SBOM |
| Node | Node 22 LTS build line, tối thiểu 22.12 cho Vite 8 |
| Windows .NET/WPF/WebView2 | `.NET 10` per-user Workspace, `net10.0-windows` shell; Evergreen theo IT; Fixed có lịch patch riêng nếu buộc dùng |
| Ubuntu | 26.04 `SELECT — platform direction`, 24.04 compatibility alternative; Q-14 chứng minh operational build |
| Bundles/dependencies | Signed/versioned app bundle + systemd + host-managed JDK, monthly security review và quarterly planned update đề xuất; chưa phải SLA đã duyệt |

## 10. Alternatives not selected

| Lựa chọn | Phân loại | Vì sao chưa chọn / khi nào xem lại |
|---|---|---|
| .NET 10 + ASP.NET Core | `ALTERNATIVE` | Linux support, async I/O, EF/Npgsql/Worker/diagnostics và một ngôn ngữ chung với client là lợi thế thật; xem lại khi Q-01/Q-12/Q-13/Q-14 chứng minh tổng rủi ro thấp hơn. |
| SQL Server 2025 | `ALTERNATIVE` | Xem lại khi company DBA/license/edition/restore support có bằng chứng vượt PostgreSQL. |
| Ubuntu 24.04 | `ALTERNATIVE` compatibility | Dùng khi exact 26.04 dependency hoặc policy không qua Q-14; không phải bị loại về chất lượng. |
| Windows Server 2025 | `ALTERNATIVE / CONTINGENCY` | Chỉ dùng khi IT policy, dependency/integration, Linux qualification failure hoặc lợi thế operations/security material; không vì máy Windows hiện có. |
| WinUI 3 | `ALTERNATIVE` | Q-10 phải chứng minh lợi ích UI/accessibility/packaging bù servicing clock. |
| Browser + agent only | `ALTERNATIVE` + `FOLLOW-UP PRODUCT DECISION REQUIRED` | Không được tự xóa Web-rendered Desktop surface; LNA/IPC/install chưa qualify. |
| Tauri/Rust | `ALTERNATIVE` challenger | React reuse tốt nhưng thêm Rust/updater/IPC và không có multi-year LTS; Q-08/Q-10/Q-11 phải pass. |
| Electron | `REJECT FOR CORE V0` | Bundled Chromium/Node và cadence patch thêm burden không được chứng minh cần. |
| JavaFX / Qt | `DEFER` | Support evidence không đóng unknown WebKit/native/installer/CAD; thêm runtime/licensing boundary. |
| TypeScript 6 production | `REJECT FOR CORE V0` | Chỉ compatibility lane cho tooling. |
| JPA/Hibernate hoặc Spring Data JDBC default | `DEFER` | Chỉ thêm theo aggregate có bằng chứng; SQL-first owner path hiện chọn không được mất transaction/query ownership. |
| jOOQ default | `DEFER` | Phải qualify exact Java 25 edition/license/support; không tạo convention thứ hai mặc định. |
| Custom application `.deb` / self-contained `jlink` | `DEFER` | Chỉ thêm nếu IT provenance/patch/rollback policy hoặc kết quả Q-14 yêu cầu. |
| Elasticsearch/OpenSearch, Redis | `DEFER` / `REJECT FOR CORE V0` | Chưa có search/cache workload trigger hay recovery owner. |
| Kafka/RabbitMQ/broker bắt buộc | `DEFER` | Outbox + bounded worker đủ cho Core v0; thêm khi volume/isolation/platform yêu cầu. |
| CloudEvents | `DEFER` | Chưa có external consumer contract cần version này. |
| S3/MinIO/object storage | `DEFER` | Provider-neutral adapter giữ đường nâng cấp; chưa cần service storage thứ hai. |
| SSR/RSC/Next.js | `DEFER` | Không có SEO/server-rendering need; thêm Node production runtime. |
| Microservices/Kubernetes/service mesh/HA cluster | `REJECT FOR CORE V0` | Không có measured independent-scale need hoặc platform team; không biến một VM thành HA. |
| SMB/direct Artifact path, universal CAD converter, CAD add-in | `REJECT FOR CORE V0` | Vi phạm custody boundary hoặc chưa có app/license/format evidence. |
| OAuth/OIDC server mới | `DEFER` | Native IDEA account trước; company OIDC là integration evolution. |

## 11. Architecture Review Challenge

1. **Phản biện mạnh nhất với Java:** hai runtime/toolchain trên toàn hệ thống và Boot minor clock riêng
   có thể quá sức cho đội nhỏ. Q-13 phải ghi người chịu trách nhiệm và đo burden thực tế.
2. **Phản biện mạnh nhất với PostgreSQL:** công ty có thể đã có SQL Server DBA/license/restore runbook
   tốt hơn. Q-02/Q-07/Q-14 có thể đảo database.
3. **Phản biện mạnh nhất với WPF:** WPF cũ hơn WinUI, Windows-only, và WebView2 là boundary đặc quyền
   cần bảo vệ. Q-10/Q-11 có thể buộc chọn shell khác.
4. **Dễ bị đảo nhất:** Desktop/Workspace delivery, vì IPC, accessibility, dirty-workspace update,
   CAD/Office và WebView2 hiện chưa chạy.
5. **Burden patch/ops dài hạn lớn nhất:** Java/JDK/Boot/Maven phía Server cộng Windows
   WPF/WebView2/.NET Workspace/Format Worker, không một package riêng lẻ.
6. **Phụ thuộc skill công ty nhất:** Temurin/Boot/PostgreSQL, backup/key custody, Windows
   signing/packaging và người trực incident; không giả định project user trực 24/7.
7. **Bằng chứng đổi sang runner-up:** Java fail một mandatory Q-01/Q-12/Q-14 mà .NET qua, hoặc Q-13
   chứng minh chi phí hai runtime material/không có owner và .NET có support path an toàn hơn.
8. **Có phải chọn .NET Server chỉ vì client Windows cũng .NET?** Không. Dùng chung C# chỉ là lợi thế
   maintainability. Server được chọn là Java vì Modulith, Integration/Batch và JDK optionality.
9. **Nếu Desktop/Workspace là black box độc lập ngôn ngữ?** Engineering vẫn chọn Java Server;
   Server chỉ giao tiếp qua HTTPS/JSON/OpenAPI, còn IPC nội bộ Windows không quyết định runtime Server.

## 12. PG3 readiness / pre-decision (không PASS)

| Câu hỏi | Trạng thái | Ý nghĩa |
|---|---|---|
| Chọn Server runtime/framework | `RESOLVED BY ENGINEERING RECOMMENDATION` | Java 25/Temurin 25 + Spring Boot 4.1.x/Modulith; PDA review và Q-01/Q-13 chưa chạy. |
| Chọn DB/persistence/migration | `RESOLVED BY ENGINEERING RECOMMENDATION` | PostgreSQL 18 + Spring JDBC/pgJDBC + một Flyway/SQL migration authority; Q-02/Q-07/Q-14 `NOT-RUN`. |
| Identity/Access Policy boundary | `RESOLVED BY ENGINEERING RECOMMENDATION` | Identity không thay Access Policy; Q-06/Q-08/Q-11 `NOT-RUN`. |
| Web/Desktop/Workspace shape | `RESOLVED BY ENGINEERING RECOMMENDATION` | WPF/WebView2 + per-user Workspace giữ surface hiện hành; bỏ surface cần Product Decision riêng. |
| Ubuntu 26.04 platform / full operational build | `SELECT — platform direction` / `QUALIFICATION REQUIRED` | Official Temurin/Boot/PGDG base path đã có; Q-14 vẫn phải xác nhận exact bundle/driver/migration/backup/monitoring/hardening và company policy. |
| License, certificate, signing, support/on-call | `BLOCKED` | Cần người/đơn vị công ty xác nhận; repository chưa có evidence. |
| Transaction/concurrency/outbox/module boundary | `QUALIFICATION REQUIRED` | Q-01/Q-02/Q-05 và architecture tests, toàn bộ `NOT-RUN`. |
| Transfer/storage/recovery | `QUALIFICATION REQUIRED` | Q-04/Q-07, không dùng demo nhỏ làm bằng chứng. |
| Unicode/Japanese search | `QUALIFICATION REQUIRED` | Q-03 với corpus và threshold được duyệt. |
| CAD/Office/IRONCAD | `QUALIFICATION REQUIRED` | Q-09 exact app/version/license/worker. |
| Install/update/WebView2/native attack | `QUALIFICATION REQUIRED` | Q-10/Q-11 clean image/threat cases. |
| Observability/maintainability | `QUALIFICATION REQUIRED` | Q-12/Q-13 runbook/SBOM/support rotation. |
| Sếp duyệt TECH-001@0.10 | `NOT-RUN` | Brief này chỉ trình recommendation. |
| PG3 | `NOT-RUN` | Gate owner phải đánh giá theo GOV/DOC-07/VVP; không có PASS trong tài liệu này. |

Minimum evidence trước khi sếp có thể quyết định Tech: xem đúng matrix/brief/source pins; xác nhận
OS/DB edition/license/certificate/signing/support owner; có Q-01/Q-02/Q-05 transaction evidence,
Q-06/Q-08/Q-11 security/IPC evidence và Q-14 complete-stack compatibility. Các Q-03/Q-04/Q-07/
Q-09/Q-10/Q-12/Q-13 còn lại là qualification triển khai/operational theo gate owner, không được
đổi thành PASS bằng cách viết brief.

## 13. Qualification backlog (giữ nguyên NOT-RUN)

| ID | Cần chứng minh trên recommendation này | Trạng thái |
|---|---|---|
| `Q-01` | Java/Boot/Modulith/JDBC/Flyway Server vertical slice: Check-out/Reference/Check-in/Release, module verification, immutable Generation, owner outcome/Audit/outbox atomic và idempotent retry | `NOT-RUN` |
| `Q-02` | PostgreSQL transaction, optimistic/pessimistic lock, deadlock/timeout/retry và không lost update | `NOT-RUN` |
| `Q-03` | PostgreSQL projection với Vietnamese/Japanese, normalization/width/case, permission filter, p95/p99 và rebuild | `NOT-RUN` |
| `Q-04` | Temurin/Boot Server ↔ .NET Workspace: Store→Server→Workspace multi-GB stream, digest, interruption/resume, journal và duplicate OperationId | `NOT-RUN` |
| `Q-05` | Spring dispatcher/Integration Adapter + outbox crash/duplicate/reorder/replay và consumer idempotency | `NOT-RUN` |
| `Q-06` | Spring Security/Session JDBC cookie/session fixation, CSRF, revoke/expiry/reauth và Workspace binding | `NOT-RUN` |
| `Q-07` | Restore DB + Artifact + config/policy/key về mốc dùng được, đo RTO/RPO | `NOT-RUN` |
| `Q-08` | Named pipe cross-user/cross-Workspace, replay/oversize/version/reconnect refusal | `NOT-RUN` |
| `Q-09` | Exact Office/IRONCAD open/save, stale/in-use/error và Representation provenance | `NOT-RUN` |
| `Q-10` | WPF/WebView2 install, Evergreen/Fixed, online/offline update, dirty Workspace rollback, signing/SBOM | `NOT-RUN` |
| `Q-11` | WebView2 navigation/message, CSRF/DNS rebinding/origin/host-object attack boundary | `NOT-RUN` |
| `Q-12` | Actuator/Micrometer/OpenTelemetry/JFR/log/metric/trace incident diagnosis, redaction/cardinality/runbook | `NOT-RUN` |
| `Q-13` | Java Server + .NET Windows build/patch/debug/incident rotation, hai SBOM, support/entitlement burden và .NET Server comparison | `NOT-RUN` |
| `Q-14` | Exact Temurin/Boot/JDBC/Flyway/PostgreSQL/Ubuntu 26.04 bundle/systemd/backup/monitoring/restore; official base support đã có nhưng operational build `NOT-RUN`; 24.04/.NET/Windows branches `DEFERRED` | `NOT-RUN` |

Không có comparative branch nào được giả làm đã chạy. “Deferred” chỉ nghĩa chưa thực hiện vì không
phải Core v0 baseline.

## 14. Product impact và governance

`TECH-001@0.10` chỉ trình bày một recommendation để sếp phản biện:

- **No Product Scope Change.** Không đổi FTR, REQ, Feature, Spec, DOC-01…DOC-08 hay DDM capability
  semantics.
- Không đổi architecture semantics: Artifact Custody, Transaction Coordinator, server-established
  ActorContext, Access Policy/owner outcome, shared relational UoW, Reservation `Active → Ended /
  Expired / Recovered`, `Store → Server → Workspace`, Representation acceptance và Restricted Recovery
  Mode vẫn theo DOC-05/DOC-06.
- Không tạo God Module mới, không thêm microservices/Kubernetes/broker/search service/CAD add-in.
- Không có review/acceptance hay gate result mới: Product Decision Authority `NOT-RUN`, PG3 `NOT-RUN`,
  PG4 `NOT-RUN`; mọi VVP/qualification result `NOT-RUN`.

Decision brief này phải được review lại nếu source baseline, company platform/support, license,
qualification result hoặc Product Decision Authority thay đổi.
