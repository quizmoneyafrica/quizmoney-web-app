/* eslint-disable @typescript-eslint/no-explicit-any */
import UserAPI from "@/app/api/userApi";
import { useAppSelector } from "@/app/hooks/useAuth";
import { EraserIcon, QMCoin } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import { toastPosition } from "@/app/utils/utils";
import { ArrowRightLeft, Gamepad2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  setOpenRedeem: (openRedeem: boolean) => void;
};

const RedeemModal = ({ setOpenRedeem }: Props) => {
  const { balance } = useAppSelector((state) => state.coin);

  const handleCancel = () => setOpenRedeem(false);
  const handleRedeem = async () => {
    if (balance < 1500) {
      setOpenRedeem(false);
      toast.info("Not enough coin to redeem.", { position: toastPosition });
      return;
    }

    try {
      const res = await UserAPI.redeemCoin();
      console.log(res);
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <div className="space-y-4">
      <p className="-mt-3 text-sm">
        You&apos;re about to redeem your QMC for real money.
      </p>
      <div className="space-y-12">
        <div className="space-y-4">
          <div className="bg-primary-50 border border-primary-400 flex items-center justify-center gap-2 py-5 rounded-[10px]">
            <QMCoin />
            <p className="text-primary-900 font-bold text-base">1,500 QMC</p>
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
            Redeem Coin
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default RedeemModal;
