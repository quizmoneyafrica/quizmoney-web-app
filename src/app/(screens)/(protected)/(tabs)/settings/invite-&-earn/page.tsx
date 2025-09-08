/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppDispatch, useAuth } from "@/app/hooks/useAuth";

import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import copy from "copy-to-clipboard"; // Import the copy function
import { toast } from "sonner";
import UserAPI from "@/app/api/userApi";
import { toastPosition } from "@/app/utils/utils";
import { updateUser } from "@/app/store/authSlice";
import ReferralBanner from "@/app/components/referral/ReferralBanner";
import ReferralStats from "@/app/components/referral/ReferralStats";
import TieredReferralProgram from "@/app/components/referral/TieredReferralProgram";
import WeeklyReferralChallenge from "@/app/components/referral/WeeklyReferralChallenge";

const InviteAndEarn = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const success = copy(user?.referralCode ?? "");

    if (success) {
      setIsCopied(true);
      toast.success("Referral Code Copied!", { position: "top-center" });

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
    const fetchReferralCode = async () => {
      if (user?.referralCode) return;
      try {
        const res = await UserAPI.getReferralCode();
        console.log("Referral Code", res);
        dispatch(updateUser({ referralCode: res?.data?.referralCode }));
      } catch (err: any) {
        console.error("Error purchasing products:", err.message);
        toast.error(`${err.message}`, { position: toastPosition });
      }
    };
    const fetchReferralSummary = async () => {
      // if (user?.referralCode) return;
      try {
        const res = await UserAPI.getReferralSummary();
        console.log("Referral Summary", res);
        dispatch(
          updateUser({
            referralEarnings: res?.data?.referralEarnings,
            totalReferral: res?.data?.totalReferral,
          })
        );
      } catch (err: any) {
        console.error("Error purchasing products:", err.message);
        toast.error(`${err.message}`, { position: toastPosition });
      }
    };

    fetchReferralCode();
    fetchReferralSummary();
  }, [dispatch, user?.referralCode]);

  return (
    <div className=" w-full bg-white p-0 md:p-3 rounded-2xl space-y-6">
      <ReferralBanner
        referralCode={user?.referralCode}
        isCopied={isCopied}
        onCopy={handleCopy}
        onShare={handleShare}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <ReferralStats
          totalReferral={user?.totalReferral}
          referralEarnings={user?.referralEarnings}
          className="md:hidden"
        />

        <TieredReferralProgram totalReferral={user?.totalReferral} />

        <div className=" space-y-6">
          <ReferralStats
            totalReferral={user?.totalReferral}
            referralEarnings={user?.referralEarnings}
            className="hidden md:grid"
          />

          <WeeklyReferralChallenge />
        </div>
      </div>
    </div>
  );
};

export default InviteAndEarn;
