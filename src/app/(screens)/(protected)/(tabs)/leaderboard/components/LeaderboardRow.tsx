import { useState } from "react";
import Image from "next/image";
import { Table } from "@radix-ui/themes";
import { LeaderboardEntry, LeaderboardType } from "../types";
import {
  formatNaira,
  formatRank,
  readTotalTimeLeaderboard,
} from "@/app/utils/utils";
import { AlarmClockIcon } from "lucide-react";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { setSelectedPlayer } from "@/app/store/leaderboardSlice";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  activeTab: LeaderboardType;
}

// const getRankMedal = (rank: number) => {
//   // Handle special cases for 11, 12, 13 which always use "th"
//   if (rank >= 11 && rank <= 13) {
//     return `${rank}th`;
//   }

//   const lastDigit = rank % 10;

//   switch (lastDigit) {
//     case 1:
//       return `${rank}st`;
//     case 2:
//       return `${rank}nd`;
//     case 3:
//       return `${rank}rd`;
//     default:
//       return `${rank}th`;
//   }
// };

export default function LeaderboardRow({
  entry,
  activeTab,
}: LeaderboardRowProps) {
  const { avatarUrl, firstName, rank, prizeWon = 0 } = entry;
  const [imageError, setImageError] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <Table.Row
      onClick={() => dispatch(setSelectedPlayer(entry))}
      className="w-full cursor-pointer"
      align="center"
    >
      <Table.Cell>
        <div className="flex flex-col justify-center">
          <div className="text-xl">🏆</div>
          <span className="text-primary-800 text-base font-semibold">
            {/* {getRankMedal(rank)} */}
            {formatRank(rank || 0)}
          </span>
        </div>
      </Table.Cell>

      <Table.Cell>
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative w-10 h-10">
            {!imageError && avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`${firstName}'s avatar`}
                fill
                className="rounded-full bg-[#E4F1FA] object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-full b flex items-center justify-center">
                <span className="text-[#2364AA] font-semibold text-lg capitalize">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          {/* Username */}
          <span className="capitalize text-base font-medium text-[#2364AA]">
            {firstName}
          </span>
        </div>
      </Table.Cell>
      {/* Score & Time  */}
      {activeTab === "lastGame" && (
        <Table.Cell colSpan={2}>
          <div className="flex items-center gap-2">
            {/* score  */}
            <p className="flex md:h-10 md:w-10 w-6 h-6 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
              {entry.score}
            </p>
            {/* Time  */}
            <div className="flex items-center h-full gap-1 text-nowrap">
              <AlarmClockIcon className=" text-primary-800" size={14} />
              {entry.totalAnswerTime ? (
                <span className="text-sm text-primary-800 font-semibold">
                  {readTotalTimeLeaderboard(Number(entry.totalAnswerTime))}
                </span>
              ) : (
                <span className="text-sm text-primary-800 font-semibold">
                  -s, -ms
                </span>
              )}
            </div>
          </div>
        </Table.Cell>
      )}

      <Table.Cell align="right">
        <span className=" bg-[#E4F1FA] py-1 px-3 rounded-md font-semibold text-[#2364AA]">
          {formatNaira(prizeWon, true)}
        </span>
      </Table.Cell>
    </Table.Row>
  );
}
