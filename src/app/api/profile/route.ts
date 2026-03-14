import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId, upsertProfile } from "@/services/profile";
import { mockStore } from "@/lib/mock-store";
import type { CurrentSelfProfile } from "@/types";

const USE_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    if (USE_SUPABASE) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const profile = await getProfileByUserId(supabase, user.id);
      return NextResponse.json({ profile });
    }
    const profile = mockStore.getProfile();
    return NextResponse.json({ profile });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      age,
      lifeStage,
      personalityTraits,
      goals,
      fears,
      currentStruggles,
      additionalContext,
    } = body;

    const profile: CurrentSelfProfile = {
      userId: "", // set below
      age: age ?? 30,
      lifeStage: lifeStage ?? "exploring",
      personalityTraits: Array.isArray(personalityTraits) ? personalityTraits : [],
      goals: goals ?? "",
      fears: fears ?? "",
      currentStruggles: currentStruggles ?? "",
      additionalContext: additionalContext ?? undefined,
    };

    if (USE_SUPABASE) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      profile.userId = user.id;
      const saved = await upsertProfile(supabase, profile);
      return NextResponse.json({ profile: saved });
    }

    const userId = mockStore.getUserId();
    profile.userId = userId;
    const saved = mockStore.setProfile(profile);
    return NextResponse.json({ profile: saved });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save profile" },
      { status: 500 }
    );
  }
}
