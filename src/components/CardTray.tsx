"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import CalendarCard from "./CalendarCard";
import { getWeekDates, isSameDay } from "@/lib/utils";
import { MetArtwork, getArtworksForWeek } from "@/lib/met-api";
import { useApp } from "@/lib/context";

export default function CardTray() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { weekOffset } = useApp();
  const [today] = useState(() => new Date());

  // Compute the reference date based on week offset
  const referenceDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [today, weekOffset]);

  const weekDates = useMemo(() => getWeekDates(referenceDate), [referenceDate]);
  const todayIndex = weekDates.findIndex((d) => isSameDay(d, today));
  const [activeIndex, setActiveIndex] = useState(todayIndex >= 0 ? todayIndex : 0);
  const [artworks, setArtworks] = useState<(MetArtwork | null)[]>(new Array(7).fill(null));
  const [loading, setLoading] = useState(true);

  // Fetch artworks when week changes
  useEffect(() => {
    setLoading(true);
    getArtworksForWeek(weekDates).then((results) => {
      setArtworks(results);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset]);

  // Auto-scroll to today on mount (mobile), only if current week
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || todayIndex < 0 || weekOffset !== 0) return;
    if (window.innerWidth >= 640) return;

    const cards = container.children;
    if (cards[todayIndex]) {
      const card = cards[todayIndex] as HTMLElement;
      const scrollLeft = card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "instant" });
    }
  }, [todayIndex, loading, weekOffset]);

  // Track active card for dot indicator (mobile)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const center = container.scrollLeft + container.offsetWidth / 2;
      const cards = Array.from(container.children) as HTMLElement[];
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Convert MetArtwork to the shape CalendarCard expects
  const toCardArtwork = (art: MetArtwork | null) => {
    if (!art) return undefined;
    return {
      id: String(art.objectId),
      date: "",
      objectId: art.objectId,
      title: art.title,
      artist: art.artist,
      artworkDate: art.artworkDate,
      primaryImageUrl: art.primaryImageUrl,
      blurb: art.blurb,
    };
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full">
        {/* Loading state */}
        {loading && (
          <p className="text-center font-[family-name:var(--font-pangaia)] font-extralight italic text-muted text-sm mb-4 animate-pulse">
            discovering today&apos;s art...
          </p>
        )}

        {/* Cards container */}
        <div
          ref={scrollRef}
          className="card-tray-scroll flex gap-3 sm:gap-5 overflow-x-auto sm:overflow-x-visible sm:justify-center px-[20vw] sm:px-0"
        >
          {weekDates.map((date, i) => (
            <CalendarCard
              key={date.toISOString()}
              date={date}
              artwork={toCardArtwork(artworks[i])}
              today={today}
            />
          ))}
        </div>

        {/* Dot indicator (mobile only) */}
        <div className="flex justify-center gap-1.5 mt-4 sm:hidden">
          {weekDates.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                i === activeIndex ? "bg-charcoal" : "bg-charcoal/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
