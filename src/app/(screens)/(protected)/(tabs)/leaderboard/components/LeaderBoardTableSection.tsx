"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Skeleton } from "@radix-ui/themes";
import { LeaderboardEntry, LeaderboardType } from "../types";
import LeaderboardTabs from "./LeaderboardTabs";
import LeaderboardRow from "./LeaderboardRow";
import LeaderboardPagination from "./LeaderboardPagination";
import { redirect } from "next/navigation";
import LeaderboardAPI from "@/app/api/leaderboardApi";
import {
  setAllTimeLeaderboard,
  setLastGameLeaderboard,
} from "@/app/store/leaderboardSlice";
import { RootState, store } from "@/app/store/store";
import { useSelector } from "react-redux";

export default function LeaderBoardTableSection() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("lastGame");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const entriesPerPage = 10;

  const { lastGame, allTime, pagination } = useSelector(
    (state: RootState) => state.leaderboard
  );

  // Fixed: Use arrays directly as dependencies, not .length
  const leaderboardData = useMemo(() => {
    if (activeTab === "lastGame") {
      return lastGame || [];
    } else if (activeTab === "allTime") {
      return allTime || [];
    }
    return [];
  }, [activeTab, lastGame, allTime]);

  const currentPagination = pagination[activeTab];
  const totalEntries = currentPagination?.totalElements || 0;
  const totalPages = currentPagination?.totalPages || 0;

  const handleTabChange = (tab: LeaderboardType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    getLeaderboard(tab, 0);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      getLeaderboard(activeTab, page - 1);
    }
  };

  const getLeaderboard = useCallback(
    async (tab: "lastGame" | "allTime", page: number = 0) => {
      setLoading(true);

      try {
        if (tab === "lastGame") {
          const response = await LeaderboardAPI.getLastGameLeaderboard(
            page,
            entriesPerPage
          );

          const responseData = response?.data || response;

          console.log("Last Game Response:", responseData);

          store.dispatch(setLastGameLeaderboard(responseData));
        } else {
          // Fetch all-time leaderboard
          const response = await LeaderboardAPI.getAllTimeLeaderboard(
            page,
            entriesPerPage
          );

          // Handle response - could be nested under data or at root
          const responseData = response?.data || response;

          console.log("All Time Response:", responseData);

          // Dispatch the entire paginated response
          store.dispatch(setAllTimeLeaderboard(responseData));
        }
      } catch (error: unknown) {
        console.error("Error fetching leaderboard:", error);

        // Clear data on error
        const emptyResponse = {
          content: [],
          pageNo: 0,
          pageSize: entriesPerPage,
          totalElements: 0,
          totalPages: 0,
          last: true,
        };

        if (tab === "lastGame") {
          store.dispatch(setLastGameLeaderboard(emptyResponse));
        } else {
          store.dispatch(setAllTimeLeaderboard(emptyResponse));
        }

        if (
          error instanceof Error &&
          error?.message === "Token expired, please login again"
        ) {
          redirect("/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [entriesPerPage]
  );

  useEffect(() => {
    const currentApiPage = currentPage - 1;

    // Fetch if no data or page changed
    if (
      !leaderboardData ||
      leaderboardData.length === 0 ||
      currentPagination?.pageNo !== currentApiPage
    ) {
      getLeaderboard(activeTab, currentApiPage);
    }
  }, [activeTab, currentPage]);

  return (
    <section className="w-full py-5">
      <div className="bg-[#F9F9F9] overflow-hidden">
        <div className="pb-0">
          <LeaderboardTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {loading ? (
          <div className="w-full">
            <Table.Root variant="ghost">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Rank</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="right">
                    Amount
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body className="relative gap-2">
                {Array.from({ length: entriesPerPage }).map((_, index) => (
                  <Table.Row key={`skeleton-${index}`}>
                    <Table.Cell>
                      <Skeleton width="30px" height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-3">
                        <Skeleton
                          width="32px"
                          height="32px"
                          className="rounded-full"
                        />
                        <Skeleton width="120px" height="16px" />
                      </div>
                    </Table.Cell>
                    <Table.Cell align="right">
                      <Skeleton width="80px" height="16px" />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        ) : leaderboardData && leaderboardData.length > 0 ? (
          <>
            <div className="w-full">
              <Table.Root variant="ghost">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Rank</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="right">
                      Amount
                    </Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body className="relative gap-2">
                  {leaderboardData.map((entry, index) => (
                    <LeaderboardRow
                      key={`${entry.rank}-${entry.firstName}-${index}`}
                      entry={entry}
                    />
                  ))}
                </Table.Body>
              </Table.Root>
            </div>

            <LeaderboardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalEntries={totalEntries}
              entriesPerPage={entriesPerPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="w-full text-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-gray-400 text-6xl">📊</div>
              <div className="text-gray-600 text-xl font-medium">
                No leaderboard data
              </div>
              <div className="text-gray-500 text-sm">
                Play some games to see the leaderboard!
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
