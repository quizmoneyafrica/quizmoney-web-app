"use client";
import UseGameBlock from "@/app/components/game/useGameBlock";
import { useAppSelector } from "@/app/hooks/useAuth";
import React, { useEffect, useState } from "react";

import { getAuthUser } from "@/app/api/userApi";
import { useRouter } from "next/navigation";
import GameApi from "@/app/api/game";
import GameScreen from "@/app/components/game/gameScreen";
import CustomButton from "@/app/utils/CustomBtn";
import { differenceInSeconds } from "date-fns";
// import GameScreen from "@/app/components/game/gameScreen";

function Page() {
  UseGameBlock();
  const router = useRouter();
  const gameData = useAppSelector((state) => state.game.nextGameData);
  const { isAllowedInGame, liveGameData } = useAppSelector(
    (state) => state.game
  );
  const user = getAuthUser();
  const [isUserInGame, setIsUserInGame] = useState<boolean | null>(null);

  useEffect(() => {
    const handleUnload = async () => {
      try {
        await GameApi.deactivateSession(gameData?.objectId);
      } catch (error) {
        console.error("Session cleanup failed:", error);
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [gameData?.objectId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (!gameData || !user) {
      setIsUserInGame(null);
      return;
    }

    const userId = user?.objectId;
    const isInGame =
      Array.isArray(gameData.users) && gameData.users.includes(userId);

    if (!isInGame) {
      setIsUserInGame(false);
      router.replace("/home");
    } else {
      setIsUserInGame(true);
    }
  }, [gameData, user, router]);

  // Show nothing until we verify if the user is in the game
  if (isUserInGame === null) return null;

  // If user is not in the game, return null (they’ll be redirected anyway)
  if (!isUserInGame) return null;
  console.log("LiveData: ", liveGameData);
  const diff = differenceInSeconds(
    new Date(liveGameData?.startDate.iso),
    new Date()
  );
  return (
    <>
      {isAllowedInGame && diff <= 0 ? (
        <>
          <GameScreen />
        </>
      ) : (
        <div className="min-h-screen lg:h-screen bg-primary-900 hero flex flex-col items-center justify-center  px-4">
          <div className="w-full h-full mx-auto max-w-lg space-y-6 grid grid-rows-2 place-items-center">
            <div className="w-full bg-error-50 text-center text-sm border-4 border-error-500 rounded-[10px] px-4 py-4 space-y-4 flex flex-col items-center justify-center">
              <span className="text-5xl">🎮 </span>
              <p className="font-medium text-base">
                Next Game Is not live yet!
              </p>
              <p>
                Want to know when the next game is?
                <br /> Tap the button 👇
              </p>

              <CustomButton
                width="medium"
                onClick={() => router.replace("/home")}
              >
                Go Home
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
