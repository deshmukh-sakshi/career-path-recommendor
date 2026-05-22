import csv
import re
from functools import lru_cache
from pathlib import Path

from services.preprocessing import normalize_for_matching
from services.skill_extractor import SKILL_ALIASES, extract_skills


BASE_DIR = Path(__file__).resolve().parent.parent
CAREER_DATASET = BASE_DIR / "datasets" / "career_recommender.csv"
JOB_DATASET = BASE_DIR / "datasets" / "job_recommendation_dataset.csv"

CAREER_SKILLS_COL = "What are your skills ? (Select multiple if necessary)"
CAREER_INTERESTS_COL = "What are your interests?"
CAREER_TITLE_COL = (
    "If yes, then what is/was your first Job title in your current field of work? "
    "If not applicable, write NA.               "
)
CANONICAL_SKILL_LOOKUP = {
    normalize_for_matching(variant): skill
    for skill, variants in SKILL_ALIASES.items()
    for variant in variants
}
IT_CATEGORY = "INFORMATION-TECHNOLOGY"
IT_JOB_INDUSTRIES = {"software"}
IT_TITLE_TERMS = {
    "software",
    "developer",
    "programmer",
    "systems",
    "system",
    "database",
    "data",
    "technology",
    "information systems",
    "information technology",
    "network",
    "security",
    "cloud",
    "devops",
    "web",
    "application",
    "applications",
    "qa",
    "test",
    "tester",
    "cto",
    "chief technology",
    "machine learning",
    "artificial intelligence",
    "ai",
    "ml",
    "android",
    "ui",
    "ux",
}
NON_IT_TITLE_TERMS = {
    "agricultural",
    "manufacturing",
    "medical",
    "armed forces",
    "geographical",
    "tourist",
    "careers information",
    "industrial product",
    "technical sales",
}
JOB_TEXT_FIELDS = (
    "Job Title",
    "Industry",
    "Experience Level",
    "Required Skills",
    "Description",
    "Job Description",
    "Category",
    "Tools",
    "Keywords",
)


@lru_cache(maxsize=4)
def _read_csv(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def _token_set(text: str) -> set[str]:
    return {token for token in normalize_for_matching(text).split() if len(token) > 1}


def _overlap_score(left: set[str], right: set[str]) -> float:
    if not left or not right:
        return 0.0
    return len(left & right) / max(len(left), 1)


def _coverage_score(candidate: set[str], required: set[str]) -> float:
    if not required:
        return 0.0
    return len(candidate & required) / len(required)


def _technical_skill_count(text: str) -> int:
    return len(set(extract_skills(text)))


def _has_it_title_signal(title: str) -> bool:
    normalized = normalize_for_matching(title)
    if any(term in normalized for term in NON_IT_TITLE_TERMS):
        return False
    tokens = set(normalized.split())
    for term in IT_TITLE_TERMS:
        term_normalized = normalize_for_matching(term)
        if " " in term_normalized and term_normalized in normalized:
            return True
        if term_normalized in tokens:
            return True
    return False


def _is_it_job_row(row: dict) -> bool:
    title = row.get("Job Title", "")
    required_text = row.get("Required Skills", "")
    industry = normalize_for_matching(row.get("Industry", ""))
    has_it_title = _has_it_title_signal(title)
    has_technical_requirements = bool(_split_required_skills(required_text))

    if has_it_title and has_technical_requirements:
        return True
    return industry in IT_JOB_INDUSTRIES and has_it_title


def _prepare_job_text(row: dict) -> str:
    return normalize_for_matching(" ".join(row.get(field, "") for field in JOB_TEXT_FIELDS))


@lru_cache(maxsize=1)
def _it_job_candidates() -> tuple[tuple[dict, str], ...]:
    return tuple((row, _prepare_job_text(row)) for row in _read_csv(JOB_DATASET) if _is_it_job_row(row))


@lru_cache(maxsize=1)
def _career_candidates() -> tuple[tuple[dict, str, str, str, set[str]], ...]:
    candidates = []
    for row in _read_csv(CAREER_DATASET):
        job_title = (row.get(CAREER_TITLE_COL) or "").strip()
        if not job_title or job_title.lower() == "na":
            continue
        if not _has_it_title_signal(job_title):
            continue

        row_skills_text = row.get(CAREER_SKILLS_COL, "")
        row_text = " ".join(
            [row.get(CAREER_INTERESTS_COL, ""), row_skills_text, job_title]
        )
        row_skills = set(extract_skills(row_skills_text))
        if len(row_skills) < 2 and _technical_skill_count(row_text) < 2:
            continue
        candidates.append((row, job_title, row_skills_text, row_text, row_skills))
    return tuple(candidates)


def _tfidf_similarity(query: str, documents: list[str]) -> list[float]:
    if not documents:
        return []
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), min_df=1)
        matrix = vectorizer.fit_transform([query] + documents)
        return cosine_similarity(matrix[0], matrix[1:]).flatten().tolist()
    except Exception:
        query_tokens = _token_set(query)
        return [_overlap_score(query_tokens, _token_set(document)) for document in documents]


