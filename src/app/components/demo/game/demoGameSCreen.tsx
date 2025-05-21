"use client";
import {
  CorrectCircleIcon,
  TimerIcon,
  WrongCircleIcon,
} from "@/app/icons/icons";
import { RootState } from "@/app/store/store";
import { Avatar, Flex } from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useAppSelector } from "@/app/hooks/useAuth";
import { decryptData } from "@/app/utils/crypto";
import DemoResult from "../result/demoResult";
import { motion } from "framer-motion";
import LoadingState from "./loadingState";
import UseBlockBackNavigation from "../blockBackNav";

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}:${milliseconds}0`;
};

function DemoGameSCreen() {
  UseBlockBackNavigation();
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user = encrypted ? decryptData(encrypted) : null;
  const demoData = useSelector((state: RootState) => state.demo.data);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const currentQuestion = demoData?.[currentIndex];
  const [score, setScore] = useState(0);
  const [showResultScreen, setshowResultScreen] = useState(false);
  //countdown timer
  const [timeLeft, setTimeLeft] = useState(10);
  //game time used
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  const totalTimeInterval = useRef<NodeJS.Timeout | null>(null);

  //Sounds
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

  //   before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct-answer.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong-answer.mp3");
  }, []);

  const handleNextQuestion = () => {
    setLocked(false);
    if (currentIndex + 1 < demoData?.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (totalTimeInterval.current) {
        clearInterval(totalTimeInterval.current);
      }
      setshowResultScreen(true);
    }
  };
  useEffect(() => {
    if (!currentQuestion) return;
    totalTimeInterval.current = setInterval(() => {
      setTotalTimeUsed((prev) => prev + 100);
    }, 100);

    return () => {
      if (totalTimeInterval.current) clearInterval(totalTimeInterval.current);
    };
  }, [currentIndex, currentQuestion]);

  const handleOptionClick = (option: string) => {
    if (locked) return;
    const isCorrect = option === currentQuestion.correctAnswer;

    if (totalTimeInterval.current) {
      clearInterval(totalTimeInterval.current);
    }
    if (isCorrect) {
      correctSoundRef.current?.play();
      setScore((prev) => prev + 1);
    } else {
      wrongSoundRef.current?.play();
    }

    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = option;
    setSelectedAnswers(newAnswers);

    setLocked(true);
  };

  if (!currentQuestion) {
    return <LoadingState />;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {!showResultScreen ? (
        <div className="min-h-screen bg-primary-900 hero flex flex-col items-center  px-4">
          <div className="w-full mx-auto max-w-xl space-y-6">
            {/* Timer, countdown, Avatar  */}
            <div className="grid grid-cols-3 w-full">
              <div className="mt-6 text-white text-sm flex items-center justify-start gap-1">
                <TimerIcon width={23} />{" "}
                <span>{formatTime(totalTimeUsed)}</span>
              </div>
              <div className="mt-6 text-gray-500 text-sm flex items-center justify-center">
                <CountdownCircleTimer
                  isPlaying
                  duration={10}
                  key={currentIndex}
                  colors={["#00B87B", "#A30000", "#A30000"]}
                  colorsTime={[10, 5, 0]}
                  isSmoothColorTransition={false}
                  rotation="counterclockwise"
                  onComplete={() => {
                    handleNextQuestion();
                    return { shouldRepeat: false };
                  }}
                  size={65}
                  strokeWidth={6}
                >
                  {({ remainingTime }) => {
                    setTimeout(() => setTimeLeft(remainingTime), 0);
                    return <span className="text-white">{timeLeft}</span>;
                  }}
                </CountdownCircleTimer>
              </div>
              <div className="mt-6 text-gray-500 text-sm flex items-center justify-end">
                <Avatar
                  src={user?.avatar}
                  fallback={user?.firstName?.charAt(0).toUpperCase()}
                  radius="full"
                  className="bg-primary-50"
                />
              </div>
            </div>
            <div className="space-y-6">
              {/* Question  */}
              <div className="bg-white border-6 border-secondary-500 rounded-[10px] w-full p-4 min-h-[180px] flex items-center justify-center">
                <Flex
                  align="center"
                  justify="center"
                  direction="column"
                  className="text-center"
                  gap="2"
                >
                  <h3 className="font-bold text-xl">
                    Question {currentIndex + 1}
                    {/* / {demoData?.length} */}
                  </h3>
                  <p className="font-medium">{currentQuestion.question}</p>
                </Flex>
              </div>
              {/* Options  */}
              <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
                {currentQuestion.options.map((option: string, idx: number) => {
                  const isSelected = selectedAnswers[currentIndex] === option;
                  const isCorrectSelection =
                    locked &&
                    isSelected &&
                    option === currentQuestion.correctAnswer;
                  const isWrongSelection =
                    locked &&
                    isSelected &&
                    option !== currentQuestion.correctAnswer;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option)}
                      disabled={locked}
                      className={`w-full py-3 px-6 min-h-[80px] rounded-full text-left border-4 font-medium transition 
                    ${
                      isCorrectSelection
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
                          <span className="col-span-1">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span className="col-span-3">{option}</span>
                        </Flex>
                        <span className="text-xl">
                          {isCorrectSelection && (
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
            </div>
          </div>
        </div>
      ) : (
        <DemoResult
          totalTimeUsed={formatTime(totalTimeUsed)}
          correctScore={score}
          totalQuestion={demoData?.length}
          user={user}
        />
      )}
    </motion.div>
  );
}

export default DemoGameSCreen;
