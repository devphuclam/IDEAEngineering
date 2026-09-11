from __future__ import annotations

import argparse
import copy
import html
import json
import shutil
import sys
import zipfile
from pathlib import Path

from lxml import etree


W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_R = "http://schemas.openxmlformats.org/package/2006/relationships"
NS = {"w": W, "r": R, "pr": PKG_R}

ROOT = Path(r"C:\Users\TD-999\Research\Projects\IDEA\IDEAEngineering")
HUMAN = Path(r"C:\Users\TD-999\Research\Projects\IDEA\Human\IDEAEngineering")
SOURCE = HUMAN / "IDEA-DDM-bao-cao-kien-truc-nghiep-vu-trinh-review-v2.docx"
PACKAGE_ROOT = HUMAN / "Packages" / "IDEA-DDM-kien-truc-nghiep-vu-review-v3"
OUTPUT_DOCX = PACKAGE_ROOT / "IDEA-DDM-bao-cao-kien-truc-nghiep-vu-trinh-review-v3.docx"
OUTPUT_ZIP = HUMAN / "Packages" / "IDEA-DDM-kien-truc-nghiep-vu-review-v3.zip"
DIAGRAM_SOURCE = ROOT / "docs" / "product" / "instances" / "idea-engineering" / "evidence" / "IE-VEV-ARCH-VIEW-002"
DIAGRAM_DIR = PACKAGE_ROOT / "so-do"


