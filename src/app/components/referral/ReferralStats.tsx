import React from "react";
import { formatNaira } from "@/app/utils/utils";

interface ReferralStatsProps {
  totalReferral?: number;
  referralEarnings?: number;
  className?: string;
}

const ReferralStats: React.FC<ReferralStatsProps> = ({
  totalReferral,
  referralEarnings,
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-2 bg-primary-50 border-primary-800 border rounded-xl ${className}`}
    >
      <div className="flex flex-col gap-1 md:gap-3 items-center py-3 md:p-6 border-r border-primary-800">
        <div className="flex items-center gap-2">
          <img src="/icons/user-add.svg" alt="Coin" className="w-4 h-4" />
          <p className="font-semibold md:text-xl  text-sm">Total Referral</p>
        </div>
        <p className="text-xl md:text-3xl text-primary-800 font-bold">
          {totalReferral || 0}
        </p>
      </div>
      <div className="flex flex-col gap-1 md:gap-3 items-center py-3 md:p-6">
        <div className="flex flex-1 items-center gap-2 ">
          <img src="/icons/wallet-2.svg" alt="Coin" className="w-4 h-4" />
          <p className="font-semibold md:text-xl text-sm flex-nowrap ">
            Referral Earnings
          </p>
        </div>
        <div className="flex items-center gap-2 text-primary-800 font-bold">
          <img src="/icons/coin-2.svg" alt="Coin" className="w-4 h-4" />
          {formatNaira(Number(referralEarnings), true)}
        </div>
      </div>
    </div>
  );
};

export default ReferralStats;
