"use client";

import React, { useEffect } from "react";
import { ShareBtn } from "./Share";
import { Flex, Heading, Skeleton, Text } from "@radix-ui/themes";
import { formatQuizDate } from "@/app/utils/utils";
import Link from "next/link";
import PlayDemoBtn from "./PlayDemo";
import { parseISO } from "date-fns";
import { QMCoin } from "@/app/icons/icons";
import JoinGameBtn from "./JoinGameBtn";
import { useUpcomingGame } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { useSocket } from "@/lib/socket";
import { UpcomingGame } from "@/app/api/game";
import { formatNaira } from "@/lib/utils";

// ── Prize pool helpers ────────────────────────────────────────────────────────

function estimatePrizePool(game: UpcomingGame): number {
  if (game.is_sponsored && game.sponsor_prize_boost_kobo) {
    return game.sponsor_prize_boost_kobo;
  }
  const raw = Math.floor(
    game.total_entry_collected_kobo * (game.prize_percent / 100),
  );
  return game.prize_pool_max_kobo
    ? Math.min(raw, game.prize_pool_max_kobo)
    : raw;
}

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<UpcomingGame["status"], string> = {
  scheduled: "Upcoming Game",
  lobby: "Lobby Open",
  locked: "Starting Soon",
  active: "Live Now",
};

function isJoinable(status: UpcomingGame["status"]): boolean {
  return status === "lobby";
}

function isLive(status: UpcomingGame["status"]): boolean {
  return status === "active" || status === "locked";
}

// ── Component ─────────────────────────────────────────────────────────────────

