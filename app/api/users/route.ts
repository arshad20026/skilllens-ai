export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Create or get user
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Missing email" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Create if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: { email },
      });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Users route error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        error: "Failed to process user",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
