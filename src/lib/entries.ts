import { createClient } from "./supabase/client";
import {
  GratitudeEntry,
  starIndexToPath,
  starPathToIndex,
} from "./mock-data";

/** Shape of the live `entries` table. The column names are short for historical
 *  reasons: uid/date/accomplished/happy/looking-forward/star-index. */
interface EntryRow {
  uid: string;
  d: string;
  a: string | null;
  h: string | null;
  f: string | null;
  s: number | null;
}

function toEntry(row: EntryRow): GratitudeEntry {
  return {
    id: `${row.uid}-${row.d}`,
    date: row.d,
    accomplished: row.a ?? "",
    happy: row.h ?? "",
    lookingForward: row.f ?? "",
    // Not stored: the artwork is derived from the date, and nothing reads this.
    artworkId: "",
    starImage: starIndexToPath(row.s ?? 0),
    createdAt: `${row.d}T12:00:00.000Z`,
  };
}

function toRow(entry: GratitudeEntry | Omit<GratitudeEntry, "id" | "createdAt">, uid: string): EntryRow {
  return {
    uid,
    d: entry.date,
    a: entry.accomplished,
    h: entry.happy,
    f: entry.lookingForward,
    s: starPathToIndex(entry.starImage),
  };
}

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Reads this account's entries. RLS scopes the result to the signed-in user,
 *  so no client-side uid filter is needed — or trusted. */
export async function fetchEntries(): Promise<GratitudeEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("entries")
    .select("uid, d, a, h, f, s")
    .order("d", { ascending: true });

  if (error) {
    console.error("Could not load entries:", error.message);
    return [];
  }
  return (data as EntryRow[]).map(toEntry);
}

export async function upsertEntries(
  entries: Array<GratitudeEntry | Omit<GratitudeEntry, "id" | "createdAt">>
): Promise<void> {
  if (entries.length === 0) return;

  const supabase = createClient();
  const uid = await getCurrentUserId();
  if (!uid) throw new Error("not signed in");

  const { error } = await supabase
    .from("entries")
    .upsert(entries.map((e) => toRow(e, uid)), { onConflict: "uid,d" });

  if (error) throw new Error(error.message);
}

export async function signOut(): Promise<void> {
  await createClient().auth.signOut();
}
