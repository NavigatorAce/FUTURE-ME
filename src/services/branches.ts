import type { FutureBranch } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

const TABLE = "future_branches";

function toRow(b: FutureBranch) {
  return {
    id: b.id,
    profile_id: b.profileId,
    slug: b.slug,
    title: b.title,
    age_at_future: b.ageAtFuture,
    one_liner: b.oneLiner,
    core_values: b.coreValues ?? [],
    signature_message: b.signatureMessage,
  };
}

function fromRow(row: Record<string, unknown>): FutureBranch {
  return {
    id: row.id as string,
    profileId: row.profile_id as string,
    slug: row.slug as FutureBranch["slug"],
    title: row.title as string,
    ageAtFuture: row.age_at_future as number,
    oneLiner: row.one_liner as string,
    coreValues: (row.core_values as string[]) ?? [],
    signatureMessage: row.signature_message as string,
    createdAt: row.created_at as string,
  };
}

export async function getBranchesByProfileId(
  supabase: SupabaseClient,
  profileId: string
): Promise<FutureBranch[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("profile_id", profileId)
    .order("slug");
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function insertBranches(
  supabase: SupabaseClient,
  profileId: string,
  branches: Omit<FutureBranch, "id" | "profileId" | "createdAt">[]
): Promise<FutureBranch[]> {
  const rows = branches.map((b) => ({
    profile_id: profileId,
    slug: b.slug,
    title: b.title,
    age_at_future: b.ageAtFuture,
    one_liner: b.oneLiner,
    core_values: b.coreValues ?? [],
    signature_message: b.signatureMessage,
  }));
  const { data, error } = await supabase.from(TABLE).insert(rows).select();
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function deleteBranchesByProfileId(
  supabase: SupabaseClient,
  profileId: string
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("profile_id", profileId);
  if (error) throw error;
}
