from pathlib import Path
from tempfile import NamedTemporaryFile


def extract_text_from_pdf_path(path: str | Path) -> str:
    path = Path(path)
    try:
        from pypdf import PdfReader
    except Exception:
        try:
            from PyPDF2 import PdfReader
        except Exception as exc:
            raise RuntimeError("Install pypdf or PyPDF2 to parse PDF resumes.") from exc

    reader = PdfReader(str(path))
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    return "\n".join(pages)


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    with NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(pdf_bytes)
        tmp_path = tmp.name

    try:
        return extract_text_from_pdf_path(tmp_path)
    finally:
        Path(tmp_path).unlink(missing_ok=True)
