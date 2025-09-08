import React from "react";
import Image from "next/image";
import { Check, Copy, Share2 } from "lucide-react";

interface ReferralBannerProps {
  referralCode?: string;
  isCopied: boolean;
  onCopy: () => void;
  onShare: () => void;
}

const ReferralBanner: React.FC<ReferralBannerProps> = ({
  referralCode,
  isCopied,
  onCopy,
  onShare,
}) => {
  return (
    <div className="w-full bg-[url('/assets/images/background-desktop.png')] relative bg-primary-800 bg-cover overflow-clip rounded-3xl z-10 min-h-[285px]">
      <div className="grid grid-cols-2 p-4 md:p-8 place-content-center place-items-center z-20 absolute w-full h-full">
        <div className="space-y-1 md:space-y-4 w-full">
          <p className="font-bold text-lg md:text-3xl text-white">
            Get Paid for Sharing QuizMoney!
          </p>
          <p className="text-white md:text-base text-xs">
            Turn your love for trivia into real cash rewards by inviting friends
            to join the game.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onCopy}
              className="bg-white py-1 px-3 hover:border-white-800 border rounded-full flex items-center gap-2"
            >
              <p className="text-primary-800 md:text-2xl text-sm">
                {referralCode}
              </p>

              {isCopied ? (
                <Check scale={18} className="text-emerald-400" />
              ) : (
                <Copy className="text-primary-800" size={17} />
              )}
            </button>

            <div onClick={onShare}>
              <Share2 size={20} className="text-white" />
            </div>
          </div>
        </div>
        <div className="pt-10 h-[285px] relative">
          <Image
            src={"/assets/images/referral.png"}
            height={400}
            width={400}
            alt=""
            className="h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ReferralBanner;
