from __future__ import annotations

import math
from pathlib import Path
from typing import Iterable, Sequence

from PIL import Image, ImageDraw, ImageFont
from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING, WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from docx.shared import Cm, Inches, Mm, Pt, RGBColor


ROOT = Path(r"C:\Users\TD-999\Research\Projects\IDEA\IDEAEngineering")
HUMAN = Path(r"C:\Users\TD-999\Research\Projects\IDEA\Human\IDEAEngineering")
REFERENCE = HUMAN / "IDEA_DDM_review.docx"
OUTPUT = HUMAN / "IDEA-DDM-bao-cao-kien-truc-trinh-review.docx"
LOGO = ROOT / "logo-idea.png"
WORK = ROOT / ".tmp-artifact" / "architecture-report"
FIG_DIR = WORK / "figures"

EVIDENCE = ROOT / "docs" / "product" / "instances" / "idea-engineering" / "evidence" / "IE-VEV-ARCH-VIEW-002"
GALLERY = EVIDENCE / "index.html"
DOC03 = ROOT / "docs" / "product" / "instances" / "idea-engineering" / "DOC-03-business-requirements.md"
DOC04 = ROOT / "docs" / "product" / "instances" / "idea-engineering" / "DOC-04-software-requirements-specification.md"
DOC05 = ROOT / "docs" / "product" / "instances" / "idea-engineering" / "DOC-05-architecture-description.md"
DOC06 = ROOT / "docs" / "product" / "instances" / "idea-engineering" / "DOC-06-data-integration-and-migration-specification.md"

NAVY = "0F2747"
BLUE = "1F6FB2"
LIGHT_BLUE = "EAF3FA"
PALE_BLUE = "F5F9FC"
GREEN = "2E7D5B"
LIGHT_GREEN = "E8F5EE"
AMBER = "A96C12"
LIGHT_AMBER = "FFF4DB"
RED = "A43B3B"
LIGHT_RED = "FCECEC"
GRAY = "526171"
LIGHT_GRAY = "E2E8F0"
VERY_LIGHT_GRAY = "F6F8FA"
BLACK = "152238"
WHITE = "FFFFFF"


def rgb(hex_value: str) -> RGBColor:
    return RGBColor.from_string(hex_value)


def set_cell_shading(cell, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=80, start=100, bottom=80, end=100) -> None:
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for m, v in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{m}"))
        if node is None:
            node = OxmlElement(f"w:{m}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(v))
        node.set(qn("w:type"), "dxa")


def set_table_borders(table, color=LIGHT_GRAY, size=6) -> None:
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.find(qn("w:tblBorders"))
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = borders.find(qn(f"w:{edge}"))
        if tag is None:
            tag = OxmlElement(f"w:{edge}")
            borders.append(tag)
        tag.set(qn("w:val"), "single")
        tag.set(qn("w:sz"), str(size))
        tag.set(qn("w:space"), "0")
        tag.set(qn("w:color"), color)


def remove_table_borders(table) -> None:
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.find(qn("w:tblBorders"))
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = OxmlElement(f"w:{edge}")
        tag.set(qn("w:val"), "nil")
        borders.append(tag)


def set_repeat_table_header(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def prevent_row_split(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    cant_split = OxmlElement("w:cantSplit")
    tr_pr.append(cant_split)


def set_paragraph_text_style(paragraph, size=11.5, color=BLACK, bold=False, italic=False) -> None:
    for run in paragraph.runs:
        run.font.name = "Calibri"
        run._element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
        run.font.size = Pt(size)
        run.font.color.rgb = rgb(color)
        run.bold = bold
        run.italic = italic


def add_hyperlink(paragraph, text: str, target: str, color=BLUE, underline=True):
    part = paragraph.part
    rel_id = part.relate_to(target, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", is_external=True)
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), rel_id)
    new_run = OxmlElement("w:r")
    r_pr = OxmlElement("w:rPr")
    r_fonts = OxmlElement("w:rFonts")
    r_fonts.set(qn("w:ascii"), "Calibri")
    r_fonts.set(qn("w:hAnsi"), "Calibri")
    r_fonts.set(qn("w:eastAsia"), "Calibri")
    r_pr.append(r_fonts)
    c = OxmlElement("w:color")
    c.set(qn("w:val"), color)
    r_pr.append(c)
    if underline:
        u = OxmlElement("w:u")
        u.set(qn("w:val"), "single")
        r_pr.append(u)
    new_run.append(r_pr)
    t = OxmlElement("w:t")
    t.text = text
    new_run.append(t)
    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)
    return hyperlink


def add_field(paragraph, instruction: str, placeholder: str = "") -> None:
    begin_run = paragraph.add_run()
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    begin.set(qn("w:dirty"), "true")
    begin_run._r.append(begin)

    instr_run = paragraph.add_run()
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = instruction
    instr_run._r.append(instr)

    sep_run = paragraph.add_run()
    sep = OxmlElement("w:fldChar")
    sep.set(qn("w:fldCharType"), "separate")
    sep_run._r.append(sep)
    if placeholder:
        ph = paragraph.add_run(placeholder)
        ph.font.color.rgb = rgb(GRAY)

    end_run = paragraph.add_run()
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    end_run._r.append(end)


def add_page_number_line(paragraph, left_text: str) -> None:
    paragraph.paragraph_format.tab_stops.add_tab_stop(Cm(17.1), WD_TAB_ALIGNMENT.RIGHT)
    paragraph.add_run(left_text)
    paragraph.add_run("\tTrang ")
    add_field(paragraph, "PAGE", "1")
    paragraph.add_run(" / ")
    add_field(paragraph, "NUMPAGES", "1")


def add_page_number_only(paragraph) -> None:
    paragraph.add_run("Trang ")
    add_field(paragraph, "PAGE", "1")
    paragraph.add_run(" / ")
    add_field(paragraph, "NUMPAGES", "1")


def set_keep(paragraph, keep_next=False, keep_lines=True) -> None:
    paragraph.paragraph_format.keep_with_next = keep_next
    paragraph.paragraph_format.keep_together = keep_lines


def set_doc_defaults(doc: Document) -> None:
    section = doc.sections[0]
    set_section_layout(section)

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    normal.font.size = Pt(11.5)
    normal.font.color.rgb = rgb(BLACK)
    normal.paragraph_format.space_after = Pt(5)
    normal.paragraph_format.line_spacing = 1.08
    normal.paragraph_format.widow_control = True

    title = doc.styles["Title"]
    title.font.name = "Calibri"
    title._element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    title.font.size = Pt(28)
    title.font.bold = True
    title.font.color.rgb = rgb(NAVY)
    title.paragraph_format.space_after = Pt(10)

    for name, size, before, after in (
        ("Heading 1", 16, 10, 7),
        ("Heading 2", 13, 8, 5),
        ("Heading 3", 11.5, 6, 3),
    ):
        st = doc.styles[name]
        st.font.name = "Calibri"
        st._element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
        st.font.size = Pt(size)
        st.font.bold = True
        st.font.color.rgb = rgb(NAVY)
        st.paragraph_format.space_before = Pt(before)
        st.paragraph_format.space_after = Pt(after)
        st.paragraph_format.keep_with_next = True
        st.paragraph_format.keep_together = True

    for custom, size, color, align in (
        ("Figure Caption", 9.5, GRAY, WD_ALIGN_PARAGRAPH.CENTER),
        ("Table Caption", 9.5, GRAY, WD_ALIGN_PARAGRAPH.LEFT),
    ):
        if custom not in [s.name for s in doc.styles]:
            st = doc.styles.add_style(custom, WD_STYLE_TYPE.PARAGRAPH)
        else:
            st = doc.styles[custom]
        st.font.name = "Calibri"
        st._element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
        st.font.size = Pt(size)
        st.font.color.rgb = rgb(color)
        st.font.italic = False
        st.paragraph_format.alignment = align
        st.paragraph_format.space_before = Pt(3)
        st.paragraph_format.space_after = Pt(5)
        st.paragraph_format.keep_with_next = True if custom == "Table Caption" else False
        st.paragraph_format.keep_together = True

    if "Small Note" not in [s.name for s in doc.styles]:
        note = doc.styles.add_style("Small Note", WD_STYLE_TYPE.PARAGRAPH)
    else:
        note = doc.styles["Small Note"]
    note.font.name = "Calibri"
    note._element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    note.font.size = Pt(9.5)
    note.font.color.rgb = rgb(GRAY)
    note.paragraph_format.space_after = Pt(4)
    note.paragraph_format.keep_together = True

    doc.core_properties.title = "Báo cáo kiến trúc đề xuất IDEA DDM — Core v0"
    doc.core_properties.subject = "Tài liệu trình review về phạm vi, kiến trúc, luồng tài liệu, RBAC và vận hành"
    doc.core_properties.author = "Nguyễn Huỳnh Phúc Lâm"
    doc.core_properties.keywords = "IDEA DDM, architecture, Checkout, Check-in, Review, Release, RBAC, PostgreSQL"
    doc.core_properties.comments = "Dự thảo trình review; không phải bằng chứng triển khai production."


def set_section_layout(section) -> None:
    section.page_width = Mm(210)
    section.page_height = Mm(297)
    section.left_margin = Mm(12.7)
    section.right_margin = Mm(12.7)
    section.top_margin = Mm(16.5)
    section.bottom_margin = Mm(15)
    section.header_distance = Mm(6.5)
    section.footer_distance = Mm(6.5)
    section.different_first_page_header_footer = False


def clear_body(doc: Document) -> None:
    body = doc._element.body
    for child in list(body):
        if child.tag != qn("w:sectPr"):
            body.remove(child)


def clear_header_footer_part(part) -> None:
    for p in list(part.paragraphs):
        p._element.getparent().remove(p._element)


def configure_cover_header_footer(section) -> None:
    section.header.is_linked_to_previous = False
    section.footer.is_linked_to_previous = False
    clear_header_footer_part(section.header)
    clear_header_footer_part(section.footer)
    section.header.add_paragraph()
    section.footer.add_paragraph()
    table = section.footer.add_table(rows=1, cols=2, width=Cm(18.0))
    remove_table_borders(table)
    left, right = table.rows[0].cells
    left.width = Cm(9.0)
    right.width = Cm(9.0)
    lp = left.paragraphs[0]
    lp.add_run("Tài liệu nội bộ")
    rp = right.paragraphs[0]
    rp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    add_page_number_only(rp)
    set_paragraph_text_style(lp, size=8.5, color=GRAY)
    set_paragraph_text_style(rp, size=8.5, color=GRAY)


def configure_body_header_footer(section) -> None:
    section.header.is_linked_to_previous = False
    section.footer.is_linked_to_previous = False
    clear_header_footer_part(section.header)
    clear_header_footer_part(section.footer)
    for header in (section.first_page_header,):
        for p in header.paragraphs:
            p._element.getparent().remove(p._element)

    section.header.add_paragraph()
    htable = section.header.add_table(rows=1, cols=2, width=Cm(18.0))
    remove_table_borders(htable)
    hleft, hright = htable.rows[0].cells
    hleft.width = Cm(9.0)
    hright.width = Cm(9.0)
    hp = hleft.paragraphs[0]
    r = hp.add_run("IDEA DDM")
    r.bold = True
    r.font.color.rgb = rgb(NAVY)
    hp2 = hright.paragraphs[0]
    hp2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    hp2.add_run("Báo cáo kiến trúc")
    set_paragraph_text_style(hp, size=9, color=GRAY)
    set_paragraph_text_style(hp2, size=9, color=GRAY)

    section.footer.add_paragraph()
    ftable = section.footer.add_table(rows=1, cols=2, width=Cm(18.0))
    remove_table_borders(ftable)
    fleft, fright = ftable.rows[0].cells
    fleft.width = Cm(9.0)
    fright.width = Cm(9.0)
    fp = fleft.paragraphs[0]
    fp.add_run("Báo cáo kiến trúc IDEA DDM")
    fp2 = fright.paragraphs[0]
    fp2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    add_page_number_only(fp2)
    set_paragraph_text_style(fp, size=8.5, color=GRAY)
    set_paragraph_text_style(fp2, size=8.5, color=GRAY)


def add_table_caption(doc: Document, number: int, title: str):
    p = doc.add_paragraph(style="Table Caption")
    p.add_run(f"Bảng {number} — {title}")
    return p


def add_figure_caption(doc: Document, number: int, title: str):
    p = doc.add_paragraph(style="Figure Caption")
    p.add_run(f"Hình {number} — {title}")
    return p


def add_source_link(doc: Document, label: str, path: Path, extra: str | None = None) -> None:
    p = doc.add_paragraph(style="Small Note")
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run("Sơ đồ kỹ thuật chi tiết: ")
    add_hyperlink(p, label, path.resolve().as_uri())
    if extra:
        p.add_run("; ")
        add_hyperlink(p, "mở sơ đồ phục hồi", Path(extra).resolve().as_uri())


def add_body_paragraph(doc: Document, text: str, bold_prefix: str | None = None):
    p = doc.add_paragraph()
    if bold_prefix and text.startswith(bold_prefix):
        r = p.add_run(bold_prefix)
        r.bold = True
        p.add_run(text[len(bold_prefix):])
    else:
        p.add_run(text)
    return p


def add_bullets(doc: Document, items: Sequence[str]) -> None:
    for item in items:
        p = doc.add_paragraph(style="List Bullet")
        p.add_run(item)
        p.paragraph_format.space_after = Pt(3)


def add_numbered(doc: Document, items: Sequence[str]) -> None:
    for item in items:
        p = doc.add_paragraph(style="List Number")
        p.add_run(item)
        p.paragraph_format.space_after = Pt(3)


def add_table(doc: Document, headers: Sequence[str], rows: Sequence[Sequence[str]], widths: Sequence[float] | None = None, font_size=9.6):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_borders(table)
    hdr = table.rows[0]
    set_repeat_table_header(hdr)
    prevent_row_split(hdr)
    for i, value in enumerate(headers):
        cell = hdr.cells[i]
        set_cell_shading(cell, LIGHT_BLUE)
        set_cell_margins(cell)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r = p.add_run(value)
        r.bold = True
        r.font.color.rgb = rgb(NAVY)
        r.font.size = Pt(font_size)
    for row_index, values in enumerate(rows, 1):
        row = table.add_row()
        prevent_row_split(row)
        for i, value in enumerate(values):
            cell = row.cells[i]
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
            if row_index % 2 == 0:
                set_cell_shading(cell, VERY_LIGHT_GRAY)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.02
            r = p.add_run(str(value))
            r.font.size = Pt(font_size)
            r.font.color.rgb = rgb(BLACK)
    if widths:
        for row in table.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Cm(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(0)
    return table


def set_run_font(run, size=11.5, color=BLACK, bold=False, italic=False):
    run.font.name = "Calibri"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    run.font.size = Pt(size)
    run.font.color.rgb = rgb(color)
    run.bold = bold
    run.italic = italic


# ---------- Figure rendering ----------

FONT_REG = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def font(size: int, bold=False):
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT_REG), size=size)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, fnt, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = word if not current else current + " " + word
        if draw.textbbox((0, 0), trial, font=fnt)[2] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def box(draw, xy, title: str, subtitle: str = "", fill="#FFFFFF", outline="#1F6FB2", title_fill=None, radius=18, title_size=34, body_size=27):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=4)
    pad = 20
    y = y1 + pad
    if title_fill:
        draw.rounded_rectangle((x1+2, y1+2, x2-2, y1+64), radius=radius-2, fill=title_fill)
        y = y1 + 16
    tf = font(title_size, True)
    bf = font(body_size, False)
    lines = wrap_text(draw, title, tf, x2-x1-2*pad)
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=tf)
        draw.text(((x1+x2-(bbox[2]-bbox[0]))/2, y), line, font=tf, fill="#0F2747")
        y += title_size + 7
    if subtitle:
        y += 4
        for line in wrap_text(draw, subtitle, bf, x2-x1-2*pad):
            bbox = draw.textbbox((0, 0), line, font=bf)
            draw.text(((x1+x2-(bbox[2]-bbox[0]))/2, y), line, font=bf, fill="#3E536A")
            y += body_size + 7


