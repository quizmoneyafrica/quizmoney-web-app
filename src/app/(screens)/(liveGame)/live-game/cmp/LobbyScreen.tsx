"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * LobbyScreen.tsx
 *
 * Owns the full pre-game experience:
 *   idle/joining → lobby → locked → countdown → (→ playing via page.tsx)
 *
 * Performance rules (low-end device safe):
 *   - All animations use transform + opacity only (GPU-composited, no layout)
 *   - Confetti is pure CSS @keyframes, 15 particles, will-change: transform
 *   - Countdown uses CSS keyframes triggered by React key changes (no JS per frame)
 *   - framer-motion used only for discrete phase-level transitions (not per-tick)
 *   - prefers-reduced-motion disables decorative animations
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Users,
  Trophy,
  Lock,
  Eraser,
  AlertCircle,
  Home,
  Zap,
  Shield,
} from "lucide-react";
import { differenceInSeconds, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useSocket } from "@/lib/socket";
import { useLiveGameStore } from "@/lib/live-game-store";
import { useUpcomingGame } from "@/lib/queries";
import { useEraserCount } from "@/app/hooks/useEraserCount";
import { formatDate, formatNaira } from "@/lib/utils";
import { toastPosition } from "@/app/utils/utils";
import type { UpcomingGame } from "@/app/api/game";

// ─── Prize pool helper (mirrors GameCard) ─────────────────────────────────────

function estimatePrizePool(game: UpcomingGame, totalPlayers: number): number {
  // Use live player count for a real-time estimate
  const fromPlayers = Math.floor(
    game.entry_fee_kobo * totalPlayers * (game.prize_percent / 100),
  );
  const fromCollected = Math.floor(
    game.total_entry_collected_kobo * (game.prize_percent / 100),
  );
  // Take the larger of the two estimates (collected is DB-lagged; player count is live)
  const raw = Math.max(fromPlayers, fromCollected);
  if (game.is_sponsored && game.sponsor_prize_boost_kobo) {
    return game.sponsor_prize_boost_kobo;
  }
  return game.prize_pool_max_kobo
    ? Math.min(raw, game.prize_pool_max_kobo)
    : raw;
}

// ─── Countdown timer label ────────────────────────────────────────────────────

function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── CSS confetti ─────────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#E8DAEF",
];

