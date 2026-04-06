"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/context";

function getWeekKey(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  // Find the Saturday ending this week
  const sat = new Date(now);
  sat.setDate(now.getDate() + (6 - day));
  return `week-${sat.getFullYear()}-${String(sat.getMonth() + 1).padStart(2, "0")}-${String(sat.getDate()).padStart(2, "0")}`;
}

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const sun = new Date(now);
  sun.setDate(now.getDate() - day);
  sun.setHours(0, 0, 0, 0);
  return sun;
}

function isSaturdayOrLater(): boolean {
  return new Date().getDay() >= 6; // Saturday = 6
}

export default function WeeklySummary() {
  const { entries } = useApp();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSaturdayOrLater()) return;

    const weekKey = getWeekKey();
    const cacheKey = `himekuri_summary_${weekKey}`;

    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setSummary(cached);
      return;
    }

    // Get this week's entries
    const weekStart = getWeekStart();
    const weekEntries = entries.filter((e) => {
      const d = new Date(e.date + "T12:00:00");
      return d >= weekStart;
    });

    if (weekEntries.length === 0) return;

    // Generate summary
    setLoading(true);
    fetch("/api/weekly-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entries: weekEntries.map((e) => ({
          date: e.date,
          accomplished: e.accomplished,
          happy: e.happy,
          lookingForward: e.lookingForward,
        })),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) {
          setSummary(data.summary);
          localStorage.setItem(cacheKey, data.summary);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [entries]);

  if (!isSaturdayOrLater() || (!summary && !loading)) return null;

  return (
    <div className="w-full max-w-md mb-6 px-1">
      <h2 className="font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-lg mb-2">
        this week&apos;s reflection
      </h2>
      {loading ? (
        <p className="font-[family-name:var(--font-mori)] text-[#8A7E74] text-[15px] leading-[1.6] animate-pulse">
          reflecting on your week...
        </p>
      ) : (
        <p className="font-[family-name:var(--font-mori)] text-[#8A7E74] text-[15px] leading-[1.6]">
          {summary}
        </p>
      )}
    </div>
  );
}
