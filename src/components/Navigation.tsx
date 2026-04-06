"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "@/lib/context";

export default function Navigation() {
  const pathname = usePathname();
  const { entries, weekOffset, goToPreviousWeek, goToNextWeek, resetToCurrentWeek, canGoNext } = useApp();
  const isCalendar = pathname === "/";

  return (
    <nav
      className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center gap-3">
        {/* Left arrow — go to previous week */}
        {isCalendar && (
          <button
            onClick={goToPreviousWeek}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-cream-dark/60 backdrop-blur-md border border-charcoal/10 text-charcoal touch-target transition-colors hover:bg-cream-dark"
            aria-label="Previous week"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="sm:w-5 sm:h-5">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Toggle switch */}
        <div className="relative flex bg-cream-dark/60 backdrop-blur-md border border-charcoal/10 rounded-full p-1.5 w-[240px] sm:w-[300px] h-[48px] sm:h-[52px]">
          <motion.div
            className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full bg-white shadow-sm"
            initial={false}
            animate={{ left: isCalendar ? "6px" : "calc(50% + 0px)" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />

          <Link
            href="/"
            onClick={() => { if (isCalendar) resetToCurrentWeek(); }}
            className={`relative z-10 w-1/2 flex items-center justify-center font-[family-name:var(--font-pangaia)] font-medium text-sm sm:text-base tracking-wide lowercase touch-target transition-colors duration-300 ${
              isCalendar ? "text-charcoal" : "text-muted hover:text-charcoal"
            }`}
          >
            {isCalendar && weekOffset < 0 ? "today" : "calendar"}
          </Link>
          <Link
            href="/jar"
            className={`relative z-10 w-1/2 flex items-center justify-center font-[family-name:var(--font-pangaia)] font-medium text-sm sm:text-base tracking-wide lowercase touch-target transition-colors duration-300 ${
              !isCalendar ? "text-charcoal" : "text-muted hover:text-charcoal"
            }`}
          >
            jar{entries.length > 0 ? ` · ${entries.length}` : ""}
          </Link>
        </div>

        {/* Right arrow — go to next week (only if viewing past) */}
        {isCalendar && (
          <button
            onClick={goToNextWeek}
            disabled={!canGoNext}
            className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-cream-dark/60 backdrop-blur-md border border-charcoal/10 touch-target transition-colors ${
              canGoNext ? "text-charcoal hover:bg-cream-dark" : "text-charcoal/15 cursor-default"
            }`}
            aria-label="Next week"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="sm:w-5 sm:h-5">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
}
