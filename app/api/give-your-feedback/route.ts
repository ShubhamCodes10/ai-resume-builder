import { saveFeedbackToFirestore } from "@/firebase/firebaseSetup";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name, email, feedback } = await req.json();  

    if (!name || !email || !feedback) {  
        return NextResponse.json({
            message: "Please provide all the required fields",
        }, { status: 400 })
    }

    try {
        const feedbackResult = await saveFeedbackToFirestore(name, email, feedback);
        return NextResponse.json({
            message: "Feedback submitted successfully",
            feedbackResult,
        })    
    } catch (error: any) {
        return NextResponse.json({
            message: "An error occurred while submitting feedback",
            error: error.message,
        }, { status: 500 })
    }
}