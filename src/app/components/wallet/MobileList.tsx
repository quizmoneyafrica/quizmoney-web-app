import classNames from "classnames";
import React from "react";
import CustomImage from "./CustomImage";
import { format, parseISO } from "date-fns";
import { Transaction } from "@/app/store/walletSlice";

type Props = {
  transaction: Transaction;
  onClick?: () => void;
};

export default function MobileList({ transaction, onClick }: Props) {
  const date = parseISO(transaction?.createdAt ?? new Date().toISOString());
  const dateData = format(date, "MMM d h:mma").toLowerCase();

  return (
    <button
      onClick={() => onClick?.()}
      className={classNames(
        "bg-white cursor-pointer px-3 md:px-4 py-3 rounded-3xl md:py-4 flex md:hidden justify-between items-center ",
        "border border-[#D9D9D9] "
      )}
    >
      <div className="flex gap-2 md:gap-4 items-center">
        <div
          className={`p-1.5 md:p-2 rounded-full ${
            transaction.type === "deposit" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {transaction.type === "deposit" ? (
            <CustomImage
              alt="arrow-up"
              src="/icons/arrow-down-green.svg"
              className="w-4 h-4 md:w-5 md:h-5"
            />
          ) : (
            <CustomImage
              alt="arrow-up"
              src="/icons/arrow-down-red.svg"
              className="w-4 h-4 md:w-5 md:h-5"
            />
          )}
        </div>
        <div>
          <p className="text-sm md:text-base font-medium text-[#3B3B3B]">
            {transaction.title ||
              (transaction.type === "deposit"
                ? "Wallet Top up"
                : "Withdrawal made")}
          </p>
          <p className="text-xs md:text-sm text-gray-500">{transaction.type}</p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-sm md:text-base font-medium ${
            transaction.type === "deposit" ? "text-green-600" : "text-red-600"
          }`}
        >
          {transaction.type === "deposit" ? "+" : "-"} ₦
          {transaction.amount.toLocaleString()}
        </p>
        <p className="text-xs md:text-sm text-gray-500">{dateData}</p>
      </div>
    </button>
  );
}
