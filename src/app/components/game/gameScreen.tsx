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
import GameApi, { decryptGameData } from "@/app/api/game";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/app/store/authSlice";
import AdsScreen from "./adsScreen";
import { setGameEnded, setShowAdsScreen } from "@/app/store/gameSlice";
import ResultScreen from "./resultScreen";
import UseGameBlock from "./useGameBlock";
import { RootState } from "@/app/store/store";

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
  useEffect(() => {
    // Replace initial state so back doesn't work
    window.history.replaceState(null, "", window.location.href);

    // Prevent browser back
    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
      toast.error("You cannot go back during a live game.");
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPopState);

    // Block reload or tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  UseGameBlock();
  const dispatch = useDispatch();
  const user = getAuthUser();
  const { isAllowedInGame, showAdsScreen, showResultScreen } = useAppSelector(
    (state) => state.game
  );
  const reduxDemoData = useSelector(
    (state: RootState) => state.game.liveGameData
  );
  const [liveGameData, setliveGameData] = useState(reduxDemoData);
  const initialCount = Number(sessionStorage.getItem("quizmoney_live_count"));
  const [currentIndex, setCurrentIndex] = useState(initialCount);
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userInteracted = useRef(false);

  //Background music
  useEffect(() => {
    // if (!liveGameData?.music?.url) return;
    audioRef.current = new Audio("/sounds/game-sound.mp3");
    // audioRef.current = new Audio(liveGameData?.music?.url);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;
    // audioRef.current?.play();
    window.addEventListener("click", () => {
      audioRef.current?.play();
    });

    if (audioRef.current && userInteracted.current) {
      audioRef.current.play().catch(() => {});
    }
    // if (!audioRef.current) {
    //   audioRef.current = new Audio(liveGameData?.music?.url);
    //   audioRef.current.loop = true;
    //   // audioRef.current?.play().catch(() => {});
    //   audioRef.current.volume = 0.5;
    // }
    // if (isAllowedInGame) {
    //   audioRef.current?.play();
    // }

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [isAllowedInGame, liveGameData?.music?.url]);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct-answer.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong-answer.mp3");
  }, []);

  useEffect(() => {
    const encryptedGame = sessionStorage.getItem("quizmoney_live");

    const reduxIsEmpty =
      !reduxDemoData ||
      !reduxDemoData.questions ||
      reduxDemoData.questions.length === 0;

    const localIsEmpty =
      !liveGameData ||
      !liveGameData.questions ||
      liveGameData.questions.length === 0;

    if (encryptedGame && reduxIsEmpty && localIsEmpty) {
      try {
        const stored = decryptGameData(encryptedGame);
        setliveGameData(stored);
      } catch (e) {
        console.warn("Error decrypting game data", e);
      }
    }
  }, [liveGameData, reduxDemoData]);

  //gameEnded useEffect
  useEffect(() => {
    const isLastQuestion = currentIndex === liveGameData.questions.length - 1;
    if (isLastQuestion) {
      dispatch(setGameEnded(true));
    }
  }, [currentIndex, dispatch, liveGameData.questions.length, timeLeft]);

  // --- Next Question on Timer ---
  const handleNextQuestion = async () => {
    setLocked(false);

    const gameId = liveGameData.objectId;
    const questionNumber = currentIndex + 1;
    const totalTimeFormatted = formatTime(totalTimeUsed);

    const hasAnswered = selectedAnswers[currentIndex] !== undefined;
    const isLastQuestion = currentIndex + 1 === liveGameData.questions.length;

    if (!locked && !hasAnswered) {
      await GameApi.recordGameAnswer(
        gameId,
        questionNumber.toString(),
        "User missed it",
        totalTimeFormatted
      );
    }

    if (isLastQuestion) {
      if (totalTimeInterval.current) {
        clearInterval(totalTimeInterval.current);
      }
      dispatch(setShowAdsScreen(true));
      audioRef.current?.pause();
    } else {
      setCurrentIndex(currentIndex + 1);
      sessionStorage.setItem("quizmoney_live_count", `${currentIndex + 1}`);
    }
  };

  // --- User Timer Logic ---
  useEffect(() => {
    if (!currentQuestion) return;
    totalTimeInterval.current = setInterval(() => {
      setTotalTimeUsed((prev) => prev + 100);
    }, 100);

    return () => {
      if (totalTimeInterval.current) clearInterval(totalTimeInterval.current);
    };
  }, [currentIndex, currentQuestion]);

  // --- Shuffle Options ---
  useEffect(() => {
    if (currentQuestion?.options) {
      setShuffledOptions(shuffleArray(currentQuestion.options));
    }
  }, [currentQuestion]);

  // --- Option Selection Logic ---
  const handleOptionClick = async (option: string) => {
    if (locked) return;
    setLocked(true);

    //pause timer
    if (totalTimeInterval.current) {
      clearInterval(totalTimeInterval.current);
    }

    const isCorrect = option === currentQuestion.correctAnswer;
    const gameId = liveGameData.objectId;
    const questionNumber = (currentIndex + 1).toString();
    const totalTimeFormatted = formatTime(totalTimeUsed);

    let toSaveAnswer = option;
    const newAnswers = [...selectedAnswers];

    // --- answer logic ---
    if (isCorrect) {
      correctSoundRef.current?.play();
      newAnswers[currentIndex] = option;
    } else if (!usedEraser && user?.erasers > 0) {
      toSaveAnswer = currentQuestion.correctAnswer;
      correctSoundRef.current?.play();
      newAnswers[currentIndex] = currentQuestion.correctAnswer;

      toast.success("Eraser used! Your answer was corrected.", {
        position: toastPosition,
      });

      await GameApi.updateErasers(1);
      dispatch(updateUser({ erasers: user.erasers - 1 }));
      setUsedEraser(true);
    } else {
      wrongSoundRef.current?.play();
      newAnswers[currentIndex] = option;
    }

    // --- update answers state ---
    setSelectedAnswers(newAnswers);

    // --- Save Answer to DB ---
    await GameApi.recordGameAnswer(
      gameId,
      questionNumber,
      toSaveAnswer,
      totalTimeFormatted
    );
  };

  if (!currentQuestion && !isAllowedInGame) {
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
