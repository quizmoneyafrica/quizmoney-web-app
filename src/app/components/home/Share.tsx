import { useAuth } from "@/app/hooks/useAuth";
import { formatNaira, formatQuizDate, toastPosition } from "@/app/utils/utils";
import React from "react";
import { toast } from "sonner";

type Props = {
  gamePrize: number;
  startDate: string;
};

export const ShareBtn = ({ gamePrize, startDate }: Props) => {
  const { user } = useAuth();
  const fallbackCopy = () => {
    navigator.clipboard.writeText("https://app.quizmoney.ng");
    toast.info("Link copied to clipboard!", { position: toastPosition });
  };
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `🎮 The next trivia game is about to start!`,
          text: `The next trivia game is about to start!
				Time: ${formatQuizDate(startDate)}
				Prize Pool: ${formatNaira(gamePrize)}
				Hurry so you don’t miss out! Use my code: ${user?.referral_code}`,
          url: "https://app.quizmoney.ng",
        });
      } else {
        fallbackCopy();
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };
  return (
    <button
      onClick={handleShare}
      className="bg-transparent border border-white rounded-full px-4 py-1 text-white font-medium cursor-pointer"
    >
      Share
    </button>
  );
};
