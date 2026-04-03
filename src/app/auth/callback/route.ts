import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(`${origin}/`);
  }

  if (token_hash && type) {
    // For email OTP verification
    return NextResponse.redirect(
      `${origin}/#access_token=${token_hash}&type=${type}`
    );
  }

  // Fallback
  return NextResponse.redirect(`${origin}/`);
}
