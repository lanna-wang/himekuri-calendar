"use client";

import Navigation from "@/components/Navigation";
import JarView from "@/components/JarView";
import { AppProvider } from "@/lib/context";

export default function JarPage() {
  return (
    <AppProvider>
      <div className="min-h-[100dvh] flex flex-col">
        <Navigation />
        <main className="flex-1 flex flex-col items-center pt-4 pb-24">
          <h1 className="font-[family-name:var(--font-pangaia)] text-charcoal text-xl mb-4 select-none">
            gratitude jar
          </h1>
          <JarView />
        </main>
      </div>
    </AppProvider>
  );
}
