'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2Icon, AlertCircle, Calendar, Target, Trophy, ChevronRight, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ScanSummary {
  id: number;
  analysisTimestamp: string;
  jobFitPercentage: number;
  confidenceScore: number;
  modelVersion: string;
  overallAssessment: string;
}

export default function ResumeScans() {
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchScans() {
      try {
        setLoading(true);
        const response = await fetch('/api/fetch-user-analysis');
        if (!response.ok) throw new Error('Failed to fetch analyses');
        const data = await response.json();
        setScans(data.data.map((scan: any) => ({
          id: scan.id,
          analysisTimestamp: scan.analysisTimestamp,
          jobFitPercentage: scan.jobFitPercentage,
          confidenceScore: scan.confidenceScore,
          modelVersion: scan.modelVersion,
          overallAssessment: scan.overallAssessment
        })));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load analyses');
      } finally {
        setLoading(false);
      }
    }
    fetchScans();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2Icon className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
          <p className="text-gray-300">Loading your analyses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto bg-red-500/10 border-red-500/20">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Recent Analyses</h2>
        <Button
          onClick={() => router.push("/pages/Analyse-resume")}
          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-400/30 group"
        >
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          New Analysis
        </Button>
      </div>
      
      <div className="relative">
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-6 min-w-full">
            {scans.length === 0 ? (
              <Card className="w-full bg-[#1a2644]/50 border-blue-900/30 backdrop-blur-sm p-8 text-center">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <Target className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">No analyses yet</h3>
                  <p className="text-gray-300">Start by analyzing your first resume</p>
                  <Button
                    onClick={() => router.push("/pages/Analyse-resume")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start Analysis
                  </Button>
                </CardContent>
              </Card>
            ) : (
              scans.map((scan) => (
                <Card 
                  key={scan.id} 
                  className="flex-shrink-0 w-[400px] bg-[#37456b] border-blue-900/30 backdrop-blur-sm hover:bg-[#253661] transition-all duration-300"
                >
                  <CardHeader className="border-b border-blue-900/30">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-white">Analysis #{scan.id}</CardTitle>
                      <span className="text-sm text-gray-300 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(scan.analysisTimestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">Job Fit Score</span>
                          <span className="text-sm font-bold text-blue-400">{scan.jobFitPercentage}%</span>
                        </div>
                        <Progress value={scan.jobFitPercentage} className="h-2 bg-gray-600" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">Confidence</span>
                          <span className="text-sm font-bold text-purple-400">{scan.confidenceScore}%</span>
                        </div>
                        <Progress value={scan.confidenceScore} className="h-2 bg-gray-600" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-sm text-gray-300 line-clamp-2">{scan.overallAssessment}</p>
                      <div className="flex items-center justify-between">
                        <Link href={`/detailed-scan/${scan.id}`}>
                          <Button variant="ghost" className="text-blue-400 hover:text-blue-900 group">
                            View Details
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
        
        {scans.length > 0 && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0f1833] to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0f1833] to-transparent pointer-events-none" />
          </>
        )}
      </div>
    </div>
  );
}