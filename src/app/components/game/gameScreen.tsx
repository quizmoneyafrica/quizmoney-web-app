"use client";
import { getAuthUser } from "@/app/api/userApi";
import { useAppSelector } from "@/app/hooks/useAuth";
import React, { useEffect, useRef, useState } from "react";
import LoadingState from "../demo/game/loadingState";
import { motion } from "framer-motion";
import {
  CorrectCircleIcon,
  EraserIcon,
  TimerIcon,
  WrongCircleIcon,
} from "@/app/icons/icons";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Flex } from "@radix-ui/themes";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
import GameApi from "@/app/api/game";
import { useDispatch } from "react-redux";
import { updateUser } from "@/app/store/authSlice";
import AdsScreen from "./adsScreen";
import { setShowAdsScreen } from "@/app/store/gameSlice";
import ResultScreen from "./resultScreen";

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}:${milliseconds}0`;
};
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function GameScreen() {
  const dispatch = useDispatch();
  const user = getAuthUser();
  const { liveGameData, showAdsScreen, showResultScreen } = useAppSelector(
    (state) => state.game
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const currentQuestion = liveGameData?.questions?.[currentIndex];
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  //   const [score, setScore] = useState(0);
  const [usedEraser, setUsedEraser] = useState(false);
  //countdown timer
  const [timeLeft, setTimeLeft] = useState(10);
  //game time used
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  const totalTimeInterval = useRef<NodeJS.Timeout | null>(null);

  //Sounds
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct-answer.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong-answer.mp3");
  }, []);

  const handleNextQuestion = () => {
    setLocked(false);
    if (currentIndex + 1 < liveGameData?.questions?.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (totalTimeInterval.current) {
        clearInterval(totalTimeInterval.current);
      }
      dispatch(setShowAdsScreen(true));
    }
  };
  //User timer
  useEffect(() => {
    if (!currentQuestion) return;
    totalTimeInterval.current = setInterval(() => {
      setTotalTimeUsed((prev) => prev + 100);
    }, 100);

    return () => {
      if (totalTimeInterval.current) clearInterval(totalTimeInterval.current);
    };
  }, [currentIndex, currentQuestion]);
  useEffect(() => {
    if (currentQuestion?.options) {
      setShuffledOptions(shuffleArray(currentQuestion.options));
    }
  }, [currentQuestion]);

  const handleOptionClick = async (option: string) => {
    if (locked) return;
    const isCorrect = option === currentQuestion.correctAnswer;

    if (totalTimeInterval.current) {
      clearInterval(totalTimeInterval.current);
    }
    const newAnswers = [...selectedAnswers];
    const gameId = liveGameData.objectId;
    const questionNumber = currentIndex + 1;
    let toSaveAnswer = option;

    if (isCorrect) {
      correctSoundRef.current?.play();
      //   setScore((prev) => prev + 1);
      newAnswers[currentIndex] = option;
    } else if (!isCorrect && !usedEraser && user?.erasers > 0) {
      toSaveAnswer = currentQuestion.correctAnswer;
      correctSoundRef.current?.play();
      //   setScore((prev) => prev + 1);
      newAnswers[currentIndex] = currentQuestion.correctAnswer;
      setUsedEraser(true);
      toast.success("Eraser used! Your answer was corrected.", {
        position: toastPosition,
      });
      //reduce eraser

      await GameApi.updateErasers(1);
      dispatch(updateUser({ erasers: user.erasers - 1 }));
    } else {
      wrongSoundRef.current?.play();
      newAnswers[currentIndex] = option;
    }
    setSelectedAnswers(newAnswers);
    setLocked(true);

    const isLastQuestion = currentIndex === liveGameData.questions.length - 1;
    const totalTimeFormatted = formatTime(totalTimeUsed);
    await GameApi.recordGameAnswer(
      gameId,
      questionNumber.toLocaleString(),
      toSaveAnswer,
      isLastQuestion ? totalTimeFormatted : undefined
    );
  };
  console.log(user);

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
      {!showAdsScreen && !showResultScreen ? (
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
              <div className="mt-6 text-sm flex items-center justify-end">
                <Flex
                  align="center"
                  gap="2"
                  className="rounded-full border py-1 px-4 border-neutral-50 text-neutral-50"
                >
                  <EraserIcon width={20} height={20} />
                  <span>{user?.erasers}</span>
                </Flex>
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
                  </h3>
                  <p className="font-medium">{currentQuestion.question}</p>
                </Flex>
              </div>
              {/* Options  */}
              <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
                {shuffledOptions.map((option: string, idx: number) => {
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
        <>
          {showAdsScreen && !showResultScreen ? (
            <AdsScreen />
          ) : (
            <>{!showAdsScreen && showResultScreen ? <ResultScreen /> : null}</>
          )}
        </>
      )}
    </motion.div>
  );
}

export default GameScreen;
