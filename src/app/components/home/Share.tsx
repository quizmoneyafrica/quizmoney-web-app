import { formatNaira, formatQuizDate } from "@/app/utils/utils";
import React from "react";

type Props = {
gamePrize: number
startDate: string;
};

export const ShareBtn = ({gamePrize,startDate}: Props) => {
    const fallbackCopy = () => {
		navigator.clipboard.writeText("https://quizmoney.ng");
		alert("Link copied to clipboard!");
	};
    const handleShare = async () => {
		try {
			if (navigator.share) {
				await navigator.share({
					title: `🎮 Join the Game Let's Win ${formatNaira(gamePrize)}!`,
					text: `Yo! I'm playing Quiz Money. Game starts ${formatQuizDate(startDate)}, and the prize is BIG!💰 Join before the countdown ends! 🕒`,
					url: "https://quizmoney.ng",
				});
			} else {
				// alert("Sharing not supported on this device.");
				fallbackCopy();
			}
		} catch (error) {
			console.error("Share failed:", error);
		}
	};
  return (
    <button onClick={handleShare} className="bg-transparent border border-white rounded-full px-4 py-1 text-white font-medium cursor-pointer">
      Share
    </button>
  );
};
