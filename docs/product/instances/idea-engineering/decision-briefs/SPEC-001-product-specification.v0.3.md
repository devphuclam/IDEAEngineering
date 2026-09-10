# SPEC-001 — Core v0 phải làm việc như thế nào?

Core v0 là phiên bản đầu tiên của IDEA Engineering, tập trung vào quản lý hồ sơ kỹ thuật từ lúc đưa
vào hệ thống đến lúc được duyệt và ban hành. Bản Spec này làm rõ **khi người dùng thực hiện một việc,
hệ thống phải xử lý ra sao và thế nào mới được coi là làm đúng**.

Ví dụ, Feature nói rằng sản phẩm có chức năng Check-in. Spec nói rõ hơn: nếu người dùng Check-in ba
tài liệu cùng một lượt mà một tài liệu bị lỗi, hệ thống không được nhận riêng hai tài liệu còn lại.

Bản 0.3 đang được review lại về cấu trúc và mức chi tiết; chưa được người review nội bộ chấp thuận
và chưa có quyết định của sếp. Lựa chọn công nghệ được trình riêng trong Tech; bản này không quyết
định ngôn ngữ lập trình, database hay hạ tầng.

## 1. Ví dụ dùng xuyên suốt: bộ hồ sơ thiết kế cụm bơm P-100

Giả sử công ty đang chuẩn bị bộ hồ sơ cho một cụm bơm. Hồ sơ gồm bản lắp tổng thể, bản vẽ các chi tiết
và bảng thông số kỹ thuật. Anh Nam phụ trách chỉnh sửa; chị Hương có quyền kiểm tra và duyệt.

Cách liên tưởng là **một tủ hồ sơ có sổ giao nhận và lịch sử xét duyệt**:

- Mỗi tài liệu có mã riêng, dù tên file hoặc nơi lưu có thay đổi.
- Khi lấy tài liệu để sửa, hệ thống ghi rõ ai đang giữ quyền sửa.
- Khi nộp bản sửa, hệ thống giữ lại bản cũ và ghi nhận bản mới.
- Khi duyệt và ban hành, hệ thống ghi đúng những bản tài liệu được phép sử dụng.

IDEA không chỉ là nơi chứa file. Nó phải trả lời được: **đây là tài liệu nào, ai đang sửa, bản nào đã
được duyệt và bộ hồ sơ đã ban hành gồm những gì?**

Tên người và hồ sơ P-100 trong tài liệu này là ví dụ minh họa, không phải dữ liệu thực tế hay bằng
chứng phần mềm đã hoạt động.

## 2. Ba thao tác cần phân biệt: Save, Check-in và Release

| Thao tác | Hiểu đơn giản | Ví dụ với hồ sơ P-100 |
|---|---|---|
| Save trong Word, Excel hoặc CAD | Lưu công việc trên máy đang dùng. Chưa đưa bản sửa lên IDEA. | Nam sửa bản vẽ trục rồi bấm Save. Bản trên hệ thống vẫn chưa đổi. |
| Check-in | Nộp phần thay đổi đã chọn lên IDEA. Khi thành công, hệ thống ghi nhận bản mới và Nam không còn giữ Checkout những tài liệu đó. | Nam nộp bản vẽ đã sửa để người có quyền có thể xem và xét duyệt. |
| Release — ban hành | Xác nhận bộ hồ sơ đã đủ điều kiện để sử dụng chính thức trong phạm vi nội bộ được phép. | Sau khi Hương duyệt và đủ tài liệu liên quan, bộ hồ sơ P-100 mới được ban hành. |

**Check-in không có nghĩa là đã được duyệt hoặc được phép dùng chính thức.** Nếu không có thay đổi,
Check-in vẫn kết thúc Checkout nhưng không tạo thêm một bản mới.

## 3. Những quy tắc hệ thống phải đáp ứng

### 3.1 Nhận đúng tài liệu và giữ được lịch sử của nó

Mỗi tài liệu có một mã định danh cố định, giống như số hồ sơ. Đổi tên file không được làm hệ thống
hiểu đó là tài liệu khác. Khi đưa file có sẵn vào quản lý (`Store Existing`), nếu có dấu hiệu trùng
với tài liệu đã có, hệ thống phải thông báo để người dùng quyết định, không tự gộp hai tài liệu.
Tài liệu tạo mới (`New`) cũng được quản lý theo cùng cách này.

Cần phân biệt **Revision** — mốc sửa đổi nghiệp vụ, thường ký hiệu A, B, C — với **Version** — lần cập
nhật trong một Revision. Không phải cứ bấm Save là tăng Version, cũng không phải mỗi lần chỉnh sửa
đều chuyển từ Revision A sang B.

Ví dụ dưới đây nói về cùng một tài liệu trong bộ hồ sơ P-100, theo quy tắc mặc định được đề xuất:

