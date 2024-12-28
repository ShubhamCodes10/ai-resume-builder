"use client";

import React, { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useResumeContext } from '@/context/ResumeContext';
import { optimizeForATS } from '@/app/utils/atsOptimizer';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExtractedData } from '@/types/ExtractedDataTypes';

const ExistingResumePreview: React.FC = () => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { resumeData, updateResumeData } = useResumeContext();

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setIsLoading(true);

    try {
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 4, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Enhanced link processing
      const links = element.getElementsByTagName('a');
      Array.from(links).forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) return;

        const rect = link.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        // Calculate relative positions
        const relativeX = (rect.left - elementRect.left) * (pdfWidth / elementRect.width);
        const relativeY = (rect.top - elementRect.top) * (pdfHeight / elementRect.height);
        const width = rect.width * (pdfWidth / elementRect.width);
        const height = rect.height * (pdfHeight / elementRect.height);

        // Add clickable area with padding
        pdf.link(
          relativeX - 2,
          relativeY - 2,
          width + 4,
          height + 4,
          { url: href }
        );
      });

      // Add ATS optimization
      const atsContent = optimizeForATS(element.innerText);
      pdf.setFontSize(1);
      pdf.setTextColor(255, 255, 255);
      pdf.text(atsContent, 10, pdfHeight - 10);

      pdf.save(`${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(resumeData).length === 0) {
      // If resumeData is empty, try to get it from localStorage
      const storedData = localStorage.getItem('extractedResumeData');
      if (storedData) {
        const parsedData: ExtractedData = JSON.parse(storedData);
        updateResumeDataFromExtracted(parsedData);
      }
    }
  }, [resumeData, updateResumeData]);

  const updateResumeDataFromExtracted = (extractedData: ExtractedData) => {
    updateResumeData({
      personalInfo: {
        fullName: extractedData.name || '',
        email: extractedData.email || '',
        linkedin: extractedData.links?.find(link => link.includes('linkedin.com')) || '',
        github: extractedData.links?.find(link => link.includes('github.com')) || '',
        portfolio: extractedData.links?.find(link => !link.includes('linkedin.com') && !link.includes('github.com')) || '',
        phone: '',
        location: '',
      },
      education: extractedData.education?.map(edu => ({
        institution: edu.university || '',
        degree: edu.degree || '',
        startDate: edu.year ? edu.year.split('-')[0] : '',
        endDate: edu.year ? edu.year.split('-')[1] : '',
        location: '',
        gpa: '',
      })) || [],
      experience: extractedData.experience?.map(exp => ({
        company: exp.company || '',
        role: exp.position || '',
        startDate: exp.duration ? exp.duration.split('-')[0] : '',
        endDate: exp.duration ? exp.duration.split('-')[1] : '',
        location: '',
        responsibilities: exp.responsibilities || [],
      })) || [],
      projects: extractedData.projects?.map(project => ({
        name: project.title || '',
        description: project.techStack || '',
        link: project.demoLink || '',
        gitLink: project.githubLink || '',
        points: project.points || [],
      })) || [],
      additionalSkills: [
        ...(extractedData.skills?.languages || []),
        ...(extractedData.skills?.technologies || []),
        ...(extractedData.skills?.databases || []),
        ...(extractedData.skills?.tools || []),
      ],
      summary: '',
      certifications: [],
      languages: [],
      interests: [],
    });
  };


  return (
    <div className="space-y-4 max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
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
              <Loader2 className="w-4 h-4 animate-spin"/>
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
            padding: '15mm',
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
        </div>
      </div>
    </div>
  );
};

const PersonalInfo: React.FC = () => {
  const { resumeData } = useResumeContext();

  return (
    <div className="text-center mb-4">
      <h1 className="text-xl font-bold text-gray-900 mb-1">
        {resumeData.personalInfo.fullName}
      </h1>
      <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-700">
        <span>{resumeData.personalInfo.email}</span>
        <span>{resumeData.personalInfo.phone}</span>
        <span>{resumeData.personalInfo.location}</span>
        {resumeData.personalInfo.linkedin && <a href={resumeData.personalInfo.linkedin} className="text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a>}
        {resumeData.personalInfo.github && <a href={resumeData.personalInfo.github} className="text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>}
        {resumeData.personalInfo.portfolio && <a href={resumeData.personalInfo.portfolio} className="text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">Portfolio</a>}
      </div>
    </div>
  );
};

const Summary: React.FC = () => {
  const { resumeData } = useResumeContext();
  return (
    resumeData.summary && (
      <div className="mb-3">
        <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-1 uppercase">Professional Summary</h2>
        <p className="text-xs text-gray-700">{resumeData.summary}</p>
      </div>
    )
  );
};

const Skills: React.FC = () => {
  const { resumeData } = useResumeContext();

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
  );
};

const Experience: React.FC = () => {
  const { resumeData } = useResumeContext();

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
  );
};

const Projects: React.FC = () => {
  const { resumeData } = useResumeContext();

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
  );
};

const Education: React.FC = () => {
  const { resumeData } = useResumeContext();

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
  );
};

export default ExistingResumePreview;

