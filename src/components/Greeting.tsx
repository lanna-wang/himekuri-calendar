"use client";

import { useEffect, useState } from "react";
import { getGreeting } from "@/lib/utils";

export default function Greeting() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  if (!greeting) return null;

  return (
    <p className="text-center font-[family-name:var(--font-pangaia)] font-medium text-charcoal text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-8 sm:mb-12 select-none">
      {greeting}
    </p>
  );
}
