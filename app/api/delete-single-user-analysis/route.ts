import prisma from "@/app/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
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
        const id = url.searchParams.get("id");
        console.log("id", id);
        

        if (!id || isNaN(parseInt(id))) {
            return NextResponse.json(
                { error: "Invalid or missing analysis ID" },
                { status: 400 }
            );
        }

        const result = await prisma.userAnalysis.deleteMany({
            where: {
                id: parseInt(id),
                userId: userId, 
            },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: "Analysis not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Analysis deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting user analysis:", error);
        return NextResponse.json(
            {
                error: "Failed to delete user analysis",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
