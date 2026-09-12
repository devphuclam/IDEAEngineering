from __future__ import annotations

import argparse
import io
import importlib.util
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"C:\Users\TD-999\Research\Projects\IDEA\IDEAEngineering")
HUMAN = Path(r"C:\Users\TD-999\Research\Projects\IDEA\Human\IDEAEngineering")
BASE_SCRIPT = ROOT / ".tmp" / "build_review_package_v3.py"

spec = importlib.util.spec_from_file_location("review_package_v3", BASE_SCRIPT)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Không thể tải {BASE_SCRIPT}")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)


base.SOURCE = HUMAN / "Packages" / "IDEA-DDM_kientruc" / "IDEA-DDM-Kien truc.docx"
base.PACKAGE_ROOT = HUMAN / "Packages" / "IDEA-DDM_kientruc-v4"
base.OUTPUT_DOCX = base.PACKAGE_ROOT / "IDEA-DDM-Kien-truc-v4.docx"
base.OUTPUT_ZIP = HUMAN / "Packages" / "IDEA-DDM_kientruc-v4.zip"
base.DIAGRAM_SOURCE = (
    ROOT
    / "docs"
    / "product"
    / "instances"
    / "idea-engineering"
    / "evidence"
    / "IE-VEV-ARCH-VIEW-002"
)
base.DIAGRAM_DIR = base.PACKAGE_ROOT / "so-do"


# The current package already includes the management-facing edits from v3. Only make
# corrections that follow from the diagram audit and remove named technology from this
# architecture report. Feature, Spec and business decisions remain unchanged.
base.FULL_REPLACEMENTS = {}
base.SUBSTRING_REPLACEMENTS = [
    ("PostgreSQL", "cơ sở dữ liệu quan hệ"),
]


drop_terms = {"PostgreSQL", "WebView2"}
glossary = [item for item in base.GLOSSARY if item[0] not in drop_terms]
glossary = [
    (
        term,
        "Kho dữ liệu có cấu trúc dùng để lưu Metadata, trạng thái, quan hệ và kết quả giao dịch. Báo cáo này chỉ xác định trách nhiệm của Database, không chọn sản phẩm cụ thể.",
    )
    if term == "Database"
    else (term, definition)
    for term, definition in glossary
]
glossary.extend(
    [
        (
            "Authorization Contribution",
            "Bản ghi nối một Role Assignment đã được xét với một Authorization Decision. Một quyết định có thể dựa trên nhiều Role Assignment; quyết định bị chặn vì không có quyền có thể không có bản ghi đóng góp nào.",
        ),
        (
            "Authorization Scope Hierarchy",
            "Quan hệ cha–con giữa các Authorization Scope. Mỗi Scope không phải gốc có tối đa một Scope cha; một Scope cha có thể có nhiều Scope con.",
        ),
        (
            "Ended",
            "Trạng thái kết thúc bình thường của một Reservation sau Check-in thành công hoặc thao tác hủy được phép. Ended không cấp quyền ghi và không đồng nghĩa với trạng thái sản phẩm Released.",
        ),
        (
            "Governed Resource",
            "Tài nguyên được hệ thống quản lý và kiểm tra quyền, chẳng hạn một Project, tài liệu hoặc cấu trúc sản phẩm.",
        ),
        (
            "Operating Organization",
            "Phạm vi tổ chức cao nhất đang vận hành IDEA DDM và sở hữu tài khoản, Project, Role Definition cùng Authorization Scope.",
        ),
        (
            "Organization Scope",
            "Authorization Scope ở cấp toàn tổ chức. Đây là Scope cha của các Project Scope thuộc tổ chức đó.",
        ),
        (
            "Project Scope",
            "Authorization Scope của một Project. Đây là Scope con của Organization Scope và có thể là Scope cha của các Resource Scope trong Project.",
        ),
        (
            "Resource Scope",
            "Authorization Scope của một tài nguyên cụ thể bên trong Project, dùng khi quyền cần hẹp hơn toàn Project.",
        ),
        (
            "Role Permission",
            "Bản ghi liên kết một Role Definition Version với một Permission trong danh mục dùng chung. Nhờ quan hệ này, một Permission có thể được nhiều Role sử dụng mà không bị sở hữu riêng bởi một Role.",
        ),
        (
            "Scheduled",
            "Trạng thái Role Assignment đã được chấp thuận nhưng chưa đến thời điểm bắt đầu hiệu lực. Assignment ở trạng thái này chưa cấp Permission.",
        ),
    ]
)
base.GLOSSARY = sorted(glossary, key=lambda item: item[0].casefold())


def write_readme() -> None:
    text = """IDEA DDM - GÓI BÁO CÁO KIẾN TRÚC NGHIỆP VỤ - BẢN HIỆU ĐÍNH V4

CÁCH MỞ
1. Giải nén toàn bộ file ZIP vào một thư mục.
2. Mở file IDEA-DDM-Kien-truc-v4.docx.
3. Trong Word, giữ Ctrl và bấm mã sơ đồ sau dòng \"Mở sơ đồ kỹ thuật chi tiết\".
4. Nếu Word hỏi xác nhận mở file liên kết, chọn mở. Sơ đồ SVG sẽ hiện trong trình duyệt và có thể phóng to mà không vỡ hình.

XEM TOÀN BỘ SƠ ĐỒ
Mở file so-do\\index.html.

TRA THUẬT NGỮ
Mở file THUAT-NGU.html hoặc xem phần Glossary ở cuối báo cáo Word.

LƯU Ý
Không di chuyển riêng file Word ra khỏi thư mục này vì các liên kết dùng đường dẫn tương đối đến thư mục so-do.
Bản v4 sửa quan hệ RBAC, Scope, vòng đời Reservation và Role Assignment; không thay đổi Feature hoặc Spec đã chốt.
"""
    (base.PACKAGE_ROOT / "HUONG-DAN.txt").write_text(
        text, encoding="utf-8-sig", newline="\r\n"
    )