def arrow(draw, start, end, color="#526171", width=5, head=17, label: str | None = None, label_y_offset=-35):
    x1, y1 = start
    x2, y2 = end
    draw.line((x1, y1, x2, y2), fill=color, width=width)
    angle = math.atan2(y2-y1, x2-x1)
    a1 = angle + math.pi * 0.85
    a2 = angle - math.pi * 0.85
    p1 = (x2 + head*math.cos(a1), y2 + head*math.sin(a1))
    p2 = (x2 + head*math.cos(a2), y2 + head*math.sin(a2))
    draw.polygon([(x2, y2), p1, p2], fill=color)
    if label:
        lf = font(24, False)
        midx, midy = (x1+x2)/2, (y1+y2)/2 + label_y_offset
        bbox = draw.textbbox((0, 0), label, font=lf)
        pad = 7
        draw.rounded_rectangle((midx-(bbox[2]-bbox[0])/2-pad, midy-pad, midx+(bbox[2]-bbox[0])/2+pad, midy+(bbox[3]-bbox[1])+pad), radius=7, fill="#FFFFFF")
        draw.text((midx-(bbox[2]-bbox[0])/2, midy), label, font=lf, fill=color)


def diagram_base(title: str, subtitle: str):
    img = Image.new("RGB", (2000, 1120), "white")
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((20, 20, 1980, 1100), radius=24, fill="#FFFFFF", outline="#D6E0EA", width=3)
    d.text((70, 55), title, font=font(44, True), fill="#0F2747")
    d.text((72, 115), subtitle, font=font(27), fill="#526171")
    d.line((70, 165, 1930, 165), fill="#D6E0EA", width=3)
    return img, d


def save_figure(img: Image.Image, name: str) -> Path:
    path = FIG_DIR / name
    img.save(path, format="PNG", dpi=(180, 180), optimize=True)
    return path


def make_figures() -> dict[str, Path]:
    FIG_DIR.mkdir(parents=True, exist_ok=True)
    figs: dict[str, Path] = {}

    # Figure 1: context and users
    img, d = diagram_base("IDEA DDM phục vụ ai và giải quyết việc gì?", "Một nơi quản lý tài liệu kỹ thuật từ lúc làm việc đến khi phát hành")
    actors = [
        ("Kỹ sư / người soạn", "Tìm tài liệu, Checkout, sửa, Check-in"),
        ("Người xét duyệt", "Xem đúng bản, duyệt hoặc trả lại"),
        ("Người phát hành", "Xác nhận đúng phạm vi hồ sơ"),
        ("Quản trị / tra cứu", "Cấp quyền, cấu hình, xem lịch sử"),
    ]
    ys = [225, 420, 615, 810]
    for (t, s), y in zip(actors, ys):
        box(d, (70, y, 560, y+145), t, s, fill="#F5F9FC", outline="#7AA8CC", title_size=29, body_size=23)
        arrow(d, (560, y+72), (775, 555), color="#7A8B9B", width=4)
    box(d, (775, 350, 1270, 760), "IDEA DDM", "Kiểm soát danh tính tài liệu, bản nội dung, cấu trúc sản phẩm, quyền, xét duyệt và lịch sử", fill="#EAF3FA", outline="#1F6FB2", title_fill="#D8EBF8", title_size=45, body_size=30)
    outcomes = [
        ("Đúng tài liệu", "Biết ai đang sửa và bản nào đang dùng"),
        ("Đúng bộ hồ sơ", "Phát hành theo phạm vi đã xác nhận"),
        ("Lấy lại được", "Khôi phục đúng bộ đã phát hành trước đây"),
    ]
    y2s = [280, 515, 750]
    for (t, s), y in zip(outcomes, y2s):
        arrow(d, (1270, 555), (1450, y+75), color="#2E7D5B", width=4)
        box(d, (1450, y, 1925, y+150), t, s, fill="#E8F5EE", outline="#2E7D5B", title_size=30, body_size=23)
    d.text((790, 995), "Office và CAD vẫn là công cụ soạn thảo; IDEA DDM quản lý trước và sau khi sửa file.", font=font(25, True), fill="#0F2747")
    figs["context"] = save_figure(img, "figure-01-context.png")

    # Figure 2: logical blocks
    img, d = diagram_base("Các khối chính và ranh giới trách nhiệm", "Giao diện nhận thao tác; Server mới là nơi quyết định và ghi nhận dữ liệu chính thức")
    box(d, (60, 220, 520, 410), "Web", "Tìm kiếm, xem, review, quản trị", fill="#F5F9FC", outline="#1F6FB2", title_size=34, body_size=25)
    box(d, (60, 500, 520, 735), "Desktop", "Vỏ Windows + giao diện React; làm việc với Workspace", fill="#F5F9FC", outline="#1F6FB2", title_size=34, body_size=25)
    box(d, (60, 820, 520, 1010), "Office / CAD", "Ứng dụng bên ngoài; sửa file đã Save trên máy", fill="#F6F8FA", outline="#7A8B9B", title_size=32, body_size=24)
    box(d, (650, 330, 1210, 790), "IDEA Server", "Xác thực, RBAC, quy tắc nghiệp vụ, Check-in, workflow, Release và Audit", fill="#EAF3FA", outline="#1F6FB2", title_fill="#D8EBF8", title_size=42, body_size=29)
    box(d, (1350, 205, 1915, 395), "PostgreSQL", "Metadata, trạng thái, quyền và lịch sử giao dịch", fill="#E8F5EE", outline="#2E7D5B", title_size=33, body_size=24)
    box(d, (1350, 465, 1915, 655), "Kho file riêng", "Nội dung bất biến, nhận diện bằng digest", fill="#E8F5EE", outline="#2E7D5B", title_size=33, body_size=24)
    box(d, (1350, 725, 1915, 960), "Bộ xử lý định dạng", "Job tách biệt để xem trước/chuyển đổi; không được sửa nguồn", fill="#FFF4DB", outline="#A96C12", title_size=32, body_size=24)
    arrow(d, (520, 315), (650, 450), label="HTTPS")
    arrow(d, (520, 610), (650, 610), label="HTTPS")
    arrow(d, (290, 820), (290, 735), label="file cục bộ", label_y_offset=-12)
    arrow(d, (1210, 440), (1350, 300), label="giao dịch")
    arrow(d, (1210, 555), (1350, 555), label="nội dung")
    arrow(d, (1210, 690), (1350, 825), label="job có giới hạn")
    figs["blocks"] = save_figure(img, "figure-02-blocks.png")

    # Figure 3: lifecycle
    img, d = diagram_base("Luồng tài liệu từ sửa đến phát hành", "Mỗi bước có điều kiện rõ ràng; không bước nào tự động bỏ qua quyền hoặc trạng thái")
    steps = [
        ("1. Checkout", "Giữ quyền sửa cho tài liệu đã chọn", "#EAF3FA", "#1F6FB2"),
        ("2. Sửa và Save", "File nằm trong Workspace trên máy", "#F5F9FC", "#7AA8CC"),
        ("3. Check-in", "Kiểm tra phạm vi; ghi cùng thành công hoặc cùng không", "#EAF3FA", "#1F6FB2"),
        ("4. Review", "Gửi đúng Generation; duyệt hoặc trả lại", "#FFF4DB", "#A96C12"),
        ("5. Release", "Xác nhận đúng phạm vi và tạo hồ sơ bất biến", "#E8F5EE", "#2E7D5B"),
    ]
    xs = [55, 425, 795, 1165, 1535]
    for i, ((t, s, fill, outline), x) in enumerate(zip(steps, xs)):
        box(d, (x, 300, x+320, 545), t, s, fill=fill, outline=outline, title_size=30, body_size=23)
        if i < len(steps)-1:
            arrow(d, (x+320, 422), (xs[i+1], 422), color="#526171", width=5)
    box(d, (120, 700, 690, 940), "Reference", "Lấy đúng bản để tham khảo; nếu có sửa thì không được Check-in vào tài liệu gốc", fill="#F6F8FA", outline="#7A8B9B", title_size=32, body_size=25)
    arrow(d, (280, 700), (215, 545), color="#7A8B9B", width=4, label="nhánh tham khảo", label_y_offset=12)
    box(d, (790, 680, 1450, 965), "Nếu Check-in gặp bản cũ hoặc lỗi", "Không ghi đè, không tự gộp CAD/Office, không xóa bản làm việc. Người dùng lấy bản mới rồi áp dụng lại thay đổi hoặc chọn cách xử lý được phép.", fill="#FCECEC", outline="#A43B3B", title_size=31, body_size=24)
    arrow(d, (955, 680), (955, 545), color="#A43B3B", width=4)
    box(d, (1515, 705, 1925, 940), "Quy tắc sau Check-in", "Thành công hoặc No Change đều kết thúc Checkout trong phạm vi đã xác nhận.", fill="#E8F5EE", outline="#2E7D5B", title_size=29, body_size=23)
    figs["lifecycle"] = save_figure(img, "figure-03-lifecycle.png")

    # Figure 4: RBAC
    img, d = diagram_base("RBAC: quyền được tạo ra và kiểm tra như thế nào?", "Đăng nhập chỉ xác định người dùng; quyền làm việc được cấp bằng vai trò tại một phạm vi cụ thể")
    box(d, (55, 250, 390, 455), "Principal", "Người dùng hoặc Group", fill="#F5F9FC", outline="#1F6FB2", title_size=31, body_size=25)
    box(d, (430, 250, 765, 455), "Role Definition", "Tập Permission được phép", fill="#F5F9FC", outline="#1F6FB2", title_size=30, body_size=24)
    box(d, (805, 250, 1140, 455), "Scope", "Công ty, Project hoặc tài liệu", fill="#F5F9FC", outline="#1F6FB2", title_size=31, body_size=24)
    d.text((389, 515), "+", font=font(52, True), fill="#526171")
    d.text((765, 515), "+", font=font(52, True), fill="#526171")
    arrow(d, (600, 465), (600, 620), color="#526171", width=5)
    box(d, (330, 620, 885, 830), "Role Assignment", "Gắn đúng Principal + Role + Scope, có trạng thái và lịch sử", fill="#EAF3FA", outline="#1F6FB2", title_size=34, body_size=25)
    arrow(d, (885, 725), (1160, 725), color="#526171", width=5)
    box(d, (1160, 600, 1510, 850), "Effective Permission", "Quyền có hiệu lực ở thời điểm yêu cầu", fill="#FFF4DB", outline="#A96C12", title_size=30, body_size=24)
    arrow(d, (1510, 725), (1640, 725), color="#526171", width=5)
    box(d, (1640, 570, 1935, 880), "Kết quả", "Cho phép chỉ khi RBAC và điều kiện nghiệp vụ cùng đạt", fill="#E8F5EE", outline="#2E7D5B", title_size=32, body_size=24)
    d.text((1225, 260), "Ví dụ", font=font(30, True), fill="#0F2747")
    d.text((1225, 315), "Linh Nguyễn", font=font(26), fill="#3E536A")
    d.text((1225, 360), "+ Design Engineer", font=font(26), fill="#3E536A")
    d.text((1225, 405), "+ Project P-100", font=font(26), fill="#3E536A")
    d.text((1225, 455), "→ được Checkout nếu tài liệu vẫn cho phép sửa", font=font(25, True), fill="#2E7D5B")
    d.text((70, 990), "Quản trị tài khoản, quản trị Project, quản trị Role và quản trị cấu hình là các trách nhiệm tách biệt; quyền quản trị không tự cho phép duyệt hoặc Release tài liệu.", font=font(24, True), fill="#0F2747")
    figs["rbac"] = save_figure(img, "figure-04-rbac.png")

    # Figure 5: deployment, backup, security, scale
    img, d = diagram_base("Triển khai ban đầu và đường mở rộng", "Một điểm vận hành gọn cho Core v0, nhưng backup phải ở miền sự cố độc lập")
    box(d, (60, 260, 480, 555), "Máy kỹ sư Windows", "Web / Desktop / Workspace / Office-CAD", fill="#F5F9FC", outline="#1F6FB2", title_size=32, body_size=25)
    box(d, (650, 235, 1250, 650), "Server/VM do công ty quản lý", "IDEA Server\nPostgreSQL\nKho file riêng\nOutbox và job nền", fill="#EAF3FA", outline="#1F6FB2", title_fill="#D8EBF8", title_size=35, body_size=28)
    box(d, (1425, 250, 1925, 535), "Format worker", "Tiến trình hoặc máy Windows riêng khi công cụ CAD yêu cầu", fill="#FFF4DB", outline="#A96C12", title_size=31, body_size=24)
    box(d, (650, 790, 1250, 1020), "Vùng backup độc lập", "Database + file + cấu hình + khóa cần thiết, cùng một recovery set", fill="#E8F5EE", outline="#2E7D5B", title_size=32, body_size=24)
    arrow(d, (480, 405), (650, 405), color="#526171", width=5, label="HTTPS")
    arrow(d, (1250, 430), (1425, 430), color="#526171", width=5, label="job giới hạn")
    arrow(d, (950, 650), (950, 790), color="#2E7D5B", width=6, label="backup phối hợp", label_y_offset=-20)
    d.text((80, 690), "Bảo mật chính", font=font(29, True), fill="#0F2747")
    for i, line in enumerate(["• Không cho client truy cập DB/kho file trực tiếp", "• Quyền tối thiểu, HTTPS, Audit", "• Kiểm tra lại quyền trước khi ghi"]):
        d.text((80, 740+i*48), line, font=font(24), fill="#3E536A")
    d.text((1400, 690), "Mở rộng khi có số đo", font=font(29, True), fill="#0F2747")
    for i, line in enumerate(["• Tách DB, kho file hoặc worker", "• Thêm object storage/multi-volume", "• Tăng song song job và host"]):
        d.text((1400, 740+i*48), line, font=font(24), fill="#3E536A")
    figs["deployment"] = save_figure(img, "figure-05-deployment.png")

    return figs


FIGURE_ALT = {
    "figure-01-context.png": "Sơ đồ cho thấy kỹ sư, người xét duyệt, người phát hành và quản trị viên làm việc với IDEA DDM để quản lý đúng tài liệu, đúng bộ hồ sơ và lấy lại đúng bản đã phát hành.",
    "figure-02-blocks.png": "Sơ đồ sáu khối chính: Web, Desktop và Office CAD phía người dùng; IDEA Server ở trung tâm; PostgreSQL, kho file riêng và bộ xử lý định dạng phía server.",
    "figure-03-lifecycle.png": "Sơ đồ luồng Checkout, sửa và Save, Check-in, Review, Release; có nhánh Reference, xử lý bản cũ và quy tắc kết thúc Checkout.",
    "figure-04-rbac.png": "Sơ đồ RBAC trong đó Principal, Role Definition và Scope tạo Role Assignment; Effective Permission được kiểm tra cùng điều kiện nghiệp vụ trước khi cho phép hành động.",
    "figure-05-deployment.png": "Sơ đồ triển khai ban đầu gồm máy kỹ sư Windows, một Server hoặc máy ảo công ty, format worker và vùng backup độc lập; có đường mở rộng khi có số đo.",
}


