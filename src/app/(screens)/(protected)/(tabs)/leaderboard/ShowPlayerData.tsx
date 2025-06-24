/* eslint-disable @typescript-eslint/no-explicit-any */
import QmDrawer from "@/app/components/drawer/drawer";
import { cleanValue } from "@/app/components/updateAccount/socialLinksDrawer";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { FacebookIcon, InstagramIcon, XIcon } from "@/app/icons/icons";
import {
  LeaderboardRanking,
  setSelectedPlayer,
} from "@/app/store/leaderboardSlice";
import { formatNaira, formatRank } from "@/app/utils/utils";
import { Flex, Grid } from "@radix-ui/themes";
import Image from "next/image";
import React from "react";
import { removeAtSymbol } from "./PlayerCard";

function ShowPlayerData() {
  const dispatch = useAppDispatch();
  const { selectedPlayer } = useAppSelector((state) => state.leaderboard);

  if (!selectedPlayer?.data) return null;
  const isLastGamePlayer = (player: any): player is LeaderboardRanking => {
    return player && typeof player === "object" && "user" in player;
  };

  const lastGamePlayer = isLastGamePlayer(selectedPlayer?.data)
    ? selectedPlayer?.data
    : null;
  const allTimePlayer = !isLastGamePlayer(selectedPlayer?.data)
    ? selectedPlayer?.data
    : null;

  const facebook = isLastGamePlayer(selectedPlayer?.data)
    ? cleanValue(lastGamePlayer?.user?.facebook || "")
    : cleanValue(allTimePlayer?.facebook || "");

  const instagram = isLastGamePlayer(selectedPlayer?.data)
    ? cleanValue(lastGamePlayer?.user?.instagram || "")
    : cleanValue(allTimePlayer?.instagram || "");

  const twitter = isLastGamePlayer(selectedPlayer?.data)
    ? cleanValue(lastGamePlayer?.user?.twitter || "")
    : cleanValue(allTimePlayer?.twitter || "");

  const hasAnySocial = facebook || instagram || twitter;
  return (
    <QmDrawer
      open={selectedPlayer?.showSelected || false}
      onOpenChange={(open) => {
        dispatch(
          setSelectedPlayer({
            data: selectedPlayer.data,
            showSelected: open,
            activeTab: selectedPlayer.activeTab,
          })
        );
      }}
      title="Player Stats"
    >
      <div
        className="grid place-items-center gap-3 max-w-lg mx-auto"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-center bg-primary-100 h-[90px] w-[90px] rounded-full overflow-clip">
          <Image
            src={
              isLastGamePlayer(selectedPlayer?.data)
                ? lastGamePlayer?.user?.avatar || ""
                : allTimePlayer?.avatar || ""
            }
            alt={
              isLastGamePlayer(selectedPlayer?.data)
                ? lastGamePlayer?.user?.firstName || ""
                : allTimePlayer?.firstName || ""
            }
            width={70}
            height={70}
            className="rounded-full"
          />
        </div>
        <p className="text-center capitalize text-primary-700 text-xl sm:text-2xl font-semibold">
          {isLastGamePlayer(selectedPlayer?.data)
            ? lastGamePlayer?.user?.firstName || ""
            : allTimePlayer?.firstName || ""}
        </p>

        <div className="flex flex-col gap-2 w-full md:w-[80%]">
          <Grid columns="3" className="bg-primary-50 rounded-xl p-4 w-full">
            <Flex direction="column" align="center" justify="center">
              <p>Rank</p>
              <div className="flex h-10 w-10 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                {selectedPlayer?.activeTab == "allTime"
                  ? formatRank(allTimePlayer?.overallRank || 0)
                  : formatRank(lastGamePlayer?.position || 1)}
              </div>
            </Flex>
            <Flex direction="column" align="center" justify="center">
              <p>Games</p>
              <div className="flex h-10 w-10 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                {isLastGamePlayer(selectedPlayer?.data)
                  ? lastGamePlayer?.user?.noOfGamesPlayed
                  : allTimePlayer?.noOfGamesPlayed}
              </div>
            </Flex>
            <Flex direction="column" align="center" justify="center">
              <p>Prize</p>
              <div className="flex h-10 w-10 items-center justify-center font-semibold text-primary-800  p-2">
                {selectedPlayer?.activeTab === "lastGame"
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
  );
}

export default ShowPlayerData;
