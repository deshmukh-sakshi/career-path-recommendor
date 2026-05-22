import argparse
import csv
import json
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from services.pdf_utils import extract_text_from_pdf_path
from services.preprocessing import clean_resume_text


PDF_DATA_DIR = BASE_DIR / "datasets" / "Resume_datasets" / "data" / "data"
RESUME_CSV = BASE_DIR / "datasets" / "Resume_datasets" / "Resume" / "Resume.csv"
MODEL_DIR = BASE_DIR / "models"


def load_pdf_training_rows(max_per_category: int | None = None) -> tuple[list[str], list[str]]:
    texts, labels = [], []
    for category_dir in sorted(PDF_DATA_DIR.iterdir()):
        if not category_dir.is_dir():
            continue
        pdfs = sorted(category_dir.glob("*.pdf"))
        if max_per_category:
            pdfs = pdfs[:max_per_category]
        for pdf_path in pdfs:
            try:
                text = clean_resume_text(extract_text_from_pdf_path(pdf_path))
            except Exception as exc:
                print(f"Skipping {pdf_path}: {exc}")
                continue
            if len(text.split()) >= 40:
                texts.append(text)
                labels.append(category_dir.name)
    return texts, labels


def load_resume_csv_rows(max_rows: int | None = None) -> tuple[list[str], list[str]]:
    if not RESUME_CSV.exists():
        return [], []

    texts, labels = [], []
    with RESUME_CSV.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            text = clean_resume_text(row.get("Resume_str", ""))
            label = clean_resume_text(row.get("Category", "")).upper().replace(" ", "-")
            if text and label:
                texts.append(text)
                labels.append(label)
            if max_rows and len(texts) >= max_rows:
                break
    return texts, labels


def train_classifier(max_per_category: int | None = None, use_resume_csv: bool = True):
    from joblib import dump
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
    from sklearn.model_selection import train_test_split
    from sklearn.pipeline import Pipeline

    texts, labels = load_pdf_training_rows(max_per_category=max_per_category)
    if use_resume_csv:
        csv_texts, csv_labels = load_resume_csv_rows()
        texts.extend(csv_texts)
        labels.extend(csv_labels)

    if len(set(labels)) < 2:
        raise RuntimeError("Need at least two resume categories to train the classifier.")

    x_train, x_test, y_train, y_test = train_test_split(
        texts,
        labels,
        test_size=0.2,
        random_state=42,
        stratify=labels,
    )

    model = Pipeline(
        steps=[
            (
                "tfidf",
                TfidfVectorizer(
                    stop_words="english",
                    ngram_range=(1, 2),
                    min_df=2,
                    max_features=60000,
                    sublinear_tf=True,
                ),
            ),
            (
                "classifier",
                LogisticRegression(
                    max_iter=2000,
                    class_weight="balanced",
                ),
            ),
        ]
    )

    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    report = classification_report(y_test, predictions, output_dict=True, zero_division=0)
    labels_sorted = sorted(set(labels))
    metrics = {
        "training_samples": len(x_train),
        "test_samples": len(x_test),
        "classes": labels_sorted,
        "accuracy": accuracy_score(y_test, predictions),
        "macro_precision": report["macro avg"]["precision"],
        "macro_recall": report["macro avg"]["recall"],
        "macro_f1": report["macro avg"]["f1-score"],
        "classification_report": report,
        "confusion_matrix": {
            "labels": labels_sorted,
            "matrix": confusion_matrix(y_test, predictions, labels=labels_sorted).tolist(),
        },
    }

    MODEL_DIR.mkdir(exist_ok=True)
    dump(model, MODEL_DIR / "resume_classifier.joblib")
    with (MODEL_DIR / "resume_classifier_metrics.json").open("w", encoding="utf-8") as file:
        json.dump(metrics, file, indent=2)

    return metrics


def main():
    parser = argparse.ArgumentParser(description="Train resume category classifier.")
    parser.add_argument("--max-per-category", type=int, default=None)
    parser.add_argument("--no-resume-csv", action="store_true")
    args = parser.parse_args()

    metrics = train_classifier(
        max_per_category=args.max_per_category,
        use_resume_csv=not args.no_resume_csv,
    )
    print(json.dumps({k: metrics[k] for k in ["accuracy", "macro_f1", "training_samples", "test_samples"]}, indent=2))


if __name__ == "__main__":
    main()