def set_inline_alt(inline, title: str, description: str) -> None:
    doc_pr = inline._inline.docPr
    doc_pr.set("name", title)
    doc_pr.set("title", title)
    doc_pr.set("descr", description)


def add_figure(doc: Document, path: Path, width_cm=18.0):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.keep_together = True
    run = p.add_run()
    inline = run.add_picture(str(path), width=Cm(width_cm))
    set_inline_alt(inline, path.stem, FIGURE_ALT.get(path.name, path.stem))
    return p


def add_status_note(doc: Document, title: str, text: str, tone="blue") -> None:
    colors = {
        "blue": (LIGHT_BLUE, BLUE),
        "green": (LIGHT_GREEN, GREEN),
        "amber": (LIGHT_AMBER, AMBER),
        "red": (LIGHT_RED, RED),
    }
    fill, border = colors[tone]
    p = doc.add_paragraph()
    p_pr = p._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    p_pr.append(shd)
    p_bdr = OxmlElement("w:pBdr")
    for edge in ("top", "left", "bottom", "right"):
        side = OxmlElement(f"w:{edge}")
        side.set(qn("w:val"), "single")
        side.set(qn("w:sz"), "10")
        side.set(qn("w:space"), "5")
        side.set(qn("w:color"), border)
        p_bdr.append(side)
    p_pr.append(p_bdr)
    p.paragraph_format.left_indent = Mm(2.5)
    p.paragraph_format.right_indent = Mm(2.5)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(7)
    p.paragraph_format.keep_together = True
    r = p.add_run(title + ". ")
    r.bold = True
    r.font.color.rgb = rgb(NAVY)
    p.add_run(text)


