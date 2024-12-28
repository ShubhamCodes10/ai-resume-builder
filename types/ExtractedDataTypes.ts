export interface ExtractedData {
  name?: string;
  email?: string;
  links?: string[];
  education?: {
    university?: string;
    degree?: string;
    year?: string;
  }[];
  skills?: {
    languages?: string[];
    technologies?: string[];
    databases?: string[];
    tools?: string[];
  };
  experience?: {
    company?: string;
    position?: string;
    duration?: string;
    responsibilities?: string[];
  }[];
  projects?: {
    title?: string;
    techStack?: string;
    demoLink?: string;
    githubLink?: string;
    points?: string[];
  }[];
}
