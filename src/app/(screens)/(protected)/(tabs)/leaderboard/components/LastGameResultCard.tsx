import React from "react";
import { Avatar, Table } from "@radix-ui/themes";
import { useLastGameState } from "@/app/hooks/useLastGameState";
import { formatNaira, readTotalTimeLeaderboard } from "@/app/utils/utils";
import { AlarmClockIcon } from "lucide-react";
import { QMCoin } from "@/app/icons/icons";
import { useRouter } from "next/navigation";

const LastGameResultCard = () => {
  const { loading, gameState } = useLastGameState();
  const router = useRouter();

  if (loading) return null;

  const handleViewStat = () => {
    router.push("/leaderboard/my-last-game-result");
  };

  if (gameState)
    return (
      <>
        <Table.Root
          variant="ghost"
          className="bg-white rounded-xl border-3 border-[#51A2E0] my-3 p-3 cursor-pointer"
          onClick={handleViewStat}
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell colSpan={4}>
                My Last Game Result
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">
                <button className="p-1 rounded bg-primary-100 text-primary-600 text-xs ">
                  View More..
                </button>
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          {/* body  */}
          <Table.Body className="relative gap-2">
            <Table.Row align="center">
              <Table.Cell>
                <div className="flex flex-col justify-center">
                  <div className="text-xl">🏅</div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative w-10 h-10">
                    <Avatar
                      src={gameState.avatarUrl ?? "/assets/images/profile.png"}
                      fallback={
                        gameState?.firstName?.charAt(0).toUpperCase() || ""
                      }
                      radius="full"
                      className="bg-primary-100 w-full object-cover border-2 border-primary-400 backdrop-blur-sm"
                      size="3"
                    />
                  </div>
                  {/* Username */}
                  <span className="capitalize text-base font-medium text-[#2364AA]">
                    {gameState.firstName}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell colSpan={2}>
                <div className="flex items-center gap-2">
                  {/* score  */}
                  <p className="flex md:h-10 md:w-10 w-6 h-6 items-center text-primary-800 justify-center gap-2 border-2 border-primary-800 rounded-full p-2">
                    {gameState.score}
                  </p>
                  {/* Time  */}
                  <div className="flex items-center h-full gap-1 text-nowrap">
                    <AlarmClockIcon className=" text-primary-800" size={14} />
                    {gameState.totalAnswerTime ? (
                      <span className="text-sm text-primary-800 font-semibold">
                        {readTotalTimeLeaderboard(
                          Number(gameState.totalAnswerTime)
                        )}
                      </span>
                    ) : (
                      <span className="text-sm text-primary-800 font-semibold">
                        -s, -ms
                      </span>
                    )}
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell align="right">
                {gameState.rewardType === "NGN" ? (
                  <span className=" bg-[#E4F1FA] py-1 px-3 rounded-md font-semibold text-[#2364AA]">
                    {formatNaira(gameState.prizeWon, true)}
                  </span>
                ) : (
                  <div className=" bg-[#E4F1FA] py-1 px-3 rounded-md font-semibold text-[#2364AA]">
                    <span className="flex items-center gap-2 text-positive-900 justify-center">
                      <QMCoin width={20} height={20} />
                      {gameState.prizeWon > 0 && "+"}
                      {gameState.prizeWon}
                    </span>
                  </div>
                )}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </>
    );
};

export default LastGameResultCard;
