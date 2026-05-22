import html
import re
import unicodedata


SECTION_HEADERS = [
    "summary",
    "profile",
    "objective",
    "experience",
    "work experience",
    "employment",
    "education",
    "skills",
    "technical skills",
    "projects",
    "certifications",
    "accomplishments",
]
FALSE_HEADER_FOLLOWERS = {
    "education": {"program", "programs", "and", "or"},
    "experience": {"with", "in", "using"},
    "projects": {"plan", "plans", "life", "management"},
    "project": {"plan", "plans", "life", "management"},
    "skills": {"while"},
}


def clean_resume_text(text: str) -> str:
    """Normalize resume text extracted from PDFs or CSV rows."""
    if not text:
        return ""

    text = html.unescape(str(text))
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("\x00", " ")
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[\u2022\u25cf\u25aa\u00b7]", " ", text)
    text = re.sub(r"[_=\-*]{2,}", " ", text)
    text = re.sub(r"(?<=[a-z])(?=[A-Z][a-z])", " ", text)
    text = re.sub(r"[^\w\s@.+#,/&()-]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def normalize_for_matching(text: str) -> str:
    text = clean_resume_text(text).lower()
    text = re.sub(r"[^a-z0-9+#.]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def extract_section(text: str, section_names: list[str], max_chars: int = 2500) -> str:
    cleaned = clean_resume_text(text)
    if not cleaned:
        return ""

    header_pattern = re.compile(
        r"\b(" + "|".join(re.escape(header) for header in SECTION_HEADERS) + r")\b",
        flags=re.IGNORECASE,
    )
    candidates = []
    for match in header_pattern.finditer(cleaned):
        header = match.group(1).lower()
        next_word = re.match(r"\s+([a-zA-Z]+)", cleaned[match.end() :])
        follower = next_word.group(1).lower() if next_word else ""
        if follower in FALSE_HEADER_FOLLOWERS.get(header, set()):
            continue
        content_start = match.end()
        colon_match = re.match(r"\s*:", cleaned[content_start:])
        if colon_match:
            content_start += colon_match.end()
        candidates.append((match.start(), content_start, header))

    wanted = {name.lower() for name in section_names}
    for index, (start, end, header) in enumerate(candidates):
        if header not in wanted:
            continue
        next_start = candidates[index + 1][0] if index + 1 < len(candidates) else len(cleaned)
        return cleaned[end:next_start].strip()[:max_chars]

    return ""


def top_tfidf_keywords(text: str, limit: int = 12) -> list[str]:
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
    except Exception:
        return []

    cleaned = normalize_for_matching(text)
    if len(cleaned.split()) < 8:
        return []

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_features=200,
        token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z0-9+#.]{1,}\b",
    )
    matrix = vectorizer.fit_transform([cleaned])
    scores = matrix.toarray()[0]
    features = vectorizer.get_feature_names_out()
    ranked = sorted(zip(features, scores), key=lambda item: item[1], reverse=True)
    return [term for term, score in ranked[:limit] if score > 0]
