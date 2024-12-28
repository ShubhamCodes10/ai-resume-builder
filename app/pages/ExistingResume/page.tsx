'use client'

import React from 'react'
import ExistingResumeEditor from '../upload-your-resume/ExistingResumeEditor'
import { ResumeProvider } from '@/context/ResumeContext'
import ExistingResumePreview from '../upload-your-resume/ExistingResumePreview'

function page() {
  
  return (
    <ResumeProvider>
    <div className="flex flex-col md:flex-row gap-8 p-8">
      <div className="w-full md:w-1/2">
        <ExistingResumeEditor />
      </div>
      <div className="w-full md:w-1/2">
        <ExistingResumePreview />
      </div>
    </div>
  </ResumeProvider>
  );
}

export default page