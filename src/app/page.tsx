"use client";

import Image from "next/image";
import Greeting from "@/components/Greeting";
import CardTray from "@/components/CardTray";
import Navigation from "@/components/Navigation";
import CherryBlossomTree from "@/components/CherryBlossomTree";
import { AppProvider } from "@/lib/context";

export default function Home() {
  return (
    <AppProvider>
      <div className="min-h-[100dvh] flex flex-col relative overflow-hidden">
        <Navigation />
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-10 lg:px-16 py-6 pb-24 sm:pb-24 relative z-10">
          <Greeting />
          <div className="w-full">
            <CardTray />
          </div>
        </main>

        {/* Decorative illustrations */}
        <div className="pointer-events-none select-none">
          {/* Ducks — bottom left */}
          <div className="fixed bottom-0 left-0 z-0">
            <Image
              src="/images/ducks.png"
              alt=""
              width={280}
              height={280}
              className="w-[180px] sm:w-[240px] lg:w-[280px] h-auto translate-y-4"
              priority={false}
            />
          </div>

          {/* Cherry blossom tree — bottom right (with hover petal effect) */}
          <CherryBlossomTree />
        </div>
      </div>
    </AppProvider>
  );
}