def _split_required_skills(required_text: str) -> set[str]:
    terms = [term.strip() for term in re.split(r"[,;/|]", required_text) if term.strip()]
    parsed = set()
    for term in terms:
        normalized = normalize_for_matching(term)
        if not normalized:
            continue
        parsed.add(CANONICAL_SKILL_LOOKUP.get(normalized, normalized))
    return parsed


def recommend_careers(skills: list[str], category: str | None = None, limit: int = 5) -> list[dict]:
    user_text = " ".join(skills + [IT_CATEGORY])
    user_tokens = _token_set(user_text)
    user_skills = {normalize_for_matching(skill) for skill in skills}

    candidates = _career_candidates()

    similarities = _tfidf_similarity(user_text, [item[3] for item in candidates])
    ranked = []
    for index, (row, job_title, row_skills_text, row_text, row_skills) in enumerate(candidates):
        row_tokens = _token_set(row_text)
        cosine_score = similarities[index] if index < len(similarities) else 0.0
        skill_score = _coverage_score(user_skills, row_skills)
        token_score = _overlap_score(user_tokens, row_tokens)
        score = (0.55 * cosine_score) + (0.35 * skill_score) + (0.10 * token_score)

        ranked.append(
            {
                "job_title": job_title,
                "skills": row_skills_text,
                "interests": row.get(CAREER_INTERESTS_COL, ""),
                "score": round(min(score, 1.0) * 100, 2),
            }
        )

    ranked.sort(key=lambda item: item["score"], reverse=True)
    return ranked[:limit]


def recommend_jobs(
    skills: list[str],
    category: str | None = None,
    limit: int = 5,
    resume_text: str | None = None,
) -> list[dict]:
    rows_and_documents = _it_job_candidates()
    rows = [item[0] for item in rows_and_documents]
    career_context = [item["job_title"] for item in recommend_careers(skills, IT_CATEGORY, limit=3)]
    candidate_text = normalize_for_matching(" ".join([resume_text or "", *skills, *career_context, IT_CATEGORY]))
    candidate_tokens = _token_set(candidate_text)
    candidate_skills = {normalize_for_matching(skill) for skill in skills}

    documents = [item[1] for item in rows_and_documents]
    tfidf_scores = _tfidf_similarity(candidate_text, documents)

    ranked = []
    for index, row in enumerate(rows):
        required_text = row.get("Required Skills", "")
        row_text = documents[index]
        required_skills = _split_required_skills(required_text)
        if not required_skills:
            continue
        matched_skills = sorted(candidate_skills & required_skills)
        missing_skills = sorted(required_skills - candidate_skills)
        token_score = _overlap_score(candidate_tokens, _token_set(row_text))
        skill_score = _coverage_score(candidate_skills, required_skills)
        cosine_score = tfidf_scores[index] if index < len(tfidf_scores) else token_score
        score = min((0.55 * skill_score) + (0.35 * cosine_score) + (0.10 * token_score), 1.0)

        ranked.append(
            {
                "job_title": row.get("Job Title", ""),
                "company": row.get("Company", ""),
                "location": row.get("Location", ""),
                "experience_level": row.get("Experience Level", ""),
                "salary": row.get("Salary", ""),
                "industry": row.get("Industry", ""),
                "required_skills": sorted(required_skills),
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "similarity_score": round(cosine_score * 100, 2),
                "keyword_score": round(token_score * 100, 2),
                "match_score": round(score * 100, 2),
            }
        )

    ranked.sort(key=lambda item: item["match_score"], reverse=True)
    return ranked[:limit]
