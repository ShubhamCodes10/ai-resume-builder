'use client';

import { useState } from 'react';
import { Loader2, Upload, FileText, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useParseDoc } from '@/app/utils/parseDoc';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Strength {
  skill: string;
  description: string;
}

interface AreaForImprovement {
  area: string;
  suggestion: string;
}

interface Skill {
  skill: string;
  matchLevel: 'high' | 'medium' | 'low' | 'missing';
  comment: string;
}

interface RelevantExperience {
  experience: string;
  relevance: string;
}

interface ExperienceAnalysis {
  company: string;
  position: string;
  duration: string;
  keyPoints: string[];
  relevance: string;
}

interface ProjectAnalysis {
  name: string;
  description: string;
  keyPoints: string[];
  relevance: string;
}

interface ATSImprovement {
  section: string;
  suggestion: string;
}

interface Analysis {
  jobFitPercentage: number;
  overallAssessment: string;
  strengths: Strength[];
  areasForImprovement: AreaForImprovement[];
  recommendations: string[];
  skillsMatch: {
    technical: Skill[];
    soft: Skill[];
  };
  experienceAnalysis: ExperienceAnalysis[];
  projectAnalysis: ProjectAnalysis[];
  experienceRelevance: {
    score: number;
    relevantExperiences: RelevantExperience[];
    missingExperiences: string[];
  };
  educationFit: {
    score: number;
    comment: string;
  };
  cultureFit: {
    score: number;
    comment: string;
  };
  atsImprovements: ATSImprovement[];
  metadata: {
    analysisTimestamp: string;
    confidenceScore: number;
    modelVersion: string;
  };
}

const JobAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState('');
  const { extractTextFromPDF } = useParseDoc();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await analyzeJobFit();
  };

  const analyzeJobFit = async () => {
    if (!file || !jobDescription.trim()) {
      setError('Please provide both a resume and job description');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const resumeText = await extractTextFromPDF(file);

      if (!resumeText) {
        throw new Error('Failed to parse resume');
      }

      const response = await fetch('/api/analyze-job-fit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze job fit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSkillMatch = (skill: Skill) => (
    <div key={skill.skill} className="flex items-center justify-between p-2 bg-[#0f1833]/70 rounded mb-2">
      <span className="font-medium text-blue-300">{skill.skill}</span>
      <Badge 
        variant={skill.matchLevel === 'missing' ? 'destructive' : 'default'}
        className={skill.matchLevel === 'missing' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}
      >
        {skill.matchLevel === 'missing' ? 'Missing' : 'Found'}
      </Badge>
    </div>
  );

  const renderExperienceAnalysis = (exp: ExperienceAnalysis) => (
    <div key={exp.company} className="mb-4 p-4 bg-[#0f1833]/70 rounded-lg border border-blue-900/50">
      <h4 className="font-bold text-blue-300">{exp.position} at {exp.company}</h4>
      <p className="text-sm text-gray-400 mb-2">{exp.duration}</p>
      <h5 className="font-semibold mb-1 text-blue-200">Key Points:</h5>
      <ul className="list-disc pl-5 mb-2 text-gray-300">
        {exp.keyPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      <p><span className="font-semibold text-blue-200">Relevance:</span> <span className="text-gray-300">{exp.relevance}</span></p>
    </div>
  );

  const renderProjectAnalysis = (project: ProjectAnalysis) => (
    <div key={project.name} className="mb-4 p-4 bg-[#0f1833]/70 rounded-lg border border-blue-900/50">
      <h4 className="font-bold text-blue-300">{project.name}</h4>
      <p className="text-sm mb-2 text-gray-300">{project.description}</p>
      <h5 className="font-semibold mb-1 text-blue-200">Key Points:</h5>
      <ul className="list-disc pl-5 mb-2 text-gray-300">
        {project.keyPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      <p><span className="font-semibold text-blue-200">Relevance:</span> <span className="text-gray-300">{project.relevance}</span></p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#0f1833] to-[#1a2644] text-white">
      <div className="flex-grow p-4 max-w-7xl mx-auto">
        {!analysis ? (
          <Card className="max-w-2xl mx-auto bg-[#1a2644]/80 border-blue-900/30 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-300">Job Fit Analysis</CardTitle>
              <CardDescription className="text-gray-300">
                Upload your resume and paste the job description to analyze your fit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-200">Resume (PDF)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-blue-900/30 rounded-md bg-[#1a2644]/30 hover:bg-[#1a2644]/50 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-blue-400" />
                      <div className="flex text-sm">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".pdf"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      {file && (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                          <FileText className="h-4 w-4 text-blue-400" />
                          {file.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-200">Job Description</label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="h-32 bg-[#1a2644]/30 border-blue-900/30 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !file || !jobDescription.trim()}
                  className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-400/30 transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Job Fit'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-[#1a2644]/80 border-blue-900/30 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-300">Analysis Results</span>
                  <Button onClick={() => setAnalysis(null)} variant="outline" size="sm" className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-400/30 transition-colors duration-200">
                    New Analysis
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-200">Job Fit Score</span>
                    <span className="text-3xl font-bold text-blue-400">{analysis.jobFitPercentage}%</span>
                  </div>
                  <Progress value={analysis.jobFitPercentage} className="h-2 bg-blue-900/30" />
                </div>

                <div className="p-4 bg-[#0f1833]/50 rounded-lg border border-blue-900/50">
                  <h3 className="font-medium text-lg mb-2 text-blue-300">Overall Assessment</h3>
                  <p className="text-gray-300">{analysis.overallAssessment}</p>
                </div>

                <Accordion type="single" collapsible className="w-full bg-[#1a2644]/30 rounded-lg overflow-hidden">
                  <AccordionItem value="strengths" className="border-b border-blue-900/30">
                    <AccordionTrigger className="hover:bg-blue-900/20 px-4 py-2">
                      <span className="text-blue-300 flex items-center">
                        Key Strengths
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-[#1a2644]/50 px-4 py-2">
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className="bg-green-900/20 p-3 rounded-lg">
                            <span className="font-medium text-green-400">{strength.skill}:</span> <span className="text-gray-300">{strength.description}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="areas-for-improvement" className="border-b border-blue-900/30">
                    <AccordionTrigger className="hover:bg-blue-900/20 px-4 py-2">
                      <span className="text-blue-300 flex items-center">
                        Areas for Improvement
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-[#1a2644]/50 px-4 py-2">
                      <ul className="space-y-2">
                        {analysis.areasForImprovement.map((area, index) => (
                          <li key={index} className="bg-yellow-900/20 p-3 rounded-lg">
                            <span className="font-medium text-yellow-400">{area.area}:</span> <span className="text-gray-300">{area.suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="skills-match" className="border-b border-blue-900/30">
                    <AccordionTrigger className="hover:bg-blue-900/20 px-4 py-2">
                      <span className="text-blue-300 flex items-center">
                        Skills Match
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-[#1a2644]/50 px-4 py-2">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 text-blue-300">Technical Skills</h4>
                          {analysis.skillsMatch.technical.map(renderSkillMatch)}
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-blue-300">Soft Skills</h4>
                          {analysis.skillsMatch.soft.map(renderSkillMatch)}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="experience-analysis" className="border-b border-blue-900/30">
                    <AccordionTrigger className="hover:bg-blue-900/20 px-4 py-2">
                      <span className="text-blue-300 flex items-center">
                        Experience Analysis
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-[#1a2644]/50 px-4 py-2">
                      {analysis.experienceAnalysis.map(renderExperienceAnalysis)}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="project-analysis" className="border-b border-blue-900/30">
                    <AccordionTrigger className="hover:bg-blue-900/20 px-4 py-2">
                      <span className="text-blue-300 flex items-center">
                        Project Analysis
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-[#1a2644]/50 px-4 py-2">
                      {analysis.projectAnalysis.map(renderProjectAnalysis)}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="experience-relevance" className="border-b border-blue-900/30">
                    <AccordionTrigger className="hover:bg-blue-900/20 px-4 py-2">
                      <span className="text-blue-300 flex items-center">
                        Experience Relevance
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-[#1a2644]/50 px-4 py-2">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-200">Relevance Score:</span>
                          <span className="font-bold text-blue-400">{analysis.experienceRelevance.score}%</span>
                        </div>
                        <Progress value={analysis.experienceRelevance.score} className="h-2 bg-blue-900/30" />
                        <div>
                          <h4 className="font-medium mb-2 text-blue-300">Relevant Experiences:</h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-300">
                            {analysis.experienceRelevance.relevantExperiences.map((exp, index) => (
                              <li key={index}>
                                <span className="font-medium text-blue-300">{exp.experience}:</span> {exp.relevance}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {analysis.experienceRelevance.missingExperiences.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 text-yellow-400">Missing Experiences:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-gray-300">
                              {analysis.experienceRelevance.missingExperiences.map((exp, index) => (
                                <li key={index}>{exp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="education-fit" className="border-b border-blue-900/30">
                    <AccordionTrigger className="hover:bg-blue-900/20 px-4 py-2">
                      <span className="text-blue-300 flex items-center">
                        Education Fit
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-[#1a2644]/50 px-4 py-2">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-200">Education Fit Score:</span>
                          <span className="font-bold text-blue-400">{analysis.educationFit.score}%</span>
                        </div>
                        <Progress value={analysis.educationFit.score} className="h-2 bg-blue-900/30" />
                        <p className="text-gray-300">{analysis.educationFit.comment}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="culture-fit" className="border-b border-blue-900/30">
                    <AccordionTrigger className="hover:bg-blue-900/20 px-4 py-2">
                      <span className="text-blue-300 flex items-center">
                        Culture Fit
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-[#1a2644]/50 px-4 py-2">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-200">Culture Fit Score:</span>
                          <span className="font-bold text-blue-400">{analysis.cultureFit.score}%</span>
                        </div>
                        <Progress value={analysis.cultureFit.score} className="h-2 bg-blue-900/30" />
                        <p className="text-gray-300">{analysis.cultureFit.comment}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="recommendations" className="border-b border-blue-900/30">
                    <AccordionTrigger className="hover:bg-blue-900/20 px-4 py-2">
                      <span className="text-blue-300 flex items-center">
                        Recommendations
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-[#1a2644]/50 px-4 py-2">
                      <ul className="list-disc pl-5 space-y-2 text-gray-300">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="border-t border-blue-900/30 pt-4 mt-6 text-sm text-gray-400">
                  <p>Analysis completed on: {new Date(analysis.metadata.analysisTimestamp).toLocaleString()}</p>
                  <p>Confidence Score: {analysis.metadata.confidenceScore}%</p>
                </div>
              </CardContent>
            </Card>

            <Button onClick={analyzeJobFit} className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-400/30 transition-colors duration-200">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reanalyze
            </Button>
          </div>
        )}
      </div>

      {analysis && (
        <div className="w-96 bg-[#1a2644]/80 border-blue-900/30 p-4 shadow-lg overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-blue-300">ATS Improvements</h3>
          <ul className="space-y-4">
            {analysis.atsImprovements.map((improvement, index) => (
              <li key={index} className="bg-[#0f1833]/70 p-3 rounded-lg border border-blue-900/50">
                <span className="font-medium text-blue-300">{improvement.section}:</span> <span className="text-gray-300">{improvement.suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobAnalysis;