def build_document(figs: dict[str, Path]) -> None:
    if not REFERENCE.exists():
        raise FileNotFoundError(REFERENCE)
    if not LOGO.exists():
        raise FileNotFoundError(LOGO)
    HUMAN.mkdir(parents=True, exist_ok=True)
    # The project logo currently contains WebP bytes despite its .png suffix.
    # Word and python-docx require the embedded stream to match a supported format.
    logo_embed = WORK / "logo-idea-embed.png"
    with Image.open(LOGO) as logo_image:
        logo_image.save(logo_embed, format="PNG", optimize=True)

    doc = Document(str(REFERENCE))
    clear_body(doc)
    set_doc_defaults(doc)
    configure_cover_header_footer(doc.sections[0])

    # Cover
    cover = doc.add_table(rows=1, cols=2)
    cover.alignment = WD_TABLE_ALIGNMENT.CENTER
    cover.autofit = False
    cover.columns[0].width = Cm(12.5)
    cover.columns[1].width = Cm(5.0)
    remove_table_borders(cover)
    left, right = cover.rows[0].cells
    left.width = Cm(12.5)
    right.width = Cm(5.0)
    for label, value in (
        ("Người phụ trách", "Nguyễn Huỳnh Phúc Lâm"),
        ("Phòng ban", "Phòng Phát triển sản phẩm nội bộ"),
        ("Ngày soạn", "11/09/2026"),
        ("Trạng thái", "Dự thảo trình review kiến trúc và công nghệ"),
    ):
        p = left.add_paragraph() if left.paragraphs[0].text else left.paragraphs[0]
        r = p.add_run(f"{label}: ")
        r.bold = True
        p.add_run(value)
        p.paragraph_format.space_after = Pt(3)
        set_paragraph_text_style(p, size=10.5, color=BLACK)
    rp = right.paragraphs[0]
    rp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    logo_inline = rp.add_run().add_picture(str(logo_embed), width=Cm(3.2))
    set_inline_alt(logo_inline, "Logo IDEA", "Logo nhận diện thương hiệu IDEA với dòng chữ Innovation for a better life.")

    for _ in range(5):
        doc.add_paragraph().paragraph_format.space_after = Pt(7)
    p = doc.add_paragraph(style="Title")
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run("BÁO CÁO KIẾN TRÚC ĐỀ XUẤT\nIDEA DDM — CORE v0")
    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p2.add_run("Phạm vi sử dụng, khối hệ thống, vòng đời tài liệu, RBAC và phương án vận hành")
    set_run_font(r, size=14, color=GRAY)
    p2.paragraph_format.space_before = Pt(5)
    p3 = doc.add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p3.add_run("Tài liệu trình Product Decision Authority review")
    set_run_font(r, size=11, color=BLUE, bold=True)
    p3.paragraph_format.space_before = Pt(24)
    for _ in range(5):
        doc.add_paragraph()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("TÀI LIỆU NỘI BỘ")
    set_run_font(r, size=9.5, color=GRAY, bold=True)
    body_section = doc.add_section(WD_SECTION.NEW_PAGE)
    set_section_layout(body_section)
    configure_body_header_footer(body_section)

    # Document control and review purpose
    doc.add_heading("Kiểm soát tài liệu", level=1)
    add_body_paragraph(doc, "Báo cáo này diễn giải kiến trúc Core v0 để người nắm nghiệp vụ có thể xem xét mà không cần đọc toàn bộ hồ sơ kỹ thuật. Nội dung bám theo các nguồn kiểm soát hiện hành; không thay thế Feature, Spec hoặc hồ sơ kiến trúc chi tiết.")
    add_table_caption(doc, 1, "Thông tin kiểm soát báo cáo")
    add_table(doc,
              ["Thông tin", "Giá trị"],
              [
                  ("Mã tài liệu", "IE-MGMT-ARCH-REPORT-001"),
                  ("Phiên bản", "0.1 — Dự thảo trình review"),
                  ("Phạm vi", "IDEA DDM Core v0"),
                  ("Nguồn nghiệp vụ", "DOC-03@0.7 và DOC-04@0.13"),
                  ("Nguồn kiến trúc", "DOC-05@0.13 và DOC-06@0.13"),
                  ("Tình trạng", "Kiến trúc logic đã có bản dự thảo; công nghệ và cấu hình production chưa được duyệt; kiểm thử runtime chưa thực hiện."),
                  ("Người lập / self-review", "Nguyễn Huỳnh Phúc Lâm"),
                  ("Người duyệt", "Product Decision Authority — chưa ghi nhận quyết định"),
              ], widths=[4.2, 13.7], font_size=10)

    doc.add_heading("Nội dung đề nghị review", level=2)
    add_table_caption(doc, 2, "Năm nội dung cần xem xét")
    add_table(doc,
              ["Phần", "Câu hỏi cần trả lời", "Kết quả mong muốn"],
              [
                  ("I", "Phần mềm giải quyết công việc gì và ai sử dụng?", "Xác nhận đúng vấn đề, đúng người dùng và đúng ranh giới sản phẩm."),
                  ("II", "Sáu khối chính có phân chia trách nhiệm hợp lý không?", "Xác nhận Web, Desktop, Server, PostgreSQL, kho file và bộ xử lý định dạng không chồng chéo thẩm quyền."),
                  ("III", "Luồng Checkout → Check-in → Review → Release có đúng nghiệp vụ không?", "Xác nhận các điều kiện cho phép, từ chối và bảo toàn dữ liệu."),
                  ("IV", "RBAC và việc tách trách nhiệm quản trị có phù hợp không?", "Xác nhận cách cấp quyền theo vai trò và phạm vi, không đồng nhất quản trị tài khoản với quyền tài liệu."),
                  ("V", "Phương án triển khai, backup, bảo mật và mở rộng có đủ an toàn để tiếp tục thiết kế chi tiết không?", "Cho phép tiếp tục bước chọn công nghệ, qualification và kế hoạch triển khai; chưa phải phê duyệt production."),
              ], widths=[1.2, 7.9, 8.8], font_size=9.7)
    add_status_note(doc, "Kết luận ở thời điểm lập báo cáo", "Thiết kế đã đủ để review kiến trúc ở mức logic. Chưa đủ cơ sở để tuyên bố hệ thống đã vận hành, đạt hiệu năng, đạt RTO/RPO hoặc an toàn production.", "amber")
    doc.add_page_break()

    # TOC
    doc.add_heading("Mục lục", level=1)
    p = doc.add_paragraph()
    add_field(p, 'TOC \\o "1-3" \\h \\z \\u', "Mục lục được cập nhật khi mở tài liệu trong Microsoft Word.")
    doc.add_page_break()

    doc.add_heading("Danh mục hình", level=1)
    p = doc.add_paragraph()
    add_field(p, 'TOC \\h \\z \\t "Figure Caption,1"', "Danh mục hình được cập nhật khi mở tài liệu trong Microsoft Word.")
    doc.add_heading("Danh mục bảng", level=1)
    p = doc.add_paragraph()
    add_field(p, 'TOC \\h \\z \\t "Table Caption,1"', "Danh mục bảng được cập nhật khi mở tài liệu trong Microsoft Word.")
    doc.add_page_break()

    # Part I
    doc.add_heading("Phần I. Phần mềm giải quyết công việc gì và ai sử dụng", level=1)
    add_status_note(doc, "Nói ngắn gọn", "IDEA DDM là phần mềm nội bộ dùng để quản lý tài liệu và dữ liệu thiết kế có kiểm soát: biết tài liệu nào đang được sửa, ai được sửa, bản nào đã được review và bộ hồ sơ nào đã được Release.", "blue")
    add_body_paragraph(doc, "Kỹ sư vẫn soạn thảo bằng Office hoặc CAD như hiện nay. IDEA DDM không thay thế các công cụ đó; phần mềm quản lý danh tính tài liệu, bản nội dung, quan hệ sản phẩm, quyền, quyết định review và hồ sơ Release trước và sau khi file được sửa.")
    add_figure(doc, figs["context"])
    add_figure_caption(doc, 1, "Người sử dụng và giá trị công việc của IDEA DDM")
    add_source_link(doc, "ARCH-VIEW-CTX-001", EVIDENCE / "ARCH-VIEW-CTX-001.svg")

    doc.add_heading("1.1 Người sử dụng", level=2)
    add_table_caption(doc, 3, "Người sử dụng và trách nhiệm chính")
    add_table(doc,
              ["Người sử dụng", "Công việc trong IDEA DDM", "Điều không được hiểu nhầm"],
              [
                  ("Kỹ sư / người soạn", "Đưa tài liệu vào, tìm tài liệu, Checkout, sửa bằng Office/CAD, Check-in và gửi review.", "Quyền sửa một tài liệu không tự mở rộng sang cả cây sản phẩm."),
                  ("Người review / approver", "Xem đúng Generation được gửi; phê duyệt hoặc trả lại kèm lý do.", "Không review một bản có thể âm thầm đổi nội dung sau đó."),
                  ("Người có quyền Release", "Xem và xác nhận đúng phạm vi; hệ thống kiểm tra lại đủ điều kiện trước khi ghi nhận Release.", "Không phát hành ngầm toàn bộ cây hoặc phần ngoài phạm vi đã xác nhận."),
                  ("Quản trị tài khoản", "Cấp, khóa và hỗ trợ khôi phục tài khoản IDEA.", "Không vì quản trị tài khoản mà tự có quyền xem, sửa, duyệt hoặc Release tài liệu."),
                  ("Quản trị Project / Role / cấu hình", "Quản lý thành viên Project, Group, Role Assignment, workflow, loại tài liệu và format profile theo quyền được giao.", "Mỗi trách nhiệm là một Role Assignment có Scope; không phải một cấp bậc quản trị chung."),
                  ("Người tra cứu / Audit", "Mở bản được phép sử dụng, xem lịch sử và bằng chứng.", "Chỉ thấy dữ liệu trong phạm vi được cấp; Audit không phải quyền sửa lịch sử."),
              ], widths=[3.2, 8.2, 6.5], font_size=9.5)

    doc.add_heading("1.2 Công việc hoàn chỉnh mà Core v0 phải làm được", level=2)
    add_numbered(doc, [
        "Đưa tài liệu hiện có vào hệ thống hoặc tạo tài liệu mới với một mã ổn định.",
        "Lấy đúng file về Workspace dưới dạng Checkout để sửa hoặc Reference để tham khảo.",
        "Check-in thay đổi một cách có kiểm soát; không để lại kết quả thành công một phần.",
        "Gửi đúng bản để review; ghi nhận người, thời điểm, phạm vi và lý do quyết định.",
        "Release đúng bộ hồ sơ đã xác nhận và lấy lại nguyên bộ đó về sau, kể cả khi tài liệu hiện tại đã có bản mới hơn.",
    ])
    add_body_paragraph(doc, "Ví dụ P-100: cụm bơm có thể hoàn tất review và Release trước; tủ điện và hồ sơ toàn máy vẫn tiếp tục ở trạng thái In Work. IDEA DDM không ép cả cây phải chuyển trạng thái cùng lúc, nhưng mỗi lần Release phải chỉ rõ đúng phạm vi và các phụ thuộc bắt buộc.")
    add_status_note(doc, "Ngoài phạm vi Core v0", "Không thay thế Office/CAD; chưa làm tích hợp ERP/MRP tổng quát, đồng bộ nhiều địa điểm, trình thiết kế workflow kéo-thả đầy đủ hoặc tích hợp sâu mọi định dạng CAD ngay từ đầu.", "amber")

    # Part II
    doc.add_heading("Phần II. Các khối chính của hệ thống", level=1)
    add_body_paragraph(doc, "Kiến trúc tách nơi người dùng thao tác khỏi nơi ra quyết định. Web và Desktop chỉ gửi yêu cầu và hiển thị kết quả; IDEA Server kiểm tra tài khoản, RBAC, trạng thái nghiệp vụ và ghi dữ liệu chính thức. PostgreSQL và kho file không được mở trực tiếp cho máy người dùng.")
    add_figure(doc, figs["blocks"])
    add_figure_caption(doc, 2, "Sáu khối chính và ranh giới thẩm quyền")
    add_source_link(doc, "ARCH-VIEW-CON-001", EVIDENCE / "ARCH-VIEW-CON-001.svg")

    doc.add_page_break()
    doc.add_heading("2.1 Trách nhiệm từng khối", level=2)
    add_table_caption(doc, 4, "Trách nhiệm và giới hạn của các khối chính")
    add_table(doc,
              ["Khối", "Làm gì", "Không được làm gì"],
              [
                  ("Web", "Tìm kiếm, xem dữ liệu, review, Release và các màn hình quản trị được cấp quyền.", "Không tự quyết quyền, không ghi thẳng vào database hoặc kho file."),
                  ("Desktop", "Cung cấp điểm vào trên Windows; tiếp nhận thao tác Checkout/Open/Check-in; kết nối giao diện với Workspace cục bộ.", "Không tự công bố file khi người dùng chỉ bấm Save trong CAD/Office."),
                  ("IDEA Server", "Xác thực yêu cầu; kiểm tra RBAC và điều kiện nghiệp vụ; điều phối Check-in, workflow, Release, Audit và giao dịch dữ liệu.", "Không giao thẩm quyền quyết định cho client, database script hoặc format worker."),
                  ("PostgreSQL", "Lưu metadata, trạng thái, quan hệ, phiên bản policy, quyền, workflow, Release Record và Audit theo giao dịch.", "Không phải nơi lưu file làm việc của người dùng; client không kết nối trực tiếp."),
                  ("Kho file riêng", "Lưu nội dung bất biến theo digest; trả nội dung qua yêu cầu đã được Server kiểm tra.", "Không phải ổ dùng chung để người dùng tự sửa; không tự quyết file nào là bản chính thức."),
                  ("Bộ xử lý định dạng", "Chạy job có giới hạn để đọc thuộc tính, tạo preview/PDF/neutral representation bằng adapter hoặc công cụ đã được kiểm chứng.", "Không sửa file nguồn, không được cấp quyền ghi trạng thái sản phẩm, không được coi mọi CAD là hỗ trợ sâu."),
              ], widths=[3.0, 8.0, 6.9], font_size=9.35)

    doc.add_heading("2.2 Web và Desktop không phải hai sản phẩm tách rời", level=2)
    add_body_paragraph(doc, "Giao diện nghiệp vụ được đề xuất xây bằng React + TypeScript để dùng thống nhất. Trình duyệt mở phần Web trực tiếp. Ứng dụng Windows dùng một vỏ Desktop để thực hiện những việc trình duyệt không nên làm, như quản lý Workspace, mở file bằng ứng dụng cài trên máy và bảo vệ giao tiếp cục bộ. Hai bề mặt gọi cùng IDEA Server và tuân theo cùng một quyền, cùng một quy tắc.")

    doc.add_heading("2.3 Công nghệ đang đề xuất, chưa phải quyết định đã duyệt", level=2)
    add_table_caption(doc, 5, "Phương án công nghệ hiện tại và điểm cần xác nhận")
    add_table(doc,
              ["Hạng mục", "Phương án đề xuất", "Lý do chính", "Trạng thái"],
              [
                  ("Server", "C# / .NET 10, ASP.NET Core, modular monolith", "Một hệ thống triển khai gọn; chia module rõ để giữ quyền sở hữu dữ liệu và quy tắc.", "Chờ duyệt Tech"),
                  ("Web", "React + TypeScript", "Phù hợp giao diện bảng/cây; có thể dùng lại phần giao diện trong Desktop.", "Chờ duyệt Tech"),
                  ("Desktop Windows", "WPF/.NET 10 + WebView2", "Vỏ Windows quản lý Workspace và tích hợp hệ điều hành; React hiển thị phần giao diện dùng chung.", "Cần qualification"),
                  ("Database", "PostgreSQL 18", "Phù hợp dữ liệu quan hệ và giao dịch; không có phí license database.", "Chờ duyệt Tech và vận hành"),
                  ("Kho file", "Filesystem adapter riêng, nội dung bất biến", "Giảm một dịch vụ phải vận hành ở Core v0; vẫn giữ đường chuyển sang object storage/multi-volume.", "Cần test dung lượng và phục hồi"),
                  ("Format processing", "Runner tách biệt, adapter theo định dạng", "Cô lập file/công cụ rủi ro; thêm từng format mà không đổi quy tắc lõi.", "Cần xác định công cụ và license"),
              ], widths=[2.4, 4.5, 7.0, 4.0], font_size=9.0)
    add_status_note(doc, "Ranh giới không được đổi", "Dù chọn .NET hay Java, PostgreSQL hay SQL Server, kiến trúc vẫn phải giữ một nơi có thẩm quyền cho dữ liệu, giao dịch Check-in nhất quán, kho file riêng, format worker bị giới hạn và cùng một mô hình RBAC trên mọi bề mặt.", "blue")

    # Part III
    doc.add_heading("Phần III. Luồng tài liệu hoàn chỉnh", level=1)
    add_body_paragraph(doc, "Luồng chính không chỉ là chuỗi nút bấm. Mỗi bước xác định rõ ai được làm, bản nào đang được xử lý, dữ liệu nào được ghi nhận và việc gì xảy ra nếu lỗi.")
    add_figure(doc, figs["lifecycle"])
    add_figure_caption(doc, 3, "Checkout → Check-in → Review → Release và các nhánh an toàn")
    add_source_link(doc, "ARCH-VIEW-ACT-002", EVIDENCE / "ARCH-VIEW-ACT-002.svg")

    doc.add_heading("3.1 Ý nghĩa từng thao tác", level=2)
    add_table_caption(doc, 6, "Thao tác, kết quả thành công và cách xử lý khi không đạt")
    add_table(doc,
              ["Thao tác", "Định nghĩa dùng trong IDEA DDM", "Khi thành công", "Khi không đạt"],
              [
                  ("Checkout", "Giữ quyền sửa một tài liệu cụ thể cho đúng người và đúng Workspace.", "File được lấy về đúng Generation; người dùng biết phạm vi nào có quyền Check-in.", "Không lấy quyền sửa nếu tài liệu đã được người/Workspace khác Checkout hoặc trạng thái không cho phép."),
                  ("Reference", "Lấy một Generation để tham khảo, không có quyền công bố vào tài liệu gốc.", "File mở bình thường và luôn được nhận diện là Reference.", "Nếu người dùng sửa file Reference, hệ thống giữ bản cục bộ và hướng dẫn Checkout hợp lệ, Save As hoặc bỏ thay đổi sau xác nhận."),
                  ("Check-in", "So sánh bản làm việc, yêu cầu xác nhận phạm vi và ghi nhận thay đổi vào hệ thống.", "Changed: tạo đúng một Generation và tăng Version. No Change: không tăng Version. Cả hai đều kết thúc Checkout trong phạm vi đã xác nhận.", "Không ghi kết quả một phần; không xóa/ghi đè bản cục bộ; giữ nguyên Checkout còn hợp lệ nếu giao dịch chưa commit."),
                  ("Review", "Gửi một Generation và phạm vi cụ thể để người đủ điều kiện xem xét.", "Quyết định gắn với đúng bản, đúng policy, người và thời điểm.", "Bản thay đổi sau khi gửi không kế thừa quyết định cũ; thiếu approver hoặc quy tắc thì dừng."),
                  ("Release", "Xác nhận một bộ tài liệu/cấu trúc đã đủ điều kiện để sử dụng chính thức.", "Tạo Release Record và package bất biến, pin đúng Generation, Structure Snapshot, BOM và bằng chứng.", "Thiếu quyền, thiếu phụ thuộc, hết hiệu lực hoặc phạm vi thay đổi thì từ chối toàn bộ lần xác nhận."),
              ], widths=[2.1, 5.0, 5.4, 5.4], font_size=8.9)

    doc.add_heading("3.2 Ba quy tắc bảo vệ công việc của kỹ sư", level=2)
    add_bullets(doc, [
        "Check-in là thao tác chủ động. Bấm Save trong Office/CAD chỉ lưu vào Workspace trên máy, chưa tạo bản chính thức trong hệ thống.",
        "Khi bản làm việc đã cũ, IDEA DDM không tự ghi đè và không tự merge file CAD/Office. Bản cục bộ phải còn để người dùng lấy bản mới rồi áp dụng lại thay đổi hoặc chọn cách xử lý được phép.",
        "Check-in nhiều tài liệu có một kết quả nghiệp vụ all-or-none: hoặc toàn bộ phạm vi hợp lệ được công bố, hoặc không có Generation mới nào xuất hiện công khai.",
    ])

    doc.add_heading("3.3 Review và Release không đồng nghĩa", level=2)
    add_body_paragraph(doc, "Review/Approve ghi nhận rằng đúng bản đã được xem xét theo policy. Release là quyết định sử dụng chính thức cho một phạm vi đã xác nhận và phải kiểm tra lại quyền, trạng thái, phụ thuộc và bằng chứng ngay tại thời điểm commit. Vì vậy một tài liệu ở Under Review chưa được Release; chỉ sau khi có quyết định hợp lệ và điều kiện Release đạt thì thao tác Release mới được phép.")
    add_status_note(doc, "Ví dụ theo cấu trúc P-100", "Cụm bơm có thể Release trước nếu phạm vi của nó đủ điều kiện. Tủ điện và hồ sơ toàn máy tiếp tục In Work. Release không tự kéo các phần chưa chọn sang Released, và hồ sơ cũ vẫn lấy lại đúng các Generation đã pin.", "green")

    # Part IV
    doc.add_heading("Phần IV. RBAC và trách nhiệm quản trị", level=1)
    add_body_paragraph(doc, "RBAC trả lời câu hỏi ai được thử thực hiện hành động nào, trên phạm vi nào. Sau đó module sở hữu tài liệu vẫn phải kiểm tra trạng thái nghiệp vụ. Ví dụ, Linh có Permission Checkout trong Project P-100 nhưng vẫn không Checkout được một Revision đã Released hoặc đang được Workspace khác giữ hợp lệ.")
    add_figure(doc, figs["rbac"])
    add_figure_caption(doc, 4, "Mô hình Principal + Role Definition + Scope = Role Assignment")
    add_source_link(doc, "ARCH-VIEW-RBAC-001", EVIDENCE / "ARCH-VIEW-RBAC-001.svg")

    doc.add_heading("4.1 Các khái niệm cốt lõi", level=2)
    add_table_caption(doc, 7, "Các thành phần của RBAC")
    add_table(doc,
              ["Khái niệm", "Hiểu đơn giản", "Ví dụ P-100"],
              [
                  ("Security Principal", "Đối tượng nhận quyền: một người dùng hoặc một Group.", "Linh Nguyễn hoặc Group Cơ khí P-100."),
                  ("Role Definition", "Bộ Permission được định nghĩa và có phiên bản.", "Design Engineer có quyền xem, Checkout, Check-in theo policy."),
                  ("Permission", "Một hành động mà sản phẩm hiểu và kiểm tra được.", "Document.Checkout, Document.CheckIn, Review.Decide."),
                  ("Authorization Scope", "Phạm vi mà Role có hiệu lực.", "Toàn công ty, Project P-100 hoặc một tài liệu cụ thể."),
                  ("Role Assignment", "Bản ghi gắn Principal với đúng Role và Scope; có người gán, lý do, trạng thái và thời hạn nếu có.", "Group Cơ khí P-100 nhận Role Design Engineer tại Project P-100."),
                  ("Effective Permission", "Kết quả quyền tại thời điểm yêu cầu, tổng hợp từ assignment trực tiếp và Group hợp lệ.", "Linh được phép thử Checkout nhờ thành viên Group; bỏ khỏi Group thì quyền hết ở yêu cầu bảo vệ tiếp theo."),
                  ("Business gate", "Điều kiện nghiệp vụ vẫn phải đạt sau khi RBAC cho phép.", "Tài liệu đúng trạng thái, Checkout đúng chủ/Workspace và đúng expected Generation."),
              ], widths=[3.3, 8.0, 6.6], font_size=9.25)

    doc.add_heading("4.2 Tách trách nhiệm quản trị", level=2)
    add_table_caption(doc, 8, "Vai trò quản trị được đề xuất")
    add_table(doc,
              ["Role quản trị", "Được làm", "Không tự được làm"],
              [
                  ("Account Administrator", "Tạo, kích hoạt, khóa, khôi phục tài khoản và Login Identity.", "Không thêm người vào Project/Group; không tự xem, sửa, duyệt hoặc Release tài liệu."),
                  ("Project Administrator", "Quản lý Project Membership, Group và assignment được phép trong Project được giao.", "Không quản trị tài khoản; không gán role ngoài danh mục hoặc Scope của mình."),
                  ("Privileged Role Administrator", "Quản lý Role Definition tùy chỉnh và Role Assignment quản trị trong giới hạn được giao.", "Không tự mở rộng quyền; không gán Super Administrator; không bỏ đường phục hồi cuối cùng."),
                  ("Product Configuration Administrator", "Quản lý loại tài liệu, metadata, đánh số, workflow và format profile có phiên bản.", "Không cấp tài khoản, Project access, quyền duyệt hay Release theo mặc định."),
                  ("Audit Reader", "Đọc Audit trong Scope được cấp.", "Không sửa hoặc xóa Audit Evidence."),
                  ("Super Administrator", "Bootstrap và phục hồi quyền quản trị cao nhất khi cần.", "Không dùng như tài khoản làm việc hằng ngày; không tự đồng nghĩa với quyền nội dung."),
              ], widths=[3.8, 7.2, 6.9], font_size=9.25)
    add_body_paragraph(doc, "Cách cấp quyền thông thường: Quản trị tài khoản tạo tài khoản cho Linh → Project Administrator thêm Linh vào Project P-100 và Group Cơ khí P-100 → Group có Role Assignment Design Engineer tại Scope P-100 → hệ thống tính Effective Permission khi Linh thao tác. Gán trực tiếp cho một người vẫn được hỗ trợ như ngoại lệ và phải nhìn thấy trong Audit.")
    add_status_note(doc, "Điểm còn phải chốt", "Danh mục Permission chi tiết cho từng Role, giới hạn được ủy quyền, thời hạn assignment và người giữ vai trò production phải được review riêng. Kiến trúc đã chừa đúng chỗ cho các quyết định này; chưa được phép tự suy ra từ tên tài khoản hoặc giao diện.", "amber")

    # Part V
    doc.add_heading("Phần V. Triển khai, backup, bảo mật và khả năng mở rộng", level=1)
    add_body_paragraph(doc, "Phương án ban đầu ưu tiên số thành phần vận hành vừa sức một người phát triển và một địa điểm sử dụng. Tuy nhiên, kiến trúc phải tránh khóa chặt vào một máy hoặc một loại kho file, vì tài liệu có thể đạt nhiều GB và tổng dữ liệu Project về sau có thể lên tới hàng trăm TB.")
    add_figure(doc, figs["deployment"])
    add_figure_caption(doc, 5, "Mô hình triển khai ban đầu, backup độc lập và đường mở rộng")
    add_source_link(doc, "ARCH-VIEW-DEP-001", EVIDENCE / "ARCH-VIEW-DEP-001.svg", str(EVIDENCE / "ARCH-VIEW-SEQ-011.svg"))

    doc.add_heading("5.1 Phương án triển khai ban đầu", level=2)
    add_table_caption(doc, 9, "Mô hình triển khai ứng viên")
    add_table(doc,
              ["Vùng", "Thành phần", "Nguyên tắc vận hành"],
              [
                  ("Máy kỹ sư Windows", "Trình duyệt, IDEA Desktop, Workspace, Office/CAD.", "Không có credential database/kho file; file làm việc nằm trong phạm vi Workspace của người dùng."),
                  ("Server/VM công ty", "IDEA Server, PostgreSQL, kho file riêng và job nền; tách process identity và quyền file.", "Ứng viên ban đầu, không phải kết quả sizing. Một server vẫn là một điểm dừng dịch vụ."),
                  ("Format worker", "Runner bị giới hạn; có thể cùng host hoặc một máy Windows riêng nếu công cụ CAD/license yêu cầu.", "Chỉ đọc input bất biến và trả kết quả; không có credential ghi product state."),
                  ("Vùng backup độc lập", "Database backup/WAL, Artifact, cấu hình/policy và key cần thiết.", "Không dùng thư mục thứ hai hoặc snapshot cùng máy làm bằng chứng chống mất server."),
              ], widths=[3.4, 7.1, 7.4], font_size=9.45)

    doc.add_heading("5.2 Backup và phục hồi", level=2)
    add_table_caption(doc, 10, "Bộ dữ liệu phải được backup và cách xác nhận phục hồi")
    add_table(doc,
              ["Nội dung", "Cách đề xuất", "Điều kiện được coi là phục hồi đạt"],
              [
                  ("PostgreSQL", "Base backup kết hợp lưu WAL liên tục để có khả năng point-in-time recovery.", "Khôi phục được đúng điểm đã chọn; theo dõi cả lỗi hoặc độ trễ WAL, không chỉ trạng thái job."),
                  ("Kho file", "Sao lưu nội dung bất biến theo batch/liên tục kèm manifest và digest.", "Mọi Generation trong phạm vi phục hồi đều tìm thấy file và kiểm tra digest khớp."),
                  ("Cấu hình, policy và key", "Pin đúng phiên bản cấu hình/quyền/workflow và vật liệu khóa cần thiết trong cùng recovery set.", "Không có trường hợp database phục hồi nhưng không đọc được file hoặc dùng sai policy/key."),
                  ("Phiên đăng nhập", "Vô hiệu hóa session được khôi phục; đối soát thay đổi tài khoản/quyền sau điểm phục hồi.", "Không làm sống lại quyền đã bị thu hồi chỉ vì database quay về bản cũ."),
                  ("Drill phục hồi", "Phục hồi vào môi trường cô lập, mở đúng file, đăng nhập, kiểm tra Release và đối soát toàn bộ digest.", "Thiếu hoặc sai một thành phần thì kết quả là FAIL, dù hoàn thành trong thời gian mục tiêu."),
              ], widths=[3.0, 7.4, 7.5], font_size=9.25)
    add_status_note(doc, "Mục tiêu lập kế hoạch", "RTO không quá 4 giờ làm việc và RPO không quá 1 giờ là mục tiêu sơ bộ để thiết kế và thử nghiệm. Đây chưa phải SLA đã đạt; phải định nghĩa cách đo, tập dữ liệu phục hồi, người trực và tiêu chí dịch vụ khỏe trước khi cam kết.", "amber")

    doc.add_heading("5.3 Bảo mật theo ranh giới", level=2)
    add_table_caption(doc, 11, "Các kiểm soát bảo mật chính")
    add_table(doc,
              ["Ranh giới / rủi ro", "Kiểm soát kiến trúc", "Bằng chứng cần có trước production"],
              [
                  ("Web/Desktop → Server", "HTTPS; session được bảo vệ; chống CSRF cho Web; kiểm tra schema; đánh giá lại tài khoản, RBAC và business gate trước commit.", "Ma trận cho phép/từ chối qua Web, Desktop và API; thử session cũ, replay và yêu cầu sai Scope."),
                  ("Client → database/kho file", "Không cấp kết nối trực tiếp hoặc credential lâu dài; mọi truy cập đi qua Server và transfer có Scope/thời hạn.", "Thử truy cập trực tiếp bị từ chối; credential không xuất hiện trong client/log/source."),
                  ("Server → format worker", "Input bất biến; giới hạn CPU/RAM/thời gian/kích thước; worker không có quyền ghi product state.", "File lỗi/quá lớn/treo không đổi nguồn; kết quả được xác minh trước khi gắn vào Generation."),
                  ("Quản trị và Audit", "Role Assignment có Scope; kiểm tra chống tự nâng quyền; Audit append-only cho thao tác bảo vệ.", "Thử vượt Scope, tự gán quyền, xóa Audit và bỏ Super Administrator cuối cùng đều bị từ chối."),
                  ("Runtime → backup", "Quyền backup tách khỏi quyền runtime; key/secret không để trong mã nguồn; restore vào vùng cô lập.", "Restore drill hoàn chỉnh và biên bản ai có quyền truy cập backup/key."),
              ], widths=[3.6, 8.2, 6.1], font_size=9.1)

    doc.add_heading("5.4 Khả năng mở rộng", level=2)
    add_table_caption(doc, 12, "Đường mở rộng và điều kiện kích hoạt")
    add_table(doc,
              ["Nhu cầu", "Thiết kế đã chuẩn bị", "Chỉ mở rộng khi"],
              [
                  ("50–100 người dùng tại một địa điểm", "Modular monolith và một Server/VM giúp vận hành gọn; job nền/outbox tách xử lý dài khỏi giao dịch người dùng.", "Có số đo người dùng đồng thời, độ trễ, lỗi, lock và tài nguyên thay vì suy từ tổng số tài khoản."),
                  ("File nhiều GB", "Transfer theo chunk, kiểm tra digest, resume có OperationId; không buộc toàn bộ file nằm trong RAM.", "Có fixture đại diện, ngưỡng timeout/memory và kiểm thử gián đoạn."),
                  ("Project hàng trăm TB", "Logical Document/Generation không chứa đường dẫn vật lý; kho file nằm sau storage adapter và location record.", "Filesystem/một volume không còn đáp ứng dung lượng, thông lượng, phục hồi hoặc vận hành; khi đó thêm multi-volume/object storage."),
                  ("Nhiều worker hoặc host", "Format job không sở hữu product state; có thể tăng worker mà không đổi mô hình tài liệu.", "Queue lag, nhu cầu cô lập/license hoặc tải cho thấy lợi ích đủ bù chi phí vận hành."),
                  ("Tách service", "Các module có ranh giới và interface rõ trong monolith.", "Số đo tải, nhu cầu cách ly hoặc đội vận hành độc lập chứng minh cần tách; không tách chỉ vì hệ thống dự kiến lớn."),
              ], widths=[3.6, 8.2, 6.1], font_size=9.1)

    # Decision summary
    doc.add_heading("Kết luận và nội dung cần quyết định", level=1)
    add_body_paragraph(doc, "Bản thiết kế hiện tại giải thích được ranh giới sản phẩm, trách nhiệm của sáu khối, vòng đời tài liệu, mô hình RBAC và hướng vận hành. Vì vậy có thể dùng để review kiến trúc logic. Bước tiếp theo chỉ nên bắt đầu khi các điểm dưới đây được ghi nhận rõ.")
    add_table_caption(doc, 13, "Kết luận theo năm nội dung review")
    add_table(doc,
              ["Nội dung", "Kết luận đề xuất", "Quyết định / đầu vào cần có"],
              [
                  ("1. Công việc và người dùng", "Giữ phạm vi sản phẩm nội bộ quản lý tài liệu/cấu trúc kỹ thuật từ làm việc đến Release.", "Sếp xác nhận đúng vấn đề và nhóm người dùng; chỉ ra nghiệp vụ còn thiếu nếu có."),
                  ("2. Các khối chính", "Giữ Web/Desktop là bề mặt; Server là authority; PostgreSQL và kho file tách trách nhiệm; format worker bị cô lập.", "Sếp duyệt hướng Tech hoặc yêu cầu so sánh phương án khác cho từng khối."),
                  ("3. Luồng tài liệu", "Giữ Checkout/Reference rõ phạm vi; Check-in all-or-none và bỏ giữ sau success/No Change; review và Release pin đúng bản.", "Xác nhận quy trình và ngoại lệ nghiệp vụ; không tự nới lỏng fail-closed."),
                  ("4. RBAC", "Giữ Principal + Role Definition + Scope = Role Assignment; quyền quản trị tách biệt và không tự cấp quyền nội dung.", "Chốt permission catalogue, role seed, người quản trị production và giới hạn ủy quyền."),
                  ("5. Vận hành", "Đánh giá một Server/VM trước, backup ở miền sự cố độc lập, bảo mật theo ranh giới và mở rộng dựa trên số đo.", "QLHT xác nhận OS/triển khai/backup; sếp chấp thuận mục tiêu phục hồi và ngân sách qualification."),
              ], widths=[3.6, 8.3, 6.0], font_size=9.2)
    add_status_note(doc, "Trạng thái đề nghị", "Cho phép chuyển sang review Tech chi tiết và lập kế hoạch qualification. Không dùng báo cáo này để tuyên bố production-ready, hiệu năng đạt, backup đã phục hồi thành công hoặc tiêu chuẩn đã được chứng nhận.", "blue")

    # Standards
    doc.add_heading("Cơ sở tiêu chuẩn và cách đọc sơ đồ", level=1)
    add_body_paragraph(doc, "Tài liệu tổ chức kiến trúc theo cách tiếp cận của ISO/IEC/IEEE 42010:2022: xác định hệ thống cần thiết kế, người quan tâm, mối quan tâm, góc nhìn, sơ đồ và lý do lựa chọn. Các yêu cầu nguồn được quản lý theo định hướng ISO/IEC/IEEE 29148:2018; chất lượng được kiểm tra độ bao phủ theo ISO/IEC 25010:2023; kiểm soát bảo mật tham khảo ISO/IEC 27002:2022 và ISO/IEC 27034-1:2011. C4 được dùng cho context/container/deployment; UML được dùng cho trạng thái, trình tự và mô hình dữ liệu. Đây là cơ sở đề xuất của dự án, không phải tuyên bố đã đạt chứng nhận hoặc tuân thủ toàn bộ điều khoản.")
    add_table_caption(doc, 14, "Tiêu chuẩn và mô hình được áp dụng")
    add_table(doc,
              ["Nguồn", "Dùng để làm gì trong báo cáo", "Giới hạn tuyên bố"],
              [
                  ("ISO/IEC/IEEE 42010:2022", "Tổ chức architecture description theo stakeholder, concern, viewpoint, view và rationale.", "Chưa có đánh giá conformity theo điều khoản."),
                  ("ISO/IEC/IEEE 29148:2018", "Giữ yêu cầu có mã, cần thiết, kiểm chứng được và truy vết.", "Báo cáo này không thay thế SRS DOC-04."),
                  ("ISO/IEC 25010:2023", "Nhắc đủ các concern về chất lượng, an toàn, vận hành và khả năng mở rộng.", "Chưa có số đo chất lượng production."),
                  ("ISO/IEC 27002:2022; ISO/IEC 27034-1:2011", "Hướng dẫn lựa chọn kiểm soát bảo mật và đưa bảo mật vào thiết kế ứng dụng.", "Áp dụng theo rủi ro; không phải chứng nhận ISMS."),
                  ("C4 và UML 2.5.1", "C4 mô tả cấu trúc; UML mô tả hành vi, trạng thái, trình tự và dữ liệu.", "Chỉ dùng loại sơ đồ trả lời câu hỏi cụ thể; không cần vẽ mọi loại UML."),
              ], widths=[4.2, 8.7, 5.0], font_size=9.3)

    # Glossary
    doc.add_heading("Glossary — Thuật ngữ dùng thống nhất", level=1)
    add_body_paragraph(doc, "Bảng dưới đây là cách hiểu thống nhất trong báo cáo. Khi một thuật ngữ có nghĩa khác trong công cụ bên ngoài, nghĩa của IDEA DDM được ưu tiên trong phạm vi sản phẩm này.")
    glossary = [
        ("IDEA DDM", "Tên tạm thời của sản phẩm nội bộ quản lý tài liệu và dữ liệu thiết kế có kiểm soát."),
        ("Logical Document", "Danh tính ổn định của một tài liệu; không đổi chỉ vì đổi tên, chuyển folder, Check-in hoặc tạo Revision mới."),
        ("Artifact", "Nội dung file dạng byte được lưu trong kho file riêng và nhận diện bằng digest."),
        ("Revision", "Mốc thay đổi nghiệp vụ lớn của cùng Logical Document, ví dụ A, B, C."),
        ("Version", "Số bản nội dung trong một Revision: 1, 2, 3…; tăng khi Check-in có thay đổi tạo Generation mới và trở về 1 khi tạo Revision mới."),
        ("Generation", "Snapshot bất biến do hệ thống tạo để pin chính xác metadata, cấu trúc và Artifact; là mã kỹ thuật, không phải loại Version thứ hai cho người dùng."),
        ("Workspace", "Khu vực làm việc được quản lý trên máy người dùng, chứa file Checkout/Reference và manifest phục hồi cục bộ."),
        ("Checkout", "Quyền giữ sửa một Logical Document cho đúng người, đúng Workspace, đúng expected Generation và thời hạn policy."),
        ("Reservation", "Bản ghi kỹ thuật phía Server dùng để thực thi Checkout. Giao diện người dùng ưu tiên từ Checkout."),
        ("Reference", "Bản lấy để tham khảo; không có quyền Check-in vào Logical Document nguồn."),
        ("Check-in", "Thao tác có xác nhận để công bố thay đổi từ Workspace vào hệ thống và kết thúc Checkout trong phạm vi đã commit hoặc No Change."),
        ("No Change", "Check-in xác định nội dung có nghĩa không đổi so với Working Head; không tăng Version/Generation nhưng vẫn kết thúc Checkout đã xác nhận."),
        ("Working Head", "Generation hiện hành dùng làm cơ sở làm việc của một Revision chưa Release."),
        ("Expected Generation", "Generation mà Checkout/Workspace dựa vào; dùng phát hiện bản làm việc đã cũ trước khi ghi."),
        ("Stale / Out of date", "Bản làm việc dựa trên Generation cũ hơn Working Head hiện tại; phải xử lý mà không ghi đè hoặc tự merge."),
        ("Review", "Quá trình xem xét một Generation/phạm vi đã pin theo workflow và approval policy."),
        ("Approve / Reject", "Quyết định chấp thuận hoặc trả lại đúng bản đang review; Reject phải có lý do."),
        ("Release", "Quyết định phát hành chính thức một phạm vi đã xác nhận sau khi kiểm tra lại đầy đủ điều kiện."),
        ("Release Record", "Bản ghi bất biến của một lần Release, pin đúng tài liệu, cấu trúc, policy, người, thời điểm và bằng chứng."),
        ("Controlled Release Package", "Gói có manifest, metadata, file, digest, cấu trúc/BOM và bằng chứng của một Release cụ thể."),
        ("Product Structure", "Dữ liệu cấu trúc cụm–chi tiết và quan hệ sản phẩm do IDEA DDM quản lý."),
        ("Structure Snapshot", "Ảnh chụp bất biến của Product Structure tại một mốc, pin đúng các Generation thành phần."),
        ("BOM", "Bill of Materials; một cách xem có kiểm soát từ Structure Snapshot theo BOM View Profile, không đơn thuần là file Excel/PDF."),
        ("Representation", "Bản dẫn xuất như PDF, preview hoặc STEP, luôn gắn với đúng Generation nguồn và producer/profile."),
        ("RBAC", "Role-Based Access Control; kiểm soát quyền dựa trên Role Assignment thay vì gán rời rạc theo màn hình."),
        ("Security Principal", "Người dùng hoặc Group có thể nhận Role Assignment."),
        ("Role Definition", "Định nghĩa có phiên bản chứa các Permission mà sản phẩm hỗ trợ."),
        ("Permission", "Mã hành động mà Server hiểu và kiểm tra, ví dụ Document.CheckIn."),
        ("Authorization Scope", "Phạm vi Role Assignment có hiệu lực: công ty, Project hoặc tài nguyên cụ thể."),
        ("Role Assignment", "Bản ghi gắn một Principal, một Role Definition phiên bản cụ thể và một Scope."),
        ("Effective Permission", "Tập Permission hợp lệ ở thời điểm yêu cầu sau khi xét assignment trực tiếp, Group, trạng thái, Scope và điều kiện."),
        ("Business gate", "Điều kiện nghiệp vụ do module sở hữu tài nguyên kiểm tra sau RBAC, ví dụ trạng thái, chủ Checkout, expected Generation hoặc tính độc lập khi duyệt."),
        ("Audit Evidence", "Bằng chứng chỉ bổ sung cho thao tác bảo vệ: người thực hiện, thời điểm, mục tiêu, nguồn/policy và kết quả."),
        ("Modular monolith", "Một ứng dụng Server triển khai như một khối nhưng chia module có trách nhiệm, interface và dữ liệu sở hữu rõ."),
        ("Adapter", "Lớp kết nối chuẩn hóa giúp thay kho file, công cụ định dạng hoặc nhà cung cấp mà không đổi quy tắc nghiệp vụ lõi."),
        ("Format worker", "Tiến trình/máy chạy job đọc hoặc chuyển đổi file trong giới hạn; không có quyền thay đổi product state."),
        ("Digest / hash", "Dấu vân tay tính từ nội dung file, dùng kiểm tra toàn vẹn và nhận diện nội dung bất biến."),
        ("Idempotent", "Lặp lại cùng một yêu cầu với cùng OperationId không tạo kết quả nghiệp vụ thứ hai."),
        ("Fail closed", "Khi thiếu quyền, dữ liệu hoặc quy tắc thì từ chối an toàn thay vì tự bỏ qua điều kiện."),
        ("Backup", "Bản sao có kiểm soát của database, Artifact, cấu hình/policy và key cần thiết để phục hồi."),
        ("Restore / recovery", "Khôi phục một recovery set vào môi trường kiểm tra, đối soát file/digest và chỉ mở lại dịch vụ khi đạt."),
        ("RPO", "Recovery Point Objective; lượng dữ liệu tối đa dự kiến có thể mất tính theo thời gian. Mục tiêu sơ bộ hiện tại: không quá 1 giờ."),
        ("RTO", "Recovery Time Objective; thời gian mục tiêu để khôi phục dịch vụ. Mục tiêu sơ bộ hiện tại: không quá 4 giờ làm việc."),
        ("PITR", "Point-in-Time Recovery; phục hồi PostgreSQL về một thời điểm dựa trên base backup và WAL."),
        ("WAL", "Write-Ahead Log của PostgreSQL; nhật ký cần cho phục hồi theo thời điểm, không chứa Artifact ở kho file ngoài database."),
        ("Qualification", "Hoạt động xác nhận phiên bản công nghệ, môi trường, giới hạn và bằng chứng đủ phù hợp trước khi dùng thật."),
    ]
    add_table_caption(doc, 15, "Glossary thuật ngữ")
    add_table(doc, ["Thuật ngữ", "Cách hiểu trong IDEA DDM"], glossary, widths=[4.6, 13.3], font_size=9.0)

    # References and links
    doc.add_heading("Tài liệu nguồn và liên kết sơ đồ", level=1)
    add_body_paragraph(doc, "Các liên kết dưới đây mở nguồn chi tiết trên máy/repository dự án. Nếu tài liệu được gửi ra ngoài cấu trúc thư mục hiện tại, cần gửi kèm thư mục evidence hoặc xuất các sơ đồ sang gói phát hành riêng.")
    sources = [
        ("DOC-03@0.7 — Business Requirements", DOC03),
        ("DOC-04@0.13 — Software Requirements Specification", DOC04),
        ("DOC-05@0.13 — Architecture Description", DOC05),
        ("DOC-06@0.13 — Data, Integration and Migration Specification", DOC06),
        ("Thư viện 30 sơ đồ kiến trúc và dữ liệu", GALLERY),
        ("Standards applicability and version register", ROOT / "docs" / "governance" / "standards-register.md"),
    ]
    for label, path in sources:
        p = doc.add_paragraph(style="List Bullet")
        add_hyperlink(p, label, path.resolve().as_uri())
    p = doc.add_paragraph()
    p.add_run("Các trang chính thức dùng để xác nhận phiên bản tiêu chuẩn: ")
    standards = [
        ("ISO/IEC/IEEE 42010:2022", "https://www.iso.org/standard/74393.html"),
        ("ISO/IEC/IEEE 29148:2018", "https://www.iso.org/standard/72089.html"),
        ("ISO/IEC 25010:2023", "https://www.iso.org/standard/78176.html"),
        ("ISO/IEC 27002:2022", "https://www.iso.org/standard/75652.html"),
    ]
    for idx, (label, url) in enumerate(standards):
        if idx:
            p.add_run("; ")
        add_hyperlink(p, label, url)
    p.add_run(".")

    add_status_note(doc, "Kết thúc tài liệu", "Mọi thay đổi làm ảnh hưởng Feature, Spec hoặc kiến trúc kiểm soát phải được ghi nhận qua tài liệu nguồn và review lại; không sửa báo cáo này như một nguồn quyết định độc lập.", "blue")

    # Document-level update behavior.
    settings = doc.settings._element
    update_fields = settings.find(qn("w:updateFields"))
    if update_fields is None:
        update_fields = OxmlElement("w:updateFields")
        settings.append(update_fields)
    update_fields.set(qn("w:val"), "true")

    # A stable default language for Vietnamese proofing without changing technical terms.
    styles = doc.styles.element
    for style in styles.findall(qn("w:style")):
        rpr = style.find(qn("w:rPr"))
        if rpr is not None:
            lang = rpr.find(qn("w:lang"))
            if lang is None:
                lang = OxmlElement("w:lang")
                rpr.append(lang)
            lang.set(qn("w:val"), "vi-VN")
            lang.set(qn("w:eastAsia"), "vi-VN")

    doc.save(str(OUTPUT))
    print(OUTPUT)


def main():
    figs = make_figures()
    build_document(figs)


if __name__ == "__main__":
    main()
