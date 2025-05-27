"use client";
import { User } from "@/app/api/interface";
import { useAppSelector } from "@/app/hooks/useAuth";
import { CorrectCircleIcon, WrongCircleIcon } from "@/app/icons/icons";
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

const dummyQuestion = [
  {
    question: "Who was the First President of the United States ?",
    options: [
      "George Washington",
      "Nelson Mandela",
      "John F. Kennedy",
      "George Bush",
    ],
    correctAnswer: "George Washington",
    answer: "George Washington",
  },
  {
    question: "Who was the First President of Nigeria?",
    options: [
      "Nelson Mandela",
      "GoodLuck jonahtan",
      "Bola Ahmed Tinubu",
      "Seyi makinde",
    ],
    correctAnswer: "Bola Ahmed Tinubu",
    answer: "Nelson Mandela",
  },
];

const Result = () => {
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user: User | null = encrypted ? decryptData(encrypted) : null;

  return (
    <div className=" md:bg-white p-3 md:p-10 w-full rounded-2xl space-y-6">
      <div className="flex items-center gap-2">
        <div className=" md:h-[70px] md:w-[70px] h-[50px] w-[50px] bg-primary-100 rounded-full flex justify-center items-center">
          <Image
            src={user?.avatar || ""}
            alt={user?.firstName || ""}
            width={50}
            height={50}
            className="rounded-full h-full w-full"
          />
        </div>
        <div>
          <p className="capitalize text-xl md:text-2xl font-bold text-primary-700 ">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="capitalize text-sm md:text-base text-primary-700">
            @{user?.firstName}
          </p>
        </div>
      </div>

      <div className=" border rounded-xl border-primary-800 p-4 flex justify-between md:justify-around">
        <div className="flex flex-col items-center">
          <div className=" bg-primary-50 md:h-[40px] md:w-[40px] h-[30px] w-[30px] flex justify-center items-center rounded-full">
            <ChartNoAxesColumnIcon size={20} className=" text-primary-700" />
          </div>
          <p className=" font-semibold text-base md:text-lg text-primary-700 ">
            8/10
          </p>
          <p className=" md:text-base text-sm">Game Score</p>
        </div>
        <div className="flex flex-col items-center">
          <div className=" bg-primary-50 md:h-[40px] md:w-[40px] h-[30px] w-[30px] flex justify-center items-center rounded-full">
            <AlarmClockIcon size={20} className=" text-primary-700" />
          </div>
          <p className=" font-semibold text-base md:text-lg text-primary-700 ">
            {formatTimeToMinutesAndSeconds("00:2:20")}
          </p>
          <p className=" md:text-base text-sm">Play Time</p>
        </div>
        <div className="flex flex-col items-center">
          <div className=" bg-primary-50 md:h-[40px] md:w-[40px] h-[30px] w-[30px] flex justify-center items-center rounded-full">
            <Wallet size={20} className=" text-primary-700" />
          </div>
          <p className=" font-semibold text-base md:text-lg text-primary-700 ">
            {formatNaira(0)}
          </p>
          <p className=" md:text-base text-sm">Total Earned</p>
        </div>
      </div>

      <div className=" space-y-6">
        <div className="flex items-center justify-between pr-5 ">
          <p className=" font-bold md:text-xl text-lg">Last game performance</p>
          <div>
            <CircularProgressbar
              value={(8 / 10) * 100}
              text={`${8}/10`}
              className="h-[50px]"
              styles={buildStyles({
                textSize: "30px",
                pathColor: "#00a63e",
                textColor: "#000",
                trailColor: "#dcfce7",
              })}
            />
          </div>
        </div>

        <div className=" space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-white">
              <Check size={14} />
            </div>
            <p className=" font-semibold">Correct Answers</p>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {[1, 2, 4, 5, 6, 2, 10].map((value, index) => (
              <div
                className="h-10 w-10 md:w-16 md:h-16 rounded-full border border-green-600 bg-green-100 text-green-700 flex justify-center items-center"
                key={index}
              >
                <p className=" text-lg md:text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className=" space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center text-white">
              <X size={14} />
            </div>
            <p className=" font-semibold">Missed Questions</p>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            {[3, 7, 8, 9].map((value, index) => (
              <div
                className="h-10 w-10 md:w-16 md:h-16 rounded-full border border-red-600 bg-red-100 text-red-700 flex justify-center items-center"
                key={index}
              >
                <p className=" text-lg md:text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Grid
        columns={{ sm: "1", md: "2" }}
        pt={"4"}
        className=" md:w-[80%] w-full gap-10"
      >
        {dummyQuestion.map((currentQuestion, index) => (
          <div
            key={index}
            className=" w-full bg-neutral-50 rounded-lg border border-neutral-300 p-3"
          >
            <p className="font-semibold text-lg">Question {index + 1}</p>
            <p className=" font-medium">{currentQuestion.question}</p>

            <div className="mt-3 space-y-3">
              {currentQuestion.options.map((option: string, idx: number) => {
                const isSelected = currentQuestion.answer === option;
                const isCorrectSelection =
                  isSelected && option === currentQuestion.correctAnswer;
                const isWrongSelection =
                  isSelected && option !== currentQuestion.correctAnswer;

                return (
                  <div
                    key={idx}
                    // onClick={() => handleOptionClick(option)}
                    // disabled={locked}
                    className={`w-full py-3 px-6  rounded-full text-left border-4 font-medium transition 
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
                    <Flex gap="4" align="center" justify="between">
                      <Flex gap="4" align="center">
                        <span className="col-span-1">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span className="col-span-3">{option}</span>
                      </Flex>
                      <span className="text-xl">
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
