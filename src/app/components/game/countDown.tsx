"use client";
import React, { useEffect, useRef, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import {
  setIsAllowedInGame,
  setOpenLeaveGame,
  setShowGameCountdown,
} from "@/app/store/gameSlice";
import { useRouter } from "next/navigation";
import { LeaveGameModal } from "./leaveGameModal";
import { Grid } from "@radix-ui/themes";
import CustomButton from "@/app/utils/CustomBtn";
import { clearLeaderboards } from "@/app/store/leaderboardSlice";

type Props = {
  startDate: string;
};
const rules = [
  {
    title: "Stay in the app",
    description: "Closing or switching apps will disqualify you.",
  },
  {
    title: "Don’t refresh",
    description: "If you're on a browser, do not reload the page.",
  },
  {
    title: "Answer fast",
    description: "Your total time affects your rank.",
  },
  {
    title: "Eraser Advantage",
    description: "It auto corrects your first wrong answer.",
  },
  {
    title: "Get paid",
    description: "Winnings go to your wallet and can be withdrawn.",
  },
];
export default function CountdownScreen({ startDate }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(
    differenceInSeconds(new Date(startDate), new Date())
  );
  const { showGameCountdown, liveGameData } = useAppSelector(
    (state) => state.game
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [animatedCountdown, setAnimatedCountdown] = useState<number | null>(
    null
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteracted = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/count-sound.mp3");
    audioRef.current.volume = 0.2;
    audioRef.current.load();

    if (showGameCountdown) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [showGameCountdown]);

  useEffect(() => {
    if (!showGameCountdown) return;

    const updateCountdown = () => {
      const diff = differenceInSeconds(new Date(startDate), new Date());
      setSecondsLeft(diff);

      if (diff > 0 && diff <= 300) {
        if (audioRef.current && userInteracted.current) {
          audioRef.current.play().catch(() => {});
        }
      }

      if (diff >= 0 && diff <= 10) {
        setAnimatedCountdown(diff);
      }

      if (diff === -1) {
        clearInterval(intervalRef.current!);
        audioRef.current?.pause();
        audioRef.current = null;
        dispatch(setShowGameCountdown(false));
        dispatch(setIsAllowedInGame(true));
        dispatch(clearLeaderboards());
        router.replace(`/game/${liveGameData?.objectId}`);
      }
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [startDate, dispatch, router, showGameCountdown, liveGameData?.objectId]);

  if (!showGameCountdown || secondsLeft < 0 || secondsLeft > 300) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const countdownVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1.5, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  return (
    <div className="fixed z-[9999] inset-0 bg-primary-900 hero text-white ">
      <div className="relative flex flex-col items-center justify-center px-10 w-full h-full max-w-lg mx-auto">
        {secondsLeft <= 10 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={animatedCountdown}
              className="text-[120px] font-bold"
              variants={countdownVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.8 }}
            >
              {animatedCountdown}
            </motion.div>
          </AnimatePresence>
        ) : (
          <>
            <div className="w-full h-full mx-auto max-w-lg space-y-6 flex flex-col items-center justify-center ">
              <Grid gap="3" className="w-full">
                <div className="bg-primary-50 text-sm border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
                  <p className="text-center text-neutral-900 font-bolds">
                    Game Starts in
                  </p>
                  <p className="text-4xl font-heading font-bold text-center text-primary-900">{`${
                    minutes !== 0 ? `${minutes}:` : ""
                  }${seconds}`}</p>
                </div>
                {/* body  */}
                <div className=" bg-primary-50 text-center border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
                  <h4 className="text-center text-error-900 font-bold">
                    Game Rules!
                  </h4>

                  <div className="text-neutral-900 text-left space-y-4">
                    {rules.map((rule, index) => (
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
              </Grid>
              <div className="w-full ">
                <CustomButton
                  onClick={() => dispatch(setOpenLeaveGame(true))}
                  width="full"
                  className="!bg-secondary-500 !text-neutral-900"
                >
                  Quit Game
                </CustomButton>
              </div>
            </div>

            <LeaveGameModal />
          </>
        )}
      </div>
    </div>
  );
}
