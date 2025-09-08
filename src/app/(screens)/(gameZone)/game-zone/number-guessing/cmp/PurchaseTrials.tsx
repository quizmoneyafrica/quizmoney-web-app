/* eslint-disable @typescript-eslint/no-explicit-any */
import QMLoader from "@/app/components/splashScreen/QMLoader";
import { useWalletBalances } from "@/app/hooks/useWallet";
import { ArrowDownIcon } from "@/app/icons/icons";
import CustomSelect from "@/app/utils/CustomSelect";
import { GameButton } from "@/app/utils/GameButton";
import { formatNaira } from "@/app/utils/utils";
import { InfoIcon, TriangleAlert, Wallet2Icon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type Option = {
  label: string;
  value: number;
};
const SelectOptions: Option[] = [
  {
    label: "0",
    value: 0,
  },
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
];

type Props = {
  setTrials: React.Dispatch<React.SetStateAction<number>>;
  setOpenBuyModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PurchaseTrials({ setTrials, setOpenBuyModal }: Props) {
  const { ngnBalance } = useWalletBalances();
  const [selectedTrials, setSelectedTrials] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const buyTrials = () => {
    setErrorMessage(null);
    if (selectedTrials > 0) {
      setIsLoading(true);
      try {
        setTrials((t: number) => t + selectedTrials);
        // setMessage("2 extra trials!");
        setOpenBuyModal(false);
        toast.success("You're Back In!", { position: "top-center" });
      } catch (err: any) {
        setErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Pick how many trials you want.");
    }
  };
  return (
    <div className="relative space-y-6">
      <section className="grid grid-cols-2 place-items-center border-2 border-primary-700 rounded p-4">
        <div className="flex gap-2 text-sm w-full">
          <Wallet2Icon className="text-primary-700" />
          <div>
            <span>Wallet Balance:</span>
            <p className="font-medium text-primary-700">
              {formatNaira(Number(ngnBalance))}
            </p>
          </div>
        </div>

        <div className="flex justify-end items-center w-full">
          <button className="bg-primary-700 rounded px-3 p-1.5 text-sm text-white">
            Fund Wallet
          </button>
        </div>
      </section>
      <form className="space-y-5">
        <div>
          <div className="space-y-4">
            <CustomSelect
              label="How my trials do you want buy?"
              options={SelectOptions}
              disabledOption="Select trials"
              className="border rounded-3xl px-4 py-2 w-full"
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
              ) => {
                const target = e.target as HTMLInputElement | HTMLSelectElement;
                const { value } = target;
                setSelectedTrials(Number(value));
              }}
              icon={<ArrowDownIcon />}
              required
            />
            {errorMessage && (
              <div className="border border-error-300 bg-error-100 rounded w-full p-4 text-xs text-error-900">
                <div className="flex items-center gap-1">
                  <TriangleAlert width={17} fill="#ffcbd2" color="#e60000" />
                  <p>
                    <span className="font-medium">Error: </span>
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}
            <div className="border border-primary-300 bg-primary-100 rounded w-full p-4 grid grid-cols-2">
              <p className="text-sm">Amount</p>
              <p className="text-end font-bold text-primary-900">
                {formatNaira(Number(1000), true)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <InfoIcon width={17} fill="#e60000" color="#fff" />
              <p className="text-xs text-neutral-500">
                <span className="font-bold">Note:</span>
                You can purchase maximum of 2 Trials only per game session.
              </p>
            </div>
          </div>
        </div>
        <GameButton
          text="Buy Trial"
          type="button"
          onClick={buyTrials}
          disabled={isLoading}
        />
      </form>

      {/* loading  */}
      {isLoading && (
        <div className="absolute top-0 left-0 bg-white z-50 flex items-center justify-center w-full h-full">
          <QMLoader />
        </div>
      )}
    </div>
  );
}
