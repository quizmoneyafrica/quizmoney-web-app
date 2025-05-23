"use client";
import GameApi, { decryptGameData } from "@/app/api/game";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { setLiveGameData, setShowGameCountdown } from "@/app/store/gameSlice";
import { RootState } from "@/app/store/store";
import { toastPosition } from "@/app/utils/utils";
import { Spinner } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

function JoinGameBtn() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const gameData = useSelector((state: RootState) => state.game.nextGameData);
  const [loading, setLoading] = useState(false);

  const handleJoinBtn = async () => {
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
  };
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