| Việc Nam thực hiện | Revision / Version | Hệ thống phải ghi nhận |
|---|---|---|
| Đăng ký tài liệu nhưng chưa Check-in lần đầu | Chưa có bản dữ liệu đã nộp | Tài liệu ở trạng thái mới bắt đầu (`Start`); chưa đủ điều kiện gửi duyệt hay ban hành. |
| Check-in thành công lần đầu | A / 1 | Tạo đầy đủ bản đầu tiên; nếu bị lỗi thì không được coi phần dữ liệu dở dang là bản hợp lệ. |
| Sửa rồi bấm Save nhiều lần trên máy | Vẫn A / 1 trên hệ thống | IDEA chưa nhận các thay đổi này. |
| Check-in phần thay đổi thành công | A / 2 | Giữ nguyên A/1 và ghi thêm A/2. |
| Check-in nhưng không có thay đổi | Vẫn A / 2 | Không tạo A/3; kết thúc Checkout trong phạm vi đã chọn. |
| Bản A/2 được duyệt và ban hành | Vẫn A / 2 | Ghi nhận quyết định ban hành đúng bản đó. |
| Cần sửa sau khi Revision A đã ban hành và tạo Revision tiếp theo | B / 1 | Giữ nguyên hồ sơ Revision A; Revision B bắt đầu một lượt làm việc và xét duyệt mới. |

Tại mỗi mốc đã nộp, hệ thống giữ một bản dữ liệu cố định gồm file, thông tin tài liệu và cấu trúc liên
quan. Thuật ngữ kỹ thuật của bản lưu này là **Generation**; nó không chỉ là tên file hay số Revision.

### 3.2 Chỉ giữ quyền sửa những tài liệu thật sự cần sửa

**Checkout** có thể hiểu là đăng ký giữ quyền sửa và nộp lại một tài liệu. **Reference** là lấy một bản
cụ thể về để tham khảo, không có quyền nộp thay đổi cho tài liệu đó. File được đưa vào vùng làm việc
trên máy người dùng, gọi là **Workspace**, và chỉ báo sẵn sàng khi đã kiểm tra đúng bản, đủ nội dung.

Ví dụ: Nam cần sửa bản vẽ trục nhưng chỉ xem bản vẽ vỏ bơm để đối chiếu kích thước. Nam Checkout bản
vẽ trục, còn vỏ bơm lấy về làm Reference. Hệ thống không được tự giữ quyền sửa cả bộ hồ sơ P-100.

Trước khi tải file, người dùng phải thấy và xác nhận từng tài liệu thuộc cách nào. Quyền Checkout
gắn với đúng tài liệu, đúng người và đúng vùng làm việc. Nếu Nam chuyển sang máy hoặc Workspace
khác, quyền này không tự đi theo; việc chuyển hoặc khôi phục quyền phải được cho phép và ghi lại.

Checkout không phải khóa file của Windows. Người dùng có thể vẫn sửa một file Reference bằng ứng
dụng bên ngoài, nhưng IDEA phải từ chối nhận thay đổi của file đó khi họ chưa có quyền Checkout.

### 3.3 Check-in phải đầy đủ, không nhận nửa bộ hồ sơ

Trước khi nhận dữ liệu, IDEA phải kiểm tra lại file trên máy và nói rõ: tài liệu nào đã thay đổi,
không đổi, bị thiếu, đang dùng bản cũ, chưa xác định được đầy đủ dữ liệu liên quan hoặc bị sửa khi
chưa Checkout. Người dùng xem và xác nhận chính xác những tài liệu sẽ nộp.

Ví dụ: Nam chọn Check-in ba tài liệu của P-100 cùng một lượt. Nếu một tài liệu bị lỗi hoặc không đủ
quyền, **cả lượt bị từ chối**. Không được có tình trạng bản lắp đã cập nhật nhưng tài liệu liên quan
vẫn nằm dở dang trong cùng lượt nộp đó. Nam vẫn phải giữ được công việc đã sửa trên máy.

Khi Check-in thành công:

- Mỗi tài liệu có thay đổi tạo đúng một bản mới; bản trước đó được giữ nguyên.
- Nếu file, thông tin tài liệu và cấu trúc liên quan đều không thay đổi, hệ thống ghi nhận
  “Không có thay đổi”, không tăng Version.
- Tài liệu trong phạm vi Check-in không còn bị người dùng giữ Checkout. Muốn sửa tiếp phải Checkout
  lại; tài liệu khác đang giữ nhưng không thuộc lượt này không bị ảnh hưởng.

Nếu kết nối bị ngắt lúc trả kết quả, gửi lại đúng lượt Check-in đó không được tạo thêm bản trùng.
File mới tải lên nhưng chưa được nhận thành công cũng không được hiển thị như một bản tài liệu
chính thức đã nộp.

### 3.4 Không ghi đè khi bản trên máy đã cũ

**Out of date** nghĩa là bản làm việc trên máy được lấy từ một mốc cũ hơn bản hiện tại trên hệ thống.
“Có thay đổi trên máy” và “đang dùng bản cũ” là hai việc khác nhau: file có thể đã sửa nhưng vẫn dựa
trên bản mới nhất, hoặc chưa sửa gì nhưng đã bị bản mới hơn thay thế trên hệ thống.

