# AI-Powered Career Path Recommender

Hackathon-grade resume intelligence backend built with FastAPI and a supervised resume classifier.

Current scope: **Information Technology recommendations only**. The system may classify an uploaded resume against the trained labels, but recommendations, skill gaps, roadmaps, ATS fit, and job matching are restricted to IT/software roles from the datasets.

## Workflow

Resume upload -> parse and clean text -> extract technical skills -> classify resume category and IT fit -> recommend IT careers -> recommend IT/software jobs -> compute IT skill gaps -> generate IT roadmap -> score ATS fit for IT jobs.

## Datasets Used

- `datasets/Resume_datasets/data/data/INFORMATION-TECHNOLOGY/*.pdf`
  - Primary high-quality IT resume data for the current product scope.
- `datasets/Resume_datasets/data/data/<CATEGORY>/*.pdf`
  - Support data for distinguishing IT resumes from non-IT resumes.
- `datasets/Resume_datasets/Resume/Resume.csv`
  - Plain-text resume support data using `Resume_str` and `Category`.
- `datasets/career_recommender.csv`
  - Career recommendation rows matched against extracted skills and predicted category.
- `datasets/job_recommendation_dataset.csv`
  - Content-based job recommendations using only IT/software rows, required skills, title, and experience level.

## Setup

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Train Resume Classifier

```powershell
.\.venv\Scripts\python.exe scripts\train_resume_classifier.py
```

For a faster hackathon demo run:

```powershell
.\.venv\Scripts\python.exe scripts\train_resume_classifier.py --max-per-category 30
```

Artifacts are written to:

- `models/resume_classifier.joblib`
- `models/resume_classifier_metrics.json`

Metrics include accuracy, precision, recall, F1, classification report, and confusion matrix.

## Run API

```powershell
.\.venv\Scripts\uvicorn.exe main:app --reload
```

If port `8000` is already held by an old process, use another port:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8001
```

## Smoke Test

```powershell
.\.venv\Scripts\python.exe scripts\smoke_test_api.py
```

## Key Endpoints

- `GET /` health and workflow
- `POST /resume/upload` uploaded PDF end-to-end analysis
- `POST /parse-resume` text end-to-end analysis
- `POST /resume/parse` parse text only
- `POST /career/predict` category prediction only
- `POST /career/recommend` career recommendations from skills/category
- `POST /jobs/recommend` job recommendations from skills/category
- `POST /skill-gap` compare candidate and job skills
- `POST /roadmap` generate roadmap for missing skills
- `POST /ats-score` score a resume/job fit

## Notes

This project uses IT-only content-based recommendation, not collaborative filtering, because there is no user interaction history dataset. Market trend data is not faked.
