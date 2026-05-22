import re

from services.preprocessing import extract_section, normalize_for_matching, top_tfidf_keywords


SKILL_ALIASES = {
    "c": ["c", "c programming"],
    "python": ["python", "python3"],
    "java": ["java"],
    "javascript": ["javascript", "js"],
    "typescript": ["typescript", "ts"],
    "c++": ["c++", "cpp"],
    "c#": ["c#", "c sharp"],
    "sql": ["sql", "mysql", "postgresql", "postgres", "oracle sql"],
    "mysql": ["mysql"],
    "postgresql": ["postgresql", "postgres"],
    "oracle": ["oracle", "oracle database"],
    "mongodb": ["mongodb", "mongo db"],
    "redis": ["redis"],
    "react": ["react", "react.js", "reactjs"],
    "angular": ["angular", "angularjs"],
    "vue.js": ["vue", "vue.js", "vuejs"],
    "node.js": ["node.js", "nodejs", "node"],
    "express.js": ["express", "express.js"],
    "next.js": ["next.js", "nextjs", "next"],
    "fastapi": ["fastapi"],
    "django": ["django"],
    "flask": ["flask"],
    "spring boot": ["spring boot", "springboot"],
    "html": ["html", "html5"],
    "css": ["css", "css3"],
    "bootstrap": ["bootstrap"],
    "tailwind css": ["tailwind", "tailwind css"],
    "aws": ["aws", "amazon web services"],
    "azure": ["azure", "microsoft azure"],
    "gcp": ["gcp", "google cloud"],
    "docker": ["docker"],
    "kubernetes": ["kubernetes", "k8s"],
    "devops": ["devops", "dev ops"],
    "terraform": ["terraform"],
    "jenkins": ["jenkins"],
    "ci/cd": ["ci cd", "ci/cd", "continuous integration", "continuous deployment"],
    "git": ["git", "github", "gitlab"],
    "linux": ["linux", "unix"],
    "rest api": ["rest api", "restful api", "rest"],
    "machine learning": ["machine learning", "ml"],
    "deep learning": ["deep learning"],
    "artificial intelligence": ["artificial intelligence", "ai"],
    "nlp": ["nlp", "natural language processing"],
    "computer vision": ["computer vision"],
    "data analysis": ["data analysis", "data analytics"],
    "data visualization": ["data visualization", "visualization"],
    "tableau": ["tableau"],
    "power bi": ["power bi", "powerbi"],
    "excel": ["excel", "microsoft excel"],
    "tensorflow": ["tensorflow"],
    "pytorch": ["pytorch"],
    "keras": ["keras"],
    "scikit-learn": ["scikit learn", "scikit-learn", "sklearn"],
    "pandas": ["pandas"],
    "numpy": ["numpy"],
    "matplotlib": ["matplotlib"],
    "seaborn": ["seaborn"],
    "statistics": ["statistics", "statistical analysis"],
    "spark": ["spark", "apache spark", "pyspark"],
    "hadoop": ["hadoop"],
    "airflow": ["airflow", "apache airflow"],
    "etl": ["etl"],
    "api development": ["api development", "rest api", "restful api"],
    "system design": ["system design"],
    "microservices": ["microservices", "microservice"],
    "software testing": ["software testing", "testing"],
    "selenium": ["selenium"],
    "pytest": ["pytest"],
    "junit": ["junit"],
    "cybersecurity": ["cybersecurity", "cyber security", "information security"],
    "network security": ["network security"],
    "penetration testing": ["penetration testing", "pentesting"],
    "firewall": ["firewall", "firewalls"],
    "tcp/ip": ["tcp ip", "tcp/ip"],
    "dns": ["dns"],
    "dhcp": ["dhcp"],
    "android": ["android", "android development"],
    "kotlin": ["kotlin"],
    "swift": ["swift"],
    "project management": ["project management"],
    "agile": ["agile", "scrum"],
    "ui ux": ["ui ux", "ui/ux", "user experience"],
    "figma": ["figma"],
    "wireframing": ["wireframing", "wireframe"],
}
NORMALIZED_ALIAS_TERMS = {
    normalize_for_matching(variant)
    for variants in SKILL_ALIASES.values()
    for variant in variants
}


def _phrase_in_text(phrase: str, normalized_text: str) -> bool:
    phrase = normalize_for_matching(phrase)
    escaped = re.escape(phrase).replace(r"\ ", r"\s+")
    return bool(re.search(rf"(?<![a-z0-9]){escaped}(?![a-z0-9])", normalized_text))


def extract_skills(text: str, extra_terms: list[str] | None = None) -> list[str]:
    normalized = normalize_for_matching(text)
    skills = set()

    aliases = dict(SKILL_ALIASES)
    for term in extra_terms or []:
        clean = normalize_for_matching(term)
        if clean:
            aliases.setdefault(clean, [clean])

    for canonical, variants in aliases.items():
        if any(_phrase_in_text(variant, normalized) for variant in variants):
            skills.add(canonical)

    skills_section = extract_section(text, ["skills", "technical skills"])
    for chunk in re.split(r"[,;/|]", skills_section):
        clean = normalize_for_matching(chunk)
        clean = clean.strip(" .,-")
        if clean in NORMALIZED_ALIAS_TERMS:
            skills.add(clean)

    return sorted(skills)


def extract_keywords(text: str, limit: int = 15) -> list[str]:
    keywords = set(extract_skills(text))
    keywords.update(top_tfidf_keywords(text, limit=limit))
    return sorted(keywords)[:limit]
