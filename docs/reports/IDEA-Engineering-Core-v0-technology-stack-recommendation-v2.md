# BÁO CÁO ĐỀ XUẤT NỀN TẢNG CÔNG NGHỆ

## IDEA ENGINEERING — CORE V0

**Đề xuất công nghệ và cách tổ chức hệ thống**

**Trạng thái:** `Trình sếp xem xét`

**Mã tài liệu:** `IE-MGMT-TECH-REPORT-001`

**Phiên bản:** `0.2`

**Ngày lập:** 15/09/2026

**Người phụ trách:** Nguyễn Huỳnh Phúc Lâm
**Người xem xét và quyết định:** Product Decision Authority

## Thông tin và tiêu chuẩn áp dụng

### Kiểm soát tài liệu

| Thông tin | Nội dung |
|---|---|
| Mục đích | Giúp người quản lý hiểu nhóm kỹ thuật đề xuất công nghệ nào, hệ thống được chia thành những phần nào, vì sao chọn phương án này và khi nào phải xem xét lại. |
| Phạm vi | IDEA Engineering Core v0. Báo cáo phục vụ sếp xem xét; không thay thế TECH-001, DOC-05 hoặc hồ sơ kiểm chứng kỹ thuật. |
| Nguồn kỹ thuật | TECH-001@0.14; IE-KNW-TECH-DEC-001@0.6; IE-CHG-TECH-BASELINE-001@0.2; IE-ARC-TECH-VIEW-001@0.2; Q-15 Phase 1-3; DOC-05@0.20. |
| Mốc mã nguồn | `d84630c53501fc13bb2eadf1bc44b3d97464a0c8` |
| Bản trước | `IE-MGMT-TECH-REPORT-001@0.1`, được lưu tại commit `f2174dab9366626615bb85a5e28251bf4f8eaf47`. |
| Trạng thái quyết định | Nhóm kỹ thuật đã chọn phương án đề xuất; sếp chưa phê duyệt. Q-15 giữ nguyên `PARTIAL / NO WINNER`. |
| Thay đổi ở phiên bản 0.2 | Viết lại câu chữ; dùng đúng Heading để ngăn điều hướng của Word hoạt động; thêm bảng thuật ngữ, danh mục bảng và hình, mô tả ảnh và hàng tiêu đề bảng. Không thay đổi lựa chọn công nghệ. |

### Tiêu chuẩn và cách áp dụng

| Nguồn hướng dẫn | Cách áp dụng trong báo cáo |
|---|---|
| `IE-STD-TECH-STACK-001@0.1` | Tách rõ đề xuất kỹ thuật, kết quả kiểm chứng và quyết định phê duyệt; trình bày phương án chính, phương án thay thế, kiến trúc và điều kiện xem xét lại. |
| `IE-STD-AUTH-001@0.2` | Ghi rõ mã tài liệu, phiên bản, trạng thái, nguồn và ý nghĩa của `SELECT`, `PARTIAL`, `BLOCKED`, `NOT-RUN`. |
| Hướng dẫn tài liệu trình quản lý của dự án | Dùng tiếng Việt trực tiếp, giữ thuật ngữ kỹ thuật cần thiết, có bìa, mục lục, logo IDEA và kiểm tra từng trang Word sau khi xuất. |
| ISO/IEC/IEEE 42010:2022 | Dự án tham khảo cách mô tả kiến trúc: mỗi hình có mã, loại hình, mục đích và giới hạn diễn giải. |
| ISO/IEC 25010:2023 | Dự án tham khảo các đặc tính chất lượng: phù hợp chức năng, bảo mật, khả năng bảo trì, vận hành, độ tin cậy và khả năng thay đổi. |
| ISO/IEC/IEEE 15289:2019 và ISO/IEC/IEEE 12207:2026 | Dự án tham khảo cách tổ chức thông tin và theo dõi quyết định trong vòng đời phát triển. |

Các tiêu chuẩn quốc tế trên được dùng làm nguồn tham khảo cho cách trình bày và kiểm tra phạm vi.
Báo cáo không tuyên bố tuân thủ đầy đủ hoặc được chứng nhận theo các tiêu chuẩn đó.

