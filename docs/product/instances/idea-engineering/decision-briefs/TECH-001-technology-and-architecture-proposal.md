# TECH-001 — Đề xuất công nghệ và kiến trúc IDEA Engineering Core v0

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu / Stable ID | `TECH-001` |
| Phiên bản / ngày soạn | `0.9` / `13-09-2026` |
| Trạng thái | `Draft` — Engineering Recommendation đã hoàn tất; Product Decision Authority review/approval `NOT-RUN` |
| Vai trò | Brief tiếng Việt để sếp xem xét trục Tech; không phải Core Product Document và không tự phê duyệt stack |
| Người soạn / review | Principal Product Author — trợ lý soạn; review nội bộ đầy đủ `NOT-RUN` |
| Người quyết định | Sếp — `Product Decision Authority` |
| Product Normativity | `INFORMATIVE` — không tạo FTR/REQ và không đổi hành vi sản phẩm |
| Cơ sở chi tiết | [`IE-KNW-TECH-DEC-001@0.1`](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md); [`IE-RES-TECH-20260913-001`](../../../../research/2026-09-13-technology-selection-evidence-synthesis.md) |
| Baseline sản phẩm | `IDEA-C1-ANALYSIS-DESIGN-001`; DOC-01@0.6, DOC-02@0.2, DOC-03@0.7, DOC-04@0.13, DOC-05@0.16, DOC-06@0.16, DOC-07@0.6, DOC-08@0.12, GOV@0.3, VVP@0.16 và các ADR đã Accepted |
| Change Record | [`IE-CHG-TECH-DEC-001@0.1`](../registers/CHG-2026-09-13-technology-decision-recommendation.md); predecessor `TECH-001@0.8` |
| Supersedes / Superseded by | Supersedes `TECH-001@0.8`; superseded by `NOT-APPLICABLE` |
| Giới hạn | Chỉ phân tích và đề xuất. Chưa viết production code, chưa cài đặt/triển khai, chưa mua license/hạ tầng, chưa có kết quả qualification và không tuyên bố PG3/PG4 `PASS`. |
| Trạng thái quyết định | Engineering Recommendation: `COMPLETE`; Product Decision Authority Approval: `NOT-RUN` |

## 1. Kết luận để sếp phản biện

Engineering đề xuất **một bộ Core v0 cụ thể**:

```text
.NET 10 LTS / ASP.NET Core 10 / C# modular monolith
PostgreSQL 18 + EF Core 10/Npgsql (raw Npgsql có giới hạn theo Module)
React 19.3 + TypeScript 7 + Vite 8.3 / Node 22 LTS build
WPF net10.0-windows + WebView2 Evergreen
Workspace .NET 10 riêng theo từng Windows user, IPC named pipe có xác thực
Private server-managed filesystem Artifact Store
Separate Windows Format Worker khi CAD/Office/license yêu cầu
Ubuntu Server 26.04 LTS (Q-14 bắt buộc; Ubuntu 24.04/Windows Server 2025 là fallback)
Native package + systemd trên một VM/company-managed, không HA
OpenTelemetry + structured logs/metrics/traces + PostgreSQL PITR/WAL và backup độc lập
```

Đây là **khuyến nghị kỹ thuật**, không phải câu “Java và .NET đều tốt” cũng không phải quyết định
của sếp. Java 25 + Spring Boot 4.1.x vẫn là runner-up chính thức; SQL Server 2025 cũng là
runner-up. Lý do chọn .NET cho Core v0 là hợp nhất runtime cho Server, Desktop và Workspace trong
bối cảnh Windows engineering PCs, đội vận hành nhỏ và chưa có bằng chứng cần hệ phân tán — không
phải tuyên bố .NET nhanh hơn hay “enterprise-grade” hơn Java.

## 2. Recommended Core v0 Stack

