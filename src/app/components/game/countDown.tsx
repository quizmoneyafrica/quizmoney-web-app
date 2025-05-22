"use client";
import React, { useEffect, useRef, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import {
  setIsAllowedInGame,
  setShowGameCountdown,
} from "@/app/store/gameSlice";
import { useRouter } from "next/navigation";
import GameApi from "@/app/api/game";

type Props = {
  startDate: string;
  gameId: string;
};

export default function CountdownScreen({ startDate, gameId }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(
    differenceInSeconds(new Date(startDate), new Date())
  );
  const { showGameCountdown } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [animatedCountdown, setAnimatedCountdown] = useState<number | null>(
    null
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteracted = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/timer.mp3");
    audioRef.current.load();

    const enableAudio = () => {
      userInteracted.current = true;
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          audioRef.current?.pause();
        });
      }
      window.removeEventListener("click", enableAudio);
      window.removeEventListener("touchstart", enableAudio);
    };

    window.addEventListener("click", enableAudio);
    window.addEventListener("touchstart", enableAudio);

    return () => {
      window.removeEventListener("click", enableAudio);
      window.removeEventListener("touchstart", enableAudio);
    };
  }, []);

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
        // router.push("/game");
        dispatch(setIsAllowedInGame(true));
      }
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [startDate, dispatch, router, showGameCountdown]);

  const leaveGame = async () => {
    try {
      await GameApi.removeUserFromGame(gameId);
      await GameApi.deactivateSession(gameId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleDismiss = () => {
    dispatch(setShowGameCountdown(false));
    router.replace("/home");
    audioRef.current?.pause();
    leaveGame();
  };

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
      <div className="relative flex flex-col items-center justify-center px-10 w-full h-full max-w-sm mx-auto">
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
            <h1 className="text-3xl font-bold mb-4 text-secondary-300">
              Game Starting in
            </h1>
            <p className="text-4xl font-heading font-bold">{`${
              minutes !== 0 ? `${minutes}:` : ""
            }${seconds}`}</p>

            <button
              onClick={handleDismiss}
              className="mt-6 w-full py-3 rounded-full bg-secondary-500 text-neutral-900 font-medium text-sm hover:bg-gray-200 transition"
            >
              Quit Game
            </button>
          </>
        )}
      </div>
    </div>
  );
}
