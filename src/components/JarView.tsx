"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import GlassJar from "./GlassJar";
import Star from "./Star";
import { useApp } from "@/lib/context";
import { GratitudeEntry } from "@/lib/mock-data";
import { formatMonthFull } from "@/lib/utils";
import { getStarImageByIndex } from "./Star";
import { MetArtwork, getArtworkForDate } from "@/lib/met-api";

const MONTHS = Array.from({ length: 12 }, (_, i) => i);
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

export default function JarView() {
  const { entries } = useApp();
  const [search, setSearch] = useState("");
  const [selectedMonths, setSelectedMonths] = useState<Set<number>>(new Set());
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<GratitudeEntry | null>(null);

  const filteredEntries = useMemo(() => {
    let result = entries;

    if (selectedMonths.size > 0) {
      result = result.filter((e) => {
        const month = new Date(e.date + "T12:00:00").getMonth();
        return selectedMonths.has(month);
      });
    }

    if (selectedQuarter) {
      const qIndex = parseInt(selectedQuarter[1]) - 1;
      const startMonth = qIndex * 3;
      result = result.filter((e) => {
        const month = new Date(e.date + "T12:00:00").getMonth();
        return month >= startMonth && month < startMonth + 3;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.accomplished.toLowerCase().includes(q) ||
          e.happy.toLowerCase().includes(q) ||
          e.lookingForward.toLowerCase().includes(q)
      );
    }

    return result;
  }, [entries, selectedMonths, selectedQuarter, search]);

  const toggleMonth = (m: number) => {
    setSelectedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 pb-8 w-full">
      {/* Search */}
      <div className="w-full max-w-md mb-4 sticky top-0 z-10 pt-2 bg-cream/80 backdrop-blur-sm">
        <input
          type="text"
          placeholder="search your gratitude notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-full bg-cream border border-cream-dark font-[family-name:var(--font-pangaia)] italic text-charcoal text-sm placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-rose min-h-[44px]"
        />
      </div>

      {/* Filter pills */}
      <div className="w-full max-w-md mb-6 overflow-x-auto">
        <div className="flex gap-1.5 flex-nowrap pb-1">
          {MONTHS.map((m) => (
            <button
              key={m}
              onClick={() => toggleMonth(m)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-[family-name:var(--font-pangaia)] tracking-wider touch-target transition-colors ${
                selectedMonths.has(m)
                  ? "bg-charcoal text-cream"
                  : "bg-cream text-muted hover:bg-cream-dark"
              }`}
            >
              {formatMonthFull(m).slice(0, 3)}
            </button>
          ))}
          <div className="w-px bg-muted/20 mx-1 flex-shrink-0" />
          {QUARTERS.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(selectedQuarter === q ? null : q)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-[family-name:var(--font-pangaia)] tracking-wider touch-target transition-colors ${
                selectedQuarter === q
                  ? "bg-charcoal text-cream"
                  : "bg-cream text-muted hover:bg-cream-dark"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Glass jar — fills available space */}
      <div className="relative flex-1 w-full max-w-[500px] mb-8 min-h-0">
        <GlassJar
          entries={filteredEntries}
          size="large"
          onStarClick={setSelectedEntry}
        />
      </div>

      {/* Search results list */}
      {search.trim() && (
        <div className="w-full max-w-md space-y-2">
          {filteredEntries.map((entry) => (
            <SearchResultCard key={entry.id} entry={entry} query={search} />
          ))}
          {filteredEntries.length === 0 && (
            <p className="text-center font-[family-name:var(--font-pangaia)] italic text-muted text-sm">
              no matching entries
            </p>
          )}
        </div>
      )}

      {/* Entry detail modal — two-column like the note card */}
      <AnimatePresence>
        {selectedEntry && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntry(null)}
            />
            <motion.div
              className="fixed z-50 inset-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[min(900px,92vw)] sm:h-[min(600px,80vh)] flex flex-col sm:flex-row paper-texture shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <EntryDetail entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function EntryDetail({ entry, onClose }: { entry: GratitudeEntry; onClose: () => void }) {
  const date = new Date(entry.date + "T12:00:00");
  const starSrc = entry.starImage || getStarImageByIndex(0);
  const artwork = getArtworkForDate(entry.date);

  return (
    <>
      {/* LEFT — Image + artwork info */}
      <div className="sm:w-1/2 flex flex-col shrink-0 p-4 sm:p-6">
        <div className="relative w-full shrink-0 aspect-[4/3] sm:aspect-auto sm:flex-1 sm:min-h-0">
          {artwork ? (
            <Image
              src={artwork.primaryImageUrl}
              alt={artwork.title}
              fill
              className="object-cover"
              sizes="450px"
            />
          ) : (
            <div className="w-full h-full bg-cream-dark" />
          )}
        </div>
        <div className="pt-4 sm:pt-5 shrink-0">
          <h3 className="font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-xl sm:text-2xl mb-1 leading-snug">
            {artwork?.title || "Artwork"}
          </h3>
          <p className="font-[family-name:var(--font-mori)] font-semibold text-[#8A7E74] text-[18px] leading-[1.5] mt-1">
            {artwork?.artist}{artwork?.artworkDate ? `, ${artwork.artworkDate}` : ""}
          </p>
          {artwork?.blurb && (
            <p className="font-[family-name:var(--font-mori)] text-[#8A7E74] text-[16px] leading-[1.5] mt-3">
              {artwork.blurb}
            </p>
          )}
        </div>
      </div>

      {/* Vertical divider — not full height */}
      <div className="hidden sm:flex items-center py-10">
        <div className="w-px h-full bg-charcoal/8" />
      </div>

      {/* RIGHT — Completed entry */}
      <div className="sm:flex-1 flex flex-col p-5 sm:py-8 sm:pr-8 sm:pl-6 overflow-y-auto border-t sm:border-t-0">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 text-muted flex items-center justify-center text-2xl touch-target hover:text-charcoal transition-colors z-10"
        >
          &times;
        </button>

        {/* Date + star */}
        <div className="flex items-center gap-3 mb-6">
          <Star imageSrc={starSrc} size={28} />
          <span className="font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-lg">
            {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>

        <div className="flex flex-col justify-center flex-1 gap-6 sm:gap-8">
          <div>
            <p className="font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-base mb-1.5">
              what i accomplished today
            </p>
            <p className="font-[family-name:var(--font-mori)] text-[#8A7E74] text-[16px] leading-[1.5]">
              {entry.accomplished}
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-base mb-1.5">
              what made me happy
            </p>
            <p className="font-[family-name:var(--font-mori)] text-[#8A7E74] text-[16px] leading-[1.5]">
              {entry.happy}
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-base mb-1.5">
              what i'm looking forward to tomorrow
            </p>
            <p className="font-[family-name:var(--font-mori)] text-[#8A7E74] text-[16px] leading-[1.5]">
              {entry.lookingForward}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function SearchResultCard({ entry, query }: { entry: GratitudeEntry; query: string }) {
  const date = new Date(entry.date + "T12:00:00");

  return (
    <div className="bg-cream p-4 shadow-sm">
      <p className="font-[family-name:var(--font-pangaia)] text-xs text-muted mb-2">
        {date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
      </p>
      <div className="space-y-1">
        <HighlightedText text={entry.accomplished} query={query} />
        <HighlightedText text={entry.happy} query={query} />
        <HighlightedText text={entry.lookingForward} query={query} />
      </div>
    </div>
  );
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <p className="font-[family-name:var(--font-pangaia)] text-charcoal text-sm">{text}</p>;
  }

  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));

  return (
    <p className="font-[family-name:var(--font-pangaia)] text-charcoal text-sm">
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-star-butter/50 px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </p>
  );
}