## Mục lục

Mục lục trong bản Word được tạo từ Heading 1 và Heading 2. Các Heading này đồng thời tạo ngăn điều hướng.

## Danh mục hình

1. Hình 1. TECH-D01 - Sơ đồ tổng quan công nghệ.
2. Hình 2. TECH-D05 - Sơ đồ triển khai Core v0.
3. Hình 3. TECH-D08 - Sơ đồ quyết định và điều kiện xem xét lại.

## Danh mục bảng

1. Bảng 1. Kiểm soát tài liệu.
2. Bảng 2. Tiêu chuẩn và cách áp dụng.
3. Bảng 3. Thuật ngữ dùng trong báo cáo.
4. Bảng 4. Công nghệ được đề xuất cho Core v0.
5. Bảng 5. Trách nhiệm của các phần trong kiến trúc.
6. Bảng 6. Cơ sở lựa chọn.
7. Bảng 7. So sánh Java/Spring và .NET/ASP.NET Core.
8. Bảng 8. So sánh React kết hợp WPF/WebView2 và Flutter.
9. Bảng 9. So sánh Modular Monolith và Microservices.

## Thuật ngữ dùng trong báo cáo

| Thuật ngữ | Nghĩa dùng thống nhất trong báo cáo |
|---|---|
| Adapter | Thành phần nối IDEA với một hệ thống hoặc công cụ bên ngoài qua giao tiếp đã quy định. |
| API, REST và OpenAPI | API là giao tiếp giữa các phần mềm. REST là cách tổ chức API qua HTTP. OpenAPI là bản mô tả có cấu trúc của API để hai bên phát triển và kiểm tra cùng một hợp đồng. |
| Artifact và Artifact Store | Artifact là nội dung tệp được IDEA quản lý. Artifact Store là kho tệp riêng do Server kiểm soát; người dùng không truy cập kho này trực tiếp. |
| ASP.NET Core | Nền tảng .NET để xây dựng Server và API; là phương án thay thế đang được giữ lại. |
| Audit (nhật ký kiểm tra) | Bản ghi cho biết ai đã thực hiện thao tác nào, vào thời điểm nào và kết quả ra sao. |
| Baseline kỹ thuật | Phương án kỹ thuật chuẩn do nhóm kỹ thuật chọn để triển khai tiếp. Chưa đồng nghĩa sếp đã duyệt hoặc hệ thống đủ điều kiện vận hành chính thức. |
| Browser và Web | Browser là trình duyệt. Web là giao diện chạy trong trình duyệt hoặc được WebView2 hiển thị trong ứng dụng Windows. |
| Build, package và dependency | Build là tạo sản phẩm chạy được; package là gói phát hành; dependency là thư viện hoặc thành phần phần mềm phụ thuộc. |
| `BLOCKED` | Chưa thể hoàn tất kiểm tra vì thiếu điều kiện, môi trường hoặc người có thẩm quyền. Không có nghĩa là công nghệ đã thất bại. |
| CAD, Office và IRONCAD | CAD là nhóm phần mềm thiết kế kỹ thuật. Office là nhóm ứng dụng văn phòng. IRONCAD là ứng dụng CAD nằm trong bối cảnh tích hợp của IDEA. |
| Client, Desktop và UI | Client là phần người dùng thao tác; Desktop là ứng dụng trên máy tính; UI là giao diện người dùng. |
| Codebase | Tập hợp mã nguồn của một ứng dụng hoặc một phần hệ thống. |
| Core v0 | Phần sản phẩm đầu tiên đang được thiết kế và chuẩn bị triển khai theo phạm vi đã thống nhất. |
| Database và PostgreSQL | Database là nơi lưu dữ liệu có cấu trúc. PostgreSQL 18 là hệ quản trị cơ sở dữ liệu được Engineering đề xuất cho Core v0. |
| Deep-module Modular Monolith | Một ứng dụng Server duy nhất để triển khai, nhưng bên trong được chia thành các Module có trách nhiệm và quyền sở hữu dữ liệu rõ ràng. |
| Flutter và Dart | Flutter là nền tảng làm giao diện đa nền tảng; Dart là ngôn ngữ sử dụng với Flutter. |
| Format Worker | Tiến trình Windows riêng dùng cho công việc CAD, Office hoặc bản quyền xử lý định dạng khi cấu hình thực tế yêu cầu. |
| HA và failure domain | HA là khả năng duy trì dịch vụ khi có lỗi. Failure domain là phạm vi có thể cùng bị ảnh hưởng bởi một sự cố. |
| HTTPS và JSON | HTTPS là kết nối Web có mã hóa. JSON là định dạng dữ liệu mà Client và Server trao đổi qua API. |
| Java và Eclipse Temurin | Java là runtime/ngôn ngữ được đề xuất cho Server. Eclipse Temurin là bản phân phối Java được nêu trong baseline. |
| JAR và systemd | JAR là gói chạy của ứng dụng Java. systemd là cơ chế Linux dùng để khởi động và giám sát tiến trình Server. |
| Kubernetes, Service Mesh, broker, Redis và công cụ tìm kiếm | Các thành phần hạ tầng chưa nằm trong Core v0. Broker gồm Kafka/RabbitMQ; công cụ tìm kiếm gồm Elasticsearch/OpenSearch. |
| License | Quyền sử dụng phần mềm theo điều kiện của nhà cung cấp; có thể quyết định nơi phải chạy xử lý CAD hoặc Office. |
| Linux-first và Ubuntu Server | Linux-first nghĩa là thiết kế Server ưu tiên chạy trên Linux. Ubuntu Server 26.04 LTS là hệ điều hành được đề xuất và còn phải kiểm chứng. |
| Metadata | Thông tin mô tả tài liệu như mã, tên, Revision, Version, trạng thái, quyền và quan hệ; khác với nội dung tệp. |
| Microservices | Kiến trúc chia hệ thống thành nhiều dịch vụ triển khai độc lập và giao tiếp qua mạng. |
| Mobile, macOS và Linux Desktop | Các bề mặt ngoài Web và Windows Desktop; Core v0 chưa có yêu cầu bắt buộc cho các bề mặt này. |
| Module | Một phần bên trong Server có trách nhiệm nghiệp vụ và dữ liệu riêng, giao tiếp với phần khác qua interface đã quy định. |
| Named Pipe và IPC | IPC là giao tiếp giữa các tiến trình trên cùng máy. Named Pipe là cơ chế Windows được đề xuất để ứng dụng Desktop liên lạc với Workspace. |
| Native | Mã hoặc chức năng làm việc trực tiếp với hệ điều hành Windows thay vì chạy hoàn toàn trong giao diện Web. |
| Nginx và TLS | Nginx nhận kết nối Web ở đầu vào. TLS mã hóa và xác thực kết nối; HTTPS là HTTP chạy qua TLS. |
| .NET | Runtime được đề xuất cho WPF và Workspace trên Windows. Không phải runtime đã được chọn cho Format Worker. |
| `NOT-RUN` | Hoạt động kiểm tra hoặc phê duyệt chưa được thực hiện. |
| `PARTIAL / NO WINNER` | Q-15 mới kiểm tra được một phần và chưa chứng minh phương án giao diện nào thắng phương án còn lại. |
| Product Decision Authority | Người có thẩm quyền xem xét và phê duyệt Feature, Spec và Tech của sản phẩm. Trong dự án này là sếp. |
| Product state | Trạng thái chính thức của tài liệu và cấu trúc sản phẩm trên Server, gồm Revision, Version, Generation và trạng thái vòng đời. |
| Qualification (kiểm chứng kỹ thuật) | Việc kiểm tra một cấu hình cụ thể trong điều kiện và mục tiêu đã xác định trước khi dùng làm căn cứ triển khai. |
| Q-15 | Hồ sơ thử nghiệm so sánh hai phương án giao diện Client. Kết quả hiện tại là `PARTIAL / NO WINNER`. |
| React, TypeScript và Vite | React tạo giao diện nghiệp vụ. TypeScript là ngôn ngữ dùng để viết giao diện. Vite là công cụ build giao diện Web. |
| `SELECT`, `ALTERNATIVE` và `NOT SELECTED` | `SELECT` là lựa chọn của nhóm kỹ thuật. `ALTERNATIVE` là phương án còn hợp lệ; `EVALUATED ALTERNATIVE` đã được đánh giá. `NOT SELECTED` là chưa được chọn. |
| Runtime | Môi trường cần có để chương trình chạy, ví dụ Java Runtime hoặc .NET Runtime. |
| Server và Backend | Phần chạy tập trung, xử lý nghiệp vụ, kiểm tra quyền và lưu trạng thái chính thức. Báo cáo dùng từ Server khi nói đến boundary triển khai và Backend khi nói đến mã xử lý phía Server. |
| Spring Boot và Spring Modulith | Spring Boot là framework Server. Spring Modulith hỗ trợ tổ chức và kiểm tra ranh giới Module trong Modular Monolith. |
| Spring JDBC, JdbcClient và Flyway | JDBC/JdbcClient là cách Server Java truy cập PostgreSQL. Flyway quản lý thay đổi cấu trúc database theo phiên bản. |
| Toolchain | Bộ công cụ dùng để build, quản lý dependency, đóng gói, kiểm tra và phát hành phần mềm. |
| Transaction (giao dịch dữ liệu) | Một nhóm thay đổi phải cùng thành công hoặc cùng bị hủy để dữ liệu không rơi vào trạng thái dở dang. |
| VM | Máy ảo dùng để chạy hệ điều hành và các thành phần Server. |
| WAL/PITR và bản sao bất biến | WAL/PITR hỗ trợ khôi phục PostgreSQL tới một thời điểm; bản sao bất biến không cho sửa sau khi đã ghi. |
| WebView2 | Thành phần Microsoft Edge dùng để hiển thị React UI bên trong ứng dụng Windows. |
| WPF | Công nghệ .NET dùng làm vỏ ứng dụng Windows của IDEA. WPF không chứa một bộ giao diện nghiệp vụ riêng. |
| Workspace | Tiến trình .NET chạy theo từng người dùng Windows, phụ trách tệp cục bộ và tương tác với IRONCAD/Office. |
| Worker | Tiến trình chạy công việc nền. Trong báo cáo, Worker chủ yếu chỉ Windows Format Worker. |

