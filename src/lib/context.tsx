"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { GratitudeEntry, getStoredEntries } from "./mock-data";
import { fetchEntries, getCurrentUserId, upsertEntries } from "./entries";

const MIGRATED_KEY = "himekuri_migrated_to_account";

interface AppState {
  entries: GratitudeEntry[];
  streak: number;
  activeAnimation: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  weekOffset: number; // 0 = current week, -1 = last week, etc.
}

interface AppContextType extends AppState {
  submitEntry: (entry: Omit<GratitudeEntry, "id" | "createdAt">) => GratitudeEntry;
  hasEntryForDate: (dateStr: string) => boolean;
  setActiveAnimation: (dateKey: string | null) => void;
  refreshEntries: () => Promise<void>;
  importEntries: (incoming: GratitudeEntry[]) => Promise<number>;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  resetToCurrentWeek: () => void;
  canGoNext: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

/** Computes the streak from whatever entries we have in hand, so it doesn't
 *  need a second round trip. */
function computeStreak(entries: GratitudeEntry[]): number {
  if (entries.length === 0) return 0;
  const dates = new Set(entries.map((e) => e.date));

  const key = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const cursor = new Date();
  if (!dates.has(key(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    if (!dates.has(key(cursor))) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * Pushes any entries still sitting in this browser's localStorage up to the
 * account, once. Runs before the first fetch so nothing written offline (or
 * before sign-in existed) is stranded on one device.
 */
async function migrateLocalEntries(): Promise<void> {
  if (localStorage.getItem(MIGRATED_KEY)) return;
  try {
    const local = getStoredEntries();
    if (local.length > 0) await upsertEntries(local);
    localStorage.setItem(MIGRATED_KEY, new Date().toISOString());
  } catch (e) {
    // Leave the flag unset so it retries next load rather than losing entries.
    console.error("Could not migrate local entries:", e);
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  const streak = computeStreak(entries);
  const canGoNext = weekOffset < 0;
  const goToPreviousWeek = useCallback(() => setWeekOffset((w) => w - 1), []);
  const goToNextWeek = useCallback(
    () => setWeekOffset((w) => Math.min(w + 1, 0)),
    []
  );
  const resetToCurrentWeek = useCallback(() => setWeekOffset(0), []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const uid = await getCurrentUserId();
      if (cancelled) return;
      setUserId(uid);

      if (uid) {
        await migrateLocalEntries();
        const rows = await fetchEntries();
        if (!cancelled) setEntries(rows);
      }
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshEntries = useCallback(async () => {
    setEntries(await fetchEntries());
  }, []);

  const submitEntry = useCallback(
    (entry: Omit<GratitudeEntry, "id" | "createdAt">) => {
      const optimistic: GratitudeEntry = {
        ...entry,
        id: `local-${entry.date}`,
        createdAt: new Date().toISOString(),
      };

      // Show it straight away, then reconcile with the server.
      setEntries((prev) => [
        ...prev.filter((e) => e.date !== entry.date),
        optimistic,
      ]);

      upsertEntries([entry])
        .then(() => refreshEntries())
        .catch((e) => console.error("Could not save entry:", e));

      return optimistic;
    },
    [refreshEntries]
  );

  /** Used by the restore button: merges a backup file into the account. */
  const importEntries = useCallback(
    async (incoming: GratitudeEntry[]) => {
      await upsertEntries(incoming);
      await refreshEntries();
      return incoming.length;
    },
    [refreshEntries]
  );

  const hasEntryForDate = useCallback(
    (dateStr: string) => entries.some((e) => e.date === dateStr),
    [entries]
  );

  return (
    <AppContext.Provider
      value={{
        entries,
        streak,
        activeAnimation,
        userId,
        isAuthenticated: !!userId,
        loading,
        weekOffset,
        submitEntry,
        hasEntryForDate,
        setActiveAnimation,
        refreshEntries,
        importEntries,
        goToPreviousWeek,
        goToNextWeek,
        resetToCurrentWeek,
        canGoNext,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
