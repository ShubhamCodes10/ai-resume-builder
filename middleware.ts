import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/Dashboard(.*)', '/pages/(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  if (!userId && isProtectedRoute(req)) {

    return redirectToSignIn()
  }
})

export const config = {
  matcher: [
    '/Dashboard',
    '/pages/upload-your-resume',
    '/pages/resumepreview',
    '/pages/ExistingResume',
    '/pages/Analyse-resume',
    '/api/analyze-job-fit',
    '/api/fetch-user-analysis',
    '/detailed-scan/id',
    '/pages/Ask-AI',
    '/pages/Analyse-Job-Fit',
    '/api/fetch-single-user-analysis',
    '/api/delete-single-user-analysis',
    '/api/chat-with-ai',
    '/api/save-templates',
    '/api/parse-pdf',
    '/pages/Feedback',
    '/pages/Contact-Me'
  ],
}