Ví dụ: Nam còn bản làm việc lấy từ A/2. Sau một lần chuyển quyền Checkout hợp lệ, Hương đã nộp A/3.
Nếu Nam dùng bản cũ của mình để Check-in, IDEA phải từ chối. Đây không phải tình huống hai người được
cấp Checkout cùng lúc; bản cũ còn trên máy Nam không làm anh ấy có quyền ghi đè A/3.

Thông báo cần nói được bằng ngôn ngữ dễ hiểu: “Bản trên máy lấy từ A/2; hệ thống đã có A/3. File bạn
đã sửa vẫn được giữ lại. Hãy kiểm tra quyền sửa và xử lý chênh lệch trước khi nộp lại.” Thông tin
người đang giữ tài liệu chỉ được hiện khi người xem có quyền biết.

Cách xử lý là giữ riêng công việc đã sửa, lấy bản hiện tại để so sánh, rồi chủ động áp dụng lại phần
thay đổi cần giữ hoặc lưu thành tài liệu khác khi phù hợp. Trước khi Check-in lại phải có quyền sửa
hợp lệ. IDEA không tự ghép hai bản CAD/Office và cũng không xóa file cũ để “giải quyết” xung đột.

Tương tự, hệ thống phải từ chối nếu sai người, sai Workspace hoặc quyền Checkout đã hết hạn. Gia hạn,
chuyển hay khôi phục quyền phải có người được phép thực hiện, lý do và lịch sử; các thao tác này không
được bỏ qua việc kiểm tra bản dữ liệu.

### 3.5 Giữ nguyên bộ hồ sơ đã dùng cho một thiết kế

Một cụm bơm không chỉ có một file. Cần biết bản lắp đang dùng những chi tiết và tài liệu nào, ở bản
nào. Quan hệ theo từng cụm, chi tiết và tài liệu này được gọi là **Product Structure**.

Có thể hình dung hệ thống giữ một bản kê hồ sơ theo cấu trúc sản phẩm: không chỉ ghi “có bản vẽ trục”
mà ghi rõ “dùng bản vẽ trục A/2”. Bản kê được lưu cố định cùng hồ sơ, không tự chạy theo tài liệu mới.

Ví dụ: bộ hồ sơ P-100 đã ban hành sử dụng bản vẽ trục A/2. Sau đó bản vẽ trục có Revision B, khi mở
lại bộ hồ sơ đã ban hành, hệ thống vẫn phải lấy đúng A/2. Muốn dùng bản trục mới, người phụ trách
phải cập nhật hồ sơ cụm và thực hiện lại quá trình xét duyệt tương ứng.

Tài liệu liên quan bắt buộc nhưng đang thiếu, chưa xác định được hoặc không có quyền sử dụng phải
hiển thị rõ và chặn ban hành. Nếu cần ngoại lệ, phải ghi cụ thể tài liệu nào, người chịu trách nhiệm,
lý do, rủi ro, bằng chứng, người phê duyệt và thời hạn hoặc điều kiện xem xét lại. Không được chỉ bấm
“bỏ qua cảnh báo” rồi coi hồ sơ là đầy đủ.

### 3.6 Duyệt đúng bản, rồi mới ban hành

Quá trình này gồm ba việc khác nhau:

- **Review:** kiểm tra nội dung của bản tài liệu được gửi.
- **Approval:** người có thẩm quyền chấp thuận hoặc từ chối đúng bản đó.
- **Release:** ban hành bộ hồ sơ đã đáp ứng đầy đủ điều kiện để sử dụng nội bộ.

Ví dụ: Hương chấp thuận bản vẽ A/2. Quyết định đó không được tự áp dụng cho A/3 mà Nam sửa sau này.
Nếu phải sửa tài liệu đã gửi duyệt, cần rút hoặc trả tài liệu về bước đang làm, rồi gửi lại bản mới.
Từ chối tài liệu phải ghi lý do để người sửa biết cần xử lý gì.

Theo quy tắc mặc định của Core v0, cần một người duyệt đủ thẩm quyền và không phải người đã soạn hoặc
sửa Revision đang xét. Người duyệt đó cũng có thể ban hành nếu đủ quyền. Nếu chưa có người phù hợp,
hệ thống phải dừng và nêu rõ thiếu ai hoặc thiếu quyền gì, không tự giao quyền cho người soạn.

Trước khi ban hành P-100, người thực hiện phải xem và xác nhận danh sách hồ sơ. IDEA kiểm tra lại
đúng bản tài liệu, cấu trúc liên quan, quyền và kết quả duyệt. Chỉ cần một tài liệu bắt buộc không đủ
điều kiện thì cả phạm vi ban hành phải dừng, không âm thầm ban hành một phần.

Khi thành công, hệ thống ghi một hồ sơ ban hành cố định và tạo gói bàn giao gồm đúng file, thông tin,
cấu trúc cùng bằng chứng cần thiết. Về sau phải mở lại và kiểm tra đúng bộ này, không lấy các file
“mới nhất” rồi thay vào.

### 3.7 Biết ai được làm gì và ai đã làm gì