| Layer | Trạng thái | Lựa chọn đề xuất | Vai trò và điều kiện |
|---|---|---|---|
| Server language/runtime | `SELECT` | C# / `.NET 10 LTS` | Một runtime chính cho Server, Desktop và Workspace; deploy patch `.NET 10.x` còn được hỗ trợ. |
| Server framework | `SELECT` | ASP.NET Core 10 / Kestrel | HTTPS API, hosted workers và diagnostics; Module boundary phải được kiểm bằng project/analyzer/architecture test. |
| Architecture style | `SELECT` | Deep-module modular monolith | Một Server deployable, Module sở hữu state/Interface; Coordinator chỉ orchestration/UoW, không CRUD authority. |
| Database | `SELECT` | PostgreSQL 18 | Metadata, workflow, structure, authorization, Audit, search projection và outbox; Artifact bytes ở kho riêng. Minor dùng bản supported tại qualification. |
| Persistence | `SELECT` | EF Core 10 + Npgsql EF 10.x; raw Npgsql có tên/giới hạn | EF cho aggregate thông thường; raw Npgsql chỉ cho streaming, lock, bulk, search rebuild hoặc outbox có đo đạc và test. |
| Schema migration | `SELECT` | EF migration bundles, expand–migrate–contract | Một schema authority; migration review/preflight rõ ràng, không tự destructive down migration; rollback DB là forward repair/restore. |
| Account/authentication | `SELECT` | ASP.NET Core Identity + IDEA Actor/Account domain | Identity quản lý credential/session primitives; Web dùng HttpOnly SameSite cookie + CSRF. Actor, Account, Login Identity và Security Principal tách biệt. |
| Authorization | `SELECT` | IDEA Access Policy | Server/IAM establish `ActorContext`; policy resolve IAM eligibility + Project/Group + Role Assignment/version + Scope; owner gate và commit-time revalidation sau đó. |
| API | `SELECT` | Versioned HTTPS JSON REST + OpenAPI 3.1 | Stable Resource/Operation ID, expected state và idempotency key; client không truy cập DB và không tự gửi ActorId có thẩm quyền. |
| Integration publication | `SELECT` | PostgreSQL transactional outbox + bounded hosted dispatcher + per-system Adapter | Outcome/Audit/outbox atomic trong relational UoW; consumer idempotent. Broker chưa bắt buộc. |
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
| Server OS | `SELECT` có điều kiện | Ubuntu Server 26.04 LTS | LTS mới hiện tại theo bối cảnh; Q-14 phải xác nhận toàn bộ .NET/PostgreSQL/backup/monitoring/package. Fallback Ubuntu 24.04, sau đó Windows Server 2025 nếu policy công ty yêu cầu. |
| Deployment packaging | `SELECT` | Versioned Debian package + systemd; config/secrets ngoài package | Ít lớp storage/startup/recovery cho một operator; signed bundle, preflight, health check và rollback phải được thử. |
| Reverse proxy/TLS | `SELECT` | Company-approved Nginx baseline + managed certificate | TLS/origin/header policy thuộc deployment; Nginx không thay Access Policy. |
| Background jobs | `SELECT` | ASP.NET Core hosted workers | Outbox/maintenance có Operation ID, bounded retry/lease và idempotency; Format Worker tách riêng. |
| Observability | `SELECT` | OpenTelemetry + structured JSON logs + metrics/traces qua OTLP; `dotnet-monitor`/EventPipe | Audit Evidence tách khỏi log; backend/export/retention để company chọn và phải qualify. |
| Backup/recovery | `SELECT` có điều kiện | PostgreSQL base backup + WAL/PITR + coordinated Artifact/config/policy/key backup ở failure domain khác | RTO ≤4 giờ làm việc và RPO ≤1 giờ chỉ là mục tiêu sơ bộ; chưa có đo đạt. Một VM không phải HA. |

## 3. Server decision: vì sao chọn .NET thay vì Java

### 3.1 Hai finalist nghiêm túc

| Candidate | Phân loại | Kết luận |
|---|---|---|
| `.NET 10 LTS + ASP.NET Core 10` | `SELECT` | Server Core v0 được khuyến nghị. |
| `Java 25 LTS + Eclipse Temurin 25 + Spring Boot 4.1.x` | `ALTERNATIVE` | Runner-up đầy đủ, không bị coi là công nghệ yếu; distribution/SLA vẫn phải qualify. |

