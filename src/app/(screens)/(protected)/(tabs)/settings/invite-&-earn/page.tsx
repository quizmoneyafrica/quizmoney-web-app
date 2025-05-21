"use client";
import CustomButton from "@/app/utils/CustomBtn";
import {
  Check,
  Copy,
  CreditCard,
  Share2,
  UserRoundPlusIcon,
  UsersRoundIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const InviteAndEarn = () => {
  const invited = 1;
  return (
    <div className=" md:bg-white rounded-3xl md:p-4 min-h-screen space-y-6">
      <div className=" min-h-[205px] md:min-h-[285px] w-full relative bg-primary-800 overflow-clip rounded-3xl z-10">
        <Image
          src={"/assets/images/background-desktop.png"}
          className=" w-full h-full absolute object-cover  z-10 "
          height={285}
          width={500}
          alt="bg"
        />

        <div className="grid grid-cols-2 p-4 md:p-8 place-content-center place-items-center z-20  absolute w-full h-full">
          <div className=" space-y-1 md:space-y-4 w-full">
            <p className=" font-bold text-lg md:text-3xl text-white">
              Get Paid for Sharing QuizMoney!
            </p>
            <p className=" text-white md:text-base text-xs">
              Turn your love for trivia into real cash rewards by inviting
              friends to join the game.
            </p>
            <div className="flex items-center gap-3">
              <CustomButton className=" bg-white !py-1 flex items-center gap-2">
                <p className=" text-primary-800 md:text-2xl text-sm">ANO202</p>
                <Copy className=" text-primary-800" size={17} />
              </CustomButton>

              <Share2 size={20} className=" text-white " />
            </div>
          </div>
          <div className=" pt-10 h-[285px] relative">
            <Image
              src={"/assets/images/referral.png"}
              height={400}
              width={400}
              alt=""
              className=" h-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:hidden grid grid-cols-2 bg-primary-50 border-primary-800 border rounded-2xl">
          <div className="flex flex-col gap-1 md:gap-3 items-center py-3 md:p-6 border-r border-primary-800">
            <div className="flex items-center gap-2">
              <UserRoundPlusIcon size={18} />
              <p className="font-semibold">Total Referral</p>
            </div>
            <p className=" text-xl md:text-3xl text-primary-800 font-bold">
              10
            </p>
          </div>
          <div className="flex flex-col gap-1 md:gap-3 items-center py-3 md:p-6">
            <div className="flex items-center gap-2">
              <CreditCard size={18} />
              <p className="font-semibold">Refferal Earnings</p>
            </div>
            <p className=" text-xl md:text-3xl text-primary-800 font-bold">
              ₦10,000{" "}
            </p>
          </div>
        </div>

        <div className=" bg-primary-50 rounded-2xl p-4 py-6">
          <p className=" font-bold text-lg md:text-2xl text-primary-800">
            Earn Big with Our Tiered Referral program
          </p>

          <div className=" mt-10 space-y-4">
            <div className=" bg-white p-4 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-[40px] min-w-[40px] rounded-full justify-center flex items-center bg-primary-50">
                  <UserRoundPlusIcon className=" text-primary-700" />
                </div>
                <div>
                  <p>When 1st friend join you earn</p>
                  <p className="text-lg md:text-xl font-bold text-primary-800">
                    ₦100
                  </p>
                </div>
              </div>
              <div>
                <div className=" bg-green-500 rounded-full p-1 text-white w-fit">
                  <Check size={15} />
                </div>
              </div>
            </div>
            <div className=" bg-white p-4 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-[40px] min-w-[40px] rounded-full justify-center flex items-center bg-primary-50">
                  <UsersRoundIcon className=" text-primary-700" />
                </div>
                <div>
                  <p>When 5 friends join you earn</p>
                  <p className=" text-lg md:text-xl  font-bold text-primary-800">
                    ₦5000
                  </p>
                </div>
              </div>
              <div>
                {/* <div className=" bg-green-500 rounded-full p-1 text-white w-fit">
                  <Check size={15} />
                </div> */}
                <CircularProgressbar
                  value={(invited / 5) * 100}
                  text={`${invited}/5`}
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
            <div className=" bg-white p-4 rounded-xl flex items-center justify-between gap-3 opacity-30">
              <div className="flex items-center gap-3">
                <div className="h-[40px] min-w-[40px] rounded-full justify-center flex items-center bg-primary-50">
                  <UsersRoundIcon className=" text-primary-700" />
                </div>
                <div>
                  <p>When 10 friends join you earn</p>
                  <p className=" text-lg md:text-xl font-bold text-primary-800">
                    ₦10000
                  </p>
                </div>
              </div>
              <div>
                <div className=" bg-zinc-500 rounded-full p-1 text-white w-fit">
                  <Check size={15} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" space-y-6">
          <div className=" hidden md:grid grid-cols-2 bg-primary-50 border-primary-800 border rounded-2xl">
            <div className="flex flex-col gap-3 items-center p-3 md:p-6 border-r border-primary-800">
              <div className="flex items-center gap-2">
                <UserRoundPlusIcon size={18} />
                <p className="font-semibold">Total Referral</p>
              </div>
              <p className=" text-xl md:text-3xl text-primary-800 font-bold">
                10
              </p>
            </div>
            <div className="flex flex-col gap-3 items-center p-3 md:p-6">
              <div className="flex items-center gap-2">
                <CreditCard size={18} />
                <p className="font-semibold">Refferal Earnings</p>
              </div>
              <p className=" text-xl md:text-3xl text-primary-800 font-bold">
                ₦10,000{" "}
              </p>
            </div>
          </div>

          <div className=" z-10 bg-primary-800 relative overflow-clip md:min-h-[241px] min-h-[172px] rounded-3xl md:rounded-2xl">
            <Image
              src={"/assets/images/background-desktop.png"}
              className=" w-full h-full absolute object-cover z-10 scale-150"
              height={285}
              width={500}
              alt="bg"
            />
            <div className="z-20 text-[100px] absolute right-2 md:right-10 top-[-20px] ">
              🥇
            </div>
            <div className=" w-full absolute h-full flex flex-col justify-center  p-5 space-y-[2%] z-30">
              <p className=" font-bold md:text-xl text-lg text-white">
                Join the weekly Jackpot
              </p>
              <p className=" font-bold md:text-3xl text-xl text-white">
                ₦50,000
              </p>
              <p className=" text-white md:w-[80%]">
                Cash and exclusive QuizMoney Merchandise for users with the
                highest number of successful Referrals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteAndEarn;
