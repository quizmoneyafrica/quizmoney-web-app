import QmDrawer from "@/app/components/drawer/drawer";
import {
  formatNaira,
  formatRank,
  parseTimeStringToMilliseconds,
  readLeaderboardTotalTime,
} from "@/app/utils/utils";
import { Flex, Grid, Table } from "@radix-ui/themes";
import { AlarmClockIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

// const rank = {
//   1: "🥇",
//   2: "🥈",
//   3: "🥉",
// };

interface PlayerCardProps {
  player: {
    prize?: number;
    position?: number;
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
    totalTime: string;
    totalCorrect: number;
    activeTab: "lastGame" | "allTime";
  };
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <QmDrawer
        open={open}
        onOpenChange={setOpen}
        title="Player Stats"
        trigger={
          <Table.Row
            className={`cursor-pointer text-black  font-semibold !bg-white  !my-4 !overflow-hidden !rounded-full `}
            onClick={() => setOpen(true)}
            key={player.userId}
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
                  {player.activeTab === "lastGame"
                    ? formatRank(player?.position || 0)
                    : formatRank(player?.overallRank)}
                </span>
              </Flex>
            </Table.Cell>

            <Table.Cell colSpan={2} className="">
              <div className="flex items-center justify-start gap-2 capitalize">
                <div className=" md:h-[50px] md:w-[50px] h-[40px] w-[40px] p-1 rounded-full bg-primary-50">
                  <Image
                    src={player?.avatar || ""}
                    alt={player?.firstName || ""}
                    width={50}
                    height={50}
                    className="rounded-full h-full w-full"
                  />
                </div>
                <span>{player.firstName}</span>
              </div>
            </Table.Cell>

            {player.activeTab === "lastGame" && (
              <Table.Cell>
                <div className="flex items-center h-full justify-start">
                  <p className="flex md:h-10 md:w-10 w-6 h-6 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                    {player?.totalCorrect}
                  </p>
                </div>
              </Table.Cell>
            )}

            {player.activeTab === "lastGame" && (
              <Table.Cell>
                <div className="flex items-center h-full gap-1 text-nowrap">
                  <AlarmClockIcon className=" text-primary-800" size={14} />
                  <p className="text-sm text-primary-800 font-semibold">
                    {readLeaderboardTotalTime(
                      parseTimeStringToMilliseconds(player?.totalTime ?? "")
                    )}
                  </p>
                </div>
              </Table.Cell>
            )}

            <Table.Cell className="">
              <div className="flex items-center h-full gap-1 text-nowrap">
                <p className="inline-block text-primary-800 h-fit bg-primary-100 rounded-md px-2 md:px-4 py-1 md:py-2 text-sm md:text-base">
                  {player?.activeTab === "lastGame"
                    ? formatNaira(player?.prize ?? 0, true)
                    : formatNaira(player?.amountWon, true)}
                </p>
              </div>
            </Table.Cell>
          </Table.Row>
        }
      >
        {/* Drawer content */}
        <div className="grid place-items-center gap-3 max-w-lg mx-auto">
          {/* <p className=" text-xl sm:text-2xl font-semibold">Users Stats</p> */}
          <div className="flex items-center justify-center bg-primary-100 h-[90px] w-[90px] rounded-full overflow-clip">
            <Image
              src={player?.avatar || ""}
              alt={player?.firstName || ""}
              width={70}
              height={70}
              className="rounded-full"
            />
          </div>
          <p className="text-center capitalize text-primary-700 text-xl sm:text-2xl font-semibold">
            {player?.firstName}
          </p>

          <div className="flex flex-col gap-2 w-full md:w-[80%]">
            {/* <p className="text-sm font-semibold">Player Stats</p> */}
            <Grid columns="3" className="bg-primary-50 rounded-xl p-4 w-full">
              <Flex direction="column" align="center" justify="center">
                <p>Rank</p>
                <div className="flex h-10 w-10 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                  {player.activeTab == "allTime"
                    ? formatRank(player?.overallRank)
                    : formatRank(player?.position || 1)}
                </div>
              </Flex>
              <Flex direction="column" align="center" justify="center">
                <p>Games</p>
                <div className="flex h-10 w-10 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                  {player?.noOfGamesPlayed}
                </div>
              </Flex>
              <Flex direction="column" align="center" justify="center">
                <p>Prize</p>
                <div className="flex h-10 w-10 items-center justify-center font-semibold text-primary-800  p-2">
                  {player?.activeTab === "lastGame"
                    ? formatNaira(Number(player?.prize))
                    : formatNaira(Number(player?.amountWon))}
                </div>
              </Flex>
            </Grid>
          </div>

          <div className="grid place-items-center gap-3 items-center">
            {(player?.facebook || player?.instagram || player?.twitter) && (
              <p className="text-lg sm:text-xl font-semibold">Social Links</p>
            )}
            <div className="flex gap-2 text-primary-900">
              {player?.facebook && (
                <Link
                  href={`https://facebook.com/${player?.facebook}`}
                  target="_blank"
                >
                  <div className="h-[40px] w-[40px]  rounded-full bg-primary-50 flex justify-center items-center">
                    {/* <FacebookIcon /> */}
                    <i className="bi bi-facebook text-lg"></i>
                  </div>
                </Link>
              )}
              {player?.instagram && (
                <Link
                  href={`https://instagram.com/${player?.instagram}`}
                  target="_blank"
                >
                  <div className="h-[40px] w-[40px] rounded-full bg-primary-50 flex justify-center items-center">
                    {/* <InstagramLogoIcon /> */}
                    <i className="bi bi-instagram text-lg"></i>
                  </div>
                </Link>
              )}
              {player?.twitter && (
                <Link href={`https://x.com/${player?.twitter}`} target="_blank">
                  <div className="h-[40px] w-[40px] rounded-full bg-primary-50 flex justify-center items-center">
                    {/* <TwitterLogoIcon /> */}
                    <i className="bi bi-twitter text-lg"></i>
                  </div>
                </Link>
              )}
            </div>
          </div>
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
