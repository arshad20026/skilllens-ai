import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const analyses = await prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(analyses, { status: 200 });
  } catch (error) {
    console.error("Analyses route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}
