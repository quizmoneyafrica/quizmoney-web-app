import { useAppSelector } from "@/app/hooks/useAuth";
import { QMCoin } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import React from "react";

type Props = {
  setOpenRedeem: (openRedeem: boolean) => void;
};
const CoinCard = ({ setOpenRedeem }: Props) => {
  const { wallet: walletData } = useAppSelector((state) => state.wallet);
  const handleRedeemCoin = () => {
    setOpenRedeem(true);
  };

  const wallet = walletData.find((w) => w.currency === "QMC")! || {};

  return (
    <div className="lg:h-full bg-info-900 text-white py-12 px-8 rounded-3xl relative overflow-hidden w-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-100 bg-[url('/assets/images/background.png')] lg:bg-[url('/assets/images/background-desktop.png')] bg-cover bg-center bg-no-repeat">
      <div className="space-y-4 relative z-10">
        <p className="text-sm opacity-90 text-center">QMC</p>
        <h1 className="md:text-4xl text-2xl font-bold text-center flex items-center justify-center gap-1">
          <QMCoin width={28} height={28} />
          {Number(wallet.availableBalance ?? 0).toLocaleString()}
        </h1>
        <CustomButton onClick={handleRedeemCoin} width="full" variant="coin">
          Redeem QM Coin
        </CustomButton>
      </div>
    </div>
  );
};

export default CoinCard;