Thông tin như tên tài liệu, loại tài liệu, người phụ trách hay mã nghiệp vụ giống như **thẻ thông tin
đi kèm hồ sơ**. Công ty cần cấu hình được các trường cần nhập, cách kiểm tra và cách đánh số. Mã
nghiệp vụ không được cấp trùng trong phạm vi quy định và không thay thế mã định danh cố định của hệ
thống.

Quyền xem, sửa, duyệt và ban hành phải dựa trên vai trò, nhóm và trạng thái tài liệu. Không được viết
cứng tên một người hay một nhóm vào các quy tắc cốt lõi đến mức đổi phân công phải sửa lại sản phẩm.
Dữ liệu, người dùng và quy định phải thuộc đúng phạm vi tổ chức quản lý; có tài khoản không đồng
nghĩa được truy cập mọi hồ sơ.

Ví dụ: sau này công ty đổi người duyệt từ một chức danh sang nhóm trưởng kỹ thuật. Hệ thống phải cho
phép thay đổi quy định theo thẩm quyền. Tuy nhiên, hồ sơ đã duyệt trước đó vẫn phải cho biết đã áp
dụng quy định nào, không bị hiểu lại theo quy định mới. Quy trình đang chạy cũng giữ quy định đã
chọn; nếu cần chuyển đổi phải có phê duyệt và ghi nhận riêng.

**Audit** là lịch sử để trả lời: ai đã làm gì, lúc nào, với tài liệu và bản nào, theo quyền/quy định
nào, kết quả ra sao. Các việc nộp bản sửa, bị từ chối, xử lý xung đột, duyệt, ban hành và xuất hồ sơ
phải để lại lịch sử này. Người dùng hoặc quản trị viên không được sửa/xóa lịch sử bằng chức năng
thông thường.

### 3.8 Lưu được file không có nghĩa là hiểu hết file đó

IDEA phải quản lý được mã, các bản đã nộp, quyền, lịch sử và khả năng khôi phục cho mỗi loại file được
cho phép. Người dùng vẫn mở và sửa bằng Word, Excel hoặc CAD đã cài trên Windows.

Ví dụ: lưu được một file IRONCAD không có nghĩa IDEA đã đọc được cây lắp ráp, hiểu mọi thuộc tính
hoặc tự tạo được bản xem trước của file đó. Những khả năng này phải được công bố và kiểm tra riêng
cho đúng định dạng, phiên bản phần mềm và công cụ hỗ trợ.

IRONCAD là phần mềm CAD đầu tiên được chọn để kiểm chứng các khả năng đọc và phân tích sâu hơn.
Sau này thêm phần mềm thiết kế khác không được làm thay đổi cách quản lý mã tài liệu, bản lưu,
Checkout, Check-in và ban hành.

IDEA không chạy mã bên trong Office/CAD. Bản xem trước hoặc file chuyển đổi chỉ là bản phục vụ xem
và đối chiếu, không thay thế file gốc. Hệ thống phải biết bản xem đó được tạo từ bản tài liệu nào,
bằng công cụ nào; bản xem đã cũ không được trình bày như bản hiện tại. Xử lý lỗi không được làm hỏng
file gốc.

### 3.9 Màn hình phải giúp người dùng biết mình đang ở đâu

Khi chọn một tài liệu, người dùng phải thấy ngay mã/tên, trạng thái, ai đang có quyền sửa và bước tiếp
theo. Nếu nút chưa dùng được, phải giải thích vì sao. Nhóm tài liệu dùng biểu tượng có thể phân biệt
và tên đi kèm; trạng thái không được chỉ biểu đạt bằng màu.

Ví dụ: Nam mở hồ sơ P-100 để kiểm tra bản đang sửa. Anh ấy không nên phải cuộn qua nhiều khối thông
tin khác loại mới tìm được nút Check-in. Thông tin chính ở ngay màn hình; muốn xem toàn bộ lịch sử
thì mở phần chi tiết riêng. Danh sách dài cùng loại có thể cuộn trong vùng của nó.

Tại kích thước màn hình dùng kiểm tra là **1440×900**, thông tin định danh, lệnh chính, bước tiếp theo
và phần tổng quan phải sử dụng được mà không cuộn dọc cả trang. Đây là mốc kiểm tra thiết kế, chưa
phải cam kết mọi thiết bị đều hiển thị như nhau. Cần kiểm tra cả thao tác bằng bàn phím, vị trí đang
được chọn, thông báo lỗi và việc trở lại đúng vị trí sau khi đóng phần chi tiết.

Giao diện hỗ trợ tiếng Anh, tiếng Việt và tiếng Nhật. Đổi ngôn ngữ chỉ đổi cách trình bày, không đổi
quyền hay kết quả thao tác. Thiếu bản dịch thì dùng tiếng Anh; ghi nhớ lựa chọn của người dùng. Tên
và nội dung do người dùng nhập phải được giữ nguyên, không tự dịch, mất dấu hoặc hỏng chữ tiếng Nhật.

### 3.10 Sao lưu phải khôi phục được, không chỉ có thông báo “đã sao lưu”

Cần phân biệt hai thứ:

