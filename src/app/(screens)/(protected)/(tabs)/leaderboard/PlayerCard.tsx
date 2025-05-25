import QmDrawer from "@/app/components/drawer/drawer";
import { formatNaira, formatRank } from "@/app/utils/utils";
import { Flex, Grid } from "@radix-ui/themes";
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
          <div
            onClick={() => setOpen(true)}
            className="flex cursor-pointer justify-between items-center text-sm md:text-base text-black font-semibold px-5 md:px-10 bg-white rounded-4xl p-3 md:p-5"
          >
            {/* Player Card */}
            <div className="flex-1 flex gap-[10%] items-center">
              <div className="">
                {/* <p className="text-3xl md:text-5xl">
                  {rank[
                    player.activeTab === "lastGame"
                      ? (player?.position as keyof typeof rank)
                      : (player?.overallRank as keyof typeof rank)
                  ] ?? "🎖️"}
                </p> */}
                <Flex direction="column" align="center">
                  <span>🏆 </span>
                  <span className="font-bold text-primary-900">
                    {player.activeTab === "lastGame"
                      ? formatRank(player?.position || 0)
                      : formatRank(player?.overallRank)}
                  </span>
                </Flex>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src={player?.avatar || ""}
                  alt={player?.firstName || ""}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <p className="capitalize">{player?.firstName}</p>
              </div>
            </div>
            <p className="text-primary-800 bg-primary-100 rounded-4xl px-2 md:px-4 py-1 md:py-2 text-sm md:text-base">
              ₦
              {player?.activeTab === "lastGame"
                ? player?.prize?.toLocaleString()
                : player?.amountWon?.toLocaleString()}
            </p>
          </div>
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
      {/* <div
        onClick={() => setOpen(true)}
        key={player.userId}
        className="flex justify-between items-center text-sm md:text-base text-black font-semibold px-5 md:px-10 bg-white rounded-4xl p-3 md:p-5"
      >
        <div className="flex-1 flex gap-[10%] items-center">
          <div className="">
            <p className="text-3xl md:text-5xl">
              {rank[
                player.activeTab === "lastGame"
                  ? (player?.position as keyof typeof rank)
                  : (player?.overallRank as keyof typeof rank)
              ] ?? "🎖️"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={player?.avatar || ""}
              alt={player?.firstName || ""}
              width={50}
              height={50}
              className="rounded-full"
            />
            <p className="capitalize">{player?.firstName}</p>
          </div>
        </div>
        <p className="text-primary-800 bg-primary-100 rounded-4xl px-2 md:px-4 py-1 md:py-2 text-sm md:text-base">
          ₦
          {player?.activeTab === "lastGame"
            ? player?.prize?.toLocaleString()
            : player?.amountWon?.toLocaleString()}
        </p>

        <Modal open={open} onOpenChange={setOpen}>
          <div className="flex flex-col justify-center h-full items-center gap-2 my-5 space-y-3">
            <p className=" text-xl sm:text-2xl font-semibold">Users Stats</p>
            <div className=" bg-primary-100 rounded-full p-2">
              <Image
                src={player?.avatar || ""}
                alt={player?.firstName || ""}
                width={50}
                height={50}
                className="rounded-full"
              />
            </div>
            <p className=" text-primary-700 text-xl sm:text-2xl font-semibold">
              {player?.firstName}
            </p>

            <div className="flex flex-col gap-2 w-full md:w-[80%]">
              <p className=" font-semibold">Player Stats</p>
              <div className=" flex justify-evenly bg-primary-50 rounded-xl p-4 w-full">
                <div>
                  <p>Rank</p>
                  <div className="flex h-10 w-10 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                    {player.activeTab == "allTime"
                      ? player?.overallRank
                      : player?.position}
                  </div>
                </div>
                <div>
                  <p>Games</p>
                  <div className="flex h-10 w-10 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                    {player?.noOfGamesPlayed}
                  </div>
                </div>
                <div>
                  <p>Prize</p>
                  <div className="flex h-10 w-10 items-center justify-center font-semibold text-primary-800  p-2">
                    ₦
                    {player?.activeTab === "lastGame"
                      ? player?.prize?.toLocaleString()
                      : player?.amountWon?.toLocaleString()}{" "}
                  </div>
                </div>
              </div>
            </div>

            <p className=" text-lg sm:text-xl font-semibold">Social Links</p>
            <div className="flex gap-2">
              {player?.facebook && (
                <div className="h-[30px] w-[30px] rounded-full bg-primary-50 flex justify-center items-center">
                  <FacebookIcon />
                </div>
              )}
              {player?.instagram && (
                <div className="h-[30px] w-[30px] rounded-full bg-primary-50 flex justify-center items-center">
                  <InstagramLogoIcon />
                </div>
              )}
              {player?.twitter && (
                <div className="h-[30px] w-[30px] rounded-full bg-primary-50 flex justify-center items-center">
                  <TwitterLogoIcon />
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div> */}
    </>
  );
};

export default PlayerCard;