GLOSSARY = [
    ("Access Policy", "Thành phần đánh giá các Role Assignment áp dụng cho một yêu cầu và trả về quyết định quyền. Access Policy không thay Business gate của tài liệu."),
    ("Account Administrator", "Quản trị viên tài khoản: tạo, khóa, khôi phục IDEA Account và quản lý trạng thái đăng nhập. Vai trò này không tự có quyền xem hoặc sửa tài liệu."),
    ("Active", "Trạng thái đang có hiệu lực của một Reservation, Role Assignment hoặc cấu hình, tùy đối tượng được nêu rõ."),
    ("Actor", "Danh tính ổn định của một người trong IDEA DDM. Actor liên kết hoạt động nghiệp vụ với IDEA Account và Login Identity nhưng không đồng nghĩa với một phiên đăng nhập."),
    ("Adapter", "Lớp nối một Interface của IDEA DDM với cách lưu trữ hoặc công cụ cụ thể. Thay Adapter không được làm đổi danh tính tài liệu."),
    ("All or none", "Toàn bộ phạm vi được ghi thành công hoặc không tài liệu nào được công bố. Trong tài liệu này, all-or-none có cùng nghĩa."),
    ("Approval Policy", "Bộ quy tắc có phiên bản quy định ai được Review hoặc Approve và cần những quyết định nào trước Release."),
    ("Approve", "Quyết định chấp thuận đúng Generation đang nằm trong Review Round. Approve chưa tự động tạo Release."),
    ("Artifact", "Nội dung file dạng byte được lưu trong kho file và nhận diện bằng Digest."),
    ("Artifact Store", "Kho lưu Artifact. Private Artifact Store là kho riêng chỉ được truy cập qua Server sau khi kiểm tra quyền."),
    ("Assignment", "Tên viết ngắn của Role Assignment trong một số sơ đồ. Tài liệu không dùng Assignment để chỉ một loại cấp quyền khác."),
    ("Audit", "Lịch sử có thể tra cứu về yêu cầu, quyết định và kết quả. Audit không phải quyền sửa lịch sử."),
    ("Audit Evidence", "Bằng chứng chỉ được bổ sung, ghi rõ ai thực hiện, lúc nào, trên đối tượng nào, theo Policy nào và kết quả ra sao."),
    ("Audit Reader", "Vai trò được phép đọc Audit Evidence trong Authorization Scope được giao nhưng không được sửa bằng chứng."),
    ("Authorization Scope", "Phạm vi mà Role Assignment có hiệu lực, chẳng hạn toàn công ty, một Project hoặc một tài nguyên cụ thể."),
    ("Backup", "Bản sao có kiểm soát của Database, Artifact, cấu hình, Policy và Key cần để phục hồi."),
    ("BOM", "Bill of Materials; dữ liệu liệt kê cụm, chi tiết, số lượng và quan hệ trong Product Structure. BOM không chỉ là một file Excel hoặc PDF."),
    ("Business gate", "Điều kiện nghiệp vụ được kiểm tra sau RBAC, ví dụ trạng thái tài liệu, chủ Checkout hoặc Expected Generation."),
    ("Business Group", "Nhóm người dùng phục vụ công việc trong một Project hoặc tổ chức. Group trong báo cáo là tên viết ngắn của Business Group."),
    ("Byte", "Đơn vị dữ liệu nhị phân tạo nên nội dung file. Cụm từ exact bytes chỉ đúng chuỗi byte của file được nhận diện bằng Digest."),
    ("C4", "Mô hình sơ đồ kiến trúc mô tả lần lượt System Context, Container, Component và Code. Báo cáo dùng các mức phù hợp, không bắt buộc đủ bốn mức cho mọi nội dung."),
    ("CAD", "Computer-Aided Design; nhóm phần mềm và định dạng phục vụ thiết kế kỹ thuật."),
    ("Candidate", "Dữ liệu hoặc file tạm đang chờ kiểm tra. Candidate chưa phải Artifact hoặc trạng thái chính thức của hệ thống."),
    ("Change Set", "Bản ghi nhóm các Generation được tạo bởi cùng một Check-in nhiều tài liệu."),
    ("Check-in", "Thao tác gửi thay đổi từ Workspace vào hệ thống. Khi thành công, hệ thống kết thúc Checkout trong phạm vi đã xác nhận."),
    ("Checkout", "Quyền giữ sửa một Logical Document cho đúng người, Workspace, Expected Generation và thời hạn."),
    ("Client", "Phần mềm phía người dùng gửi yêu cầu đến Server; trong báo cáo có thể là Web hoặc Desktop."),
    ("Commit", "Điểm hệ thống ghi một kết quả chính thức theo giao dịch. Trước Commit, Candidate chưa được công bố thành Generation."),
    ("Controlled Release Package", "Gói bất biến gồm Manifest, Metadata, file, Digest, cấu trúc và bằng chứng của một Release cụ thể."),
    ("Core v0", "Phạm vi lõi đầu tiên dùng để xây đúng nền tảng quản lý tài liệu. Core v0 không đồng nghĩa sản phẩm thử làm nhanh hoặc bỏ qua yêu cầu chất lượng."),
    ("Credential", "Thông tin bí mật dùng để xác thực một Client, Server hoặc tiến trình. Credential không được đặt trong mã nguồn, log hay giao diện người dùng."),
    ("Database", "Kho dữ liệu có cấu trúc dùng để lưu Metadata, trạng thái, quan hệ và kết quả giao dịch. Trong báo cáo, PostgreSQL là một Database cụ thể."),
    ("Design Engineer", "Role Definition dành cho kỹ sư thiết kế trong phạm vi được giao; không phải tên của một Group hay chức danh quản trị."),
    ("Desktop", "Ứng dụng chạy trên máy Windows của kỹ sư, quản lý thao tác với Workspace và phối hợp mở file bằng Office hoặc CAD."),
    ("Digest hoặc hash", "Dấu vân tay tính từ nội dung file, dùng kiểm tra toàn vẹn và nhận diện nội dung bất biến."),
    ("Effective Permission", "Quyền hợp lệ tại thời điểm yêu cầu sau khi xét Role Assignment trực tiếp, qua Group, Authorization Scope, trạng thái và thời hạn."),
    ("Expected Generation", "Generation mà Workspace dựa vào; dùng phát hiện bản làm việc đã cũ trước khi ghi."),
    ("Fail closed", "Khi thiếu quyền, dữ liệu hoặc quy tắc thì hệ thống từ chối an toàn thay vì tự bỏ qua điều kiện."),
    ("File", "Tệp nội dung người dùng mở bằng Office, CAD hoặc trình xem. File không phải danh tính Logical Document."),
    ("Fingerprint", "Dấu nhận diện ổn định của toàn bộ Input cho một OperationId; dùng phát hiện lần gọi lại có thật sự là cùng thao tác hay không."),
    ("Format Processor", "Bộ xử lý định dạng chạy Job có giới hạn để tạo Preview hoặc Representation; không được tự thay đổi Product State."),
    ("Framework", "Khung phần mềm cung cấp cấu trúc và thành phần dùng để phát triển ứng dụng. Báo cáo này không quyết định Framework."),
    ("GB và TB", "Gigabyte và terabyte; đơn vị dung lượng. Các con số dung lượng trong báo cáo là phạm vi thiết kế, không phải số đo vận hành đã xác nhận."),
    ("Generation", "Snapshot bất biến do hệ thống tạo để cố định chính xác Metadata, cấu trúc và Artifact; là mã kỹ thuật, không phải Version thứ hai cho người dùng."),
    ("Group", "Tên viết ngắn của Business Group. Group tập hợp Actor; Group không phải Role Definition và tự nó không chứa Permission."),
    ("Group Membership", "Bản ghi cho biết một Actor là thành viên trực tiếp của một Business Group trong phạm vi đã xác định."),
    ("Host", "Máy hoặc môi trường chạy một ứng dụng hay tiến trình. Tăng Host chỉ thực hiện khi có nhu cầu tải hoặc cách ly đã được chứng minh."),
    ("HTTPS", "Giao thức HTTP có mã hóa, dùng cho kết nối giữa Client và Server."),
    ("IDEA Account", "Tài khoản IDEA được quản trị để cho phép đăng nhập. Có IDEA Account không đồng nghĩa có quyền vào một Project."),
    ("IDEA DDM", "Tên tạm thời của sản phẩm nội bộ quản lý tài liệu và dữ liệu thiết kế có kiểm soát."),
    ("Identity and Accounts", "Module quản lý Actor, IDEA Account, Login Identity và điều kiện Session; không quyết định quyền nghiệp vụ trên tài liệu."),
    ("In Work", "Trạng thái Revision đang được soạn hoặc chỉnh sửa và chưa nằm trong Review Round đang hoạt động."),
    ("Input", "Dữ liệu đầu vào của một thao tác hoặc Job. Input phải được kiểm tra trước khi hệ thống sử dụng."),
    ("Interface", "Hợp đồng trao đổi giữa hai Module hoặc giữa hệ thống với Adapter; quy định yêu cầu, dữ liệu và kết quả được phép truyền."),
    ("IPC", "Inter-Process Communication; kênh liên lạc cục bộ giữa các tiến trình trên cùng máy. IPC không phải kết nối trực tiếp đến Database."),
    ("ISO IEC IEEE", "Các tổ chức ban hành tiêu chuẩn được viện dẫn. Mã tiêu chuẩn và năm phát hành trong bảng tiêu chuẩn xác định tài liệu được dùng."),
    ("Job", "Một công việc nền có đầu vào, trạng thái và kết quả riêng, ví dụ tạo Preview. Job không được tự sở hữu trạng thái tài liệu."),
    ("Key", "Khóa mật mã hoặc tham chiếu đến khóa cần để bảo vệ hay phục hồi dữ liệu; không phải mã tài liệu."),
    ("Lease", "Thời hạn hiệu lực của Reservation. Hết Lease thì quyền giữ sửa không còn hiệu lực theo quy tắc đã cấu hình."),
    ("Lifecycle", "Vòng đời và các trạng thái hợp lệ của một đối tượng. Lifecycle không đồng nghĩa với riêng thao tác Checkout."),
    ("Logical Document", "Danh tính ổn định của một tài liệu; không đổi chỉ vì đổi tên, chuyển Folder, Check-in hoặc tạo Revision mới."),
    ("Login Identity", "Phương thức hoặc bản ghi dùng để xác thực một IDEA Account. Một Actor có thể được nối với phương thức đăng nhập khác trong tương lai."),
    ("Manifest", "Danh sách có cấu trúc ghi các tài liệu, Artifact, Digest và thông tin cố định thuộc một Workspace, Generation hoặc gói Release."),
    ("Metadata", "Thông tin mô tả và quản lý tài liệu, chẳng hạn mã, tên, loại, Revision, Version, trạng thái và quan hệ."),
    ("Module", "Khối nghiệp vụ có trách nhiệm và dữ liệu sở hữu rõ. Module không mặc nhiên là một dịch vụ triển khai riêng."),
    ("No Change", "Kết quả Check-in xác định nội dung có nghĩa không đổi; không tăng Version hoặc Generation nhưng vẫn kết thúc Checkout."),
    ("Office", "Nhóm ứng dụng văn phòng dùng để soạn hoặc mở file tài liệu; Office là công cụ bên ngoài IDEA DDM."),
    ("Operation state", "Trạng thái của một OperationId, gồm các mốc như Prepared, Ready to commit, Committing, Committed, Refused, Failed, Cancelled hoặc Needs reconciliation."),
    ("OperationId", "Mã ổn định của một thao tác; dùng tiếp tục hoặc tra lại đúng kết quả khi kết nối bị gián đoạn."),
    ("Outbox", "Bản ghi được Commit cùng giao dịch chính để chuyển sự kiện ra xử lý nền mà không làm mất hoặc phát lặp kết quả nghiệp vụ."),
    ("PDF", "Portable Document Format; định dạng thường dùng để xem và phát hành bản thể hiện, không thay thế danh tính Generation nguồn."),
    ("Permission", "Mã hành động mà Server hiểu và kiểm tra, ví dụ Document.Checkout hoặc Document.CheckIn."),
    ("Pin", "Cố định tham chiếu đến đúng phiên bản của một đối tượng để thay đổi về sau không làm đổi kết quả đã Review hoặc Release."),
    ("Policy", "Bộ quy tắc có phiên bản dùng để ra quyết định. Policy không phải Permission; Access Policy và Approval Policy là hai loại có mục đích khác nhau."),
    ("PostgreSQL", "Hệ quản trị Database quan hệ được nhắc trong kiến trúc hiện tại. Việc nêu tên không thay thế quyết định công nghệ của Product Decision Authority."),
    ("Preview", "Bản xem trước để người dùng đọc nhanh nội dung; Preview là Representation dẫn xuất và không phải file nguồn có thẩm quyền."),
    ("Principal", "Tên viết ngắn của Security Principal trong sơ đồ. Principal không có một nghĩa thứ hai trong tài liệu này."),
    ("Private Artifact Store", "Artifact Store riêng của hệ thống; Client không nhận Credential dài hạn để truy cập trực tiếp."),
    ("Privileged Role Administrator", "Quản trị viên được phép quản lý Role Definition hoặc quyền quản trị nhạy cảm trong phạm vi ủy quyền."),
    ("Process Identity", "Danh tính kỹ thuật của một tiến trình khi truy cập tài nguyên. Process Identity được cấp quyền tối thiểu theo đúng trách nhiệm."),
    ("Product Configuration Administrator", "Quản trị viên cấu hình loại tài liệu, Workflow, Policy hoặc khả năng định dạng theo thẩm quyền được giao."),
    ("Product State", "Trạng thái nghiệp vụ chính thức của sản phẩm hoặc tài liệu do Module sở hữu quyết định; Job nền không được tự thay đổi."),
    ("Product Structure", "Dữ liệu cấu trúc cụm, chi tiết và quan hệ sản phẩm do IDEA DDM quản lý."),
    ("Production", "Môi trường vận hành thật cho người dùng. Tài liệu dùng từ production với đúng nghĩa này, không dùng để chỉ bản thiết kế hoặc thử nghiệm."),
    ("Project", "Phạm vi công việc hoặc sản phẩm có thành viên, Business Group và quyền riêng. Một Actor có thể có vai trò khác nhau ở các Project khác nhau."),
    ("Project Administrator", "Quản trị viên quản lý thành viên Project, Business Group và Role Assignment trong phạm vi được giao."),
    ("Project Membership", "Bản ghi cho biết một Actor được tham gia một Project; tư cách này chưa tự tạo Permission."),
    ("Qualification", "Hoạt động xác nhận môi trường, giới hạn và bằng chứng trước khi một thành phần được dùng thật."),
    ("RBAC", "Role-Based Access Control; cách kiểm soát quyền bằng Role Assignment thay vì gán từng Permission rời rạc cho mọi người dùng."),
    ("Reference", "Bản lấy để tham khảo; không có quyền Check-in vào Logical Document nguồn."),
    ("Reject", "Quyết định trả lại đúng Generation đang được Review, kèm lý do. Reject không xóa bản đã gửi."),
    ("Release", "Quyết định phát hành chính thức một phạm vi sau khi kiểm tra lại đầy đủ điều kiện."),
    ("Release Authority", "Người hoặc Role Assignment được phép yêu cầu Release trong Authorization Scope đã giao."),
    ("Release Record", "Bản ghi bất biến của một lần Release, cố định đúng tài liệu, cấu trúc, Policy, người, thời điểm và bằng chứng."),
    ("Released", "Trạng thái cho biết một phạm vi đã được Release thành công. Trạng thái này không tự lan sang tài liệu ngoài phạm vi."),
    ("Representation", "Bản dẫn xuất như PDF hoặc Preview, luôn gắn với đúng Generation nguồn và thông tin cách tạo."),
    ("Reservation", "Bản ghi phía Server dùng để thực thi Checkout. Giao diện người dùng ưu tiên từ Checkout."),
    ("ReservationId", "Mã của một Reservation cụ thể, dùng đối chiếu quyền giữ sửa và kết quả kết thúc quyền giữ."),
    ("Restore hoặc recovery", "Khôi phục một Recovery Set vào môi trường kiểm tra, đối soát dữ liệu rồi mới mở lại dịch vụ."),
    ("Restore drill", "Lần diễn tập phục hồi có ghi kết quả, dùng chứng minh Recovery Set thật sự mở được và dữ liệu khớp."),
    ("Review", "Quá trình xem xét một Generation và phạm vi đã được Pin theo Workflow và Approval Policy."),
    ("Review Round", "Một đợt Review cụ thể, cố định Generation, phạm vi, Workflow, Approval Policy, người tham gia và các quyết định."),
    ("Reviewer hoặc Approver", "Người được giao xem xét và ghi quyết định trong Review Round. Quyền cụ thể do Role Assignment và Policy quyết định."),
    ("Revision", "Mốc thay đổi nghiệp vụ lớn của cùng Logical Document, ví dụ A, B hoặc C."),
    ("Role", "Tên viết ngắn của Role Definition khi ngữ cảnh đã rõ. Role không phải Business Group và không phải chức danh tự tạo quyền."),
    ("Role Assignment", "Bản ghi gắn một Security Principal, một Role Definition Version và một Authorization Scope, kèm trạng thái và thời hạn."),
    ("Role Definition", "Định nghĩa có phiên bản chứa các Permission mà sản phẩm hỗ trợ."),
    ("Role Definition Version", "Bản bất biến của một Role Definition. Role Assignment phải trỏ đến đúng bản này để lịch sử quyền không bị đổi ngược."),
    ("RPO", "Recovery Point Objective; lượng dữ liệu tối đa có thể mất tính theo thời gian. Giá trị cụ thể cần được phê duyệt và kiểm chứng."),
    ("RTO", "Recovery Time Objective; thời gian mục tiêu để khôi phục dịch vụ. Giá trị cụ thể cần được phê duyệt và kiểm chứng."),
    ("Runtime", "Môi trường hoặc tiến trình đang thực thi phần mềm. Runtime không đồng nghĩa với mã nguồn hay môi trường phát triển."),
    ("Scope", "Tên viết ngắn của Authorization Scope trong sơ đồ. Scope không có một nghĩa cấp quyền khác trong tài liệu này."),
    ("Security Principal", "Actor hoặc Business Group có thể nhận Role Assignment."),
    ("Server", "Phần hệ thống tiếp nhận yêu cầu và là nơi duy nhất quyết định các thao tác nghiệp vụ được bảo vệ."),
    ("Session", "Phiên đăng nhập có thời hạn; có thể bị thu hồi khi tài khoản hoặc quyền thay đổi."),
    ("Source", "Đối tượng nguồn dùng để tạo một Representation hoặc Candidate. Source phải được xác định bằng danh tính và phiên bản cụ thể."),
    ("Stale hoặc Out of date", "Bản làm việc dựa trên Generation cũ hơn Working Head; phải xử lý mà không ghi đè hoặc tự Merge."),
    ("Start", "Trạng thái đầu của Revision trước Check-in thành công đầu tiên."),
    ("Structure Snapshot", "Ảnh chụp bất biến của Product Structure tại một mốc, cố định đúng các Generation thành phần."),
    ("Submit for Review", "Thao tác gửi đúng Generation và phạm vi vào một Review Round."),
    ("Super Administrator", "Vai trò dùng để khởi tạo hoặc phục hồi quyền quản trị cao nhất khi cần; không dùng như tài khoản làm việc hằng ngày."),
    ("Technology stack", "Tập hợp công nghệ dùng để xây và vận hành hệ thống. Báo cáo này mô tả kiến trúc logic, không quyết định Technology stack."),
    ("Transaction", "Giao dịch dữ liệu được Commit trọn vẹn hoặc Rollback trọn vẹn; không để lại kết quả thành công một phần."),
    ("UML", "Unified Modeling Language; ngôn ngữ sơ đồ dùng mô tả trạng thái, trình tự và quan hệ dữ liệu. Các ký hiệu alt, loop, 0..1 và 0..* là ký hiệu UML."),
    ("Version", "Số bản nội dung trong một Revision; tăng khi Check-in có thay đổi và trở về 1 khi tạo Revision mới."),
    ("Web", "Giao diện chạy trong trình duyệt để tìm kiếm, xem, Review, Release hoặc thực hiện chức năng quản trị được cấp quyền."),
    ("WebView2", "Thành phần hiển thị nội dung Web bên trong ứng dụng Windows. Việc nêu trong sơ đồ chi tiết là bối cảnh thiết kế, không phải quyết định công nghệ đã duyệt."),
    ("Windows", "Hệ điều hành trên máy kỹ sư theo bối cảnh hiện tại. Điều này không tự quyết định hệ điều hành của Server."),
    ("Worker", "Tiến trình nhận và chạy Job nền. Tăng Worker chỉ thực hiện khi số đo hàng đợi hoặc thời gian xử lý cho thấy cần thiết."),
    ("Working Head", "Generation hiện hành dùng làm cơ sở làm việc của một Revision chưa Release."),
    ("Workflow", "Luồng trạng thái và chuyển trạng thái có phiên bản, ví dụ Start, In Work, Under Review và Released."),
    ("Workspace", "Khu vực làm việc được quản lý trên máy người dùng, chứa file Checkout hoặc Reference và Manifest phục hồi cục bộ."),
]


