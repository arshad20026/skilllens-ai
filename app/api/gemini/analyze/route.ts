export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { analyzeSkillGap } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { role, currentSkills, userId } = await request.json();

    if (!role || !currentSkills) {
      return NextResponse.json(
        { error: "Missing required fields: role, currentSkills" },
        { status: 400 }
      );
    }

    // Check if API key is set
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Analyze skills
    const analysis = await analyzeSkillGap(role, currentSkills);

    // Save to database if userId provided
    if (userId) {
      const dbAnalysis = await prisma.analysis.create({
        data: {
          role,
          skillsGap: JSON.stringify(analysis),
          roadmap: analysis.roadmap || "Analysis completed",
          userId,
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: analysis,
          analysisId: dbAnalysis.id,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: analysis,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analyze route error:", error);
    return NextResponse.json(
      { 
        error: "Failed to analyze skills",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
