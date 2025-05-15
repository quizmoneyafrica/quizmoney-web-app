import React from "react";
import TransactionHistory from "./TransactionHistory";
import WithdrawalAccounts from "./WithdrawalAccounts";
import { getAuthUser } from "@/app/api/userApi";

export default function WalletLayout() {
  const user = getAuthUser();
  console.log("====================================");
  console.log(JSON.stringify(user, null, 2));
  console.log("====================================");
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 pb-28 md:pb-0 gap-4">
      <div className="col-span-1 md:col-span-3">
        <TransactionHistory />
      </div>
      <div className="col-span-1 md:col-span-2">
        <WithdrawalAccounts />
      </div>
    </div>
  );
}