DIAGRAMS = [
    ("ARCH-VIEW-CTX-001", "Bối cảnh hệ thống và nhóm người dùng", "Ai dùng IDEA DDM, công cụ nào nằm ngoài hệ thống và ai nhận gói Release."),
    ("ARCH-VIEW-CON-001", "Các khối chạy chính và luồng kết nối", "Web, Desktop, Workspace, Server, Database, kho Artifact và bộ xử lý định dạng."),
    ("ARCH-VIEW-MOD-001", "Trách nhiệm của các Module trên Server", "Module nào quản lý tài khoản, Project, quyền, vòng đời, tài liệu, cấu trúc và Audit Evidence."),
    ("ARCH-VIEW-SEQ-001", "Checkout và Reference theo phạm vi xác nhận", "Trình tự chọn phạm vi, kiểm tra quyền, tạo Reservation và tải đúng Artifact."),
    ("ARCH-VIEW-STATE-002", "Vòng đời Reservation", "Khi nào quyền giữ sửa Active, kết thúc, hết hạn hoặc được phục hồi."),
    ("ARCH-VIEW-STATE-003", "Trạng thái file Reference trên máy", "Phân biệt file còn nguyên, đã sửa, còn hiện hành hoặc đã Out of date."),
    ("ARCH-VIEW-SEQ-005", "Xử lý file Reference đã sửa", "Điều kiện để xin Checkout, giữ file cục bộ hoặc áp dụng lại thay đổi an toàn."),
    ("ARCH-VIEW-SEQ-002", "Check-in theo nguyên tắc All or none", "Chuẩn bị, tải Candidate, kiểm tra lần cuối và Commit toàn bộ phạm vi."),
    ("ARCH-VIEW-STATE-004", "Vòng đời một thao tác Check-in", "Các trạng thái trước Commit, đã Commit, kết thúc không công bố và cần đối soát."),
    ("ARCH-VIEW-SEQ-007", "Khôi phục sau Check-in bị gián đoạn", "Tra lại cùng OperationId, tiếp tục phần an toàn hoặc giữ thao tác để đối soát."),
    ("ARCH-VIEW-MOD-002", "Ranh giới kỹ thuật của Workspace và Check-in", "Phân chia trách nhiệm giữa Desktop, Workspace, Server, kho Candidate và Database."),
    ("ARCH-VIEW-STATE-001", "Vòng đời Revision", "Start, In Work, Under Review, Released và đường quay lại khi Reject."),
    ("ARCH-VIEW-SEQ-003", "Review và Release", "Cố định Generation, ghi quyết định và kiểm tra lại đúng phạm vi trước Release."),
    ("ARCH-VIEW-ACT-002", "Luồng tài liệu hoàn chỉnh", "Từ đăng ký tài liệu, Checkout hoặc Reference, Check-in, Review đến Release và lấy lại gói đã phát hành."),
    ("ARCH-VIEW-RBAC-001", "Mô hình RBAC", "Quan hệ giữa Security Principal, Role Definition, Permission, Authorization Scope và Role Assignment."),
    ("DATA-VIEW-AUTH-001", "Quan hệ dữ liệu về tài khoản và quyền", "Phân biệt Actor, IDEA Account, Project Membership, Group Membership và Role Assignment."),
    ("ARCH-VIEW-ACT-001", "Trách nhiệm cấp tài khoản và quyền trong Project", "QLHT tạo tài khoản; quản trị Project cấp tư cách thành viên, Group và Role Assignment."),
    ("ARCH-VIEW-STATE-005", "Vòng đời Role Definition và Role Assignment", "Cách tạo, kiểm tra, kích hoạt, thay thế, kết thúc hoặc để hết hạn cấu hình quyền."),
    ("ARCH-VIEW-SEQ-004", "Tính Effective Permission và kiểm tra Business gate", "Kiểm tra Session, Project, Group, Role Assignment và điều kiện tài liệu trước khi Commit."),
    ("ARCH-VIEW-DEP-001", "Ranh giới triển khai", "Các vùng máy kỹ sư, thiết bị Review, vùng Server, Database, kho Artifact và xử lý định dạng."),
    ("ARCH-VIEW-SEQ-011", "Backup và phục hồi phối hợp", "Cách tạo Recovery Set và kiểm tra đầy đủ Database, Artifact, cấu hình, Policy và Key trước khi mở lại dịch vụ."),
    ("ARCH-VIEW-SEC-001", "Luồng dữ liệu qua các vùng tin cậy", "Kênh kết nối, Credential, quyền truy cập kho dữ liệu và vùng xử lý file không tin cậy."),
]


