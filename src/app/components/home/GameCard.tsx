"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ShareBtn } from "./Share";
import GameApi from "@/app/api/game";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { setNextGameData } from "@/app/store/gameSlice";
import { Flex, Heading, Skeleton, Text } from "@radix-ui/themes";
import { formatNaira } from "@/app/utils/utils";
import Link from "next/link";
import PlayDemoBtn from "./PlayDemo";
//import { toast } from "sonner";
// import JoinGameBtn from "./JoinGameBtn";
import { differenceInSeconds } from "date-fns";
import CustomButton from "@/app/utils/CustomBtn";
import { ReloadIcon } from "@radix-ui/react-icons";
import { QMCoin } from "@/app/icons/icons";
import NextGameQueries from "@/app/api/queries/nextGameQueries";

function GameCard() {
  const dispatch = useAppDispatch();
  const nextGameData = useAppSelector((state) => state.game.nextGameData);
  const [loading, setLoading] = useState(false);
  const [showJoinBtn, setShowJoinBtn] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  console.log(showJoinBtn);

  const fetchNextGame = useCallback(async () => {
    if (nextGameData) return null;
    setLoading(true);
    try {
      const res = await GameApi.fetchNextGame();
      console.log("GAME", res);

      dispatch(setNextGameData(res.data));
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      //toast.error(err.message, {
      // position: toastPosition,
      // });
      setLoading(false);
    }
  }, [dispatch, nextGameData]);
  useEffect(() => {
    fetchNextGame();
  }, [fetchNextGame]);

  // useEffect(() => {
  //   const checkGameTime = () => {
  //     const diff = differenceInSeconds(
  //       new Date(nextGameData?.startTime || ""),
  //       new Date()
  //     );
  //     if (diff > 0 && diff <= 300) {
  //       setShowJoinBtn(true);
  //     } else {
  //       setShowJoinBtn(false);
  //     }
  //   };
  //   checkGameTime();
  //   intervalRef.current = setInterval(checkGameTime, 1000);

  //   return () => {
  //     clearInterval(intervalRef.current!);
  //   };
  // }, [nextGameData?.startTime, setShowJoinBtn]);

  useEffect(() => {
    const checkGameTime = () => {
      // const adjustedStartTime = addHours(
      //   new Date(nextGameData?.startTime || ""),
      //   1
      // ); // Nigerian time
      const diff = differenceInSeconds(
        new Date(nextGameData?.startTime || ""),
        new Date()
      );

      if (diff > 0 && diff <= 300000000000) {
        setShowJoinBtn(true);
      } else {
        setShowJoinBtn(false);
      }
    };

    checkGameTime();
    intervalRef.current = setInterval(checkGameTime, 1000);

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [nextGameData?.startTime, setShowJoinBtn]);
  console.log(nextGameData);

  if (loading)
    return (
      <div className="rounded-[20px] overflow-clip">
        <Skeleton width="100%" height="288px" />
      </div>
    );
  // const coinPrize = nextGameData?.coinPrize || 0;

  return (
    <>
      <div className="drop-shadow-sm rounded-[20px]">
        <div className="flex flex-col drop-shadow rounded-[20px] overflow-clip">
          <div className="relative overflow-hidden bg-white w-full px-4 py-6 rounded-t-[20px]">
            {nextGameData !== null ? (
              <Flex
                direction="column"
                gap="4"
                align="center"
                justify="center"
                className="relative z-[2]"
              >
                <Heading
                  as="h3"
                  size="5"
                  className="text-primary-900 font-bold"
                >
                  Game Prize
                </Heading>
                <Flex direction="column" align="center" justify="center">
                  <Heading
                    as="h1"
                    className="text-primary-900 !text-[2.7rem] !font-black"
                  >
                    {/* {formatNaira(nextGameData?.prize)} */}
                    {formatNaira(1000000)}
                  </Heading>
                  <span className="text-center text-2xl text-primary-900">
                    +
                  </span>
                  <div className="flex items-center gap-1 text-primary-900 font-bold text-xl">
                    <QMCoin />{" "}
                    {/* <span>{coinPrize.toLocaleString()} QM Coins</span> */}
                    <span>- QM Coins</span>
                  </div>
                </Flex>
                <Flex
                  direction="column"
                  gap="2"
                  align="center"
                  justify="center"
                >
                  {/* {nextGameData && nextGameData.status === "INPROGRESS" && (
                    <div className="flex items-center gap-1">
                      <div className="relative h-3 w-3 bg-error-500 rounded-full">
                        <div className="h-3 w-3 bg-error-500 rounded-full animate-ping absolute left-0 top-0" />
                      </div>
                      <p className="text-error-500 font-bold animate-pulse">
                        Live Game in Session
                      </p>
                    </div>
                  )} */}

                  <Text className="text-neutral-800">
                    {/* Next Game: {formatQuizDate(nextGameData?.startTime || "")} */}
                    Next Game: --
                  </Text>
                  <Text className="text-neutral-800 font-medium">
                    {/* Entry Fee: {formatNaira(nextGameData?.fee, true)} */}
                    Entry Fee: {formatNaira(0, true)}
                  </Text>
                </Flex>
              </Flex>
            ) : (
              <div className="h-32 w-full flex flex-col items-center justify-center">
                <CustomButton
                  variant="primary"
                  size="md"
                  onClick={fetchNextGame}
                  className="flex items-center justify-center gap-2"
                >
                  <ReloadIcon width={20} height={20} />
                  Retry
                </CustomButton>
              </div>
            )}
            <Link href="https://quizmoney.ng/how-it-works" target="_blank">
              <button className="text-white text-xl z-[4] shadow-xl cursor-pointer absolute right-4 top-3 font-bold bg-primary-400 rounded-full h-[1.7rem] w-[1.7rem]">
                ?
              </button>
            </Link>
            <div className="absolute -left-5 -bottom-14 z-[1] opacity-40 h-[150px] w-[150px] rounded-full bg-transparent border-8 border-primary-100" />
            <div className="absolute -right-10 -top-8 z-[1] opacity-40 h-[150px] w-[150px] rounded-full bg-transparent border-8 border-primary-100" />
          </div>
          <div className="relative z-[2] bg-primary-800 w-full px-4 py-5 rounded-b-[20px]">
            <Flex align="center" justify="center"></Flex>
            {/* {showJoinBtn ? (
            <Flex align="center" justify="center">
              <JoinGameBtn />
            </Flex>
          ) : (
            <Flex align="center" justify="between">
              <ShareBtn
                gamePrize={nextGameData?.prize || 0}
                startDate={nextGameData?.startTime || ""}
              />
              <JoinGameBtn />
              <PlayDemoBtn />
            </Flex>
          )} */}

            <Flex align="center" justify="between">
              <ShareBtn
                gamePrize={nextGameData?.prize || 0}
                startDate={nextGameData?.startTime || ""}
              />
              {/* <JoinGameBtn /> */}
              <PlayDemoBtn />
            </Flex>
          </div>
        </div>
      </div>
      <NextGameQueries />
    </>
  );
}

export default GameCard;