function GameCard() {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { data: game, isLoading, isError, refetch } = useUpcomingGame();

  // Socket listeners — invalidate query instantly when game state changes
  useEffect(() => {
    if (!socket) return;

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.upcomingGame });
    };

    // Lobby opened → join button should appear
    socket.on("game:lobby:open", invalidate);
    // Game locked → update status
    socket.on("game:locked", invalidate);
    // Game started → show live indicator
    socket.on("game:started", invalidate);
    // Game cancelled → clear card
    socket.on("game:cancelled", invalidate);

    return () => {
      socket.off("game:lobby:open", invalidate);
      socket.off("game:locked", invalidate);
      socket.off("game:started", invalidate);
      socket.off("game:cancelled", invalidate);
    };
  }, [socket, queryClient]);

  if (isLoading) {
    return (
      <div className="rounded-[20px] overflow-clip">
        <Skeleton width="100%" height="288px" />
      </div>
    );
  }

  return (
    <>
      {/* New Game Card  */}
      <div className="drop-shadow-sm rounded-[20px]">
        <div className="flex flex-col drop-shadow rounded-[20px] overflow-clip">
          {/* ── Top section ─────────────────────────────────────────────────── */}
          <div className="relative overflow-hidden bg-white w-full px-4 py-6 rounded-t-[20px]">
            {game ? (
              <Flex
                direction="column"
                gap="4"
                align="center"
                justify="center"
                className="relative z-[2]"
              >
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  gap="3"
                >
                  {isLive(game.status) && (
                    <div className="flex items-center gap-1">
                      <div className="relative h-3 w-3 bg-error-500 rounded-full">
                        <div className="h-3 w-3 bg-error-500 rounded-full animate-ping absolute left-0 top-0" />
                      </div>
                      <p className="text-error-500 font-bold animate-pulse">
                        {STATUS_LABELS[game.status]}
                      </p>
                    </div>
                  )}
                  {!isLive(game.status) && (
                    <div className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full border border-primary-200">
                      {STATUS_LABELS[game.status]}
                    </div>
                  )}

                  <Heading
                    as="h1"
                    className="text-primary-900 !text-[2rem] !font-black"
                  >
                    {game.status === "active"
                      ? "Game is currently in session"
                      : `${formatQuizDate(parseISO(game.scheduled_start_time + "Z").toISOString())}`}
                  </Heading>
                </Flex>

                {/* Status + time */}
                <Flex
                  direction="column"
                  gap="2"
                  align="center"
                  justify="center"
                >
                  <Text className="text-primary-600 text-sm font-medium">
                    Entry Fee:{" "}
                    {game.entry_fee_kobo === 0
                      ? "Free"
                      : formatNaira(game.entry_fee_kobo)}
                  </Text>

                  <Text className="text-primary-800 text-xs font-medium">
                    Cash Prize to be won!!!
                  </Text>
                </Flex>
              </Flex>
            ) : (
              /* No upcoming game */
              <div className="h-32 w-full flex flex-col items-center justify-center gap-3">
                {isError ? (
                  <>
                    <p className="text-neutral-500 text-sm">
                      Could not load game info
                    </p>
                    <button
                      onClick={() => refetch()}
                      className="text-primary-700 text-sm underline"
                    >
                      Retry
                    </button>
                  </>
                ) : (
                  <p className="text-neutral-500 text-sm text-center">
                    No upcoming games right now.
                    <br />
                    Check back soon!
                  </p>
                )}
              </div>
            )}

            {/* Help button */}
            <Link href="https://quizmoney.ng/how-it-works" target="_blank">
              <button className="text-white text-xl z-[4] shadow-xl cursor-pointer absolute right-4 top-3 font-bold bg-primary-400 rounded-full h-[1.7rem] w-[1.7rem]">
                ?
              </button>
            </Link>

            {/* Decorative circles */}
            <div className="absolute -left-5 -bottom-14 z-[1] opacity-40 h-[150px] w-[150px] rounded-full bg-transparent border-8 border-primary-100" />
            <div className="absolute -right-10 -top-8 z-[1] opacity-40 h-[150px] w-[150px] rounded-full bg-transparent border-8 border-primary-100" />
          </div>

          {/* ── Bottom section ───────────────────────────────────────────────── */}
          <div className="relative z-[2] bg-primary-800 w-full px-4 py-5 rounded-b-[20px]">
            {game && isJoinable(game.status) ? (
              <Flex align="center" justify="center">
                <JoinGameBtn gameId={game.id} />
              </Flex>
            ) : (
              <Flex align="center" justify="between">
                <ShareBtn
                  gamePrize={game ? estimatePrizePool(game) : 0}
                  startDate={game?.scheduled_start_time ?? ""}
                />
                <PlayDemoBtn />
              </Flex>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GameCard;

// function GameCardOld() {
//   return (
//     <div>
//       {/* Previouse Card  */}

//       <div className="drop-shadow-sm rounded-[20px]">
//         <div className="flex flex-col drop-shadow rounded-[20px] overflow-clip">
//           {/* ── Top section ─────────────────────────────────────────────────── */}
//           <div className="relative overflow-hidden bg-white w-full px-4 py-6 rounded-t-[20px]">
//             {game ? (
//               <Flex
//                 direction="column"
//                 gap="4"
//                 align="center"
//                 justify="center"
//                 className="relative z-[2]"
//               >
//                 {/* Prize pool */}
//                 <Heading
//                   as="h3"
//                   size="5"
//                   className="text-primary-900 font-bold"
//                 >
//                   {game.title ?? "Game Prize"}
//                 </Heading>

//                 <Flex
//                   direction="column"
//                   align="center"
//                   justify="center"
//                   gap="1"
//                 >
//                   {estimatePrizePool(game) === 0 && (
//                     <div className="inline-flex items-center gap-1 text-primary-700 text-xs font-semibold px-3 py-1 ">
//                       WIN UP TO
//                     </div>
//                   )}
//                   <Heading
//                     as="h1"
//                     className="text-primary-900 !text-[2.7rem] !font-black"
//                   >
//                     {formatNaira(
//                       estimatePrizePool(game) !== 0
//                         ? estimatePrizePool(game)
//                         : 100000000,
//                     )}
//                   </Heading>
//                   {game.qmcoin_prize_total > 0 && (
//                     <>
//                       <span className="text-center text-2xl text-primary-900">
//                         +
//                       </span>
//                       <div className="flex items-center gap-1 text-primary-900 font-bold text-xl">
//                         <QMCoin />
//                         <span>
//                           {game.qmcoin_prize_total.toLocaleString()} QM Coins
//                         </span>
//                       </div>
//                     </>
//                   )}
//                 </Flex>

//                 {/* Status + time */}
//                 <Flex
//                   direction="column"
//                   gap="2"
//                   align="center"
//                   justify="center"
//                 >
//                   {isLive(game.status) && (
//                     <div className="flex items-center gap-1">
//                       <div className="relative h-3 w-3 bg-error-500 rounded-full">
//                         <div className="h-3 w-3 bg-error-500 rounded-full animate-ping absolute left-0 top-0" />
//                       </div>
//                       <p className="text-error-500 font-bold animate-pulse">
//                         {STATUS_LABELS[game.status]}
//                       </p>
//                     </div>
//                   )}

//                   {!isLive(game.status) && (
//                     <div className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full border border-primary-200">
//                       {STATUS_LABELS[game.status]}
//                     </div>
//                   )}

//                   <Text className="text-neutral-800">
//                     {game.status === "active"
//                       ? "A game is currently in session"
//                       : `Next Game: ${formatQuizDate(parseISO(game.scheduled_start_time + "Z").toISOString())}`}
//                   </Text>

//                   <Text className="text-neutral-800 font-medium">
//                     Entry Fee:{" "}
//                     {game.entry_fee_kobo === 0
//                       ? "Free"
//                       : formatNaira(game.entry_fee_kobo)}
//                   </Text>
//                 </Flex>
//               </Flex>
//             ) : (
//               /* No upcoming game */
//               <div className="h-32 w-full flex flex-col items-center justify-center gap-3">
//                 {isError ? (
//                   <>
//                     <p className="text-neutral-500 text-sm">
//                       Could not load game info
//                     </p>
//                     <button
//                       onClick={() => refetch()}
//                       className="text-primary-700 text-sm underline"
//                     >
//                       Retry
//                     </button>
//                   </>
//                 ) : (
//                   <p className="text-neutral-500 text-sm text-center">
//                     No upcoming games right now.
//                     <br />
//                     Check back soon!
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Help button */}
//             <Link href="https://quizmoney.ng/how-it-works" target="_blank">
//               <button className="text-white text-xl z-[4] shadow-xl cursor-pointer absolute right-4 top-3 font-bold bg-primary-400 rounded-full h-[1.7rem] w-[1.7rem]">
//                 ?
//               </button>
//             </Link>

//             {/* Decorative circles */}
//             <div className="absolute -left-5 -bottom-14 z-[1] opacity-40 h-[150px] w-[150px] rounded-full bg-transparent border-8 border-primary-100" />
//             <div className="absolute -right-10 -top-8 z-[1] opacity-40 h-[150px] w-[150px] rounded-full bg-transparent border-8 border-primary-100" />
//           </div>

//           {/* ── Bottom section ───────────────────────────────────────────────── */}
//           <div className="relative z-[2] bg-primary-800 w-full px-4 py-5 rounded-b-[20px]">
//             {game && isJoinable(game.status) ? (
//               <Flex align="center" justify="center">
//                 <JoinGameBtn gameId={game.id} />
//               </Flex>
//             ) : (
//               <Flex align="center" justify="between">
//                 <ShareBtn
//                   gamePrize={game ? estimatePrizePool(game) : 0}
//                   startDate={game?.scheduled_start_time ?? ""}
//                 />
//                 <PlayDemoBtn />
//               </Flex>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