FULL_REPLACEMENTS = {
    "Checkout là quyền giữ sửa. Reference là bản tham khảo. Check-in là thao xác nhận để ghi nhận bản làm việc từ Workspace vào kho dữ liệu và kết thúc quyền giữ sửa. Nếu nội dung thay đổi, hệ thống tạo Generation mới và tăng Version trong Revision hiện tại.":
        "Checkout là quyền giữ sửa. Reference là bản tham khảo. Check-in là thao tác để gửi thay đổi từ Workspace vào hệ thống. Khi Check-in thành công, hệ thống kết thúc Checkout trong phạm vi đã xác nhận. Nếu nội dung thay đổi, hệ thống tạo Generation mới và tăng Version trong Revision hiện tại.",
    "RBAC cấp quyền bằng Role Assignment. Một Role Assignment gắn Principal với một Role Definition tại một Scope. Principal có thể là người dùng hoặc Group. Khi người dùng thao tác, hệ thống tổng hợp các assignment còn hiệu lực rồi kiểm tra thêm điều kiện nghiệp vụ của tài liệu.":
        "RBAC cấp quyền bằng Role Assignment. Mỗi Role Assignment gắn một Security Principal với một Role Definition tại một Authorization Scope. Security Principal có thể là Actor hoặc Business Group. Khi người dùng thao tác, hệ thống tổng hợp các Role Assignment còn hiệu lực rồi kiểm tra thêm Business gate của tài liệu.",
    "Báo cáo đã làm rõ năm nội dung ở mức nghiệp vụ và kiến trúc logic. Hai phần cần review kỹ nhất là cách giữ an toàn công việc khi Checkout, Reference và Check-in; và cách cấp quyền theo Project, Group, Role Definition và Scope.":
        "Báo cáo đã làm rõ năm nội dung ở mức nghiệp vụ và kiến trúc logic. Hai phần cần Review kỹ nhất là cách giữ an toàn công việc khi Checkout, Reference và Check-in; và cách cấp quyền theo Project, Business Group, Role Definition và Authorization Scope.",
    "Hình 10 — Principal cộng Role Definition cộng Scope tạo Role Assignment":
        "Hình 10 — Security Principal cộng Role Definition cộng Authorization Scope tạo Role Assignment",
    "Bảng dưới đây ghi cách hiểu thống nhất trong IDEA DDM. Thuật ngữ tiếng Anh được giữ lại khi đó là tên nghiệp vụ hoặc tên kỹ thuật quen thuộc.":
        "Bảng dưới đây là Glossary dùng chung cho báo cáo và thư viện sơ đồ. Mỗi thuật ngữ có một nghĩa thống nhất trong IDEA DDM. Tên viết ngắn như Principal, Role, Scope, Group và Assignment chỉ được dùng với nghĩa đã chỉ rõ trong bảng này.",
}


