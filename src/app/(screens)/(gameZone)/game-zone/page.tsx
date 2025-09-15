/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { CirclePlus, MoveLeft } from "lucide-react";
import { useAppSelector } from "@/app/hooks/useAuth";
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

function GameZone() {
  const { wallet: walletData } = useAppSelector(useWallet);
  const wallet = walletData.find((w) => w.currency === "NGN")! || {};
  const router = useRouter();
  let loading = false;

  const games: gamesObject[] = [
    {
      data: {
        title: <PerfectScoreTitle />,
        description: "Answer a number of questions perfectly to win",
        src: "/assets/images/perfect-score.png",
        onClick: () => {},
        btnText: "Coming soon",
        btnDisabled: true,
      },
    },
    {
      data: {
        title: <NumberGuessingTitle />,
        description: "Guess the hidden number within a given range",
        src: "/assets/images/number-guessing.png",
        onClick: () => router.push("/game-zone/number-guessing"),
        // btnText: "Play Game",
        // onClick: () => {},
        btnText: "Coming soon",
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
      },
      variant: "green",
    },
  ];

  const testEndpoints = async () => {
    loading = true;
    try {
      await GameZoneAPI.getAllGames();
    } catch (err: any) {
      toast.error(err.message, { position: toastPosition });
    } finally {
      loading = false;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
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
        <button
          onClick={testEndpoints}
          className="bg-white px-4 py-2 rounded font-medium hidden"
        >
          {loading ? "Loading..." : "Test Endpoints"}
        </button>
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
