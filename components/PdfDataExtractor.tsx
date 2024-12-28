"use client";

import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExtractedData } from '@/types/ExtractedDataTypes';
import { useResumeContext } from '@/context/ResumeContext';
import { useRouter } from 'next/navigation';
import { useParseDoc } from '@/app/utils/parseDoc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function PdfDataExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setExistingResume, updateResumeData } = useResumeContext();
  const router = useRouter();
  const { extractTextFromPDF } = useParseDoc();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.includes('pdf')) {
        setError('Only PDF files are allowed');
        setFile(null);
        e.target.value = '';
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB');
        setFile(null);
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  }, []);

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

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const extractedData = await extractTextFromPDF(file);
      
      if (extractedData) {
        setExistingResume(extractedData);
        updateResumeDataFromExtracted(extractedData);
        localStorage.setItem('extractedResumeData', JSON.stringify(extractedData));
        router.push('/pages/ExistingResume');
      } else {
        setError('Failed to extract data from PDF');
      }
    } catch (error) {
      setError('Error processing PDF file');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [file, extractTextFromPDF, setExistingResume, router]);

  const resetForm = useCallback(() => {
    setFile(null);
    setError(null);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = '';
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1832] flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl  bg-black/90 border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">
            Resume Extractor
          </CardTitle>
          <CardDescription className="text-gray-400">
            Upload your PDF resume to automatically extract your professional information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pdf-file" className="text-white">Upload Resume</Label>
              <div className="relative">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 hover:border-gray-500 transition-colors">
                  <Input
                    id="pdf-file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="pdf-file" 
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <FileText className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF files only (max 5MB)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-800">
                <AlertTitle className="text-red-400">Error</AlertTitle>
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={loading || !file}
                className={cn(
                  "flex-1 bg-white text-black hover:bg-gray-200",
                  loading && "opacity-70"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Extract Data
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={resetForm}
                disabled={loading}
                className="border-gray-800  text-gray-900 hover:bg-gray-800 hover:text-white"
              >
                <X className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}