SUBSTRING_REPLACEMENTS = [
    ("Bảng 18 — Thuật ngữ dùng trong tài liệu", "Bảng 17 — Thuật ngữ dùng trong tài liệu"),
    ("Bảng 17 — Tiêu chuẩn và mô hình được áp dụng", "Bảng 16 — Tiêu chuẩn và mô hình được áp dụng"),
    ("Principal cộng Role Definition cộng Scope", "Security Principal cộng Role Definition cộng Authorization Scope"),
]


def paragraph_text(paragraph) -> str:
    return "".join(paragraph.xpath(".//w:t/text()", namespaces=NS))


def set_paragraph_text(paragraph, value: str) -> None:
    texts = paragraph.xpath(".//w:t", namespaces=NS)
    if texts:
        texts[0].text = value
        for node in texts[1:]:
            node.text = ""
        return
    run = etree.SubElement(paragraph, f"{{{W}}}r")
    text = etree.SubElement(run, f"{{{W}}}t")
    text.text = value


def set_cell_text(cell, value: str) -> None:
    paragraphs = cell.xpath("./w:p", namespaces=NS)
    if not paragraphs:
        paragraphs = [etree.SubElement(cell, f"{{{W}}}p")]
    first = paragraphs[0]
    ppr = first.find(f"{{{W}}}pPr")
    first_run = first.find(f"{{{W}}}r")
    rpr = copy.deepcopy(first_run.find(f"{{{W}}}rPr")) if first_run is not None and first_run.find(f"{{{W}}}rPr") is not None else None
    for child in list(first):
        if child is not ppr:
            first.remove(child)
    run = etree.SubElement(first, f"{{{W}}}r")
    if rpr is not None:
        run.append(rpr)
    text = etree.SubElement(run, f"{{{W}}}t")
    if value.startswith(" ") or value.endswith(" "):
        text.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    text.text = value
    for extra in paragraphs[1:]:
        cell.remove(extra)


