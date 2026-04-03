"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignOutButton() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email || null);
    }).catch(() => {});
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    document.cookie = "sb-access-token=; path=/; max-age=0";
    document.cookie = "sb-refresh-token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <div className="flex items-center gap-2">
      {email && (
        <span className="font-[family-name:var(--font-mori)] text-[#8A7E74] text-xs hidden sm:inline">
          {email}
        </span>
      )}
      <button
        onClick={handleSignOut}
        className="font-[family-name:var(--font-mori)] text-[#8A7E74] text-xs touch-target hover:text-charcoal transition-colors underline"
      >
        sign out
      </button>
    </div>
  );
}
