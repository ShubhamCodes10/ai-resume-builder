import prisma from "@/app/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const analysesData =  await prisma.userAnalysis.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                jobFitPercentage: true,
                overallAssessment: true,
                analysisTimestamp: true,
                confidenceScore: true,
                modelVersion: true,
                areasForImprovement: true,
                atsImprovements: true,
                experienceAnalysis: true,
                projectAnalysis: true,
                recommendations: true,
                skillsMatch: true,
                strengths: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            success: true,
            data: analysesData
        }, {status: 200})
    } catch (error: any) {
        return NextResponse.json(
            { 
                success: false,
                error: "Failed to fetch user analyses",
                details: error instanceof Error ? error.message : "Unknown error"
            }, 
            { status: 500 }
        )
    }
}