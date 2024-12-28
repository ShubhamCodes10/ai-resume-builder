"use client";

import React, { useRef, useState } from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import html2pdf from 'html2pdf.js';

const ResumePreview: React.FC = () => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { resumeData } = useResumeContext();

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setIsLoading(true);

    try {
      const element = resumeRef.current;

      const options = {
        margin: [10, 10, 10, 10], 
        filename: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#ffffff',
          logging: true,
          windowWidth: 794, 
          windowHeight: 1123, 
        },
        jsPDF: { 
          unit: 'pt', 
          format: 'a4', 
          orientation: 'portrait',
        },
        pagebreak: { mode: 'avoid-all' }, 
      };

      await html2pdf().from(element).set(options).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Resume Preview</h2>
              <p className="text-gray-500 text-sm">
                ATS-optimized format
              </p>
            </div>
          </div>
          <Button
            onClick={handleDownloadPDF}
            disabled={isLoading}
            className={cn(
              'bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2',
              'px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300',
              'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:translate-y-[-1px]'
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Generating PDF...' : 'Download PDF'}</span>
          </Button>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div
          ref={resumeRef}
          className="bg-white shadow-md mx-auto transition-all duration-300 rounded-lg overflow-hidden"
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '10mm', // Reduced padding
            margin: '0 auto',
            fontSize: '9pt',
            lineHeight: '1.4',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          <PersonalInfo />
          <Summary />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Certifications />
          <Languages />
          <Interests />
        </div>
      </div>
    </div>
  );
};

const PersonalInfo: React.FC = () => {
  const { resumeData } = useResumeContext();
  const { fullName, email, phone, location, linkedin, github, portfolio } = resumeData.personalInfo;

  return (
    <div className="text-center mb-3 mt-0"> {/* Removed default top margin */}
      <h1 className="text-xl font-bold text-gray-900 mb-1 leading-tight"> {/* Added leading-tight */}
        {fullName.toUpperCase()}
      </h1>
      <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-700">
        {email && <span>{email}</span>}
        {phone && <span>{phone}</span>}
        {location && <span>{location}</span>}
        {linkedin && <a href={linkedin} className="text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a>}
        {github && <a href={github} className="text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>}
        {portfolio && <a href={portfolio} className="text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">Portfolio</a>}
      </div>
    </div>
  );
};

const Summary: React.FC = () => {
  const { resumeData } = useResumeContext()
  return (
    resumeData.summary && (
      <div className="mb-3">
        <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-1 uppercase">Professional Summary</h2>
        <p className="text-xs text-gray-700">{resumeData.summary}</p>
      </div>
    )
  )
}

const Experience: React.FC = () => {
  const { resumeData } = useResumeContext()

  return (
    resumeData.experience.length > 0 && (
      <div className="mb-3">
        <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-1 uppercase">
          Professional Experience
        </h2>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between items-baseline mb-0.5">
              <h3 className="text-xs font-bold text-gray-900">{exp.role}</h3>
              <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-xs text-gray-700 mb-0.5">{exp.company}, {exp.location}</p>
            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <ul className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5">
                {exp.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex}>
                    {resp.replace(/•/g, '').trim()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    )
  )
}

const Projects: React.FC = () => {
  const { resumeData } = useResumeContext()

  return (
    resumeData.projects.length > 0 && (
      <div className="mb-3">
        <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-1 uppercase">
          Projects
        </h2>
        {resumeData.projects.map((project, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between items-baseline mb-0.5">
              <h3 className="text-xs font-bold text-gray-900">{project.name}</h3>
              <div className="text-xs space-x-2">
                {project.link && (
                  <a href={project.link} className="text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">
                    Demo
                  </a>
                )}
                {project.gitLink && (
                  <a href={project.gitLink} className="text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-700 mb-2">{project.description}</p>
            {project.points && project.points.length > 0 && (
              <ul className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5">
                {project.points.map((point, pointIndex) => (
                  <li key={pointIndex}>
                    {point.replace(/•/g, '').trim()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    )
  )
}

const Education: React.FC = () => {
  const { resumeData } = useResumeContext()

  return (
    resumeData.education.length > 0 && (
      <div className="mb-3">
        <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-1 uppercase">Education</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xs font-bold text-gray-900">{edu.degree}</h3>
              <span className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</span>
            </div>
            <p className="text-xs text-gray-700">{edu.institution}, {edu.location}</p>
            {edu.gpa && (
              <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
            )}
          </div>
        ))}
      </div>
    )
  )
}

const Skills: React.FC = () => {
  const { resumeData } = useResumeContext()

  return (
    resumeData.additionalSkills && resumeData.additionalSkills.length > 0 && (
      <div className="mb-3">
        <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-1 uppercase">
          Skills
        </h2>
        <p className="text-xs text-gray-700">
          {resumeData.additionalSkills.join(', ')}
        </p>
      </div>
    )
  )
}

const Certifications: React.FC = () => {
  const { resumeData } = useResumeContext()

  return (
    resumeData.certifications.length > 0 && (
      <div className="mb-3">
        <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-1 uppercase">
        Achievements OR Certifications
        </h2>
        {resumeData.certifications.map((cert, index) => (
          <div key={index} className="mb-1">
            <span className="text-xs font-semibold text-gray-900">{cert.name}</span>
            <span className="text-xs text-gray-600"> - {cert.issuer}, {cert.issueDate}</span>
          </div>
        ))}
      </div>
    )
  )
}

const Languages: React.FC = () => {
  const { resumeData } = useResumeContext()

  return (
    resumeData.languages.length > 0 && (
      <div className="mb-3">
        <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-1 uppercase">
          Languages
        </h2>
        <p className="text-xs text-gray-700">
          {resumeData.languages.map((lang, index) => (
            <span key={index}>
              {lang.name} ({lang.level})
              {index < resumeData.languages.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </div>
    )
  )
}

const Interests: React.FC = () => {
  const { resumeData } = useResumeContext()

  return (
    resumeData.interests.length > 0 && (
      <div className="mb-3">
        <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-1 uppercase">
          Interests
        </h2>
        <p className="text-xs text-gray-700">
          {resumeData.interests.join(', ')}
        </p>
      </div>
    )
  )
}

export default ResumePreview;

