"use client";
import React from "react";
import HomeQueries from "./homeQueries";
import WalletQueries from "./walletQueries";
import LeaderboardQueries from "./leaderboardQueries";

function AppLiveQueries() {
  return (
    <div>
      <HomeQueries />
      <WalletQueries />
      <LeaderboardQueries />
    </div>
  );
}

export default AppLiveQueries;
