import React from "react";
import LeaderBoardTableSection from "./components/LeaderBoardTableSection";
import AdBanner from "@/app/components/advert/adBanner";
import ShowPlayerData from "./ShowPlayerData";

export default function Page() {
  return (
    <div className=" w-full">
      <AdBanner />
      <LeaderBoardTableSection />
      <ShowPlayerData />
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
