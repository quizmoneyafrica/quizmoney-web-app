import React from "react";
import { Check, X } from "lucide-react";
import { useParams } from "next/navigation";
import classNames from "classnames";

interface MobileSuccessDepositProps {
  close?: () => void;
  title?: string;
  message?: string;
}

export const MobileSuccessDeposit = ({
  close,
  title = "Successful !",
  message = "You have successfully created a withdrawal pin",
}: MobileSuccessDepositProps) => {
  const { success } = useParams();
  const isSuccess = Boolean(success);
  return (
    <div className="bg-white rounded-t-3xl h-full flex flex-col">
      {/* Header with close button */}
      <div className="flex justify-between items-center p-6 pb-4">
        <div></div>
        {close && (
          <button
            onClick={close}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Success Icon */}
        <div
          className={classNames(
            "w-20 h-20  rounded-full flex items-center justify-center mb-8",

            isSuccess ? "bg-blue-100" : " bg-red-500/15"
          )}
        >
          <div
            className={classNames(
              "w-12 h-12  rounded-full flex items-center justify-center",

              isSuccess ? " bg-primary-900" : " bg-red-500"
            )}
          >
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Success Message */}
        <h2
          className={classNames(
            "text-xl font-semibold text-gray-900 mb-4 text-center",
            isSuccess ? " text-black" : " text-red-500"
          )}
        >
          {title}
        </h2>

        <p className="text-gray-600 text-center mb-8 px-4 leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
};