# 1 Nền tảng công nghệ được đề xuất

Nhóm kỹ thuật đề xuất dùng Java/Spring/PostgreSQL trên Linux cho Server, React/TypeScript cho giao
diện Web và WPF/WebView2 kết hợp .NET Workspace trên máy Windows của kỹ sư. Đây là phương án kỹ thuật chuẩn
được đề nghị cho IDEA Engineering Core v0.

| Hạng mục | Công nghệ đề xuất |
|---|---|
| Hệ điều hành máy chủ | Ubuntu Server 26.04 LTS |
| Xử lý nghiệp vụ trên Server | Java 25 LTS / Eclipse Temurin, Spring Boot và Spring Modulith |
| Kiến trúc Server | Deep-module Modular Monolith |
| Cơ sở dữ liệu | PostgreSQL 18 |
| Truy cập và thay đổi database | Spring JDBC / JdbcClient và Flyway |
| Giao tiếp Client - Server | HTTPS, JSON REST và OpenAPI |
| Giao diện Web | React, TypeScript và Vite |
| Ứng dụng Windows | WPF .NET 10 và WebView2 |
| Vùng làm việc cục bộ | .NET 10 Workspace |
| Giao tiếp cục bộ | Named Pipe có xác thực và kiểm soát phiên bản |
| Kho tệp | Artifact Store riêng do Server quản lý |
| Xử lý CAD/Office | Windows Format Worker tách riêng |

