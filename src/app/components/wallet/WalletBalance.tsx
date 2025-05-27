import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import CustomImage from "./CustomImage";
// import { BottomSheet } from "./BottomSheet";
// import { Dialog } from "radix-ui";
// import DepositModalModal from "./DepositModal";
import { MobileDepositForm } from "./MobileDepositForm";
// import WithdrawalModalModal from "./WithdrawalModal";
import { MobileWithdrawalForm } from "./MobileWithdrawalForm";
// import WithdrawalPinModal from "./WithdrawalPinModal";
import MobileWithdrawalPinForm from "./MobileWithdrawalPinForm";
// import WithdrawalSuccessModal from "./WithdrawalSuccessModal";
import MobileWithdrawalSuccess from "./MobileWithdrawalSuccess";
import { useSelector } from "react-redux";
import { store } from "@/app/store/store";
import { Loader } from "lucide-react";
import {
  setAddBankModal,
  setWithdrawalModal,
  setWithdrawalPinModal,
  useWallet,
} from "@/app/store/walletSlice";
import { toast } from "sonner";
import { formatNaira } from "@/app/utils/utils";
import { EyeIcon, EyeSlash } from "@/app/icons/icons";
import { MobileSuccessDeposit } from "./MobileSuccessDeposit";
import { useParams } from "next/navigation";
import QmDrawer from "../drawer/drawer";

