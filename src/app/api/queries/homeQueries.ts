/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { useCallback, useEffect } from "react";
import { liveQueryClient } from "@/app/api/parse/parseClient";
import Parse from "parse";
import {
  setLiveGameData,
  setNextGameData,
  setTopGamers,
} from "@/app/store/gameSlice";
import UserAPI from "../userApi";

function HomeQueries() {
  const { nextGameData } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        liveQueryClient.open();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

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
    if (!nextGameData) return;
    let gameSubscription: any;
    let topGamersSubscription: any;

    const gameDataLiveQuery = async () => {
      const query = new Parse.Query("Game").equalTo(
        "objectId",
        nextGameData.objectId
      );
      // query.equalTo("completed", false);
      // query.ascending("startDate");
      // query.limit(1);

      gameSubscription = await liveQueryClient.subscribe(query);

      gameSubscription?.on("create", (object: Parse.Object) => {
        // console.log("this object was updated: ", object.toJSON());
        dispatch(setNextGameData(object.toJSON()));
      });
      gameSubscription?.on("update", (object: Parse.Object) => {
        // console.log("this object was updated: ", object.toJSON());
        dispatch(setNextGameData(object.toJSON()));
        dispatch(setLiveGameData(object.toJSON()));
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

    // Reconnect logic
    liveQueryClient.on("close", () => {
      console.warn("LiveQuery closed. Attempting reconnect...");
      setTimeout(() => liveQueryClient.open(), 3000);
    });
    liveQueryClient.on("open", () => {
      console.log("LiveQuery connection reopened");
      gameDataLiveQuery();
      topGamersLiveQuery();
    });
    gameDataLiveQuery();
    topGamersLiveQuery();
    return () => {
      if (gameSubscription) gameSubscription.unsubscribe();
      if (topGamersSubscription) topGamersSubscription.unsubscribe();
    };
  }, [dispatch, fetchTopGamers, nextGameData]);
  return null;
}

export default HomeQueries;