Core v0 cần trình duyệt Web và máy Windows của kỹ sư. Chưa đưa Microservices, Kubernetes, broker,
Redis hoặc công cụ tìm kiếm riêng vào phương án này vì sản phẩm hiện chưa cần; thêm chúng lúc này sẽ làm
tăng số thành phần phải triển khai và vận hành.

**Nội dung đề nghị sếp xem xét:** chấp thuận phương án trên làm cơ sở cho bước kiểm chứng kỹ thuật và lập
kế hoạch triển khai. Việc chấp thuận không đồng nghĩa hệ thống đã sẵn sàng vận hành chính thức.

# 2 Kiến trúc tổng thể

![Hình 1 TECH-D01 Sơ đồ tổng quan công nghệ](../product/instances/idea-engineering/evidence/IE-VEV-TECH-VIEW-002/TECH-D01.png)

**Loại hình:** sơ đồ tổng quan công nghệ. **Dùng để:** thấy các phần chính và đường giao tiếp.
**Không dùng để:** kết luận công nghệ đã kiểm chứng xong hoặc mô tả chi tiết từng Module.

## 2.1 Server tập trung trên Linux

Luồng chính là `Ubuntu Server → Java/Spring → PostgreSQL và Artifact Store`. Server giữ bản ghi chính
thức về tài liệu, cấu trúc, quyền và trạng thái xử lý. Client không truy cập database trực tiếp và
không tự quyết định người dùng được phép làm gì.

