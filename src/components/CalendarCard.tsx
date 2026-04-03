"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Artwork, getRandomStarImage, getEntryForDate } from "@/lib/mock-data";
import { formatMonthShort, formatDayShort, formatDayNumber, dateToKey, isSameDay, isBeforeDay } from "@/lib/utils";
import { useApp } from "@/lib/context";
import Star, { getStarImageByIndex } from "./Star";
import { playPaperFlip } from "@/lib/sound";
import StarAnimation from "./StarAnimation";

interface CalendarCardProps {
  date: Date;
  artwork?: Artwork;
  today: Date;
}

export default function CalendarCard({ date, artwork, today }: CalendarCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showStarAnimation, setShowStarAnimation] = useState(false);
  const [starImage, setStarImage] = useState("");
  const [accomplished, setAccomplished] = useState("");
  const [happy, setHappy] = useState("");
  const [lookingForward, setLookingForward] = useState("");

  const { submitEntry, hasEntryForDate, soundEnabled, setActiveAnimation } = useApp();

  const isToday = isSameDay(date, today);
  const isPast = isBeforeDay(date, today);
  const isFuture = !isToday && !isPast;
  const dateStr = dateToKey(date);
  const alreadyDone = hasEntryForDate(dateStr);

  const getEntryStarImage = (d: string) => {
    const entry = getEntryForDate(d);
    return entry?.starImage || getStarImageByIndex(0);
  };

  const handleClick = useCallback(() => {
    // Pre-fill with existing entry if editing
    if (alreadyDone) {
      const existing = getEntryForDate(dateStr);
      if (existing) {
        setAccomplished(existing.accomplished);
        setHappy(existing.happy);
        setLookingForward(existing.lookingForward);
      }
    }
    setShowModal(true);
  }, [alreadyDone, soundEnabled, dateStr]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!accomplished.trim() || !happy.trim() || !lookingForward.trim()) return;

    const isEditing = alreadyDone;
    const chosenStar = isEditing ? (getEntryForDate(dateStr)?.starImage || getRandomStarImage()) : getRandomStarImage();
    setStarImage(chosenStar);

    submitEntry({
      date: dateStr,
      accomplished: accomplished.trim(),
      happy: happy.trim(),
      lookingForward: lookingForward.trim(),
      artworkId: artwork?.id || "",
      starImage: chosenStar,
    });

    setShowModal(false);

    // Only play star animation on first completion, not edits
    if (!isEditing) {
      setActiveAnimation(dateStr);
      setShowStarAnimation(true);
    }
  }, [accomplished, happy, lookingForward, dateStr, artwork, submitEntry, setActiveAnimation, alreadyDone]);

  const handleAnimationComplete = useCallback(() => {
    setShowStarAnimation(false);
    setActiveAnimation(null);
  }, [setActiveAnimation]);

  return (
    <>
      {/* Card front — always visible in the tray */}
      <div
        className={`card-snap relative flex-shrink-0 touch-target w-[50vw] sm:w-[calc((100%-96px)/7)] ${
          "cursor-pointer hover-lift"
        }`}
        style={{ aspectRatio: "3 / 4" }}
        onClick={handleClick}
      >
        <div className="relative w-full h-full overflow-hidden bg-white border border-charcoal/8 p-2 sm:p-2.5 flex flex-col">
          {/* Image with padding */}
          <div className="relative w-full flex-1 min-h-0">
            {artwork ? (
              <Image
                src={artwork.primaryImageUrl}
                alt={artwork.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 14vw"
                priority={isToday}
              />
            ) : (
              <div className="w-full h-full bg-cream flex items-center justify-center">
                <span className="font-[family-name:var(--font-pangaia)] font-extralight italic text-muted text-sm">
                  discovering art...
                </span>
              </div>
            )}
          </div>

          {/* Date strip below image — horizontal layout: mar  29  sun */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 px-2 py-2 sm:py-3 shrink-0">
            <span className="font-[family-name:var(--font-pangaia)] font-medium text-sm sm:text-base text-muted lowercase">
              {formatMonthShort(date)}
            </span>
            <span className="font-[family-name:var(--font-pangaia)] font-bold text-2xl sm:text-3xl text-charcoal leading-none">
              {formatDayNumber(date)}
            </span>
            <span className="font-[family-name:var(--font-pangaia)] font-medium text-sm sm:text-base text-muted lowercase">
              {formatDayShort(date)}
            </span>
          </div>

          {/* Today indicator */}
          {isToday && !alreadyDone && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose" />
          )}

        </div>

        {/* Completed star badge — top right, overflows card */}
        {alreadyDone && (
          <div className="absolute -top-3 -right-3 z-20">
            <Star imageSrc={getEntryStarImage(dateStr)} size={44} />
          </div>
        )}
      </div>

      {/* Expanded popup modal — two-column layout */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            />
            {/* Modal card — mobile: stacked, desktop: side by side */}
            <motion.div
              className="fixed z-50 inset-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[min(900px,92vw)] sm:h-[min(600px,80vh)] flex flex-col sm:flex-row paper-texture shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* LEFT — Image + artwork info */}
              <div className="sm:w-1/2 flex flex-col shrink-0">
                {/* Image */}
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
                    <div className="w-full h-full bg-cream" />
                  )}
                </div>
                {/* Artwork info below image */}
                <div className="p-5 sm:p-6 shrink-0">
                  <h3 className="font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-xl sm:text-2xl mb-1 leading-snug">
                    {artwork?.title}
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

              {/* RIGHT — Prompts + done button */}
              <div className="sm:w-1/2 flex flex-col p-5 sm:p-8 overflow-y-auto border-t sm:border-t-0 sm:border-l border-charcoal/5">
                {/* Close button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-3 right-3 w-8 h-8 text-muted flex items-center justify-center text-2xl touch-target hover:text-charcoal transition-colors z-10"
                >
                  &times;
                </button>

                {!isFuture && (
                  <div className="flex flex-col justify-center flex-1">
                    {/* Gratitude prompts */}
                    <div className="flex flex-col gap-6 sm:gap-8">
                      <GratitudeField
                        label="what i accomplished today"
                        value={accomplished}
                        onChange={setAccomplished}
                      />
                      <GratitudeField
                        label="what made me happy"
                        value={happy}
                        onChange={setHappy}
                      />
                      <GratitudeField
                        label="what i'm looking forward to tomorrow"
                        value={lookingForward}
                        onChange={setLookingForward}
                      />
                    </div>

                    {/* Submit button */}
                    <div className="mt-8">
                      <button
                        onClick={handleSubmit}
                        disabled={!accomplished.trim() || !happy.trim() || !lookingForward.trim()}
                        className="w-full py-3 rounded-full border border-charcoal/10 bg-white text-charcoal shadow-sm font-[family-name:var(--font-pangaia)] font-medium text-sm tracking-wider disabled:opacity-30 disabled:cursor-not-allowed touch-target transition-colors hover:bg-charcoal/5"
                      >
                        done
                      </button>
                    </div>
                  </div>
                )}

                {isFuture && (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="font-[family-name:var(--font-pangaia)] font-extralight italic text-muted/50 text-lg">
                      come back to reflect on this day
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Star animation */}
      {showStarAnimation && (
        <StarAnimation dateStr={dateStr} starImage={starImage} onComplete={handleAnimationComplete} />
      )}
    </>
  );
}

function GratitudeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
  };

  return (
    <div>
      <label className="block font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-base mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onInput={handleInput}
        rows={1}
        className="input-line py-2.5 min-h-[44px] resize-none overflow-hidden"
      />
    </div>
  );
}
