import classNames from "classnames";
import React from "react";
import { Transaction } from "@/app/store/walletSlice";
import { MoveDownLeft, MoveUpRight } from "lucide-react";
import { formatDateTime, formatNaira } from "@/lib/utils";

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
  return (
    <button
      onClick={() => onClick?.()}
      className={classNames(
        "bg-white cursor-pointer p-4 w-full  rounded-2xl md:rounded-none border md:border-transparent border-[#D9D9D9] grid grid-cols-3 gap-1 items-center",
        `${isLastInGroup ? "" : "md:border-b-[#d9d9d955]"}`,
      )}
    >
      <div className="col-span-2 flex items-center gap-2">
        <div>
          <div
            className={`h-10 w-10 rounded-full grid place-items-center  ${
              transaction.status === "success"
                ? "bg-green-100 text-positive-900"
                : transaction.status === "failed"
                  ? "bg-error-100 text-error-900"
                  : "bg-warning-100 text-warning-800"
            }`}
          >
            {transaction.direction === "credit" ? (
              <MoveDownLeft width={18} height={18} />
            ) : (
              <MoveUpRight width={18} height={18} />
            )}
          </div>
        </div>
        <div className="grid text-left">
          <p className="text-xs text-left font-medium text-[#3B3B3B]">
            {transaction.description ||
              (transaction.direction === "credit"
                ? "Wallet Top up"
                : "Withdrawal made")}
          </p>
          <p className="text-xs md:text-sm text-gray-500 lowercase">
            {transaction.direction}
          </p>
        </div>
      </div>
      <div className="col-span-1 text-right ">
        <p
          className={`text-sm md:text-base font-medium ${
            transaction.status === "success"
              ? "text-green-600"
              : transaction.status === "failed"
                ? "text-red-600"
                : "text-warning-800"
          }`}
        >
          {transaction.direction === "credit" ? "+ " : "- "}
          {formatNaira(Number(transaction.amount ?? 0))}
        </p>
        <p className="text-xs md:text-sm text-gray-500 capitalize">
          {formatDateTime(transaction.created_at ?? new Date().toISOString())}
        </p>
      </div>
    </button>
  );
}
