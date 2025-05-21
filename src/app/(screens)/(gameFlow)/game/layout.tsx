"use client";
import CountdownScreen from "@/app/components/game/countDown";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import ProtectedRoute from "@/app/security/protectedRoute";
import { differenceInSeconds } from "date-fns";
import React, { useEffect, useState } from "react";
import Parse from "parse";
import { liveQueryClient } from "@/app/api/parse/parseClient";
import { setNextGameData } from "@/app/store/gameSlice";

function Layout({ children }: { children: React.ReactNode }) {
  const gameData = useAppSelector((state) => state.game.nextGameData);
  const showGameCountDown = useAppSelector(
    (state) => state.game.showGameCountdown
  );
  const [shouldShowCountDown, setShouldShowCountDown] = useState(false);
  const dispatch = useAppDispatch();

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
    if (!gameData?.startDate) return;
    const diff = differenceInSeconds(new Date(gameData?.startDate), new Date());
    setShouldShowCountDown(showGameCountDown && diff > 0 && diff <= 300);
  }, [gameData?.startDate, showGameCountDown]);

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
