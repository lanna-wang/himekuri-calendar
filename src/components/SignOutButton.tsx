"use client";

import { useState } from "react";
import { signOut } from "@/lib/entries";

export default function SignOutButton() {
  const [busy, setBusy] = useState(false);

  return (
    <button
      onClick={async () => {
        setBusy(true);
        await signOut();
        window.location.href = "/login";
      }}
      disabled={busy}
      className="font-[family-name:var(--font-pangaia)] italic text-xs text-muted/60 hover:text-charcoal disabled:opacity-50 touch-target transition-colors"
    >
      {busy ? "signing out…" : "sign out"}
    </button>
  );
}
