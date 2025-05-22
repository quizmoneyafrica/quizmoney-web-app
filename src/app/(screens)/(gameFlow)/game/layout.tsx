"use client";
import CountdownScreen from "@/app/components/game/countDown";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import ProtectedRoute from "@/app/security/protectedRoute";
import { differenceInSeconds } from "date-fns";
import React, { useEffect, useState } from "react";
import Parse from "parse";
import { liveQueryClient } from "@/app/api/parse/parseClient";
import { setNextGameData } from "@/app/store/gameSlice";
import GameApi, { decryptGameData } from "@/app/api/game";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";

function Layout({ children }: { children: React.ReactNode }) {
  const gameData = useAppSelector((state) => state.game.nextGameData);
  const showGameCountDown = useAppSelector(
    (state) => state.game.showGameCountdown
  );
  const [shouldShowCountDown, setShouldShowCountDown] = useState(false);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextGame = async () => {
      try {
        const res = await GameApi.fetchNextGame();
        const encryptedGame = res.data.result.errorData;
        const game = decryptGameData(encryptedGame);

        dispatch(setNextGameData(game));
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(err);
        toast.error("An error occurred please refresh!", {
          position: toastPosition,
        });
        setLoading(false);
      }
    };
    fetchNextGame();
  }, [dispatch]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let subscription: any;
    const gameDataLiveQuery = async () => {
      const query = new Parse.Query("Game");
      subscription = await liveQueryClient.subscribe(query);

      subscription?.on("create", (object: Parse.Object) => {
        // console.log("this object was updated: ", object.toJSON());
        dispatch(setNextGameData(object.toJSON()));
      });
      subscription?.on("update", (object: Parse.Object) => {
        console.log("this object was updated: ", object.toJSON());
        dispatch(setNextGameData(object.toJSON()));
      });
    };

    gameDataLiveQuery();
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [dispatch]);
  useEffect(() => {
    if (!loading && !gameData?.startDate) return;
    const diff = differenceInSeconds(new Date(gameData?.startDate), new Date());
    setShouldShowCountDown(showGameCountDown && diff > 0 && diff <= 300);
  }, [gameData?.startDate, loading, showGameCountDown]);

  return (
    <ProtectedRoute>
      {shouldShowCountDown && (
        <CountdownScreen
          startDate={gameData?.startDate}
          gameId={gameData?.objectId}
        />
      )}
      {children}
    </ProtectedRoute>
  );
}

export default Layout;
