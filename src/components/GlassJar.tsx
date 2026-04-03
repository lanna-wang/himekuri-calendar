"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Star from "./Star";
import { getStarImageByIndex } from "./Star";
import { GratitudeEntry } from "@/lib/mock-data";

interface GlassJarProps {
  entries: GratitudeEntry[];
  className?: string;
  size?: "small" | "large";
  onStarClick?: (entry: GratitudeEntry) => void;
}

function getStarPositions(count: number, containerW: number, containerH: number, starSize: number) {
  const positions: { x: number; y: number; rotation: number }[] = [];
  // Jar body: stars fill from ~82% up, with horizontal padding ~20%
  const bottomY = containerH * 0.80;
  const padX = containerW * 0.2;
  const usableW = containerW - padX * 2;

  const cols = Math.max(3, Math.floor(usableW / (starSize * 1.3)));

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const xJitter = (Math.random() - 0.5) * (starSize * 0.4);
    const yJitter = (Math.random() - 0.5) * (starSize * 0.3);

    positions.push({
      x: padX + col * (usableW / cols) + (usableW / cols - starSize) / 2 + xJitter,
      y: bottomY - row * (starSize * 0.9) - starSize + yJitter,
      rotation: Math.random() * 30 - 15,
    });
  }
  return positions;
}

export default function GlassJar({ entries, className = "", size = "small", onStarClick }: GlassJarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const isLarge = size === "large";
  const starSize = isLarge ? Math.max(28, dims.w * 0.09) : 16;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      setDims({ w: el.offsetWidth, h: el.offsetHeight });
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const positions = dims.w > 0 ? getStarPositions(entries.length, dims.w, dims.h, starSize) : [];

  if (!isLarge) {
    // Small jar (used in animations) — fixed size
    return (
      <div className={`relative ${className}`} style={{ width: 100, height: 190 }}>
        <Image src="/images/jar.png" alt="Glass jar" fill className="object-contain pointer-events-none" sizes="100px" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto ${className}`}
      style={{ aspectRatio: "3 / 5", maxHeight: "calc(100dvh - 220px)", width: "min(100%, 500px)" }}
    >
      {/* Jar image */}
      <Image
        src="/images/jar.png"
        alt="Glass jar"
        fill
        className="object-contain pointer-events-none"
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 500px"
        priority
      />

      {/* Empty state */}
      {entries.length === 0 && (
        <p className="absolute left-1/2 top-[55%] -translate-x-1/2 text-center font-[family-name:var(--font-pangaia)] font-extralight italic text-muted text-base opacity-50">
          your first star
          <br />
          is waiting
        </p>
      )}

      {/* Stars inside the jar */}
      {positions.map((pos, i) => {
        const entry = entries[i];
        if (!entry) return null;
        const src = entry.starImage || getStarImageByIndex(i);
        return (
          <div
            key={entry.id}
            className="absolute transition-all duration-200 cursor-pointer hover-glow z-10"
            style={{
              left: pos.x,
              top: pos.y,
              transform: `rotate(${pos.rotation}deg)`,
            }}
          >
            <Star
              imageSrc={src}
              size={starSize}
              onClick={() => onStarClick?.(entry)}
            />
          </div>
        );
      })}
    </div>
  );
}
