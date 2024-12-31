import { deleteSingleJobAnalysisByUserId } from "@/firebase/firebaseSetup";
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
    const recordId = url.searchParams.get("id");

    if (!recordId || recordId.trim() === "") {
      return NextResponse.json(
        { error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    await deleteSingleJobAnalysisByUserId(userId, recordId);

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