Evidence hiện tại không chứng minh runtime nào thắng tuyệt đối về throughput, scale hay độ “xịn”.
Java có ưu thế thật ở Spring Modulith (kiểm tra module trực tiếp), Spring Integration/Batch và
optionality của JDK distribution/support. .NET có ưu thế ở Windows Workspace: named pipes, DPAPI,
COM/P/Invoke, packaging và diagnostics cùng hệ sinh thái.

Core v0 chọn .NET vì:

1. Workspace và Desktop chắc chắn phải sống trên Windows; đây là ranh giới có unknown cao nhất.
2. Dùng một runtime/language/toolchain chính giảm số runbook, debugger, SBOM và patch calendar cho
   nhóm nhỏ; không phải vì Java server không scale.
3. ASP.NET Core/EF/Npgsql/Worker/OpenTelemetry đủ để thực hiện modular monolith, explicit owner
   transaction, streaming và outbox mà không thêm dịch vụ phân tán.
4. Module ownership, HTTP contract và outbox giữ đường tách Module sau này; không cần chọn Java chỉ
   để “chuẩn bị scale”.
5. 50–100 intended users và một site chưa tạo bằng chứng bù được chi phí vận hành thêm một runtime
   Server chính.

Q-01, Q-12 và Q-13 phải chạy cùng contract/failure cases. Nếu Java chứng minh ưu thế vận hành hoặc
đáp ứng một integration contract bắt buộc, recommendation này phải được thay bằng successor Tech
record; không được lén đổi trong code.

### 3.2 Điều kiện chuyển sang Java

Chỉ chuyển nếu có bằng chứng đồng thời về Java 25 distribution/support, Spring BOM, người vận hành,
security/runbook và một lợi ích material được management chấp nhận; hoặc Q-01/Q-12 cho thấy .NET
không đạt điều kiện bắt buộc trong khi Java đạt. Việc Aras/DDM dùng Java/.NET/SQL Server chỉ là
`COMPETITOR-OBSERVATION`, không phải căn cứ quyết định.

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

- EF Core 10 + Npgsql EF 10.x là default cho aggregate owner bình thường.
- Raw Npgsql chỉ nằm trong Module sở hữu và có lý do đo được: multi-GB streaming, `COPY`/bulk,
  locking, search projection rebuild hoặc outbox.
- Dapper không phải default convention; không có generic repository/CRUD authority.
- Coordinator không sở hữu entity hay policy; chỉ mở shared relational UoW cho operation được khai
  báo. Owner outcome, Audit Evidence và outbox commit theo boundary hiện hành.

EF migration bundles là schema authority duy nhất. Release dùng expand–migrate–contract, migration
đã review/idempotent và preflight rõ. Application rollback không tự rollback schema; destructive
change cần forward repair hoặc restore có kiểm chứng.

## 5. Identity và authorization

ASP.NET Core Identity được chọn cho Login Identity, password hashing, lockout, recovery và session
primitives. Web dùng secure HttpOnly/SameSite cookie và CSRF protection. Built-in Identity bearer
token (nếu dùng trong một spike) không được gọi là OAuth/OIDC/JWT và không tạo OAuth server mới.

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

IDEA Access Policy là product authority. ASP.NET Identity roles/claims không thay thế Principal–Role–
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
├── IDEA Server .NET 10 modular monolith
│   ├── owner Modules + narrow Interfaces
│   ├── bounded outbox/background workers
│   └── OpenTelemetry/structured diagnostics
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

Chọn native Debian package + systemd thay vì production Kubernetes/container requirement vì topology
nhỏ, một operator và file/DB recovery trực tiếp hơn. Development container là tiện ích, không phải
production authority. Một VM không được gọi là HA; backup phải ở failure domain khác và Q-07 phải thử
restore DB + bytes + config/policy + keys về một mốc sử dụng được.

