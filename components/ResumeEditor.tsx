"use client"

import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ResumeData } from '@/types/resumetypes';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, TrashIcon, GripVerticalIcon, Pencil } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import AiChecker from './AiChecker';
import { cn } from '@/lib/utils';

interface ResumeEditorProps {
  points: string[];
  onChange: (points: string[]) => void;
  className?: string; 
 }

interface DraggableSectionProps {
  type: keyof ResumeData;
  index: number;
  onReorder: (type: keyof ResumeData, startIndex: number, endIndex: number) => void;
  onRemove: (type: keyof ResumeData, index: number) => void;
  children: React.ReactNode;
  className?: string;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({ type, index, onReorder, onRemove, children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      onReorder(type, dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cn(
        "group p-6 mb-4 bg-[#1a2644]/50 rounded-xl border border-blue-900/30 shadow-sm backdrop-blur-sm transition-all duration-300",
        "hover:border-blue-200 hover:shadow-md",
        isDragging ? "opacity-50" : "opacity-100",
        className 
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <GripVerticalIcon className="w-5 h-5 text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
          <Pencil className="w-4 h-4 text-gray-400" />
        </div>
        <Button
          onClick={() => onRemove(type, index)}
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      </div>
      {children}
    </div>
  );
};


const PointsEditor: React.FC<{ points: string[], onChange: (points: string[]) => void, className: string }> = ({ points, onChange }) => {
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

const ResumeEditor: React.FC<ResumeEditorProps> = ({ points, onChange, className }) => {
  const { resumeData, updateResumeData } = useResumeContext();

  const handleExperiencePointsChange = (index: number, points: string[]) => {
    const updatedExperience = resumeData.experience.map((exp, i) =>
      i === index ? { ...exp, responsibilities: points } : exp
    );
    updateResumeData({ experience: updatedExperience });
  };

  const handleProjectPointsChange = (index: number, points: string[]) => {
    const updatedProjects = resumeData.projects.map((project, i) =>
      i === index ? { ...project, points: points } : project
    );
    updateResumeData({ projects: updatedProjects });
  };

  const handleReorder = (type: keyof ResumeData, startIndex: number, endIndex: number) => {
    const updatedSection = [...resumeData[type] as any[]];
    const [removed] = updatedSection.splice(startIndex, 1);
    updatedSection.splice(endIndex, 0, removed);
    updateResumeData({ [type]: updatedSection });
  };

  const handleRemove = (type: keyof ResumeData, index: number) => {
    const updatedSection = [...resumeData[type] as any[]];
    updatedSection.splice(index, 1);
    updateResumeData({ [type]: updatedSection });
  };

  const handleAdd = (type: keyof ResumeData) => {
    const updatedSection = [...resumeData[type] as any[]];
    let newEntry = {};
    switch (type) {
      case "education":
        newEntry = {
          institution: "",
          degree: "",
          location: "",
          startDate: "",
          endDate: "",
          gpa: "",
        };
        break;
      case "experience":
        newEntry = {
          company: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          responsibilities: [],
        };
        break;
      case "projects":
        newEntry = {
          name: "",
          description: "",
          points: [],
          link: "",
          gitLink: "",
        };
        break;
      case "certifications":
        newEntry = {
          name: "",
          issuer: "",
          issueDate: "",
        };
        break;
      case "languages":
        newEntry = {
          name: "",
          level: "",
        };
        break;
    }
    updatedSection.push(newEntry);
    updateResumeData({ [type]: updatedSection });
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedPersonalInfo = {
      ...resumeData.personalInfo,
      [name]: value
    };
    updateResumeData({ personalInfo: updatedPersonalInfo });
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateResumeData({ summary: e.target.value });
  };

  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedEducation = resumeData.education.map((edu, i) =>
      i === index ? { ...edu, [name]: value } : edu
    );
    updateResumeData({ education: updatedEducation });
  };

  const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedExperience = resumeData.experience.map((exp, i) =>
      i === index ? { ...exp, [name]: value } : exp
    );
    updateResumeData({ experience: updatedExperience });
  };

  const handleProjectChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedProjects = resumeData.projects.map((project, i) =>
      i === index ? { ...project, [name]: value } : project
    );
    updateResumeData({ projects: updatedProjects });
  };

  const handleCertificationsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedCertifications = resumeData.certifications.map((cert, i) =>
      i === index ? { ...cert, [name]: value } : cert
    );
    updateResumeData({ certifications: updatedCertifications });
  };