PostgreSQL lưu metadata, quan hệ, workflow, quyền và audit. Artifact Store giữ nội dung tệp. Mọi thay
đổi tài liệu đi qua Server, nên hệ thống kiểm tra quyền, ghi lịch sử và phục hồi dữ liệu ở một nơi.
Server không cần cài IRONCAD hoặc Office để xử lý nghiệp vụ chính.

## 2.2 Một giao diện React dùng cho Web và Desktop

IDEA không viết hai bộ màn hình nghiệp vụ. Trình duyệt chạy React trực tiếp. Trên Windows, WPF mở cửa
sổ ứng dụng, WebView2 hiển thị cùng React UI và WPF chuyển các lệnh được phép sang Workspace. Khi sửa
màn hình hoặc quy trình nghiệp vụ, nhóm phát triển chủ yếu sửa một codebase React.

## 2.3 Workspace xử lý công việc trên máy kỹ sư

Luồng Windows là `React → WPF → Named Pipe → .NET Workspace → tệp cục bộ hoặc IRONCAD/Office`.
Mã chạy trong giao diện Web không được tự ý đọc tệp, mở tiến trình hoặc gọi ứng dụng trên máy kỹ sư.

Workspace tải tệp về thư mục làm việc, tính mã kiểm tra, truyền tệp, ghi nhật ký thao tác, phục hồi
công việc bị gián đoạn và mở ứng dụng nằm trong danh sách cho phép. Server giữ trạng thái chính thức
của sản phẩm; Workspace chỉ quản lý công việc cục bộ của người dùng.

## 2.4 Windows Format Worker

![Hình 2 TECH-D05 Sơ đồ triển khai Core v0](../product/instances/idea-engineering/evidence/IE-VEV-TECH-VIEW-002/TECH-D05.png)

**Loại hình:** sơ đồ triển khai. **Dùng để:** thấy phần nào chạy ở máy chủ, máy kỹ sư và máy xử lý
định dạng. **Không dùng để:** cam kết cấu hình vận hành cuối cùng hoặc khả năng HA.

Một số công việc tạo PDF hoặc định dạng trung gian có thể cần Windows, IRONCAD, Office hoặc license
riêng. Server gửi công việc đó sang một Windows Format Worker qua hợp đồng có phiên bản. Worker tạo
tệp kết quả chờ Server kiểm tra và tiếp nhận.

Ranh giới Format Worker đã nằm trong thiết kế Core v0. Chỉ triển khai Worker khi loại tệp hoặc license
thực tế yêu cầu. Ngôn ngữ, runtime và toolchain của Worker chưa được chọn; chúng phải được đánh giá
riêng. Cách chia này giữ Server trên Linux và giới hạn lỗi chuyển đổi trong tiến trình xử lý định dạng.

## 2.5 Modular Monolith

Core v0 có một ứng dụng Server để triển khai. Bên trong Server, mỗi Module giữ một nhóm nghiệp vụ và
dữ liệu riêng. Cách này giúp xử lý transaction, triển khai, gỡ lỗi và backup đơn giản hơn so với việc
vận hành nhiều dịch vụ ngay từ đầu. Khi có nhu cầu triển khai độc lập hoặc số đo tải rõ ràng, một
Module mới được xem xét tách thành service.

