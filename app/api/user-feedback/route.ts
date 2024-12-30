import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, feedback } = await req.json();

    if (!name || !email || !feedback) {
      return NextResponse.json(
        { error: 'Name, email, and feedback are required.' },
        { status: 400 }
      );
    }

    const userResponse = await prisma.userResponse.create({
      data: {
        name,
        email,
        feedback,
      },
    });

    return NextResponse.json({ message: 'Feedback saved successfully!', userResponse });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Something went wrong while saving your feedback.' },
      { status: 500 }
    );
  }
}
