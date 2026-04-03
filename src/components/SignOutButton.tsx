"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className="font-[family-name:var(--font-mori)] text-[#8A7E74] text-xs touch-target hover:text-charcoal transition-colors"
    >
      sign out
    </button>
  );
}
