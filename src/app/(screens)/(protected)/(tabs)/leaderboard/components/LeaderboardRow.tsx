import { useState } from "react";
import Image from "next/image";
import { Table } from "@radix-ui/themes";
import { LeaderboardEntry } from "../types";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

const getRankMedal = (rank: number) => {
  // Handle special cases for 11, 12, 13 which always use "th"
  if (rank >= 11 && rank <= 13) {
    return `${rank}th`;
  }

  const lastDigit = rank % 10;

  switch (lastDigit) {
    case 1:
      return `${rank}st`;
    case 2:
      return `${rank}nd`;
    case 3:
      return `${rank}rd`;
    default:
      return `${rank}th`;
  }
};

export default function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const { avatarUrl, firstName, rank, prizeWon = 0 } = entry;
  const [imageError, setImageError] = useState(false);

  return (
    <Table.Row className=" w-full">
      <Table.Cell>
        <div className="flex flex-col justify-center">
          <div className=" text-3xl">🏆</div>
          <span className="text-primary-800 text-base font-semibold">
            {getRankMedal(rank)}
          </span>
        </div>
      </Table.Cell>

      <Table.Cell>
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative w-14 h-14">
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
                <span className="text-[#2364AA] font-semibold text-lg">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          {/* Username */}
          <span className="text-base font-medium text-[#2364AA]">
            {firstName}
          </span>
        </div>
      </Table.Cell>

      <Table.Cell align="right">
        <span className=" bg-[#E4F1FA] py-1 px-3 rounded-md font-semibold text-[#2364AA]">
          {/* ₦{amount.toLocaleString()} */}₦ {prizeWon}
        </span>
      </Table.Cell>
    </Table.Row>
  );
}
