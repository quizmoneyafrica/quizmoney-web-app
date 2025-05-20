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
  parseTimeStringToMilliseconds,
  readTotalTime,
} from "@/app/utils/utils";
import { ApiResponse } from "@/app/api/interface";

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
  const dispatch = useDispatch();
  const router = useRouter();

  const handlePlayAgain = () => dispatch(clearDemoData());
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
            <button onClick={() => router.back()} className="cursor-pointer">
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
                Well Played! {user?.firstName?.toUpperCase()}
                <br />
                Now It&apos;s Time to Win Real Cash
              </h2>
              <p>
                You&apos;ve just crushed the demo, now imagine getting paid for
                your knowledge. 💰
              </p>
              <p>
                Join the live game and compete with real players to win real
                cash prizes. No gimmicks. Just 10 questions. 10 seconds each.
                Big rewards.
              </p>
            </div>

            {/* button  */}
            <p className="text-center">
              🚀 Don&apos;t just play for fun! play to earn with Quiz Money! Tap
              the button 👇{" "}
            </p>
            <CustomButton onClick={() => router.replace("/home")} width="full">
              Join Next Game
            </CustomButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DemoResult;