- **Gói hồ sơ đã ban hành (Release Package):** dùng để bàn giao hoặc mở lại đúng một bộ hồ sơ.
- **Bản sao lưu hệ thống (backup):** dùng để khôi phục dữ liệu khi có sự cố; phải gồm file, thông tin
  quản lý, cấu trúc, quy định và dữ liệu bảo mật cần thiết tại cùng một mốc.

Ví dụ: sau sự cố máy chủ, chỉ khôi phục được tên hồ sơ P-100 nhưng thiếu bản vẽ trục thì chưa đạt.
Có đủ file nhưng liên kết sang sai bản cũng chưa đạt. Nhóm dự án phải thử khôi phục ở môi trường riêng,
đối chiếu đủ tài liệu, đúng cấu trúc và đúng nội dung từng file rồi mới kết luận sao lưu/khôi phục đạt
yêu cầu. Không được dùng việc mở một gói Release để thay cho bài kiểm tra này.

Về bảo mật, ứng dụng phía người dùng và phần xử lý file không được chứa tài khoản truy cập trực tiếp
toàn bộ database hoặc khóa truy cập kho file cố định. Quyền truyền file phải giới hạn theo đúng file,
thao tác và thời hạn. Tài khoản Windows khác không được tự điều khiển hay đọc dữ liệu Workspace của
Nam.

File không tin cậy cần được xử lý riêng với giới hạn tài nguyên, để file lỗi không làm thay đổi dữ
liệu gốc hoặc trạng thái hồ sơ. Thông báo và danh sách tìm kiếm cũng không được thay thế kết quả chính
thức: thông báo lỗi không có nghĩa một lần Check-in đã thành công bị hủy, và thông báo thành công
không được xuất hiện cho thao tác chưa hoàn tất.

## 4. Khi demo và nghiệm thu, cần cho thấy những gì?

Không chỉ trình diễn thao tác thuận lợi. Cần chủ động tạo cả tình huống lỗi rồi xem hệ thống có bảo
vệ dữ liệu như đã nêu hay không.

| Bài kiểm tra với hồ sơ P-100 | Kết quả cần nhìn thấy |
|---|---|
| Đổi tên file; thử đưa vào một file có dấu hiệu trùng | Mã định danh không đổi theo tên. Trường hợp nghi trùng được hỏi lại, không bị tự gộp. |
| Checkout bản vẽ trục, lấy vỏ bơm làm Reference | Chỉ giữ quyền sửa bản vẽ trục; không cho nộp thay đổi vỏ bơm khi chưa có quyền. |
| Save nhiều lần, rồi Check-in một lần có thay đổi | Save không tăng bản trên hệ thống; Check-in thành công tạo đúng một bản mới và trả quyền Checkout. |
| Check-in khi mọi dữ liệu đều không đổi | Không tăng Version; không còn giữ Checkout trong phạm vi vừa nộp. |
| Cố tình làm lỗi một tài liệu trong lượt Check-in ba tài liệu | Không tài liệu nào được công bố từ lượt lỗi; file người dùng đã sửa vẫn còn nguyên. |
| Gửi lại lượt Check-in sau khi mất kết nối lúc nhận kết quả | Không tạo thêm một bản trùng; hệ thống trả lại kết quả đúng của lượt đó. |
| Thử nộp bản cũ, dùng sai người, sai Workspace hoặc quyền hết hạn | Tất cả đều bị chặn và có hướng xử lý; công việc trên máy không bị xóa hoặc ghi đè. |
| Nam tự duyệt bản mình sửa; hoặc chưa có người đủ quyền duyệt | Theo quy tắc mặc định, hệ thống từ chối, không tự bỏ điều kiện người duyệt. |
| Đổi nội dung sau khi gửi duyệt; thử ban hành khi còn thiếu tài liệu | Bản sửa phải được xét duyệt lại; chưa đủ hồ sơ thì không được ban hành một phần. |
| Ban hành P-100, cập nhật riêng bản vẽ trục, rồi mở lại hồ sơ đã ban hành | Vẫn mở đúng bộ cũ; gói bàn giao khớp toàn bộ file và cấu trúc đã ban hành. |
| Đổi quy định phân quyền; kiểm tra lịch sử và thử truy cập ngoài quyền | Lịch sử cũ vẫn giải thích được; không đọc, sửa hoặc xuất được dữ liệu ngoài quyền. |
| Dùng file mẫu được hỗ trợ và file lỗi | Lưu/mở đúng file; chỉ thể hiện khả năng đã kiểm chứng; lỗi phân tích không làm hỏng file gốc. |
| Làm cùng tác vụ ở ba ngôn ngữ trên các giao diện | Cùng quyền, cùng kết quả; không mất chữ, cắt nút quan trọng hay buộc cuộn cả trang để làm việc chính. |
| Khôi phục từ bản sao lưu vào môi trường kiểm tra riêng | Đủ hồ sơ, đúng bản, đúng liên kết và nội dung từng file; thiếu hoặc sai thì không đạt. |

