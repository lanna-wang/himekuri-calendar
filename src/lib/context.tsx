"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { GratitudeEntry, getStoredEntries, saveEntry, getEntryForDate, getStreak } from "./mock-data";

interface AppState {
  entries: GratitudeEntry[];
  streak: number;
  activeAnimation: string | null; // date key of card being animated
  soundEnabled: boolean;
}

interface AppContextType extends AppState {
  submitEntry: (entry: Omit<GratitudeEntry, "id" | "createdAt">) => GratitudeEntry;
  hasEntryForDate: (dateStr: string) => boolean;
  setActiveAnimation: (dateKey: string | null) => void;
  toggleSound: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setEntries(getStoredEntries());
    setStreak(getStreak());
  }, []);

  const submitEntry = useCallback(
    (entry: Omit<GratitudeEntry, "id" | "createdAt">) => {
      const newEntry = saveEntry(entry);
      setEntries(getStoredEntries());
      setStreak(getStreak());
      return newEntry;
    },
    []
  );

  const hasEntryForDate = useCallback(
    (dateStr: string) => {
      return !!getEntryForDate(dateStr) || entries.some((e) => e.date === dateStr);
    },
    [entries]
  );

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  return (
    <AppContext.Provider
      value={{
        entries,
        streak,
        activeAnimation,
        soundEnabled,
        submitEntry,
        hasEntryForDate,
        setActiveAnimation,
        toggleSound,
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