def replace_visible_text(root) -> dict[str, int]:
    counts = {key: 0 for key in FULL_REPLACEMENTS}
    for paragraph in root.xpath("//w:p", namespaces=NS):
        if paragraph.xpath(".//w:instrText|.//w:fldChar", namespaces=NS):
            continue
        current = paragraph_text(paragraph)
        if current in FULL_REPLACEMENTS:
            set_paragraph_text(paragraph, FULL_REPLACEMENTS[current])
            counts[current] += 1
            continue
        revised = current
        for old, new in SUBSTRING_REPLACEMENTS:
            revised = revised.replace(old, new)
        if revised != current:
            set_paragraph_text(paragraph, revised)
    return counts


def replace_glossary(root) -> int:
    target = None
    for table in root.xpath("//w:tbl", namespaces=NS):
        rows = table.xpath("./w:tr", namespaces=NS)
        if not rows:
            continue
        cells = rows[0].xpath("./w:tc", namespaces=NS)
        headings = ["".join(c.xpath(".//w:t/text()", namespaces=NS)).strip() for c in cells]
        if headings[:2] == ["Thuật ngữ", "Cách hiểu trong IDEA DDM"]:
            target = table
            break
    if target is None:
        raise RuntimeError("Không tìm thấy bảng Glossary trong DOCX nguồn")

    rows = target.xpath("./w:tr", namespaces=NS)
    if len(rows) < 2:
        raise RuntimeError("Bảng Glossary không có dòng mẫu")
    templates = [copy.deepcopy(rows[1]), copy.deepcopy(rows[2] if len(rows) > 2 else rows[1])]
    for row in rows[1:]:
        target.remove(row)
    for index, (term, meaning) in enumerate(GLOSSARY):
        row = copy.deepcopy(templates[index % len(templates)])
        cells = row.xpath("./w:tc", namespaces=NS)
        if len(cells) != 2:
            raise RuntimeError("Dòng mẫu Glossary không có đúng hai cột")
        set_cell_text(cells[0], term)
        set_cell_text(cells[1], meaning)
        target.append(row)
    return len(GLOSSARY)


