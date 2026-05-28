"use client";

import React from "react";
import { motion } from "framer-motion";
import { Grid } from "@radix-ui/themes";
// import { useRouter } from "next/navigation";
import { useKycStep } from "@/app/hooks/useKycStep";
import GameCard from "@/app/components/home/GameCard";
import TopGamers from "@/app/components/home/TopGamers";
import TransactionHistory from "@/app/components/wallet/TransactionHistory";
import AdBanner from "@/app/components/advert/adBanner";
import KycStart from "@/app/components/kyc/kyc-start";
import KycContinue from "@/app/components/kyc/kyc-continue";
import { useAuthStore } from "@/lib/auth-store";

export default function HomeTab() {
  const { currentStep } = useKycStep();
  const user = useAuthStore((state) => state.user);

  console.log("USER IN HOME:", user, currentStep);

  const kycBanner =
    currentStep === null ? null : currentStep ===
      "DONE" ? null : currentStep === "PHONE" ? (
      <KycStart />
    ) : (
      <KycContinue />
    );

  // const gameZoneData: GameZoneCardObject = {
  //   title: <GameZoneTitle />,
  //   description: "Play games daily & win cash instantly",
  //   src: "/assets/images/game-zone.png",
  //   onClick: () => {},
  // };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="space-y-4"
    >
      {kycBanner}
      <Grid columns={{ initial: "1", lg: "2" }} gap="4">
        <div>
          <Grid gap="4">
            <GameCard />
            {/* <GameZoneCardTemp data={gameZoneData} /> */}
            <AdBanner />
            <TopGamers />
          </Grid>
        </div>
        <div className="bg-white rounded-[20px] hidden lg:inline-block p-4">
          <TransactionHistory />
        </div>
      </Grid>
    </motion.div>
  );
}
