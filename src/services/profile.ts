import type { CurrentSelfProfile } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

const TABLE = "current_self_profiles";

function toRow(p: CurrentSelfProfile) {
  return {
    user_id: p.userId,
    profile_name: p.profileName ?? "",
    name: p.name ?? "",
    status: p.status ?? null,
    university: p.university ?? "",
    major: p.major ?? "",
    job: p.job ?? "",
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
    profileName: (row.profile_name as string) ?? undefined,
    name: (row.name as string) ?? undefined,
    status: (row.status as CurrentSelfProfile["status"]) ?? undefined,
    university: (row.university as string) ?? undefined,
    major: (row.major as string) ?? undefined,
    job: (row.job as string) ?? undefined,
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

/** Create or ensure a default profile row for a user (e.g. right after sign up). */
export async function ensureProfileForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<CurrentSelfProfile> {
  const defaults: CurrentSelfProfile = {
    id: "",
    userId,
    profileName: "",
    name: "",
    age: 30,
    lifeStage: "exploring",
    personalityTraits: [],
    goals: "",
    fears: "",
    currentStruggles: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return upsertProfile(supabase, defaults);
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
  const payload = profile.id
    ? { ...row, id: profile.id, updated_at: row.updated_at }
    : { ...row, created_at: new Date().toISOString() };

  const { data, error } = await supabase
    .from(TABLE)
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();

  if (error) throw error;
  return fromRow(data);
}
