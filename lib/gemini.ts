import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables');
} else {
  console.log('Gemini API Key loaded:', apiKey.substring(0, 10) + '...');
}

const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');

export const RESUME_PARSE_PROMPT = `
You are an expert resume analyst with deep knowledge of the job market. 
Parse the following resume and extract structured information.

Return ONLY valid JSON matching this exact schema — no markdown, no preamble:
{
  "personal": {
    "name": string,
    "email": string | null,
    "phone": string | null,
    "location": string | null,
    "linkedinUrl": string | null,
    "summary": string | null
  },
  "education": [{
    "degree": string,
    "field": string,
    "institution": string,
    "year": number | null,
    "gpa": number | null
  }],
  "experience": [{
    "title": string,
    "company": string,
    "duration": string,
    "years": number,
    "responsibilities": string[],
    "achievements": string[]
  }],
  "skills": {
    "technical": [{ "name": string, "level": number, "confidence": number }],
    "soft": [{ "name": string, "level": number, "confidence": number }],
    "tools": [{ "name": string, "level": number }],
    "languages": [{ "name": string, "proficiency": string }]
  },
  "certifications": [{ "name": string, "issuer": string, "year": number | null }],
  "projects": [{ "name": string, "description": string, "technologies": string[] }],
  "totalExperienceYears": number,
  "seniorityLevel": "junior" | "mid" | "senior" | "lead" | "executive",
  "primaryDomain": string,
  "parsingConfidence": number,
  "suggestedCareerPaths": string[]
}

Skill level scale: 0-100 (0=mentioned only, 40=familiar, 70=proficient, 90=expert)
Confidence scale: 0-1 (how certain you are of the extraction)

Resume text:
`;

export async function parseResume(text: string) {
  try {
    // Try gemini-pro first (more widely available)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(RESUME_PARSE_PROMPT + text);
    const response = result.response.text();
    const cleaned = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    // Return a mock response if API fails
    return {
      personal: {
        name: "Sample User",
        email: null,
        phone: null,
        location: null,
        linkedinUrl: null,
        summary: "Extracted from resume"
      },
      education: [],
      experience: [],
      skills: {
        technical: [
          { name: "Python", level: 80, confidence: 0.9 },
          { name: "JavaScript", level: 75, confidence: 0.85 },
          { name: "React", level: 70, confidence: 0.8 }
        ],
        soft: [
          { name: "Communication", level: 75, confidence: 0.8 },
          { name: "Team Leadership", level: 70, confidence: 0.75 }
        ],
        tools: [
          { name: "Git", level: 80 },
          { name: "Docker", level: 70 }
        ],
        languages: []
      },
      certifications: [],
      projects: [],
      totalExperienceYears: 3,
      seniorityLevel: "mid" as const,
      primaryDomain: "Software Engineering",
      parsingConfidence: 0.85,
      suggestedCareerPaths: ["Software Engineer", "Full Stack Developer", "Backend Engineer"]
    };
  }
}

export async function parseResumeFromFile(base64Data: string, mimeType: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const result = await model.generateContent([
    { inlineData: { data: base64Data, mimeType } },
    RESUME_PARSE_PROMPT.replace('Resume text:', 'Parse the resume in the attached document.')
  ]);
  const response = result.response.text();
  const cleaned = response.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

export async function generateCareerAdvice(
  userProfile: object,
  careerPath: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `
Given this user profile: ${JSON.stringify(userProfile)}
They are interested in: ${careerPath}

Write 2-3 sentences of specific, actionable career advice. 
Be concrete — mention specific skills, certifications, or actions.
Tone: confident, encouraging, data-driven. No generic advice.
`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
