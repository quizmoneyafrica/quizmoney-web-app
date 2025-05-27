import React, { JSX, useState } from "react";
import MobileList from "../wallet/MobileList";
import CustomImage from "../wallet/CustomImage";
import { format, parseISO } from "date-fns";
import { Transaction } from "@/app/store/walletSlice";
import { TransactionDetailsModal } from "./TransactionDetailModal";
import { formatNaira } from "@/app/utils/utils";

export function formatAmount(amount: number): string {
  const sign = amount > 0 ? "+" : "-";
  return `${sign} ${formatNaira(Number(amount), true)}`;
}

export const ActivityRow = ({
  transaction,
  isLast = false,
}: {
  transaction: Transaction;
  isLast?: boolean;
}): JSX.Element => {
  const date = parseISO(transaction.createdAt ?? new Date().toISOString());
  const dateData = format(date, "MMM d h:mma").toLowerCase();
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <React.Fragment>
      <div
        onClick={handleOpenModal}
        className={`md:flex hidden hover:bg-primary-900/10 items-center   justify-between py-4 cursor-pointer px-3 md:px-4 ${
          isLast ? "" : "border-b border-b-[#D9D9D9]"
        }`}
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
            <p className="text-xs md:text-sm text-gray-500">
              {transaction.type}
            </p>
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
      </div>

      <MobileList onClick={handleOpenModal} transaction={transaction} />

      <TransactionDetailsModal
        transaction={transaction}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </React.Fragment>
  );
};