function ConfettiBurst() {
  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        left: `${(i * 6.8 + 1.5) % 100}%`,
        delay: `${((i * 73) % 100) / 200}s`,
        duration: `${1.1 + (i % 5) * 0.16}s`,
        size: 7 + (i % 4) * 2,
        borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0",
      })),
    [],
  );

  return (
    <>
      <style>{`
        @keyframes qm-confetti-fall {
          0%   { transform: translateY(-24px) rotate(0deg) scale(1);   opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(600deg) scale(0.6); opacity: 0; }
        }
      `}</style>
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 50 }}
        aria-hidden="true"
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              top: 0,
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.borderRadius,
              willChange: "transform",
              animation: `qm-confetti-fall ${p.duration} ${p.delay} ease-in forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
}

// ─── Animated player counter ──────────────────────────────────────────────────

function PlayerCounter({ count }: { count: number }) {
  const [bump, setBump] = useState(false);
  const prev = useRef(count);

  useEffect(() => {
    if (count !== prev.current) {
      prev.current = count;
      setBump(true);
      const t = setTimeout(() => setBump(false), 450);
      return () => clearTimeout(t);
    }
  }, [count]);

  return (
    <span
      className="text-4xl font-black tabular-nums"
      style={{
        display: "inline-block",
        transition: "transform 0.25s ease, color 0.25s ease",
        transform: bump ? "scale(1.35)" : "scale(1)",
        color: bump ? "#34d399" : "#ffffff",
        willChange: "transform",
      }}
    >
      {count.toLocaleString()}
    </span>
  );
}

// ─── Eraser Toggle ─────────────────────────────────────────────────────────────

interface EraserToggleProps {
  hasEraser: boolean;
  eraserOpted: boolean;
  eraserCount: number;
  isLocked: boolean;
  onToggle: () => void;
  isToggling: boolean;
}

function EraserToggle({
  hasEraser,
  eraserOpted,
  eraserCount,
  isLocked,
  onToggle,
  isToggling,
}: EraserToggleProps) {
  const disabled = !hasEraser || isLocked || isToggling;

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={eraserOpted}
      className={[
        "w-full rounded-2xl p-4 text-left transition-all duration-300 active:scale-[0.97]",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        eraserOpted && hasEraser
          ? "bg-emerald-500/20 border-2 border-emerald-400/60 shadow-[0_0_18px_rgba(52,211,153,0.25)]"
          : "bg-white/8 border-2 border-white/15",
      ].join(" ")}
      style={{ willChange: "transform" }}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: icon + label */}
        <div className="flex items-center gap-3">
          <div
            className={[
              "w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300",
              eraserOpted && hasEraser ? "bg-emerald-400/30" : "bg-white/10",
            ].join(" ")}
          >
            <Eraser
              size={20}
              className={
                eraserOpted && hasEraser ? "text-emerald-300" : "text-white/60"
              }
            />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              Use Eraser in Game
            </p>
            <p className="text-white/50 text-xs mt-0.5">
              {!hasEraser
                ? "No erasers owned — visit the store"
                : isLocked
                  ? "Game locked — preference saved"
                  : eraserOpted
                    ? `Skip 1 wrong answer — ${eraserCount} owned`
                    : "Tap to enable for this game"}
            </p>
          </div>
        </div>

        {/* Right: pill toggle */}
        <div
          className={[
            "relative h-7 w-13 rounded-full transition-colors duration-300 flex-shrink-0",
            eraserOpted && hasEraser ? "bg-emerald-400" : "bg-white/20",
          ].join(" ")}
          style={{ width: 52 }}
        >
          <div
            className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300"
            style={{
              left: eraserOpted && hasEraser ? 28 : 4,
              willChange: "left",
            }}
          />
        </div>
      </div>
    </button>
  );
}

// ─── Info Card ────────────────────────────────────────────────────────────────

function InfoCard({
  icon,
  label,
  children,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl p-4 space-y-1 transition-all duration-300",
        highlight
          ? "bg-white/15 border border-white/30"
          : "bg-white/8 border border-white/12",
      ].join(" ")}
    >
      <div className="flex items-center gap-1.5 text-white/50 text-xs font-semibold uppercase tracking-wide mb-2">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── Pulsing dot ──────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface LobbyScreenProps {
  gameId: string;
}

export default function LobbyScreen({ gameId: _gameId }: LobbyScreenProps) {
  const socket = useSocket();
  const router = useRouter();

  // Zustand
  const phase = useLiveGameStore((s) => s.phase);
  const hasEraser = useLiveGameStore((s) => s.hasEraser);
  const eraserOpted = useLiveGameStore((s) => s.eraserOpted);
  const totalPlayers = useLiveGameStore((s) => s.totalPlayers);
  const errorMessage = useLiveGameStore((s) => s.errorMessage);
  const setJoinResult = useLiveGameStore((s) => s.setJoinResult);
  const setError = useLiveGameStore((s) => s.setError);
  const setEraserOpted = useLiveGameStore((s) => s.setEraserOpted);
  const setPhase = useLiveGameStore((s) => s.setPhase);

  // Game metadata (for prize pool + start time)
  const { data: game } = useUpcomingGame();
  const gameId = game?.id === _gameId ? _gameId : null; // Ensure gameId is only used if it matches the fetched game
  // Eraser inventory count (syncs to Zustand via the hook)
  const { eraserCount } = useEraserCount();

  // Local state
  const [isToggling, setIsToggling] = useState(false);
  const [secsToStart, setSecsToStart] = useState<number>(0);
  const [countdown, setCountdown] = useState(10);
  const hasJoined = useRef(false);

  // ── Reduced motion detection ─────────────────────────────────────────────
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // ── Join game on mount (once) ─────────────────────────────────────────────
  // useEffect(() => {
  //   if (hasJoined.current || !socket) return;
  //   hasJoined.current = true;

  //   useLiveGameStore.getState().setPhase("joining");

  //   socket.emit("game:join", {}, (res: any) => {
  //     if (res?.success) {
  //       setJoinResult({
  //         gameId: res.gameId ?? "",
  //         hasEraser: res.hasEraser ?? false,
  //         eraserOpted: res.eraserOpted ?? false,
  //       });
  //     } else {
  //       const msg: string = res?.message ?? "Failed to join game";
  //       toast.error(msg, { position: toastPosition });
  //       setError(msg);
  //     }
  //   });
  // }, [socket, setJoinResult, setError]);
  useEffect(() => {
    if (hasJoined.current || !socket || !gameId) return;

    hasJoined.current = true;
    console.log(`🎮 Joining game: ${gameId}`);

    setPhase("joining");

    socket.emit("game:join", { gameId }, (res: any) => {
      console.log("📥 game:join response:", res);

      if (res?.success) {
        setJoinResult({
          gameId: res.gameId || gameId,
          hasEraser: !!res.hasEraser,
          eraserOpted: !!res.eraserOpted,
        });

        // Immediate reconnect to get current state
        setTimeout(() => {
          socket.emit("game:reconnect", { gameId });
        }, 400);
      } else {
        const msg = res?.message || "Failed to join game";
        console.error("Join failed:", msg);
        toast.error(msg, { position: toastPosition });
        setError(msg);

        if (
          msg.toLowerCase().includes("started") ||
          msg.toLowerCase().includes("active")
        ) {
          setPhase("playing"); // or "countdown"
        }
      }
    });
  }, [socket, gameId, setJoinResult, setError, setPhase]);

  // ── Countdown to scheduled start time ────────────────────────────────────
  useEffect(() => {
    if (phase !== "lobby" || !game?.scheduled_start_time) return;

    const tick = () => {
      const diff = differenceInSeconds(
        parseISO(game.scheduled_start_time + "Z"),
        new Date(),
      );
      const remaining = Math.max(0, diff);
      setSecsToStart(remaining);

      // Scheduled start time reached — transition to playing immediately
      // without waiting for game:started socket event
      if (remaining === 0) {
        setPhase("playing");
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [phase, game?.scheduled_start_time, setPhase]);

  // ── 10→0 countdown when game:started received ────────────────────────────
  useEffect(() => {
    if (phase !== "countdown") return;

    setCountdown(10);
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          // Small delay so "0" is visible before screen swap
          setTimeout(() => setPhase("playing"), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [phase, setPhase]);

  // ── Eraser toggle ─────────────────────────────────────────────────────────
  const handleEraserToggle = useCallback(() => {
    if (!socket || !hasEraser || phase !== "lobby" || isToggling) return;
    const newOpted = !eraserOpted;
    setIsToggling(true);

    socket.emit("game:eraser:toggle", { opted: newOpted }, (res: any) => {
      setIsToggling(false);
      if (res?.success) {
        setEraserOpted(newOpted);
      } else {
        toast.error(res?.message ?? "Could not update eraser preference", {
          position: toastPosition,
        });
      }
    });
  }, [socket, hasEraser, phase, isToggling, eraserOpted, setEraserOpted]);

  const prizePool = game ? estimatePrizePool(game, totalPlayers) : 0;
  const isLocked = phase === "locked" || phase === "countdown";

  // ══════════════════════════════════════════════════════════════════════════
  // ── Phase: countdown (10→0 full screen) ───────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "countdown") {
    return (
      <>
        <style>{`
          @keyframes qm-num-in {
            0%   { transform: scale(0.2) translateY(40px); opacity: 0; }
            55%  { transform: scale(1.18) translateY(-4px); opacity: 1; }
            75%  { transform: scale(0.93); }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          @keyframes qm-pulse-ring {
            0%   { transform: scale(0.8); opacity: 0.6; }
            100% { transform: scale(2.4); opacity: 0; }
          }
        `}</style>
        <div
          className="fixed inset-0 bg-primary-900 flex flex-col items-center justify-center overflow-hidden"
          style={{ zIndex: 40 }}
        >
          {/* Radial glow — static, no animation cost */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(59,130,246,0.15) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <p className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-8">
            Game starts in
          </p>

          {/* Animated number */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring behind number — only if motion allowed */}
            {!prefersReducedMotion && countdown > 0 && (
              <div
                key={`ring-${countdown}`}
                className="absolute rounded-full border-2 border-primary-400/40"
                style={{
                  width: 180,
                  height: 180,
                  animation: "qm-pulse-ring 0.9s ease-out forwards",
                  willChange: "transform",
                }}
                aria-hidden="true"
              />
            )}
            <div
              key={countdown}
              className={countdown === 0 ? "text-emerald-400" : "text-white"}
              style={{
                fontSize: "clamp(8rem, 28vw, 14rem)",
                fontWeight: 900,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                animation: prefersReducedMotion
                  ? "none"
                  : "qm-num-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
                willChange: "transform",
              }}
            >
              {countdown}
            </div>
          </div>

          <p className="text-white/40 text-xs mt-10 tracking-widest uppercase">
            {countdown === 0 ? "GO! 🚀" : "Get ready…"}
          </p>
        </div>
      </>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Phase: error ──────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "error") {
    return (
      <div className="min-h-[100dvh] bg-primary-900 flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle size={32} className="text-red-400" />
        </div>
        <div className="space-y-2">
          <p className="text-white font-bold text-xl">
            {errorMessage?.toLowerCase().includes("started") ||
            errorMessage?.toLowerCase().includes("active")
              ? "Game Already Started"
              : "Could Not Join Game"}
          </p>
          <p className="text-white/50 text-sm max-w-xs">
            {errorMessage?.toLowerCase().includes("started") ||
            errorMessage?.toLowerCase().includes("active")
              ? "This game is already in session. Wait for the next one!"
              : (errorMessage ?? "Something went wrong. Please try again.")}
          </p>
        </div>
        <button
          onClick={() => router.replace("/home")}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/15 transition-colors text-white font-semibold px-6 py-3 rounded-xl"
        >
          <Home size={16} />
          Go Home
        </button>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Phase: joining (spinner) ──────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "idle" || phase === "joining") {
    return (
      <div className="min-h-[100dvh] bg-primary-900 flex flex-col items-center justify-center gap-5">
        <div
          className="w-12 h-12 rounded-full border-4 border-primary-400/30 border-t-white"
          style={{
            animation: "spin 0.8s linear infinite",
            willChange: "transform",
          }}
        />
        <p className="text-white/60 text-sm font-medium">Joining game…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── Phase: lobby + locked ─────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* Confetti fires once when game locks */}
      {isLocked && !prefersReducedMotion && <ConfettiBurst />}

      <div className="min-h-[100dvh] bg-primary-900 flex flex-col pb-10">
        {/* Decorative bg circles — static, zero animation cost */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary-700/20" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-primary-700/20" />
        </div>

        <div className="relative z-10 flex flex-col gap-5 px-4 pt-8 max-w-md mx-auto w-full">
          {/* ── Header ────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LiveDot />
              <span className="text-white font-bold text-sm tracking-wide uppercase">
                {isLocked ? "Game Locked" : "Live Lobby"}
              </span>
            </div>
            {game?.title && (
              <span className="text-white/40 text-xs">{game.title}</span>
            )}
          </div>

          {/* ── Lock banner ───────────────────────────────────────────────── */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, y: -16, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="bg-amber-400/15 border border-amber-400/40 rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <Lock size={18} className="text-amber-300 flex-shrink-0" />
                <div>
                  <p className="text-amber-200 font-bold text-sm">
                    No more players can join!
                  </p>
                  <p className="text-amber-200/60 text-xs mt-0.5">
                    Get ready — game starts any moment now
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Info cards grid ───────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            {/* Players */}
            <InfoCard
              icon={<Users size={12} />}
              label="Players"
              highlight={isLocked}
            >
              <div className="flex flex-col">
                <PlayerCounter count={totalPlayers} />
                <span className="text-white/40 text-xs mt-0.5">
                  {isLocked ? "Final count" : "joined so far"}
                </span>
              </div>
            </InfoCard>

            {/* Prize Pool */}
            <InfoCard
              icon={<Trophy size={12} />}
              label="Prize Pool"
              highlight={isLocked}
            >
              <AnimatePresence mode="wait">
                {isLocked && prizePool > 0 ? (
                  <motion.div
                    key="prize-locked"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  >
                    <p className="text-2xl font-black text-amber-300 leading-tight">
                      {formatNaira(prizePool)}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">up for grabs</p>
                  </motion.div>
                ) : (
                  <motion.div key="prize-live">
                    <p className="text-2xl font-black text-white leading-tight">
                      {prizePool > 0 ? `~${formatNaira(prizePool)}` : "—"}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">
                      growing as players join
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </InfoCard>
          </div>

          {/* ── Countdown to start time ───────────────────────────────────── */}
          {!isLocked && game?.scheduled_start_time && (
            <InfoCard icon={<Zap size={12} />} label="Game Starts In">
              <p
                className="text-3xl font-black text-white tracking-tight tabular-nums"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatCountdown(secsToStart)}
              </p>
              <p className="text-white/40 text-xs">
                {formatDate(game.scheduled_start_time)}
              </p>
            </InfoCard>
          )}

          {/* ── Eraser toggle ─────────────────────────────────────────────── */}
          <InfoCard icon={<Shield size={12} />} label="Power-up">
            <EraserToggle
              hasEraser={hasEraser}
              eraserOpted={eraserOpted}
              eraserCount={eraserCount}
              isLocked={isLocked}
              onToggle={handleEraserToggle}
              isToggling={isToggling}
            />
          </InfoCard>

          {/* ── Game details ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-between text-white/30 text-xs px-1">
            <span>
              Entry:{" "}
              {game
                ? game.entry_fee_kobo === 0
                  ? "Free"
                  : formatNaira(game.entry_fee_kobo)
                : "—"}
            </span>
            {game && <span>Top {game.ngn_winner_percent}% win cash</span>}
          </div>

          {/* ── Idle tip ──────────────────────────────────────────────────── */}
          {!isLocked && (
            <div className="bg-white/5 rounded-xl px-4 py-3 text-center">
              <p className="text-white/40 text-xs leading-relaxed">
                🧠 Stay focused — 10 questions, 10 seconds each.
                <br />
                Answer correctly and quickly to maximise your score.
              </p>
            </div>
          )}

          {/* ── Locked: get ready message ─────────────────────────────────── */}
          {isLocked && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-center space-y-1"
              >
                <p className="text-white font-bold text-lg">
                  May the best player win! 🎮
                </p>
                <p className="text-white/40 text-sm">
                  Stay on this screen — the game will start automatically
                </p>
                {/* Loading dots */}
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-white/40"
                      style={{
                        animation: "qm-dot-bounce 1.2s ease-in-out infinite",
                        animationDelay: `${i * 0.2}s`,
                        willChange: "transform",
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <style>{`
        @keyframes qm-dot-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%           { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </>
  );
}
