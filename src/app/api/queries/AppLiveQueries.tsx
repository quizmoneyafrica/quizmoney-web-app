"use client";
import React from "react";
import HomeQueries from "./homeQueries";
import WalletQueries from "./walletQueries";
import LeaderboardQueries from "./leaderboardQueries";

function AppLiveQueries() {
  return (
    <>
      <HomeQueries />
      <WalletQueries />
      <LeaderboardQueries />
    </>
  );
}

export default AppLiveQueries;