Các bài trên là **kế hoạch kiểm tra, chưa phải kết quả đã đạt**. Prototype HTML hiện có giúp xem và
góp ý giao diện; nó chưa chứng minh việc lưu dữ liệu thật, phân quyền, xử lý đồng thời hay khôi phục.
Nhóm thực hiện phải lưu kết quả quan sát và bằng chứng, không chỉ đánh dấu đã demo.

## 5. Những thông tin cần bổ sung trước các bước sau

| Cần làm rõ | Câu hỏi thực tế cần trả lời | Thời điểm cần có |
|---|---|---|
| Quy mô sử dụng | Có bao nhiêu người dùng? Có bao nhiêu hồ sơ, file lớn đến mức nào, bao nhiêu người làm cùng lúc? | Trước khi chốt kế hoạch viết Core và cam kết môi trường vận hành. |
| Tốc độ | Người dùng chấp nhận đợi bao lâu khi mở danh sách, tải file hoặc Check-in? | Khi chuẩn bị chạy thử với khối lượng công việc đại diện. |
| Mức chịu sự cố | Có thể dừng hệ thống bao lâu? Sau sự cố, tối đa được mất lại bao nhiêu dữ liệu mới tạo và phải khôi phục trong bao lâu? | Trước khi quyết định đưa vào vận hành thực tế. |
| Thời hạn giữ Checkout | Giữ quyền trong bao lâu, gia hạn khi nào, ai được xử lý nếu người đang giữ vắng mặt? | Trước đợt chạy thử kỹ thuật. |
| Định dạng file | Những loại file và kích thước nào được phép dùng? IRONCAD và các ứng dụng Office là bản nào, có giấy phép/công cụ nào? | Trước khi chốt khả năng hỗ trợ và triển khai phần đọc/phân tích CAD. |
| Máy người dùng | Dùng Windows, trình duyệt, màn hình và công cụ hỗ trợ tiếp cận nào? | Trước khi cam kết phạm vi thiết bị được hỗ trợ. |
| Người kiểm tra chuyên môn | Ai kiểm tra yêu cầu, bảo mật, dữ liệu, giao diện/ngôn ngữ và khôi phục? | Trước bước đánh giá tương ứng; chưa có thì phải ghi rõ đang chờ. |

Không tự điền những con số này chỉ để bản đề xuất trông đầy đủ. Người chuẩn bị tài liệu có trách
nhiệm tập hợp thông tin và báo những chỗ cần sếp hoặc đầu mối chuyên môn quyết định. Nếu được duyệt
có điều kiện, phải ghi rõ việc còn lại, ai chịu trách nhiệm và khi nào hoàn thành; không coi đó là đã
đủ điều kiện vận hành.

## 6. Sếp cần quyết định điều gì?

Sau khi phạm vi Feature được duyệt, đề nghị sếp xem xét:

1. Các quy tắc ở mục 3 có đúng với cách công ty muốn quản lý hồ sơ kỹ thuật hay không.
2. Các kết quả ở mục 4 có đủ rõ để kiểm tra sản phẩm có làm đúng hay không.
3. Những thông tin còn thiếu ở mục 5 cần ai bổ sung và phải xong trước bước nào.

Nếu đồng ý, nhóm dự án dùng đúng bản Spec được duyệt làm yêu cầu đầu vào cho thiết kế và triển khai.
Quyết định này không đồng thời duyệt công nghệ hoặc xác nhận sản phẩm đã hoạt động.

## Phụ lục A — Thuật ngữ để tra khi cần

Không cần nhớ các thuật ngữ này để đọc phần chính. Chúng giúp đối chiếu với màn hình và tài liệu
kỹ thuật, tránh dùng một tên cho hai ý nghĩa khác nhau.

