# Artifact design record — IDEA DDM architecture report

## Reference

- Source: `C:/Users/TD-999/Research/Projects/IDEA/Human/IDEAEngineering/IDEA_DDM_review.docx`
- SHA-256: `4D62750C473B69D154FD2A7409B28EAE56E4A60561DB6274E604CF2A81091A0E`
- Preserve source byte-for-byte; create a separately named output.
- Reference has one A4 portrait section, 10 rendered pages, 125 paragraphs, five tables and six inline figures.

## Page system

- A4 portrait, 12.7 mm left/right, 16.5 mm top, 15 mm bottom.
- Different first-page header/footer.
- Cover: author metadata at upper left, IDEA logo at upper right, large centered title in the middle third.
- Regular header: `IDEA DDM` left and `Báo cáo kiến trúc` right.
- Regular footer: short document title left and `Trang X / N` right.

## Typography

- Normal: Calibri 11.5 pt, black, 1.08 line spacing, 5 pt after.
- Title: 28 pt, bold, centered, navy.
- Heading 1: 16 pt, bold, navy, keep with next.
- Heading 2: 13 pt, bold, navy, keep with next.
- Heading 3: 11.5 pt, bold.
- Captions: 9.5 pt, gray-blue, centered.
- Technical terms remain English only when established in the project; first use receives a Vietnamese explanation and the Glossary is authoritative.

## Tables

- Light gray borders, 0.5 pt.
- Header row uses light blue fill, bold navy text, repeated on later pages.
- Cells use 1.5–2 mm internal padding; no unnecessary blank rows.
- Dense engineering tables are split into short management-facing tables.

## Figures

- Five management-level figures, each answering one of the five requested report topics.
- White background, navy/blue system boxes, green outcome/control boxes, amber warning or decision boxes.
- Figures are inline and sized to the text width; each has a caption and a link to the corresponding detailed controlled architecture view.
- Detailed source gallery remains outside the DOCX and is linked, not duplicated in full.

## Content flow

1. Cover.
2. Document control and decision sought.
3. Table of Contents.
4. List of Figures and List of Tables.
5. Part I — work solved and users.
6. Part II — Web, Desktop, Server, PostgreSQL, file store and format processor.
7. Part III — Checkout, Check-in, Review and Release.
8. Part IV — RBAC and administrative separation of duties.
9. Part V — deployment, backup, security and scaling.
10. Decision summary, Glossary and references.

## Package and fidelity rules

- Reuse the reference package as the style/header/footer base, then replace only document body content and intended header/footer text.
- Keep `logo-idea.png` as the only brand image.
- Do not copy DDM logos, code or proprietary assets.
- Do not present Draft architecture or candidate technologies as approved or implemented.
- Preserve the accepted Feature/Spec decisions: Check-in ends the confirmed Checkout scope; Reference cannot publish to the source; stale work is preserved without automatic CAD/Office merge; one user-facing Version per Revision; exact scoped Release; RBAC eligibility remains separate from business gates.

## QA gates

- Update TOC, List of Figures, List of Tables and page fields in Microsoft Word.
- Export to PDF and inspect every rendered page at 100%.
- No clipped text, split captions, blank content pages, placeholder text or stale image from an earlier prototype.
- Validate document structure, headings, tables, captions, hyperlinks, images and accessibility metadata.
