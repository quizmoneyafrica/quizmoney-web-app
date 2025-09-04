/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector, useAuth } from "@/app/hooks/useAuth";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EraserIcon } from "@/app/icons/icons";
import { Avatar, Flex, Grid } from "@radix-ui/themes";
import GameApi from "@/app/api/game";
import {
  CurrentLiveQuestionOptionsObj,
  playAudio,
  setCurrentLiveQuestion,
  // setPhase,
} from "@/app/store/gameSlice";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
import CustomButton from "@/app/utils/CustomBtn";
import { gameFetch } from "./gameRules";

function GameScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { currentLiveQuestion, audioShouldPlay } = useAppSelector(
    (state) => state.game
  );
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);

  const [locked, setLocked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  //Sounds
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  //countdown timer
  //game time used
  const totalTimeInterval = useRef<NodeJS.Timeout | null>(null);
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  console.log(totalTimeUsed);

  //Fallback fetch
  const fetchCurrentQuestion = useCallback(async () => {
    if (fetching || currentLiveQuestion?.id) return;
    setFetching(true);
    try {
      const res = await GameApi.getCurrentQuestion();
      const que = res.data;

      if (!questionHistory.includes(que.id)) {
        dispatch(setCurrentLiveQuestion(que));
        setQuestionHistory((prev) => [...prev, que.id]);
        // setShuffledOptions(shuffleArray(que.options));
      }
    } catch (err: any) {
      console.log(err);

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
    totalTimeInterval.current = setInterval(() => {
      setTotalTimeUsed((prev) => prev + 100);
    }, 100);

    return () => {
      if (totalTimeInterval.current) clearInterval(totalTimeInterval.current);
    };
  }, [currentLiveQuestion]);

  // --- Shuffle Options ---
  // useEffect(() => {
  //   if (currentQuestion?.options) {
  //     setShuffledOptions(shuffleArray(currentQuestion.options));
  //   }
  // }, [currentQuestion]);

  // --- Next Question on Timer ---

  // const handleNextQuestion = async () => {
  //   setLocked(false);
  //   const gameId = liveGameData.objectId;
  //   // const questionNumber = (currentIndex + 1).toString();
  //   const questionNumber = currentQuestion.number;
  //   const totalTimeFormatted = formatTime(totalTimeUsed);
  //   const hasAnswered = selectedAnswers[currentIndex] !== undefined;
  //   console.log(selectedAnswers, questionNumber);
  //   console.log(hasAnswered);
  //   console.log(totalTimeFormatted);

  //   // const isLastQuestion = currentIndex + 1 === liveGameData.questions.length;
  //   const isLastQuestion = currentIndex + 1 === shuffledQuestions.length;

  //   if (!isLastQuestion) setCurrentIndex((prev) => prev + 1);

  //   if (isLastQuestion) {
  //     if (totalTimeInterval.current) clearInterval(totalTimeInterval.current);
  //     dispatch(setPhase("completed"));
  //     setUserTime(totalTimeFormatted);
  //     if (!hasAnswered) {
  //       try {
  //         await GameApi.recordGameAnswer(
  //           gameId,
  //           questionNumber.toString(),
  //           "User missed it",
  //           totalTimeFormatted,
  //           false
  //         );
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   }

  //   if (!hasAnswered && !isLastQuestion) {
  //     try {
  //       await GameApi.recordGameAnswer(
  //         gameId,
  //         questionNumber.toString(),
  //         "User missed it",
  //         totalTimeFormatted,
  //         false
  //       );
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  //Option to click
  const handleOptionClick = async (optionId: string) => {
    // if (locked || !currentLiveQuestion) return;
    setSelectedAnswer(optionId);
    setLocked(false);

    if (!audioShouldPlay) dispatch(playAudio());
    // if (totalTimeInterval.current) clearInterval(totalTimeInterval.current);

    // const isCorrect = optionId === currentLiveQuestion.options[0].optionId; // assume first is correct
    // const totalTimeFormatted = formatTime(totalTimeUsed);
    // let toSaveAnswer = optionId;
    // let usedEraserThisQuestion = false;

    // if (isCorrect) {
    //   correctSoundRef.current?.play();
    // } else if (
    //   !isCorrect &&
    //   !eraserUsedAlready &&
    //   user?.gameEraserCount &&
    //   user?.gameEraserCount > 0
    // ) {
    //   toSaveAnswer = currentLiveQuestion.options[0].optionId;
    //   correctSoundRef.current?.play();
    //   toast.success("Eraser used! Your answer was corrected.", {
    //     position: toastPosition,
    //   });
    //   await GameApi.updateErasers(1);
    //   dispatch(updateUser({ gameEraserCount: user.gameEraserCount - 1 }));
    //   setEraserUsedAlready(true);
    //   usedEraserThisQuestion = true;
    // } else {
    //   wrongSoundRef.current?.play();
    // }

    // try {
    //   await GameApi.recordGameAnswer(
    //     currentLiveQuestion.id,
    //     currentLiveQuestion.id,
    //     toSaveAnswer,
    //     totalTimeFormatted,
    //     usedEraserThisQuestion
    //   );
    // } catch (err: any) {
    //   console.error("Retrying save...", err);
    //   try {
    //     await GameApi.recordGameAnswer(
    //       currentLiveQuestion.id,
    //       currentLiveQuestion.id,
    //       toSaveAnswer,
    //       totalTimeFormatted,
    //       usedEraserThisQuestion
    //     );
    //   } catch (err: any) {
    //     console.error("Second failure to save answer.", err);
    //   }
    // }
  };

  // const handleOptionClick = async (option: string) => {
  //   if (locked) return;
  //   setLocked(true);
  //   if (!audioShouldPlay) dispatch(playAudio());

  //   //pause timer
  //   if (totalTimeInterval.current) {
  //     clearInterval(totalTimeInterval.current);
  //   }

  //   const isCorrect = option === currentQuestion.correctAnswer;
  //   const gameId = liveGameData.objectId;
  //   // const questionNumber = (currentIndex + 1).toString();
  //   const questionNumber = currentQuestion.number;
  //   const totalTimeFormatted = formatTime(totalTimeUsed);

  //   let toSaveAnswer = option;
  //   const newAnswers = [...selectedAnswers];

  //   let usedEraserThisQuestion = false;
  //   // --- answer logic ---
  //   if (isCorrect) {
  //     correctSoundRef.current?.play();
  //     newAnswers[currentIndex] = option;
  //   } else if (
  //     !isCorrect &&
  //     !eraserUsedAlready &&
  //     user?.gameEraserCount &&
  //     user?.gameEraserCount > 0
  //   ) {
  //     toSaveAnswer = currentQuestion.correctAnswer;
  //     correctSoundRef.current?.play();
  //     newAnswers[currentIndex] = currentQuestion.correctAnswer;

  //     toast.success("Eraser used! Your answer was corrected.", {
  //       position: toastPosition,
  //     });

  //     await GameApi.updateErasers(1);
  //     dispatch(updateUser({ gameEraserCount: user.gameEraserCount - 1 }));
  //     setEraserUsedAlready(true);
  //     usedEraserThisQuestion = true;
  //   } else {
  //     wrongSoundRef.current?.play();
  //     newAnswers[currentIndex] = option;
  //   }

  //   // --- update answers state ---
  //   setSelectedAnswers(newAnswers);

  //   // --- Save Answer to DB ---
  //   try {
  //     await GameApi.recordGameAnswer(
  //       gameId,
  //       questionNumber.toString(),
  //       toSaveAnswer,
  //       totalTimeFormatted,
  //       usedEraserThisQuestion
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     try {
  //       await GameApi.recordGameAnswer(
  //         gameId,
  //         questionNumber.toString(),
  //         toSaveAnswer,
  //         totalTimeFormatted,
  //         usedEraserThisQuestion
  //       );
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  // if (fetchingQuestion === "loading") {
  //   return (
  //     <motion.div
  //       initial={{ opacity: 0, y: 10 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       exit={{ opacity: 0, y: -10 }}
  //       transition={{ duration: 0.25, ease: "easeInOut" }}
  //     >
  //       <div className="h-[100dvh] bg-primary-900 hero flex items-center  px-4">
  //         <CustomButton
  //           loader
  //           width="full"
  //           size="lg"
  //           type="button"
  //           variant="secondary"
  //         />
  //       </div>
  //     </motion.div>
  //   );
  // } else if (fetchingQuestion === "error") {
  //   return (
  //     <motion.div
  //       initial={{ opacity: 0, y: 10 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       exit={{ opacity: 0, y: -10 }}
  //       transition={{ duration: 0.25, ease: "easeInOut" }}
  //     >
  //       <div className="h-[100dvh] bg-primary-900 hero flex items-center  px-4">
  //         <Grid gap="3" className="w-full">
  //           <div className=" bg-primary-50 text-center border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
  //             <h4 className="text-center text-error-900 font-bold">
  //               Stay In App
  //             </h4>
  //             6
  //             <div className="text-neutral-900 text-left space-y-4">
  //               {gameFetch.map((rule, index) => (
  //                 <div key={index}>
  //                   <span className="font-semibold text-error-900">
  //                     {index + 1}. {rule.title}
  //                   </span>{" "}
  //                   – {rule.description}
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //           <CustomButton
  //             onClick={fetchGame}
  //             width="full"
  //             size="lg"
  //             type="button"
  //             variant="secondary"
  //           >
  //             Start Game Now
  //           </CustomButton>
  //         </Grid>
  //       </div>
  //     </motion.div>
  //   );
  // }
  if (!currentLiveQuestion)
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
              onClick={fetchCurrentQuestion}
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
                src={user?.avatarUrl}
                fallback={user?.firstName?.charAt(0).toUpperCase() || ""}
                radius="full"
                className="bg-primary-50"
              />
            </div>
            <div className="mt-6 text-gray-500 text-sm flex items-center justify-center">
              <span>time</span>
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
                <h3 className="font-bold text-xl">Question</h3>
                <p className="font-medium">{currentLiveQuestion.text}</p>
              </Flex>
            </div>
            {/* Options  */}
            <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
              {currentLiveQuestion.options.map(
                (option: CurrentLiveQuestionOptionsObj, idx: number) => {
                  const isSelected = selectedAnswer === option.optionId;
                  // const isCorrectSelection =
                  //   locked &&
                  //   isSelected &&
                  //   option === currentQuestion.correctAnswer;
                  // const isWrongSelection =
                  //   locked &&
                  //   isSelected &&
                  //   option !== currentQuestion.correctAnswer;
                  // const isCorrectSelection = locked && isSelected;
                  // const isWrongSelection = locked && isSelected;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option.optionId)}
                      disabled={locked}
                      className={`w-full py-3 px-6 min-h-[80px] rounded-full text-left border-4 font-medium transition 
                        ${
                          isSelected
                            ? "bg-amber-500 border-amber-500 text-white"
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
                          <span className="col-span-3">{option.text}</span>
                        </Flex>
                        {/* <span className="text-xl">
                          {isCorrectSelection && (
                            <CorrectCircleIcon className="text-positive-300" />
                          )}
                          {isWrongSelection && (
                            <WrongCircleIcon className="text-error-100" />
                          )}
                        </span> */}
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
