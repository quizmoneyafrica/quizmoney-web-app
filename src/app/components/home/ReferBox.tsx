import { Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React from "react";
type Props = {
  refCode: string;
};
function ReferBox({ refCode }: Props) {
  const router = useRouter();
  const fallbackCopy = () => {
    navigator.clipboard.writeText(refCode);
    // alert("Link copied to clipboard!");
  };
  const handleShare = async () => {
    fallbackCopy();
    router.push("/settings/invite-&-earn");
    // try {
    //   if (navigator.share) {
    //     await navigator.share({
    //       title: `🚀 Join Me on Quiz Money and Win Real Cash! 🧠💸`,
    //       text: `Hey! I’ve been playing Quiz Money — a fun trivia app where you answer questions and win cash instantly! 🎉 Use my referral code ${refCode} when signing up to get 50% bonus on your first deposit! 💰 Don't miss out, test your knowledge, compete daily, and earn real rewards!`,
    //       url: "https://quizmoney.ng",
    //     });
    //   } else {
    //     // alert("Sharing not supported on this device.");
    //     fallbackCopy();
    //   }
    // } catch (error) {
    //   console.error("Share failed:", error);
    // }
  };
  return (
    <div className="bg-primary-800 rounded-[20px] w-full px-6 py-6 grid grid-cols-1 gap-2">
      <Text className="text-neutral-50 font-bold text-xl">
        Refer & Earn with your Friends
      </Text>
      <Text className="text-neutral-100">
        Share with your friends and loved ones to come play
      </Text>
      <div className="pt-3">
        <button
          onClick={handleShare}
          className="bg-transparent border border-white rounded-full px-4 py-2 text-white font-medium cursor-pointer"
        >
          Invite Friends
        </button>
      </div>
    </div>
  );
}

export default ReferBox;
