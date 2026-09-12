from pathlib import Path
from docx import Document

path = Path(r"C:\Users\TD-999\Research\Projects\IDEA\Human\IDEAEngineering\Packages\IDEA-DDM_kientruc-v4\IDEA-DDM-Kien-truc-v4.docx")
document = Document(path)
relationships = document.part.rels
previous_text = ""
image_index = 0
for paragraph in document.paragraphs:
    text = paragraph.text.strip()
    blips = paragraph._p.xpath('.//*[local-name()="blip"]')
    if blips:
        image_index += 1
        relationship_ids = paragraph._p.xpath(
            './/*[local-name()="blip"]/@*[local-name()="embed"]'
        )
        print(
            image_index,
            relationship_ids,
            [relationships[item].target_ref for item in relationship_ids],
            "PREV=",
            previous_text,
        )
    if text:
        previous_text = text
