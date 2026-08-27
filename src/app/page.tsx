"use client";

import Greeting from "@/components/Greeting";
import CardTray from "@/components/CardTray";
import Navigation from "@/components/Navigation";
import CherryBlossomTree from "@/components/CherryBlossomTree";
import DuckMessage from "@/components/DuckMessage";
import { AppProvider } from "@/lib/context";

export default function Home() {
  return (
    <AppProvider>
      <div className="min-h-[100dvh] flex flex-col relative overflow-hidden">
        <Navigation />
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-10 lg:px-16 py-6 pb-24 sm:pb-24 relative z-10">
          <h1 className="sr-only">himekuri: daily gratitude calendar</h1>
          <Greeting />
          <div className="w-full">
            <CardTray />
          </div>
        </main>

        {/* Decorative illustrations */}
        <DuckMessage />
        <CherryBlossomTree />
      </div>
    </AppProvider>
  );
}
