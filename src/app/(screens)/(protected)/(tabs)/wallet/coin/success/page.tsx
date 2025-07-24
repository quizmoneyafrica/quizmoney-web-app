"use client";
import CustomButton from "@/app/utils/CustomBtn";
import { SuccessIcon } from "@/app/utils/successIcon";
import { Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RewardObject } from "../RedeemModal";
import { EraserIcon, QMCoin } from "@/app/icons/icons";
import { ArrowRightLeft, Gamepad2Icon } from "lucide-react";

function Page() {
  const router = useRouter();
  const [parsedData, setParsedData] = useState<RewardObject | null>(null);

  useEffect(() => {
    const storedRewardData = localStorage.getItem("rewardData");

    if (storedRewardData) {
      try {
        const data: RewardObject = JSON.parse(storedRewardData);
        setParsedData(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to parse reward data", error);
        router.replace("/wallet?tab=coin");
      }
    } else {
      router.replace("/wallet?tab=coin");
    }
  }, [router]);

  if (!parsedData) {
    return null;
  }

  return (
    <div className="h-screen w-full max-w-lg mx-auto pt-10">
      <div className="space-y-10">
        <Flex align="center" direction="column" gap="3" className="text-center">
          <SuccessIcon size="sm" />
          <h1 className="font-bold text-primary-900">{parsedData.title}</h1>
          <div className="py-4 px-8 bg-primary-50 rounded-[10px] space-y-3">
            <p className="font-bold text-primary-900 flex items-center justify-center gap-1">
              <QMCoin width={20} height={20} />
              <span>{Number(parsedData.points).toLocaleString()} QM Coin</span>
            </p>
            <div className="h-5 w-5 border border-primary-900 rounded-full mx-auto grid place-items-center">
              <ArrowRightLeft
                width={10}
                height={10}
                className="text-primary-900"
              />
            </div>
            <Flex gap="2" className="text-sm">
              <p className="font-bold text-primary-900 flex items-center gap-1">
                <Gamepad2Icon />
                <span>
                  {parsedData.reward.freeGames} Free Game
                  {parsedData.reward.freeGames > 1 && "s"}
                </span>
              </p>
              <span> +</span>
              <p className="font-bold text-primary-900 flex items-center gap-1">
                <EraserIcon />
                <span>
                  {parsedData.reward.erasers} Eraser
                  {parsedData.reward.erasers > 1 && "s"}
                </span>
              </p>
            </Flex>
          </div>
          <p className="text-sm">
            You&apos;ve successfully redeemed {parsedData.points} points for{" "}
            {parsedData.reward.erasers} eraser
            {parsedData.reward.erasers > 1 && "s"} and{" "}
            {parsedData.reward.freeGames} free game
            {parsedData.reward.freeGames > 1 && "s"}
          </p>
        </Flex>
        <div className="grid gap-2">
          <CustomButton
            type="button"
            width="full"
            size="md"
            onClick={() => {
              router.replace("/wallet?tab=coin");
              localStorage.removeItem("rewardData");
            }}
          >
            View Coins
          </CustomButton>
          <CustomButton
            type="button"
            width="full"
            size="md"
            variant="outline"
            onClick={() => {
              router.replace("/home");
              localStorage.removeItem("rewardData");
            }}
          >
            Proceed to Home
          </CustomButton>
        </div>
      </div>
    </div>
  );
}

export default Page;
