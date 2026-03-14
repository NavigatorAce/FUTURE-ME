import type {
  BranchAnswer,
  DialogueSession,
  DialogueSessionWithAnswers,
} from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getBranchesByProfileId } from "./branches";

const SESSIONS_TABLE = "dialogue_sessions";
const ANSWERS_TABLE = "branch_answers";

function sessionFromRow(row: Record<string, unknown>): DialogueSession {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    profileId: row.profile_id as string,
    question: row.question as string,
    createdAt: row.created_at as string,
  };
}

function answerFromRow(row: Record<string, unknown>): BranchAnswer {
  return {
    id: row.id as string,
    sessionId: row.session_id as string,
    branchId: row.branch_id as string,
    branchSlug: row.branch_slug as BranchAnswer["branchSlug"],
    answerText: row.answer_text as string,
    createdAt: row.created_at as string,
  };
}

export async function createSession(
  supabase: SupabaseClient,
  userId: string,
  profileId: string,
  question: string
): Promise<DialogueSession> {
  const { data, error } = await supabase
    .from(SESSIONS_TABLE)
    .insert({
      user_id: userId,
      profile_id: profileId,
      question,
    })
    .select()
    .single();
  if (error) throw error;
  return sessionFromRow(data);
}

export async function saveAnswers(
  supabase: SupabaseClient,
  sessionId: string,
  answers: { branchId: string; branchSlug: string; answerText: string }[]
): Promise<BranchAnswer[]> {
  const rows = answers.map((a) => ({
    session_id: sessionId,
    branch_id: a.branchId,
    branch_slug: a.branchSlug,
    answer_text: a.answerText,
  }));
  const { data, error } = await supabase.from(ANSWERS_TABLE).insert(rows).select();
  if (error) throw error;
  return (data ?? []).map(answerFromRow);
}

export async function getSessionsByUserId(
  supabase: SupabaseClient,
  userId: string,
  limit = 50
): Promise<DialogueSession[]> {
  const { data, error } = await supabase
    .from(SESSIONS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(sessionFromRow);
}

export async function getSessionWithAnswers(
  supabase: SupabaseClient,
  sessionId: string,
  userId: string
): Promise<DialogueSessionWithAnswers | null> {
  const { data: sessionRow, error: sessionError } = await supabase
    .from(SESSIONS_TABLE)
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();
  if (sessionError || !sessionRow) return null;

  const session = sessionFromRow(sessionRow);
  const { data: answerRows } = await supabase
    .from(ANSWERS_TABLE)
    .select("*")
    .eq("session_id", sessionId);
  const answers = (answerRows ?? []).map(answerFromRow);

  const branches = await getBranchesByProfileId(supabase, session.profileId);
  return {
    ...session,
    branches,
    answers,
  };
}
