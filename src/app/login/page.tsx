"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle hash fragment from magic link (if user clicks the link directly)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
          document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
          router.push("/");
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [router]);

  const handleSendCode = async (e: React.FormEvent) => {
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
      setStep("code");
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: "email",
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else if (data.session) {
      document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      router.push("/");
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

        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4">
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
              className="w-full py-3.5 bg-white border border-charcoal/10 font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-sm tracking-wider disabled:opacity-50 touch-target transition-colors hover:bg-charcoal/5"
            >
              {loading ? "sending..." : "send me a login code"}
            </button>
            {error && (
              <p className="font-[family-name:var(--font-mori)] text-rose text-sm">{error}</p>
            )}
          </form>
        )}

        {step === "code" && (
          <div>
            <p className="font-[family-name:var(--font-mori)] text-[#8A7E74] text-[16px] leading-[1.5] mb-6">
              we sent a code to <strong>{email}</strong>
            </p>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="enter your code"
                className="w-full px-5 py-3.5 bg-white border border-charcoal/10 font-[family-name:var(--font-mori)] text-[16px] text-charcoal text-center tracking-[0.3em] placeholder:tracking-normal placeholder:text-[#8A7E74]/50 focus:outline-none focus:border-charcoal/30 min-h-[44px]"
                maxLength={8}
                autoFocus
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-white border border-charcoal/10 font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-sm tracking-wider disabled:opacity-50 touch-target transition-colors hover:bg-charcoal/5"
              >
                {loading ? "verifying..." : "sign in"}
              </button>
              {error && (
                <p className="font-[family-name:var(--font-mori)] text-rose text-sm">{error}</p>
              )}
            </form>
            <button
              onClick={() => { setStep("email"); setOtp(""); setError(""); }}
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
