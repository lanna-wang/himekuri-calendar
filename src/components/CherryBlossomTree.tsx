"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  rotation: number;
}

let petalCounter = 0;

export default function CherryBlossomTree() {
  const [petals, setPetals] = useState<Petal[]>([]);

  const spawnPetals = useCallback(() => {
    // Don't spawn if already animating
    if (petals.length > 0) return;

    const newPetals: Petal[] = Array.from({ length: 12 }, () => ({
      id: petalCounter++,
      x: 20 + Math.random() * 60, // spread across the tree width (%)
      y: 5 + Math.random() * 40, // start from upper portion of tree
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.6,
      duration: 1.5 + Math.random() * 1,
      drift: -30 + Math.random() * 60, // horizontal drift
      rotation: Math.random() * 360,
    }));

    setPetals(newPetals);

    // Clear petals after animations complete
    setTimeout(() => setPetals([]), 2500);
  }, [petals.length]);

  return (
    <div
      className="fixed bottom-0 right-0 z-0 pointer-events-auto cursor-default"
      onMouseEnter={spawnPetals}
    >
      <div className="relative">
        <Image
          src="/images/cherry-blossom.png"
          alt=""
          width={320}
          height={400}
          className="w-[200px] sm:w-[280px] lg:w-[320px] h-auto translate-y-4 select-none"
          priority={false}
        />

        {/* Floating petals */}
        {petals.map((petal) => (
          <div
            key={petal.id}
            className="absolute pointer-events-none"
            style={{
              left: `${petal.x}%`,
              top: `${petal.y}%`,
              width: petal.size,
              height: petal.size,
              animation: `petalFall ${petal.duration}s ease-in ${petal.delay}s forwards`,
              "--petal-drift": `${petal.drift}px`,
              "--petal-rotation": `${petal.rotation}deg`,
            } as React.CSSProperties}
          >
            <svg
              viewBox="0 0 12 12"
              fill="none"
              width={petal.size}
              height={petal.size}
            >
              <ellipse
                cx="6"
                cy="6"
                rx="5"
                ry="3"
                transform={`rotate(${petal.rotation} 6 6)`}
                fill="#f4b4c4"
                opacity="0.8"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
