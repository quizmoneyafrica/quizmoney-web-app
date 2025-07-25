/* eslint-disable @typescript-eslint/no-explicit-any */
import UserAPI, { getAuthUser } from "@/app/api/userApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { EraserIcon, QMCoin } from "@/app/icons/icons";
import { updateUser } from "@/app/store/authSlice";
import CustomButton from "@/app/utils/CustomBtn";
import { toastPosition } from "@/app/utils/utils";
import { ArrowRightLeft, Gamepad2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type Props = {
  setOpenRedeem: (openRedeem: boolean) => void;
};
export interface RewardObject {
  points: number;
  title: string;
  type: string;
  status: string;
  reward: Reward;
  freeGamesUsed: number;
  allRewardsUsed: boolean;
  description: string;
}

interface Reward {
  erasers: number;
  freeGames: number;
}
const RedeemModal = ({ setOpenRedeem }: Props) => {
  const { balance } = useAppSelector((state) => state.coin);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = getAuthUser();

  const handleCancel = () => setOpenRedeem(false);
  const handleRedeem = async () => {
    if (balance < 1500) {
      setOpenRedeem(false);
      toast.info("Not enough coin to redeem.", { position: toastPosition });
      return;
    }
    try {
      const res = await UserAPI.redeemCoin();
      const fullData = res.createdCoinTransaction;
      console.log(res.createdCoinTransaction);
      const rewardData: RewardObject = {
        points: fullData.points,
        title: fullData.title,
        type: fullData.type,
        status: fullData.status,
        reward: fullData.reward,
        freeGamesUsed: fullData.freeGamesUsed,
        allRewardsUsed: fullData.allRewardsUsed,
        description: fullData.description,
      };
      localStorage.setItem("rewardData", JSON.stringify(rewardData));
      router.push("/wallet/coin/success");
      dispatch(updateUser({ erasers: user.erasers + fullData.reward.erasers }));
    } catch (err: any) {
      console.log(err);
      toast.error(err.message, { position: toastPosition });
    }
  };
  return (
    <div className="space-y-4">
      <p className="-mt-3 text-sm">
        You&apos;re about to redeem your QM Coins for real money.
      </p>
      <div className="space-y-12">
        <div className="space-y-4">
          <div className="bg-primary-50 border border-primary-400 flex items-center justify-center gap-2 py-5 rounded-[10px]">
            <QMCoin />
            <p className="text-primary-900 font-bold text-base">
              1,500 QM Coin
            </p>
          </div>
          <div className="h-8 w-8 border border-primary-900 rounded-full mx-auto grid place-items-center">
            <ArrowRightLeft
              width={20}
              height={20}
              className="text-primary-900"
            />
          </div>
          <div className="bg-primary-50 text-primary-900 font-bold text-base border border-primary-400 flex items-center justify-center gap-2 py-5 rounded-[10px]">
            <Gamepad2Icon />
            <span>1 Free Game</span>
            <span>+</span>
            <EraserIcon width={20} height={20} />
            <span>1 Eraser</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CustomButton
            variant="outline"
            size="lg"
            width="full"
            onClick={handleCancel}
          >
            No, Cancel
          </CustomButton>
          <CustomButton size="lg" width="full" onClick={handleRedeem}>
            Redeem QM coin
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default RedeemModal;
