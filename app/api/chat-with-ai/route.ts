import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import prisma from "@/app/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";


const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY!,
    maxOutputTokens: 2048,
});

const promptTemplate = new PromptTemplate({
    template: `
You are an expert job analysis assistant with years of experience in HR and career counseling. Your task is to provide detailed, actionable advice based on the comprehensive job analysis data provided. Always maintain a professional, encouraging tone while being honest about areas for improvement.

Candidate Analysis:
1. Job Fit: {jobFitPercentage}%
2. Overall Assessment: {overallAssessment}
3. Key Strengths:
   {strengths}
4. Areas for Improvement:
   {areasForImprovement}
5. Tailored Recommendations:
   {recommendations}
6. Skills Match Analysis:
   {skillsMatch}
7. Experience Evaluation:
   {experienceAnalysis}
8. Project Portfolio Review:
   {projectAnalysis}

Based on this analysis, please address the following user query:
"{prompt}"

In your response:
1. Directly answer the user's question, referencing specific points from the analysis.
2. Provide context on how this relates to their overall job fit and career prospects.
3. Offer 2-3 actionable steps the candidate can take to improve in this area.
4. If relevant, suggest how they can leverage their strengths to overcome any weaknesses.
5. Conclude with an encouraging statement that motivates the candidate to take action.

Remember to be specific, use examples where possible, and tailor your advice to the individual's unique profile. Your goal is to provide clear, practical guidance that the candidate can immediately apply to enhance their career prospects.
    `,
    inputVariables: [
        "jobFitPercentage",
        "overallAssessment",
        "strengths",
        "areasForImprovement",
        "recommendations",
        "skillsMatch",
        "experienceAnalysis",
        "projectAnalysis",
        "prompt",
    ],
});

export async function POST(req: NextRequest){
    try {
        const user = await currentUser();
        const userId = user?.id;

        if( !userId ) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
              );
        }

        const analysisCount = await prisma.userAnalysis.count({
            where: { userId }
        });
        
        if (analysisCount === 0) {
            return NextResponse.json(
                { error: 'At least one scan is required to perform AI chat.' },
                { status: 404 }
            );
        }
        

        const analysis = await prisma.userAnalysis.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                jobFitPercentage: true,
                overallAssessment: true,
                strengths: true,
                areasForImprovement: true,
                recommendations: true,
                skillsMatch: true,
                experienceAnalysis: true,
                projectAnalysis: true,
            }
        })


        const {prompt} = await req.json();
        if(!prompt){
            return NextResponse.json(
                { error: 'Missing prompt' },
                { status: 400 }
            );
        }


        const formattedPrompt = await promptTemplate.format({
            ...analysis[0],
            prompt,
        });

        const response = await model.call([{ role: 'user', content: formattedPrompt }]);
        return NextResponse.json({ answer: response });
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}