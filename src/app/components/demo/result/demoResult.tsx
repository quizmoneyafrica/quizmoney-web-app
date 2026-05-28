"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
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
import { formatNaira } from "@/app/utils/utils";
import { ApiResponse } from "@/app/api/interface";
import UseBlockBackNavigation from "../blockBackNav";
import type { PracticeSummary } from "@/lib/practice-store";

type Props = {
  summary: PracticeSummary;
  totalTimeUsed: string;
  user: ApiResponse;
};

function DemoResult({ summary, totalTimeUsed, user }: Props) {
  UseBlockBackNavigation();
  const router = useRouter();

  const handlePlayAgain = () => {
    router.replace("/play-demo");
  };

  const handleGoHome = () => {
    router.replace("/home");
  };

  const firstName =
    (user as any)?.user?.firstName ||
    (user as any)?.firstName ||
    (user as any)?.first_name ||
    "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="bg-neutral-50 w-full min-h-screen">
        <div className="w-full max-w-screen-lg mx-auto px-4 pt-6 pb-4 space-y-6">
          {/* Nav */}
          <Flex align="center" justify="between">
            <button onClick={handleGoHome} className="cursor-pointer">
              <CircleArrowLeft />
            </button>
            <button
              onClick={handlePlayAgain}
              className="flex items-center gap-1 rounded-full text-primary-800 bg-primary-50 border border-primary-300 px-4 py-2"
            >
              <RepeatIcon /> Play again!
            </button>
          </Flex>

          <div className="space-y-10 w-full max-w-lg mx-auto">
            {/* Stats box */}
            <div className="bg-primary-50 border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
              <p className="text-center">
                Total Time Used:{" "}
                <span className="font-medium">{totalTimeUsed}</span>
              </p>

              <Grid
                columns="3"
                align="center"
                justify="center"
                className="w-full place-items-center"
              >
                <div className="flex items-center gap-2 font-medium">
                  <span>{summary.correct} Correct</span>
                  <CorrectCircleIcon className="text-positive-700" />
                </div>
                <Separator orientation="vertical" size="2" />
                <div className="flex items-center justify-end gap-2 font-medium">
                  <span>{summary.wrong} Incorrect</span>
                  <WrongCircleIcon className="text-error-400" />
                </div>
              </Grid>

              {/* Accuracy + eraser row */}
              <div className="flex items-center justify-between text-sm text-neutral-600 pt-1 border-t border-primary-200">
                <span>
                  Accuracy:{" "}
                  <strong className="text-primary-900">
                    {summary.accuracy}%
                  </strong>
                </span>
                {summary.autoCorrected > 0 && (
                  <span className="text-secondary-600">
                    🧹 {summary.autoCorrected} eraser
                    {summary.autoCorrected > 1 ? "s" : ""} used
                  </span>
                )}
                <span>
                  Score:{" "}
                  <strong className="text-primary-900">{summary.score}</strong>/
                  {summary.totalQuestions}
                </span>
              </div>
            </div>

            {/* Encouragement */}
            <div className="text-center space-y-2">
              <span className="text-7xl">🏆</span>
              <h2 className="font-bold text-2xl text-primary-900">
                Good Job{firstName ? `, ${firstName.toUpperCase()}` : ""}!
                <br />
                Ready to challenge other players?
              </h2>
              <p>
                Join the next game and compete for your share of{" "}
                {formatNaira(0, true)}. Just 10 questions, 10 seconds each.
              </p>
            </div>

            <CustomButton onClick={handleGoHome} width="full">
              Join Next Game
            </CustomButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DemoResult;
