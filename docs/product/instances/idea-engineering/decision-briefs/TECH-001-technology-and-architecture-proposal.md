# TECH-001 — Đề xuất công nghệ và kiến trúc IDEA Engineering Core v0

| Thông tin | Nội dung |
|---|---|
| Phiên bản / ngày soạn | 0.8 / 09-09-2026 |
| Trạng thái | Draft — đã đồng bộ với Feature, Spec và kiến trúc hiện hành; đề xuất công nghệ không đổi; chưa có quyết định Tech của sếp |
| Mục đích | Chọn cách xây dựng, bộ công nghệ và điều kiện vận hành đáp ứng Spec |
| Người soạn / review | Principal Product Author — trợ lý soạn / người dùng dự án review |
| Người quyết định | Sếp — Product Decision Authority |
| Cơ sở | FEATURE-001@0.12, SPEC-001@0.14; bộ tài liệu IDEA-C1-ANALYSIS-DESIGN-001 |
| Giới hạn | Chỉ phân tích và thiết kế. Chưa viết code, cài phần mềm, mua hạ tầng hoặc triển khai. |

## 1. Phương án tôi đề xuất

Xây một IDEA Server có các phần nghiệp vụ tách rõ trách nhiệm; chưa tách thành nhiều dịch vụ.
Kỹ sư dùng ứng dụng Windows để làm việc với file. Web phục vụ tra cứu, xét duyệt và quản trị.

Bộ công nghệ đề xuất là **.NET 10, PostgreSQL 18, React + TypeScript và WPF + WebView2**.
Đăng nhập bằng tài khoản IDEA trước. Các lựa chọn dưới đây là để xem xét, chưa phải quyết định đã duyệt.

| Phần hệ thống | Đề xuất | Lý do chính |
|---|---|---|
| Server | C# / .NET 10 LTS / ASP.NET Core; kiến trúc modular monolith | Dùng chung hệ sinh thái với phần mềm Windows; giữ giao dịch nghiệp vụ trong một hệ thống dễ theo dõi. |
| Database | PostgreSQL 18; EF Core 10 và Npgsql tương thích | Lưu dữ liệu quan hệ và giao dịch; không có phí bản quyền PostgreSQL. Vẫn phải tự tổ chức vận hành và sao lưu. |
| Đăng nhập | ASP.NET Core Identity quản lý tài khoản IDEA; Access Policy của IDEA quản lý quyền tài liệu | Dùng cơ chế tài khoản, mật khẩu và khôi phục có sẵn; không tự viết thuật toán bảo mật. Identity xác định người dùng và tình trạng tài khoản, nhưng không thay thế chính sách quyền theo tài liệu/trạng thái. |
| Web | React + TypeScript; ứng dụng SPA, Vite phục vụ build | Phù hợp cây dữ liệu, bảng và nhiều trạng thái; bản build có thể phục vụ cùng IDEA Server. |
| Ứng dụng Windows | WPF trên .NET 10; WebView2 cho các vùng giao diện Web | Phần Windows xử lý công việc trên máy; tái sử dụng giao diện dữ liệu thay vì viết lại toàn bộ cho Desktop. |
| Workspace | Tiến trình .NET riêng theo người dùng | Quản lý file tải về, kiểm tra thay đổi, truyền file và giữ công việc khi có lỗi. |
| Kho file | Kho riêng do Server quản lý; đánh giá Adapter dùng filesystem trước | Tránh thêm một dịch vụ lưu trữ ngay từ đầu. File không được chia sẻ trực tiếp cho người dùng. |
| Hệ điều hành máy chủ | Ưu tiên đánh giá Ubuntu Server 24.04 LTS; giữ Windows Server 2025 là phương án thay thế | Chọn theo khả năng hỗ trợ thực tế của công ty, không suy ra từ việc máy kỹ sư dùng Windows. |
| Xử lý CAD/Office | Format Adapter/worker riêng; gọi chức năng export của ứng dụng đã cài hoặc bộ chuyển đổi độc lập sau khi kiểm chứng | Không tự xây bộ dựng hình cho mọi CAD. Tạo tự động và tải lên thủ công đều ghi đúng Generation nguồn; lỗi xử lý không làm hỏng file gốc hoặc dữ liệu đã ghi nhận. |

Lý do ưu tiên phương án này là giảm số hệ thống phải chăm sóc khi ban đầu có thể chỉ một người
vận hành. Điều đó không có nghĩa hệ thống tự an toàn hoặc không cần chuyên môn về database, bảo mật
và khôi phục.

## 2. Bối cảnh đã chốt và phần chưa biết

Anh đã duyệt các đầu vào sau trong phiên làm rõ Tech. Đây là duyệt bối cảnh, không phải duyệt stack.

