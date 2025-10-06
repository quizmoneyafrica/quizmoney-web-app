import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Table } from "@radix-ui/themes";
import { GameStatResult, useLastGameState } from "@/app/hooks/useLastGameState";
import Image from "next/image";
import { formatNaira } from "@/app/utils/utils";

interface LastGameResultCardProps {
  userLastGameStats?: GameStatResult;
}

const LastGameResultCard = ({ userLastGameStats }: LastGameResultCardProps) => {
  const { loading, gameState } = useLastGameState();

  if (loading) return null;

  // const { avatarUrl, prizeWon, firstName }: LeaderboardEntry = {
  //   rank: gameStats.rank,
  //   avatarUrl: gameStats.avatarUrl || "",
  //   prizeWon: gameStats?.prizeWon || 0,
  //   firstName: gameStats.firstName,
  //   gamesPlayed: (gameStats?.questionsAnswered || []).length,
  //   score: gameStats?.score ?? 0,
  //   totalAnswerTime: "",
  // };
  console.log(userLastGameStats);

  if (gameState)
    return (
      <Link
        href={"#"}
        // href={"/leaderboard/my-last-game-result"}

        className="w-full"
      >
        <motion.div
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl border-3 border-[#51A2E0] my-3 p-3"
        >
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-lg font-bold text-gray-900 mb-6"
          >
            My Last game Result
          </motion.h2>
          <Table.Root variant="ghost">
            <Table.Body className="relative gap-2">
              <Table.Row className=" w-full">
                <Table.Cell>
                  <div className="flex flex-col justify-center">
                    <div className=" text-5xl">🏅</div>
                  </div>
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative w-14 h-14">
                      {gameState.avatarUrl ? (
                        <Image
                          src={gameState.avatarUrl}
                          alt={`${gameState.firstName}'s avatar`}
                          fill
                          className="rounded-full bg-[#E4F1FA] object-contain"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full b flex items-center justify-center">
                          <span className="text-[#2364AA] font-semibold text-lg">
                            {gameState.firstName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Username */}
                    <span className="text-base font-medium text-[#2364AA]">
                      {gameState.firstName}
                    </span>
                  </div>
                </Table.Cell>

                <Table.Cell align="right">
                  <span className=" bg-[#E4F1FA] py-1 px-3 rounded-md font-semibold text-[#2364AA]">
                    {formatNaira(gameState.prizeWon, true)}
                  </span>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </motion.div>
      </Link>
    );
};

export default LastGameResultCard;
