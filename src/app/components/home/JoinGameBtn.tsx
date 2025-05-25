"use client";
import GameApi, { decryptGameData } from "@/app/api/game";
import { getAuthUser } from "@/app/api/userApi";
import { useAppDispatch } from "@/app/hooks/useAuth";
import {
  setGameEnded,
  setIsAllowedInGame,
  setLiveGameData,
  setShowAdsScreen,
  setShowGameCountdown,
  setshowResultScreen,
} from "@/app/store/gameSlice";
import { RootState } from "@/app/store/store";
import { toastPosition } from "@/app/utils/utils";
import { Spinner } from "@radix-ui/themes";
import { differenceInSeconds } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

function JoinGameBtn() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const gameData = useSelector((state: RootState) => state.game.nextGameData);
  const [loading, setLoading] = useState(false);
  const user = getAuthUser();

  const handleJoinBtn = async () => {
    dispatch(setShowAdsScreen(false));
    dispatch(setshowResultScreen(false));
    dispatch(setIsAllowedInGame(false));
    const userId = user?.objectId;
    const isInGame =
      Array.isArray(gameData?.users) && gameData?.users.includes(userId);
    const diff = differenceInSeconds(
      new Date(gameData?.startDate.iso),
      new Date()
    );
    dispatch(setGameEnded(false));

    if (isInGame && diff > 0) {
      dispatch(setLiveGameData(gameData));
      dispatch(setShowGameCountdown(true));
      router.push("/game");
      setLoading(false);
    } else {
      setLoading(true);
      try {
        const res = await GameApi.registerForGame(gameData?.objectId);
        const game = res.data.result.userData;

        dispatch(setLiveGameData(decryptGameData(game)));
        dispatch(setShowGameCountdown(true));
        router.push("/game");
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(err.response.data.error);
        toast.error(err.response.data.error, {
          position: toastPosition,
        });
        setLoading(false);
      }
    }
  };
  console.log(gameData);

  return (
    <>
      <button
        onClick={handleJoinBtn}
        disabled={loading}
        className="bg-white border border-white rounded-full px-4 py-1 text-primary-900 font-medium cursor-pointer flex items-center gap-1 text-nowrap"
      >
        <i className="bi bi-play-circle mb-1 relative">
          <i className="bi bi-play-circle mb-1 animate-ping absolute left-0 top-0"></i>
        </i>{" "}
        {loading ? <Spinner /> : "Join Live Game!"}
      </button>
    </>
  );
}

export default JoinGameBtn;
