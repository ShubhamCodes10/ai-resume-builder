interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  education?: {
    degree?: string;
    field?: string;
  };
  skills?: string[];
}

interface ResumeJSON {
  text: string;
  metadata: {
    pageCount: number;
    info: any;
  };
}

export function parseResumeData(resumeJSON: ResumeJSON): ParsedResumeData {
  const text = resumeJSON.text;
  console.log('Parsing resume data. Text length:', text.length);
  const parsedData: ParsedResumeData = {};
  
  // Improved regex patterns for better matching
  const nameMatch = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m);
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  const phoneMatch = text.match(/(?:\+\d{1,2}\s?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);
  const educationMatch = text.match(/(Bachelor(?:'s)?|Master(?:'s)?|Ph\.D\.?|Associate(?:'s)?)\s+(?:of|in|degree\sin)\s+([A-Za-z\s&]+)/i);
  
  // Improved skills extraction
  const skillsSection = text.match(/(?:Technical\s+)?Skills?:?([\s\S]*?)(?:\n\n|\n(?=[A-Z][a-z]+:)|$)/i);
  
  if (nameMatch) parsedData.name = nameMatch[1].trim();
  if (emailMatch) parsedData.email = emailMatch[0];
  if (phoneMatch) parsedData.phone = phoneMatch[0];
  
  if (educationMatch) {
    parsedData.education = {
      degree: educationMatch[1].trim(),
      field: educationMatch[2].trim()
    };
  }

  if (skillsSection) {
    parsedData.skills = skillsSection[1]
      .split(/[,\n•]/) // Split by comma, newline, or bullet points
      .map(skill => skill.trim())
      .filter(skill => skill.length > 2); // Filter out very short or empty strings
  }

  console.log('Parsed data:', parsedData);
  return parsedData;
}
