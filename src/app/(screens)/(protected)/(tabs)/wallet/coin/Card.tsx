import { useAppSelector } from "@/app/hooks/useAuth";
import { QMCoin } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import React from "react";

type Props = {
  setOpenRedeem: (openRedeem: boolean) => void;
};
const CoinCard = ({ setOpenRedeem }: Props) => {
  const { balance } = useAppSelector((state) => state.coin);
  const handleRedeemCoin = () => {
    setOpenRedeem(true);
  };
  return (
    <div className="bg-info-900 text-white py-12 px-8 rounded-3xl relative overflow-hidden w-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-100 bg-[url('/assets/images/background.png')] lg:bg-[url('/assets/images/background-desktop.png')] bg-cover bg-center bg-no-repeat">
      <div className="space-y-4 relative z-10">
        <p className="text-sm opacity-90 text-center">QM Coins</p>
        <h1 className="md:text-4xl text-2xl font-bold text-center flex items-center justify-center gap-1">
          <QMCoin width={28} height={28} />
          {Number(balance).toLocaleString()}
        </h1>
        <CustomButton onClick={handleRedeemCoin} width="full" variant="coin">
          Redeem QM Coins
        </CustomButton>
      </div>
    </div>
  );
};

export default CoinCard;
