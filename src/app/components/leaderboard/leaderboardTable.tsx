"use client";
import React, { useMemo, useState } from "react";
import { Table, Flex } from "@radix-ui/themes";
import { formatNaira, formatRank } from "@/app/utils/utils";

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

type Props = {
  data: Leaderboard[];
  title?: string;
  showScoreTime?: boolean;
  pageSize?: number;
};

const LeaderboardTable: React.FC<Props> = ({
  data,
  title = "Leaderboard",
  showScoreTime = true,
  pageSize = 50,
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [page, data, pageSize]);

  return (
    <Flex direction="column" gap="4">
      <h2 className="text-xl font-bold">{title}</h2>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Rank</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
            {showScoreTime && (
              <>
                <Table.ColumnHeaderCell>Correct</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
              </>
            )}
            <Table.ColumnHeaderCell>Prize</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {paginatedData.map((player) => (
            <Table.Row key={player.userId}>
              <Table.RowHeaderCell>
                {formatRank(player.position)}
              </Table.RowHeaderCell>
              <Table.Cell>{player.firstName}</Table.Cell>
              {showScoreTime && (
                <>
                  <Table.Cell>{player.totalCorrect}</Table.Cell>
                  <Table.Cell>
                    {/* {formatTimeToMinutesAndSeconds(player.totalTime)} */}
                    {player.totalTime}
                  </Table.Cell>
                </>
              )}
              <Table.Cell>{formatNaira(player.prize, true)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {totalPages > 1 && (
        <Flex justify="center" gap="2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 border rounded"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-2 py-1 border rounded ${
                page === i + 1 ? "bg-primary-800 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2 py-1 border rounded"
          >
            Next
          </button>
        </Flex>
      )}
    </Flex>
  );
};

export default LeaderboardTable;
