import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "email" | "magiclink" | null;
  const code = searchParams.get("code");

  const supabase = await createSupabaseServer();

  // Handle PKCE flow (code exchange)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // Handle magic link token hash
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type === "email" ? "email" : "magiclink",
    });
    if (!error) {
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // Auth failed — redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
