import React from "react";
import WalletBalance from "./WalletBalance";
import TransactionHistory from "./TransactionHistory";
import WithdrawalAccounts from "./WithdrawalAccounts";

export default function WalletLayout() {
  return (
    <div className="grid grid-cols-5 gap-6 mt-6">
      <div className="col-span-3">
        <TransactionHistory />
      </div>
      <div className="col-span-2">
        <WithdrawalAccounts />
      </div>
    </div>
  );
}
