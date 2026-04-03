"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Listen for auth state changes — handles the hash fragment from magic link
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Set a cookie so the middleware knows we're authed
          document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
          document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
          router.push("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-4xl sm:text-5xl mb-3">
          himekuri
        </h1>
        <p className="font-[family-name:var(--font-mori)] text-[#8A7E74] text-[16px] leading-[1.5] mb-10">
          a daily art discovery and gratitude ritual
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email"
              className="w-full px-5 py-3.5 bg-white border border-charcoal/10 font-[family-name:var(--font-mori)] text-[16px] text-charcoal placeholder:text-[#8A7E74]/50 focus:outline-none focus:border-charcoal/30 min-h-[44px]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white border border-charcoal/10 shadow-sm font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-sm tracking-wider disabled:opacity-50 touch-target transition-colors hover:bg-charcoal/5"
            >
              {loading ? "sending..." : "send me a magic link"}
            </button>
            {error && (
              <p className="font-[family-name:var(--font-mori)] text-rose text-sm">{error}</p>
            )}
          </form>
        ) : (
          <div>
            <p className="font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-lg mb-2">
              check your email
            </p>
            <p className="font-[family-name:var(--font-mori)] text-[#8A7E74] text-[16px] leading-[1.5]">
              we sent a magic link to <strong>{email}</strong>
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 font-[family-name:var(--font-mori)] text-[#8A7E74] text-sm underline touch-target"
            >
              try a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
