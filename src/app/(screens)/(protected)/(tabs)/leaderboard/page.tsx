"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import CustomPagination from "@/app/utils/CustomPagination";
import PlayerCard from "./PlayerCard";
import LeaderboardAPI from "@/app/api/leaderboardApi";
import { CupIcon } from "@/app/icons/icons";
import LeaderboardLoader from "./LeaderboardLoader";

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
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData | undefined
  >();
  const [page, setPage] = useState(1);
  const leaderboard: Leaderboard[] | undefined = leaderboardData?.leaderboard;
  console.log({ page });

  const getLeaderboard = async (tab: "lastGame" | "allTime") => {
    try {
      setLoading(true);
      const res =
        tab === "lastGame"
          ? await LeaderboardAPI.getLastGameLeaderboard()
              .then((res) => {
                setLeaderboardData({
                  leaderboard: res.data.result.gameLeaderboard.rankings.map(
                    (data: {
                      position: number;
                      prize: number;
                      user: {
                        avatar: string;
                        facebook: string;
                        firstName: string;
                        instagram: string;
                        lastName: string;
                        noOfGamesPlayed: number;
                        twitter: string;
                        userId: string;
                      };
                    }) => ({
                      position: data?.position,
                      prize: data?.prize,
                      ...data?.user,
                    })
                  ),
                });
              })
              .catch(() => setLeaderboardData(undefined))
          : await LeaderboardAPI.getAllTimeLeaderboard(page)
              .then((res) => {
                // setPage(res.data.currentPage ?? 1);
                setLeaderboardData(res.data.result);
              })
              .catch(() => setLeaderboardData(undefined));
      setLoading(false);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: "lastGame" | "allTime") => {
    setActiveTab(tab);
    getLeaderboard(tab);
  };

  useEffect(() => {
    getLeaderboard("lastGame");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab == "allTime") {
      getLeaderboard("allTime");
    }
  }, [page, activeTab]);

  let content: ReactNode;
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
  }
  if (!loading && leaderboard && leaderboard?.length > 0) {
    content = (
      <div className="flex flex-col gap-5">
        <div className="hidden md:flex justify-between items-center text-sm md:text-base text-black font-semibold px-10">
          <div className="flex-1 flex gap-[10%]">
            <p>Rank</p>
            <p>Username</p>
          </div>
          <p>Amount</p>
        </div>

        {leaderboard?.map((player) => (
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
      className=" min-h-screen"
    >
      <p className=" text-lg md:text-xl">
        See who is topping the leaderboard charts
      </p>

      <div className="w-full bg-primary-100 rounded-4xl p-1 my-5 sm:my-10 flex items-center ">
        <div
          onClick={() => handleTabChange("lastGame")}
          className={`flex-1 flex justify-center items-center p-3  md:p-4 font-semibold text-gray-500 cursor-pointer rounded-4xl sm:rounded-4xl duration-200 delay-100 ${
            activeTab === "lastGame" &&
            "bg-primary-800 font-semibold text-white"
          }`}
        >
          <p>
            Last Game <span className=" md:inline hidden">Leaderboard</span>
          </p>
        </div>
        <div
          onClick={() => handleTabChange("allTime")}
          className={`flex-1 flex justify-center items-center p-3 md:p-4 text-gray-500 cursor-pointer rounded-4xl sm:rounded-4xl duration-200 delay-100 ${
            activeTab === "allTime" && "bg-primary-800 font-semibold text-white"
          }`}
        >
          <p>
            All Time <span className=" md:inline hidden">Leaderboard</span>
          </p>
        </div>
      </div>

      {!loading && (leaderboard === undefined || leaderboard?.length <= 0) && (
        <div className=" flex flex-col justify-center items-center">
          <div className="relative h-[10rem] md:h-[14rem] flex flex-col justify-end items-center ">
            <CupIcon className=" text-primary-500 fill-primary-300 h-[10rem] w-[5rem] md:w-[10rem] top-0 opacity-25 absolute" />
            <CupIcon className=" text-primary-500 fill-primary-300 h-[10rem] w-[5rem] md:w-[10rem] top-0 opacity-5 absolute translate-y-2 translate-x-3" />
            <p className="  font-semibold opacity-50">Leaderboard is empty</p>
          </div>
        </div>
      )}

      {content}

      {activeTab == "allTime" && (
        <CustomPagination
          currentPage={page ?? 1}
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
