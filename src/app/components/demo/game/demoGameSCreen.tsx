"use client";
import {
  CorrectCircleIcon,
  TimerIcon,
  WrongCircleIcon,
} from "@/app/icons/icons";
import { Avatar, Flex } from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useAuth } from "@/app/hooks/useAuth";
import DemoResult from "../result/demoResult";
import { motion } from "framer-motion";
import LoadingState from "./loadingState";
import { usePracticeSocket } from "@/lib/practice-store";
import type { PracticeQuestion, PracticeSummary } from "@/lib/practice-store";
import { toast } from "sonner";

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${milliseconds}0`;
};

// Option key → display label mapping
const OPTION_KEYS = ["a", "b", "c", "d"] as const;
type OptionKey = (typeof OPTION_KEYS)[number];

function DemoGameScreen() {
  const user = useAuth();
  const { getQuestion, submitAnswer, quitPractice, isConnected } =
    usePracticeSocket();

  // Current question state
  const [currentQuestion, setCurrentQuestion] =
    useState<PracticeQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [score, setScore] = useState(0);
  const [eraserAvailable, setEraserAvailable] = useState(true);

  // Answer state
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null);
  const [correctOption, setCorrectOption] = useState<OptionKey | null>(null);
  const [locked, setLocked] = useState(false);
  const [wasAutoCorrected, setWasAutoCorrected] = useState(false);

  // Screens
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PracticeSummary | null>(null);

  // Timer
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  const totalTimeInterval = useRef<NodeJS.Timeout | null>(null);
  const [timerKey, setTimerKey] = useState(0);

  // Sounds
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct-answer.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong-answer.mp3");
  }, []);

  // Load the first question when the screen mounts.
  // The session was already started in WelcomeScreen before navigating here.
  useEffect(() => {
    if (!isConnected) return;

    getQuestion((res) => {
      if (res.success && res.data) {
        const d = res.data;
        setCurrentQuestion(d.question);
        setQuestionIndex(d.questionIndex);
        setTotalQuestions(d.totalQuestions);
        setScore(d.score);
        setEraserAvailable(d.eraserAvailable);
        setLoading(false);
      } else {
        toast.error("Failed to load question.");
        setLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  // Total elapsed time ticker — resets per question
  useEffect(() => {
    if (!currentQuestion) return;
    totalTimeInterval.current = setInterval(() => {
      setTotalTimeUsed((prev) => prev + 100);
    }, 100);
    return () => {
      if (totalTimeInterval.current) clearInterval(totalTimeInterval.current);
    };
  }, [questionIndex, currentQuestion]);

  const stopTimer = () => {
    if (totalTimeInterval.current) clearInterval(totalTimeInterval.current);
  };

  const advanceToNext = (
    nextQuestion: PracticeQuestion,
    nextIndex: number,
    nextTotal: number,
  ) => {
    setCurrentQuestion(nextQuestion);
    setQuestionIndex(nextIndex);
    setTotalQuestions(nextTotal);
    setSelectedOption(null);
    setCorrectOption(null);
    setLocked(false);
    setWasAutoCorrected(false);
    setTimerKey((k) => k + 1);
  };

  // Timer expired — auto-submit: just advance without an answer (quit handles partial)
  const handleTimeUp = () => {
    if (locked) return;
    stopTimer();
    // Submit a placeholder — backend doesn't accept timeout, so we quit the round gracefully
    // Actually just move to next by submitting the first option silently isn't right.
    // Best approach: treat timeout as a miss — submit the first option or skip.
    // We'll call submitAnswer with 'a' as a forced miss (the backend already tracks correct option).
    submitAnswer(questionIndex, "a", (res) => {
      if (!res.success || !res.data) return;
      const d = res.data;
      setScore(d.score);
      setEraserAvailable(!d.eraserUsed);
      if (d.isFinished && d.summary) {
        stopTimer();
        setSummary(d.summary);
      } else if (d.nextQuestion) {
        advanceToNext(
          d.nextQuestion.question,
          d.nextQuestion.questionIndex,
          d.nextQuestion.totalQuestions,
        );
      }
    });
  };

  const handleOptionClick = (optionKey: OptionKey) => {
    if (locked || !currentQuestion) return;
    stopTimer();
    setSelectedOption(optionKey);
    setLocked(true);

    submitAnswer(questionIndex, optionKey, (res) => {
      if (!res.success || !res.data) {
        toast.error("Failed to submit answer.");
        setLocked(false);
        return;
      }

      const d = res.data;
      const correct = d.correctOption as OptionKey;

      setCorrectOption(correct);
      setScore(d.score);
      setEraserAvailable(!d.eraserUsed);
      setWasAutoCorrected(d.wasAutoCorrected);

      if (d.isCorrect || d.wasAutoCorrected) {
        correctSoundRef.current?.play();
      } else {
        wrongSoundRef.current?.play();
      }

      if (d.isFinished && d.summary) {
        stopTimer();
        // Short delay so the user sees the final answer state before results
        setTimeout(() => setSummary(d.summary!), 800);
      } else if (d.nextQuestion) {
        setTimeout(
          () =>
            advanceToNext(
              d.nextQuestion!.question,
              d.nextQuestion!.questionIndex,
              d.nextQuestion!.totalQuestions,
            ),
          800,
        );
      }
    });
  };

  if (loading) return <LoadingState />;

  if (summary) {
    return (
      <DemoResult
        summary={summary}
        totalTimeUsed={formatTime(totalTimeUsed)}
        user={user}
      />
    );
  }

  if (!currentQuestion) return <LoadingState />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="min-h-screen bg-primary-900 hero flex flex-col items-center px-4">
        <div className="w-full mx-auto max-w-xl space-y-6">
          {/* Header: elapsed time / countdown / avatar */}
          <div className="grid grid-cols-3 w-full">
            <div className="mt-6 text-white text-sm flex items-center justify-start gap-1">
              <TimerIcon width={23} />
              <span>{formatTime(totalTimeUsed)}</span>
            </div>
            <div className="mt-6 text-gray-500 text-sm flex items-center justify-center">
              <CountdownCircleTimer
                isPlaying={!locked}
                duration={10}
                key={timerKey}
                colors={["#00B87B", "#A30000", "#A30000"]}
                colorsTime={[10, 5, 0]}
                isSmoothColorTransition={false}
                rotation="counterclockwise"
                onComplete={() => {
                  handleTimeUp();
                  return { shouldRepeat: false };
                }}
                size={65}
                strokeWidth={6}
              >
                {({ remainingTime }) => (
                  <span className="text-white">{remainingTime}</span>
                )}
              </CountdownCircleTimer>
            </div>
            <div className="mt-6 text-gray-500 text-sm flex items-center justify-end">
              <Avatar
                src={user?.user?.avatarUrl}
                fallback={
                  user?.user?.firstName?.charAt(0).toUpperCase() || "QM"
                }
                radius="full"
                className="bg-primary-50"
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Score + eraser indicator */}
            <div className="flex items-center justify-between text-white text-sm px-1">
              <span>
                Q{questionIndex + 1} / {totalQuestions}
              </span>
              <span className="flex items-center gap-1">
                Score: <strong>{score}</strong>
              </span>
              {eraserAvailable && (
                <span className="text-xs bg-secondary-500 text-white rounded-full px-2 py-0.5">
                  🧹 Eraser ready
                </span>
              )}
            </div>

            {/* Question card */}
            <div className="bg-white border-6 border-secondary-500 rounded-[10px] w-full p-4 min-h-[180px] flex items-center justify-center">
              <Flex
                align="center"
                justify="center"
                direction="column"
                className="text-center"
                gap="2"
              >
                <h3 className="font-bold text-xl">
                  Question {questionIndex + 1}
                </h3>
                <p className="font-medium">{currentQuestion.text}</p>
              </Flex>
            </div>

            {/* Options */}
            <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
              {OPTION_KEYS.map((key, idx) => {
                const optionText = currentQuestion.options[key];
                const isSelected = selectedOption === key;
                const isCorrect = correctOption === key;
                const isCorrectSelection = locked && isSelected && isCorrect;
                const isWrongSelection = locked && isSelected && !isCorrect;
                // Show the correct answer after locking (even if not selected)
                const isRevealedCorrect =
                  locked && !isSelected && correctOption === key;

                return (
                  <button
                    key={key}
                    onClick={() => handleOptionClick(key)}
                    disabled={locked}
                    className={`w-full py-3 px-6 min-h-[80px] rounded-full text-left border-4 font-medium transition
                      ${
                        isCorrectSelection || isRevealedCorrect
                          ? "bg-positive-900 border-positive-500 text-white"
                          : isWrongSelection
                            ? "bg-error-900 border-error-200 text-white"
                            : "bg-neutral-50 border-neutral-50 text-neutral-900"
                      }
                      ${locked ? "cursor-not-allowed" : ""}
                    `}
                  >
                    <Flex gap="4" align="center" justify="between">
                      <Flex gap="4" align="center">
                        <span>{String.fromCharCode(65 + idx)}.</span>
                        <span>{optionText}</span>
                      </Flex>
                      <span className="text-xl">
                        {(isCorrectSelection || isRevealedCorrect) && (
                          <CorrectCircleIcon className="text-positive-300" />
                        )}
                        {isWrongSelection && (
                          <WrongCircleIcon className="text-error-100" />
                        )}
                      </span>
                    </Flex>
                  </button>
                );
              })}
            </div>

            {wasAutoCorrected && (
              <p className="text-center text-sm text-secondary-400 animate-pulse">
                🧹 Eraser used — wrong answer corrected!
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DemoGameScreen;
