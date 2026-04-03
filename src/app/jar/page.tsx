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
          <div className="w-full flex justify-between items-center px-6 mb-4">
            <div />
            <h1 className="font-[family-name:var(--font-pangaia)] text-charcoal text-xl select-none">
              gratitude jar
            </h1>
            <SignOutButton />
          </div>
          <JarView />
        </main>
      </div>
    </AppProvider>
  );
}
