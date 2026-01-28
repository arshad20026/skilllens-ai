import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Missing required field: message" },
        { status: 400 }
      );
    }

    const response = await chat(message, context);

    return NextResponse.json(
      {
        success: true,
        reply: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
