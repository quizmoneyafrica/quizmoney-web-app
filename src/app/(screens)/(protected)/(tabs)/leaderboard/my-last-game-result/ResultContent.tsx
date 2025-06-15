"use client";

import { User } from "@/app/api/interface";
import { useAppSelector } from "@/app/hooks/useAuth";
import { CorrectCircleIcon, WrongCircleIcon } from "@/app/icons/icons";
import { RootState } from "@/app/store/store";
import { decryptData } from "@/app/utils/crypto";
import {
  formatNaira,
  parseTimeStringToMilliseconds,
  readLeaderboardTotalTime,
} from "@/app/utils/utils";
import { Flex, Grid } from "@radix-ui/themes";
import {
  AlarmClockIcon,
  ChartNoAxesColumnIcon,
  Check,
  Wallet,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useSelector } from "react-redux";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const ResultContent = () => {
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user: User | null = encrypted ? decryptData(encrypted) : null;
  const { lastGame } = useSelector((state: RootState) => state.leaderboard);

  if (!lastGame?.userLastGameStats) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4"
      >
        <h1 className="text-xl font-bold">No game data available</h1>
      </motion.main>
    );
  }

  const { totalCorrect, totalTime, prize, result } = lastGame.userLastGameStats;

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="md:bg-white p-2 md:p-10 w-full rounded-2xl space-y-4 md:space-y-6"
    >
      <motion.section
        variants={itemVariants}
        aria-label="User Profile"
        className="flex items-center gap-2"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="md:h-[70px] md:w-[70px] h-[40px] w-[40px] bg-primary-100 rounded-full flex justify-center items-center"
        >
          <Image
            src={user?.avatar || ""}
            alt={`${user?.firstName}'s profile picture`}
            width={40}
            height={40}
            className="rounded-full h-full w-full"
          />
        </motion.div>
        <div>
          <motion.h1
            variants={itemVariants}
            className="capitalize text-lg md:text-2xl font-bold text-primary-700"
          >
            {user?.firstName} {user?.lastName}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="capitalize text-xs md:text-base text-primary-700"
          >
            @{user?.firstName}
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        variants={itemVariants}
        aria-label="Game Statistics"
        className="border rounded-xl border-primary-800 p-2 md:p-4 flex justify-between md:justify-around"
      >
        {[
          {
            icon: (
              <ChartNoAxesColumnIcon size={16} className="text-primary-700" />
            ),
            value: `${totalCorrect}/10`,
            label: "Game Score",
          },
          {
            icon: <AlarmClockIcon size={16} className="text-primary-700" />,
            value: readLeaderboardTotalTime(
              parseTimeStringToMilliseconds(totalTime)
            ),
            label: "Play Time",
          },
          {
            icon: <Wallet size={16} className="text-primary-700" />,
            value: formatNaira(Number(prize), true),
            label: "Total Earned",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-primary-50 md:h-[40px] md:w-[40px] h-[25px] w-[25px] flex justify-center items-center rounded-full"
            >
              {stat.icon}
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="font-semibold text-sm md:text-lg text-primary-700"
            >
              {stat.value}
            </motion.p>
            <motion.p variants={itemVariants} className="text-xs md:text-base">
              {stat.label}
            </motion.p>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        variants={itemVariants}
        aria-label="Performance Analysis"
        className="space-y-4 md:space-y-6"
      >
        <motion.div variants={itemVariants} className="grid grid-cols-2">
          <h2 className="font-bold text-base md:text-xl">
            Last game performance
          </h2>
          <div className="flex items-center !justify-end">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="h-[40px] md:h-[50px] w-[40px]"
            >
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
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-green-600 flex items-center justify-center text-white"
            >
              <Check size={12} className="md:hidden" />
              <Check size={14} className="hidden md:block" />
            </motion.div>
            <p className="font-semibold text-sm md:text-base">
              Correct Answers
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            className="flex items-center gap-2 md:gap-6 flex-wrap"
          >
            {result
              .filter((q) => q.correct)
              .map((r, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full border border-green-600 bg-green-100 text-green-700 flex justify-center items-center"
                >
                  <p className="text-base md:text-lg font-bold">{r.number}</p>
                </motion.div>
              ))}
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-red-600 flex items-center justify-center text-white"
            >
              <X size={12} className="md:hidden" />
              <X size={14} className="hidden md:block" />
            </motion.div>
            <p className="font-semibold text-sm md:text-base">
              Missed Questions
            </p>
          </div>
          <motion.div
            variants={containerVariants}
            className="flex items-center gap-2 md:gap-6 flex-wrap"
          >
            {result
              .filter((q) => !q.correct)
              .map((r, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full border border-red-600 bg-red-100 text-red-700 flex justify-center items-center"
                >
                  <p className="text-base md:text-lg font-bold">{r.number}</p>
                </motion.div>
              ))}
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        variants={itemVariants}
        aria-label="Question Analysis"
        className="w-full"
      >
        <Grid
          columns={{ sm: "1", md: "2" }}
          pt={"2"}
          className="w-full gap-4 md:gap-10"
        >
          {result.map((currentQuestion, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="w-full bg-neutral-50 rounded-lg border border-neutral-300 p-2 md:p-3"
            >
              <motion.p
                variants={itemVariants}
                className="font-semibold text-base md:text-lg"
              >
                Question {index + 1}
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="font-medium text-sm md:text-base"
              >
                {currentQuestion.question}
              </motion.p>

              <motion.div
                variants={containerVariants}
                className="mt-2 md:mt-3 space-y-2 md:space-y-3"
              >
                {currentQuestion.options.map((option: string, idx: number) => {
                  const isSelected = currentQuestion.yourAnswer === option;
                  const isCorrectSelection =
                    isSelected && option === currentQuestion.correctAnswer;
                  const isWrongSelection =
                    isSelected && option !== currentQuestion.correctAnswer;

                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
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
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-lg md:text-xl"
                        >
                          {(isCorrectSelection ||
                            option === currentQuestion.correctAnswer) && (
                            <CorrectCircleIcon className="text-positive-300" />
                          )}
                          {isWrongSelection && (
                            <WrongCircleIcon className="text-error-100" />
                          )}
                        </motion.span>
                      </Flex>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          ))}
        </Grid>
      </motion.section>
    </motion.main>
  );
};

export default ResultContent;
