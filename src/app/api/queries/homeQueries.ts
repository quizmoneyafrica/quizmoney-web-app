/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { useCallback, useEffect } from "react";
import { liveQueryClient } from "@/app/api/parse/parseClient";
import Parse from "parse";
import { setNextGameData, setTopGamers } from "@/app/store/gameSlice";
import UserAPI from "../userApi";

function HomeQueries() {
  const dispatch = useAppDispatch();

  const fetchTopGamers = useCallback(async () => {
    try {
      const res = await UserAPI.topGamersOfToday();
      console.log(res.data.result.monthlyLeaderboard);
      dispatch(setTopGamers(res.data.result.monthlyLeaderboard));
    } catch (err: any) {
      if (err) return null;
    }
  }, [dispatch]);

  useEffect(() => {
    let gameSubscription: any;
    let topGamersSubscription: any;

    const gameDataLiveQuery = async () => {
      const query = new Parse.Query("Game");
      gameSubscription = await liveQueryClient.subscribe(query);

      gameSubscription?.on("create", (object: Parse.Object) => {
        // console.log("this object was updated: ", object.toJSON());
        dispatch(setNextGameData(object.toJSON()));
      });
      gameSubscription?.on("update", (object: Parse.Object) => {
        // console.log("this object was updated: ", object.toJSON());
        dispatch(setNextGameData(object.toJSON()));
      });
    };
    const topGamersLiveQuery = async () => {
      const query = new Parse.Query("Leaderboard");
      topGamersSubscription = await liveQueryClient.subscribe(query);

      topGamersSubscription?.on("create", () => {
        fetchTopGamers();
      });
      topGamersSubscription?.on("update", () => {
        fetchTopGamers();
      });
    };

    gameDataLiveQuery();
    topGamersLiveQuery();
    return () => {
      if (gameSubscription) gameSubscription.unsubscribe();
      if (topGamersSubscription) topGamersSubscription.unsubscribe();
    };
  }, [dispatch, fetchTopGamers]);
  return null;
}

export default HomeQueries;
