"use client";

export default function SeasonalDetail() {
  const month = new Date().getMonth();

  // April: cherry blossom petal
  if (month === 3) {
    return (
      <svg
        className="absolute -top-6 -left-2 sm:-left-8 w-8 h-8 opacity-40 select-none pointer-events-none"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 4c-4 4-8 10-6 14s6 4 6 4 4 0 6-4-2-10-6-14z"
          fill="#f4b4c4"
          opacity="0.8"
        />
        <path
          d="M16 4c-2 6-1 12 2 14"
          stroke="#e8a0b4"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
    );
  }

  // October: fallen leaf
  if (month === 9) {
    return (
      <svg
        className="absolute -top-6 -right-2 sm:-right-8 w-8 h-8 opacity-40 select-none pointer-events-none"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M8 24C12 20 14 12 16 6c2 6 4 14 8 18-4-1-8-2-8-2s-4 1-8 2z"
          fill="#d4824a"
          opacity="0.7"
        />
        <path d="M16 6v16" stroke="#c47040" strokeWidth="0.5" />
      </svg>
    );
  }

  // December: snowflake
  if (month === 11) {
    return (
      <svg
        className="absolute -top-6 -left-2 sm:-left-8 w-6 h-6 opacity-30 select-none pointer-events-none"
        viewBox="0 0 24 24"
        fill="none"
      >
        <line x1="12" y1="2" x2="12" y2="22" stroke="#b0c4de" strokeWidth="1" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="#b0c4de" strokeWidth="1" />
        <line x1="5" y1="5" x2="19" y2="19" stroke="#b0c4de" strokeWidth="0.8" />
        <line x1="19" y1="5" x2="5" y2="19" stroke="#b0c4de" strokeWidth="0.8" />
        <circle cx="12" cy="12" r="1.5" fill="#b0c4de" opacity="0.5" />
      </svg>
    );
  }

  return null;
}