| Nội dung đã biết | Ý nghĩa khi chọn công nghệ |
|---|---|
| Khoảng 50–100 người dùng, cùng một địa điểm | Chưa có lý do đã được chứng minh để cần hệ thống phân tán nhiều cơ sở. Con số này không phải 100 người thao tác đồng thời. |
| Máy kỹ sư dùng Windows | Ưu tiên ứng dụng Windows cho Workspace và mở file bằng Office/CAD đang có. Phiên bản Windows vẫn cần kiểm kê. |
| Máy chủ có thể đề xuất xây dựng | Có thể chọn phương án mới, nhưng phải được bộ phận quản lý hệ thống và hỗ trợ kỹ thuật chấp thuận. |
| Tài khoản IDEA trước, đăng nhập qua hệ thống công ty sau | Không để việc tích hợp tài khoản công ty chặn giai đoạn đầu. Không giả định hệ thống nội bộ đã hỗ trợ OIDC. |
| Anh quản trị tài khoản ban đầu | Cần màn hình cấp, khóa và hỗ trợ khôi phục tài khoản; không mở đăng ký tự do. |
| Anh đã vận hành server, chưa có DevOps riêng | Cần cách cài đặt, cập nhật, theo dõi và khôi phục có hướng dẫn rõ, ít thành phần. Chưa biết anh quen Linux hay Windows Server hơn. |
| Một bộ tài liệu liên quan có thể từ hàng trăm MB đến GB | Phải thử truyền và khôi phục file thực tế; chưa đủ dữ liệu để chọn dung lượng ổ đĩa, RAM hoặc giới hạn một file. |
| Sản phẩm dùng nội bộ | Không có yêu cầu thu phí/thuê bao. Ưu tiên công nghệ dễ duy trì, chi phí bản quyền hợp lý; vẫn tính chi phí hạ tầng và công vận hành. |
| Mục tiêu khôi phục sơ bộ: 4 giờ làm việc; mốc dữ liệu không lùi quá 1 giờ | Dùng làm mục tiêu thiết kế và thử nghiệm. Chưa phải SLA hoặc kết quả đã đạt. |

Bản ghi nguồn và giới hạn từng câu trả lời nằm tại
[CHG — bối cảnh Tech](../registers/CHG-2026-09-03-tech-context-and-proposal.md).
Các thông tin còn thiếu được giao việc ở mục 9, không được điền bằng giả định ngầm.

## 3. Cách tổ chức hệ thống

```text
Máy kỹ sư Windows                         Mạng máy chủ do công ty quản lý

IDEA Desktop (WPF + vùng WebView2) ────┐
    ↕ lệnh giới hạn theo người dùng    │
Workspace ↔ file làm việc ↔ Office/CAD ├── HTTPS ── IDEA Server
                                      │                 ├── PostgreSQL
Trình duyệt Web ──────────────────────┘                 ├── Kho file riêng
                                                        └── Format Adapter / worker cô lập

Database + file + cấu hình + khóa cần thiết ──► Bản sao lưu ở nơi độc lập
```

**Ví dụ với bộ hồ sơ bơm P-100:** kỹ sư Checkout mô hình về Workspace, mở CAD và Save như bình
thường. Khi Check-in, Server kiểm tra quyền, bản đang sửa và toàn bộ phạm vi đã xác nhận. Hợp lệ
thì ghi nhận bản mới và bỏ giữ tài liệu. Web của người duyệt đọc đúng bản đó; nút Approve trên máy
người dùng không thể tự thay thế việc kiểm tra ở Server.

Nếu hồ sơ IRONCAD đã được kiểm chứng có khả năng tạo PDF tự động, Server giao một bản đầu vào bất
biến cho Format Adapter/worker. Worker gọi đúng chức năng export hoặc bộ chuyển đổi đã khai báo,
sau đó trả PDF cùng dấu kiểm tra và thông tin phiên bản công cụ. Server mới là nơi gắn PDF đó với
Generation nguồn. Nếu chưa có đường tự động, người dùng export ngoài IDEA rồi tải lên theo cùng quy
tắc. PDF không trở thành file CAD chính thức và không được tự chuyển sang Generation mới hơn.

Server chia thành các Module sở hữu từng nhóm dữ liệu: tài liệu và Check-in; cấu trúc; xét duyệt/
phát hành; biểu mẫu/đánh số; xử lý định dạng; phân quyền; tìm kiếm; Audit; và tài khoản/phiên đăng nhập.
Một Module không sửa thẳng dữ liệu của Module khác. Chi tiết trách nhiệm và Interface nằm trong
[DOC-05](../DOC-05-architecture-description.md), không đưa thành một hệ thống dịch vụ riêng cho mỗi Module.

Workflow được lưu như dữ liệu cấu hình có phiên bản trong Module xét duyệt/phát hành. Loại tài liệu
chỉ đến workflow mặc định đang hoạt động; khi bắt đầu, lần chạy ghim đúng phiên bản workflow và chính
sách duyệt. Vì vậy có thể thay quy trình cho lượt mới mà không sửa code hoặc làm đổi hồ sơ cũ.

### Ba ranh giới phải giữ

- **Server quyết định dữ liệu chính thức.** Web, Desktop và Workspace chỉ gửi yêu cầu và hiển thị
  kết quả. Đổi giao diện không được đổi nghĩa của Checkout, Check-in hoặc Release.
- **File gốc và database được quản lý khác nhau.** File mới được kiểm tra và lưu bền vững ở vùng
  riêng trước; sau đó một transaction database công bố các liên kết, Generation, trạng thái và
  Audit cần thiết. Nếu bước sau thất bại, file còn lại vẫn là dữ liệu riêng chờ đối soát, không
  phải một bản tài liệu hợp lệ. Không giả định một transaction database tự bảo vệ cả ổ lưu file.
- **Kho file không phải thư mục dùng chung.** Kỹ sư không truy cập bằng đường dẫn server hoặc quyền
  ổ đĩa. Mỗi lần lấy file phải đi qua kiểm tra quyền của IDEA. “Bất biến” là quy tắc ứng dụng cần
  kiểm chứng, không có nghĩa quản trị viên hệ điều hành không thể làm hỏng ổ đĩa.

## 4. Vì sao chọn và khi nào nên chọn phương án khác?

Các lựa chọn được so riêng để sếp có thể đổi một phần mà không phải chọn lại toàn bộ hệ thống.
Tiêu chí chính là đúng Spec, dễ bảo trì, vận hành được, có vòng đời hỗ trợ và chi phí minh bạch.
Chưa có số đo để chấm điểm hiệu năng hoặc ước lượng tiết kiệm.