| Thuật ngữ | Cách hiểu trong hồ sơ P-100 |
|---|---|
| Stable ID / DocumentId | Mã định danh cố định mà hệ thống gán cho tài liệu, không lấy từ tên file hay số bản vẽ. |
| Logical Document | Tài liệu được quản lý xuyên suốt lịch sử, không phải một file ở một thư mục cụ thể. |
| Business Number / Metadata | Mã nghiệp vụ và thông tin mô tả trên “thẻ hồ sơ”; được quản lý theo quy định riêng, không thay thế Stable ID. |
| Business Revision | Mốc sửa đổi theo quy định, như A hoặc B. Tạo mốc tiếp theo là một thao tác có kiểm soát. |
| Version | Lần cập nhật được nộp thành công trong một Revision, như A/1 rồi A/2; không phải số lần Save trên máy. |
| Generation | Một bản dữ liệu đã nộp và lưu cố định, gồm file, thông tin và cấu trúc liên quan. Không phải mỗi lần Save đều tạo một Generation. |
| Artifact / digest | Artifact là nội dung file được giữ cố định; digest là mã kiểm tra nội dung, dùng đối chiếu file có còn nguyên vẹn hay không. Đây không phải mã hồ sơ. |
| Checkout / Reservation | Checkout là thao tác lấy đúng tài liệu về và đăng ký giữ quyền nộp bản sửa; Reservation là quyền giữ tạm thời gắn với người, tài liệu và Workspace. Không phải khóa file của Windows. |
| Reference / Workspace | Reference là bản lấy về tham khảo, không có quyền nộp sửa. Workspace là vùng file làm việc được IDEA quản lý trên máy người dùng. |
| Check-in / No Change | Check-in là nộp phần thay đổi đã xác nhận. No Change nghĩa là nội dung file, thông tin và cấu trúc đều không đổi; không tạo bản mới và vẫn kết thúc Checkout. |
| Change Set / Operation ID | Change Set là nhóm thay đổi được nhận cùng nhau hoặc không nhận phần nào. Operation ID giúp nhận ra cùng một lượt nộp khi phải gửi lại, tránh tạo bản trùng. |
| Product Structure / Structure Snapshot | Product Structure là quan hệ theo cụm, chi tiết và tài liệu. Structure Snapshot giữ cố định các quan hệ đó cùng đúng bản của từng thành phần. |
| Workflow / Policy | Workflow là quy trình xử lý, chẳng hạn sửa → kiểm tra → duyệt. Policy là quy định về quyền và điều kiện phải đáp ứng; lịch sử phải chỉ rõ đã dùng quy định nào. |
| Release Record / Release Package | Release Record ghi nhận chính xác bộ hồ sơ đã ban hành. Release Package là gói file và thông tin xuất từ bản ghi đó, không thay cho bản sao lưu toàn hệ thống. |
| Audit / Recovery | Audit là lịch sử ai làm gì, lúc nào và kết quả. Recovery là xử lý để tiếp tục công việc hoặc khôi phục dữ liệu/quyền hợp lệ, không phải cho phép ghi đè bản mới. |
| RPO / RTO | RPO là mức mất dữ liệu tối đa chấp nhận được tính theo thời gian; RTO là thời gian mục tiêu để khôi phục. Các giá trị cho IDEA chưa được chốt. |

Các ví dụ A/1, A/2, B/1 mô tả tài liệu mà sản phẩm quản lý. Chúng không phải số phiên bản `0.3` của
chính bản Spec đang đọc.

## Phụ lục B — Đối chiếu với yêu cầu chi tiết

Phần chính diễn giải cùng bộ **61 yêu cầu** trong DOC-04, không thay đổi hay thay thế bộ yêu cầu đó.
Mã, nguồn, điều kiện đạt và phương pháp kiểm tra đầy đủ nằm ở tài liệu nguồn. Ví dụ P-100 dùng để
giải thích quy tắc, không bổ sung tính năng hoặc đặt ngưỡng nghiệm thu mới.

| Nhóm yêu cầu | Mã | Số lượng | Mục diễn giải |
|---|---|---:|---|
| Tiếp nhận và nhận diện tài liệu | `REQ-ID-*` | 6 | 3.1 |
| Vùng làm việc, Checkout và Check-in | `REQ-WS-*` | 13 | 2, 3.2–3.4 |
| Cấu trúc sản phẩm | `REQ-STR-*` | 3 | 3.5 |
| Xét duyệt, ban hành và Revision tiếp theo | `REQ-LC-*` | 9 | 3.1, 3.6 |
| Quyền, thông tin và quy định quản lý | `REQ-GOV-*` | 5 | 3.7 |
| Lịch sử thao tác | `REQ-AUD-*` | 2 | 3.7 |
| Định dạng file | `REQ-FMT-*` | 5 | 3.8 |
| Giao diện và khả năng tiếp cận | `REQ-UX-*` | 6 | 3.9 |
| Ngôn ngữ | `REQ-LOC-*` | 3 | 3.9 |
| Bảo mật | `REQ-SEC-*` | 4 | 3.10 |
| Vận hành và khôi phục | `REQ-OPS-*` | 5 | 3.3, 3.10, 5 |
| Tổng cộng |  | **61** |  |

Các chi tiết nhóm kỹ thuật cần giữ khi kiểm tra:

- Đối chiếu đúng Generation, nội dung file, thông tin được quản lý theo phiên bản và cấu trúc;
  không chỉ so tên file hoặc thời gian sửa.
- Kiểm tra ba ngôn ngữ trên ba dạng giao diện: Web, Desktop và phần Web hiển thị trong Desktop —
  tổng cộng chín tổ hợp. Kiểm tra cả nhập, tìm kiếm, lưu/mở lại tiếng Nhật và công cụ hỗ trợ tiếp cận.
- Các bài thử đồng thời, gây lỗi có chủ đích, phân quyền và khôi phục phải dùng đúng dữ liệu, bản
  phần mềm và môi trường được ghi nhận trong kế hoạch; ảnh giao diện không thay cho các kết quả này.
- Mức ưu tiên và mốc áp dụng vẫn theo DOC-04. Ví dụ yêu cầu bàn phím/tiếp cận `REQ-UX-006` giữ mức
  `Should before rollout`; việc diễn giải ở đây không tự nâng thành điều kiện đã được duyệt.
- Toàn bộ 14 nhóm kiểm tra trong VVP chưa được chạy. Kiểm tra chức năng bằng tài khoản đóng vai
  không thay thế đánh giá độc lập, kiểm tra chuyên môn hoặc chấp nhận của người dùng đại diện.

