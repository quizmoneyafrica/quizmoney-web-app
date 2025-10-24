"use client";
import { Grid } from "@radix-ui/themes";
import { differenceInSeconds, parseISO, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { gameRules } from "./gameRules";
import CustomButton from "@/app/utils/CustomBtn";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { setOpenLeaveGame, setPhase, stopAudio } from "@/app/store/gameSlice";
import { LeaveGameModal } from "@/app/components/game/leaveGameModal";
import { BiSolidErrorAlt } from "react-icons/bi";

function LobbyScreen() {
  const dispatch = useAppDispatch();
  const nextGameData = useAppSelector((state) => state.game.nextGameData);

  const startDate = parseISO(nextGameData?.startTime + "Z");
  const [secondsLeft, setSecondsLeft] = useState(
    differenceInSeconds(startDate, new Date())
  );

  const [animatedCountdown, setAnimatedCountdown] = useState<number | null>(
    null
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // console.log(nextGameData?.status, phase);
  //start sound ref
  const startSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    startSoundRef.current = new Audio("/sounds/correct-answer.mp3");
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const diff = differenceInSeconds(new Date(startDate), new Date());
      setSecondsLeft(diff);

      if (diff >= 0 && diff <= 20) {
        setAnimatedCountdown(diff - 10);
      }

      // if (diff <= -1) {
      //   dispatch(stopAudio());
      //   dispatch(setPhase("playing"));
      //   clearInterval(intervalRef.current!);
      // }
      if (nextGameData?.status === "INPROGRESS") {
        startSoundRef.current?.play();
        dispatch(stopAudio());
        dispatch(setPhase("playing"));
        clearInterval(intervalRef.current!);
      }
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [startDate, dispatch, nextGameData?.status]);

  // const minutes = Math.floor(secondsLeft / 60);
  // const seconds = secondsLeft % 60;

  const countdownVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1.5, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  return (
    <main>
      <div className="min-h-[100dvh] lg:h-screen bg-primary-900 hero flex flex-col items-center justify-center  px-4">
        <div>
          {secondsLeft <= 20 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={animatedCountdown}
                className="self-stretch text-center text-9xl font-bold text-count"
                variants={countdownVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                {animatedCountdown}
              </motion.div>
            </AnimatePresence>
          ) : (
            <section>
              <div className="">
                <Grid gap="3" className="w-full">
                  <div className=" bg-primary-50 text-center border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
                    <div className="flex items-center justify-center gap-2 text-error-900 text-sm">
                      <BiSolidErrorAlt size={20} color="red" />{" "}
                      <p>This is a Test Game, Only QM Coins will be issued</p>
                    </div>
                  </div>
                  <div className="bg-primary-50 text-sm border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
                    <p className="text-center text-neutral-900 font-bolds">
                      Game Starts Soon
                    </p>
                    {/* <p className="self-stretch text-center text-5xl font-bold text-count">{`${
                      minutes !== 0 ? `${minutes}:` : ""
                    }${seconds}`}</p> */}
                    <p className="self-stretch text-center text-5xl font-bold text-count">
                      {format(startDate, "h:mm a")}
                    </p>
                  </div>
                  {/* body  */}
                  <div className=" bg-primary-50 text-center border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
                    <h4 className="text-center text-error-900 font-bold">
                      Game Rules!
                    </h4>

                    <div className="text-neutral-900 text-left space-y-4">
                      {gameRules.map((rule, index) => (
                        <div key={index}>
                          <span className="font-semibold text-error-900">
                            {index + 1}. {rule.title}
                          </span>{" "}
                          – {rule.description}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* body end  */}
                  <div className="w-full hidden">
                    <CustomButton
                      onClick={() => dispatch(setOpenLeaveGame(true))}
                      width="full"
                      className="!bg-secondary-500 !text-neutral-900"
                    >
                      Leave Game
                    </CustomButton>
                  </div>
                </Grid>
              </div>
            </section>
          )}
        </div>
      </div>
      <LeaveGameModal />
    </main>
  );
}

export default LobbyScreen;
