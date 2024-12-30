"use client";

import React, { useRef, useState } from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import html2pdf from 'html2pdf.js';
import { templateStyles } from '@/templates/templateStyles';


const ResumePreview: React.FC<{ selectedTemplate: keyof typeof templateStyles }> = ({ 
  selectedTemplate = 'modern' 
}) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { resumeData } = useResumeContext();
  const styles = templateStyles[selectedTemplate];

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

  const renderSection = (title: string, children: React.ReactNode) => (
    <div className={cn("mb-3", styles.section)}>
      <h2 className={cn("text-sm font-bold pb-1 mb-1", styles.heading)}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Resume Preview</h2>
              <p className="text-gray-500 text-sm">ATS-optimized format</p>
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
          className={cn(
            "bg-white shadow-md mx-auto transition-all duration-300 rounded-lg overflow-hidden",
            selectedTemplate === 'creative' && 'bg-gradient-to-br from-white to-teal-50/10'
          )}
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '10mm',
            margin: '0 auto',
            fontSize: '9pt',
            lineHeight: '1.4',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {/* Personal Info */}
          <div className="text-center mb-3">
            <h1 className={cn("mb-1", styles.name)}>
              {resumeData.personalInfo.fullName.toUpperCase()}
            </h1>
            <div className={cn("flex flex-wrap justify-center gap-2 text-xs", styles.text)}>
              {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
              {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
              {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
              {resumeData.personalInfo.linkedin && (
                <a href={resumeData.personalInfo.linkedin} className={cn("hover:underline", styles.links)} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {resumeData.personalInfo.github && (
                <a href={resumeData.personalInfo.github} className={cn("hover:underline", styles.links)} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {resumeData.personalInfo.portfolio && (
                <a href={resumeData.personalInfo.portfolio} className={cn("hover:underline", styles.links)} target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              )}
            </div>
          </div>

          {/* Summary */}
          {resumeData.summary && renderSection("Professional Summary",
            <p className={cn("text-xs", styles.text)}>{resumeData.summary}</p>
          )}

          {/* Skills */}
          {resumeData.additionalSkills.length > 0 && renderSection("Skills",
            <p className={cn("text-xs", styles.text)}>{resumeData.additionalSkills.join(', ')}</p>
          )}

          {/* Experience */}
          {resumeData.experience.length > 0 && renderSection("Professional Experience",
            resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={cn("text-xs font-bold", styles.text)}>{exp.role}</h3>
                  <span className={cn("text-xs opacity-75", styles.text)}>{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className={cn("text-xs mb-0.5", styles.text)}>{exp.company}, {exp.location}</p>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className={cn("list-disc list-outside ml-4 text-xs space-y-0.5", styles.text)}>
                    {exp.responsibilities.map((resp, respIndex) => (
                      <li key={respIndex}>{resp.replace(/•/g, '').trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}

          {/* Projects */}
          {resumeData.projects.length > 0 && renderSection("Projects",
            resumeData.projects.map((project, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={cn("text-xs font-bold", styles.text)}>{project.name}</h3>
                  <div className="text-xs space-x-2">
                    {project.link && (
                      <a href={project.link} className={cn("hover:underline", styles.links)} target="_blank" rel="noopener noreferrer">
                        Demo
                      </a>
                    )}
                    {project.gitLink && (
                      <a href={project.gitLink} className={cn("hover:underline", styles.links)} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                <p className={cn("text-xs mb-2", styles.text)}>{project.description}</p>
                {project.points && project.points.length > 0 && (
                  <ul className={cn("list-disc list-outside ml-4 text-xs space-y-0.5", styles.text)}>
                    {project.points.map((point, pointIndex) => (
                      <li key={pointIndex}>{point.replace(/•/g, '').trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}

          {/* Education */}
          {resumeData.education.length > 0 && renderSection("Education",
            resumeData.education.map((edu, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className={cn("text-xs font-bold", styles.text)}>{edu.degree}</h3>
                  <span className={cn("text-xs opacity-75", styles.text)}>{edu.startDate} - {edu.endDate}</span>
                </div>
                <p className={cn("text-xs", styles.text)}>{edu.institution}, {edu.location}</p>
                {edu.gpa && <p className={cn("text-xs opacity-75", styles.text)}>GPA: {edu.gpa}</p>}
              </div>
            ))
          )}

          {/* Certifications */}
          {resumeData.certifications.length > 0 && renderSection("Achievements OR Certifications",
            resumeData.certifications.map((cert, index) => (
              <div key={index} className="mb-1">
                <span className={cn("text-xs font-semibold", styles.text)}>{cert.name}</span>
                <span className={cn("text-xs opacity-75", styles.text)}> - {cert.issuer}, {cert.issueDate}</span>
              </div>
            ))
          )}

          {/* Languages */}
          {resumeData.languages.length > 0 && renderSection("Languages",
            <p className={cn("text-xs", styles.text)}>
              {resumeData.languages.map((lang, index) => (
                <span key={index}>
                  {lang.name} ({lang.level})
                  {index < resumeData.languages.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          )}

          {/* Interests */}
          {resumeData.interests.length > 0 && renderSection("Interests",
            <p className={cn("text-xs", styles.text)}>
              {resumeData.interests.join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;

