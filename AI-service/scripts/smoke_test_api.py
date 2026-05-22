from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from fastapi.testclient import TestClient

from main import app


def assert_ok(response, endpoint: str):
    if response.status_code >= 400:
        raise AssertionError(f"{endpoint} failed: {response.status_code} {response.text[:500]}")


def main():
    client = TestClient(app)
    resume_text = (
        "Skills Python, SQL, Machine Learning, Tableau, FastAPI, Docker. "
        "Experience 3 years building analytics dashboards and APIs. "
        "Education B.Tech Computer Science. Projects resume recommender dashboard."
    )

    checks = []

    response = client.get("/")
    assert_ok(response, "/")
    checks.append(("/", response.status_code))

    response = client.post("/parse-resume", json={"resume_text": resume_text, "top_n": 3})
    assert_ok(response, "/parse-resume")
    payload = response.json()
    assert payload["parsed_resume"]["skills"]
    assert payload["job_recommendations"]
    assert all(job["industry"] == "Software" for job in payload["job_recommendations"])
    checks.append(("/parse-resume", response.status_code))

    response = client.post("/resume/parse", json={"resume_text": resume_text})
    assert_ok(response, "/resume/parse")
    checks.append(("/resume/parse", response.status_code))

    response = client.post("/career/predict", json={"resume_text": resume_text})
    assert_ok(response, "/career/predict")
    checks.append(("/career/predict", response.status_code))

    skills_payload = {"skills": ["python", "sql", "machine learning"], "category": "INFORMATION-TECHNOLOGY", "top_n": 3}
    response = client.post("/career/recommend", json=skills_payload)
    assert_ok(response, "/career/recommend")
    checks.append(("/career/recommend", response.status_code))

    response = client.post("/jobs/recommend", json=skills_payload)
    assert_ok(response, "/jobs/recommend")
    assert all(job["industry"] == "Software" for job in response.json()["job_recommendations"])
    checks.append(("/jobs/recommend", response.status_code))

    gap_payload = {
        "candidate_skills": ["python", "sql"],
        "required_skills": ["python", "sql", "react"],
    }
    response = client.post("/skill-gap", json=gap_payload)
    assert_ok(response, "/skill-gap")
    checks.append(("/skill-gap", response.status_code))

    response = client.post("/roadmap", json=gap_payload)
    assert_ok(response, "/roadmap")
    checks.append(("/roadmap", response.status_code))

    response = client.post(
        "/ats-score",
        json={
            "skill_coverage": 75,
            "keyword_match": 70,
            "category_confidence": 0.8,
            "job_match_percentage": 72,
        },
    )
    assert_ok(response, "/ats-score")
    checks.append(("/ats-score", response.status_code))

    pdf_path = next(Path("datasets/Resume_datasets/data/data/INFORMATION-TECHNOLOGY").glob("*.pdf"))
    response = client.post(
        "/resume/upload",
        files={"file": (pdf_path.name, pdf_path.read_bytes(), "application/pdf")},
    )
    assert_ok(response, "/resume/upload")
    checks.append(("/resume/upload", response.status_code))

    for endpoint, status_code in checks:
        print(f"{endpoint}: {status_code}")


if __name__ == "__main__":
    main()
