import React from "react";
import TransacTemp from "./transacTemp";
import { useAppSelector } from "@/app/hooks/useAuth";

function CoinTransactions() {
  const { userCoinTransactions } = useAppSelector((state) => state.coin);
  return (
    <div className="space-y-3">
      <h3 className="text-left">Recent Transactions</h3>

      <div className="grid gap-4">
        {userCoinTransactions.map((data, index) => {
          return <TransacTemp key={index} data={data} />;
        })}
      </div>
    </div>
  );
}

export default CoinTransactions;
