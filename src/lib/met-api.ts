"use client";

export interface MetArtwork {
  objectId: number;
  title: string;
  artist: string;
  artworkDate: string;
  primaryImageUrl: string;
  blurb: string;
}

// 365 verified paintings loaded from static JSON
let artworks: MetArtwork[] = [];
let loadPromise: Promise<void> | null = null;

async function loadArtworks(): Promise<void> {
  if (artworks.length > 0) return;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const res = await fetch("/data/artworks.json");
      const data = await res.json();
      artworks = data.map((a: any) => ({
        objectId: a.id,
        title: a.t,
        artist: a.a,
        artworkDate: a.d,
        primaryImageUrl: a.i,
        blurb: a.b,
      }));
    } catch {
      // Fallback handled below
    }
  })();

  return loadPromise;
}

// Map a date to its day-of-year (0-364), giving each day a unique painting
function dayOfYear(dateStr: string): number {
  const d = new Date(dateStr + "T12:00:00");
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000) - 1; // 0-indexed
}

export function getArtworkForDate(dateStr: string): MetArtwork {
  if (artworks.length === 0) {
    // Not loaded yet — return placeholder
    return {
      objectId: 0,
      title: "",
      artist: "",
      artworkDate: "",
      primaryImageUrl: "",
      blurb: "",
    };
  }

  const day = dayOfYear(dateStr);
  // Each day gets a unique painting (wraps after 365)
  const index = ((day % artworks.length) + artworks.length) % artworks.length;
  return artworks[index];
}

export async function getArtworksForWeek(dates: Date[]): Promise<MetArtwork[]> {
  await loadArtworks();
  return dates.map((d) => {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return getArtworkForDate(key);
  });
}
