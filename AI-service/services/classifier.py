from pathlib import Path

from services.preprocessing import clean_resume_text
from services.skill_extractor import extract_skills


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"
CLASSIFIER_PATH = MODEL_DIR / "resume_classifier.joblib"
METRICS_PATH = MODEL_DIR / "resume_classifier_metrics.json"


def load_classifier():
    if not CLASSIFIER_PATH.exists():
        return None
    try:
        import joblib
    except Exception as exc:
        raise RuntimeError("Install joblib and scikit-learn to load classifier artifacts.") from exc
    return joblib.load(CLASSIFIER_PATH)


def predict_resume_category(text: str) -> dict:
    cleaned = clean_resume_text(text)
    skills = extract_skills(cleaned)
    it_fit_score = round(min((len(skills) / 6) * 100, 100), 2)

    return {
        "category": "INFORMATION-TECHNOLOGY" if skills else "UNKNOWN",
        "is_it_resume": bool(skills),
        "technical_skills": skills,
        "technical_skill_count": len(skills),
        "it_fit_score": it_fit_score,
        "legacy_classifier_used": False,
        "message": "Category classification is disabled for recommendations; IT fit is based on extracted technical skills.",
    }
