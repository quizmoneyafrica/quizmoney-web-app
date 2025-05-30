"use client";
import { clearDemoData } from "@/app/store/demoSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  CircleArrowLeft,
  CorrectCircleIcon,
  RepeatIcon,
  WrongCircleIcon,
} from "@/app/icons/icons";
import { useRouter } from "next/navigation";
import { Flex, Grid, Separator } from "@radix-ui/themes";
import CustomButton from "@/app/utils/CustomBtn";
import {
  formatNaira,
  parseTimeStringToMilliseconds,
  readTotalTime,
} from "@/app/utils/utils";
import { ApiResponse } from "@/app/api/interface";
import UseBlockBackNavigation from "../blockBackNav";
import { useAppSelector } from "@/app/hooks/useAuth";

type Props = {
  totalTimeUsed: string;
  correctScore: number;
  totalQuestion: number;
  user: ApiResponse;
};
function DemoResult({
  totalTimeUsed,
  correctScore,
  totalQuestion,
  user,
}: Props) {
  UseBlockBackNavigation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { nextGameData } = useAppSelector((state) => state.game);

  const handlePlayAgain = () => {
    dispatch(clearDemoData());
    sessionStorage.clear();
    router.replace("/play-demo");
  };

  const handleGoBack = () => {
    dispatch(clearDemoData());
    router.replace("/home");
    sessionStorage.clear();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="bg-neutral-50 w-full min-h-screen">
        <div className="w-full max-w-screen-lg mx-auto px-4 pt-6 pb-4 space-y-6">
          <Flex align="center" justify="between">
            <button onClick={handleGoBack} className="cursor-pointer">
              <CircleArrowLeft />
            </button>
            <button
              onClick={handlePlayAgain}
              className="flex items-center gap-1 rounded-full text-primary-800 bg-primary-50 border border-primary-300 px-4 py-2 "
            >
              <RepeatIcon /> Play again!
            </button>
          </Flex>
          {/* main  */}
          <div className="space-y-10 w-full max-w-lg mx-auto">
            {/* box  */}
            <div className="bg-primary-50 border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
              <p className="text-center">
                Total Time Used:{" "}
                <span className="font-medium">
                  {readTotalTime(parseTimeStringToMilliseconds(totalTimeUsed))}
                </span>
              </p>
              <Grid
                columns="3"
                align="center"
                justify="center"
                className="w-full place-items-center"
              >
                <div className="flex items-center gap-2 font-medium">
                  <span>{correctScore} Correct</span>
                  <CorrectCircleIcon className="text-positive-700" />
                </div>
                <Separator orientation="vertical" size="2" />
                <div className="flex items-center justify-end gap-2 font-medium">
                  <span>
                    {Number(totalQuestion) - Number(correctScore)} Incorrect
                  </span>
                  <WrongCircleIcon className="text-error-400" />
                </div>
              </Grid>
            </div>

            {/* text  */}
            <div className="text-center space-y-2">
              <span className="text-7xl">🏆</span>
              <h2 className="font-bold text-2xl text-primary-900">
                Good Job, {user?.firstName?.toUpperCase()}!
                <br />
                Ready to challenge other players?
              </h2>

              <p>
                Join the next game and compete for your share of{" "}
                {formatNaira(Number(nextGameData?.gamePrize), true)}. Just 10
                questions, 10 seconds each.
              </p>
            </div>

            {/* button  */}
            {/* <p className="text-center">
              🚀 Don&apos;t just play for fun! play to earn with Quiz Money! Tap
              the button 👇{" "}
            </p> */}
            <CustomButton onClick={handleGoBack} width="full">
              Join Next Game
            </CustomButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DemoResult;
