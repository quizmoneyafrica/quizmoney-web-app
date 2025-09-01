import classNames from "classnames";
import React from "react";
import { addHours, format, parseISO } from "date-fns";
import { Transaction } from "@/app/store/walletSlice";
import { formatNaira } from "@/app/utils/utils";
import { MoveDownLeft, MoveUpRight } from "lucide-react";

type Props = {
  transaction: Transaction;
  onClick?: () => void;
  isLastInGroup: boolean;
};

export default function MobileList({
  transaction,
  onClick,
  isLastInGroup,
}: Props) {
  const date = parseISO(
    transaction?.transactionDate ?? new Date().toISOString()
  );
  const nigeriaTime = addHours(date, 1);
  const dateData = format(nigeriaTime, "MMM d, h:mma").toLowerCase();

  return (
    <button
      onClick={() => onClick?.()}
      className={classNames(
        "bg-white cursor-pointer p-4 w-full  rounded-2xl md:rounded-none border md:border-transparent border-[#D9D9D9] grid grid-cols-3 gap-1 items-center",
        `${isLastInGroup ? "" : "md:border-b-[#d9d9d955]"}`
      )}
    >
      <div className="col-span-2 flex items-center gap-2">
        <div>
          <div
            className={`h-10 w-10 rounded-full grid place-items-center  ${
              transaction.direction === "CREDIT"
                ? "bg-green-100 text-positive-900"
                : "bg-error-100 text-error-900"
            }`}
          >
            {transaction.direction === "CREDIT" ? (
              <MoveDownLeft width={18} height={18} />
            ) : (
              <MoveUpRight width={18} height={18} />
            )}
          </div>
        </div>
        <div className="grid text-left">
          <p className="text-xs text-left font-medium text-[#3B3B3B]">
            {transaction.narration ||
              (transaction.direction === "CREDIT"
                ? "Wallet Top up"
                : "Withdrawal made")}
          </p>
          <p className="text-xs md:text-sm text-gray-500">
            {transaction.transactionType}
          </p>
        </div>
      </div>
      <div className="col-span-1 text-right ">
        <p
          className={`text-sm md:text-base font-medium ${
            transaction.direction === "CREDIT"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {transaction.direction === "CREDIT" ? "+ " : "- "}
          {formatNaira(Number(transaction.amount ?? 0), true)}
        </p>
        <p className="text-xs md:text-sm text-gray-500 capitalize">
          {dateData}
        </p>
      </div>
    </button>
  );
}
