"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Star from "./Star";
import GlassJar from "./GlassJar";
import { useApp } from "@/lib/context";
import { playStarPop } from "@/lib/sound";

interface StarAnimationProps {
  dateStr: string;
  starImage: string;
  onComplete: () => void;
}

type Phase = "folding" | "star-arc" | "jar-visible" | "done";

export default function StarAnimation({ dateStr, starImage, onComplete }: StarAnimationProps) {
  const [phase, setPhase] = useState<Phase>("folding");
  const { entries, soundEnabled } = useApp();

  const advancePhase = useCallback(() => {
    setPhase((prev) => {
      switch (prev) {
        case "folding":
          return "star-arc";
        case "star-arc":
          return "jar-visible";
        case "jar-visible":
          return "done";
        default:
          return prev;
      }
    });
  }, []);

  useEffect(() => {
    if (phase === "folding") {
      const t = setTimeout(advancePhase, 800);
      return () => clearTimeout(t);
    }
    if (phase === "star-arc") {
      const t = setTimeout(() => {
        if (soundEnabled) playStarPop();
        advancePhase();
      }, 800);
      return () => clearTimeout(t);
    }
    if (phase === "jar-visible") {
      const t = setTimeout(() => {
        advancePhase();
        onComplete();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [phase, advancePhase, onComplete, soundEnabled]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Star arcing to jar */}
          {phase === "star-arc" && (
            <motion.div
              className="absolute"
              initial={{ top: "40%", left: "50%", x: "-50%", scale: 0.5 }}
              animate={{
                top: ["40%", "20%", "65%"],
                scale: [0.5, 1.2, 1],
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Star imageSrc={starImage} size={48} />
            </motion.div>
          )}

          {/* Jar sliding up */}
          {(phase === "jar-visible" || phase === "star-arc") && (
            <motion.div
              className="mb-8 pointer-events-none"
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <GlassJar entries={entries} size="small" />

              {/* Sparkle particles */}
              {phase === "jar-visible" && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-star-butter"
                      initial={{
                        top: "30%",
                        left: "50%",
                        opacity: 1,
                        scale: 1,
                      }}
                      animate={{
                        top: `${20 + Math.random() * 20}%`,
                        left: `${30 + Math.random() * 40}%`,
                        opacity: 0,
                        scale: 0,
                      }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.08,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