## Phụ lục C — Thông tin kiểm soát và quyết định

### Thông tin tài liệu

| Trường | Giá trị |
|---|---|
| ID / trục quyết định | `SPEC-001` / `Spec` |
| Trạng thái / phiên bản | `Draft 0.3`; review nội bộ được mở lại, chưa duyệt |
| Bộ tài liệu áp dụng | `IDEA-C1-ANALYSIS-DESIGN-001` / `IE-SPEC-CORE-V0-001@0.1` |
| Người chuẩn bị | `Principal Product Author`; danh tính cá nhân chưa được ghi nhận |
| Người review nội bộ | Người dùng dự án (`Author Self-Reviewer`); yêu cầu chưa duyệt và xem lại cấu trúc Spec ngày 2026-09-03 |
| Người quyết định | Sếp — `Product Decision Authority`; chưa ghi nhận danh tính và quyết định |
| Mức sẵn sàng trình duyệt | `BLOCKED`: cần hoàn tất review lại bản Spec; quyết định Feature của sếp vẫn là điều kiện trước quyết định Spec |
| Phân loại | `INTERNAL` — dùng nội bộ |
| Thay đổi so với 0.2 | Viết lại bằng ngôn ngữ nghiệp vụ; thêm ví dụ P-100; làm rõ Save/Check-in/Release, Revision/Version và gói hồ sơ/sao lưu. Không thay đổi yêu cầu nguồn. |
| Bản DOCX/PDF | Chưa tạo |

### Tài liệu nguồn

| Tài liệu nguồn | Phiên bản / bộ yêu cầu | Nội dung sử dụng |
|---|---|---|
| [`IE-PROD-SREQ-001`](../DOC-04-software-requirements-specification.md) | `0.1` / `IE-SPEC-CORE-V0-001` | 61 yêu cầu, các tình huống chất lượng và điều kiện kiểm tra |
| [`IE-PROD-DATA-001`](../DOC-06-data-integration-and-migration-specification.md) | `0.1` / `IE-SPEC-CORE-V0-001` | Quản lý mã, dữ liệu, quan hệ, đưa file vào hệ thống và khôi phục |
| [`IE-PROD-UX-001`](../DOC-08-ui-ux-and-interaction-specification.md) | `0.1` / `IE-SPEC-CORE-V0-001` | Tác vụ người dùng, trạng thái giao diện, khả năng tiếp cận và ngôn ngữ |
| [`IE-VVP-CORE-001`](../registers/VVP-core-v0-verification-validation-plan.md) | `0.1` / `IE-SPEC-CORE-V0-001` | Cách kiểm tra, môi trường, bằng chứng cần lưu và giới hạn kết luận |

Nếu nội dung hoặc phiên bản tài liệu nguồn thay đổi, phải đối chiếu lại bản diễn giải và cập nhật
thông tin nguồn trước khi dùng để review hay ra quyết định. Bản 0.3 không mang theo bất kỳ kết quả
duyệt nào của một bản trước đó.

### Kết quả review nội bộ

| Trường | Nội dung |
|---|---|
| Tài liệu được review | `SPEC-001@0.3` |
| Phạm vi | Nội dung Spec để trình sếp: các quy tắc, ví dụ và kết quả cần kiểm tra; không thay đổi 61 yêu cầu nguồn |
| Người review | Người dùng dự án (`Author Self-Reviewer`) |
| Ngày review | 2026-09-03 |
| Xác nhận trước đó — đã thu hồi | “Ok duyệt spec”; không còn là chấp thuận có hiệu lực |
| Yêu cầu hiện tại | “Ê khoan chưa duyệt nha.” Người review yêu cầu làm rõ cấu trúc và nội dung cần có của một bản Spec trước khi tiếp tục xem xét |
| Kết quả hiện tại | Chưa duyệt; review được mở lại, không còn kết quả `PASS` có hiệu lực |
| Giới hạn | Không phải quyết định Spec của `Product Decision Authority`, không thay thế review chuyên môn độc lập và không xác nhận các bài kiểm tra phần mềm đã đạt |

Lần cập nhật này thu hồi ghi nhận chấp thuận trước đó theo yêu cầu mới của người review. Nội dung
quy tắc, ví dụ, điều kiện kiểm tra và tài liệu nguồn chưa thay đổi; chưa viết lại Spec. Quyết định
của sếp được ghi riêng bên dưới.

### Ghi nhận quyết định của sếp

| Trường | Nội dung |
|---|---|
| Tài liệu được xem xét | `SPEC-001@0.3` |
| Quyết định | `NOT-RUN` — chưa thực hiện |
| Ý kiến / điều kiện kèm theo | Chưa ghi nhận |
| Người quyết định / ngày quyết định | Chưa ghi nhận |
| Việc cần cập nhật sau quyết định | Chưa ghi nhận |

Thứ tự quyết định vẫn là Feature → Spec → Tech. Sau đó còn phải kiểm tra điều kiện bắt đầu triển
khai (`PG4`). Tài liệu này không ghi nhận sếp đã duyệt và không cho phép bắt đầu viết production code.
