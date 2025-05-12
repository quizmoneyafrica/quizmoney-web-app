import { EyeOpenIcon, EyeNoneIcon, PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import CustomImage from "./CustomImage";
import { BottomSheet } from "./BottomSheet";
import { Dialog } from "radix-ui";
import DepositModalModal from "./DepositModalModal";
import { MobileDepositForm } from "./MobileDepositForm";
import WithdrawalModalModal from "./WithdrawalModal";
import { MobileWithdrawalForm } from "./MobileWithdrawalForm";
import WithdrawalPinModal from "./WithdrawalPinModal";
import MobileWithdrawalPinForm from "./MobileWithdrawalPinForm";
import WithdrawalSuccessModal from "./WithdrawalSuccessModal";
import MobileWithdrawalSuccess from "./MobileWithdrawalSuccess";
import StoreAPI from "@/app/api/storeApi";

export default function WalletBalance() {
  const [withdrawalModal, setOpenWithdrawal] = useState(false);
  const [open, setOpen] = useState(false);
  const [openPinModal, setOpenPinModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  const [activeDot, setActiveDot] = useState(0);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  useEffect(() => {
    StoreAPI.fetchCustomerWallet()
      .then((response) => {
        console.log("====================================");
        console.log(response.data.result);
        console.log("====================================");
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
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
            <button
              onClick={() => setOpen(true)}
              className="bg-[#3386CE]  cursor-pointer hover:bg-primary-700 px-6 py-3 rounded-full flex items-center gap-2 font-medium"
            >
              Deposit{" "}
              <span className="font-bold">
                <PlusIcon className=" text-white" />
              </span>
            </button>
            <button
              onClick={() => setOpenWithdrawal(true)}
              className="bg-[#E4F1FA] cursor-pointer hover:bg-gray-100 text-primary-700 px-6 py-3 rounded-full flex items-center gap-2 font-medium"
            >
              Withdraw <CustomImage alt="" src={"/icons/arrow-up.svg"} />
            </button>
          </div>
        </div>
      </div>

      {isMobile ? (
        <BottomSheet
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Deposit"
        >
          <MobileDepositForm onSubmit={() => {}} />
        </BottomSheet>
      ) : (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <DepositModalModal
            open={open}
            onOpenChange={setOpen}
            onSubmit={() => {}}
          />
        </Dialog.Root>
      )}
      {isMobile ? (
        <BottomSheet
          isOpen={withdrawalModal}
          onClose={() => setOpenWithdrawal(false)}
          title="Withdraw"
        >
          <MobileWithdrawalForm onSubmit={() => {}} />
        </BottomSheet>
      ) : (
        <Dialog.Root open={withdrawalModal} onOpenChange={setOpen}>
          <WithdrawalModalModal
            open={withdrawalModal}
            onOpenChange={setOpenWithdrawal}
            onSubmit={() => {}}
            onAddBank={function (): void {}}
            banks={[]}
          />
        </Dialog.Root>
      )}

      {isMobile ? (
        <BottomSheet
          isOpen={openPinModal}
          onClose={() => setOpenPinModal(false)}
          title="Create withdrawal pin "
        >
          <MobileWithdrawalPinForm onSubmit={() => {}} />
        </BottomSheet>
      ) : (
        <Dialog.Root open={openPinModal} onOpenChange={setOpenPinModal}>
          <WithdrawalPinModal
            open={openPinModal}
            onOpenChange={setOpenPinModal}
            onVerify={function (pin: string): void {
              console.log(pin);
            }}
          />
        </Dialog.Root>
      )}
      {isMobile ? (
        <BottomSheet
          full
          isOpen={openSuccessModal}
          onClose={() => setOpenSuccessModal(false)}
          title=" "
        >
          <MobileWithdrawalSuccess close={() => setOpenSuccessModal(false)} />
        </BottomSheet>
      ) : (
        <Dialog.Root open={openSuccessModal} onOpenChange={setOpenSuccessModal}>
          <WithdrawalSuccessModal
            open={openSuccessModal}
            onOpenChange={setOpenSuccessModal}
          />
        </Dialog.Root>
      )}
    </>
  );
}
