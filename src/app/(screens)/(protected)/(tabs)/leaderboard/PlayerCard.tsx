/* eslint-disable @typescript-eslint/no-explicit-any */
import QmDrawer from "@/app/components/drawer/drawer";
import { cleanValue } from "@/app/components/updateAccount/socialLinksDrawer";
import { FacebookIcon, InstagramIcon, XIcon } from "@/app/icons/icons";
import {
  AllTimeLeaderboardUser,
  LeaderboardRanking,
} from "@/app/store/leaderboardSlice";
import {
  formatNaira,
  formatRank,
  parseTimeStringToMilliseconds,
  readLeaderboardTotalTime,
} from "@/app/utils/utils";
import { Flex, Grid, Table } from "@radix-ui/themes";
import { AlarmClockIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export function removeAtSymbol(name: string): string {
  const cleaned = name.startsWith("@") ? name.slice(1) : name;
  return cleaned.replace(/%20|\s+/g, "");
}
interface PlayerCardProps {
  player: LeaderboardRanking | AllTimeLeaderboardUser;
  activeTab: "lastGame" | "allTime";
}

const PlayerCard = ({ player, activeTab }: PlayerCardProps) => {
  const [open, setOpen] = useState(false);

  const isLastGamePlayer = (player: any): player is LeaderboardRanking => {
    return "user" in player;
  };

  const lastGamePlayer = isLastGamePlayer(player) ? player : null;
  const allTimePlayer = !isLastGamePlayer(player) ? player : null;

  const facebook = isLastGamePlayer(player)
    ? cleanValue(lastGamePlayer?.user?.facebook || "")
    : cleanValue(allTimePlayer?.facebook || "");

  const instagram = isLastGamePlayer(player)
    ? cleanValue(lastGamePlayer?.user?.instagram || "")
    : cleanValue(allTimePlayer?.instagram || "");

  const twitter = isLastGamePlayer(player)
    ? cleanValue(lastGamePlayer?.user?.twitter || "")
    : cleanValue(allTimePlayer?.twitter || "");

  const hasAnySocial = facebook || instagram || twitter;
  return (
    <>
      <QmDrawer
        open={open}
        onOpenChange={setOpen}
        title="Player Stats"
        trigger={
          <Table.Row
            className={`cursor-pointer text-black  font-semibold !bg-white  !my-4 !overflow-hidden !rounded-full `}
            // onClick={() => setOpen(!open)}
            onClick={(e) => e.stopPropagation()}
            key={
              isLastGamePlayer(player)
                ? lastGamePlayer?.user?.userId
                : allTimePlayer?.userId
            }
          >
            <Table.Cell className="">
              <Flex
                direction="column"
                // align="center"
                justify="center"
                className="h-full md:pl-2"
              >
                <span>🏆 </span>
                <span className="font-bold text-primary-900">
                  {activeTab === "lastGame"
                    ? formatRank(lastGamePlayer?.position || 0)
                    : formatRank(allTimePlayer?.overallRank || 0)}
                </span>
              </Flex>
            </Table.Cell>

            <Table.Cell colSpan={2} className="">
              <div className="flex items-center justify-start gap-2 capitalize">
                <div className=" md:h-[50px] md:w-[50px] h-[40px] w-[40px] p-1 rounded-full bg-primary-50">
                  <Image
                    src={
                      isLastGamePlayer(player)
                        ? lastGamePlayer?.user?.avatar || ""
                        : allTimePlayer?.avatar || ""
                    }
                    alt={
                      isLastGamePlayer(player)
                        ? lastGamePlayer?.user?.firstName || ""
                        : allTimePlayer?.firstName || ""
                    }
                    width={50}
                    height={50}
                    className="rounded-full h-full w-full"
                  />
                </div>
                <span>
                  {isLastGamePlayer(player)
                    ? lastGamePlayer?.user?.firstName || ""
                    : allTimePlayer?.firstName || ""}
                </span>
              </div>
            </Table.Cell>

            {activeTab === "lastGame" && (
              <Table.Cell>
                <div className="flex items-center h-full justify-start">
                  <p className="flex md:h-10 md:w-10 w-6 h-6 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                    {lastGamePlayer?.totalCorrect}
                  </p>
                </div>
              </Table.Cell>
            )}
            {/* Timer Gamer  */}
            {activeTab === "lastGame" && (
              <Table.Cell>
                <div className="flex items-center h-full gap-1 text-nowrap">
                  <AlarmClockIcon className=" text-primary-800" size={14} />
                  {lastGamePlayer?.totalTime ? (
                    <p className="text-sm text-primary-800 font-semibold">
                      {readLeaderboardTotalTime(
                        parseTimeStringToMilliseconds(
                          lastGamePlayer?.totalTime
                            ? lastGamePlayer?.totalTime
                            : "00:00:00"
                        )
                      )}
                    </p>
                  ) : (
                    <p className="text-sm text-primary-800 font-semibold">
                      -s, -ms
                    </p>
                  )}
                </div>
              </Table.Cell>
            )}

            <Table.Cell className="">
              <div className="flex items-center h-full gap-1 text-nowrap">
                <p className="inline-block text-primary-800 h-fit bg-primary-100 rounded-md px-2 md:px-4 py-1 md:py-2 text-sm md:text-base">
                  {activeTab === "lastGame"
                    ? formatNaira(lastGamePlayer?.prize ?? 0, true)
                    : formatNaira(allTimePlayer?.amountWon ?? 0, true)}
                </p>
              </div>
            </Table.Cell>
          </Table.Row>
        }
      >
        {/* Drawer content */}
        <div
          className="grid place-items-center gap-3 max-w-lg mx-auto"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* <p className=" text-xl sm:text-2xl font-semibold">Users Stats</p> */}
          <div className="flex items-center justify-center bg-primary-100 h-[90px] w-[90px] rounded-full overflow-clip">
            <Image
              src={
                isLastGamePlayer(player)
                  ? lastGamePlayer?.user?.avatar || ""
                  : allTimePlayer?.avatar || ""
              }
              alt={
                isLastGamePlayer(player)
                  ? lastGamePlayer?.user?.firstName || ""
                  : allTimePlayer?.firstName || ""
              }
              width={70}
              height={70}
              className="rounded-full"
            />
          </div>
          <p className="text-center capitalize text-primary-700 text-xl sm:text-2xl font-semibold">
            {isLastGamePlayer(player)
              ? lastGamePlayer?.user?.firstName || ""
              : allTimePlayer?.firstName || ""}
          </p>

          <div className="flex flex-col gap-2 w-full md:w-[80%]">
            {/* <p className="text-sm font-semibold">Player Stats</p> */}
            <Grid columns="3" className="bg-primary-50 rounded-xl p-4 w-full">
              <Flex direction="column" align="center" justify="center">
                <p>Rank</p>
                <div className="flex h-10 w-10 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                  {activeTab == "allTime"
                    ? formatRank(allTimePlayer?.overallRank || 0)
                    : formatRank(lastGamePlayer?.position || 1)}
                </div>
              </Flex>
              <Flex direction="column" align="center" justify="center">
                <p>Games</p>
                <div className="flex h-10 w-10 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                  {isLastGamePlayer(player)
                    ? lastGamePlayer?.user?.noOfGamesPlayed
                    : allTimePlayer?.noOfGamesPlayed}
                </div>
              </Flex>
              <Flex direction="column" align="center" justify="center">
                <p>Prize</p>
                <div className="flex h-10 w-10 items-center justify-center font-semibold text-primary-800  p-2">
                  {activeTab === "lastGame"
                    ? formatNaira(Number(lastGamePlayer?.prize))
                    : formatNaira(Number(allTimePlayer?.amountWon))}
                </div>
              </Flex>
            </Grid>
          </div>

          {hasAnySocial && (
            <div
              className="grid place-items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-lg sm:text-xl font-semibold">Social Links</p>

              <div className="flex gap-2 text-primary-900">
                {facebook && (
                  <a
                    href={`https://facebook.com/${removeAtSymbol(facebook)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="h-[40px] w-[40px] rounded-full bg-primary-50 flex justify-center items-center">
                      <FacebookIcon />
                    </div>
                  </a>
                )}

                {instagram && (
                  <a
                    href={`https://instagram.com/${removeAtSymbol(instagram)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="h-[40px] w-[40px] rounded-full bg-primary-50 flex justify-center items-center">
                      <InstagramIcon />
                    </div>
                  </a>
                )}

                {twitter && (
                  <a
                    href={`https://x.com/${removeAtSymbol(twitter)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="h-[40px] w-[40px] rounded-full bg-primary-50 flex justify-center items-center">
                      <XIcon />
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </QmDrawer>

      {/*   */}
      {/* <div className="overflow-x-auto">
              <div
                onClick={() => setOpen(true)}
                className={`grid gap-2 w-full ${
                  player?.activeTab === "lastGame"
                    ? "md:grid-cols-4 grid-cols-6"
                    : "md:grid-cols-3 grid-cols-2"
                } place-items-start  cursor-pointer  text-sm md:text-base text-black font-semibold px-5 md:px-10 bg-white rounded-4xl p-3 md:p-5`}
              >
                <div className="">
                  <Flex direction="column" align="center">
                    <span>🏆 </span>
                    <span className="font-bold text-primary-900">
                      {player.activeTab === "lastGame"
                        ? formatRank(player?.position || 0)
                        : formatRank(player?.overallRank)}
                    </span>
                  </Flex>
                </div>

                <div className="flex col-span-2 items-center gap-2">
                  <div className=" md:h-[50px] md:w-[50px] h-[40px] w-[40px]">
                    <Image
                      src={player?.avatar || ""}
                      alt={player?.firstName || ""}
                      width={50}
                      height={50}
                      className="rounded-full h-full w-full"
                    />
                  </div>
                  <p className="capitalize md:text-base text-sm">
                    {player?.firstName}
                  </p>
                </div>

                <div
                  className={` items-center gap-[1px] md:gap-2 h-full w-full justify-end sm:justify-start  ${
                    player?.activeTab === "lastGame" ? "flex" : "hidden"
                  }`}
                >
                  <div className="flex md:h-10 md:w-10 w-6 h-6 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                    {player?.totalCorrect}
                  </div>{" "}
                  <div className="flex items-center gap-1 ">
                    <AlarmClockIcon className=" text-primary-800" size={14} />
                    <p className=" text-xs md:text-sm text-primary-800 font-semibold">
                      {readLeaderboardTotalTime(
                        parseTimeStringToMilliseconds(player?.totalTime ?? "")
                      )}
                    </p>
                  </div>
                </div>
                <div className=" flex w-full justify-end  h-full items-center">
                  <p className="text-primary-800 h-fit bg-primary-100 rounded-md px-2 md:px-4 py-1 md:py-2 text-xs sm:text-sm md:text-base">
                    {player?.activeTab === "lastGame"
                      ? formatNaira(player?.prize ?? 0, true)
                      : formatNaira(player?.amountWon, true)}
                  </p>
                </div>
              </div>
            </div> */}
      {/*   */}
    </>
  );
};

export default PlayerCard;
