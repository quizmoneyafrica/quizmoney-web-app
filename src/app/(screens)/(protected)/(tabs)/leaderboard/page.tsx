import AdBanner from "@/app/components/advert/adBanner";
import React from "react";
import LeaderBoardTableSection from "./components/LeaderBoardTableSection";

export default function page() {
  return (
    <div className=" w-full">
      <AdBanner />
      <LeaderBoardTableSection />
    </div>
  );
}

export interface LeaderboardEntry {
  avatarUrl: string;
  firstName: string;
  gamesPlayed: number;
  rank: number;
  score: number;
}
