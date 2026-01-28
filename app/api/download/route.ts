import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Buffer } from "buffer";

export async function GET(request: NextRequest) {
  try {
    const analysisId = request.nextUrl.searchParams.get("id");

    if (!analysisId) {
      return NextResponse.json(
        { error: "Analysis ID is required" },
        { status: 400 }
      );
    }

    // Fetch analysis from database
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    // Parse JSON data with better error handling
    let skillsData;
    let roadmapData;
    try {
      const skillsGapParsed = typeof analysis.skillsGap === 'string' 
        ? JSON.parse(analysis.skillsGap) 
        : analysis.skillsGap;
      const roadmapParsed = typeof analysis.roadmap === 'string' 
        ? JSON.parse(analysis.roadmap) 
        : analysis.roadmap;
      
      skillsData = skillsGapParsed;
      roadmapData = roadmapParsed;
    } catch (parseError) {
      console.error("Error parsing analysis data:", parseError);
      skillsData = { 
        missingSkills: Array.isArray(analysis.skillsGap) ? analysis.skillsGap : [analysis.skillsGap],
        gapAnalysis: "Analysis data" 
      };
      roadmapData = { 
        phases: typeof analysis.roadmap === 'string' 
          ? analysis.roadmap.split('\n').filter((p: string) => p.trim())
          : [analysis.roadmap]
      };
    }

    // Create text-based report
    const date = new Date(analysis.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let reportText = `SKILLLENS AI - SKILL GAP ANALYSIS REPORT\n`;
    reportText += `${"=".repeat(60)}\n\n`;
    reportText += `Email: ${analysis.user.email}\n`;
    reportText += `Date: ${date}\n`;
    reportText += `Target Role: ${analysis.role}\n\n`;
    reportText += `${"=".repeat(60)}\n`;
    reportText += `SKILLS GAP ANALYSIS\n`;
    reportText += `${"=".repeat(60)}\n\n`;
    
    if (skillsData.gapAnalysis) {
      reportText += `${skillsData.gapAnalysis}\n\n`;
    }
    
    if (skillsData.missingSkills && Array.isArray(skillsData.missingSkills)) {
      reportText += `Missing Skills:\n`;
      skillsData.missingSkills.forEach((skill: string, idx: number) => {
        const skillStr = typeof skill === 'string' ? skill : String(skill);
        reportText += `${idx + 1}. ${skillStr}\n`;
      });
      reportText += `\n`;
    } else if (skillsData.missingSkills) {
      reportText += `Missing Skills:\n1. ${String(skillsData.missingSkills)}\n\n`;
    }

    reportText += `${"=".repeat(60)}\n`;
    reportText += `LEARNING ROADMAP\n`;
    reportText += `${"=".repeat(60)}\n\n`;
    
    if (roadmapData.roadmapDescription) {
      reportText += `${roadmapData.roadmapDescription}\n\n`;
    }
    
    if (roadmapData.timelineEstimate) {
      reportText += `Timeline: ${roadmapData.timelineEstimate}\n\n`;
    }
    
    if (roadmapData.phases && Array.isArray(roadmapData.phases)) {
      reportText += `Learning Phases:\n`;
      roadmapData.phases.forEach((phase: string, idx: number) => {
        const phaseStr = typeof phase === 'string' ? phase : String(phase);
        reportText += `Phase ${idx + 1}: ${phaseStr}\n`;
      });
    } else if (roadmapData.roadmap) {
      reportText += `Learning Roadmap:\n${String(roadmapData.roadmap)}\n`;
    } else if (roadmapData.timeline) {
      reportText += `Timeline: ${String(roadmapData.timeline)}\n`;
    }

    // Return text file
    return new NextResponse(reportText, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="skillgap-${analysis.role.replace(/ /g, "-")}-${Date.now()}.txt"`,
        "Content-Length": Buffer.byteLength(reportText, "utf-8").toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
