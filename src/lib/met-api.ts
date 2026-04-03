"use client";

export interface MetArtwork {
  objectId: number;
  title: string;
  artist: string;
  artworkDate: string;
  primaryImageUrl: string;
  blurb: string;
}

// Cache fetched artworks in memory to avoid re-fetching
const cache = new Map<string, MetArtwork>();

// Deterministic "random" pick based on date string — same date always gets same artwork
function dateToSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Public domain object IDs known to have good images (curated fallbacks)
const FALLBACK_IDS = [
  436535, 436524, 438417, 437984, 436105, 435868, 437329, 436002,
  437980, 436121, 437826, 436528, 435882, 437879, 11417, 45434,
  436946, 437153, 438009, 459027, 438821,
];

function makeBlurb(obj: any): string {
  const medium = obj.medium ? obj.medium.split(";")[0].trim() : "";
  const culture = obj.culture || "";
  const period = obj.period || "";
  const context = culture || period;
  if (medium && context) return `${medium}. ${context}.`;
  if (medium) return medium + ".";
  if (context) return context + ".";
  return "";
}

async function fetchObjectDetails(objectId: number): Promise<MetArtwork | null> {
  try {
    const res = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
    );
    if (!res.ok) return null;
    const obj = await res.json();

    if (!obj.primaryImageSmall) return null;

    return {
      objectId: obj.objectID,
      title: obj.title || "Untitled",
      artist: obj.artistDisplayName || "",
      artworkDate: obj.objectDate || "",
      primaryImageUrl: obj.primaryImageSmall,
      blurb: makeBlurb(obj),
    };
  } catch {
    return null;
  }
}

// Get a pool of public domain IDs (cached after first fetch)
let idPool: number[] = [];

async function getIdPool(): Promise<number[]> {
  if (idPool.length > 0) return idPool;

  try {
    const res = await fetch(
      "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isPublicDomain=true&departmentId=11&q=*"
    );
    const data = await res.json();
    if (data.objectIDs && data.objectIDs.length > 0) {
      idPool = data.objectIDs;
      return idPool;
    }
  } catch {
    // fall through
  }

  // Fallback to curated list
  idPool = FALLBACK_IDS;
  return idPool;
}

export async function getArtworkForDate(dateStr: string): Promise<MetArtwork> {
  // Check cache
  if (cache.has(dateStr)) return cache.get(dateStr)!;

  const pool = await getIdPool();
  const seed = dateToSeed(dateStr);
  const index = seed % pool.length;
  const objectId = pool[index];

  const artwork = await fetchObjectDetails(objectId);

  if (artwork) {
    cache.set(dateStr, artwork);
    return artwork;
  }

  // If that failed, try a few more from the pool
  for (let i = 1; i <= 5; i++) {
    const fallbackId = pool[(index + i) % pool.length];
    const fallback = await fetchObjectDetails(fallbackId);
    if (fallback) {
      cache.set(dateStr, fallback);
      return fallback;
    }
  }

  // Last resort: use a known good fallback
  const lastResort = FALLBACK_IDS[seed % FALLBACK_IDS.length];
  const result = await fetchObjectDetails(lastResort);
  if (result) {
    cache.set(dateStr, result);
    return result;
  }

  // Absolute fallback — return placeholder
  const placeholder: MetArtwork = {
    objectId: 0,
    title: "Artwork of the Day",
    artist: "",
    artworkDate: "",
    primaryImageUrl: "",
    blurb: "",
  };
  cache.set(dateStr, placeholder);
  return placeholder;
}

export async function getArtworksForWeek(dates: Date[]): Promise<MetArtwork[]> {
  const results = await Promise.all(
    dates.map((d) => {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return getArtworkForDate(key);
    })
  );
  return results;
}
