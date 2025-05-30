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
import { AlarmClockIcon } from "lucide-react";
import {
  formatNaira,
  formatRank,
  parseTimeStringToMilliseconds,
  readLeaderboardTotalTime,
} from "@/app/utils/utils";
import { Flex, Table } from "@radix-ui/themes";
import Image from "next/image";
import { User } from "@/app/api/interface";
import { decryptData } from "@/app/utils/crypto";

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
  totalCorrect: number;
  totalTime: string;
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
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user: User | null = encrypted ? decryptData(encrypted) : null;

  const dispatch = useDispatch();
  const { lastGame, allTime } = useAppSelector((state) => state.leaderboard);

  const leaderboard =
    activeTab === "lastGame"
      ? lastGame?.leaderboard
      : allTime[page]?.leaderboard;
  const leaderboardData = activeTab === "lastGame" ? lastGame : allTime[page];

  const userCurrentResult = leaderboard?.find(
    (item) => item?.userId === user?.objectId
  );

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
              totalCorrect: data?.totalCorrect,
              totalTime: data?.totalTime,
              ...data.user,
            }));
            console.log({ rankings });
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
              {leaderboard.map((player) => (
                <PlayerCard
                  player={{ ...player, activeTab }}
                  key={player.userId}
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
      <p className=" text-lg md:text-xl">
        See who is topping the leaderboard charts
      </p>

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

      {/* My last Game  */}
      {activeTab === "lastGame" && !loading && userCurrentResult && (
        <Flex direction="column" gap="4" mb="6">
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

            {/* Body  */}
            <Table.Body className="!border-none !bg-transparent">
              <Table.Row
                className={`cursor-pointer text-black  font-semibold !bg-white  !my-4 !overflow-hidden !rounded-full `}
                // onClick={() => setOpen(true)}
              >
                <Table.Cell>
                  <Flex
                    direction="column"
                    justify="center"
                    className="h-full md:pl-2"
                  >
                    <span>🏆 </span>
                    <span className="font-bold text-primary-900">
                      {formatRank(userCurrentResult?.position || 0)}
                    </span>
                  </Flex>
                </Table.Cell>

                <Table.Cell colSpan={2} className="">
                  <div className="flex items-center justify-start gap-2 capitalize">
                    <div className=" md:h-[50px] md:w-[50px] h-[40px] w-[40px] p-1 rounded-full bg-primary-50">
                      <Image
                        src={userCurrentResult?.avatar || ""}
                        alt={userCurrentResult?.firstName || ""}
                        width={50}
                        height={50}
                        className="rounded-full h-full w-full"
                      />
                    </div>
                    <span>{userCurrentResult?.firstName || null}</span>
                  </div>
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center h-full justify-start">
                    <p className="flex md:h-10 md:w-10 w-6 h-6 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                      {userCurrentResult?.totalCorrect}
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center h-full gap-1 text-nowrap">
                    <AlarmClockIcon className=" text-primary-800" size={14} />
                    <p className="text-sm text-primary-800 font-semibold">
                      {readLeaderboardTotalTime(
                        parseTimeStringToMilliseconds(
                          userCurrentResult?.totalTime ?? ""
                        )
                      )}
                    </p>
                  </div>
                </Table.Cell>

                <Table.Cell className="">
                  <div className="flex items-center h-full gap-1 text-nowrap">
                    <p className="inline-block text-primary-800 h-fit bg-primary-100 rounded-md px-2 md:px-4 py-1 md:py-2 text-sm md:text-base">
                      {formatNaira(userCurrentResult?.prize ?? 0, true)}
                    </p>
                  </div>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Flex>
      )}
      {/* {!loading && !!userCurrentResult && activeTab === "lastGame" && (
        <div className=" mb-5">
          <p className=" text-sm font-bold pl-2 mb-2 md:text-start text-center">
            My Last Game Result
          </p>
          <div
            className={`grid gap-2 md:grid-cols-4 grid-cols-3 place-items-start  cursor-pointer  text-sm md:text-base text-black font-semibold px-5 md:px-10 bg-white rounded-4xl p-3 md:p-5`}
          >
            <div className=" flex md:col-span-2  w-full gap-[10%] items-center">
              <div className="">
                <Flex direction="column" align="center">
                  <span>🏆 </span>
                  <span className="font-bold text-primary-900">
                    {formatRank(userCurrentResult?.position || 0)}
                  </span>
                </Flex>
              </div>
              <div className="flex items-center gap-2">
                <div className=" md:h-[50px] md:w-[50px] h-[40px] w-[40px]">
                  <Image
                    src={userCurrentResult?.avatar || ""}
                    alt={userCurrentResult?.firstName || ""}
                    width={50}
                    height={50}
                    className="rounded-full h-full w-full"
                  />
                </div>
                <p className="capitalize">@{userCurrentResult?.firstName}</p>
              </div>
            </div>
            <div
              className={` items-center gap-1 md:gap-2 h-full w-full justify-end md:justify-start ${
                activeTab === "lastGame" ? "flex" : "hidden"
              }`}
            >
              <div className="flex md:h-10 md:w-10 w-8 h-8 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                {userCurrentResult?.totalCorrect}
              </div>{" "}
              <div className="flex items-center gap-1 ">
                <AlarmClockIcon className=" text-primary-800" size={14} />
                <p className=" text-xs md:text-sm text-primary-800 font-semibold">
                  {formatTimeToMinutesAndSeconds(
                    userCurrentResult?.totalTime ?? ""
                  )}
                </p>
              </div>
            </div>
            <div className=" flex w-full justify-end  h-full items-center">
              <p className="text-primary-800 h-fit bg-primary-100 rounded-md px-2 md:px-4 py-1 md:py-2 text-sm md:text-base">
                {formatNaira(userCurrentResult?.prize ?? 0, true)}
              </p>
            </div>
          </div>
        </div>
      )} */}

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