base.write_readme = write_readme


def _footer_run(paragraph, text: str | None = None):
    run = base.etree.SubElement(paragraph, f"{{{base.W}}}r")
    properties = base.etree.SubElement(run, f"{{{base.W}}}rPr")
    base.etree.SubElement(properties, f"{{{base.W}}}color").set(
        f"{{{base.W}}}val", "526171"
    )
    base.etree.SubElement(properties, f"{{{base.W}}}sz").set(
        f"{{{base.W}}}val", "17"
    )
    if text is not None:
        node = base.etree.SubElement(run, f"{{{base.W}}}t")
        if text.startswith(" ") or text.endswith(" "):
            node.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
        node.text = text
    return run


def _append_footer_field(paragraph, instruction: str) -> None:
    begin = _footer_run(paragraph)
    base.etree.SubElement(begin, f"{{{base.W}}}fldChar").set(
        f"{{{base.W}}}fldCharType", "begin"
    )
    code = _footer_run(paragraph)
    base.etree.SubElement(code, f"{{{base.W}}}instrText").text = instruction
    separate = _footer_run(paragraph)
    base.etree.SubElement(separate, f"{{{base.W}}}fldChar").set(
        f"{{{base.W}}}fldCharType", "separate"
    )
    _footer_run(paragraph, "1")
    end = _footer_run(paragraph)
    base.etree.SubElement(end, f"{{{base.W}}}fldChar").set(
        f"{{{base.W}}}fldCharType", "end"
    )


def _make_standard_footer(payload: bytes) -> bytes:
    root = base.etree.fromstring(payload)
    for child in list(root):
        root.remove(child)
    paragraph = base.etree.SubElement(root, f"{{{base.W}}}p")
    properties = base.etree.SubElement(paragraph, f"{{{base.W}}}pPr")
    # A single right-aligned counter is robust on TOC/TOF pages and ordinary
    # body pages alike.  Static text before the fields was intermittently
    # clipped by Word's PDF export on a list-of-figures page.
    base.etree.SubElement(properties, f"{{{base.W}}}jc").set(
        f"{{{base.W}}}val", "right"
    )
    _append_footer_field(paragraph, "PAGE")
    _footer_run(paragraph, " / ")
    _append_footer_field(paragraph, "NUMPAGES")
    return base.etree.tostring(
        root, xml_declaration=True, encoding="UTF-8", standalone="yes"
    )


def patch_management_container_figure() -> None:
    """Remove a product label from Figure 2 and stabilize the recurring footer."""
    source = base.OUTPUT_DOCX
    temporary = source.with_suffix(".figure.tmp.docx")
    with zipfile.ZipFile(source, "r") as incoming, zipfile.ZipFile(
        temporary, "w"
    ) as outgoing:
        for info in incoming.infolist():
            payload = incoming.read(info.filename)
            if info.filename == "word/media/image3.png":
                image = Image.open(io.BytesIO(payload)).convert("RGB")
                draw = ImageDraw.Draw(image)
                fill = (232, 245, 238)
                draw.rectangle((1516, 225, 1904, 383), fill=fill)
                bold = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 35)
                regular = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 25)

                def centered(text: str, y: int, font: ImageFont.FreeTypeFont) -> None:
                    box = draw.textbbox((0, 0), text, font=font)
                    x = 1710 - (box[2] - box[0]) / 2
                    draw.text((x, y), text, font=font, fill=(16, 35, 63))

                centered("Cơ sở dữ liệu", 247, bold)
                centered("Metadata, trạng thái, quyền", 296, regular)
                centered("và giao dịch", 329, regular)
                output = io.BytesIO()
                image.save(output, format="PNG", optimize=True)
                payload = output.getvalue()
            elif info.filename == "word/media/image15.png":
                # Figure 14 is a logical deployment view.  Keep it technology
                # neutral, consistently with the report's stated purpose.
                image = Image.open(io.BytesIO(payload)).convert("RGB")
                draw = ImageDraw.Draw(image)
                draw.rectangle((705, 330, 1295, 405), fill=(234, 243, 250))
                regular = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 27)

                def centered_service(text: str, y: int) -> None:
                    box = draw.textbbox((0, 0), text, font=regular)
                    x = 1000 - (box[2] - box[0]) / 2
                    draw.text((x, y), text, font=regular, fill=(74, 91, 115))

                centered_service("IDEA Server; cơ sở dữ liệu; kho file;", 335)
                centered_service("bộ xử lý định dạng có giới hạn.", 368)
                output = io.BytesIO()
                image.save(output, format="PNG", optimize=True)
                payload = output.getvalue()
            elif info.filename == "word/document.xml":
                root = base.etree.fromstring(payload)
                for doc_properties in root.xpath(
                    "//*[local-name()='docPr' and @name='Picture 1']"
                ):
                    doc_properties.set("descr", "Logo công ty IDEA")
                    doc_properties.set("title", "Logo IDEA")
                payload = base.etree.tostring(
                    root,
                    xml_declaration=True,
                    encoding="UTF-8",
                    standalone="yes",
                )
            elif info.filename == "word/footer3.xml":
                payload = _make_standard_footer(payload)
            outgoing.writestr(info, payload)
    temporary.replace(source)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["build", "finalize"])
    args = parser.parse_args()
    if args.command == "build":
        base.build()
        patch_management_container_figure()
    else:
        base.validate_and_zip()


if __name__ == "__main__":
    main()
