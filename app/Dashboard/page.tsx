'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ResumeProvider } from '@/context/ResumeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, ArrowRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import ResumeScans from '@/components/ResumeScans';

interface ActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
  variant?: string;
}


function Dashboard() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();

  const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, description, onClick, variant = "blue" }) => (
    <Card className="bg-[#1a2644]/50 border-blue-900/30 backdrop-blur-sm hover:bg-[#1a2644]/70 transition-all duration-300">
      <CardContent className="p-8">
        <Button
          onClick={onClick}
          className={`w-full h-full min-h-[200px] bg-transparent hover:bg-${variant}-600/10 border-2 border-${variant}-500/30 hover:border-${variant}-400 group`}
        >
          <div className="flex flex-col items-center space-y-4">
            <Icon className={`h-16 w-16 text-${variant}-400 group-hover:scale-110 transition-transform duration-300`} />
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray-300">{description}</p>
            </div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1833] to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-64 mx-auto bg-gray-700/50" />
          <Skeleton className="h-6 w-96 mx-auto bg-gray-700/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((index) => (
            <Card key={index} className="bg-[#1a2644]/50 border-blue-900/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="min-h-[200px] flex flex-col items-center justify-center space-y-4">
                  <Skeleton className="h-16 w-16 rounded-full bg-gray-700/50" />
                  <div className="text-center space-y-2">
                    <Skeleton className="h-6 w-40 mx-auto bg-gray-700/50" />
                    <Skeleton className="h-4 w-56 mx-auto bg-gray-700/50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  if (!isLoaded) {
    return <LoadingSkeleton />;
  }

  if (!isSignedIn) {
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
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Welcome, {user.fullName}
          </h1>
          <p className="text-gray-300 text-lg">Create, analyze, and perfect your resume</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ActionCard
            icon={FileText}
            title="Generate Resume"
            description="Create a professional resume with our builder"
            onClick={() => router.push('/pages/resumepreview')}
            variant="blue"
          />
          <ActionCard
            icon={Sparkles}
            title="AI Analysis"
            description="Get AI-powered insights for your resume"
            onClick={() => router.push('/pages/Analyse-resume')}
            variant="purple"
          />
        </div>

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