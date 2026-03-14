import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionWithAnswers } from "@/services/dialogue";
import { mockStore } from "@/lib/mock-store";

const USE_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    if (USE_SUPABASE) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const session = await getSessionWithAnswers(supabase, sessionId, user.id);
      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      return NextResponse.json({ session });
    }

    const raw = mockStore.getSession(sessionId);
    if (!raw) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    const branches = mockStore.getBranches();
    const session = {
      ...raw,
      answers: raw.answers,
      branches,
    };
    return NextResponse.json({ session });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load session" }, { status: 500 });
  }
}