export default function WalletBalance() {
  const [open, setOpen] = useState(false);
  const { success } = useParams();
  const [isSuccessfulDepositOpen, setIsSuccessfulDepositOpen] = useState(
    Boolean(success)
  );
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  // const [isMobile, setIsMobile] = useState(false);
  const { wallet, isWalletLoading, withdrawalModal, withdrawalPinModal } =
    useSelector(useWallet);

  // useEffect(() => {
  //   const checkIfMobile = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };

  //   checkIfMobile();

  //   window.addEventListener("resize", checkIfMobile);

  //   return () => window.removeEventListener("resize", checkIfMobile);
  // }, []);
  const [activeDot, setActiveDot] = useState(0);

  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };
  console.log(wallet);

  return (
    <>
      <div className="bg-[#17478B] text-white py-12 px-8 rounded-3xl relative overflow-hidden w-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-95 bg-[url('/assets/images/bg.svg')] bg-cover bg-center bg-no-repeat">
        <div className="space-y-4 relative z-10">
          <p className="text-sm opacity-90 text-center">
            Available Wallet Balance
          </p>

          {isWalletLoading ? (
            <Loader className=" animate-spin size-3 text-white" />
          ) : (
            <h1 className="text-4xl font-bold text-center flex items-center justify-center gap-1">
              <span>
                {isBalanceHidden
                  ? "****"
                  : `${formatNaira(
                      wallet?.balance ? wallet?.balance : "0",
                      true
                    )}`}
              </span>
              {/* <span className="text-lg text-[#BCBCBB]">
                {isBalanceHidden ? "**" : "00"}
              </span> */}
              <button
                onClick={toggleBalanceVisibility}
                className="cursor-pointer"
              >
                {isBalanceHidden ? <EyeSlash /> : <EyeIcon />}
              </button>
            </h1>
          )}
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
            <QmDrawer
              open={open}
              onOpenChange={setOpen}
              title="Deposit"
              titleLeft
              heightClass="h-[75%] md:h-[70%]"
              trigger={
                <button
                  onClick={() => setOpen(true)}
                  className="bg-[#3386CE]  cursor-pointer hover:bg-primary-700 px-6 py-3 rounded-full flex items-center gap-2 font-medium"
                >
                  Deposit{" "}
                  <span className="font-bold">
                    <PlusIcon className=" text-white" />
                  </span>
                </button>
              }
            >
              <MobileDepositForm />
            </QmDrawer>

            <QmDrawer
              open={withdrawalModal}
              onOpenChange={(val) => store.dispatch(setWithdrawalModal(val))}
              title="Withdraw"
              titleLeft
              heightClass="h-[75%] lg:h-auto"
              trigger={
                <button
                  onClick={() => {
                    if (wallet?.pin) {
                      store.dispatch(setWithdrawalModal(true));
                    } else {
                      store.dispatch(setWithdrawalPinModal(true));
                    }
                  }}
                  className="bg-[#E4F1FA] cursor-pointer hover:bg-gray-100 text-primary-700 px-6 py-3 rounded-full flex items-center gap-2 font-medium"
                >
                  Withdraw <CustomImage alt="" src={"/icons/arrow-up.svg"} />
                </button>
              }
            >
              <MobileWithdrawalForm
                onAddBank={() => {
                  if (
                    wallet?.bankAccounts &&
                    wallet?.bankAccounts.length >= 3
                  ) {
                    toast.info(
                      "You've already have three account number listed",
                      {
                        position: "top-right",
                      }
                    );

                    return;
                  }
                  store.dispatch(setWithdrawalModal(false));

                  store.dispatch(setAddBankModal(true));
                }}
              />
            </QmDrawer>
          </div>
        </div>
      </div>

      {/* {isMobile ? (
        <BottomSheet
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Deposit"
        >
          <MobileDepositForm />
        </BottomSheet>
      ) : (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <DepositModalModal open={open} onOpenChange={setOpen} />
        </Dialog.Root>
      )} */}
      {/* {isMobile ? (
        <BottomSheet
          isOpen={withdrawalModal}
          onClose={() => store.dispatch(setWithdrawalModal(false))}
          title="Withdraw"
        >
          <MobileWithdrawalForm
            onAddBank={() => {
              if (wallet?.bankAccounts && wallet?.bankAccounts.length >= 3) {
                toast.info("You've already have three account number listed", {
                  position: "top-right",
                });

                return;
              }
              store.dispatch(setWithdrawalModal(false));

              store.dispatch(setAddBankModal(true));
            }}
          />
        </BottomSheet>
      ) : (
        <Dialog.Root
          open={withdrawalModal}
          onOpenChange={(d) => store.dispatch(setWithdrawalModal(d))}
        >
          <WithdrawalModalModal
            open={withdrawalModal}
            onOpenChange={(d) => store.dispatch(setWithdrawalModal(d))}
            onAddBank={() => {
              if (wallet?.bankAccounts && wallet?.bankAccounts.length >= 3) {
                toast.info("You've already have three account number listed", {
                  position: "top-right",
                });

                return;
              }
              store.dispatch(setWithdrawalModal(false));

              store.dispatch(setAddBankModal(true));
            }}
          />
        </Dialog.Root>
      )} */}

      <>
        {/* Create withdrawal pin  */}
        <QmDrawer
          open={withdrawalPinModal}
          onOpenChange={(val) => store.dispatch(setWithdrawalPinModal(val))}
          title="Create withdrawal pin"
          titleLeft
          heightClass="h-[75%] lg:h-auto"
        >
          <MobileWithdrawalPinForm onSubmit={() => {}} />
        </QmDrawer>
        {/* {isMobile ? (
          <BottomSheet
            isOpen={withdrawalPinModal}
            onClose={() => store.dispatch(setWithdrawalPinModal(false))}
            title="Create withdrawal pin "
          >
            <MobileWithdrawalPinForm onSubmit={() => {}} />
          </BottomSheet>
        ) : (
          <Dialog.Root
            open={withdrawalPinModal}
            onOpenChange={(d) => store.dispatch(setWithdrawalPinModal(d))}
          >
            <WithdrawalPinModal
              open={withdrawalPinModal}
              onOpenChange={(d) => store.dispatch(setWithdrawalPinModal(d))}
            />
          </Dialog.Root>
        )} */}
      </>
      {/* WithdrawalSuccess  */}
      <QmDrawer
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        heightClass="h-[75%] lg:h-auto"
      >
        <MobileWithdrawalSuccess close={() => setOpenSuccessModal(false)} />
      </QmDrawer>

      {/* {isMobile ? (
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
      )} */}

      {/* Success modal */}
      <QmDrawer
        open={isSuccessfulDepositOpen}
        onOpenChange={setIsSuccessfulDepositOpen}
        heightClass="h-[75%] lg:h-auto"
      >
        <MobileSuccessDeposit
          title={Boolean(success) ? "Successful !" : "Failed !"}
        />
      </QmDrawer>

      {/* {isMobile ? (
        <BottomSheet
          isOpen={isSuccessfulDepositOpen}
          onClose={() => setIsSuccessfulDepositOpen(false)}
          title="Deposit"
        >
          <MobileSuccessDeposit
            title={Boolean(success) ? "Successful !" : "Failed !"}
          />
        </BottomSheet>
      ) : (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <SuccessfulDepositModal
            open={isSuccessfulDepositOpen}
            title={Boolean(success) ? "Successful !" : "Failed !"}
            onOpenChange={setIsSuccessfulDepositOpen}
          />
        </Dialog.Root>
      )} */}
    </>
  );
}
