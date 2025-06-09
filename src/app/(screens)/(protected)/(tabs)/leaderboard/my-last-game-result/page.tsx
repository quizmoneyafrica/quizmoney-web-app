"use client";
import { User } from "@/app/api/interface";
import { useAppSelector } from "@/app/hooks/useAuth";
import { CorrectCircleIcon, WrongCircleIcon } from "@/app/icons/icons";
import { RootState } from "@/app/store/store";
import { decryptData } from "@/app/utils/crypto";
import { formatNaira, formatTimeToMinutesAndSeconds } from "@/app/utils/utils";
import { Flex, Grid } from "@radix-ui/themes";
import {
  AlarmClockIcon,
  ChartNoAxesColumnIcon,
  Check,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useSelector } from "react-redux";

const Result = () => {
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user: User | null = encrypted ? decryptData(encrypted) : null;
  const { lastGame } = useSelector((state: RootState) => state.leaderboard);

  if (!lastGame?.userLastGameStats) {
    return <div>No game data available</div>;
  }

  const { totalCorrect, totalTime, prize, result } = lastGame.userLastGameStats;

  return (
    <div className="md:bg-white p-2 md:p-10 w-full rounded-2xl space-y-4 md:space-y-6">
      <div className="flex items-center gap-2">
        <div className="md:h-[70px] md:w-[70px] h-[40px] w-[40px] bg-primary-100 rounded-full flex justify-center items-center">
          <Image
            src={user?.avatar || ""}
            alt={user?.firstName || ""}
            width={40}
            height={40}
            className="rounded-full h-full w-full"
          />
        </div>
        <div>
          <p className="capitalize text-lg md:text-2xl font-bold text-primary-700">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="capitalize text-xs md:text-base text-primary-700">
            @{user?.firstName}
          </p>
        </div>
      </div>

      <div className="border rounded-xl border-primary-800 p-2 md:p-4 flex justify-between md:justify-around">
        <div className="flex flex-col items-center">
          <div className="bg-primary-50 md:h-[40px] md:w-[40px] h-[25px] w-[25px] flex justify-center items-center rounded-full">
            <ChartNoAxesColumnIcon size={16} className="text-primary-700" />
          </div>
          <p className="font-semibold text-sm md:text-lg text-primary-700">
            {totalCorrect}/10
          </p>
          <p className="text-xs md:text-base">Game Score</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-primary-50 md:h-[40px] md:w-[40px] h-[25px] w-[25px] flex justify-center items-center rounded-full">
            <AlarmClockIcon size={16} className="text-primary-700" />
          </div>
          <p className="font-semibold text-sm md:text-lg text-primary-700">
            {formatTimeToMinutesAndSeconds(totalTime)}
          </p>
          <p className="text-xs md:text-base">Play Time</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-primary-50 md:h-[40px] md:w-[40px] h-[25px] w-[25px] flex justify-center items-center rounded-full">
            <Wallet size={16} className="text-primary-700" />
          </div>
          <p className="font-semibold text-sm md:text-lg text-primary-700">
            {formatNaira(prize)}
          </p>
          <p className="text-xs md:text-base">Total Earned</p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between pr-2 md:pr-5">
          <p className="font-bold text-base md:text-xl">
            Last game performance
          </p>
          <div className="h-[40px] md:h-[50px]">
            <CircularProgressbar
              value={(totalCorrect / 10) * 100}
              text={`${totalCorrect}/10`}
              className="h-full"
              styles={buildStyles({
                textSize: "24px",
                pathColor: "#00a63e",
                textColor: "#000",
                trailColor: "#dcfce7",
              })}
            />
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-green-600 flex items-center justify-center text-white">
              <Check size={12} className="md:hidden" />
              <Check size={14} className="hidden md:block" />
            </div>
            <p className="font-semibold text-sm md:text-base">
              Correct Answers
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-6 flex-wrap">
            {result
              .filter((q) => q.correct)
              .map((_, index) => (
                <div
                  className="h-8 w-8 md:h-16 md:w-16 rounded-full border border-green-600 bg-green-100 text-green-700 flex justify-center items-center"
                  key={index}
                >
                  <p className="text-base md:text-2xl font-bold">{index + 1}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-red-600 flex items-center justify-center text-white">
              <X size={12} className="md:hidden" />
              <X size={14} className="hidden md:block" />
            </div>
            <p className="font-semibold text-sm md:text-base">
              Missed Questions
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-6 flex-wrap">
            {result
              .filter((q) => !q.correct)
              .map((_, index) => (
                <div
                  className="h-8 w-8 md:h-16 md:w-16 rounded-full border border-red-600 bg-red-100 text-red-700 flex justify-center items-center"
                  key={index}
                >
                  <p className="text-base md:text-2xl font-bold">{index + 1}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Grid
        columns={{ sm: "1", md: "2" }}
        pt={"2"}
        className="w-full gap-4 md:gap-10"
      >
        {result.map((currentQuestion, index) => (
          <div
            key={index}
            className="w-full bg-neutral-50 rounded-lg border border-neutral-300 p-2 md:p-3"
          >
            <p className="font-semibold text-base md:text-lg">
              Question {index + 1}
            </p>
            <p className="font-medium text-sm md:text-base">
              {currentQuestion.question}
            </p>

            <div className="mt-2 md:mt-3 space-y-2 md:space-y-3">
              {currentQuestion.options.map((option: string, idx: number) => {
                const isSelected = currentQuestion.yourAnswer === option;
                const isCorrectSelection =
                  isSelected && option === currentQuestion.correctAnswer;
                const isWrongSelection =
                  isSelected && option !== currentQuestion.correctAnswer;

                return (
                  <div
                    key={idx}
                    className={`w-full py-2 md:py-3 px-4 md:px-6 rounded-full text-left border-4 font-medium transition text-sm md:text-base
                    ${
                      isCorrectSelection ||
                      option === currentQuestion.correctAnswer
                        ? "bg-positive-900 border-positive-500 text-white"
                        : isWrongSelection
                        ? "bg-error-900 border-error-200 text-white"
                        : "bg-neutral-50 border-neutral-50 text-neutral-900"
                    }
                    `}
                  >
                    <Flex
                      gap="2"
                      align="center"
                      justify="between"
                      className="md:gap-4"
                    >
                      <Flex gap="2" align="center" className="md:gap-4">
                        <span className="col-span-1">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span className="col-span-3">{option}</span>
                      </Flex>
                      <span className="text-lg md:text-xl">
                        {(isCorrectSelection ||
                          option === currentQuestion.correctAnswer) && (
                          <CorrectCircleIcon className="text-positive-300" />
                        )}
                        {isWrongSelection && (
                          <WrongCircleIcon className="text-error-100" />
                        )}
                      </span>
                    </Flex>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </Grid>
    </div>
  );
};

export default Result;
