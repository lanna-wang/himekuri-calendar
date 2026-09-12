"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    params.get("error") === "link" ? "that link expired — try another" : null
  );

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    setLoading(false);
    if (error) setError(error.message.toLowerCase());
    else setSent(true);
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-4xl sm:text-5xl mb-3">
        himekuri
      </h1>
      <p className="font-[family-name:var(--font-pangaia)] font-extralight italic text-muted mb-8">
        a daily gratitude calendar
      </p>

      {sent ? (
        <p className="font-[family-name:var(--font-pangaia)] text-charcoal max-w-xs">
          check your email — we sent a link that signs you in
        </p>
      ) : (
        <form onSubmit={send} className="w-full max-w-xs flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your email"
            className="w-full px-4 py-3 rounded-full bg-cream border border-cream-dark font-[family-name:var(--font-pangaia)] italic text-charcoal text-sm text-center placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-rose min-h-[44px]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-full bg-charcoal text-cream font-[family-name:var(--font-pangaia)] text-sm tracking-wider lowercase disabled:opacity-50 touch-target transition-opacity min-h-[44px]"
          >
            {loading ? "sending…" : "send me a link"}
          </button>
        </form>
      )}

      {error && (
        <p className="mt-4 font-[family-name:var(--font-pangaia)] italic text-xs text-rose">
          {error}
        </p>
      )}

      <p className="mt-10 font-[family-name:var(--font-pangaia)] italic text-xs text-muted/70 max-w-xs">
        your notes are stored in your account so they follow you between
        devices. they are not end-to-end encrypted
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
