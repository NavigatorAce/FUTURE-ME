import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/services/profile";
import { getBranchesByProfileId } from "@/services/branches";
import { createSession, saveAnswers } from "@/services/dialogue";
import { generateAnswerForBranch } from "@/services/ai";
import { mockStore } from "@/lib/mock-store";
import { askPostSchema } from "@/lib/validations/schemas";

const USE_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = askPostSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.flatten().formErrors[0] ?? parsed.error.message;
      return NextResponse.json(
        { error: typeof first === "string" ? first : "Question is required" },
        { status: 400 }
      );
    }

    const { question } = parsed.data;

    if (USE_SUPABASE) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const profile = await getProfileByUserId(supabase, user.id);
      if (!profile?.id) {
        return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
      }
      const branches = await getBranchesByProfileId(supabase, profile.id);
      if (branches.length === 0) {
        return NextResponse.json({ error: "Complete your profile to generate future selves first" }, { status: 400 });
      }
      const session = await createSession(supabase, user.id, profile.id, question);
      const answers = await Promise.all(
        branches.map(async (branch) => ({
          branchId: branch.id,
          branchSlug: branch.slug,
          answerText: await generateAnswerForBranch(question, branch, profile),
        }))
      );
      await saveAnswers(supabase, session.id, answers);
      return NextResponse.json({ sessionId: session.id });
    }

    const userId = mockStore.getUserId();
    const profile = mockStore.getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
    }
    const branches = mockStore.getBranches();
    if (branches.length === 0) {
      return NextResponse.json({ error: "Complete your profile to generate future selves first" }, { status: 400 });
    }
    const session = mockStore.createSession(userId, profile.id, question);
    const answers = await Promise.all(
      branches.map(async (branch) => ({
        branchId: branch.id,
        branchSlug: branch.slug,
        answerText: await generateAnswerForBranch(question, branch, profile),
      }))
    );
    mockStore.setAnswers(session.id, answers);
    return NextResponse.json({ sessionId: session.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to get answers" },
      { status: 500 }
    );
  }
}
