import os

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.analysis import calculate_ats_score, generate_learning_roadmap, skill_gap_analysis
from services.classifier import predict_resume_category
from services.pipeline import analyze_resume_pdf, analyze_resume_text
from services.resume_parser import extract_resume_data
from services.recommender import recommend_careers, recommend_jobs


load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")

app = FastAPI(title="AI-Powered Career Path Recommender", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResumeRequest(BaseModel):
    resume_text: str
    top_n: int = 5


class SkillsRequest(BaseModel):
    skills: list[str]
    category: str | None = None
    resume_text: str | None = None
    top_n: int = 5


class GapRequest(BaseModel):
    candidate_skills: list[str]
    required_skills: list[str]


class AtsRequest(BaseModel):
    skill_coverage: float
    keyword_match: float
    category_confidence: float
    job_match_percentage: float
    technical_keyword_coverage: float | None = None


@app.get("/")
def health_check():
    return {
        "status": "AI Service Running",
        "system": "AI-Powered Career Path Recommender",
        "scope": "Information Technology recommendations only",
        "workflow": [
            "resume upload",
            "parse resume",
            "extract skills",
            "prepare IT job text",
            "TF-IDF cosine similarity",
            "recommend IT jobs",
            "skill gap",
            "roadmap",
            "ATS score",
        ],
    }


@app.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...), top_n: int = 5):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported.")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    try:
        result = analyze_resume_pdf(content, top_n=top_n)
    except RuntimeError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Resume upload failed while processing '{file.filename}': {exc}",
        ) from exc

    if result["parsed_resume"]["text_length"] < 40:
        raise HTTPException(
            status_code=422,
            detail="Could not extract enough text from this PDF. Use a text-based resume PDF, not a scanned image.",
        )
    return result


@app.post("/parse-resume")
def parse_resume(data: ResumeRequest):
    if not data.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text cannot be empty.")
    return analyze_resume_text(data.resume_text, top_n=data.top_n)


@app.post("/resume/parse")
def parse_resume_only(data: ResumeRequest):
    if not data.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text cannot be empty.")
    return extract_resume_data(data.resume_text)


@app.post("/career/predict")
def predict_career_category(data: ResumeRequest):
    if not data.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text cannot be empty.")
    return predict_resume_category(data.resume_text)


@app.post("/career/recommend")
def career_recommendation(data: SkillsRequest):
    return {
        "career_recommendations": recommend_careers(
            data.skills, category=data.category, limit=data.top_n
        )
    }


@app.post("/jobs/recommend")
def job_recommendation(data: SkillsRequest):
    return {
        "job_recommendations": recommend_jobs(
            data.skills, category=data.category, limit=data.top_n, resume_text=data.resume_text
        )
    }


@app.post("/skill-gap")
def skill_gap(data: GapRequest):
    return skill_gap_analysis(data.candidate_skills, data.required_skills)


@app.post("/roadmap")
def roadmap(data: GapRequest):
    gap = skill_gap_analysis(data.candidate_skills, data.required_skills)
    return {
        "skill_gap": gap,
        "learning_roadmap": generate_learning_roadmap(gap["missing_skills"]),
    }


@app.post("/ats-score")
def ats_score(data: AtsRequest):
    return calculate_ats_score(
        data.skill_coverage,
        data.keyword_match,
        data.category_confidence,
        data.job_match_percentage,
        data.technical_keyword_coverage,
    )
