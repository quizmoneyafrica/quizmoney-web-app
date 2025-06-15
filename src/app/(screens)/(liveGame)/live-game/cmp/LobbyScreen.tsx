"use client";
import { Grid } from "@radix-ui/themes";
import { differenceInSeconds } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { gameRules } from "./gameRules";
import CustomButton from "@/app/utils/CustomBtn";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { setOpenLeaveGame, setPhase, stopAudio } from "@/app/store/gameSlice";
import { LeaveGameModal } from "@/app/components/game/leaveGameModal";

function LobbyScreen() {
  const dispatch = useAppDispatch();
  const { liveGameData, phase } = useAppSelector((state) => state.game);
  const startDate = liveGameData?.startDate.iso;
  // const startDate = "2025-06-14T13:05:00.000Z";
  const [secondsLeft, setSecondsLeft] = useState(
    differenceInSeconds(new Date(startDate), new Date())
  );
  const [animatedCountdown, setAnimatedCountdown] = useState<number | null>(
    null
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  console.log(liveGameData);

  useEffect(() => {
    const updateCountdown = () => {
      const diff = differenceInSeconds(new Date(startDate), new Date());
      setSecondsLeft(diff);

      if (diff >= 0 && diff <= 10) {
        setAnimatedCountdown(diff);
      }

      if (diff === -1) {
        clearInterval(intervalRef.current!);
        dispatch(stopAudio());
        dispatch(setPhase("playing"));
      }
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [startDate, dispatch]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const countdownVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1.5, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };
  if (phase === "lobby" && secondsLeft < -2) {
    return (
      <div className="min-h-[100dvh] lg:h-screen bg-primary-900 hero flex flex-col items-center justify-center  px-4">
        <div className="w-full h-full mx-auto max-w-lg space-y-6 grid grid-rows-2 place-items-center">
          <div className="w-full bg-error-50 text-center text-sm border-4 border-error-500 rounded-[10px] px-4 py-4 space-y-4 flex flex-col items-center justify-center">
            <span className="text-5xl">🚫</span>
            <p className="font-semibold text-base text-error-900">
              You got in late
            </p>
            <p className="text-error-800">
              Game is in session
              <br />
              Do make sure to join in at least 5 mins before game time
            </p>
            <p>
              Tap the button below to go back home.
              <br /> 👇
            </p>

            <a href="/home" className="w-full">
              <CustomButton width="medium">Go Home</CustomButton>
            </a>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="min-h-[100dvh] lg:h-screen bg-primary-900 hero flex flex-col items-center justify-center  px-4">
        <div>
          {secondsLeft <= 10 ? (
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
            <>
              <div className="">
                <Grid gap="3" className="w-full">
                  <div className="bg-primary-50 text-sm border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
                    <p className="text-center text-neutral-900 font-bolds">
                      Game Starts in
                    </p>
                    <p className="self-stretch text-center text-5xl font-bold text-count">{`${
                      minutes !== 0 ? `${minutes}:` : ""
                    }${seconds}`}</p>
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
                  <div className="w-full ">
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
            </>
          )}
        </div>
      </div>
      <LeaveGameModal />
    </>
  );
}

export default LobbyScreen;
