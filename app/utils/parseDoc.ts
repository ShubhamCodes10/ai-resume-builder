"use client";

import { useCallback, useEffect, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { ExtractedData } from "@/types/ExtractedDataTypes";

// Don't set worker source here - we'll do it in a useEffect

export const useParseDoc = () => {
  const [pdfjs, setPdfjs] = useState<typeof import('pdfjs-dist')>();

  useEffect(() => {
    // Dynamic import of pdfjs and set up worker
    import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      setPdfjs(pdfjs);
    });
  }, []);

  const extractTextFromPDF = useCallback(async (file: File): Promise<ExtractedData | null> => {
    if (!file || !pdfjs) return null;

    try {
      // Load PDF document
      const arrayBuffer = await file.arrayBuffer();
      const pdf: PDFDocumentProxy = await pdfjs.getDocument(arrayBuffer).promise;
      let allText = "";

      // Loop through each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        allText += pageText + "\n";
      }

      const extractedData: ExtractedData = {};

      // Extract Name
      const nameRegex = /(?:Name|Full Name):?\s*([^\n]+)/i;
      const nameMatch = allText.match(nameRegex);
      extractedData.name = nameMatch?.[1]?.trim() || undefined;

      // Extract Email
      const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
      const emailMatch = allText.match(emailRegex);
      extractedData.email = emailMatch?.[0]?.trim() || undefined;

      // Extract Links
      const linkRegex = /(https?:\/\/[^\s]+)/gi;
      extractedData.links = allText.match(linkRegex) || undefined;

      // Extract Education
      const educationRegex = /EDUCATION([\s\S]*?)(?=SKILLS|EXPERIENCE|PROJECTS|$)/i;
      const educationMatch = allText.match(educationRegex);
      if (educationMatch) {
        extractedData.education = educationMatch[1]
          ?.trim()
          .split(/\n(?=[A-Z])/)
          .filter(Boolean)
          .map((edu) => {
            const lines = edu.split('\n');
            const universityLine = lines[0].trim();
            const [university, location] = universityLine.split(',').map(s => s.trim());
            const degreeLine = lines[1]?.trim();
            const [degree, yearRange] = degreeLine?.split(/,|\s{2,}/).map(s => s.trim()) || [];
            return { university, degree, year: yearRange, location };
          })
          .filter((edu): edu is NonNullable<typeof edu> => 
            edu.university !== undefined && edu.degree !== undefined
          );
      }

      // Extract Skills
      const skillsRegex = /SKILLS([\s\S]*?)(?=EXPERIENCE|PROJECTS|$)/i;
      const skillsMatch = allText.match(skillsRegex);
      if (skillsMatch) {
        const skillsText = skillsMatch[1];
        extractedData.skills = {
          languages: skillsText.match(/(?:Languages:?\s*)([^\n]+)/i)?.[1]?.split(",").map((s) => s.trim()),
          technologies: skillsText.match(/(?:Technologies:?\s*)([^\n]+)/i)?.[1]?.split(",").map((s) => s.trim()),
          databases: skillsText.match(/(?:Databases:?\s*)([^\n]+)/i)?.[1]?.split(",").map((s) => s.trim()),
          tools: skillsText.match(/(?:Tools:?\s*)([^\n]+)/i)?.[1]?.split(",").map((s) => s.trim()),
        };
      }

      // Extract Experience
      const experienceRegex = /EXPERIENCE([\s\S]*?)(?=PROJECTS|$)/i;
      const experienceMatch = allText.match(experienceRegex);
      if (experienceMatch) {
        extractedData.experience = experienceMatch[1]
          ?.trim()
          .split("\n\n")
          .filter(Boolean)
          .map((exp) => {
            const lines = exp.split("\n");
            const [company, duration, position, location] = lines[0]?.trim().split(/\s{2,}/).map((s) => s.trim());
            const responsibilities = lines.slice(1).map((r) => r.trim()).filter(Boolean);
            return {
              company,
              position,
              duration,
              location,
              responsibilities,
            };
          });
      }

      // Extract Projects
      const projectsRegex = /PROJECTS([\s\S]*?)(?=END|$)/i;
      const projectsMatch = allText.match(projectsRegex);
      if (projectsMatch) {
        extractedData.projects = projectsMatch[1]
          ?.trim()
          .split("\n\n")
          .filter(Boolean)
          .map((project) => {
            const lines = project.split("\n");
            const [title, techStackAndLinks] = lines[0]?.trim().split("   |   ");
            const techStack = techStackAndLinks?.split("   ")[0]?.trim();
            const demoLink = techStackAndLinks?.split("   ")[1]?.trim();
            const githubLink = techStackAndLinks?.split("   ")[2]?.trim();
            const points = lines.slice(1).map((r) => r.trim()).filter(Boolean);

            return {
              title,
              techStack,
              demoLink,
              githubLink,
              points,
            };
          });
      }

      return extractedData;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      return null;
    }
  }, [pdfjs]);

  return { extractTextFromPDF };
};