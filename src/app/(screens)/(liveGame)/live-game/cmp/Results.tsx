"use client";

/**
 * Results.tsx
 *
 * Post-game results screen.
 * Shows the leaderboard snapshot received via game:finished,
 * with a button to navigate home.
 *
 * No Redux — uses useLiveGameStore.
 */

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Grid } from "@radix-ui/themes";
import { Trophy, Medal, Home } from "lucide-react";
import { useLiveGameStore } from "@/lib/live-game-store";
import AdBanner from "@/app/components/advert/adBanner";
import CustomButton from "@/app/utils/CustomBtn";
import { readTotalTimeLeaderboard } from "@/app/utils/utils";

// ── Medal helper ──────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return <Trophy size={18} className="text-yellow-400 flex-shrink-0" />;
  if (rank === 2)
    return <Medal size={18} className="text-slate-300 flex-shrink-0" />;
  if (rank === 3)
    return <Medal size={18} className="text-amber-600 flex-shrink-0" />;
  return (
    <span className="w-5 text-center text-xs font-bold text-neutral-400">
      {rank}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function Results() {
  const router = useRouter();
  const leaderboard = useLiveGameStore((s) => s.leaderboard);
  const reset = useLiveGameStore((s) => s.reset);

  const handleGoHome = () => {
    reset();
    router.replace("/home");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-[100dvh] bg-primary-900 flex flex-col items-center justify-start pt-8 px-4 pb-10"
    >
      <div className="w-full max-w-lg mx-auto space-y-4">

        {/* ── Hero banner ─────────────────────────────────────────────────── */}
        <div className="bg-primary-50 text-center border-4 border-primary-500 rounded-2xl px-5 py-8 space-y-3">
          <p className="text-4xl">🎉</p>
          <p className="font-bold text-2xl text-primary-900">Nice game!</p>
          <p className="text-sm text-primary-700">
            Here&apos;s how the top players finished.
            <br />
            Full results will be posted shortly.
          </p>
        </div>

        {/* ── Leaderboard ──────────────────────────────────────────────────── */}
        {leaderboard.length > 0 ? (
          <div className="bg-primary-50 border-4 border-primary-500 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-primary-200 flex items-center gap-2">
              <Trophy size={16} className="text-primary-700" />
              <span className="font-bold text-sm text-primary-900">
                Top Players
              </span>
            </div>
            <div className="divide-y divide-primary-100">
              {leaderboard.slice(0, 10).map((entry) => (
                <div
                  key={entry.playerId}
                  className={[
                    "flex items-center gap-3 px-5 py-3 text-sm",
                    entry.rank <= 3 ? "bg-primary-100/60" : "",
                  ].join(" ")}
                >
                  <RankBadge rank={entry.rank} />
                  <span className="flex-1 font-medium text-primary-900 truncate">
                    {entry.username}
                  </span>
                  <div className="text-right">
                    <p className="font-bold text-primary-900">{entry.score}</p>
                    {entry.totalTimeMs != null && (
                      <p className="text-[10px] text-primary-500">
                        {readTotalTimeLeaderboard(entry.totalTimeMs)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-primary-50 border-4 border-primary-200 rounded-2xl px-5 py-6 text-center text-sm text-primary-600">
            Leaderboard data is being processed. Check back shortly.
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <Grid gap="2">
          <CustomButton onClick={handleGoHome} width="full" className="text-sm">
            <Home size={15} className="inline-block mr-1.5 -mt-0.5" />
            Go Home
          </CustomButton>
        </Grid>

        <AdBanner />
      </div>
    </motion.div>
  );
}

export default Results;
