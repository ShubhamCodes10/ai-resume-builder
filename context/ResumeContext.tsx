"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { ResumeData } from "@/types/resumetypes";
import { ExtractedData } from "@/types/ExtractedDataTypes";

interface ResumeContextType {
  resumeData: ResumeData;
  updateResumeData: (data: Partial<ResumeData>) => void;
  existingResume: ExtractedData | null;
  setExistingResume: (data: ExtractedData) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResumeContext must be used within a ResumeProvider");
  }
  return context;
};

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('resumeData');
      return savedData ? JSON.parse(savedData) : {
        personalInfo: {
          fullName: "",
          email: "",
          phone: "",
          linkedin: "",
          github: "",
          portfolio: "",
          location: "",
        },
        summary: "",
        education: [],
        experience: [],
        projects: [],
        certifications: [],
        additionalSkills: [],
        languages: [],
        interests: [],
      };
    }
    return {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        portfolio: "",
        location: "",
      },
      summary: "",
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      additionalSkills: [],
      languages: [],
      interests: [],
    };
  });

  const [existingResume, setExistingResume] = useState<ExtractedData | null>(null);

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  const updateResumeData = (data: Partial<ResumeData>) => {
    setResumeData((prevData) => {
      const newData = {
        ...prevData,
        ...data,
      };
      localStorage.setItem('resumeData', JSON.stringify(newData));
      return newData;
    });
  };

  return (
    <ResumeContext.Provider
      value={{ resumeData, updateResumeData, existingResume, setExistingResume }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

