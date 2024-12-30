'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Loader2Icon,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Calendar,
  Trash2,
  Brain,
  Target
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { convertTimestampToDate } from '@/app/utils/convertTimeStamptoDate';

interface SkillMatch {
  skill: string;
  comment: string;
  matchLevel: string;
}

interface Analysis {
  id: number;
  jobFitPercentage: number;
  overallAssessment: string;
  analysisTimestamp: any;
  confidenceScore: number;
  modelVersion: string;
  areasForImprovement: Array<{ area: string; suggestion: string }>;
  atsImprovements: Array<{ description: string }>;
  experienceAnalysis: Array<{ description: string }>;
  projectAnalysis: Array<{ description: string }>;
  recommendations: string[];
  skillsMatch: {
    soft: SkillMatch[];
    technical: SkillMatch[];
  };
  strengths: Array<{ description: string }>;
}

export default function DetailedScan() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true);
        if (!id) throw new Error('No analysis ID provided');

        const response = await fetch(`/api/fetch-single-user-analysis?id=${id}`);
        if (!response.ok) throw new Error(`Failed to fetch analysis. Status: ${response.status}`);

        const data = await response.json();
        if (!data.data) throw new Error('No data received from API');
        console.log("detail scan hu", data);


        setAnalysis(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [id]);

  const deleteAnalysis = async () => {
    try {
      const response = await fetch(`/api/delete-single-user-analysis?id=${id}`, {
        method: 'DELETE',
      });


      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete analysis');
      }

      router.push('/Dashboard');
      toast({ description: 'Analysis deleted successfully' });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete analysis',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1833] to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2Icon className="h-12 w-12 animate-spin text-blue-400 mx-auto" />
          <p className="text-gray-300">Loading analysis details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1833] to-black p-6">
        <Alert variant="destructive" className="max-w-2xl mx-auto bg-red-500/10 border-red-500/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1833] to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Target className="h-16 w-16 text-blue-400 mx-auto" />
          <h2 className="text-2xl font-semibold text-white">No Analysis Found</h2>
          <p className="text-gray-300">The requested analysis could not be found.</p>
          <Button onClick={() => router.push('/Dashboard')} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1833] to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Analysis Results
          </h1>
          <Dialog >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-red-400 hover:text-white hover:bg-red-800 group"
              >
                <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Delete Analysis
              </Button>
            </DialogTrigger>

            <DialogContent className='bg-[#1a2644] border-blue-900/30'>
              <DialogHeader >
                <DialogTitle className='text-white' >Confirm Deletion</DialogTitle>
                <DialogDescription className='text-white'>
                  Are you sure you want to delete this analysis? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="destructive" onClick={deleteAnalysis}>
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#2d3857] border-blue-900/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Job Fit Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress
                  value={analysis.jobFitPercentage}
                  className="h-2 bg-gray-600"
                />
                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                  {analysis.jobFitPercentage}%
                </p>
              </div>
            </CardContent>
          </Card>


          <Card className="bg-[#2d3857] border-blue-900/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Confidence Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={analysis.confidenceScore} className="h-2 bg-gray-600" />
                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                  {analysis.confidenceScore}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2644]/50 border-blue-900/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Analysis Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>
                  {convertTimestampToDate(analysis.analysisTimestamp).toLocaleDateString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Assessment */}
        <Card className="bg-[#1a2644]/50 border-blue-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Overall Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{analysis.overallAssessment}</p>
          </CardContent>
        </Card>

        {/* Skills Match */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#1a2644]/50 border-blue-900/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Technical Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.skillsMatch.technical.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-400/30"
                    title={skill.comment}
                  >
                    {skill.skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2644]/50 border-blue-900/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Soft Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.skillsMatch.soft.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-400/30"
                    title={skill.comment}
                  >
                    {skill.skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strengths and Areas for Improvement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#1a2644]/50 border-blue-900/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{strength.description}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2644]/50 border-blue-900/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-white">Areas for Improvement</CardTitle>
                <Badge className="bg-red-600/20 text-red-400 border border-red-400/30">
                  {analysis.areasForImprovement.length} Items
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.areasForImprovement.map((area, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-blue-900/30 bg-[#1a2644]/30 p-4"
                  >
                    <button
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      className="flex w-full items-start justify-between group"
                    >
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-amber-400 mt-1 flex-shrink-0" />
                        <span className="font-medium text-white group-hover:text-blue-400 transition-colors">
                          {area.area}
                        </span>
                      </div>
                      {expandedIndex === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {expandedIndex === index && (
                      <div className="mt-4 pl-8 text-gray-300 border-l-2 border-amber-400/30">
                        {area.suggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="bg-[#1a2644]/50 border-blue-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Brain className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}