**Điểm cần chốt về kiến trúc:** Server quyết định trạng thái chính thức; React phụ trách màn hình;
Workspace phụ trách máy kỹ sư; Format Worker phụ trách xử lý định dạng cần Windows.

# 3 Cơ sở lựa chọn

| Cơ sở | Áp dụng vào IDEA Engineering Core v0 |
|---|---|
| Đúng phạm vi sản phẩm | Core v0 cần Web, máy Windows của kỹ sư, Server tập trung và tích hợp tệp/CAD/Office. Chưa có yêu cầu bắt buộc cho mobile, macOS Desktop hoặc Linux Desktop. |
| Chọn công nghệ theo công việc | Java/Spring xử lý Server; React tạo màn hình; .NET làm việc với Windows; PostgreSQL lưu dữ liệu quan hệ chính thức. |
| Không đưa hạ tầng chưa cần vào Core v0 | Microservices, Kubernetes, Service Mesh, Kafka/RabbitMQ, Redis và Elasticsearch/OpenSearch chưa giải quyết một nhu cầu đã được xác định ở giai đoạn này. |
| Giảm phần phải viết và vận hành hai lần | React được dùng cho cả Web và Desktop. Modular Monolith giữ Core v0 trong một ứng dụng Server thay vì nhiều dịch vụ. |
| Có chỗ thay đổi từng phần | Server, Workspace, Artifact Store, Format Worker, Adapter và API giao tiếp qua ranh giới đã quy định. Một phần có thể được thay thế khi yêu cầu hoặc bằng chứng thay đổi. |

Hệ thống phải duy trì cả Java và .NET. Java dùng cho Server; .NET dùng cho phần Windows. Nhóm kỹ thuật
phải theo dõi chi phí build, cập nhật bảo mật, xử lý sự cố và hướng dẫn người mới ở cả hai môi trường.
Nếu chi phí này vượt mức được chấp nhận, lựa chọn Server phải được xem xét lại cùng phương án .NET.

**Điểm cần chốt về lý do lựa chọn:** phương án đề xuất đáp ứng đúng công việc của Core v0 và chưa bổ sung các
thành phần chỉ có thể hữu ích trong tương lai.

# 4 So sánh các phương án

![Hình 3 TECH-D08 Sơ đồ quyết định và điều kiện xem xét lại](../product/instances/idea-engineering/evidence/IE-VEV-TECH-VIEW-002/TECH-D08.png)

**Loại hình:** sơ đồ quyết định. **Dùng để:** thấy cách mở lại lựa chọn Client và Server.
**Không dùng để:** kết luận điều kiện phát sinh sẽ tự chọn phương án thay thế hoặc sếp đã phê duyệt.

Hình 3 được đọc theo thứ tự: xuất hiện điều kiện xem xét lại, lập một quyết định mới, sau đó giữ
phương án hiện tại hoặc chọn phương án khác đã đủ điều kiện. Điều kiện chỉ mở việc xem xét lại; nó
không quyết định sẵn kết quả.

## 4.1 Java Spring và .NET ASP.NET Core cho Server

| Tiêu chí | Java/Spring | .NET/ASP.NET Core |
|---|---|---|
| Chạy trên Linux | Tốt | Tốt |
| Kiểm soát ranh giới Modular Monolith | Spring Modulith hỗ trợ trực tiếp | Cần bổ sung kiểm tra kiến trúc phù hợp |
| Làm việc với PostgreSQL | Tốt | Tốt |
| Bảo mật và API | Tốt | Tốt |
| Dùng chung runtime với phần Windows | Không | Có lợi thế |
| Số toolchain của toàn hệ thống | Nhiều hơn | Ít hơn |
| Đề xuất cho Core v0 | `SELECT` | `ALTERNATIVE` |

