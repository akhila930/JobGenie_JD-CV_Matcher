import os
import re
import nltk
import pdfplumber
import pytesseract
from PIL import Image
from pdf2image import convert_from_path
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import tempfile

# Download required NLTK data
nltk.download("punkt")
nltk.download("stopwords")
nltk.download("wordnet")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dictionary of Job Roles with Required Degrees and Skills
JOB_ROLES = {
    "Graphic Designer": {"degrees": ["bachelor", "diploma"], "skills": ["photoshop", "illustrator", "typography"]},
    "UI/UX Designer": {"degrees": ["bachelor", "diploma"], "skills": ["figma", "adobe xd", "wireframing"]},
    "Interior Designer": {"degrees": ["bachelor", "diploma"], "skills": ["autocad", "3ds max", "rendering"]},
    "Data Scientist": {"degrees": ["bachelor", "master", "phd"], "skills": ["machine learning", "deep learning", "nlp"]},
    "Software Engineer": {"degrees": ["bachelor", "master"], "skills": ["python", "java", "c++"]},
    "Marketing Manager": {"degrees": ["bachelor", "mba"], "skills": ["seo", "social media", "branding"]},
}

# Extract text from PDFs
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        if not text.strip():
            print("No text found in PDF. Running OCR...")
            images = convert_from_path(pdf_path)
            for img in images:
                text += pytesseract.image_to_string(img) + "\n"
    except Exception as e:
        print(f"Error processing PDF: {e}")
    return text.strip()

# Preprocess text
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    tokens = word_tokenize(text)
    tokens = [t for t in tokens if t not in stopwords.words("english")]
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(t) for t in tokens]
    return " ".join(tokens)

# Extract experience
def extract_experience(text):
    experience_matches = re.findall(r"(\d+)[+-]?\s*(?:years?|yrs?)\s*(?:of experience|experience|exp)?", text, re.IGNORECASE)
    experience_years = [int(match) for match in experience_matches]
    return max(experience_years, default=None)

# Extract qualifications
def extract_qualification(text, job_role):
    required_degrees = JOB_ROLES.get(job_role, {}).get("degrees", [])
    found_degrees = [degree for degree in required_degrees if degree in text.lower()]
    return len(found_degrees), found_degrees

# Extract key skills
def extract_skills(text, job_role):
    required_skills = JOB_ROLES.get(job_role, {}).get("skills", [])
    matched_skills = [skill for skill in required_skills if skill in text.lower()]
    return len(matched_skills), matched_skills

# Rank CVs
def rank_cvs(jd_text, cv_texts, job_role):
    jd_clean = preprocess_text(jd_text)
    cv_cleaned = [preprocess_text(cv) for cv in cv_texts]
    
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([jd_clean] + cv_cleaned)
    similarity_scores = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1:])[0]
    
    ranked_results = []
    for idx, cv_text in enumerate(cv_texts):
        experience = extract_experience(cv_text)
        experience_display = experience if experience is not None else 0
        skills_count, matched_skills = extract_skills(cv_text, job_role)
        qualification_count, matched_degrees = extract_qualification(cv_text, job_role)
        hybrid_score = (similarity_scores[idx] * 0.5) + ((experience_display or 0) * 0.2) + (skills_count * 0.2) + (qualification_count * 0.1)
        ranked_results.append({
            "id": str(idx + 1),
            "name": f"Resume_{idx + 1}",
            "score": hybrid_score,
            "experience": experience_display,
            "skills": matched_skills,
            "qualifications": matched_degrees,
            "preview": cv_text[:200] + "..."
        })
    ranked_results.sort(key=lambda x: x["score"], reverse=True)
    return ranked_results

@app.get("/")
def read_root():
    return {"message": "Resume Processing API"}

@app.get("/job-roles")
def get_job_roles():
    return {"roles": list(JOB_ROLES.keys())}

@app.post("/process-files")
async def process_files(
    job_description: UploadFile = File(...),
    resumes: List[UploadFile] = File(...),
    job_role: str = Form(...)
):
    try:
        # Create temporary directory for file processing
        with tempfile.TemporaryDirectory() as temp_dir:
            # Save job description
            jd_path = os.path.join(temp_dir, job_description.filename)
            with open(jd_path, "wb") as f:
                f.write(await job_description.read())
            jd_text = extract_text_from_pdf(jd_path)
            
            # Save and process resumes
            cv_texts = []
            for resume in resumes:
                resume_path = os.path.join(temp_dir, resume.filename)
                with open(resume_path, "wb") as f:
                    f.write(await resume.read())
                cv_texts.append(extract_text_from_pdf(resume_path))
            
            # Process and rank the resumes
            results = rank_cvs(jd_text, cv_texts, job_role)
            return {"results": results}
    
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)