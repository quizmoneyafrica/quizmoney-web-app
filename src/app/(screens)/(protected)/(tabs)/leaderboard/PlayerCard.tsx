/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch } from "@/app/hooks/useAuth";
import { QMCoin } from "@/app/icons/icons";
import {
  AllTimeLeaderboardUser,
  LeaderboardRanking,
  setSelectedPlayer,
} from "@/app/store/leaderboardSlice";
import {
  formatNaira,
  formatRank,
  parseTimeStringToMilliseconds,
  readLeaderboardTotalTime,
} from "@/app/utils/utils";
import { Flex, Table } from "@radix-ui/themes";
import { AlarmClockIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

export function removeAtSymbol(name: string): string {
  const cleaned = name.startsWith("@") ? name.slice(1) : name;
  return cleaned.replace(/%20|\s+/g, "");
}
interface PlayerCardProps {
  player: LeaderboardRanking | AllTimeLeaderboardUser;
  activeTab: "lastGame" | "allTime";
}

const PlayerCard = ({ player, activeTab }: PlayerCardProps) => {
  // const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const isLastGamePlayer = (player: any): player is LeaderboardRanking => {
    return "user" in player;
  };

  const lastGamePlayer = isLastGamePlayer(player) ? player : null;
  const allTimePlayer = !isLastGamePlayer(player) ? player : null;

  console.log("lastGamePlayer", lastGamePlayer);

  return (
    <>
      <Table.Row
        className={`cursor-pointer text-black  font-semibold !bg-white  !my-4 !overflow-hidden !rounded-full `}
        // onClick={() => setOpen(!open)}
        onClick={() =>
          dispatch(
            setSelectedPlayer({ data: player, showSelected: true, activeTab })
          )
        }
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
                : allTimePlayer?.firstName || ""}{" "}
              {/* <span>{user?.kycVerified && <VerifiedBadge />}</span> */}
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
            <p
              className={`inline-block text-primary-800 h-fit ${
                lastGamePlayer && lastGamePlayer?.coins > 0
                  ? "bg-primary-50"
                  : "bg-primary-100"
              } rounded-md px-2 md:px-4 py-1 md:py-2 text-sm md:text-base`}
            >
              {activeTab === "lastGame" ? (
                <>
                  {lastGamePlayer && lastGamePlayer?.coins > 0 ? (
                    <span className="flex items-center gap-2 text-positive-900 justify-center">
                      <QMCoin width={20} height={20} />+{lastGamePlayer?.coins}
                    </span>
                  ) : (
                    formatNaira(lastGamePlayer?.prize ?? 0, true)
                  )}{" "}
                </>
              ) : (
                formatNaira(allTimePlayer?.amountWon ?? 0, true)
              )}
            </p>
          </div>
        </Table.Cell>
      </Table.Row>
    </>
  );
};

export default PlayerCard;