Server OS chính là Ubuntu 26.04 LTS theo ưu tiên LTS hiện tại. Q-14 phải xác nhận complete-stack
support; nếu fail thì dùng Ubuntu 24.04 LTS, hoặc Windows Server 2025 khi policy/company support
thắng. Không triển khai SQL Server trên Ubuntu 26.04 khi chưa có support evidence.

### 9.2 Observability và version policy

OpenTelemetry + OTLP là protocol baseline; log/metric/trace backend do công ty chọn sau. Tối thiểu
phải quan sát request outcome, DB pool/lock, transfer, outbox lag, worker health, storage, process/GC,
Operation ID, authorization denial và recovery. Audit Evidence là record riêng, không thay bằng log.

Policy là chọn **family** rồi qualify patch hiện hành:

| Family | Policy |
|---|---|
| .NET/ASP.NET Core | `.NET 10 LTS`, luôn ở supported patch; LTS hiện ghi tới 14-11-2028 |
| EF/Npgsql | EF Core 10 + Npgsql 10.x pair đã build/test tương thích |
| PostgreSQL | Major 18, minor supported hiện hành tại qualification; support table recheck |
| React/TypeScript/Vite | React 19.3, TS7, Vite 8.3; exact packages/lockfile/SBOM |
| Node | Node 22 LTS build line, tối thiểu 22.12 cho Vite 8 |
| WPF/WebView2 | `net10.0-windows`; Evergreen theo IT; Fixed có lịch patch riêng nếu buộc dùng |
| Ubuntu | 26.04 primary, 24.04 fallback; Q-14 chứng minh toàn bộ matrix |
| Bundles/dependencies | Signed/versioned package, monthly security review và quarterly planned update đề xuất; chưa phải SLA đã duyệt |

## 10. Alternatives not selected

| Lựa chọn | Phân loại | Vì sao chưa chọn / khi nào xem lại |
|---|---|---|
| Java 25 + Spring Boot/Modulith | `ALTERNATIVE` | Module/integration/batch mạnh nhưng thêm Server runtime; xem lại khi Java support/Q-01/Q-13 material hơn. |
| SQL Server 2025 | `ALTERNATIVE` | Xem lại khi company DBA/license/edition/restore support có bằng chứng vượt PostgreSQL. |
| Ubuntu 24.04 | `ALTERNATIVE` fallback | Dùng nếu 26.04 không qua Q-14; không phải bị loại về chất lượng. |
| Windows Server 2025 | `ALTERNATIVE` fallback | Dùng nếu IT/policy/support Windows thắng; phải tính license/ops. |
| WinUI 3 | `ALTERNATIVE` | Q-10 phải chứng minh lợi ích UI/accessibility/packaging bù servicing clock. |
| Browser + agent only | `ALTERNATIVE` + `FOLLOW-UP PRODUCT DECISION REQUIRED` | Không được tự xóa Web-rendered Desktop surface; LNA/IPC/install chưa qualify. |
| Tauri/Rust | `ALTERNATIVE` challenger | React reuse tốt nhưng thêm Rust/updater/IPC và không có multi-year LTS; Q-08/Q-10/Q-11 phải pass. |
| Electron | `REJECT FOR CORE V0` | Bundled Chromium/Node và cadence patch thêm burden không được chứng minh cần. |
| JavaFX / Qt | `DEFER` | Support evidence không đóng unknown WebKit/native/installer/CAD; thêm runtime/licensing boundary. |
| TypeScript 6 production | `REJECT FOR CORE V0` | Chỉ compatibility lane cho tooling. |
| Dapper/default jOOQ/JPA | `DEFER` | Không chọn thêm mapping convention; Java persistence chỉ mở nếu Server đổi. |
| Elasticsearch/OpenSearch, Redis | `DEFER` / `REJECT FOR CORE V0` | Chưa có search/cache workload trigger hay recovery owner. |
| Kafka/RabbitMQ/broker bắt buộc | `DEFER` | Outbox + bounded worker đủ cho Core v0; thêm khi volume/isolation/platform yêu cầu. |
| CloudEvents | `DEFER` | Chưa có external consumer contract cần version này. |
| S3/MinIO/object storage | `DEFER` | Provider-neutral adapter giữ đường nâng cấp; chưa cần service storage thứ hai. |
| SSR/RSC/Next.js | `DEFER` | Không có SEO/server-rendering need; thêm Node production runtime. |
| Microservices/Kubernetes/service mesh/HA cluster | `REJECT FOR CORE V0` | Không có measured independent-scale need hoặc platform team; không biến một VM thành HA. |
| SMB/direct Artifact path, universal CAD converter, CAD add-in | `REJECT FOR CORE V0` | Vi phạm custody boundary hoặc chưa có app/license/format evidence. |
| OAuth/OIDC server mới | `DEFER` | Native IDEA account trước; company OIDC là integration evolution. |

