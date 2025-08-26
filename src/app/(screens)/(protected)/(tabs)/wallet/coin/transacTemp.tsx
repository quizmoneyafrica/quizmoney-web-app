import React from "react";
import { CoinEarned, CoinRedeemed, QMCoin } from "@/app/icons/icons";
import { CoinTransactions } from "@/app/store/coinSlice";
import { formatDateTime } from "@/app/utils/utils";
import { Transaction } from "@/app/store/walletSlice";

type Props = {
  data: Transaction;
};

const TransacTemp = ({ data }: Props) => {
  const { fullDate, time } = formatDateTime(data.transactionDate);
  return (
    <div className="bg-white rounded-[12px] p-4 grid grid-cols-[2fr_1fr] items-center">
      <div className="flex items-center gap-2">
        <div
          className={`h-8 w-8 rounded-full ${
            data.direction === "CREDIT" ? "bg-positive-50" : "bg-error-50"
          } p-1 flex items-center justify-center`}
        >
          {data.direction === "CREDIT" ? <CoinEarned /> : <CoinRedeemed />}
        </div>
        <div className="text-left">
          <p className="text-neutral-800 text-sm font-medium">
            {data.direction}
          </p>
          <p className="text-xs text-neutral-600">
            {fullDate} {time}
          </p>
        </div>
      </div>
      <div className="text-right text-sm flex items-center justify-end gap-1">
        <QMCoin />
        <span
          className={`${
            data.direction === "CREDIT" ? "text-positive-800" : "text-error-800"
          }`}
        >
          {data.direction === "CREDIT" ? "+" : "-"}
          {Number(data?.amount).toLocaleString()} coins
        </span>
      </div>
    </div>
  );
};

export default TransacTemp;
