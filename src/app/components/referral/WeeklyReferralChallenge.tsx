import React from "react";
import Image from "next/image";

interface WeeklyReferralChallengeProps {
  prize?: string;
  className?: string;
}

const WeeklyReferralChallenge: React.FC<WeeklyReferralChallengeProps> = ({
  prize = "₦50,000",
  className = "",
}) => {
  return (
    <div
      className={`z-10 bg-primary-800 relative overflow-clip md:min-h-[241px] min-h-[172px] rounded-3xl md:rounded-2xl ${className}`}
    >
      <Image
        src={"/assets/images/background-desktop.png"}
        className="w-full h-full absolute object-cover z-10 scale-150"
        height={285}
        width={500}
        alt="bg"
      />
      <div className="z-20 text-[60px] sm:text-[80px] md:text-[100px] absolute right-2 md:right-10 top-[-10px] md:top-[-20px]">
        🥇
      </div>
      <div className="w-full absolute h-full flex flex-col justify-center p-4 md:p-5 space-y-1 md:space-y-[2%] z-30">
        <p className="font-bold text-base sm:text-lg md:text-xl text-white">
          Join the weekly referral challenge
        </p>
        <p className="font-bold text-xl sm:text-2xl md:text-3xl text-white">
          {prize}
        </p>
        <p className="text-white text-sm sm:text-base md:w-[80%] leading-tight">
          Win cash and exclusive Quiz Money merch when you have the highest
          number of successful referrals
        </p>
      </div>
    </div>
  );
};

export default WeeklyReferralChallenge;