.NET là phương án cạnh tranh nghiêm túc vì có thể dùng chung runtime với Workspace. Nhóm kỹ thuật vẫn
đề xuất Java/Spring cho Server vì Spring Modulith hỗ trợ trực tiếp cách chia Module đã chọn và phù hợp
với hướng Server chạy Linux. Lợi thế này không lớn. Nếu Java không đạt điều kiện bắt buộc hoặc chi phí
duy trì hai runtime vượt mức được chấp nhận, nhóm phải lập lại so sánh và trình sếp quyết định.

Không có bằng chứng để kết luận Java nhanh hơn, chịu tải tốt hơn hoặc tốt hơn .NET nói chung.

## 4.2 React kết hợp WPF WebView2 và Flutter

| Tiêu chí | React kết hợp WPF/WebView2 | Flutter |
|---|---|---|
| Giao diện trình duyệt | Có lợi thế vì Web là bề mặt chính | Khả thi |
| Ứng dụng Windows | Đáp ứng | Đáp ứng |
| Dùng lại màn hình Web và Desktop | Dùng chung React UI | Có lợi thế đa nền tảng |
| Hỗ trợ mobile trong tương lai | Cần phương án riêng | Có lợi thế rõ |
| Kết nối với Windows | Đi qua WPF và .NET Workspace | Cần thêm lớp kết nối mã native |
| Dung lượng gói Web trong prototype | Nhẹ hơn trong phép đo đã thực hiện | Nặng hơn trong phép đo đã thực hiện |
| Bằng chứng hiện có | Nhiều tình huống đã chạy hơn | Một số tình huống chưa chạy được |
| Đề xuất cho Core v0 | `SELECT` | `EVALUATED ALTERNATIVE` |

Q-15 giữ nguyên `PARTIAL / NO WINNER`. Kết quả đã có cho thấy Flutter là phương án kỹ thuật khả thi;
Q-15 không chứng minh React thắng hoặc Flutter thất bại. Flutter có lợi thế khi một codebase phải phục
vụ nhiều hệ điều hành và mobile.

Core v0 chưa có yêu cầu bắt buộc cho mobile, macOS hoặc Linux Desktop. React tận dụng được giao diện
Web và kết nối trực tiếp với .NET Workspace qua vỏ Windows. Bằng chứng chạy thử của phương án này cũng
đầy đủ hơn. Vì vậy nhóm kỹ thuật đề xuất React kết hợp WPF/WebView2 cho Core v0. Khi phạm vi sản phẩm
bổ sung mobile hoặc Desktop đa nền tảng, hoặc phương án đã chọn không đạt yêu cầu bắt buộc, nhóm phải
mở lại quyết định.

## 4.3 Modular Monolith và Microservices

| Tiêu chí | Modular Monolith | Microservices |
|---|---|---|
| Số phần phải triển khai | Một ứng dụng Server | Nhiều dịch vụ |
| Transaction | Xử lý trong một ứng dụng | Phải giữ dữ liệu nhất quán giữa nhiều dịch vụ |
| Gỡ lỗi | Theo dõi trong một Server | Theo dõi qua nhiều dịch vụ và kết nối mạng |
| Vận hành Core v0 | Ít thành phần hơn | Cần thêm hạ tầng và quy trình vận hành |
| Khi nên dùng | Nhóm nhỏ, trách nhiệm phát triển tập trung | Có nhu cầu triển khai độc lập hoặc nhiều nhóm sở hữu dịch vụ riêng |
| Đề xuất cho Core v0 | `SELECT` | `NOT SELECTED` |

Microservices vẫn là phương án có thể xem xét sau. Core v0 chưa có nhu cầu triển khai từng dịch vụ
độc lập, chưa có nhiều nhóm phát triển sở hữu các phần riêng và chưa có số đo cho thấy một Server là
nút thắt. Vì vậy chi phí của hệ thống phân tán chưa có lý do để phát sinh ở giai đoạn này.

**Nội dung đề nghị sếp quyết định:** dùng Java/Spring cho Server, React kết hợp WPF/WebView2 cho Client
và Modular Monolith cho Core v0. Các phương án .NET Server, Flutter và Microservices được giữ lại với
điều kiện xem xét lại đã nêu; chúng không bị coi là thất bại.
