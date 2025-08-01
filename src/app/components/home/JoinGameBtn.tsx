/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import GameApi from "@/app/api/game";
import { getAuthUser } from "@/app/api/userApi";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { playAudio, setLobbyTime, setPhase } from "@/app/store/gameSlice";
import { RootState } from "@/app/store/store";
import { toastPosition } from "@/app/utils/utils";
import { Spinner } from "@radix-ui/themes";
import { differenceInSeconds } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const bannedUserIds = [
  "",
  // "S0FGFxqCJd",
  // "2FScl8GRdx",
  // "cFPeCE4IQx",
  // "r4BEe38SGm",
  // "qwomdtFbvx",
  // "STpU8qgPFW",
  // "b0D4fmr14T",
  // "PSxG6ji5vP",
  // "uWTNBkb8Xa",
  // "DDxlEda8ZA",
  // "PuSTqJJbaU",
  // "rsr3ct9WF2",
  // "3fqVZCYKLm",
  // "6qkJ3U238n",
  // "IAa2gOwETF",
  // "3DPuIkKZEz",
  // "MxlRiRKLS3",
  // "Ol2iE8nIYM",
  // "9qXm1dvrJk",
  // "iHwr5aWKAn",
];

function JoinGameBtn() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const gameData = useSelector((state: RootState) => state.game.nextGameData);
  const [loading, setLoading] = useState(false);
  const user = getAuthUser();

  // const handleJoinBtn = async () => {
  //   const userId = user?.objectId;
  //   const isInGame =
  //     Array.isArray(gameData?.users) && gameData?.users.includes(userId);
  //   const diff = differenceInSeconds(
  //     new Date(gameData?.startDate.iso),
  //     new Date()
  //   );

  //   if (isInGame && diff > 0) {
  //     dispatch(setLiveGameData(gameData));
  //     dispatch(setPhase("lobby"));
  //     dispatch(playAudio());
  //     router.replace(`/live-game/${gameData.objectId}`);
  //   } else {
  //     setLoading(true);
  //     try {
  //       const res = await GameApi.registerForGame(gameData?.objectId);
  //       const game = res.data.result.userData;

  //       dispatch(setLiveGameData(decryptGameData(game)));
  //       dispatch(setPhase("lobby"));
  //       dispatch(playAudio());
  //       router.replace(`/live-game/${gameData.objectId}`);
  //       setLoading(false);
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     } catch (err: any) {
  //       console.log(err.message);
  //       toast.error(err.message, {
  //         position: toastPosition,
  //       });
  //       setLoading(false);
  //     }
  //   }
  // };

  const handleJoinBtn = async () => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out, try again")), 10000)
    );
    const userId = user?.objectId;

    if (!userId) return;

    // Prevent banned users from joining
    if (bannedUserIds.includes(userId)) {
      toast.error("An error occurred.", {
        position: toastPosition,
      });
      return;
    }

    const isInGame =
      Array.isArray(gameData?.users) && gameData?.users.includes(userId);
    const diff = differenceInSeconds(
      new Date(gameData?.startDate.iso),
      new Date()
    );

    if (isInGame && diff > 0) {
      // dispatch(setLiveGameData(gameData));
      dispatch(setLobbyTime(gameData?.startDate.iso));
      dispatch(setPhase("lobby"));
      dispatch(playAudio());
      router.replace(`/live-game/${gameData.objectId}`);
    } else {
      setLoading(true);
      try {
        const res = await Promise.race([
          GameApi.registerForGame(gameData?.objectId, dispatch),
          timeoutPromise,
        ]);

        // const res = await GameApi.registerForGame(gameData?.objectId, dispatch);
        const game = res.userData;
        console.log(game);

        // dispatch(setLiveGameData(decryptGameData(game)));
        dispatch(setLobbyTime(gameData?.startDate.iso));
        dispatch(setPhase("lobby"));
        dispatch(playAudio());
        router.replace(`/live-game/${gameData.objectId}`);
      } catch (err: any) {
        console.log(err.message);
        toast.error(err.message, {
          position: toastPosition,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
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
  );
}

export default JoinGameBtn;
