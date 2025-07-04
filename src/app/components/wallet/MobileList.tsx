import classNames from "classnames";
import React from "react";
import CustomImage from "./CustomImage";
import { format, parseISO } from "date-fns";
import { Transaction } from "@/app/store/walletSlice";
import { formatNaira } from "@/app/utils/utils";
import Image from "next/image";

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
        "bg-white cursor-pointer px-3 md:px-4 w-full py-3 rounded-3xl md:py-4 flex md:hidden justify-between items-center ",
        "border border-[#D9D9D9] "
      )}
    >
      <div className="flex gap-2 md:gap-4 items-center">
        <div
          className={`p-1.5 md:p-2 rounded-full ${
            transaction.type === "deposit" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <Image
            alt="arrow-up"
            width={8}
            height={8}
            src={
              transaction.type === "withdrawal"
                ? "/icons/moneyOut.svg"
                : "/icons/moneyIn.svg"
            }
            className=" size-7"
          />
        </div>
        <div className=" flex flex-col items-start">
          <span className="text-sm md:text-base font-medium text-[#3B3B3B]">
            {transaction.title ||
              (transaction.type === "deposit"
                ? "Wallet Top up"
                : "Withdrawal made")}
          </span>
          <span className="text-xs md:text-sm text-gray-500">
            {transaction.type}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-sm md:text-base font-medium ${
            transaction.type === "deposit" ? "text-green-600" : "text-red-600"
          }`}
        >
          {transaction.type === "deposit" ? "+ " : "- "}
          {formatNaira(Number(transaction.amount ?? 0), true)}
        </p>
        <p className="text-xs md:text-sm text-gray-500">{dateData}</p>
      </div>
    </button>
  );
}
