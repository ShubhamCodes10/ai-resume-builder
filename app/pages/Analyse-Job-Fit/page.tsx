'use client'

import ResumeScan from '@/components/ResumeScans'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

function AnalyzeJobFit() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0f1833] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Card className="bg-black/20 border-none text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Previous Resume Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <ResumeScan />
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-none text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Analyze Your Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-lg">
              Get insights on how well your resume fits your desired job position. Our AI-powered analysis will provide you with valuable feedback and suggestions for improvement.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => router.push('/pages/Analyse-resume')}
              className="w-full bg-white text-[#0f1833] hover:bg-white/90 transition-colors"
              size="lg"
            >
              Start New Scan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default AnalyzeJobFit

