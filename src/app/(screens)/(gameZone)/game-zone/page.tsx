/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CirclePlus, MoveLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { formatNaira, toastPosition } from "@/app/utils/utils";
import { useRouter } from "next/navigation";
import GameZoneCardTemp, {
  gamesObject,
} from "@/app/components/home/(game-zone)/temp/GameZoneCardTemp";
import {
  MemoryGameTitle,
  NumberGuessingTitle,
  PerfectScoreTitle,
} from "@/app/icons/icons";
import { useWallet } from "@/app/store/walletSlice";
import { toast } from "sonner";
import GameZoneAPI from "@/app/api/gameZoneApi";
import QMLoader from "@/app/components/splashScreen/QMLoader";
import { setGameZoneGames } from "@/app/store/gameZoneSlice";
import { setGameStatus } from "@/app/store/numberGuessGameSlice";

function GameZone() {
  const dispatch = useAppDispatch();
  const { wallet: walletData } = useAppSelector(useWallet);
  const wallet = walletData.find((w) => w.currency === "NGN")! || {};
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const getAllGames = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await GameZoneAPI.getAllGames();
      dispatch(setGameZoneGames(res.data));
    } catch (err: any) {
      toast.error(err.message, { position: toastPosition });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getAllGames();
  }, [getAllGames]);

  if (isLoading) {
    return (
      <div className="w-full h-full grid place-items-center">
        <QMLoader />
      </div>
    );
  }

  const handleEnterGame = (route: string) => {
    dispatch(setGameStatus("START"));
    router.push(route);
  };

  const games: gamesObject[] = [
    {
      data: {
        title: <PerfectScoreTitle />,
        description: "Answer a number of questions perfectly to win",
        src: "/assets/images/perfect-score.png",
        onClick: () => {},
        btnText: "Coming soon",
        btnDisabled: true,
        gameType: "PERFECT_SCORE",
      },
    },
    {
      data: {
        title: <NumberGuessingTitle />,
        description: "Guess the hidden number within a given range",
        src: "/assets/images/number-guessing.png",
        onClick: () => handleEnterGame("/game-zone/number-guessing"),
        btnText: "Play Game",
        // onClick: () => {},
        // btnText: "Coming soon",
        gameType: "NUMBER_GUESSER",
      },
      variant: "blue",
    },
    {
      data: {
        title: <MemoryGameTitle />,
        description: "Match all identical cards before you run out of moves",
        src: "/assets/images/memory-game.png",
        onClick: () => {},
        btnText: "Coming soon",
        btnDisabled: true,
        gameType: "MEMORY_GAME",
      },
      variant: "green",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <button onClick={() => handleEnterGame("")} className="hidden"></button>
      <div className="min-h-[100dvh] bg-primary-900 hero px-4 lg:px-10 py-6 space-y-6">
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-white font-bold flex items-center gap-1"
          >
            <MoveLeft /> Game Zone
          </button>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => router.push("/wallet")}
              className="bg-white rounded-full px-4 py-2 text-primary-900 font-medium font-text flex items-center gap-1"
            >
              {formatNaira(Number(wallet?.availableBalance || 0), true)}
              <CirclePlus width={18} height={18} />
            </button>
          </div>
        </div>

        {/* games */}
        <div className="grid md:grid-cols-2 gap-4">
          {games.map((game, index) => {
            return (
              <GameZoneCardTemp
                key={index}
                data={game.data}
                className={game.className}
                showBadge={game.showBadge}
                variant={game.variant}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default GameZone;
