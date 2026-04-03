"use client";

import Image from "next/image";

const STAR_IMAGES = [
  "/images/star-yellow.png",
  "/images/star-pink.png",
  "/images/star-purple.png",
  "/images/star-blue.png",
  "/images/star-green.png",
];

export function getRandomStarImage(): string {
  return STAR_IMAGES[Math.floor(Math.random() * STAR_IMAGES.length)];
}

export function getStarImageByIndex(index: number): string {
  return STAR_IMAGES[index % STAR_IMAGES.length];
}

interface StarProps {
  imageSrc?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function Star({ imageSrc, size = 24, className = "", style, onClick }: StarProps) {
  const src = imageSrc || STAR_IMAGES[0];

  return (
    <div
      className={`${className} touch-target relative`}
      style={{ width: size, height: size, ...style }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Image
        src={src}
        alt="paper star"
        fill
        className="object-contain"
        sizes={`${size}px`}
      />
    </div>
  );
}
