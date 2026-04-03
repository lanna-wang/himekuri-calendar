"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";

const MESSAGES = [
  "you got this!! \u2764",
  "proud of you today \u2764",
  "keep going, you're amazing \u2764",
  "you're doing great \u2764",
  "today is your day \u2764",
  "you make the world brighter \u2764",
  "one step at a time \u2764",
  "believe in yourself \u2764",
  "you are enough \u2764",
  "good things are coming \u2764",
  "be gentle with yourself \u2764",
  "you're stronger than you think \u2764",
  "take a deep breath \u2764",
  "you deserve good things \u2764",
  "keep shining \u2764",
  "don't forget to smile \u2764",
  "you're not alone \u2764",
  "celebrate the small wins \u2764",
  "tomorrow is a fresh start \u2764",
  "you're doing better than you think \u2764",
  "be kind to yourself today \u2764",
  "every day is a new chance \u2764",
  "you bring joy to others \u2764",
  "rest is productive too \u2764",
  "your best is good enough \u2764",
  "the world needs your light \u2764",
  "you're allowed to take it slow \u2764",
  "progress, not perfection \u2764",
  "you matter more than you know \u2764",
  "breathe in, breathe out \u2764",
  "it's okay to rest \u2764",
];

function getTodaysMessage(): string {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return MESSAGES[dayOfYear % MESSAGES.length];
}

export default function DuckMessage() {
  const [showMessage, setShowMessage] = useState(false);
  const message = useMemo(() => getTodaysMessage(), []);

  const handleHover = useCallback(() => {
    setShowMessage(true);
  }, []);

  const handleLeave = useCallback(() => {
    setShowMessage(false);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 z-20 pointer-events-auto cursor-default"
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div className="relative">
        <Image
          src="/images/ducks.png"
          alt=""
          width={280}
          height={280}
          className="w-[180px] sm:w-[240px] lg:w-[280px] h-auto translate-y-4 select-none"
          priority={false}
        />

        {/* Speech bubble */}
        {showMessage && (
          <div className="absolute top-[15%] left-1/2 -translate-x-1/3 w-max max-w-[200px] sm:max-w-[240px]">
            <div className="relative bg-white px-4 py-2.5 border border-charcoal/8 font-[family-name:var(--font-mori)] text-charcoal text-sm sm:text-base text-center leading-snug">
              {message}
              {/* Triangle pointer */}
              <svg
                className="absolute left-1/2 -translate-x-1/2 -bottom-[10px]"
                width="20"
                height="10"
                viewBox="0 0 20 10"
              >
                <path d="M0 0 L10 10 L20 0" fill="white" />
                <path d="M0 0 L10 10 L20 0" fill="none" stroke="rgba(44,44,44,0.08)" strokeWidth="1" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
