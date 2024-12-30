'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ResumeProvider, useResumeContext } from '@/context/ResumeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { fetchUserTemplatesBasedOnUserID } from '@/firebase/firebaseSetup';
import { useToast } from "@/hooks/use-toast";
import ResumeScans from '@/components/ResumeScans';

function Dashboard() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { toast } = useToast();

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f1833] to-black p-6">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-white">Welcome to BuildMyCv</h1>
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            Please sign in to access your personalized resume dashboard
          </p>
          <Button 
            onClick={() => router.push('/sign-in')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
          >
            Sign In <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1833] to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Welcome, {user.fullName}
          </h1>
          <p className="text-gray-300 text-lg">Create, analyze, and perfect your resume</p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-[#1a2644]/50 border-blue-900/30 backdrop-blur-sm hover:bg-[#1a2644]/70 transition-all duration-300">
            <CardContent className="p-8">
              <Button
                onClick={() => router.push('/pages/resumepreview')}
                className="w-full h-full min-h-[200px] bg-transparent hover:bg-blue-600/10 border-2 border-blue-500/30 hover:border-blue-400 group"
              >
                <div className="flex flex-col items-center space-y-4">
                  <FileText className="h-16 w-16 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Generate Resume</h3>
                    <p className="text-sm text-gray-300">Create a professional resume with our builder</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2644]/50 border-blue-900/30 backdrop-blur-sm hover:bg-[#1a2644]/70 transition-all duration-300">
            <CardContent className="p-8">
              <Button
                onClick={() => router.push('/pages/Analyse-resume')}
                className="w-full h-full min-h-[200px] bg-transparent hover:bg-purple-600/10 border-2 border-purple-500/30 hover:border-purple-400 group"
              >
                <div className="flex flex-col items-center space-y-4">
                  <Sparkles className="h-16 w-16 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                    <p className="text-sm text-gray-300">Get AI-powered insights for your resume</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resume Scans Section */}
        <ResumeScans />
      </div>
    </div>
  );
}

function DashboardWrapper() {
  return (
    <ResumeProvider>
      <Dashboard />
    </ResumeProvider>
  );
}

export default DashboardWrapper;