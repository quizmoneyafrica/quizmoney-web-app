import React from "react";
import { Check } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

interface TieredReferralProgramProps {
  totalReferral?: number;
}

const TieredReferralProgram: React.FC<TieredReferralProgramProps> = ({
  totalReferral = 0,
}) => {
  const referralTiers = [
    {
      id: 1,
      inviteCount: 1,
      reward: "5 QM coins",
      icon: "/icons/user-add-blue.svg",
      isUnlocked: totalReferral >= 1,
      progress: Math.min(totalReferral, 1),
      maxProgress: 1,
      isEnabled: true,
    },
    {
      id: 2,
      inviteCount: 5,
      reward: "25 QM coins",
      icon: "/icons/profile-2user.svg",
      isUnlocked: totalReferral >= 5,
      isEnabled: totalReferral >= 1,
      progress: totalReferral >= 1 ? Math.min(totalReferral, 5) : 0,
      maxProgress: 5,
    },
    {
      id: 3,
      inviteCount: 10,
      reward: "50 QM coins",
      icon: "/icons/profile-2user.svg",
      isUnlocked: totalReferral >= 10,
      isEnabled: totalReferral >= 5,
      progress: totalReferral >= 5 ? Math.min(totalReferral, 10) : 0,
      maxProgress: 10,
    },
  ];

  return (
    <div className="bg-primary-50 rounded-2xl p-3 md:p-4 py-4 md:py-6">
      <p className="font-bold text-base sm:text-lg md:text-2xl text-primary-800">
        Earn Big with Our Tiered Referral program
      </p>

      <div className="mt-3 md:mt-10 space-y-3 md:space-y-4">
        {referralTiers.map((tier, index) => {
          const progressPercentage = (tier.progress / tier.maxProgress) * 100;

          return (
            <div
              key={tier.id}
              className={`flex items-center justify-between bg-white p-3 md:p-4 rounded-xl ${
                tier.isEnabled ? "opacity-100" : "opacity-60"
              }`}
            >
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <div
                  className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tier.id === 1
                      ? "bg-blue-100"
                      : tier.id === 2
                      ? "bg-[#E4F1FA] "
                      : "bg-gray-100"
                  }`}
                >
                  <img
                    src={tier.icon}
                    alt="Tier Icon"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm md:text-base font-medium text-gray-900 leading-tight">
                    When{" "}
                    {tier.inviteCount === 1
                      ? "1st friend join"
                      : `${tier.inviteCount} friends join`}{" "}
                    you earn
                  </p>
                  <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
                    <img
                      src="/icons/coin-2.svg"
                      alt="Coin"
                      className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    />
                    <span className="text-sm sm:text-base md:text-lg font-bold text-primary-800 truncate">
                      {tier.reward}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center ml-2 flex-shrink-0">
                {index === 0 ? (
                  <div className="bg-green-500 rounded-full p-2 sm:p-2.5 text-white">
                    <Check size={14} className="sm:size-[18px] stroke-2" />
                  </div>
                ) : tier.isEnabled ? (
                  <div className="inline-block h-10 w-10 sm:h-12 sm:w-12">
                    <CircularProgressbar
                      value={progressPercentage}
                      text={`${tier.progress}/${tier.maxProgress}`}
                      className="h-10 w-10 sm:h-12 sm:w-12"
                      styles={buildStyles({
                        textSize: "28px",
                        pathColor: "#00a63e",
                        textColor: "#000",
                        trailColor: "#dcfce7",
                        strokeLinecap: "round",
                      })}
                    />
                  </div>
                ) : (
                  <div className="inline-block h-10 w-10 sm:h-12 sm:w-12">
                    <CircularProgressbar
                      value={0}
                      text={`${tier.progress}/${tier.maxProgress}`}
                      className="h-10 w-10 sm:h-12 sm:w-12"
                      styles={buildStyles({
                        textSize: "28px",
                        pathColor: "#e5e7eb",
                        textColor: "#9ca3af",
                        trailColor: "#f3f4f6",
                        strokeLinecap: "round",
                      })}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TieredReferralProgram;
