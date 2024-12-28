'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { CloudUpload, FileEdit, ArrowRight } from 'lucide-react';

function UserPreferencePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1833] to-black text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Choose Your Path
            </h1>
            <p className="text-gray-300 text-lg">
              Select how you'd like to create your professional resume
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Existing Resume */}
            <Button
              onClick={() => router.push('/pages/upload-your-resume')}
              className="group relative h-64 bg-[#1a2644]/50 border-2 border-blue-900/30 hover:bg-[#1a2644]/70 hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="flex flex-col items-center space-y-4">
                <CloudUpload className="h-16 w-16 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
                  <p className="text-sm text-gray-300">
                    Use your existing resume as a starting point
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </Button>

            {/* Create New Resume */}
            <Button
              onClick={() => router.push('/pages/resumepreview')}
              className="group relative h-64 bg-[#1a2644]/50 border-2 border-purple-900/30 hover:bg-[#1a2644]/70 hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="flex flex-col items-center space-y-4">
                <FileEdit className="h-16 w-16 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Create New</h3>
                  <p className="text-sm text-gray-300">
                    Build your resume from scratch
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPreferencePage;