"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useApp } from "@/lib/context";
import {
  backedUpCount,
  downloadBackup,
  getBackupSnapshot,
  getServerBackupSnapshot,
  restoreBackup,
  subscribeBackupState,
  type ImportResult,
} from "@/lib/backup";

const REMIND_AFTER_ENTRIES = 3;

function summarise(r: ImportResult): string {
  const parts: string[] = [];
  if (r.added) parts.push(`${r.added} restored`);
  if (r.updated) parts.push(`${r.updated} updated`);
  if (r.unchanged) parts.push(`${r.unchanged} already here`);
  return parts.join(" · ");
}

export default function BackupControls() {
  const { entries, refreshEntries } = useApp();
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const snapshot = useSyncExternalStore(
    subscribeBackupState,
    getBackupSnapshot,
    getServerBackupSnapshot
  );

  const unsavedCount = Math.max(0, entries.length - backedUpCount(snapshot));
  const remind = entries.length >= REMIND_AFTER_ENTRIES && unsavedCount > 0;

  const handleExport = () => {
    setError(null);
    const count = downloadBackup();
    setMessage(`saved ${count} ${count === 1 ? "note" : "notes"} to your device`);
  };

  const handleFile = async (file: File) => {
    setMessage(null);
    setError(null);
    try {
      const result = restoreBackup(await file.text());
      await refreshEntries();
      setMessage(summarise(result));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't read that file.");
    }
  };

  return (
    <div className="w-full max-w-md mb-6 flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={handleExport}
          disabled={entries.length === 0}
          className="px-4 py-2 rounded-full bg-cream border border-cream-dark text-muted hover:text-charcoal hover:bg-cream-dark disabled:opacity-40 disabled:hover:bg-cream disabled:hover:text-muted font-[family-name:var(--font-pangaia)] text-xs tracking-wider lowercase touch-target transition-colors"
        >
          back up my jar
        </button>
        <button
          onClick={() => fileInput.current?.click()}
          className="px-4 py-2 rounded-full bg-cream border border-cream-dark text-muted hover:text-charcoal hover:bg-cream-dark font-[family-name:var(--font-pangaia)] text-xs tracking-wider lowercase touch-target transition-colors"
        >
          restore
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {(message || error) && (
        <p
          className={`font-[family-name:var(--font-pangaia)] italic text-xs text-center ${
            error ? "text-rose" : "text-muted"
          }`}
        >
          {error ?? message}
        </p>
      )}

      {!message && !error && remind && (
        <p className="font-[family-name:var(--font-pangaia)] italic text-xs text-muted/70 text-center max-w-xs">
          {unsavedCount} {unsavedCount === 1 ? "note isn't" : "notes aren't"} in
          a backup yet — {unsavedCount === 1 ? "it lives" : "they live"} only on
          this device
        </p>
      )}
    </div>
  );
}
