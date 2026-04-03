import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Star image paths mapped to smallint index
const STAR_PATHS = [
  "/images/star-yellow.png",
  "/images/star-pink.png",
  "/images/star-purple.png",
  "/images/star-blue.png",
  "/images/star-green.png",
];

export function starIndexToPath(index: number): string {
  return STAR_PATHS[index % STAR_PATHS.length];
}

export function starPathToIndex(path: string): number {
  const i = STAR_PATHS.indexOf(path);
  return i >= 0 ? i : 0;
}

// ── Artwork queries ──

export async function getWeekArtworksFromDB(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date");

  if (error) {
    console.error("Error fetching artworks:", error);
    return [];
  }
  return data;
}

export async function getArtworkByDateFromDB(date: string) {
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("date", date)
    .single();

  if (error) return null;
  return data;
}

// ── Entry queries ──

export interface DBEntry {
  uid: string;
  d: string;
  a: string;
  h: string;
  f: string;
  s: number;
}

export async function getUserEntries(userId: string) {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("uid", userId)
    .order("d", { ascending: false });

  if (error) {
    console.error("Error fetching entries:", error);
    return [];
  }
  return data as DBEntry[];
}

export async function submitEntryToDB(entry: {
  userId: string;
  date: string;
  accomplished: string;
  happy: string;
  lookingForward: string;
  starIndex: number;
}) {
  const { data, error } = await supabase
    .from("entries")
    .upsert(
      {
        uid: entry.userId,
        d: entry.date,
        a: entry.accomplished,
        h: entry.happy,
        f: entry.lookingForward,
        s: entry.starIndex,
      },
      { onConflict: "uid,d" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error saving entry:", error);
    return null;
  }
  return data as DBEntry;
}

export async function getEntryForDateFromDB(userId: string, date: string) {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("uid", userId)
    .eq("d", date)
    .single();

  if (error) return null;
  return data as DBEntry;
}

// ── Streak (computed from entries, no extra table) ──

export async function computeStreak(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("entries")
    .select("d")
    .eq("uid", userId)
    .order("d", { ascending: false });

  if (error || !data || data.length === 0) return 0;

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const dates = new Set(data.map((r: { d: string }) => r.d));

  let streak = 0;
  const check = new Date(todayStr + "T12:00:00");

  // If no entry today, start from yesterday
  if (!dates.has(todayStr)) {
    check.setDate(check.getDate() - 1);
  }

  for (let i = 0; i < 365; i++) {
    const key = check.toISOString().split("T")[0];
    if (dates.has(key)) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
