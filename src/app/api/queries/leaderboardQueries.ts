/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { liveQueryClient } from "@/app/api/parse/parseClient";
import { useAppDispatch } from "@/app/hooks/useAuth";
import Parse from "parse";
import { useCallback, useEffect } from "react";
import LeaderboardAPI from "../leaderboardApi";
import {
  setAllTimeLeaderboard,
  setLastGameLeaderboard,
} from "@/app/store/leaderboardSlice";

function LeaderboardQueries() {
  const dispatch = useAppDispatch();

  const getLastGameLeaderboard = useCallback(async () => {
    const res = await LeaderboardAPI.getLastGameLeaderboard();
    console.log("LEADERBOARD USER", res.data.result);
    dispatch(setLastGameLeaderboard(res.data.result));
  }, [dispatch]);
  const getAllTimeLeaderboard = useCallback(async () => {
    const res = await LeaderboardAPI.getAllTimeLeaderboard(1);
    dispatch(
      setAllTimeLeaderboard({
        page: 1,
        data: {
          currentPage: res.data.result.currentPage,
          leaderboard: res.data.result.leaderboard,
          limit: res.data.result.limit,
          total: res.data.result.total,
          totalPages: res.data.result.totalPages,
        },
      })
    );
  }, [dispatch]);

  useEffect(() => {
    let leaderboardSubscription: any;

    const leaderboardLiveQuery = async () => {
      const query = new Parse.Query("Leaderboard");
      leaderboardSubscription = await liveQueryClient.subscribe(query);

      leaderboardSubscription?.on("create", () => {
        getLastGameLeaderboard();
        getAllTimeLeaderboard();
      });
      leaderboardSubscription?.on("update", () => {
        getLastGameLeaderboard();
        getAllTimeLeaderboard();
      });
    };

    leaderboardLiveQuery();
    return () => {
      if (leaderboardSubscription) leaderboardSubscription.unsubscribe();
    };
  }, [dispatch, getAllTimeLeaderboard, getLastGameLeaderboard]);
  return null;
}

export default LeaderboardQueries;
