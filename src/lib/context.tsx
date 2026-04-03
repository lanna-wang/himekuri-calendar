"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { GratitudeEntry, getStoredEntries, saveEntry, getEntryForDate, getStreak } from "./mock-data";
import {
  supabase,
  getUserEntries,
  submitEntryToDB,
  computeStreak,
  starIndexToPath,
  starPathToIndex,
  DBEntry,
} from "./supabase";

interface AppState {
  entries: GratitudeEntry[];
  streak: number;
  activeAnimation: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  weekOffset: number; // 0 = current week, -1 = last week, etc.
}

interface AppContextType extends AppState {
  submitEntry: (entry: Omit<GratitudeEntry, "id" | "createdAt">) => GratitudeEntry;
  hasEntryForDate: (dateStr: string) => boolean;
  setActiveAnimation: (dateKey: string | null) => void;
  refreshEntries: () => Promise<void>;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  resetToCurrentWeek: () => void;
  canGoNext: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

function dbToEntry(row: DBEntry): GratitudeEntry {
  return {
    id: `${row.uid}-${row.d}`,
    date: row.d,
    accomplished: row.a,
    happy: row.h,
    lookingForward: row.f,
    artworkId: "",
    starImage: starIndexToPath(row.s),
    createdAt: row.d,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const canGoNext = weekOffset < 0;
  const goToPreviousWeek = useCallback(() => setWeekOffset((w) => w - 1), []);
  const goToNextWeek = useCallback(() => setWeekOffset((w) => Math.min(w + 1, 0)), []);
  const resetToCurrentWeek = useCallback(() => setWeekOffset(0), []);

  useEffect(() => {
    async function init() {
      // Always load localStorage entries first (instant)
      const localEntries = getStoredEntries();
      setEntries(localEntries);
      setStreak(getStreak());

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUserId(session.user.id);
          setIsAuthenticated(true);

          // Load from Supabase
          const dbEntries = await getUserEntries(session.user.id);
          const dbMapped = dbEntries.map(dbToEntry);

          // Merge: Supabase entries take priority, localStorage fills gaps
          const dbDates = new Set(dbMapped.map((e) => e.date));
          const localOnly = localEntries.filter((e) => !dbDates.has(e.date));

          // Upload any localStorage-only entries to Supabase
          for (const entry of localOnly) {
            await submitEntryToDB({
              userId: session.user.id,
              date: entry.date,
              accomplished: entry.accomplished,
              happy: entry.happy,
              lookingForward: entry.lookingForward,
              starIndex: starPathToIndex(entry.starImage),
            });
          }

          const merged = [...dbMapped, ...localOnly];
          setEntries(merged);
          setStreak(await computeStreak(session.user.id));
          return;
        }
      } catch {
        // Supabase not available — localStorage already loaded above
      }
    }
    init();

    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
          setIsAuthenticated(true);
          const dbEntries = await getUserEntries(session.user.id);
          setEntries(dbEntries.map(dbToEntry));
          setStreak(await computeStreak(session.user.id));
        } else {
          setUserId(null);
          setIsAuthenticated(false);
          setEntries(getStoredEntries());
          setStreak(getStreak());
        }
      });
      subscription = data.subscription;
    } catch {
      // ignore
    }

    return () => subscription?.unsubscribe();
  }, []);

  const refreshEntries = useCallback(async () => {
    if (userId) {
      const dbEntries = await getUserEntries(userId);
      setEntries(dbEntries.map(dbToEntry));
      setStreak(await computeStreak(userId));
    } else {
      setEntries(getStoredEntries());
      setStreak(getStreak());
    }
  }, [userId]);

  const submitEntry = useCallback(
    (entry: Omit<GratitudeEntry, "id" | "createdAt">) => {
      // Always save to localStorage as backup
      saveEntry(entry);

      if (userId) {
        const starIndex = starPathToIndex(entry.starImage);
        submitEntryToDB({
          userId,
          date: entry.date,
          accomplished: entry.accomplished,
          happy: entry.happy,
          lookingForward: entry.lookingForward,
          starIndex,
        }).then(() => refreshEntries());
      }

      // Optimistic update
      const optimistic: GratitudeEntry = {
        ...entry,
        id: userId ? `${userId}-${entry.date}` : Math.random().toString(36).slice(2),
        createdAt: entry.date,
      };
      setEntries((prev) => {
        const without = prev.filter((e) => e.date !== entry.date);
        return [...without, optimistic];
      });
      return optimistic;
    },
    [userId, refreshEntries]
  );

  const hasEntryForDate = useCallback(
    (dateStr: string) => {
      return !!getEntryForDate(dateStr) || entries.some((e) => e.date === dateStr);
    },
    [entries]
  );

  return (
    <AppContext.Provider
      value={{
        entries,
        streak,
        activeAnimation,
        userId,
        isAuthenticated,
        weekOffset,
        submitEntry,
        hasEntryForDate,
        setActiveAnimation,
        refreshEntries,
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
