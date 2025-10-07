/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector, useAuth } from "@/app/hooks/useAuth";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EraserIcon, TimerIcon } from "@/app/icons/icons";
import { Flex } from "@radix-ui/themes";
import GameApi from "@/app/api/game";
import {
  CurrentLiveQuestionOptionsObj,
  playAudio,
  setCurrentLiveQuestion,
  setOptionLocked,
  setPhase,
  setTotalTimeUsed,
  // setPhase,
} from "@/app/store/gameSlice";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
// import CustomButton from "@/app/utils/CustomBtn";
// import { gameFetch } from "./gameRules";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import QMLoader from "@/app/components/splashScreen/QMLoader";

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}:${milliseconds}0`;
};

function GameScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { currentLiveQuestion, audioShouldPlay } = useAppSelector(
    (state) => state.game
  );
  const optionLocked = useAppSelector((state) => state.game.optionLocked);

  const [questionStart, setQuestionStart] = useState<number | null>(null);
  const [questionTimeUsed, setQuestionTimeUsed] = useState(0);

  const [totalStart, setTotalStart] = useState<number | null>(null);
  const totalTimeUsed = useAppSelector((state) => state.game.totalTimeUsed);
  const rafRef = useRef<number | null>(null);

  const [questionHistory, setQuestionHistory] = useState<string[]>([]);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  //Sounds
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  //countdown timer
  //game time used
  const totalTimeInterval = useRef<NodeJS.Timeout | null>(null);
  // const [totalTimeUsed, setTotalTimeUsed] = useState(0);

  //Fallback fetch
  const fetchCurrentQuestion = useCallback(async () => {
    if (fetching || currentLiveQuestion?.id) return;
    setFetching(true);
    try {
      const res = await GameApi.getCurrentQuestion();
      const que = res.data;

      if (!questionHistory.includes(que.id)) {
        dispatch(setCurrentLiveQuestion(que));
        dispatch(setOptionLocked(false));
        setQuestionHistory((prev) => [...prev, que.id]);
        // setShuffledOptions(shuffleArray(que.options));
      }
    } catch (err: any) {
      console.log(err);

      toast.error(err.message, {
        position: "bottom-center",
      });
      toast.error("Unable to fetch question. Please stay in app.", {
        position: toastPosition,
      });
    } finally {
      setFetching(false);
    }
  }, [dispatch, fetching, currentLiveQuestion, questionHistory]);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct-answer.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong-answer.mp3");
  }, []);

  // fallback to fetch question if WebSocket didn't push
  useEffect(() => {
    if (!currentLiveQuestion) {
      const fallback = setTimeout(() => {
        // fetchCurrentQuestion();
      }, 2000);
      return () => clearTimeout(fallback);
    }
  }, [currentLiveQuestion, fetchCurrentQuestion]);

  // --- User Timer Logic ---
  useEffect(() => {
    if (!currentLiveQuestion) return;

    // Reset question timer
    const now = Date.now();
    setQuestionStart(now);
    setQuestionTimeUsed(0);

    // Start total timer on first question
    if (!totalStart) {
      setTotalStart(now);
      dispatch(setTotalTimeUsed(0));
    }

    const update = () => {
      const current = Date.now();

      // update per-question time
      if (questionStart) {
        setQuestionTimeUsed(current - questionStart); // in ms
      }

      // update total time in Redux
      if (totalStart) {
        dispatch(setTotalTimeUsed(current - totalStart)); // in ms
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentLiveQuestion, dispatch, questionStart, totalStart]);
  // useEffect(() => {
  //   if (!currentLiveQuestion) return;
  //   totalTimeInterval.current = setInterval(() => {
  //     dispatch(setTotalTimeUsed(totalTimeUsed + 100));
  //   }, 100);

  //   return () => {
  //     if (totalTimeInterval.current) clearInterval(totalTimeInterval.current);
  //   };
  // }, [currentLiveQuestion, totalTimeUsed, dispatch]);

  if (!currentLiveQuestion)
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <div className="h-[100dvh] bg-primary-900 hero flex items-center justify-center  px-4">
          <QMLoader />
          {/* <Grid gap="3" className="w-full">
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
              onClick={fetchCurrentQuestion}
              width="full"
              size="lg"
              type="button"
              variant="secondary"
            >
              Start Game Now
            </CustomButton>
          </Grid> */}
        </div>
      </motion.div>
    );

  //Option to click
  const handleOptionClick = async (optionId: string) => {
    if (!audioShouldPlay) dispatch(playAudio());
    if (optionLocked || !currentLiveQuestion) return;

    //Pause user time used
    if (totalTimeInterval.current) clearInterval(totalTimeInterval.current);
    dispatch(setOptionLocked(true));
    setSelectedAnswer(optionId);
    try {
      const res = await GameApi.submitAnswer(optionId, questionTimeUsed);
      console.log("Response: ", res);
    } catch (error: any) {
      console.log(error);
    }
  };

  //End Game
  const handleGameEnd = () => {
    if (totalTimeInterval.current) clearInterval(totalTimeInterval.current);
    dispatch(setPhase("completed"));
  };
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
              <TimerIcon width={23} /> <span>{formatTime(totalTimeUsed)}</span>
              {/* <Avatar
                src={user?.avatarUrl}
                fallback={user?.firstName?.charAt(0).toUpperCase() || ""}
                radius="full"
                className="bg-primary-50"
              /> */}
            </div>
            <div className="mt-6 text-gray-500 text-sm flex items-center justify-center">
              <CountdownCircleTimer
                isPlaying
                duration={10}
                key={currentLiveQuestion.order}
                colors={["#00B87B", "#A30000", "#A30000"]}
                colorsTime={[10, 5, 0]}
                isSmoothColorTransition={false}
                rotation="counterclockwise"
                onComplete={() => {
                  if (currentLiveQuestion.order >= 10) {
                    handleGameEnd();
                    return { shouldRepeat: false };
                  }
                  return { shouldRepeat: false };
                }}
                size={65}
                strokeWidth={6}
              >
                {({ remainingTime }) => (
                  <span className="text-white">{remainingTime}</span>
                  // setTimeout(() => setTimeLeft(remainingTime), 0);
                  // <TimerIcon width={20} className="text-white" />
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
                <span>{user?.gameEraserCount}</span>
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
                  Question {currentLiveQuestion.order}
                </h3>
                <p className="font-medium">{currentLiveQuestion.text}</p>
              </Flex>
            </div>
            {/* Options  */}
            <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
              {currentLiveQuestion.options.map(
                (option: CurrentLiveQuestionOptionsObj, idx: number) => {
                  const isSelected = selectedAnswer === option.optionId;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option.optionId)}
                      disabled={optionLocked}
                      className={`w-full py-3 px-6 min-h-[80px] rounded-full text-left border-4 font-medium transition 
                        ${
                          isSelected
                            ? "bg-amber-500 border-amber-400 text-white"
                            : "bg-neutral-50 border-neutral-50 text-neutral-900"
                        }
                        
                ${optionLocked ? "cursor-not-allowed" : ""}
              `}
                    >
                      <Flex gap="4" align="center" justify="between">
                        <Flex gap="4" align="center">
                          <span className="col-span-1">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span className="col-span-3">{option.text}</span>
                        </Flex>
                      </Flex>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default GameScreen;
