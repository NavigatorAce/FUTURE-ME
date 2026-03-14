import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email, password, signUp } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    const supabase = await createClient();
    if (signUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ user: data.user });
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return NextResponse.json({ error: error.message }, { status: 401 });
    return NextResponse.json({ user: data.user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}