| Quyết định | Phương án đề xuất và điểm phải đổi lại | Phương án khác / khi nên đổi |
|---|---|---|
| Một server hay nhiều dịch vụ | Modular monolith: ít đầu mối triển khai, thuận lợi cho giao dịch nhiều tài liệu. Đổi lại, các Module phải giữ ranh giới tốt; một lỗi server có thể ảnh hưởng toàn hệ thống. | Chỉ tách service khi số đo tải, nhu cầu cách ly hoặc đội ngũ độc lập cho thấy lợi ích đủ bù việc vận hành nhiều thành phần. |
| .NET hay Java/Spring | .NET 10 dùng cho cả server và phần Windows. Vẫn cần học và kiểm thử cách dùng framework, không mặc định anh đã thành thạo C#. | Java/Spring đáng cân nhắc nếu công ty có đội hỗ trợ mạnh ở đó. Với phần Windows vẫn riêng, cần tính thêm việc duy trì hai hệ sinh thái. |
| PostgreSQL hay SQL Server | PostgreSQL không thu phí license; phù hợp mô hình quan hệ và transaction. Đổi lại phải chuẩn bị kỹ backup, cập nhật và xử lý sự cố. | SQL Server nếu công ty đã có người vận hành và quyền sử dụng phù hợp. Phải kiểm tra edition và license thật; bản Developer chỉ cho phát triển/kiểm thử, không dùng làm bản production. |
| React SPA hay React framework | SPA phục vụ giao diện nội bộ, cùng server API; không cần SEO cho hồ sơ kỹ thuật. Vite không cung cấp sẵn toàn bộ routing, tải dữ liệu hoặc xử lý lỗi; dự án vẫn phải lựa chọn và quản lý các phần này. | React khuyến nghị framework cho ứng dụng mới. Nên đổi nếu framework làm việc quản lý các phần trên đơn giản hơn; framework cũng có thể chạy kiểu SPA/static, không mặc nhiên cần thêm server Node. |
| WPF hay WinUI 3 / WinForms | WPF + WebView2: phần Windows gọn, tái sử dụng UI Web. Đổi lại có ranh giới Web–native cần bảo vệ, kiểm tra focus/scale và cập nhật WebView2 riêng. | Microsoft khuyến nghị WinUI 3 cho ứng dụng Windows mới. WinUI 3 là lựa chọn thay thế nếu thử nghiệm cho thấy lợi ích UI/hỗ trợ tốt hơn; WinForms hợp các màn hình đơn giản nhưng phải đánh giá lại toàn bộ trải nghiệm nhiều bảng/cây. |
| Native account hay đăng nhập công ty ngay | Tài khoản IDEA theo bối cảnh đã chốt; dùng cơ chế của Identity. Đổi lại IDEA phải chăm sóc quy trình cấp/khóa/khôi phục và phiên đăng nhập. | Tích hợp công ty sau khi biết giao thức, chủ sở hữu và cách liên kết tài khoản. Không cần dựng thêm một identity server riêng chỉ để bắt đầu. |
| Filesystem riêng hay dịch vụ object storage | Filesystem Adapter trước để giảm một dịch vụ phải vận hành. Đổi lại phải chứng minh ghi file an toàn, quản lý dung lượng, đối soát và khôi phục đồng bộ với database. | Object storage khi cần nhiều máy phục vụ file, quản lý lưu trữ chuyên dụng hoặc công ty đã vận hành sẵn. Chọn theo thử nghiệm, điều kiện license và hỗ trợ; không mặc định nhà cung cấp. |
| Linux hay Windows Server | Ubuntu Server 24.04 LTS là ứng viên đánh giá trước, không phải lựa chọn đã chốt. Tránh ép dùng Linux nếu không có người hỗ trợ. | Windows Server 2025 nếu phù hợp năng lực vận hành/chuẩn công ty hơn; kiểm tra chi phí và quyền sử dụng. Máy kỹ sư dùng Windows không bắt buộc server cũng dùng Windows. |
| Tạo PDF từ CAD | Mỗi CAD dùng một Format Adapter đã kiểm chứng. Adapter có thể gọi chức năng export của ứng dụng CAD được cài trên worker hoặc một bộ chuyển đổi độc lập được duyệt. Core v0 có đường tải PDF lên thủ công khi chưa đủ điều kiện tự động. | Chỉ dùng dịch vụ chuyển đổi tập trung hoặc add-in chạy trong CAD khi thử nghiệm, license và cách vận hành chứng minh phương án đó phù hợp hơn. Không chọn một “universal converter” chỉ dựa trên quảng cáo hỗ trợ định dạng. |

