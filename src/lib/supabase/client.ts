import { createBrowserClient } from "@supabase/ssr";

/** Browser-side client. Uses the anon key, which is public by design — the
 *  actual privacy boundary is the RLS policies in supabase/schema.sql. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
