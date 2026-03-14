import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/services/profile";
import { mockStore } from "@/lib/mock-store";
import { genAI, GEMINI_MODEL } from "@/lib/gemini/client";
import { getFutureMeSystemPrompt } from "@/lib/gemini/prompts";
import { chatPostSchema } from "@/lib/validations/schemas";
import type { CurrentSelfProfile } from "@/types";

const USE_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const USE_MOCK = !process.env.GEMINI_API_KEY;

function getMockReply(question: string): string {
  return `Hey, I hear you. That's something I remember wrestling with too. Looking back from where I am now, I'd say: don't overthink it. The fact that you're asking "${question.slice(0, 60)}${question.length > 60 ? "..." : ""}" tells me you already sense the direction you need to go.\n\nWhat I can tell you is — the worrying? It doesn't go away entirely, but it changes shape. The things I was afraid of back then, most of them either never happened or turned out to be manageable. What mattered more was showing up, even imperfectly.\n\nTrust yourself a little more than you think you should. You've got this.`;
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = chatPostSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.flatten().formErrors[0] ?? parsed.error.message;
      return NextResponse.json(
        { error: typeof first === "string" ? first : "Validation failed" },
        { status: 400 }
      );
    }

    const { messages, yearsAhead } = parsed.data;

    // Get user profile
    let profile: CurrentSelfProfile | null = null;

    if (USE_SUPABASE) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      profile = await getProfileByUserId(supabase, user.id);
    } else {
      profile = mockStore.getProfile();
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Please complete your profile first" },
        { status: 400 }
      );
    }

    // Mock mode — no Gemini key
    if (USE_MOCK) {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
      const reply = getMockReply(lastUserMsg?.content ?? "your question");
      return NextResponse.json({ message: reply });
    }

    // Build system prompt with full profile info + years ahead
    const systemPrompt = getFutureMeSystemPrompt(profile, yearsAhead);

    // Convert chat messages to Gemini format (Gemini uses "user" / "model" roles)
    const geminiHistory = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    // Create Gemini model with system instruction containing profile & persona
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
    });

    // Start chat with conversation history for multi-turn support
    const chat = model.startChat({
      history: geminiHistory,
    });

    // Send the latest user message
    const result = await chat.sendMessage(lastMessage.content);
    const reply = result.response.text();

    if (!reply) {
      throw new Error("No response from Gemini");
    }

    return NextResponse.json({ message: reply });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to get response" },
      { status: 500 }
    );
  }
}