def patch_docx_content(source: Path, output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(source, "r") as zin, zipfile.ZipFile(output, "w") as zout:
        for info in zin.infolist():
            data = zin.read(info.filename)
            if info.filename == "word/document.xml":
                root = etree.fromstring(data)
                counts = replace_visible_text(root)
                missing = [text for text, count in counts.items() if count == 0]
                if missing:
                    raise RuntimeError("Không tìm thấy đoạn cần thay: " + " | ".join(missing))
                replace_glossary(root)
                data = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone="yes")
            elif info.filename == "word/settings.xml":
                root = etree.fromstring(data)
                update = root.find(f"{{{W}}}updateFields")
                if update is None:
                    update = etree.SubElement(root, f"{{{W}}}updateFields")
                update.set(f"{{{W}}}val", "true")
                data = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone="yes")
            zout.writestr(info, data)


def patch_relative_links(docx: Path) -> dict:
    temp = docx.with_suffix(".tmp.docx")
    patched = []
    untouched_absolute = []
    with zipfile.ZipFile(docx, "r") as zin, zipfile.ZipFile(temp, "w") as zout:
        for info in zin.infolist():
            data = zin.read(info.filename)
            if info.filename == "word/_rels/document.xml.rels":
                root = etree.fromstring(data)
                for rel in root.findall(f"{{{PKG_R}}}Relationship"):
                    if not rel.get("Type", "").endswith("/hyperlink"):
                        continue
                    target = rel.get("Target", "")
                    if target.lower().endswith(".svg"):
                        name = Path(target.replace("\\", "/")).name
                        if name in {f"{diagram_id}.svg" for diagram_id, _, _ in DIAGRAMS}:
                            rel.set("Target", f"so-do/{name}")
                            rel.set("TargetMode", "External")
                            patched.append(name)
                    elif target.startswith("file:"):
                        untouched_absolute.append(target)
                data = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone="yes")
            zout.writestr(info, data)
    temp.replace(docx)
    return {
        "patched_links": patched,
        "unique_patched_links": sorted(set(patched)),
        "untouched_absolute_links": untouched_absolute,
    }


def write_gallery() -> None:
    DIAGRAM_DIR.mkdir(parents=True, exist_ok=True)
    cards = []
    for diagram_id, title, description in DIAGRAMS:
        cards.append(
            f'''<article id="{html.escape(diagram_id)}" data-search="{html.escape((diagram_id + ' ' + title + ' ' + description).lower())}">
  <div class="copy"><code>{html.escape(diagram_id)}</code><h2>{html.escape(title)}</h2><p>{html.escape(description)}</p>
  <a class="open" href="{html.escape(diagram_id)}.svg" target="_blank">Mở SVG nguyên bản</a></div>
  <a class="preview" href="{html.escape(diagram_id)}.svg" target="_blank"><img loading="lazy" src="{html.escape(diagram_id)}.svg" alt="{html.escape(title)}"></a>
</article>'''
        )
    page = f'''<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>IDEA DDM - Thư viện sơ đồ</title>
<style>
:root{{--ink:#10233f;--muted:#526171;--line:#d9e1e8;--blue:#1f6fb2;--pale:#eef5fb}}
*{{box-sizing:border-box}}body{{margin:0;font:16px/1.5 Arial,sans-serif;color:var(--ink);background:#f4f6f8}}
header{{position:sticky;top:0;z-index:2;background:#fff;border-bottom:1px solid var(--line);padding:18px 28px}}
header div{{max-width:1500px;margin:auto;display:flex;gap:20px;align-items:center;flex-wrap:wrap}}
h1{{font-size:24px;margin:0}}header p{{margin:0;color:var(--muted);flex:1}}input{{min-width:280px;padding:10px 12px;border:1px solid #aebdca;border-radius:4px;font:inherit}}
main{{max-width:1500px;margin:24px auto;padding:0 24px}}.guide{{background:#fff;border:1px solid var(--line);padding:14px 18px;margin-bottom:18px}}
.guide a,a.open{{color:#155ca0}}article{{display:grid;grid-template-columns:360px minmax(0,1fr);gap:20px;background:#fff;border:1px solid var(--line);margin:0 0 18px;padding:18px;scroll-margin-top:110px}}
article[hidden]{{display:none}}code{{font-weight:700;color:#155ca0}}h2{{font-size:19px;margin:7px 0}}p{{margin:6px 0 12px}}.open{{display:inline-block;font-weight:700}}
.preview{{display:block;min-height:320px;border:1px solid var(--line);background:#fff;overflow:auto}}img{{display:block;width:100%;height:auto}}
@media(max-width:850px){{article{{grid-template-columns:1fr}}header{{position:static}}.preview{{min-height:0}}}}
</style></head><body>
<header><div><h1>IDEA DDM - Thư viện sơ đồ</h1><p>{len(DIAGRAMS)} sơ đồ được liên kết từ báo cáo. Bấm hình hoặc “Mở SVG nguyên bản” để xem ở độ phân giải vector.</p><input id="q" type="search" placeholder="Tìm theo mã hoặc nội dung" aria-label="Tìm sơ đồ"></div></header>
<main><section class="guide"><strong>Cách xem:</strong> Giữ nguyên cấu trúc thư mục của gói. Các thuật ngữ tiếng Anh dùng trong báo cáo và sơ đồ được giải thích tại <a href="../THUAT-NGU.html">Glossary</a>.</section>
{''.join(cards)}</main>
<script>const q=document.querySelector('#q');q.addEventListener('input',()=>{{const v=q.value.trim().toLowerCase();document.querySelectorAll('article').forEach(x=>x.hidden=v&&!x.dataset.search.includes(v))}});</script>
</body></html>'''
    (DIAGRAM_DIR / "index.html").write_text(page, encoding="utf-8")


