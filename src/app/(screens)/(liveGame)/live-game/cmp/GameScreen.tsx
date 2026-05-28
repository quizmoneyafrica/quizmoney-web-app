"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * GameScreen.tsx
 *
 * Live quiz screen — fully socket-driven, zero Redux.
 *
 * Socket events consumed:
 *   game:question        → new question arrives  (sets state, resets timer)
 *   game:question:result → correct answer reveal  (3 s before next question)
 *   game:finished        → handled upstream by LiveGameQueries → phase = 'completed'
 *
 * Socket event emitted:
 *   game:answer          → { questionIndex, selectedOption: "a"|"b"|"c"|"d" }
 *
 * State: all local + Zustand — no Redux whatsoever.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Flex, Grid } from "@radix-ui/themes";
import { CheckCircle, XCircle } from "lucide-react";

import { useSocket, useGameQuestion, useGameQuestionResult } from "@/lib/socket";
import { useLiveGameStore } from "@/lib/live-game-store";
import { useInventoryStore } from "@/lib/inventory-store";
import { EraserIcon, TimerIcon } from "@/app/icons/icons";
import { shuffleOptionsArray, toastPosition } from "@/app/utils/utils";
import { toast } from "sonner";
import QMLoader from "@/app/components/splashScreen/QMLoader";

// ─── Types ────────────────────────────────────────────────────────────────────

type OptionKey = "a" | "b" | "c" | "d";

interface QuestionOptions {
  a: string;
  b: string;
  c: string;
  d: string;
}

interface LiveQuestionEvent {
  questionIndex: number;       // 0-based
  totalQuestions: number;
  question: {
    id: string;
    text: string;
    options: QuestionOptions;
  };
  serverTimestamp: number;
  timeMs: number;
}

interface QuestionResultEvent {
  questionIndex: number;
  correctOption: OptionKey;
  partialLeaderboard: {
    rank: number;
    playerId: string;
    username: string;
    score: number;
  }[];
}

interface DisplayOption {
  key: OptionKey;
  text: string;
}

const OPTION_KEYS: OptionKey[] = ["a", "b", "c", "d"];

// ─── Option button ────────────────────────────────────────────────────────────

function getOptionStyle(
  optionKey: OptionKey,
  selectedKey: OptionKey | null,
  correctKey: OptionKey | null,
  isLocked: boolean,
): string {
  const base =
    "w-full min-h-[72px] rounded-2xl px-5 py-3 text-left border-2 font-semibold text-sm transition-all duration-200 active:scale-[0.97]";

  if (!correctKey) {
    // Pre-result state
    if (optionKey === selectedKey) {
      return `${base} bg-amber-500 border-amber-400 text-white shadow-md`;
    }
    return `${base} bg-white border-neutral-200 text-neutral-800 ${
      isLocked ? "opacity-60 cursor-not-allowed" : "hover:border-primary-400 hover:bg-primary-50"
    }`;
  }

  // Post-result state
  if (optionKey === correctKey) {
    return `${base} bg-emerald-500 border-emerald-400 text-white`;
  }
  if (optionKey === selectedKey && optionKey !== correctKey) {
    return `${base} bg-red-500 border-red-400 text-white`;
  }
  return `${base} bg-white border-neutral-100 text-neutral-400 opacity-50 cursor-not-allowed`;
}

// ─── Main component ───────────────────────────────────────────────────────────