## 11. Architecture Review Challenge

1. **Phản biện mạnh nhất với .NET:** Java có module verification và Integration/Batch rõ hơn. Nếu Q-13
   cho thấy chi phí hỗ trợ .NET cao hơn material, phải đổi.
2. **Phản biện mạnh nhất với PostgreSQL:** công ty có thể đã có SQL Server DBA/license/restore runbook
   tốt hơn. Q-02/Q-07/Q-14 có thể đảo database.
3. **Phản biện mạnh nhất với WPF:** WPF cũ hơn WinUI, Windows-only, và WebView2 là boundary đặc quyền
   cần bảo vệ. Q-10/Q-11 có thể buộc chọn shell khác.
4. **Dễ bị đảo nhất:** Desktop/Workspace delivery, vì IPC, accessibility, dirty-workspace update,
   CAD/Office và WebView2 hiện chưa chạy.
5. **Burden patch/ops dài hạn lớn nhất:** toàn bộ Windows delivery surface (WPF + WebView2 + Workspace
   + Format Worker), không phải riêng một NuGet package.
6. **Phụ thuộc skill công ty nhất:** Ubuntu/PostgreSQL backup/key custody và Windows signing/packaging;
   không giả định project user trực 24/7.
7. **Bằng chứng đổi sang runner-up:** cùng fixture Java slice đạt correctness/security/recovery, có
   named distribution/BOM/support owner và Q-13 ghi nhận lợi ích material; hoặc một integration
   contract được duyệt bắt buộc Spring-specific capability.

## 12. PG3 readiness / pre-decision (không PASS)

| Câu hỏi | Trạng thái | Ý nghĩa |
|---|---|---|
| Chọn Server runtime/framework | `RESOLVED BY ENGINEERING RECOMMENDATION` | .NET 10/ASP.NET Core được chọn; PDA review và Q-01/Q-13 chưa chạy. |
| Chọn DB/persistence/migration | `RESOLVED BY ENGINEERING RECOMMENDATION` | PostgreSQL 18 + EF/Npgsql + EF migration authority; Q-02/Q-07/Q-14 `NOT-RUN`. |
| Identity/Access Policy boundary | `RESOLVED BY ENGINEERING RECOMMENDATION` | Identity không thay Access Policy; Q-06/Q-08/Q-11 `NOT-RUN`. |
| Web/Desktop/Workspace shape | `RESOLVED BY ENGINEERING RECOMMENDATION` | WPF/WebView2 + per-user Workspace giữ surface hiện hành; bỏ surface cần Product Decision riêng. |
| Ubuntu 26.04 full-stack support | `QUALIFICATION REQUIRED` | Q-14 phải xác nhận package/driver/backup/monitoring; fail thì fallback 24.04. |
| License, certificate, signing, support/on-call | `BLOCKED` | Cần người/đơn vị công ty xác nhận; repository chưa có evidence. |
| Transaction/concurrency/outbox/module boundary | `QUALIFICATION REQUIRED` | Q-01/Q-02/Q-05 và architecture tests, toàn bộ `NOT-RUN`. |
| Transfer/storage/recovery | `QUALIFICATION REQUIRED` | Q-04/Q-07, không dùng demo nhỏ làm bằng chứng. |
| Unicode/Japanese search | `QUALIFICATION REQUIRED` | Q-03 với corpus và threshold được duyệt. |
| CAD/Office/IRONCAD | `QUALIFICATION REQUIRED` | Q-09 exact app/version/license/worker. |
| Install/update/WebView2/native attack | `QUALIFICATION REQUIRED` | Q-10/Q-11 clean image/threat cases. |
| Observability/maintainability | `QUALIFICATION REQUIRED` | Q-12/Q-13 runbook/SBOM/support rotation. |
| Sếp duyệt TECH-001@0.9 | `NOT-RUN` | Brief này chỉ trình recommendation. |
| PG3 | `NOT-RUN` | Gate owner phải đánh giá theo GOV/DOC-07/VVP; không có PASS trong tài liệu này. |