def write_glossary_html() -> None:
    rows = "".join(
        f"<tr data-search=\"{html.escape((term + ' ' + meaning).lower())}\"><th>{html.escape(term)}</th><td>{html.escape(meaning)}</td></tr>"
        for term, meaning in GLOSSARY
    )
    page = f'''<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IDEA DDM - Glossary</title>
<style>body{{max-width:1200px;margin:24px auto;padding:0 20px;font:16px/1.5 Arial,sans-serif;color:#10233f}}h1{{margin-bottom:4px}}p{{color:#526171}}input{{width:100%;padding:10px;border:1px solid #aebdca;font:inherit;margin:12px 0 18px}}table{{border-collapse:collapse;width:100%}}th,td{{border:1px solid #d9e1e8;padding:9px 11px;vertical-align:top;text-align:left}}thead th{{background:#e7f0f8}}tbody th{{width:240px;background:#f6f8fa}}a{{color:#155ca0}}</style></head><body>
<p><a href="so-do/index.html">Quay lại thư viện sơ đồ</a></p><h1>Glossary IDEA DDM</h1><p>Đây là cùng danh sách thuật ngữ được đưa vào báo cáo Word. Mỗi thuật ngữ chỉ có một nghĩa trong gói tài liệu này.</p><input id="q" type="search" placeholder="Tìm thuật ngữ" aria-label="Tìm thuật ngữ"><table><thead><tr><th>Thuật ngữ</th><th>Cách hiểu trong IDEA DDM</th></tr></thead><tbody>{rows}</tbody></table>
<script>const q=document.querySelector('#q');q.addEventListener('input',()=>{{const v=q.value.trim().toLowerCase();document.querySelectorAll('tbody tr').forEach(x=>x.hidden=v&&!x.dataset.search.includes(v))}});</script></body></html>'''
    (PACKAGE_ROOT / "THUAT-NGU.html").write_text(page, encoding="utf-8")


def write_readme() -> None:
    text = """IDEA DDM - GÓI BÁO CÁO KIẾN TRÚC NGHIỆP VỤ\n\nCÁCH MỞ\n1. Giải nén toàn bộ file ZIP vào một thư mục.\n2. Mở file IDEA-DDM-bao-cao-kien-truc-nghiep-vu-trinh-review-v3.docx.\n3. Trong Word, giữ Ctrl và bấm mã sơ đồ sau dòng \"Mở sơ đồ kỹ thuật chi tiết\".\n4. Nếu Word hỏi xác nhận mở file liên kết, chọn mở. Sơ đồ SVG sẽ hiện trong trình duyệt và có thể phóng to mà không vỡ hình.\n\nXEM TOÀN BỘ SƠ ĐỒ\nMở file so-do\\index.html.\n\nTRA THUẬT NGỮ\nMở file THUAT-NGU.html hoặc xem phần Glossary ở cuối báo cáo Word.\n\nLƯU Ý\nKhông di chuyển riêng file Word ra khỏi thư mục này vì các liên kết dùng đường dẫn tương đối đến thư mục so-do.\n"""
    (PACKAGE_ROOT / "HUONG-DAN.txt").write_text(text, encoding="utf-8-sig", newline="\r\n")


def build() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(SOURCE)
    if PACKAGE_ROOT.exists():
        shutil.rmtree(PACKAGE_ROOT)
    PACKAGE_ROOT.mkdir(parents=True)
    DIAGRAM_DIR.mkdir()
    patch_docx_content(SOURCE, OUTPUT_DOCX)
    for diagram_id, _, _ in DIAGRAMS:
        source = DIAGRAM_SOURCE / f"{diagram_id}.svg"
        if not source.exists():
            raise FileNotFoundError(source)
        shutil.copy2(source, DIAGRAM_DIR / source.name)
    write_gallery()
    write_glossary_html()
    write_readme()
    print(json.dumps({"docx": str(OUTPUT_DOCX), "package_root": str(PACKAGE_ROOT), "glossary_terms": len(GLOSSARY), "diagrams": len(DIAGRAMS)}, ensure_ascii=False))


def validate_and_zip() -> None:
    link_result = patch_relative_links(OUTPUT_DOCX)
    expected = {f"{diagram_id}.svg" for diagram_id, _, _ in DIAGRAMS}
    actual = set(link_result["unique_patched_links"])
    missing_from_doc = sorted(expected - actual)
    missing_files = sorted(name for name in expected if not (DIAGRAM_DIR / name).exists())
    parse_errors = []
    for name in sorted(expected):
        try:
            etree.fromstring((DIAGRAM_DIR / name).read_bytes())
        except Exception as exc:
            parse_errors.append({"file": name, "error": str(exc)})
    if link_result["untouched_absolute_links"] or missing_from_doc or missing_files or parse_errors:
        raise RuntimeError(json.dumps({
            "absolute_links": link_result["untouched_absolute_links"],
            "missing_from_doc": missing_from_doc,
            "missing_files": missing_files,
            "svg_parse_errors": parse_errors,
        }, ensure_ascii=False, indent=2))
    if OUTPUT_ZIP.exists():
        OUTPUT_ZIP.unlink()
    with zipfile.ZipFile(OUTPUT_ZIP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(PACKAGE_ROOT.rglob("*")):
            if path.is_file():
                archive.write(path, Path(PACKAGE_ROOT.name) / path.relative_to(PACKAGE_ROOT))
    result = {
        **link_result,
        "missing_from_doc": missing_from_doc,
        "missing_files": missing_files,
        "svg_parse_errors": parse_errors,
        "zip": str(OUTPUT_ZIP),
        "zip_size": OUTPUT_ZIP.stat().st_size,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["build", "finalize"])
    args = parser.parse_args()
    if args.command == "build":
        build()
    else:
        validate_and_zip()


if __name__ == "__main__":
    main()