function GameScreen() {
  const socket = useSocket();

  // Zustand
  const eraserOpted = useLiveGameStore((s) => s.hasEraser && s.eraserOpted);
  const eraserCount = useInventoryStore((s) =>
    s.eraserCount < 0 ? 0 : s.eraserCount,
  );
  const pendingQuestion = useLiveGameStore((s) => s.pendingQuestion);
  const clearPendingQuestion = useLiveGameStore((s) => s.clearPendingQuestion);

  // ── Question state ─────────────────────────────────────────────────────────
  const [currentQuestion, setCurrentQuestion] =
    useState<LiveQuestionEvent | null>(null);
  const [selectedKey, setSelectedKey] = useState<OptionKey | null>(null);
  const [correctKey, setCorrectKey] = useState<OptionKey | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  // ── Audio refs ─────────────────────────────────────────────────────────────
  const correctSfxRef = useRef<HTMLAudioElement | null>(null);
  const wrongSfxRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSfxRef.current = new Audio("/sounds/correct-answer.mp3");
    wrongSfxRef.current = new Audio("/sounds/wrong-answer.mp3");

    return () => {
      correctSfxRef.current = null;
      wrongSfxRef.current = null;
    };
  }, []);

  // ── Drain buffered first question (may have arrived before this mounted) ───
  useEffect(() => {
    if (pendingQuestion) {
      setCurrentQuestion(pendingQuestion as LiveQuestionEvent);
      setSelectedKey(null);
      setCorrectKey(null);
      setIsAnswerLocked(false);
      setTimerKey((k) => k + 1);
      clearPendingQuestion();
    }
    // Only run on mount — pendingQuestion captured in closure is intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── game:question (all questions after the first) ──────────────────────────
  useGameQuestion(
    useCallback((data: LiveQuestionEvent) => {
      setCurrentQuestion(data);
      setSelectedKey(null);
      setCorrectKey(null);
      setIsAnswerLocked(false);
      setTimerKey((k) => k + 1); // resets CountdownCircleTimer
    }, []),
  );

  // ── game:question:result ───────────────────────────────────────────────────
  useGameQuestionResult(
    useCallback(
      (data: QuestionResultEvent) => {
        setCorrectKey(data.correctOption);
        setIsAnswerLocked(true);

        // Play sound feedback
        if (selectedKey === data.correctOption) {
          correctSfxRef.current?.play().catch(() => {});
        } else if (selectedKey !== null) {
          wrongSfxRef.current?.play().catch(() => {});
        }
      },
      [selectedKey],
    ),
  );

  // ── Shuffle options once per question ──────────────────────────────────────
  const displayOptions = useMemo<DisplayOption[]>(() => {
    if (!currentQuestion) return [];
    const opts = currentQuestion.question.options;
    const arr: DisplayOption[] = OPTION_KEYS.map((k) => ({
      key: k,
      text: opts[k],
    }));
    return shuffleOptionsArray(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.question.id]);

  // ── Submit answer ──────────────────────────────────────────────────────────
  const handleOptionClick = useCallback(
    (key: OptionKey) => {
      if (isAnswerLocked || !currentQuestion || !socket) return;

      setSelectedKey(key);
      setIsAnswerLocked(true); // one answer per question

      socket.emit(
        "game:answer",
        {
          questionIndex: currentQuestion.questionIndex,
          selectedOption: key,
        },
        (res: any) => {
          if (!res?.success) {
            // Server rejected — could be rate-limit, stale question, etc.
            const msg: string = res?.message ?? "Answer not recorded";
            if (!msg.includes("already")) {
              toast.error(msg, { position: toastPosition });
            }
          }
        },
      );
    },
    [isAnswerLocked, currentQuestion, socket],
  );

  // ── Loading: waiting for first question ───────────────────────────────────
  if (!currentQuestion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[100dvh] bg-primary-900 flex items-center justify-center px-4"
      >
        <div className="bg-primary-50 text-center border-4 border-primary-500 rounded-2xl px-6 py-10 space-y-4 max-w-sm w-full">
          <div className="flex items-center justify-center">
            <QMLoader />
          </div>
          <h4 className="text-primary-900 font-bold text-lg">
            Game is Starting
          </h4>
          <p className="text-primary-700 text-sm italic">
            Please wait — keep this screen open.
          </p>
        </div>
      </motion.div>
    );
  }

  const questionNumber = currentQuestion.questionIndex + 1;
  const totalQuestions = currentQuestion.totalQuestions;
  const questionText = currentQuestion.question.text;

  // Result feedback label
  const hasResult = correctKey !== null;
  const answeredCorrectly =
    hasResult && selectedKey !== null && selectedKey === correctKey;
  const answeredWrong =
    hasResult && selectedKey !== null && selectedKey !== correctKey;
  const didNotAnswer = hasResult && selectedKey === null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-[100dvh] bg-primary-900 flex flex-col items-center px-4 pb-8"
    >
      <div className="w-full mx-auto max-w-xl space-y-5 pt-4">

        {/* ── Header row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 items-center w-full">

          {/* Left: question progress */}
          <div className="flex items-center gap-1.5 text-white text-sm">
            <TimerIcon width={20} height={20} />
            <span className="font-bold tabular-nums">
              {questionNumber}
              <span className="text-white/40 font-normal">/{totalQuestions}</span>
            </span>
          </div>

          {/* Centre: per-question countdown ring */}
          <div className="flex justify-center">
            <CountdownCircleTimer
              key={timerKey}
              isPlaying={!hasResult} // pause ring after result revealed
              duration={10}
              colors={["#00B87B", "#F7B731", "#A30000"]}
              colorsTime={[10, 5, 0]}
              isSmoothColorTransition
              rotation="counterclockwise"
              onComplete={() => {
                // Time expired — lock without answer (server will reveal shortly)
                setIsAnswerLocked(true);
                return { shouldRepeat: false };
              }}
              size={60}
              strokeWidth={5}
            >
              {({ remainingTime }) => (
                <span className="text-white font-bold text-lg tabular-nums">
                  {remainingTime}
                </span>
              )}
            </CountdownCircleTimer>
          </div>

          {/* Right: eraser badge */}
          <div className="flex justify-end">
            <Flex
              align="center"
              gap="1"
              className={[
                "rounded-full border py-1 px-3 text-sm font-semibold",
                eraserOpted && eraserCount > 0
                  ? "border-emerald-400 text-emerald-300"
                  : "border-white/20 text-white/40",
              ].join(" ")}
            >
              <EraserIcon width={16} height={16} />
              <span>{eraserCount}</span>
            </Flex>
          </div>
        </div>

        {/* ── Question card ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.question.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl w-full px-5 py-7 min-h-[140px] flex items-center justify-center shadow-sm"
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              gap="2"
              className="text-center w-full"
            >
              <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                Question {questionNumber}
              </span>
              <p className="font-bold text-neutral-900 text-base leading-snug">
                {questionText}
              </p>
            </Flex>
          </motion.div>
        </AnimatePresence>

        {/* ── Options grid ──────────────────────────────────────────────── */}
        <Grid columns={{ initial: "1", sm: "2" }} gap="3">
          {displayOptions.map((option, idx) => (
            <button
              key={option.key}
              onClick={() => handleOptionClick(option.key)}
              disabled={isAnswerLocked}
              className={getOptionStyle(
                option.key,
                selectedKey,
                correctKey,
                isAnswerLocked,
              )}
              style={{ willChange: "transform" }}
            >
              <Flex align="center" gap="3">
                <span className="w-6 h-6 rounded-full bg-black/8 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-snug">{option.text}</span>
              </Flex>
            </button>
          ))}
        </Grid>

        {/* ── Result feedback banner ────────────────────────────────────── */}
        <AnimatePresence>
          {hasResult && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={[
                "flex items-center gap-3 rounded-2xl px-4 py-3",
                answeredCorrectly
                  ? "bg-emerald-500/20 border border-emerald-400/40"
                  : answeredWrong
                  ? "bg-red-500/20 border border-red-400/40"
                  : "bg-white/10 border border-white/20",
              ].join(" ")}
            >
              {answeredCorrectly && (
                <CheckCircle size={22} className="text-emerald-400 flex-shrink-0" />
              )}
              {answeredWrong && (
                <XCircle size={22} className="text-red-400 flex-shrink-0" />
              )}
              {didNotAnswer && (
                <XCircle size={22} className="text-white/40 flex-shrink-0" />
              )}
              <div>
                <p className="font-bold text-white text-sm">
                  {answeredCorrectly
                    ? "Correct! 🎉"
                    : answeredWrong
                    ? "Wrong answer"
                    : "Time's up!"}
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  {answeredCorrectly
                    ? "Great job — next question coming up"
                    : `Correct answer: ${correctKey?.toUpperCase()}`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}

export default GameScreen;
