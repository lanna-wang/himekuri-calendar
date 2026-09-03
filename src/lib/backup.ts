import {
  GratitudeEntry,
  getStoredEntries,
  saveAllEntries,
} from "./mock-data";

const BACKUP_FORMAT = "himekuri-backup";
const BACKUP_VERSION = 1;
const LAST_EXPORT_KEY = "himekuri_last_export";

/** Records what the most recent backup contained, so we can tell when the jar
 *  has moved on since. Kept as a subscribable store so components can read it
 *  without a setState-in-effect round trip. */
const listeners = new Set<() => void>();

function notify() {
  for (const l of listeners) l();
}

export function subscribeBackupState(cb: () => void): () => void {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Raw snapshot for useSyncExternalStore — a primitive, so identity is stable. */
export function getBackupSnapshot(): string | null {
  try {
    return localStorage.getItem(LAST_EXPORT_KEY);
  } catch {
    return null;
  }
}

export function getServerBackupSnapshot(): string | null {
  return null;
}

/** How many entries the last backup captured. 0 if never backed up. */
export function backedUpCount(snapshot: string | null): number {
  if (!snapshot) return 0;
  try {
    const parsed = JSON.parse(snapshot) as { count?: unknown };
    return typeof parsed.count === "number" ? parsed.count : 0;
  } catch {
    return 0;
  }
}

interface BackupFile {
  format: string;
  version: number;
  exportedAt: string;
  entries: GratitudeEntry[];
}

export interface ImportResult {
  added: number;
  updated: number;
  unchanged: number;
}

function isEntry(value: unknown): value is GratitudeEntry {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(e.date) &&
    typeof e.accomplished === "string" &&
    typeof e.happy === "string" &&
    typeof e.lookingForward === "string"
  );
}

/** Builds the backup payload for the entries currently in this browser. */
export function buildBackup(): BackupFile {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    entries: getStoredEntries(),
  };
}

/** Prompts the browser to download the jar as a .json file. */
export function downloadBackup(): number {
  const backup = buildBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `himekuri-${backup.exportedAt.slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  try {
    localStorage.setItem(
      LAST_EXPORT_KEY,
      JSON.stringify({ at: backup.exportedAt, count: backup.entries.length })
    );
    notify();
  } catch {
    // Storage full or blocked — the file still downloaded, so don't fail.
  }
  return backup.entries.length;
}

/**
 * Merges a backup file into the existing jar. Entries are matched by date;
 * where both sides have the same day, the one written most recently wins, so
 * merging two devices doesn't clobber the newer note.
 */
export function restoreBackup(raw: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("That file isn't valid JSON.");
  }

  const file = parsed as Partial<BackupFile>;
  if (file?.format !== BACKUP_FORMAT || !Array.isArray(file.entries)) {
    throw new Error("That doesn't look like a himekuri backup.");
  }

  const incoming = file.entries.filter(isEntry);
  if (incoming.length === 0) {
    throw new Error("No readable entries in that file.");
  }

  const byDate = new Map<string, GratitudeEntry>();
  for (const entry of getStoredEntries()) byDate.set(entry.date, entry);

  let added = 0;
  let updated = 0;
  let unchanged = 0;

  for (const entry of incoming) {
    const existing = byDate.get(entry.date);
    if (!existing) {
      byDate.set(entry.date, entry);
      added++;
    } else if ((entry.createdAt ?? "") > (existing.createdAt ?? "")) {
      byDate.set(entry.date, entry);
      updated++;
    } else {
      unchanged++;
    }
  }

  saveAllEntries([...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)));
  notify();
  return { added, updated, unchanged };
}

/**
 * Asks the browser to exempt this origin from storage eviction. Safari clears
 * script-writable storage after 7 days without a visit unless persistence is
 * granted, which for a daily-ritual app is worth requesting.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
