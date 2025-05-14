"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import CustomPagination from "@/app/utils/CustomPagination";
import PlayerCard from "./PlayerCard";
import { mockPlayers } from "./mockPlayers";

function Page() {
  const [activeTab, setActiveTab] = useState<"lastGame" | "allTime">(
    "lastGame"
  );

  //   const getLeaderboard = async (tab: "lastGame" | "allTime") => {
  //     try {
  //       const res =
  //         tab === "lastGame"
  //           ? await LeaderboardAPI.getLastGameLeaderboard()
  //           : await LeaderboardAPI.getAllTimeLeaderboard();
  //       console.log(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const handleTabChange = (tab: "lastGame" | "allTime") => {
    setActiveTab(tab);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
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

      <div className="flex flex-col gap-5">
        <div className="hidden md:flex justify-between items-center text-sm md:text-base text-black font-semibold px-10">
          <div className="flex-1 flex gap-[10%]">
            <p>Rank</p>
            <p>Username</p>
          </div>
          <p>Amount</p>
        </div>

        {mockPlayers.map((player) => (
          <PlayerCard player={{ ...player, activeTab }} key={player._id} />
        ))}
      </div>

      <CustomPagination
        currentPage={2}
        totalPages={10}
        totalEntries={100}
        entriesPerPage={10}
        onPageChange={() => {}}
      />
      <div className="h-30" />
    </motion.div>
  );
}

export default Page;
