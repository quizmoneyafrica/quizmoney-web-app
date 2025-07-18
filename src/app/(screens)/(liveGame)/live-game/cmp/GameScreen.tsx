/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CorrectCircleIcon,
  EraserIcon,
  TimerIcon,
  WrongCircleIcon,
} from "@/app/icons/icons";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Avatar, Flex, Grid } from "@radix-ui/themes";
import GameApi, { decryptGameData } from "@/app/api/game";
import { playAudio, setLiveGameData, setPhase } from "@/app/store/gameSlice";
import { getAuthUser } from "@/app/api/userApi";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
import { updateUser } from "@/app/store/authSlice";
import CustomButton from "@/app/utils/CustomBtn";
import { gameFetch } from "./gameRules";

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

type Question = {
  number: string;
  question: string;
  options: string[];
  correctAnswer: string;
  originalIndex: number;
};
type Props = {
  setUserTime: (userTime: string) => void;
};
function GameScreen({ setUserTime }: Props) {
  const [fetchingQuestion, setFetchingQuestion] = useState<
    "loading" | "error" | "loaded"
  >("loading");
  const dispatch = useAppDispatch();
  const user = getAuthUser();
  const { liveGameData, audioShouldPlay } = useAppSelector(
    (state) => state.game
  );
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const currentQuestion = liveGameData?.questions?.[currentIndex];
  const currentQuestion = shuffledQuestions[currentIndex];
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const [eraserUsedAlready, setEraserUsedAlready] = useState(false);

  //countdown timer
  //game time used
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  const totalTimeInterval = useRef<NodeJS.Timeout | null>(null);

  //Sounds
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

  const fetchGame = useCallback(async () => {
    setFetchingQuestion("loading");
    try {
      const res = await GameApi.fetchNextGame();
      console.log("GAME", res);
      const encryptedGame = res.errorData;
      const game = decryptGameData(encryptedGame);
      dispatch(setLiveGameData(game));
      console.log("decryptGameData: ", game);
      setFetchingQuestion("loaded");
    } catch (err: any) {
      console.log(err);
      toast.error("Please click on the button again", {
        position: toastPosition,
      });
      setFetchingQuestion("error");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  useEffect(() => {
    if (
      fetchingQuestion === "loaded" &&
      liveGameData?.questions?.length &&
      shuffledQuestions.length < 9
    ) {
      const questionsWithIndex = (liveGameData.questions as Question[]).map(
        (q, index) => ({
          ...q,
          originalIndex: index,
        })
      );
      const shuffled = shuffleArray(questionsWithIndex);
      setShuffledQuestions(shuffled);
    }
  }, [fetchingQuestion, liveGameData?.questions, shuffledQuestions]);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct-answer.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong-answer.mp3");
  }, []);
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

  // --- Next Question on Timer ---
  const handleNextQuestion = async () => {
    setLocked(false);
    const gameId = liveGameData.objectId;
    // const questionNumber = (currentIndex + 1).toString();
    const questionNumber = currentQuestion.number;
    const totalTimeFormatted = formatTime(totalTimeUsed);
    const hasAnswered = selectedAnswers[currentIndex] !== undefined;
    console.log(selectedAnswers, questionNumber);
    console.log(hasAnswered);
    console.log(totalTimeFormatted);

    // const isLastQuestion = currentIndex + 1 === liveGameData.questions.length;
    const isLastQuestion = currentIndex + 1 === shuffledQuestions.length;

    if (!isLastQuestion) setCurrentIndex((prev) => prev + 1);

    if (isLastQuestion) {
      if (totalTimeInterval.current) clearInterval(totalTimeInterval.current);
      dispatch(setPhase("completed"));
      setUserTime(totalTimeFormatted);
      if (!hasAnswered) {
        try {
          await GameApi.recordGameAnswer(
            gameId,
            questionNumber.toString(),
            "User missed it",
            totalTimeFormatted,
            false
          );
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (!hasAnswered && !isLastQuestion) {
      try {
        await GameApi.recordGameAnswer(
          gameId,
          questionNumber.toString(),
          "User missed it",
          totalTimeFormatted,
          false
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOptionClick = async (option: string) => {
    if (locked) return;
    setLocked(true);
    if (!audioShouldPlay) dispatch(playAudio());

    //pause timer
    if (totalTimeInterval.current) {
      clearInterval(totalTimeInterval.current);
    }

    const isCorrect = option === currentQuestion.correctAnswer;
    const gameId = liveGameData.objectId;
    // const questionNumber = (currentIndex + 1).toString();
    const questionNumber = currentQuestion.number;
    const totalTimeFormatted = formatTime(totalTimeUsed);

    let toSaveAnswer = option;
    const newAnswers = [...selectedAnswers];

    let usedEraserThisQuestion = false;
    // --- answer logic ---
    if (isCorrect) {
      // correctSoundRef.current?.play();
      newAnswers[currentIndex] = option;
    } else if (!isCorrect && !eraserUsedAlready && user?.erasers > 0) {
      toSaveAnswer = currentQuestion.correctAnswer;
      // correctSoundRef.current?.play();
      newAnswers[currentIndex] = currentQuestion.correctAnswer;

      toast.success("Eraser used! Your answer was corrected.", {
        position: toastPosition,
      });

      await GameApi.updateErasers(1);
      dispatch(updateUser({ erasers: user.erasers - 1 }));
      setEraserUsedAlready(true);
      usedEraserThisQuestion = true;
    } else {
      wrongSoundRef.current?.play();
      newAnswers[currentIndex] = option;
    }

    // --- update answers state ---
    setSelectedAnswers(newAnswers);

    // --- Save Answer to DB ---
    try {
      await GameApi.recordGameAnswer(
        gameId,
        questionNumber.toString(),
        toSaveAnswer,
        totalTimeFormatted,
        usedEraserThisQuestion
      );
    } catch (error) {
      console.log(error);
      try {
        await GameApi.recordGameAnswer(
          gameId,
          questionNumber.toString(),
          toSaveAnswer,
          totalTimeFormatted,
          usedEraserThisQuestion
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (fetchingQuestion === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <div className="h-[100dvh] bg-primary-900 hero flex items-center  px-4">
          <CustomButton
            loader
            width="full"
            size="lg"
            type="button"
            variant="secondary"
          />
        </div>
      </motion.div>
    );
  } else if (fetchingQuestion === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <div className="h-[100dvh] bg-primary-900 hero flex items-center  px-4">
          <Grid gap="3" className="w-full">
            <div className=" bg-primary-50 text-center border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
              <h4 className="text-center text-error-900 font-bold">
                Stay In App
              </h4>
              6
              <div className="text-neutral-900 text-left space-y-4">
                {gameFetch.map((rule, index) => (
                  <div key={index}>
                    <span className="font-semibold text-error-900">
                      {index + 1}. {rule.title}
                    </span>{" "}
                    – {rule.description}
                  </div>
                ))}
              </div>
            </div>
            <CustomButton
              onClick={fetchGame}
              width="full"
              size="lg"
              type="button"
              variant="secondary"
            >
              Start Game Now
            </CustomButton>
          </Grid>
        </div>
      </motion.div>
    );
  }
  if (!currentQuestion)
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <div className="h-[100dvh] bg-primary-900 hero flex items-center  px-4">
          <Grid gap="3" className="w-full">
            <div className=" bg-primary-50 text-center border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
              <h4 className="text-center text-error-900 font-bold">
                Stay In App
              </h4>

              <div className="text-neutral-900 text-left space-y-4">
                {gameFetch.map((rule, index) => (
                  <div key={index}>
                    <span className="font-semibold text-error-900">
                      {index + 1}. {rule.title}
                    </span>{" "}
                    – {rule.description}
                  </div>
                ))}
              </div>
            </div>
            <CustomButton
              onClick={fetchGame}
              width="full"
              size="lg"
              type="button"
              variant="secondary"
            >
              Start Game Now
            </CustomButton>
          </Grid>
        </div>
      </motion.div>
    );
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="min-h-[100dvh] bg-primary-900 hero flex flex-col items-center  px-4">
        <div className="w-full mx-auto max-w-xl space-y-6">
          {/* Timer, countdown, Avatar  */}
          <div className="grid grid-cols-3 w-full">
            <div className="mt-6 text-white text-sm flex items-center justify-start gap-1">
              {/* <TimerIcon width={23} /> <span>{formatTime(totalTimeUsed)}</span> */}
              <Avatar
                src={user?.avatar}
                fallback={user?.firstName?.charAt(0).toUpperCase()}
                radius="full"
                className="bg-primary-50"
              />
            </div>
            <div className="mt-6 text-gray-500 text-sm flex items-center justify-center">
              <CountdownCircleTimer
                isPlaying
                duration={7}
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
                {/* {({ remainingTime }) => {
                  setTimeout(() => setTimeLeft(remainingTime), 0);
                  return <span className="text-white">{timeLeft}</span>;
                }} */}
                {({}) => (
                  // <span className="text-white">{remainingTime}</span>
                  <TimerIcon width={20} className="text-white" />
                )}
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
                    //       className={`w-full py-3 px-6 min-h-[80px] rounded-full text-left border-4 font-medium transition
                    //           ${
                    //             isCorrectSelection
                    //               ? "bg-positive-900 border-positive-500 text-white"
                    //               : isWrongSelection
                    //               ? "bg-error-900 border-error-200 text-white"
                    //               : "bg-neutral-50 border-neutral-50 text-neutral-900"
                    //           }
                    //   ${locked ? "cursor-not-allowed" : ""}
                    // `}
                    className={`w-full py-3 px-6 min-h-[80px] rounded-full text-left border-4 font-medium transition 
                        ${
                          isCorrectSelection || isWrongSelection
                            ? "bg-warning-900 border-warning-200 text-white"
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
                          <CorrectCircleIcon className="text-positive-300 hidden" />
                        )}
                        {isWrongSelection && (
                          <WrongCircleIcon className="text-error-100 hidden" />
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
    </motion.div>
  );
}

export default GameScreen;