  const handleLanguagesChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedLanguages = resumeData.languages.map((lang, i) =>
      i === index ? { ...lang, [name]: value } : lang
    );
    updateResumeData({ languages: updatedLanguages });
  };

  return (
    <div className="space-y-8 min-h-screen bg-gradient-to-b from-[#0f1833] to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Personal Information */}
        <div className="bg-[#1a2644]/50 border border-blue-900/30 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              name="name"
              value={resumeData?.personalInfo?.fullName}
              onChange={handlePersonalInfoChange}
              placeholder="Full Name"
              className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
            />
            <Input
              type="email"
              name="email"
              value={resumeData.personalInfo.email}
              onChange={handlePersonalInfoChange}
              placeholder="Email Address"
              className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
            />
            <Input
              type="tel"
              name="phone"
              value={resumeData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
              placeholder="Phone Number"
              className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
            />
            <Input
              type="text"
              name="location"
              value={resumeData.personalInfo.location}
              onChange={handlePersonalInfoChange}
              placeholder="Location"
              className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
            />
            <Input
              type="text"
              name="linkedin"
              value={resumeData.personalInfo.linkedin}
              onChange={handlePersonalInfoChange}
              placeholder="LinkedIn Profile"
              className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
            />
            <Input
              type="text"
              name="github"
              value={resumeData.personalInfo.github}
              onChange={handlePersonalInfoChange}
              placeholder="GitHub Profile"
              className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
            />
            <Input
              type="text"
              name="portfolio"
              value={resumeData.personalInfo.portfolio}
              onChange={handlePersonalInfoChange}
              placeholder="Portfolio Website (Optional)"
              className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#1a2644]/50 border border-blue-900/30 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            Professional Summary
          </h3>
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
            className="w-full h-32 bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Skills */}
        <div className="bg-[#1a2644]/50 border border-blue-900/30 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            Skills
          </h3>
          <AiChecker
            data={resumeData.additionalSkills.join('\n')}
            format='points'
            sectionType='skills'
            onApply={(newSkills) => updateResumeData({ additionalSkills: Array.isArray(newSkills) ? newSkills : newSkills.split('\n') })}
          />
          <PointsEditor
            points={resumeData.additionalSkills}
            onChange={(skills) => updateResumeData({ additionalSkills: skills })}
            className="bg-[#1a2644]/30 border-blue-900/30 text-white"
          />
        </div>

        {/* Education */}
        <div className="space-y-4 ">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Education
            </h3>
            <Button 
              onClick={() => handleAdd('education')} 
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-400/30 transition-all duration-300"
            >
              Add Education
            </Button>
          </div>
          {resumeData.education.map((edu, index) => (
            <DraggableSection
              key={index}
              type="education"
              index={index}
              onReorder={handleReorder}
              onRemove={handleRemove}
              className="bg-[#1a2644] border border-blue-900 backdrop-blur-sm rounded-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="institution"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, e)}
                  placeholder="Institution"
                  className="w-full bg-[#1a2644] border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, e)}
                  placeholder="Degree"
                  className="w-full bg-[#1a2644] border-blue-900 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="location"
                  value={edu.location}
                  onChange={(e) => handleEducationChange(index, e)}
                  placeholder="Location"
                  className="w-full bg-[#1a2644] border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="startDate"
                  value={edu.startDate}
                  onChange={(e) => handleEducationChange(index, e)}
                  placeholder="Start Date"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="endDate"
                  value={edu.endDate}
                  onChange={(e) => handleEducationChange(index, e)}
                  placeholder="End Date"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="gpa"
                  value={edu.gpa}
                  onChange={(e) => handleEducationChange(index, e)}
                  placeholder="GPA (Optional)"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
              </div>
            </DraggableSection>
          ))}
        </div>

        {/* Experience */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Experience
            </h3>
            <Button 
              onClick={() => handleAdd('experience')} 
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-400/30 transition-all duration-300"
            >
              Add Experience
            </Button>
          </div>
          {resumeData.experience.map((exp, index) => (
            <DraggableSection
              key={index}
              type="experience"
              index={index}
              onReorder={handleReorder}
              onRemove={handleRemove}
              className="bg-[#1a2644]/50 border border-blue-900/30 backdrop-blur-sm rounded-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="company"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, e)}
                  placeholder="Company"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="role"
                  value={exp.role}
                  onChange={(e) => handleExperienceChange(index, e)}
                  placeholder="Role"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="location"
                  value={exp.location}
                  onChange={(e) => handleExperienceChange(index, e)}
                  placeholder="Location"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="startDate"
                  value={exp.startDate}
                  onChange={(e) => handleExperienceChange(index, e)}
                  placeholder="Start Date"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="endDate"
                  value={exp.endDate}
                  onChange={(e) => handleExperienceChange(index, e)}
                  placeholder="End Date"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Responsibilities
                  </label>
                  <AiChecker
                    data={exp.responsibilities.join('\n')}
                    format='points'
                    sectionType='experience'
                    onApply={(newResponsibilities) => handleExperiencePointsChange(index, Array.isArray(newResponsibilities) ? newResponsibilities : newResponsibilities.split('\n'))}
                  />
                  <PointsEditor
                    points={exp.responsibilities}
                    onChange={(points) => handleExperiencePointsChange(index, points)}
                    className="bg-[#1a2644]/30 border-blue-900/30 text-white"
                  />
                </div>
              </div>
            </DraggableSection>
          ))}
        </div>

        {/* Projects */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Projects
            </h3>
            <Button 
              onClick={() => handleAdd('projects')} 
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-400/30 transition-all duration-300"
            >
              <PlusIcon className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </div>
          {resumeData.projects.map((project, index) => (
            <DraggableSection
              key={index}
              type="projects"
              index={index}
              onReorder={handleReorder}
              onRemove={handleRemove}
              className="bg-[#1a2644]/50 border border-blue-900/30 backdrop-blur-sm rounded-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="name"
                  value={project.name}
                  onChange={(e) => handleProjectChange(index, e)}
                  placeholder="Project Name"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="link"
                  value={project.link}
                  onChange={(e) => handleProjectChange(index, e)}
                  placeholder="Project Link (Optional)"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="gitLink"
                  value={project.gitLink}
                  onChange={(e) => handleProjectChange(index, e)}
                  placeholder="GitHub Link (Optional)"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Textarea
                  name="description"
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, e)}
                  placeholder="Project Description"
                  className="w-full col-span-2 h-24 bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Key Points
                  </label>
                  <AiChecker
                    data={project.points.join('\n')}
                    format='points'
                    sectionType='project'
                    onApply={(newPoints) => handleProjectPointsChange(index, Array.isArray(newPoints) ? newPoints : newPoints.split('\n'))}
                  />
                  <PointsEditor
                    points={project.points}
                    onChange={(points) => handleProjectPointsChange(index, points)}
                    className="bg-[#1a2644]/30 border-blue-900/30 text-white"
                  />
                </div>
              </div>
            </DraggableSection>
          ))}
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Achievements and Certifications
            </h3>
            <Button 
              onClick={() => handleAdd('certifications')} 
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-400/30 transition-all duration-300"
            >
              Add Certification
            </Button>
          </div>
          {resumeData.certifications.map((cert, index) => (
            <DraggableSection
              key={index}
              type="certifications"
              index={index}
              onReorder={handleReorder}
              onRemove={handleRemove}
              className="bg-[#1a2644]/50 border border-blue-900/30 backdrop-blur-sm rounded-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="name"
                  value={cert.name}
                  onChange={(e) => handleCertificationsChange(index, e)}
                  placeholder="Achievement or Certification Name"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="issuer"
                  value={cert.issuer}
                  onChange={(e) => handleCertificationsChange(index, e)}
                  placeholder="Some Description"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="issueDate"
                  value={cert.issueDate}
                  onChange={(e) => handleCertificationsChange(index, e)}
                  placeholder="Issue Date"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
              </div>
            </DraggableSection>
          ))}
        </div>

        {/* Languages */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Languages
            </h3>
            <Button 
              onClick={() => handleAdd('languages')} 
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-400/30 transition-all duration-300"
            >
              Add Language
            </Button>
          </div>
          {resumeData.languages.map((lang, index) => (
            <DraggableSection
              key={index}
              type="languages"
              index={index}
              onReorder={handleReorder}
              onRemove={handleRemove}
              className="bg-[#1a2644]/50 border border-blue-900/30 backdrop-blur-sm rounded-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="name"
                  value={lang.name}
                  onChange={(e) => handleLanguagesChange(index, e)}
                  placeholder="Language"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
                <Input
                  type="text"
                  name="level"
                  value={lang.level}
                  onChange={(e) => handleLanguagesChange(index, e)}
                  placeholder="Proficiency Level"
                  className="w-full bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-400"
                />
              </div>
            </DraggableSection>
          ))}
        </div>

        {/* Interests */}
        <div className="bg-[#1a2644]/50 border border-blue-900/30 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            Interests
          </h3>
          <PointsEditor
            points={resumeData.interests}
            onChange={(interests) => updateResumeData({ interests })}
            className="bg-[#1a2644]/30 border-blue-900/30 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;

