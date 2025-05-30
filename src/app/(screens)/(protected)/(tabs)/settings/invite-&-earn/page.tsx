"use client";
import { User } from "@/app/api/interface";
import { useAppSelector } from "@/app/hooks/useAuth";
import { decryptData } from "@/app/utils/crypto";
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
import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import copy from "copy-to-clipboard"; // Import the copy function
import { toast } from "sonner";
import UserAPI from "@/app/api/userApi";
import { formatNaira } from "@/app/utils/utils";

const InviteAndEarn = () => {
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user: User | null = encrypted ? decryptData(encrypted) : null;
  const [isCopied, setIsCopied] = useState(false);
  const [referralData, setReferralData] = useState({
    referralCount: 0,
    referralEarnings: 0,
  });

  const handleCopy = () => {
    // The 'copy' function from the library returns true on success, false on failure
    const success = copy(user?.referralCode ?? "");

    if (success) {
      setIsCopied(true);
      toast.success("Referral Code Copied!", { position: "top-center" });

      // Reset feedback message after a short delay
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } else {
      // This 'else' block for copy-to-clipboard is less common,
      // as it generally handles various browser nuances internally.
      // It might be triggered if, for example, the document isn't focused.
      toast.error("Failed to copy!", { position: "top-center" });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `🚀 Join Me on Quiz Money and Win Real Cash! 🧠💸`,
          text: `Hey! I’ve been playing Quiz Money — a fun trivia app where you answer questions and win cash instantly! 🎉 Use my referral code ${user?.referralCode} when signing up to get 50% bonus on your first deposit! 💰 Don't miss out, test your knowledge, compete daily, and earn real rewards!`,
          url: `https://quizmoney.ng`,
        });
      } else {
        // alert("Sharing not supported on this device.");
        handleCopy();
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await UserAPI.getReferralStats();
      console.log(res.data);
      setReferralData({
        ...res.data.result,
      });
    })();
  }, []);

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
              <CustomButton
                onClick={handleCopy}
                className=" bg-white !py-1 flex items-center gap-2"
              >
                <p className=" text-primary-800 md:text-2xl text-sm">
                  {user?.referralCode}
                </p>

                {isCopied ? (
                  <Check scale={18} className=" text-emerald-400" />
                ) : (
                  <Copy className=" text-primary-800" size={17} />
                )}
              </CustomButton>

              <div onClick={handleShare}>
                <Share2 size={20} className=" text-white " />
              </div>
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
            <div className="flex flex-col sm:flex-row  items-center gap-2">
              <UserRoundPlusIcon size={18} />
              <p className="font-semibold">Total Referral</p>
            </div>
            <p className=" text-xl md:text-3xl text-primary-800 font-bold">
              {referralData.referralCount}
            </p>
          </div>
          <div className="flex flex-col gap-1 md:gap-3 items-center py-3 md:p-6">
            <div className="flex flex-col sm:flex-row  items-center gap-2">
              <CreditCard size={18} />
              <p className="font-semibold">Referral Earnings</p>
            </div>
            <p className=" text-xl md:text-3xl text-primary-800 font-bold">
              {formatNaira(Number(referralData.referralEarnings), true)}
            </p>
          </div>
        </div>

        <div className=" bg-primary-50 rounded-2xl p-4 py-6">
          <p className=" font-bold text-lg md:text-2xl text-primary-800">
            Earn Big with Our Tiered Referral program
          </p>

          <div className=" mt-3 md:mt-10 space-y-4">
            {/* 1 invite  */}
            <div className="grid grid-cols-3 bg-white p-4 rounded-xl gap-3">
              <div className="flex items-center gap-3 col-span-2">
                <div className="sm:h-[40px] h-[30px] min-w-[30px] md:min-w-[40px] rounded-full justify-center flex items-center bg-primary-50">
                  <UserRoundPlusIcon className=" text-primary-700" />
                </div>
                <div className="">
                  <p className=" text-sm md:text-base">Invite 1, you earn</p>
                  <p className="text-lg md:text-xl font-bold text-primary-800">
                    ₦100
                  </p>
                </div>
              </div>

              {/* <div className="flex items-center justify-end">
                <div
                  className={` ${
                    referralData.referralCount >= 1
                      ? " opacity-100"
                      : " opacity-0"
                  } bg-green-500 rounded-full p-1 text-white w-fit`}
                >
                  <Check size={15} />
                </div>
              </div> */}
              <div className="relative flex items-center !justify-end">
                {referralData?.referralCount >= 1 ? (
                  <div
                    className={`bg-green-500 rounded-full p-1 text-white w-fit`}
                  >
                    <Check size={15} />
                  </div>
                ) : (
                  <div className="absolute right-0 inline-block h-[50px] w-[50px]">
                    <CircularProgressbar
                      value={(referralData?.referralCount / 1) * 100}
                      text={`${referralData?.referralCount}/1`}
                      className="h-[50px] w-[50px] "
                      styles={buildStyles({
                        textSize: "30px",
                        pathColor: "#00a63e",
                        textColor: "#000",
                        trailColor: "#dcfce7",
                      })}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 5 people  */}
            <div
              className={`grid grid-cols-3 bg-white p-4 rounded-xl gap-3 ${
                referralData?.referralCount >= 1 ? "opacity-100" : "opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 col-span-2">
                <div className="sm:h-[40px] h-[30px] min-w-[30px] md:min-w-[40px] rounded-full justify-center flex items-center bg-primary-50">
                  <UsersRoundIcon className=" text-primary-700" />
                </div>
                <div className="">
                  <p className=" text-sm md:text-base">Invite 5, you earn</p>
                  <p className="text-lg md:text-xl font-bold text-primary-800">
                    ₦5,000
                  </p>
                </div>
              </div>

              <div className="relative flex items-center !justify-end">
                {referralData?.referralCount >= 1 && (
                  <>
                    {referralData?.referralCount >= 6 ? (
                      <div
                        className={`bg-green-500 rounded-full p-1 text-white w-fit`}
                      >
                        <Check size={15} />
                      </div>
                    ) : (
                      <div className="absolute right-0 inline-block h-[50px] w-[50px]">
                        <CircularProgressbar
                          value={((referralData?.referralCount - 1) / 5) * 100}
                          text={`${referralData?.referralCount - 1}/5`}
                          className="h-[50px] w-[50px] "
                          styles={buildStyles({
                            textSize: "30px",
                            pathColor: "#00a63e",
                            textColor: "#000",
                            trailColor: "#dcfce7",
                          })}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 10 people  */}
            <div
              className={`grid grid-cols-3 bg-white p-4 rounded-xl gap-3 ${
                referralData?.referralCount >= 16 ? "opacity-100" : "opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 col-span-2">
                <div className="sm:h-[40px] h-[30px] min-w-[30px] md:min-w-[40px] rounded-full justify-center flex items-center bg-primary-50">
                  <UsersRoundIcon className=" text-primary-700" />
                </div>
                <div className="">
                  <p className=" text-sm md:text-base">Invite 10, you earn</p>
                  <p className="text-lg md:text-xl font-bold text-primary-800">
                    ₦10,000
                  </p>
                </div>
              </div>

              <div className="relative flex items-center !justify-end">
                {referralData?.referralCount >= 6 && (
                  <>
                    {referralData?.referralCount >= 16 ? (
                      <div
                        className={`bg-green-500 rounded-full p-1 text-white w-fit`}
                      >
                        <Check size={15} />
                      </div>
                    ) : (
                      <div className="absolute right-0 inline-block h-[50px] w-[50px]">
                        <CircularProgressbar
                          value={((referralData?.referralCount - 6) / 5) * 100}
                          text={`${referralData?.referralCount - 6}/5`}
                          className="h-[50px] w-[50px] "
                          styles={buildStyles({
                            textSize: "30px",
                            pathColor: "#00a63e",
                            textColor: "#000",
                            trailColor: "#dcfce7",
                          })}
                        />
                      </div>
                    )}
                  </>
                )}
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
                {referralData.referralCount}
              </p>
            </div>
            <div className="flex flex-col gap-3 items-center p-3 md:p-6">
              <div className="flex items-center gap-2">
                <CreditCard size={18} />
                <p className="font-semibold">Referral Earnings</p>
              </div>
              <p className=" text-xl md:text-3xl text-primary-800 font-bold">
                {formatNaira(Number(referralData.referralEarnings), true)}
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
                Join the weekly referral challenge
              </p>
              <p className=" font-bold md:text-3xl text-xl text-white">
                ₦50,000
              </p>
              <p className=" text-white md:w-[80%]">
                Win cash and exclusive Quiz Money merch when you have the
                highest number of successful referrals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteAndEarn;
