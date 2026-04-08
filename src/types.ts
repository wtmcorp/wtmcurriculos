export interface PersonalInfo {
  fullName: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Course {
  id: string;
  name: string;
  institution: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  targetJob: string;
  targetJobDescription: string;
  objective: string;
  experience: Experience[];
  education: Education[];
  courses: Course[];
  hardskills: string[];
  softskills: string[];
}

export interface AtsScore {
  total: number;
  keywordMatch: number;
  structure: number;
  impact: number;
  missingKeywords: string[];
  suggestions: string[];
}
