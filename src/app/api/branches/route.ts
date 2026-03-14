import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/services/profile";
import { getBranchesByProfileId } from "@/services/branches";
import { mockStore } from "@/lib/mock-store";

const USE_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    if (USE_SUPABASE) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ branches: [] });
      }
      const profile = await getProfileByUserId(supabase, user.id);
      if (!profile?.id) return NextResponse.json({ branches: [] });
      const branches = await getBranchesByProfileId(supabase, profile.id);
      return NextResponse.json({ branches });
    }

    const branches = mockStore.getBranches();
    return NextResponse.json({ branches });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ branches: [] });
  }
}
