import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionsByUserId } from "@/services/dialogue";
import { mockStore } from "@/lib/mock-store";

const USE_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    if (USE_SUPABASE) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ sessions: [] });
      const sessions = await getSessionsByUserId(supabase, user.id);
      return NextResponse.json({ sessions });
    }
    const sessions = mockStore.getSessions(mockStore.getUserId());
    return NextResponse.json({ sessions });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ sessions: [] });
  }
}
