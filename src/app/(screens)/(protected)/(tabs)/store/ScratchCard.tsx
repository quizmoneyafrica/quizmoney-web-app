"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Sparkles, RefreshCw, TrendingUp, Package, Gift, Frown } from "lucide-react";
import { usePurchaseScratchCard } from "@/lib/queries";
import { ScratchCardResult } from "@/app/api/storeApi";
import CustomButton from "@/app/utils/CustomBtn";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/utils";

// ─── Prize config ─────────────────────────────────────────────────────────────

const PRIZE_DISPLAY: Record<
  string,
  {
    icon: React.ReactNode;
    label: string;
    color: string;
    bg: string;
    border: string;
    gradient: string;
  }
> = {
  ngn: {
    icon: <TrendingUp size={40} />,
    label: "Cash Won!",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    gradient: "from-emerald-400 to-green-500",
  },
  qmcoin: {
    icon: <Sparkles size={40} />,
    label: "QMCoins Won!",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    gradient: "from-amber-400 to-yellow-500",
  },
  item: {
    icon: <Package size={40} />,
    label: "Item Won!",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    gradient: "from-violet-400 to-purple-500",
  },
  free_entry: {
    icon: <Gift size={40} />,
    label: "Free Game Entry!",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    gradient: "from-sky-400 to-blue-500",
  },
  nothing: {
    icon: <Frown size={40} />,
    label: "Better Luck Next Time",
    color: "text-neutral-600",
    bg: "bg-neutral-50",
    border: "border-neutral-200",
    gradient: "from-neutral-400 to-neutral-500",
  },
};

const POSSIBLE_PRIZES = [
  { icon: <TrendingUp size={16} />, label: "Cash Prize", color: "text-emerald-600" },
  { icon: <Sparkles size={16} />, label: "QMCoins", color: "text-amber-600" },
  { icon: <Package size={16} />, label: "Free Erasers", color: "text-violet-600" },
  { icon: <Gift size={16} />, label: "Free Game Entry", color: "text-sky-600" },
];

// ─── Prize reveal value label ─────────────────────────────────────────────────

function prizeValueLabel(prize: ScratchCardResult["prize"]): string | null {
  if (prize.type === "ngn" && prize.value > 0) {
    return `+${formatNaira(prize.value)}`;
  }
  if (prize.type === "qmcoin" && prize.value > 0) {
    return `+${prize.value} QMCoins`;
  }
  if (prize.type === "item") return "+1 Eraser";
  if (prize.type === "free_entry") return "1 Free Entry";
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ScratchCard() {
  const [result, setResult] = useState<ScratchCardResult | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const { mutate: purchaseScratchCard, isPending } = usePurchaseScratchCard();
  const router = useRouter();

  const handleBuy = () => {
    setIsRevealing(true);
    purchaseScratchCard(undefined, {
      onSuccess: (res: any) => {
        const data: ScratchCardResult = res?.data?.data;
        // Short delay so the scratch animation feels intentional
        setTimeout(() => {
          setResult(data);
          setIsRevealing(false);
        }, 800);
      },
      onError: () => {
        setIsRevealing(false);
      },
    });
  };

  const handlePlayAgain = () => {
    setResult(null);
  };

  const prizeConfig = result
    ? PRIZE_DISPLAY[result.prize.type] ?? PRIZE_DISPLAY.nothing
    : null;
  const valueLabel = result ? prizeValueLabel(result.prize) : null;

  return (
    <div className="flex flex-col items-center gap-6 pb-8">
      <AnimatePresence mode="wait">
        {/* ── Scratch animation (loading) ── */}
        {isRevealing && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm"
          >
            <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 flex flex-col items-center gap-5 overflow-hidden min-h-[280px] justify-center shadow-lg">
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              >
                <Ticket size={52} className="text-white" />
              </motion.div>
              <p className="text-white text-lg font-bold">Scratching…</p>
            </div>
          </motion.div>
        )}

        {/* ── Prize reveal ── */}
        {result && !isRevealing && prizeConfig && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full max-w-sm"
          >
            <div
              className={`${prizeConfig.bg} ${prizeConfig.border} border-2 rounded-3xl p-7 flex flex-col items-center gap-4 text-center`}
            >
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${prizeConfig.gradient} flex items-center justify-center text-white shadow-md`}
              >
                {prizeConfig.icon}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-1"
              >
                <p className={`text-2xl font-bold ${prizeConfig.color}`}>
                  {prizeConfig.label}
                </p>
                {valueLabel && (
                  <p className={`text-3xl font-black ${prizeConfig.color}`}>
                    {valueLabel}
                  </p>
                )}
                <p className="text-sm text-neutral-500 mt-2">
                  {result.prize.label}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full border-t border-neutral-200 pt-3"
              >
                <p className="text-xs text-neutral-400">
                  Cost deducted: {result.cost_formatted}
                </p>
              </motion.div>
            </div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex gap-3 mt-4"
            >
              <button
                onClick={() => router.push("/wallet")}
                className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                View Wallet
              </button>
              <CustomButton onClick={handlePlayAgain} className="flex-1 justify-center">
                <RefreshCw size={14} className="mr-1.5" />
                Play Again
              </CustomButton>
            </motion.div>
          </motion.div>
        )}

        {/* ── Teaser / buy state ── */}
        {!result && !isRevealing && (
          <motion.div
            key="teaser"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-sm space-y-4"
          >
            {/* The scratch card visual */}
            <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-7 overflow-hidden shadow-md">
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                {Array(12).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-10 h-10 rounded-full border-2 border-white"
                    style={{
                      top: `${(i * 37) % 100}%`,
                      left: `${(i * 53) % 100}%`,
                      transform: "translate(-50%,-50%)",
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Ticket size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-2xl font-black">Scratch Card</p>
                  <p className="text-primary-200 text-sm mt-1">
                    Buy and scratch to reveal your prize
                  </p>
                </div>

                {/* Scratch-off strip */}
                <div className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-5 flex items-center justify-center gap-2">
                  <Sparkles size={16} className="text-amber-300" />
                  <p className="text-white font-semibold text-sm">
                    Instant prizes — revealed immediately
                  </p>
                </div>
              </div>
            </div>

            {/* Prize pool display */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wide mb-3">
                Possible prizes
              </p>
              <div className="grid grid-cols-2 gap-2">
                {POSSIBLE_PRIZES.map((prize) => (
                  <div
                    key={prize.label}
                    className="flex items-center gap-2 bg-neutral-50 rounded-xl px-3 py-2.5"
                  >
                    <span className={prize.color}>{prize.icon}</span>
                    <span className="text-xs font-semibold text-neutral-700">
                      {prize.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Odds note */}
            <p className="text-center text-xs text-neutral-400 px-4">
              Each scratch is unique. Prizes are credited to your wallet instantly.
            </p>

            {/* Buy button */}
            <CustomButton
              onClick={handleBuy}
              loader={isPending}
              disabled={isPending}
              className="w-full justify-center !py-3.5 text-base"
            >
              <Ticket size={18} className="mr-2" />
              Buy &amp; Scratch
            </CustomButton>

            <p className="text-center text-xs text-neutral-400">
              Insufficient balance?{" "}
              <button
                onClick={() => router.push("/wallet")}
                className="text-primary-600 font-semibold underline underline-offset-2"
              >
                Fund your wallet
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
