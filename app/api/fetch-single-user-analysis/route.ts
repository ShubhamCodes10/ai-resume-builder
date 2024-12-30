import { fetchSingleJobAnalysisByUserId } from "@/firebase/firebaseSetup";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        console.log("id from backend", id);
        

        if (!id) {
            return NextResponse.json(
                { error: "Missing analysis ID" },
                { status: 400 }
            );
        }

        const singleUserAnalysis = await fetchSingleJobAnalysisByUserId(userId, id);

        if (!singleUserAnalysis) {
            return NextResponse.json(
                { error: "Analysis not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: singleUserAnalysis,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching user analysis:", error);

        return NextResponse.json(
            { 
                success: false,
                error: "Failed to fetch user analysis",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
