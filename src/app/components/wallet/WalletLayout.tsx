import React from "react";
import TransactionHistory from "./TransactionHistory";
import WithdrawalAccounts from "./WithdrawalAccounts";

export default function WalletLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 pb-28 md:pb-0 gap-4 mt-6">
      <div className="col-span-1 md:col-span-3">
        <TransactionHistory />
      </div>
      <div className="col-span-1 md:col-span-2">
        <WithdrawalAccounts />
      </div>
    </div>
  );
}
