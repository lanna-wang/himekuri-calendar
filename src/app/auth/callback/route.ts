import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

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

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (data?.session) {
      // Set auth cookies so the middleware can detect the session
      const cookieStore = await cookies();
      const maxAge = 60 * 60 * 24 * 365; // 1 year

      cookieStore.set("sb-access-token", data.session.access_token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge,
      });
      cookieStore.set("sb-refresh-token", data.session.refresh_token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge,
      });
    }

    return NextResponse.redirect(`${origin}/`);
  }

  if (token_hash && type) {
    return NextResponse.redirect(
      `${origin}/#access_token=${token_hash}&type=${type}`
    );
  }

  return NextResponse.redirect(`${origin}/login`);
}
