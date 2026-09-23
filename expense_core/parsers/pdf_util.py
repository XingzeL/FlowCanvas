from __future__ import annotations

from io import BytesIO

from pypdf import PdfReader


def pdf_text_from_bytes(content: bytes) -> str:
    reader = PdfReader(BytesIO(content))
    return "\n".join(page.extract_text() or "" for page in reader.pages)
