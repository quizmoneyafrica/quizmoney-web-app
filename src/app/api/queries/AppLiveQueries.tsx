"use client";
import React from "react";
import WalletQueries from "./walletQueries";
import NextGameQueries from "./nextGameQueries";

function AppLiveQueries() {
  return (
    <div>
      <WalletQueries />
      <NextGameQueries />
    </div>
  );
}

export default AppLiveQueries;
