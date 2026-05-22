import re

from services.pdf_utils import extract_text_from_pdf_bytes, extract_text_from_pdf_path
from services.preprocessing import clean_resume_text, extract_section, normalize_for_matching
from services.skill_extractor import extract_keywords, extract_skills


def _split_items(section_text: str, limit: int = 8) -> list[str]:
    items = []
    for item in re.split(r"\s{2,}|[;\n]|(?<=\.)\s+", section_text):
        clean = clean_resume_text(item)
        if 8 <= len(clean) <= 180:
            items.append(clean)
        if len(items) >= limit:
            break
    if not items and section_text:
        clean = clean_resume_text(section_text)
        if clean:
            items.append(clean[:180])
    return items


def _extract_experience_years(text: str) -> float | None:
    patterns = [
        r"(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)\s+(?:of\s+)?experience",
        r"experience\s+of\s+(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return float(match.group(1))
    return None


def extract_resume_data(resume_text: str) -> dict:
    cleaned = clean_resume_text(resume_text)
    normalized = normalize_for_matching(cleaned)
    skills = extract_skills(normalized)
    education_text = extract_section(cleaned, ["education"])
    experience_text = extract_section(cleaned, ["experience", "work experience", "employment"])
    certification_text = extract_section(cleaned, ["certifications", "accomplishments"])
    project_text = extract_section(cleaned, ["projects"])

    return {
        "raw_text": normalized,
        "text_length": len(normalized),
        "skills": skills,
        "education": _split_items(education_text),
        "experience": _split_items(experience_text),
        "experience_years": _extract_experience_years(cleaned),
        "certifications": _split_items(certification_text),
        "projects": _split_items(project_text),
        "keywords": extract_keywords(cleaned),
    }


def parse_resume_pdf_bytes(pdf_bytes: bytes) -> dict:
    text = extract_text_from_pdf_bytes(pdf_bytes)
    return extract_resume_data(text)


def parse_resume_pdf_path(path: str) -> dict:
    text = extract_text_from_pdf_path(path)
    return extract_resume_data(text)
