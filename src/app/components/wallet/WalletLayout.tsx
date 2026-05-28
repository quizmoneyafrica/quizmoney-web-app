"use client";
import React from "react";
import TransactionHistory from "./TransactionHistory";
import WithdrawalAccounts from "./WithdrawalAccounts";

export default function WalletLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 md:pb-0 gap-4 flex-1 h-screen">
      <div className="col-span-1 md:col-span-3  ">
        <TransactionHistory />
      </div>
      <div className="col-span-1 md:col-span-2">
        {/* <WithdrawalAccounts />  */}
      </div>
    </div>
  );
}
