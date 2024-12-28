import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import prisma from '@/app/lib/prisma';
import {auth, currentUser} from '@clerk/nextjs/server';

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY!,
  maxOutputTokens: 2048,
});

const jobAnalysisSchema = z.object({
  jobFitPercentage: z.number().min(0).max(100),
  overallAssessment: z.string(),
  strengths: z.array(z.object({
    skill: z.string(),
    description: z.string(),
  })),
  areasForImprovement: z.array(z.object({
    area: z.string(),
    suggestion: z.string(),
  })),
  recommendations: z.array(z.string()),
  skillsMatch: z.object({
    technical: z.array(z.object({
      skill: z.string(),
      matchLevel: z.enum(["high", "medium", "low", "missing"]),
      comment: z.string(),
    })),
    soft: z.array(z.object({
      skill: z.string(),
      matchLevel: z.enum(["high", "medium", "low", "missing"]),
      comment: z.string(),
    }))
  }),
  experienceAnalysis: z.array(z.object({
    company: z.string(),
    position: z.string(),
    duration: z.string(),
    keyPoints: z.array(z.string()),
    relevance: z.string(),
  })),
  projectAnalysis: z.array(z.object({
    name: z.string(),
    description: z.string(),
    keyPoints: z.array(z.string()),
    relevance: z.string(),
  })),
  experienceRelevance: z.object({
    score: z.number().min(0).max(100),
    relevantExperiences: z.array(z.object({
      experience: z.string(),
      relevance: z.string(),
    })),
    missingExperiences: z.array(z.string()),
  }),
  educationFit: z.object({
    score: z.number().min(0).max(100),
    comment: z.string(),
  }),
  cultureFit: z.object({
    score: z.number().min(0).max(100),
    comment: z.string(),
  }),
  atsImprovements: z.array(z.object({
    section: z.string(),
    suggestion: z.string(),
  })),
});

const parser = StructuredOutputParser.fromZodSchema(jobAnalysisSchema);

const template = `System: You are an advanced AI recruiter specializing in comprehensive job fit analysis. Your task is to provide an in-depth, nuanced, and actionable analysis of a candidate's resume against a specific job description.

Input Resume: {resume}

Job Description: {jobDescription}

Instructions: Conduct a thorough analysis of the resume against the job description. Your assessment should be detailed, objective, and provide actionable insights for both the candidate and potential employers.

Required Output Format:
{format_instructions}

Guidelines for Analysis:
1. Overall Assessment: Provide a comprehensive summary of the candidate's fit for the role, considering all aspects of their profile.
2. Strengths: Identify key strengths relevant to the job, explaining their value and direct relevance to the position.
3. Areas for Improvement: Highlight areas where the candidate could enhance their profile, with specific, actionable suggestions and potential impact.
4. Skills Match: Evaluate both technical and soft skills, providing detailed comments on the match level and suggestions for improvement where applicable.
5. Experience Analysis: Analyze each work experience in depth, highlighting key points, relevance to the job, skills demonstrated, and overall impact on job fit.
6. Project Analysis: Provide a detailed analysis of each project, noting key points, relevance, skills demonstrated, and how it enhances the candidate's fit for the role.
7. Experience Relevance: Assess how well the candidate's overall experience aligns with the job requirements, identifying key alignments and any missing experiences.
8. Education Fit: Evaluate the relevance and adequacy of the candidate's educational background, including specific courses and suggestions for further education if applicable.
9. Culture Fit: Assess potential cultural fit based on available information, identifying alignment points and potential challenges.
10. ATS Improvements: Provide detailed suggestions to enhance the resume's ATS-friendliness, explaining the reasoning behind each suggestion.
11. Keyword Analysis: Analyze the presence and density of relevant keywords, suggesting improvements for better ATS performance.
12. Recommendations: Offer prioritized, actionable advice for the candidate to improve their fit for this or similar roles, with clear rationale for each recommendation.

Remember:
- Maintain objectivity and balance in your assessment, supporting your analysis with specific examples from both the resume and job description.
- Consider both explicit and implicit requirements of the job description, as well as industry standards and trends.
- Provide recommendations that are practical, achievable, and tailored to the specific candidate and role.
- Focus on making the resume more effective for both human readers and ATS systems, considering modern recruitment practices.
- Quantify your assessments where possible (e.g., percentage matches, scores) to provide clear metrics for evaluation.
- Consider the candidate's career trajectory and how this role fits into their professional development.

Your analysis should be comprehensive enough to serve as a valuable tool for both the candidate in improving their application and for recruiters in making informed decisions.`;

const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["resume", "jobDescription"],
  partialVariables: {
    format_instructions: parser.getFormatInstructions()
  }
});

const analysisChain = RunnableSequence.from([
  promptTemplate,
  model,
  parser
]);

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing resume text or job description' }, 
        { status: 400 }
      );
    }

    const analysis = await analysisChain.invoke({
      resume: resumeText,
      jobDescription: jobDescription
    });

    const response = {
      ...analysis,
      metadata: {
        analysisTimestamp: new Date().toISOString(),
        modelVersion: "gemini-1.5-flash",
        confidenceScore: calculateConfidenceScore(analysis)
      }
    };

    await prisma.$transaction([
      prisma.userAnalysis.create({
        data: {
          userId: userId,
          jobFitPercentage: response.jobFitPercentage,
          overallAssessment: response.overallAssessment,
          analysisTimestamp: new Date(response.metadata.analysisTimestamp),
          confidenceScore: response.metadata.confidenceScore,
          modelVersion: response.metadata.modelVersion,
          
          strengths: response.strengths,
          areasForImprovement: response.areasForImprovement,
          recommendations: response.recommendations,
          skillsMatch: response.skillsMatch,
          experienceAnalysis: response.experienceAnalysis,
          projectAnalysis: response.projectAnalysis,
          atsImprovements: response.atsImprovements,
        }
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          dailyUsageCounter: {
            increment: 1
          }
        }
      })
    ]);

    console.log(response);
    

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error in job fit analysis:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid analysis format', 
          details: error.errors 
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function calculateConfidenceScore(analysis: z.infer<typeof jobAnalysisSchema>) {
  let score = 100;
  
  if (analysis.strengths.length === 0) score -= 10;
  if (analysis.areasForImprovement.length === 0) score -= 10;
  if (analysis.recommendations.length === 0) score -= 10;
  if (analysis.skillsMatch.technical.length === 0) score -= 10;
  if (analysis.skillsMatch.soft.length === 0) score -= 10;
  if (analysis.experienceAnalysis.length === 0) score -= 15;
  if (analysis.projectAnalysis.length === 0) score -= 10;
  if (analysis.experienceRelevance.relevantExperiences.length === 0) score -= 10;
  if (analysis.educationFit.score === 0) score -= 5;
  if (analysis.cultureFit.score === 0) score -= 5;
  if (analysis.atsImprovements.length === 0) score -= 5;
  
  return Math.max(0, Math.min(100, score));
}

