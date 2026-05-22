export type UserStatus = 'student' | 'job_seeker' | 'employed' | 'career_changer' | 'entrepreneur';
export type WorkMode = 'remote' | 'hybrid' | 'in_office';
export type SeniorityLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
export type SkillCategory = 'technical' | 'soft' | 'domain';
export type SkillSource = 'resume' | 'manual' | 'assessment';
export type DemandLevel = 'very_high' | 'high' | 'medium' | 'low';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  status?: UserStatus;
  workMode?: WorkMode;
  experience?: number;
  location?: string;
  linkedinUrl?: string;
  profileScore?: number;
  onboarded?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Skill {
  id: string;
  userId: string;
  name: string;
  category?: SkillCategory;
  level?: number;
  verified?: boolean;
  source?: SkillSource;
  addedAt?: Date;
}

export interface Interest {
  id: string;
  userId: string;
  domain: string;
}

export interface Goal {
  id: string;
  userId: string;
  type: string;
  timeline?: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName?: string;
  fileUrl?: string;
  rawText?: string;
  parsedData?: any;
  confidence?: number;
  parsedAt?: Date;
  isActive?: boolean;
}

export interface CareerPath {
  id: string;
  title: string;
  description?: string;
  avgSalary?: number;
  salaryRange?: { min: number; max: number; currency: string };
  demandLevel?: DemandLevel;
  growthPct?: number;
  timelineYears?: { min: number; max: number };
  requiredSkills?: Array<{ name: string; level: number; weight: number }>;
  industry?: string;
  roles?: string[];
  resources?: Array<{ title: string; url: string; type: string }>;
  updatedAt?: Date;
}

export interface Recommendation {
  id: string;
  userId: string;
  careerPathId: string;
  matchScore?: number;
  skillGapScore?: number;
  marketScore?: number;
  peerScore?: number;
  reasoning?: string;
  rank?: number;
  savedAt?: Date;
  generatedAt?: Date;
}

export interface MarketData {
  id: string;
  skill: string;
  role?: string;
  demandScore?: number;
  growthRate?: number;
  avgSalary?: number;
  jobCount?: number;
  region?: string;
  dataDate?: Date;
  source?: string;
}

export interface ParsedResume {
  personal: {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
    summary?: string;
  };
  education: Array<{
    degree: string;
    field: string;
    institution: string;
    year?: number;
    gpa?: number;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    years: number;
    responsibilities: string[];
    achievements: string[];
  }>;
  skills: {
    technical: Array<{ name: string; level: number; confidence: number }>;
    soft: Array<{ name: string; level: number; confidence: number }>;
    tools: Array<{ name: string; level: number }>;
    languages: Array<{ name: string; proficiency: string }>;
  };
  certifications: Array<{ name: string; issuer: string; year?: number }>;
  projects: Array<{ name: string; description: string; technologies: string[] }>;
  totalExperienceYears: number;
  seniorityLevel: SeniorityLevel;
  primaryDomain: string;
  parsingConfidence: number;
  suggestedCareerPaths: string[];
}
