import { NextResponse, NextRequest } from "next/server";
import {auth} from '@clerk/nextjs/server'
import { saveTemplateToFirebase } from "@/firebase/firebaseSetup";


export  async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
    if (!userId) {
      console.error("Unauthorized upload attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json()
    const { templateId, templateName, templateData } = body;
    if (!templateId || !templateName || !templateData) {
      return NextResponse.json({message: "Failed to save template"}, {status: 400})
    }
    await saveTemplateToFirebase(userId, templateId, {
        name: templateName,
        data: templateData
    })
    return NextResponse.json({message: "Template saved successfully"}, {status: 200})

    } catch (error) {
        console.error("Error saving template:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}