Căn cứ về công nghệ: [.NET](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core),
[PostgreSQL](https://www.postgresql.org/support/versioning/),
[React](https://react.dev/learn/creating-a-react-app),
[React từ đầu](https://react.dev/learn/build-a-react-app-from-scratch),
[Windows app guidance](https://learn.microsoft.com/en-us/windows/apps/),
[SQL Server editions](https://learn.microsoft.com/en-us/sql/sql-server/editions-and-components-of-sql-server-2025?view=sql-server-ver17).
Đây là thông tin khả năng/hỗ trợ của nhà cung cấp; lý do ưu tiên cho IDEA là phân tích của dự án.

## 5. Đăng nhập, phân quyền và phần mềm trên máy kỹ sư

### 5.1. Tài khoản IDEA

Anh cấp tài khoản cho người dùng. Người dùng tự đặt/đổi mật khẩu qua quy trình an toàn; quản trị
viên hỗ trợ đặt lại, không xem mật khẩu hiện tại. Cách chuyển thông tin kích hoạt/khôi phục, chính
sách mật khẩu, MFA và thời hạn phiên phải được chốt với người phụ trách bảo mật trước thử nghiệm thật.

**Quản trị tài khoản không đồng nghĩa quản trị tài liệu.** Ví dụ, người có quyền khóa tài khoản của
một nhân viên không vì thế được mở mọi bản vẽ hoặc tự duyệt tài liệu. Tuy vậy, quyền đặt lại mật khẩu
vẫn nhạy cảm vì có thể bị lạm dụng để chiếm quyền sử dụng tài khoản; cần Audit và kiểm soát khôi phục,
không hứa rằng chỉ tách hai tên vai trò là đã loại hết rủi ro.

Đề xuất dùng ASP.NET Core Identity cho quản lý tài khoản; Web dùng cookie bảo vệ và chống CSRF.
Phần native đánh giá cơ chế phiên/token được framework hỗ trợ. Token tích hợp của Identity không
phải máy chủ OAuth/OIDC. Không tự dựng một quy trình OAuth giả quanh API đăng nhập hoặc chuyển
bí mật đăng nhập qua JavaScript. Việc dùng một tài khoản không có nghĩa đã có đăng nhập một lần
giữa mọi vùng Web/native. [Tài liệu Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-10.0)

Sau khi khóa tài khoản hoặc thu hồi phiên, lần truy cập được bảo vệ tiếp theo phải bị từ chối,
kể cả khi máy còn giữ token/cookie cũ. Lệnh đang chạy phải kiểm tra lại trước khi ghi nhận kết quả;
file đã tải về không thể bị “thu hồi khỏi trí nhớ” bằng việc khóa tài khoản.
Cấu hình Identity mặc định không đủ để hứa thu hồi ngay: kiểm tra security stamp của cookie có
chu kỳ mặc định 30 phút. Vì vậy thiết kế thêm kiểm tra trạng thái tài khoản/phiên hiện hành tại
Server, và phải thử đường tải file, Check-in, phê duyệt cùng các kết nối đang mở.
[Security stamp](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.identity.securitystampvalidatoroptions.validationinterval?view=aspnetcore-10.0)

Tài khoản có mã nội bộ ổn định. Sau này đổi cách đăng nhập không đổi người trong lịch sử Audit hoặc
tự gộp hai tài khoản chỉ vì trùng email. Bộ yêu cầu mới nằm tại REQ-IAM-001…007 trong Spec.

### 5.2. Desktop, Workspace và WebView2

Desktop chạy theo người dùng Windows, không cần chạy toàn ứng dụng bằng quyền quản trị máy.
Workspace trao đổi bằng các lệnh có phạm vi rõ, không mở một cổng cho trang Web bất kỳ ra lệnh
đọc file hay chạy chương trình.

Vùng WebView2 chỉ được nối với chức năng native khi đúng nguồn UI đã cho phép; kiểm tra lại nguồn
khi điều hướng hoặc nhận thông điệp. Không cung cấp hàm “chạy lệnh bất kỳ” hoặc “đọc mọi đường dẫn”.
File/đích mở phải thuộc lựa chọn hợp lệ trong Workspace. File không tin cậy và liên kết ngoài không
được dùng vùng có quyền native đó. Đây là thiết kế cần kiểm chứng, không phải tính năng có sẵn chỉ
vì chọn WebView2. [Hướng dẫn bảo mật WebView2](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/security)

WebView2 có lịch cập nhật riêng. Ưu tiên Evergreen nếu IT quản lý được cập nhật; nếu buộc dùng bản
cố định thì phải phân công người theo dõi và phát hành bản vá. Mỗi lần cập nhật cần giữ được công
việc chưa Check-in và kiểm tra tương thích UI.
[Phân phối và cập nhật WebView2](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/distribution)

### 5.3. Ranh giới tạo PDF và neutral file từ CAD

Format Adapter chỉ được nhận một file nguồn bất biến đã gắn Generation, không làm việc trực tiếp
trên file đang được kỹ sư sửa. Mỗi cấu hình phải nêu rõ ứng dụng CAD, phiên bản, Adapter, converter,
license, nơi chạy và định dạng đầu ra. Việc có IRONCAD trên máy kỹ sư không tự chứng minh được quyền
hoặc khả năng chạy tự động trên server/worker.

Kết quả thành công gồm PDF/neutral file, dấu kiểm tra, Generation nguồn và phiên bản các thành phần
đã tạo ra nó. Khi nguồn có Generation mới, kết quả cũ chuyển thành `Needs update`; có thể giữ để xem
lịch sử nhưng không được hiển thị như bản hiện tại. Lỗi chuyển đổi giữ nguyên file nguồn và ghi kết
quả lỗi có thể thử lại. Release chỉ bị chặn nếu chính sách của loại tài liệu quy định bản dẫn xuất
đó là bắt buộc.

Kiến trúc này giữ được trải nghiệm tự động giống công cụ tham chiếu mà không giả định IDEA có bộ
dựng hình riêng. Bằng chứng công khai hiện chỉ chứng minh hành vi qua từng CAD integration; chưa
chứng minh cơ chế renderer, headless server hoặc dịch vụ nền cụ thể. Vì vậy cần thử IRONCAD thật
trước khi chọn nơi chạy và cam kết tự động hóa.

### 5.4. Cấu hình workflow

Core v0 không cần một màn hình kéo-thả. Trước hết, hệ thống cần mô hình dữ liệu và biểu mẫu quản trị
có kiểm tra để khai báo trạng thái, bước chuyển, vai trò/nhóm, số quyết định cần có, lý do/bằng chứng
bắt buộc và thông báo. Chỉ cấu hình hợp lệ mới được kích hoạt. Một loại tài liệu có một workflow mặc
định đang hoạt động; nhiều workflow và các phiên bản cũ vẫn được giữ để phục vụ loại tài liệu khác
và đọc lại lịch sử.

Server, không phải giao diện, kiểm tra bước chuyển và quyền. Việc bật phiên bản mới chỉ áp dụng cho
lần chạy mới. Chuyển một workflow đang chạy sang phiên bản khác là thao tác riêng: phải xem trước
ảnh hưởng, có quyền, có lý do và Audit. Thông báo được tạo sau khi kết quả nghiệp vụ đã ghi nhận;
lỗi gửi thông báo không được làm sai trạng thái workflow.

### 5.5. Identity, Access Policy và JSON

Đề xuất dùng **ASP.NET Core Identity** để quản lý tài khoản, mật khẩu, đăng nhập, khóa tài khoản và
phiên sử dụng. Identity trả lời “người đang đăng nhập là ai và tài khoản còn hợp lệ không”. Nó không
tự trả lời đầy đủ “người này có được Checkout, Approve hoặc Release tài liệu này ở trạng thái hiện
tại không”. Phần thứ hai thuộc Access Policy của IDEA.

Access Policy xét Actor, vai trò/nhóm, loại/phạm vi tài liệu, trạng thái và hành động. Quyền thông
thường được cấp qua nhóm/vai trò; chuyển nhân sự bằng cách đổi Membership, không sửa từng tài liệu.
Quyền gán thẳng cho một Actor chỉ là ngoại lệ có phạm vi, lý do, thời hạn và Audit. Chính sách có Draft
và phiên bản đã kích hoạt, được lưu trong kho dữ liệu chính thức do Server quản lý. Người quản trị có
thể thay đổi qua biểu mẫu/API quản trị mà không sửa code. Server kiểm tra quyết định cuối cùng tại
Module đang sở hữu tài liệu; Web, Desktop, Workspace hoặc worker không được tự cấp quyền và không có
thông tin đăng nhập trực tiếp vào database.

JSON chỉ là một lựa chọn cho dữ liệu mẫu hoặc nhập/xuất cấu hình. Tải một file lên tạo **ứng viên**,
không tạo quyền. Server phải kiểm tra schema, tham chiếu nhóm/phạm vi/hành động, phiên bản cơ sở và
quyền của người kích hoạt; hiển thị phần thay đổi; sau đó mới tạo và kích hoạt Access Policy Version
mới có Audit. Ứng viên không được dùng chính nội dung của nó để tự cấp quyền kích hoạt cho mình.
Không đặt mật khẩu, khóa hoặc token trong JSON.

PostgreSQL 18 hiện là database được đề xuất trong Tech, chưa phải lựa chọn đã được sếp duyệt. Dù sau
này đổi database, ranh giới vẫn giữ nguyên: nguồn quyền có hiệu lực là phiên bản chính sách đã được
Server kích hoạt, không phải file JSON, giao diện hay claim tùy ý từ phía client. Core v0 có thể bắt
đầu bằng biểu mẫu quản trị và dữ liệu seed; chức năng nhập JSON chỉ cần làm khi có nhu cầu thực tế.

## 6. Triển khai, sao lưu và khôi phục

### 6.1. Mô hình giai đoạn đầu

Đề xuất thử một máy/VM do công ty quản lý cho IDEA Server, database và kho file riêng, với tài khoản
hệ điều hành/quyền truy cập tách theo trách nhiệm. Bộ xử lý CAD được cách ly; nếu tool yêu cầu Windows
hoặc tài nguyên riêng, chạy ở máy worker phù hợp, không ép chạy trên Linux.

Chưa yêu cầu Kubernetes, một cụm microservices, Redis hoặc hàng đợi bên ngoài. Các nhu cầu đó chưa
được chứng minh. Tác vụ sau giao dịch có thể bắt đầu từ outbox trong database và tiến trình xử lý
có giới hạn; thử lại phải không tạo kết quả trùng.

Mô hình một máy/VM có điểm yếu rõ: máy hỏng sẽ dừng hệ thống. **Chỉ phù hợp để đưa vào đánh giá nếu
thử khôi phục đạt mục tiêu và công ty chấp nhận thời gian gián đoạn.** Chưa chọn CPU, RAM, dung lượng
hay cam kết tốc độ từ con số 50–100 người.

Đợt triển khai cần gói có phiên bản, cấu hình tách khỏi code, kiểm tra trước cập nhật, bản sao lưu
được kiểm chứng và cách quay lại phù hợp. Đổi file chương trình về bản cũ không tự hoàn tác thay đổi
schema database. Có thể phát hành theo thủ tục có kiểm soát trước; không giả định công ty đã có CI/CD.

### 6.2. Mục tiêu khôi phục cần thử

| Mục tiêu | Cách hiểu đúng | Cách chứng minh |
|---|---|---|
| RTO sơ bộ: 4 giờ làm việc | Thời gian khôi phục dịch vụ sau sự cố máy chủ nghiêm trọng. Lịch giờ làm việc, thời điểm bắt đầu tính và người tiếp nhận sự cố còn phải chốt. | Thử từ tình huống mất máy chủ đến khi đăng nhập, mở đúng file, Check-in và lấy lại hồ sơ hoạt động bình thường trên máy thay thế. |
| RPO sơ bộ: tối đa 1 giờ | Mốc khôi phục không cũ hơn một giờ so với sự cố; có thể phải làm lại phần công việc chưa nằm trong mốc đó. Không phải cho phép Check-in ghi nhận dở trong vận hành bình thường. | So mốc sự cố với mốc phục hồi dùng được của cả database và file; ghi nhận phần bị thiếu nếu có. |
| Toàn vẹn dữ liệu | File, metadata, cấu trúc, chính sách, Audit và khóa cần thiết phải khớp cùng mốc. | Đối soát toàn bộ Generation thuộc bộ khôi phục và digest; thiếu/sai file thì không báo đạt. |

PostgreSQL có khôi phục theo thời điểm từ base backup và chuỗi WAL, nhưng WAL không sao lưu file
CAD/Office nằm ngoài database. Vì vậy phải có bản sao file và cấu hình/khóa phù hợp với mốc database;
chọn mốc đã có đủ cả hai. Nếu chỉ database mới mà kho file còn cũ, bản khôi phục chưa dùng được.
[Tài liệu PostgreSQL PITR](https://www.postgresql.org/docs/18/continuous-archiving.html)

Đề xuất sao lưu sang nơi độc lập với máy đang chạy, có quyền quản trị được hạn chế riêng. RAID,
một thư mục khác hoặc snapshot duy nhất trên cùng máy không đủ để chứng minh phục hồi khi mất máy.
Theo dõi độ trễ sao lưu, dung lượng trống, lỗi file, outbox và kết quả thử khôi phục; người vận hành
phải nhận biết được khi mục tiêu một giờ đang không còn bảo đảm.

Anh có thể vận hành ban đầu. Trước dùng thật vẫn cần chỉ định người thay thế, nơi giữ hướng dẫn/
khóa phục hồi và trách nhiệm khi anh vắng mặt. Không mặc định anh trực 24/7.

## 7. License, vòng đời và chi phí

Thông tin dưới đây được kiểm tra từ nguồn chính thức ngày 03-09-2026; phải kiểm tra lại bản vá và
điều kiện sử dụng khi chọn phiên bản triển khai.

| Thành phần | Căn cứ / chi phí cần tính |
|---|---|
| .NET 10 / ASP.NET Core | .NET 10 LTS được chính sách hỗ trợ ghi đến 14-11-2028. .NET 8 kết thúc 10-11-2026 nên không ưu tiên cho dự án mới lúc này. .NET không thu phí sử dụng, nhưng không được gọi mọi binary Windows là MIT; còn license phân phối và thông báo bên thứ ba. |
| EF Core / Npgsql | Chọn cùng dòng 10 tương thích, ghim bản vá sau thử nghiệm. Trang EF10 ghi 10-11-2028 khác ngày trên chính sách họ .NET; phải xác nhận trước khi chốt lịch nâng cấp. |
| PostgreSQL 18 | Chính sách hiện ghi hỗ trợ đến 14-11-2030. License cho phép sử dụng không thu phí theo điều kiện của nó; công quản trị, backup và hỗ trợ vẫn có chi phí. |
| React / TypeScript / Vite | License lần lượt MIT / Apache-2.0 / MIT ở nguồn được kiểm tra. Không thay cho rà soát toàn bộ dependency. Vite không có chu kỳ LTS cố định như .NET. |
| WPF / WebView2 | Phải kiểm tra điều kiện phân phối .NET Windows, SDK/runtime WebView2, đóng gói và ký số. Không suy ra miễn mọi license từ việc dùng thư viện mở. |
| Server OS | Ubuntu 24.04 LTS hiện có standard security maintenance đến 05-2029; hỗ trợ mở rộng/hợp đồng có điều kiện riêng. Windows Server phải kiểm tra license và quyền sử dụng của công ty. |
| CAD/Office, bộ đọc/chuyển đổi | Kiểm tra license tool/SDK và quyền chạy ngoài ứng dụng, xử lý tự động hoặc trên worker. Có ứng dụng ở máy kỹ sư không đồng nghĩa được dùng license đó trên server. |
| Hạ tầng và vận hành | Máy/VM, ổ lưu file, nơi sao lưu độc lập, mạng, chứng thư, giám sát, thời gian vá lỗi, thử khôi phục và người hỗ trợ. Chưa có báo giá hay dự toán tổng được duyệt. |

Nguồn: [chính sách .NET](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core),
[.NET miễn phí](https://dotnet.microsoft.com/en-us/platform/free),
[license .NET](https://github.com/dotnet/core/blob/main/license-information.md),
[EF10](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-10.0/whatsnew),
[PostgreSQL](https://www.postgresql.org/support/versioning/),
[license PostgreSQL](https://www.postgresql.org/about/licence/),
[Ubuntu](https://ubuntu.com/about/release-cycle).
Bảng dependency và nguồn chi tiết có trong [ghi chú nghiên cứu](../../../../research/2026-09-03-idea-tech-stack-primary-sources.md).

Không dùng “mã nguồn mở” để kết luận “không tốn tiền”. Trước cam kết triển khai cần lập dự toán theo
từng khoản ở bảng trên, cùng người chịu trách nhiệm duy trì.

## 8. Những kiểm chứng cần có trước khi dùng phương án này

Các việc dưới đây là kế hoạch thử nhỏ sau khi được cho phép, không phải công việc đã chạy.

| Mã | Cần chứng minh | Liên kết kiểm tra | Hiện tại |
|---|---|---|---|
| TECH-Q-01 | Check-in nhiều tài liệu không ghi nhận một phần; mất điện/lỗi ghi file/retry không tạo Generation trùng; thành công và No Change đều bỏ giữ. | VVP-003/004/012 | NOT-RUN |
| TECH-Q-02 | Tài khoản cấp đúng quyền; khóa/thu hồi phiên chặn token/cookie cũ; reset không cho người quản trị tự có quyền tài liệu; không hở đăng ký công khai. | VVP-007/011/015 | NOT-RUN |
| TECH-Q-03 | WebView2/native/Workspace không nhận lệnh từ trang, phiên hoặc đường dẫn trái phép; đóng/mở/cập nhật không làm mất bản sửa. | VVP-009/011 | NOT-RUN |
| TECH-Q-04 | Truyền file đại diện chịu được gián đoạn; quyền và digest đúng; không đoán khả năng từ dữ liệu demo nhỏ. | VVP-002/004/014 | NOT-RUN |
| TECH-Q-05 | Khôi phục được cùng mốc database + file + cấu hình/khóa, đo RTO/RPO và kiểm tra hồ sơ thực sự dùng được. | VVP-013/014 | NOT-RUN |
| TECH-Q-06 | Đường tạo PDF/neutral file của IRONCAD dùng đúng ứng dụng/Adapter/converter và license đã khai báo; tự động và thủ công cùng gắn đúng Generation nguồn; bản cũ hiện `Needs update`; lỗi không sửa file gốc và Release chặn/cảnh báo đúng chính sách. | VVP-008/011; CR-01…05 | NOT-RUN |
| TECH-Q-07 | Cùng hành vi trên Web, native và vùng Web-rendered; Anh/Việt/Nhật, bàn phím, focus và tỷ lệ hiển thị đúng. | VVP-009/010 | NOT-RUN |
| TECH-Q-08 | Cài đặt, cập nhật, vá lỗi và phục hồi được theo hướng dẫn trên môi trường công ty cho phép; xác minh license và phiên bản. | VVP-011/012/013/014; DOC-07 | NOT-RUN |
| TECH-Q-09 | Hai loại tài liệu dùng hai workflow khác nhau; bật phiên bản mới không đổi lần đang chạy; cấu hình sai hoặc thiếu vai trò bị chặn; lỗi thông báo không đổi kết quả đã commit. | VVP-006/007; WF-01…06 | NOT-RUN |
| TECH-Q-10 | Identity xác thực đúng Actor nhưng không tự cấp quyền tài liệu; thay Access Policy không cần sửa code; JSON chỉ tạo ứng viên, không có hiệu lực trước khi được kiểm tra/kích hoạt; Web/Desktop không đi thẳng vào database. | VVP-007/011/015; AC-01…05 | NOT-RUN |

Không dùng SQLite/in-memory hoặc ảnh prototype làm bằng chứng cho giao dịch PostgreSQL, phân quyền
thật hay khôi phục. Thử nghiệm phải giữ dữ liệu, phiên bản, cấu hình, kết quả và giới hạn.

## 9. Việc còn cần chốt và quyết định trình sếp

| Việc | Người chuẩn bị / chốt | Thời điểm |
|---|---|---|
| Chọn hệ điều hành/server được phép, mạng, chứng thư, đóng gói Desktop và cập nhật WebView2 | Anh làm việc với quản lý hệ thống/hỗ trợ kỹ thuật; sếp quyết định Tech trong phạm vi thẩm quyền | Trước chọn cấu hình triển khai để kiểm chứng |
| Đo số người thao tác đồng thời, file lớn, tổng kho, tăng trưởng và tải truyền file | Người soạn chuẩn bị cách đo; anh cung cấp dữ liệu đại diện được phép | Trước chọn cấu hình máy và cam kết tốc độ/dung lượng |
| Quy trình tài khoản, khôi phục, MFA, thời hạn phiên và bảo quản khóa | Anh là quản trị tài khoản ban đầu; cần người đánh giá bảo mật phù hợp | Trước dùng tài khoản/dữ liệu thật |
| Người vận hành chính/thay thế, giờ hỗ trợ, nơi sao lưu và kinh phí | Anh đề xuất với các bộ phận liên quan | Trước cam kết mục tiêu khôi phục và dùng thật |
| Bản Windows/Office/CAD, giấy phép, bộ file thử và năng lực worker | Anh cùng kỹ thuật thiết kế/hỗ trợ kỹ thuật | Trước cam kết khả năng từng định dạng |
| Chốt các điểm Spec còn mở, review phần mới và điều kiện bắt đầu xây dựng | Anh review; sếp quyết định Feature → Spec → Tech | Trước PG4; không lấy Tech thay quyết định Spec |

Đề nghị sếp quyết định ba nội dung trong trục Tech:

1. Đồng ý hay điều chỉnh cách chia Server–Web–Desktop–Workspace và các ranh giới dữ liệu/quyền.
2. Chọn bộ công nghệ tại mục 1, hoặc chỉ rõ từng lựa chọn thay thế tại mục 4.
3. Đồng ý điều kiện kiểm chứng, việc còn thiếu và phạm vi chi phí cần lập; chưa hứa ngày giao hàng
   hoặc mức dịch vụ trước khi có căn cứ.

| Nội dung quyết định | Trạng thái |
|---|---|
| Bối cảnh dùng để soạn Tech | Anh đã xác nhận ngày 03-09-2026 |
| Review nội bộ Tech 0.8 | PARTIAL — hướng kiến trúc tạo PDF từ CAD, cấu hình workflow và ranh giới Identity/Access Policy/JSON đã được anh xác nhận riêng; lần đồng bộ nguồn này không tự tạo review toàn bộ đề xuất Tech |
| Quyết định Feature / Spec / Tech của sếp | NOT-RUN; phải ghi đúng phiên bản được xem |
| Phương án công nghệ được chọn chính thức | Chưa có |
| Cho phép viết production code / cài đặt / triển khai | Chưa có; PG4 và quyền của IT được xét riêng |

## Phụ lục — Nguồn, thay đổi và cách kiểm soát

| Nguồn nội bộ | Phiên bản | Vai trò |
|---|---|---|
| [DOC-02](../DOC-02-feasibility-and-options-assessment.md) | IE-PROD-FEAS-001@0.2 | Khả thi và tiêu chí so sánh |
| [DOC-04](../DOC-04-software-requirements-specification.md) | IE-PROD-SREQ-001@0.10 | 74 yêu cầu mà công nghệ phải đáp ứng; gồm ranh giới item/folder, BOM/file và dữ liệu vận hành tham khảo |
| [DOC-05](../DOC-05-architecture-description.md) | IE-PROD-ARCH-001@0.9 | Nguồn kiến trúc, trách nhiệm, Interface, đánh đổi và rủi ro |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | IE-PROD-DATA-001@0.10 | Danh tính, dữ liệu, giao tiếp, Workflow/Representation/Access Policy, BOM và khôi phục |
| [DOC-08](../DOC-08-ui-ux-and-interaction-specification.md) | IE-PROD-UX-001@0.6 | Luồng làm việc, ngôn ngữ và các bề mặt UI; trỏ tới prototype IDEA DDM hiện hành |
| [VVP](../registers/VVP-core-v0-verification-validation-plan.md) | IE-VVP-CORE-001@0.11 | 15 mục kiểm chứng cùng các bộ SR/CR/WF/AC/IF/BM/DH; mọi kết quả vẫn `NOT-RUN` |
| [CHG Tech](../registers/CHG-2026-09-03-tech-context-and-proposal.md) | IE-CHG-TECH-001@0.1 | Nguồn câu trả lời, phạm vi sửa và bản trước khi sửa |
| [CHG Version](../registers/CHG-2026-09-04-version-model-clarification.md) | IE-CHG-VERSION-001@0.1 | Quyết định loại bỏ Version Sequence và đồng bộ nguồn |
| [CHG CAD Representation](../registers/CHG-2026-09-07-cad-neutral-representation.md) | IE-CHG-CAD-REP-001@0.1 | Quyết định về Adapter, tạo PDF tự động/thủ công và quan hệ với Generation nguồn |
| [CHG Workflow](../registers/CHG-2026-09-07-workflow-configuration.md) | IE-CHG-WORKFLOW-001@0.1 | Quyết định về workflow có phiên bản, lựa chọn theo loại tài liệu và phạm vi UI |
| [CHG phân quyền](../registers/CHG-2026-09-07-authorization-data-boundary.md) | IE-CHG-AUTH-DATA-001@0.1 | Ranh giới Identity, Access Policy, JSON và kho dữ liệu chính thức |
| [CHG đồng bộ nguồn](../registers/CHG-2026-09-09-cross-document-reconciliation.md) | IE-CHG-SOURCE-RECON-001@0.1 | Bản trước, phạm vi đồng bộ và giới hạn không thay đổi quyết định |
| [ADRs](../../../../adr/README.md) | Các quyết định đã Accepted tại baseline repository | Ranh giới sản phẩm đã chốt, không bị đổi bởi bản đề xuất stack |

Bản 0.3 thay giả định bắt buộc dùng tài khoản công ty bằng tài khoản IDEA trước; đưa ra lựa chọn
Desktop/kho file có lý do; làm rõ chi phí, vận hành và mục tiêu khôi phục. Đồng thời sửa câu cũ cho
phép giữ Checkout sau Check-in: Core v0 không có lựa chọn đó.

Bản 0.4 không đổi đề xuất công nghệ và ghim lại nguồn sau khi SPEC-OPEN-01 được giải quyết. Bản 0.5
thêm thiết kế Format Adapter/worker cho PDF/neutral file, giữ đường tải lên thủ công và không giả định
một bộ dựng hình CAD dùng chung. Bản 0.6 làm rõ workflow là cấu hình có phiên bản do Server thực thi,
gắn mặc định theo loại tài liệu; giao diện kéo-thả vẫn để sau. Lựa chọn ứng dụng/converter, license
và nơi chạy vẫn phải kiểm chứng. Bản 0.7 làm rõ Identity chỉ quản lý tài khoản/xác thực; Access Policy
quyết định quyền tài liệu, còn JSON chỉ là định dạng nhập/xuất ứng viên có kiểm soát. PostgreSQL vẫn
là đề xuất Tech, chưa phải lựa chọn được sếp duyệt.

Bản 0.8 chỉ đồng bộ các nguồn hiện hành sau khi làm rõ item/folder, BOM/file và phạm vi đầu ra
phòng ban. Không thay đổi bộ công nghệ đề xuất, không đóng điểm Spec còn mở, không ghi nhận kết quả
kiểm chứng và không tạo quyết định Tech của sếp.

Bản này trình bày theo hướng làm rõ bối cảnh, người quan tâm, các góc nhìn, quyết định và đánh đổi
của kiến trúc. [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html) là nguồn về mô tả
kiến trúc, không phải tiêu chuẩn chọn một stack cụ thể. Không tuyên bố bản này đã được đánh giá
tuân thủ toàn bộ ISO/IEC.

Tài liệu là bản tiếng Việt phục vụ quyết định; DOC-05 và các nguồn được ghim vẫn là thẩm quyền
chi tiết. Phân loại INTERNAL; bản DOCX được quản lý như rendition, còn PDF chưa tạo. Xem
[sổ phiên bản](VERSION-HISTORY.md) để biết bản lưu và trạng thái review; hash của lần đồng bộ hiện
hành nằm trong [CHG đồng bộ nguồn](../registers/CHG-2026-09-09-cross-document-reconciliation.md).
Nguồn thay đổi thì phải review lại phần bị ảnh hưởng.
