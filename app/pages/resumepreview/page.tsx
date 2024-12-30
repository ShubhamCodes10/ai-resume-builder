"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Layout, FileText, Palette, Brush, Briefcase } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ResumeProvider } from '@/context/ResumeContext';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const DndProvider = dynamic(
  () => import('react-dnd').then(mod => mod.DndProvider),
  { ssr: false }
);

const ResumeEditor = dynamic(
  () => import('@/components/ResumeEditor'),
  { ssr: false }
);

const ResumePreview = dynamic(
  () => import('@/components/ResumePreview'),
  { ssr: false }
);

const ResumeManager = dynamic(
  () => import('@/components/ResumeManager'),
  { ssr: false }
);

const initialResumeData = {
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

const templates = [
  { id: "modern", name: "Modern", icon: Layout },
  { id: "classic", name: "Classic", icon: FileText },
  { id: "creative", name: "Creative", icon: Palette },
  { id: "minimal", name: "Minimal", icon: FileText },
  { id: "elegant", name: "Elegant", icon: Brush },
  { id: "professional", name: "Professional", icon: Briefcase },
];


function Page() {
  const [isClient, setIsClient] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "classic" | "creative">("modern");
  const [savedTemplates, setSavedTemplates] = useState([
    { id: "default", name: "Default", data: initialResumeData },
  ]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSaveTemplate = (name: string, data: any) => {
    setSavedTemplates((prevTemplates) => [
      ...prevTemplates,
      { id: Date.now().toString(), name, data },
    ]);
  };

  if (!isClient) {
    return null; 
  }

  const handlePerformClear = () => {
    localStorage.removeItem('resumeData');
    toast({
      title: "Cleared",
      description: "The editor has been cleared",
    })
    window.location.reload();
  }

  return (
    <ResumeProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
          <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 py-4 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Resume Builder
                </h1>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3  rounded-lg p-2">
                  <span className="text-sm font-medium text-gray-300">Template Styles</span>
                  <Select value={selectedTemplate} onValueChange={(value: string) => setSelectedTemplate(value as "modern" | "classic" | "creative")}>
                    <SelectTrigger className="w-[140px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {templates.map((template) => (
                        <SelectItem
                          key={template.id}
                          value={template.id}
                          className="text-white hover:bg-gray-700"
                        >
                          <div className="flex items-center space-x-2">
                            <template.icon className="h-4 w-4" />
                            <span>{template.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ResumeManager
                  templates={savedTemplates}
                  onSaveTemplate={handleSaveTemplate}
                />
                <div>
                  <Button onClick={handlePerformClear} variant={"destructive"}>
                    Clear Editor
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Resume Editor</h2>
                      <p className="text-sm text-gray-400">Fill in your details below</p>
                    </div>
                  </div>
                  <Separator className="my-4 bg-gray-800" />
                  <div className="h-[calc(100vh-12rem)] overflow-y-auto pr-4 custom-scrollbar">
                    <ResumeEditor points={[]} onChange={() => {}} />
                  </div>
                </CardContent>
              </Card>

              <div className="lg:sticky lg:top-24 lg:self-start h-screen overflow-hidden">
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardContent className="p-0 h-full">
                    <div className="bg-white h-full overflow-y-auto overflow-x-auto custom-scrollbar">
                      <div className="inline-block min-w-full">
                        <ResumePreview selectedTemplate={selectedTemplate} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>

          <style jsx global>{`
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(75, 85, 99, 0.5);
              border-radius: 3px;
              border: 1px solid rgba(75, 85, 99, 0.3);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(75, 85, 99, 0.7);
            }
          `}</style>
        </div>
      </DndProvider>
    </ResumeProvider>
  );
}

export default Page;

