"use client";

/**
 * GameCompleted.tsx
 *
 * Shown immediately after game:finished.
 * Waits 60 s (server tallies scores), then transitions to 'result'.
 *
 * No Redux — uses useLiveGameStore.
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLiveGameStore } from "@/lib/live-game-store";

function GameCompleted() {
  const setPhase = useLiveGameStore((s) => s.setPhase);
  const [secondsLeft, setSecondsLeft] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setPhase("result");
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setPhase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100dvh] bg-primary-900 flex flex-col items-center justify-center px-4"
    >
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-primary-50 text-center border-4 border-primary-500 rounded-2xl px-6 py-10 space-y-5">
          {/* Spinner */}
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary-900 border-t-transparent" />
          </div>

          <div className="space-y-2">
            <p className="text-xl font-bold text-primary-900">
              Collating results…
            </p>
            <p className="text-sm text-primary-700 italic">
              Please don&apos;t leave this page
            </p>
          </div>

          {/* Countdown pill */}
          <div className="inline-flex items-center gap-2 bg-primary-100 border border-primary-300 rounded-full px-4 py-1.5 text-sm text-primary-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            Results in {secondsLeft}s
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default GameCompleted;
