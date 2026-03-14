import type { CurrentSelfProfile } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

const TABLE = "profiles";

function toRow(p: CurrentSelfProfile) {
  return {
    user_id: p.userId,
    age: p.age,
    life_stage: p.lifeStage,
    personality_traits: p.personalityTraits ?? [],
    goals: p.goals ?? "",
    fears: p.fears ?? "",
    current_struggles: p.currentStruggles ?? "",
    additional_context: p.additionalContext ?? null,
    updated_at: new Date().toISOString(),
  };
}

function fromRow(row: Record<string, unknown>): CurrentSelfProfile {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    age: row.age as number,
    lifeStage: row.life_stage as CurrentSelfProfile["lifeStage"],
    personalityTraits: (row.personality_traits as string[]) ?? [],
    goals: (row.goals as string) ?? "",
    fears: (row.fears as string) ?? "",
    currentStruggles: (row.current_struggles as string) ?? "",
    additionalContext: (row.additional_context as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getProfileByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<CurrentSelfProfile | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error || !data) return null;
  return fromRow(data);
}

export async function upsertProfile(
  supabase: SupabaseClient,
  profile: CurrentSelfProfile
): Promise<CurrentSelfProfile> {
  const row = toRow(profile);
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      profile.id
        ? { ...row, id: profile.id, updated_at: row.updated_at }
        : { ...row, created_at: new Date().toISOString() },
      { onConflict: "user_id" }
    )
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}
