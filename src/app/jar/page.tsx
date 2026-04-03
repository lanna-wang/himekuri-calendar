"use client";

import Navigation from "@/components/Navigation";
import JarView from "@/components/JarView";
import SignOutButton from "@/components/SignOutButton";
import { AppProvider } from "@/lib/context";

export default function JarPage() {
  return (
    <AppProvider>
      <div className="min-h-[100dvh] flex flex-col">
        <Navigation />
        <main className="flex-1 flex flex-col items-center pt-4 pb-24">
          <div className="w-full relative px-6 mb-4">
            <h1 className="font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-3xl sm:text-4xl text-center select-none">
              gratitude jar
            </h1>
            <div className="absolute top-1/2 -translate-y-1/2 right-6">
              <SignOutButton />
            </div>
          </div>
          <JarView />
        </main>
      </div>
    </AppProvider>
  );
}
