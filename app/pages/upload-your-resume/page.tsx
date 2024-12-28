'use client'

import { PdfDataExtractor } from '@/components/PdfDataExtractor'
import { ResumeProvider } from '@/context/ResumeContext'
import React from 'react'
import { useResumeContext } from '@/context/ResumeContext'
import ExistingResumeEditor from './ExistingResumeEditor'

function uploadYourResume() {
 
  const { existingResume } = useResumeContext();


return (
  <div>
    <ResumeProvider>
      {existingResume ? (
        <ExistingResumeEditor />
      ) : (
        <PdfDataExtractor />
      )}
    </ResumeProvider>
  </div>
);
}

export default uploadYourResume