Minimum evidence trước khi sếp có thể quyết định Tech: xem đúng matrix/brief/source pins; xác nhận
OS/DB edition/license/certificate/signing/support owner; có Q-01/Q-02/Q-05 transaction evidence,
Q-06/Q-08/Q-11 security/IPC evidence và Q-14 complete-stack compatibility. Các Q-03/Q-04/Q-07/
Q-09/Q-10/Q-12/Q-13 còn lại là qualification triển khai/operational theo gate owner, không được
đổi thành PASS bằng cách viết brief.

## 13. Qualification backlog (giữ nguyên NOT-RUN)

| ID | Cần chứng minh trên recommendation này | Trạng thái |
|---|---|---|
| `Q-01` | .NET Server vertical slice: Check-out/Reference/Check-in/Release, immutable Generation, owner outcome/Audit/outbox atomic và idempotent retry | `NOT-RUN` |
| `Q-02` | PostgreSQL transaction, optimistic/pessimistic lock, deadlock/timeout/retry và không lost update | `NOT-RUN` |
| `Q-03` | PostgreSQL projection với Vietnamese/Japanese, normalization/width/case, permission filter, p95/p99 và rebuild | `NOT-RUN` |
| `Q-04` | Store→Server→Workspace multi-GB stream, digest, interruption/resume, journal và duplicate OperationId | `NOT-RUN` |
| `Q-05` | Outbox crash/duplicate/reorder/replay và consumer idempotency | `NOT-RUN` |
| `Q-06` | Identity cookie/session fixation, CSRF, revoke/expiry/reauth và Workspace binding | `NOT-RUN` |
| `Q-07` | Restore DB + Artifact + config/policy/key về mốc dùng được, đo RTO/RPO | `NOT-RUN` |
| `Q-08` | Named pipe cross-user/cross-Workspace, replay/oversize/version/reconnect refusal | `NOT-RUN` |
| `Q-09` | Exact Office/IRONCAD open/save, stale/in-use/error và Representation provenance | `NOT-RUN` |
| `Q-10` | WPF/WebView2 install, Evergreen/Fixed, online/offline update, dirty Workspace rollback, signing/SBOM | `NOT-RUN` |
| `Q-11` | WebView2 navigation/message, CSRF/DNS rebinding/origin/host-object attack boundary | `NOT-RUN` |
| `Q-12` | OpenTelemetry/log/metric/trace incident diagnosis, redaction/cardinality/runbook | `NOT-RUN` |
| `Q-13` | Team build/patch/debug/incident rotation, SBOM, support burden và Java comparison | `NOT-RUN` |
| `Q-14` | .NET/PostgreSQL/Ubuntu 26.04 package/driver/backup/monitoring support matrix; 24.04/Windows/Java branches `DEFERRED` | `NOT-RUN` |

Không có comparative branch nào được giả làm đã chạy. “Deferred” chỉ nghĩa chưa thực hiện vì không
phải Core v0 baseline.

## 14. Product impact và governance

`TECH-001@0.9` chỉ trình bày một recommendation để sếp phản biện:

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
