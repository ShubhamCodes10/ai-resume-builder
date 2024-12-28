export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio?: string;
    location: string;
  };
  summary: string;
  education: {
    institution: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }[];
  experience: {
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
  }[];
  projects: {
    name: string;
    description: string;
    points: string[];
    link?: string;
    gitLink?: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    issueDate: string;
  }[];
  additionalSkills: string[];
  languages: {
    name: string;
    level: string;
  }[];
  interests: string[];
}

