import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { entries } = await request.json();

    if (!entries || entries.length === 0) {
      return NextResponse.json({ summary: null });
    }

    const entriesText = entries
      .map(
        (e: any) =>
          `${e.date}: accomplished: ${e.accomplished} | happy: ${e.happy} | looking forward: ${e.lookingForward}`
      )
      .join("\n");

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Here are someone's gratitude journal entries from this past week:\n\n${entriesText}\n\nWrite a warm, brief 2-3 sentence weekly reflection summarizing the themes of their week. Be gentle and encouraging. Don't use bullet points. Don't start with "This week" — vary the opening. Keep it under 50 words. Do not use emojis.`,
        },
      ],
    });

    const summary =
      message.content[0].type === "text" ? message.content[0].text : null;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Weekly summary error:", error);
    return NextResponse.json({ summary: null }, { status: 500 });
  }
}
