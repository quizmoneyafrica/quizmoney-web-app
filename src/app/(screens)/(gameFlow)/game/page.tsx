"use client";
import UseGameBlock from "@/app/components/game/useGameBlock";
import { useAppSelector } from "@/app/hooks/useAuth";
import React, { useEffect } from "react";

import { getAuthUser } from "@/app/api/userApi";
import { useRouter } from "next/navigation";
import GameApi from "@/app/api/game";

function Page() {
  UseGameBlock();
  const router = useRouter();
  const gameData = useAppSelector((state) => state.game.nextGameData);
  const user = getAuthUser();

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

  //   before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Redirect if user not in game
  useEffect(() => {
    if (!gameData || !user) return;

    const userId = user?.objectId;
    const isUserInGame =
      Array.isArray(gameData.users) && gameData.users.includes(userId);

    const hasExitedGame = sessionStorage.getItem("hasLeftGame");

    if (!isUserInGame || hasExitedGame === "true") {
      router.replace("/home");
    }
  }, [gameData, user, router]);

  console.log(gameData);
  return (
    <div>
      {/* <GameGuard> */}
      <span>hello now</span>
      {/* </GameGuard> */}
    </div>
  );
}

export default Page;
