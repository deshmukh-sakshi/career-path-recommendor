from services.analysis import calculate_ats_score, generate_learning_roadmap, skill_gap_analysis
from services.resume_parser import extract_resume_data, parse_resume_pdf_bytes
from services.recommender import recommend_careers, recommend_jobs
from services.recommender import IT_CATEGORY


def analyze_resume_text(resume_text: str, top_n: int = 5) -> dict:
    parsed = extract_resume_data(resume_text)
    return _build_intelligence_response(parsed, top_n=top_n)


def analyze_resume_pdf(pdf_bytes: bytes, top_n: int = 5) -> dict:
    parsed = parse_resume_pdf_bytes(pdf_bytes)
    return _build_intelligence_response(parsed, top_n=top_n)


def _build_intelligence_response(parsed: dict, top_n: int = 5) -> dict:
    skills = parsed["skills"]
    it_profile = {
        "scope": IT_CATEGORY,
        "is_it_resume": bool(skills),
        "technical_skill_count": len(skills),
        "technical_skills": skills,
        "matching_method": "tfidf_cosine_similarity_plus_skill_overlap",
        "legacy_classifier_used": False,
    }

    careers = recommend_careers(skills, category=IT_CATEGORY, limit=top_n)
    jobs = recommend_jobs(skills, category=IT_CATEGORY, limit=top_n, resume_text=parsed["raw_text"])
    best_job = jobs[0] if jobs else {"required_skills": [], "match_score": 0}
    gap = skill_gap_analysis(skills, best_job.get("required_skills", []))
    roadmap = generate_learning_roadmap(gap["missing_skills"])

    keyword_match = best_job.get("keyword_score", gap["match_percentage"])
    similarity_score = best_job.get("similarity_score", best_job.get("match_score", 0.0))
    ats = calculate_ats_score(
        skill_coverage=gap["match_percentage"],
        keyword_match=keyword_match,
        category_confidence=0.0,
        job_match_percentage=similarity_score,
    )

    return {
        "success": True,
        "parsed_resume": parsed,
        "it_profile": it_profile,
        "career_recommendations": careers,
        "job_recommendations": jobs,
        "skill_gap": gap,
        "learning_roadmap": roadmap,
        "ats_score": ats,
    }
