import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/prisma";
import { uploadFiletoFirebase } from '@/firebase/firebaseSetup'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("Unauthorized upload attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();

    // Ensure user exists in the database or create a new record
    await prisma.user.upsert({
      where: { id: userId },
      update: {}, 
      create: { 
        id: userId,
        name: user?.firstName || user?.lastName || "Anonymous", 
        email: user?.emailAddresses?.[0]?.emailAddress || "anonymous@example.com",
      },
    });

    const formData = await request.formData();
    const file = formData.get("file");
    const role = (formData.get("role") as string) || "Developer";

    if (!(file instanceof File)) {
      console.error("Invalid file object:", file);
      return NextResponse.json(
        { 
          error: "Invalid file", 
          details: `Received type: ${typeof file}, Expected: File` 
        }, 
        { status: 400 }
      );
    }

    // Upload the file to Firebase Storage
    const uploadPath = `resumes/${userId}`;
    const pdfUrl = await uploadFiletoFirebase(file, uploadPath); 

    if (!pdfUrl) {
      console.error("Firebase upload failed");
      return NextResponse.json(
        { error: "Firebase upload failed" },
        { status: 500 }
      );
    }

    // Save the file information to the database
    const name = user?.firstName || user?.lastName || "Anonymous";

    const resume = await prisma.resume.create({
      data: {
        id: crypto.randomUUID(),
        userId: userId,
        name: name,
        role: role,
        pdfUrl: pdfUrl, // Save the Firebase file URL
      },
    });

    // Successful response
    return NextResponse.json(
      { message: "Upload successful", resume },
      { status: 201 }
    );

  } catch (error) {
    // Comprehensive error logging
    console.error("Comprehensive upload error:", {
      errorName: error instanceof Error ? error.name : "Unknown Error",
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : "No stack trace",
    });

    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
}
