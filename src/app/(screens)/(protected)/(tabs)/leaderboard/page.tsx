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
  AllTimeLeaderboardData,
  LeaderboardPlayer,
  setAllTimeLeaderboard,
  setLastGameLeaderboard,
} from "@/app/store/leaderboardSlice";
import { useDispatch } from "react-redux";

import { Flex, Table } from "@radix-ui/themes";
import LastGameResultCard from "./components/LastGameResultCard";
import AdBanner from "@/app/components/advert/adBanner";
import ShowPlayerData from "./ShowPlayerData";
import { getAuthUser } from "@/app/api/userApi";

function Page() {
  const [activeTab, setActiveTab] = useState<"lastGame" | "allTime">(
    "lastGame"
  );
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const { lastGame, allTime } = useAppSelector((state) => state.leaderboard);
  const user = getAuthUser();
  console.log("THIS USER DATA:", user);

  const isAllTimeLeaderboardData = (
    data: typeof leaderboardData
  ): data is AllTimeLeaderboardData => {
    return (
      typeof data === "object" &&
      data !== null &&
      "total" in data &&
      "limit" in data
    );
  };

  const leaderboard =
    activeTab === "lastGame" ? lastGame?.rankings : allTime[page]?.leaderboard;
  const leaderboardData = activeTab === "lastGame" ? lastGame : allTime[page];

  const userLastGameStats = lastGame?.userLastGameStats;
  console.log("LAST GAME DATA:", lastGame);
  console.log("LAST GAME LEADERBOARD:", leaderboard);

  const getLeaderboard = useCallback(
    async (tab: "lastGame" | "allTime") => {
      setLoading(true);

      try {
        if (tab === "lastGame") {
          if (!lastGame) {
            const res = await LeaderboardAPI.getLastGameLeaderboard(dispatch);
            console.log("LEADERBOARD USER", res);
            dispatch(
              setLastGameLeaderboard({
                createdAt: res.createdAt,
                gameId: res.gameId,
                msg: res.msg,
                objectId: res.objectId,
                rankings: res.rankings,
                updatedAt: res.updatedAt,
                userLastGameStats: res.userLastGameStats,
                users: res.users,
              })
            );
          }
        } else {
          if (!allTime[page]) {
            const res = await LeaderboardAPI.getAllTimeLeaderboard(
              dispatch,
              page
            );
            console.log("ALL TIME LEADERBOARD USERS", res);
            dispatch(
              setAllTimeLeaderboard({
                page,
                data: {
                  currentPage: res.currentPage,
                  leaderboard: res.leaderboard,
                  limit: res.limit,
                  total: res.total,
                  totalPages: res.totalPages,
                },
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
  }, [lastGame]);

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
        <Flex direction="column" gap="4">
          <Table.Root variant="ghost">
            <Table.Header className="!border-none ">
              <Table.Row className="rounded-xl bg-primary-50">
                <Table.ColumnHeaderCell className="rounded-ss-xl">
                  Rank
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell colSpan={2}>
                  Player
                </Table.ColumnHeaderCell>

                {activeTab === "lastGame" && (
                  <Table.ColumnHeaderCell>Score</Table.ColumnHeaderCell>
                )}
                {activeTab === "lastGame" && (
                  <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
                )}

                <Table.ColumnHeaderCell className="rounded-se-xl">
                  Prize
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body className="!border-none !bg-transparent">
              {leaderboard.map((player: LeaderboardPlayer, index) => (
                <PlayerCard
                  // player={{ ...player, activeTab }}
                  player={player}
                  activeTab={activeTab}
                  key={index}
                />
              ))}
            </Table.Body>
          </Table.Root>
        </Flex>

        {/* {leaderboard.map((player) => (
          <PlayerCard player={{ ...player, activeTab }} key={player.userId} />
        ))} */}
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
      {/* <p className=" text-lg md:text-xl">
        See who is topping the leaderboard charts
      </p> */}
      <AdBanner />

      {/* Tabs */}
      <div className="w-full bg-primary-100 rounded-4xl  my-5 sm:my-10 flex items-center ">
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

      {activeTab === "lastGame" && userLastGameStats && (
        <div className=" my-5 w-full">
          <LastGameResultCard userLastGameStats={userLastGameStats} />
        </div>
      )}

      {content}

      {activeTab === "allTime" &&
        leaderboard &&
        isAllTimeLeaderboardData(leaderboardData) && (
          <CustomPagination
            currentPage={page}
            totalPages={Math.ceil(
              leaderboardData?.total / leaderboardData?.limit
            )}
            totalEntries={leaderboardData.total}
            entriesPerPage={leaderboardData.limit}
            onPageChange={(value) => setPage(value)}
          />
        )}

      <div className="h-30" />

      <ShowPlayerData />
    </motion.div>
  );
}

export default Page;
