"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "@/lib/context";

export default function Navigation() {
  const pathname = usePathname();
  const { streak } = useApp();
  const isCalendar = pathname === "/";

  return (
    <nav
      className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="relative flex bg-cream-dark/60 backdrop-blur-md border border-charcoal/10 rounded-full p-1.5 w-[280px] sm:w-[340px] h-[52px] sm:h-[56px]">
        {/* Sliding white pill */}
        <motion.div
          className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full bg-white shadow-sm"
          initial={false}
          animate={{ left: isCalendar ? "6px" : "calc(50% + 0px)" }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />

        <Link
          href="/"
          className={`relative z-10 w-1/2 flex items-center justify-center font-[family-name:var(--font-pangaia)] font-medium text-base sm:text-lg tracking-wide lowercase touch-target transition-colors duration-300 ${
            isCalendar ? "text-charcoal" : "text-muted hover:text-charcoal"
          }`}
        >
          calendar
        </Link>
        <Link
          href="/jar"
          className={`relative z-10 w-1/2 flex items-center justify-center font-[family-name:var(--font-pangaia)] font-medium text-base sm:text-lg tracking-wide lowercase touch-target transition-colors duration-300 ${
            !isCalendar ? "text-charcoal" : "text-muted hover:text-charcoal"
          }`}
        >
          jar{streak > 0 ? ` · ${streak}` : ""}
        </Link>
      </div>
    </nav>
  );
}
