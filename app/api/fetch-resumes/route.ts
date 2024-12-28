import prisma from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export interface USER{
    userId: string
}

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            console.error("Unauthorized upload attempt");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // first find user with ID
        const foundUser = await prisma.user.findUnique({
            where: {id: userId}
        })
        if(!foundUser){
            console.error("Failed to found User")
            return NextResponse.json({error: "Failed to find user"}, {status: 404})
        }

        // search for image url in db
        const userPdf = await prisma.resume.findMany({
            where: {userId: foundUser.id},
            select: {pdfUrl: true}
        });
        if(!userPdf || userPdf.length === 0){
            return NextResponse.json({error: "Failed to find user resumes"}, {status: 404})
        }

        return NextResponse.json({ resumes: userPdf });
    } catch (error) {
        console.error("Error fetching user resumes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}