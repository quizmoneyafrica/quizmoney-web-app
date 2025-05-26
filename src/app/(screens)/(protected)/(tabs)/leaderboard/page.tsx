"use client";
import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import CustomPagination from "@/app/utils/CustomPagination";
import PlayerCard from "./PlayerCard";
import LeaderboardAPI from "@/app/api/leaderboardApi";
import { CupIcon } from "@/app/icons/icons";
import LeaderboardLoader from "./LeaderboardLoader";
import { useAppSelector } from "@/app/hooks/useAuth";
import {
  setAllTimeLeaderboard,
  setLastGameLeaderboard,
} from "@/app/store/leaderboardSlice";
import { useDispatch } from "react-redux";

export interface Leaderboard {
  amountWon: number;
  avatar: string;
  facebook: string;
  firstName: string;
  instagram: string;
  lastName: string;
  noOfGamesPlayed: number;
  overallRank: number;
  twitter: string;
  userId: string;
  position: number;
  prize: number;
}

export interface LeaderboardData {
  currentPage?: number;
  leaderboard: Leaderboard[];
  limit?: number;
  total?: number;
  totalPages?: number;
}

function Page() {
  const [activeTab, setActiveTab] = useState<"lastGame" | "allTime">(
    "lastGame"
  );
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const { lastGame, allTime } = useAppSelector((state) => state.leaderboard);

  const leaderboard =
    activeTab === "lastGame"
      ? lastGame?.leaderboard
      : allTime[page]?.leaderboard;
  const leaderboardData = activeTab === "lastGame" ? lastGame : allTime[page];

  const getLeaderboard = useCallback(
    async (tab: "lastGame" | "allTime") => {
      setLoading(true);

      try {
        if (tab === "lastGame") {
          if (!lastGame) {
            const res = await LeaderboardAPI.getLastGameLeaderboard();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rankings = res.data.result.rankings.map((data: any) => ({
              position: data.position,
              prize: data.prize,
              ...data.user,
            }));
            const payload = { leaderboard: rankings };
            dispatch(setLastGameLeaderboard(payload));
          }
        } else {
          if (!allTime[page]) {
            const res = await LeaderboardAPI.getAllTimeLeaderboard(page);
            dispatch(
              setAllTimeLeaderboard({
                page,
                data: res.data.result,
              })
            );
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, lastGame, allTime, page]
  );

  useEffect(() => {
    getLeaderboard("lastGame");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "allTime") {
      getLeaderboard("allTime");
    }
  }, [activeTab, page, getLeaderboard]);

  const handleTabChange = (tab: "lastGame" | "allTime") => {
    setActiveTab(tab);
  };

  let content = null;
  if (loading) {
    content = (
      <div className="flex flex-col gap-5">
        {Array(7)
          .fill(0)
          .map((_, index) => (
            <LeaderboardLoader key={index} />
          ))}
      </div>
    );
  } else if (leaderboard && leaderboard.length > 0) {
    content = (
      <div className="flex flex-col gap-5">
        <div className="hidden md:flex justify-between items-center text-sm md:text-base text-black font-semibold px-10">
          <div className="flex-1 flex gap-[10%]">
            <p>Rank</p>
            <p>Username</p>
          </div>
          <p>Amount</p>
        </div>

        {leaderboard.map((player) => (
          <PlayerCard player={{ ...player, activeTab }} key={player.userId} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="min-h-screen"
    >
      <p className=" text-lg md:text-xl">
        See who is topping the leaderboard charts
      </p>

      {/* Tabs */}
      <div className="w-full bg-primary-100 rounded-4xl p-1 my-5 sm:my-10 flex items-center ">
        {["lastGame", "allTime"].map((tab) => (
          <div
            key={tab}
            onClick={() => handleTabChange(tab as "lastGame" | "allTime")}
            className={`flex-1 flex justify-center items-center p-3 md:p-4 font-semibold cursor-pointer rounded-4xl duration-200 ${
              activeTab === tab ? "bg-primary-800 text-white" : "text-gray-500"
            }`}
          >
            <p>
              {tab === "lastGame" ? "Last Game" : "All Time"}{" "}
              <span className="md:inline hidden">Leaderboard</span>
            </p>
          </div>
        ))}
      </div>

      {!loading && (!leaderboard || leaderboard.length === 0) && (
        <div className="flex flex-col justify-center items-center">
          <div className="relative h-[10rem] md:h-[14rem] flex flex-col justify-end items-center">
            <CupIcon className="text-primary-500 fill-primary-300 h-[10rem] w-[5rem] md:w-[10rem] top-0 opacity-25 absolute" />
            <CupIcon className="text-primary-500 fill-primary-300 h-[10rem] w-[5rem] md:w-[10rem] top-0 opacity-5 absolute translate-y-2 translate-x-3" />
            <p className="font-semibold opacity-50">Leaderboard is empty</p>
          </div>
        </div>
      )}

      {content}

      {activeTab === "allTime" && leaderboard && leaderboard.length > 9 && (
        <CustomPagination
          currentPage={page}
          totalPages={leaderboardData?.totalPages ?? 1}
          totalEntries={leaderboardData?.total ?? 1}
          entriesPerPage={leaderboardData?.limit ?? 10}
          onPageChange={(value) => setPage(value)}
        />
      )}

      <div className="h-30" />
    </motion.div>
  );
}

export default Page;
