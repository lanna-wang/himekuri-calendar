"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

interface Petal {
  id: number;
  startX: number;
  startY: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  rotation: number;
  color: string;
}

const PINK_SHADES = [
  "#f4b4c4",
  "#e8909e",
  "#f9cdd5",
  "#d4748a",
  "#fce0e5",
  "#e6a0af",
  "#f2c0cc",
  "#dc8899",
];

let petalCounter = 0;

export default function CherryBlossomTree() {
  const [petals, setPetals] = useState<Petal[]>([]);

  const spawnPetals = useCallback(() => {
    if (petals.length > 0) return;

    const newPetals: Petal[] = Array.from({ length: 18 }, () => ({
      id: petalCounter++,
      startX: 55 + Math.random() * 40, // start from right side of screen (%)
      startY: 5 + Math.random() * 30,  // start from top area
      size: 10 + Math.random() * 16,
      delay: Math.random() * 0.8,
      duration: 1.8 + Math.random() * 1.2,
      drift: -100 - Math.random() * 200, // drift leftward across screen
      rotation: Math.random() * 360,
      color: PINK_SHADES[Math.floor(Math.random() * PINK_SHADES.length)],
    }));

    setPetals(newPetals);
    setTimeout(() => setPetals([]), 3500);
  }, [petals.length]);

  return (
    <>
      <div
        className="fixed bottom-0 right-0 z-20 pointer-events-auto cursor-default"
        onMouseEnter={spawnPetals}
      >
        <Image
          src="/images/cherry-blossom.png"
          alt=""
          width={320}
          height={400}
          className="w-[200px] sm:w-[280px] lg:w-[320px] h-auto translate-y-4 select-none"
          priority={false}
        />
      </div>

      {/* Petals rendered via portal so they float across the full screen */}
      {petals.length > 0 && typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
            {petals.map((petal) => (
              <div
                key={petal.id}
                className="absolute"
                style={{
                  left: `${petal.startX}%`,
                  top: `${petal.startY}%`,
                  animation: `petalFall ${petal.duration}s ease-in-out ${petal.delay}s forwards`,
                  "--petal-drift": `${petal.drift}px`,
                  "--petal-rotation": `${petal.rotation + 720}deg`,
                } as React.CSSProperties}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  width={petal.size}
                  height={petal.size}
                >
                  {/* Petal shape */}
                  <path
                    d="M10 2 C14 5, 16 10, 10 18 C4 10, 6 5, 10 2Z"
                    fill={petal.color}
                    opacity="0.85"
                  />
                  {/* Center vein */}
                  <path
                    d="M10 3 Q10 10, 10 17"
                    stroke={petal.color}
                    strokeWidth="0.3"
                    opacity="0.5"
                    fill="none"
                  />
                </svg>
              </div>
            ))}
          </div>,
          document.body
        )
      }
    </>
  );
}
