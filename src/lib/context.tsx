"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { GratitudeEntry, getStoredEntries, saveEntry, getEntryForDate, getStreak } from "./mock-data";

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

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [userId] = useState<string | null>(null);
  const [isAuthenticated] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const canGoNext = weekOffset < 0;
  const goToPreviousWeek = useCallback(() => setWeekOffset((w) => w - 1), []);
  const goToNextWeek = useCallback(() => setWeekOffset((w) => Math.min(w + 1, 0)), []);
  const resetToCurrentWeek = useCallback(() => setWeekOffset(0), []);

  useEffect(() => {
    setEntries(getStoredEntries());
    setStreak(getStreak());
  }, []);

  const refreshEntries = useCallback(async () => {
    setEntries(getStoredEntries());
    setStreak(getStreak());
  }, []);

  const submitEntry = useCallback(
    (entry: Omit<GratitudeEntry, "id" | "createdAt">) => {
      saveEntry(entry);

      const optimistic: GratitudeEntry = {
        ...entry,
        id: Math.random().toString(36).slice(2),
        createdAt: entry.date,
      };
      setEntries((prev) => {
        const without = prev.filter((e) => e.date !== entry.date);
        return [...without, optimistic];
      });
      return optimistic;
    },
    [refreshEntries]
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
