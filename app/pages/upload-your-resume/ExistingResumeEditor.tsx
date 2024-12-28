"use client";

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import AiChecker from '@/components/AiChecker';
import { ExtractedData } from '@/types/ExtractedDataTypes';



const PointsEditor: React.FC<{ points: string[], onChange: (points: string[]) => void }> = ({ points, onChange }) => {
  return (
    <div className="space-y-3">
      {points.map((point, index) => (
        <div key={index} className="flex items-start gap-2 group">
          <Input
            value={point}
            onChange={(e) => {
              const newPoints = [...points];
              newPoints[index] = e.target.value;
              onChange(newPoints);
            }}
            placeholder={`Point ${index + 1}`}
            className="flex-grow transition-all duration-200 hover:border-blue-300 focus:border-blue-500"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(points.filter((_, i) => i !== index))}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...points, ''])}
        className="mt-2 text-blue-600 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Point
      </Button>
    </div>
  );
};

const ExistingResumeEditor: React.FC = () => {
  const { resumeData, updateResumeData, existingResume } = useResumeContext();

  useEffect(() => {
    if (existingResume) {
      // If there's existing resume data in the context, update the form
      updateResumeDataFromExtracted(existingResume);
    } else {
      // If no data in context, try to get it from localStorage
      const storedData = localStorage.getItem('extractedResumeData');
      if (storedData) {
        const parsedData: ExtractedData = JSON.parse(storedData);
        updateResumeDataFromExtracted(parsedData);
      }
    }
  }, [existingResume]);

  const updateResumeDataFromExtracted = (extractedData: ExtractedData) => {
    updateResumeData({
      personalInfo: {
        fullName: extractedData.name || '',
        email: extractedData.email || '',
        linkedin: extractedData.links?.find(link => link.includes('linkedin.com')) || '',
        github: extractedData.links?.find(link => link.includes('github.com')) || '',
        portfolio: extractedData.links?.find(link => !link.includes('linkedin.com') && !link.includes('github.com')) || '',
        phone: resumeData.personalInfo.phone, // Preserve existing data
        location: resumeData.personalInfo.location, // Preserve existing data
      },
      education: extractedData.education?.map(edu => ({
        institution: edu.university || '',
        degree: edu.degree || '',
        startDate: edu.year ? edu.year.split('-')[0] : '',
        endDate: edu.year ? edu.year.split('-')[1] : '',
        location: '', // This field is not in your ExtractedData
        gpa: '', // This field is not in your ExtractedData
      })) || [],
      experience: extractedData.experience?.map(exp => ({
        company: exp.company || '',
        role: exp.position || '',
        startDate: exp.duration ? exp.duration.split('-')[0] : '',
        endDate: exp.duration ? exp.duration.split('-')[1] : '',
        location: '', // This field is not in your ExtractedData
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
      summary: resumeData.summary, // Preserve existing data
      certifications: resumeData.certifications, // Preserve existing data
      languages: resumeData.languages, // Preserve existing data
      interests: resumeData.interests, // Preserve existing data
    });
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateResumeData({
      personalInfo: {
        ...resumeData.personalInfo,
        [name]: value
      }
    });
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateResumeData({ summary: e.target.value });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    updateResumeData({ education: updatedEducation });
  };

  const handleExperienceChange = (index: number, field: string, value: string | string[]) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    updateResumeData({ experience: updatedExperience });
  };

  const handleProjectChange = (index: number, field: string, value: string | string[]) => {
    const updatedProjects = [...resumeData.projects];updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    updateResumeData({ projects: updatedProjects });
  };

  const handleSkillsChange = (skills: string[]) => {
    updateResumeData({ additionalSkills: skills });
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="fullName"
            value={resumeData.personalInfo.fullName}
            onChange={handlePersonalInfoChange}
            placeholder="Full Name"
            className="w-full"
          />
          <Input
            type="email"
            name="email"
            value={resumeData.personalInfo.email}
            onChange={handlePersonalInfoChange}
            placeholder="Email Address"
            className="w-full"
          />
          <Input
            type="tel"
            name="phone"
            value={resumeData.personalInfo.phone}
            onChange={handlePersonalInfoChange}
            placeholder="Phone Number"
            className="w-full"
          />
          <Input
            type="text"
            name="location"
            value={resumeData.personalInfo.location}
            onChange={handlePersonalInfoChange}
            placeholder="Location"
            className="w-full"
          />
          <Input
            type="text"
            name="linkedin"
            value={resumeData.personalInfo.linkedin}
            onChange={handlePersonalInfoChange}
            placeholder="LinkedIn Profile"
            className="w-full"
          />
          <Input
            type="text"
            name="github"
            value={resumeData.personalInfo.github}
            onChange={handlePersonalInfoChange}
            placeholder="GitHub Profile"
            className="w-full"
          />
          <Input
            type="text"
            name="portfolio"
            value={resumeData.personalInfo.portfolio}
            onChange={handlePersonalInfoChange}
            placeholder="Portfolio Website (Optional)"
            className="w-full"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Summary</h3>
        <AiChecker
          data={resumeData.summary}
          format='paras'
          sectionType='summary'
          onApply={(newSummary) => updateResumeData({ summary: newSummary as string })}
        />
        <Textarea
          value={resumeData.summary}
          onChange={handleSummaryChange}
          placeholder="Write a brief professional summary"
          className="w-full h-32"
        />
      </div>

      {/* Skills */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills</h3>
        <AiChecker
          data={resumeData.additionalSkills.join(', ')}
          format='paras'
          sectionType='skills'
          onApply={(newSkills) => updateResumeData({ additionalSkills: typeof newSkills === 'string' ? newSkills.split(',').map(skill => skill.trim()) : newSkills })}
        />
        <Textarea
          value={resumeData.additionalSkills.join(', ')}
          onChange={(e) => handleSkillsChange(e.target.value.split(',').map(skill => skill.trim()))}
          placeholder="Enter your skills, separated by commas"
          className="w-full h-32"
        />
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Experience</h3>
          <Button onClick={() => updateResumeData({ experience: [...resumeData.experience, { company: '', role: '', location: '', startDate: '', endDate: '', responsibilities: [] }] })} className="bg-blue-600 hover:bg-blue-700">
            Add Experience
          </Button>
        </div>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={exp.company}
              onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
              placeholder="Company"
              className="w-full"
            />
            <Input
              type="text"
              value={exp.role}
              onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
              placeholder="Role"
              className="w-full"
            />
            <Input
              type="text"
              value={exp.location}
              onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
              placeholder="Location"
              className="w-full"
            />
            <Input
              type="text"
              value={exp.startDate}
              onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
              placeholder="Start Date"
              className="w-full"
            />
            <Input
              type="text"
              value={exp.endDate}
              onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
              placeholder="End Date"
              className="w-full"
            />
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsibilities
              </label>
              <AiChecker
                data={exp.responsibilities.join('\n')}
                format='points'
                sectionType='experience'
                onApply={(newResponsibilities) => handleExperienceChange(index, 'responsibilities', Array.isArray(newResponsibilities) ? newResponsibilities : newResponsibilities.split('\n'))}
              />
              <PointsEditor
                points={exp.responsibilities}
                onChange={(points) => handleExperienceChange(index, 'responsibilities', points)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Projects</h3>
          <Button onClick={() => updateResumeData({ projects: [...resumeData.projects, { name: '', description: '', points: [], link: '', gitLink: '' }] })} className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="w-4 h-4 mr-2" /> Add Project
          </Button>
        </div>
        {resumeData.projects.map((project, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={project.name}
              onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
              placeholder="Project Name"
              className="w-full"
            />
            <Input
              type="text"
              value={project.link}
              onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
              placeholder="Project Link (Optional)"
              className="w-full"
            />
            <Input
              type="text"
              value={project.gitLink}
              onChange={(e) => handleProjectChange(index, 'gitLink', e.target.value)}
              placeholder="GitHub Link (Optional)"
              className="w-full"
            />
            <Textarea
              value={project.description}
              onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
              placeholder="Project Description"
              className="w-full col-span-2 h-24"
            />
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Points
              </label>
              <AiChecker
                data={project.points.join('\n')}
                format='points'
                sectionType='project'
                onApply={(newPoints) => handleProjectChange(index, 'points', Array.isArray(newPoints) ? newPoints : newPoints.split('\n'))}
              />
              <PointsEditor
                points={project.points}
                onChange={(points) => handleProjectChange(index, 'points', points)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Education</h3>
          <Button onClick={() => updateResumeData({ education: [...resumeData.education, { institution: '', degree: '', location: '', startDate: '', endDate: '', gpa: '' }] })} className="bg-blue-600 hover:bg-blue-700">
            Add Education
          </Button>
        </div>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={edu.institution}
              onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
              placeholder="Institution"
              className="w-full"
            />
            <Input
              type="text"
              value={edu.degree}
              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
              placeholder="Degree"
              className="w-full"
            />
            <Input
              type="text"
              value={edu.location}
              onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
              placeholder="Location"
              className="w-full"
            />
            <Input
              type="text"
              value={edu.startDate}
              onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
              placeholder="Start Date"
              className="w-full"
            />
            <Input
              type="text"
              value={edu.endDate}
              onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
              placeholder="End Date"
              className="w-full"
            />
            <Input
              type="text"
              value={edu.gpa}
              onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
              placeholder="GPA (Optional)"
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExistingResumeEditor;

