import React from "react";
import TransacTemp from "./transacTemp";
import { useAppSelector } from "@/app/hooks/useAuth";
import CustomImage from "@/app/components/wallet/CustomImage";

function CoinTransactions() {
  const { userCoinTransactions } = useAppSelector((state) => state.coin);
  return (
    <div className="space-y-3">
      <h3 className="text-left">Recent Transactions</h3>

      <div className="grid gap-4">
        {userCoinTransactions.length > 0 ? (
          <>
            {userCoinTransactions.map((data, index) => {
              return <TransacTemp key={index} data={data} />;
            })}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-44 px-4 bg-white rounded-lg">
            <div>
              <CustomImage
                alt="empty-transactions"
                src="/icons/empty-state.svg"
              />
            </div>
            <p className="text-gray-500 text-center text-sm md:text-base">
              {"You've not made any recent"} <br />
              transactions yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoinTransactions;
