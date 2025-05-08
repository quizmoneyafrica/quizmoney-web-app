import {
  EyeOpenIcon,
  EyeClosedIcon,
  EyeNoneIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes/components/button";
import { useState } from "react";
import CustomImage from "./CustomImage";

export default function WalletBalance() {
  const [activeDot, setActiveDot] = useState(0);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  return (
    <div className="bg-[#17478B] text-white py-12 px-8 rounded-3xl relative overflow-hidden w-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-95 bg-[url('/assets/images/bg.svg')] bg-cover bg-center bg-no-repeat">
      <div className="space-y-4 relative z-10">
        <p className="text-sm opacity-90 text-center">
          Available Wallet Balance
        </p>

        <h1 className="text-4xl font-bold text-center flex items-center justify-center gap-1">
          <span>₦</span>
          <span>{isBalanceHidden ? "****" : "50,000"}.</span>
          <span className="text-lg text-[#BCBCBB]">
            {isBalanceHidden ? "**" : "00"}
          </span>
          <button onClick={toggleBalanceVisibility}>
            {isBalanceHidden ? <EyeNoneIcon /> : <EyeOpenIcon />}
          </button>
        </h1>

        <div className="flex justify-center  gap-2 my-2">
          <button
            onClick={() => setActiveDot(0)}
            className={`h-2 w-2 rounded-full ${
              activeDot === 0 ? "bg-white" : "bg-white/40"
            }`}
          />
          <button
            onClick={() => setActiveDot(1)}
            className={`h-2 w-2 rounded-full ${
              activeDot === 1 ? "bg-white" : "bg-white/40"
            }`}
          />
        </div>

        <div className="flex gap-1 md:gap-4 mt-6 px-2 md:px-0 justify-center">
          <button className="bg-[#3386CE]  cursor-pointer hover:bg-primary-700 px-6 py-3 rounded-full flex items-center gap-2 font-medium">
            Deposit{" "}
            <span className="font-bold">
              <PlusIcon className=" text-white" />
            </span>
          </button>
          <button className="bg-[#E4F1FA] cursor-pointer hover:bg-gray-100 text-primary-700 px-6 py-3 rounded-full flex items-center gap-2 font-medium">
            Withdraw <CustomImage alt="" src={"/icons/arrow-up.svg"} />
          </button>
        </div>
      </div>
    </div>
  );
}
