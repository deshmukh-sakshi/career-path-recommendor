from services.preprocessing import normalize_for_matching


ROADMAP_LIBRARY = {
    "python": ["Python syntax", "data structures", "file handling", "APIs", "small automation project"],
    "sql": ["select/filter queries", "joins", "aggregation", "window functions", "schema design"],
    "machine learning": ["supervised learning", "model evaluation", "feature engineering", "scikit-learn project"],
    "tableau": ["charts", "calculated fields", "dashboards", "publishing"],
    "power bi": ["data model", "DAX basics", "visuals", "dashboard publishing"],
    "aws": ["IAM", "EC2/S3", "Lambda", "deployment basics"],
    "docker": ["images", "containers", "Dockerfile", "compose"],
    "react": ["components", "props/state", "hooks", "API integration"],
    "fastapi": ["routing", "pydantic models", "dependency injection", "deployment"],
    "excel": ["formulas", "pivot tables", "lookup functions", "charts"],
    "javascript": ["modern JavaScript", "DOM and async programming", "API calls", "frontend project"],
    "typescript": ["types", "interfaces", "generics", "typed React or Node project"],
    "node.js": ["runtime basics", "Express APIs", "authentication", "MongoDB integration"],
    "mongodb": ["documents", "indexes", "aggregation", "schema design"],
    "kubernetes": ["pods", "services", "deployments", "cluster deployment"],
    "terraform": ["providers", "resources", "state", "cloud infrastructure project"],
    "jenkins": ["pipelines", "agents", "build stages", "deployment automation"],
    "tensorflow": ["tensors", "model training", "callbacks", "image/text model project"],
    "pytorch": ["tensors", "datasets", "training loops", "neural network project"],
    "nlp": ["text preprocessing", "embeddings", "transformers basics", "classification project"],
    "cybersecurity": ["network basics", "threat modeling", "vulnerability scanning", "security lab"],
    "selenium": ["locators", "waits", "test design", "browser automation suite"],
    "android": ["activities", "layouts", "networking", "published demo app"],
    "figma": ["frames", "components", "prototyping", "developer handoff"],
}


def skill_gap_analysis(candidate_skills: list[str], required_skills: list[str]) -> dict:
    candidate = {normalize_for_matching(skill) for skill in candidate_skills if skill}
    required = {normalize_for_matching(skill) for skill in required_skills if skill}

    matched = sorted(candidate & required)
    missing = sorted(required - candidate)
    match_percentage = round((len(matched) / len(required)) * 100, 2) if required else 0.0
    if not required:
        gap_summary = "No target job skills were provided for comparison."
    elif not missing:
        gap_summary = "Strong fit: all listed required skills are present."
    else:
        gap_summary = f"Matched {len(matched)} of {len(required)} required skills; focus next on {', '.join(missing[:5])}."

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "match_percentage": match_percentage,
        "gap_summary": gap_summary,
    }


def generate_learning_roadmap(missing_skills: list[str]) -> list[dict]:
    roadmap = []
    for order, skill in enumerate(missing_skills, start=1):
        normalized = normalize_for_matching(skill)
        topics = ROADMAP_LIBRARY.get(
            normalized,
            [
                f"{skill} fundamentals",
                f"developer tools used for {skill}",
                f"hands-on IT project practice",
                f"portfolio task using {skill}",
            ],
        )
        roadmap.append(
            {
                "order": order,
                "skill": skill,
                "beginner_topics": topics[:3],
                "tools_to_learn": topics[3:],
                "roadmap_text": f"Start with {topics[0]}, practice {topics[1]}, then build a small project using {skill}.",
            }
        )
    return roadmap


def calculate_ats_score(
    skill_coverage: float,
    keyword_match: float,
    category_confidence: float,
    job_match_percentage: float,
    technical_keyword_coverage: float | None = None,
) -> dict:
    technical_keyword_coverage = (
        skill_coverage if technical_keyword_coverage is None else technical_keyword_coverage
    )
    score = (
        0.35 * skill_coverage
        + 0.20 * keyword_match
        + 0.25 * job_match_percentage
        + 0.20 * technical_keyword_coverage
    )
    score = round(max(0, min(score, 100)), 2)
    return {
        "score": score,
        "components": {
            "skill_coverage": round(skill_coverage, 2),
            "keyword_match": round(keyword_match, 2),
            "job_description_similarity": round(job_match_percentage, 2),
            "technical_keyword_coverage": round(technical_keyword_coverage, 2),
            "category_confidence": round(category_confidence * 100, 2),
        },
    }
