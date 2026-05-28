/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex } from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import Image from "next/image";
import { StoreItem } from "@/app/api/storeApi";
import SuccessMessageModal from "@/app/components/modal/store/SuccessMessageModal";
import { useRouter } from "next/navigation";
import CustomButton from "@/app/utils/CustomBtn";
import { Eraser } from "@/app/icons/icons";
import { formatNaira } from "@/lib/utils";
import Modal from "@/app/components/game/modal/ModalWindow";
import { usePurchaseItem } from "@/lib/queries";
import { Minus, Plus } from "lucide-react";

const displayColor = [
  { bg: "bg-[#ECF6FD]", text: "text-[#2A75BC]", button: "!bg-[#17478B]", border: "border-[#2980D6]" },
  { bg: "bg-[#E7FEED]", text: "text-[#00C449]", button: "!bg-[#009028]", border: "border-[#00B23D]" },
  { bg: "bg-[#F6E4F6]", text: "text-[#85119F]", button: "!bg-[#85119F]", border: "border-[#9817A6]" },
  { bg: "bg-[#FFEAEE]", text: "text-[#DE1528]", button: "!bg-[#C30012]", border: "border-[#DE1528]" },
  { bg: "bg-[#DFF9FF]", text: "text-[#00BBE3]", button: "!bg-[#00BBE3]", border: "border-[#00BBE3]" },
  { bg: "bg-[#FFFCE7]", text: "text-[#F8B93C]", button: "!bg-[#F8B93C]", border: "border-[#F4A235]" },
];

const MAX_QTY = 10;
const MIN_QTY = 1;

const ProductCard = ({ product, index }: { product: StoreItem; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const { mutate: purchaseItem, isPending: isLoading } = usePurchaseItem();

  const colors = displayColor[index % displayColor.length];
  const unitPrice = product.price_kobo;
  const totalKobo = unitPrice * quantity;

  const adjustQty = (delta: number) => {
    setQuantity((q) => Math.min(MAX_QTY, Math.max(MIN_QTY, q + delta)));
  };

  const handlePurchase = () => {
    purchaseItem(
      { item_id: product.id, quantity },
      {
        onSuccess: (res: any) => {
          const result = res?.data?.data;
          setIsOpen(false);
          setSuccessMessage(
            result
              ? `You bought ${result.quantity_purchased}x ${result.item_name} for ${result.total_cost_formatted}.`
              : `You successfully purchased ${quantity}x ${product.name}.`,
          );
          setQuantity(1);
          setIsSuccess(true);
        },
        onError: (err: any) => {
          setIsOpen(false);
          const message =
            err?.response?.data?.message || err?.message || "Purchase failed";
          if (
            message.toLowerCase().includes("insufficient") ||
            message.toLowerCase().includes("balance")
          ) {
            setIsError(true);
          }
        },
      },
    );
  };

  return (
    <section>
      {/* ─── Product Card ──────────────────────────────────── */}
      <div
        className={`relative min-h-[265px] md:min-h-[289px] ${colors.bg} ${colors.border} border-2 rounded-3xl py-4 overflow-hidden`}
      >
        <Eraser
          className={`absolute top-3 right-0 ${colors.text} opacity-10`}
        />

        <div className="flex flex-col justify-between w-full h-full">
          {/* Name + description */}
          <div className="px-4 z-10">
            <p className={`${colors.text} md:text-[28px] text-[24px] font-bold`}>
              {product.name}
            </p>
            {product.description && (
              <p className="font-semibold text-neutral-700 text-sm">
                {product.description}
              </p>
            )}
          </div>

          {/* Price strip */}
          <div className="flex flex-row items-center my-4">
            <div className={`w-[20%] h-[1px] ${colors.border} border-t`} />
            <div
              className={`bg-white ${colors.border} border w-full rounded-2xl py-3 flex-1 flex flex-col items-center justify-center gap-1`}
            >
              <p className="text-xl font-bold">
                {product.price_formatted}
              </p>
              <span className="text-xs text-neutral-500">per eraser</span>
            </div>
            <div className={`w-[20%] h-[1px] ${colors.border} border-t`} />
          </div>

          {/* Quantity stepper + buy button */}
          <div className="px-4 space-y-3">
            {/* Stepper */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-neutral-200 px-3 py-2">
              <button
                type="button"
                onClick={() => adjustQty(-1)}
                disabled={quantity <= MIN_QTY}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-colors ${
                  quantity <= MIN_QTY
                    ? "text-neutral-300 cursor-not-allowed"
                    : `${colors.text} hover:opacity-70`
                }`}
              >
                <Minus size={16} />
              </button>

              <div className="text-center">
                <span className="text-xl font-bold text-neutral-800">
                  {quantity}
                </span>
                <p className="text-xs text-neutral-400">
                  = {formatNaira(totalKobo)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => adjustQty(1)}
                disabled={quantity >= MAX_QTY}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-colors ${
                  quantity >= MAX_QTY
                    ? "text-neutral-300 cursor-not-allowed"
                    : `${colors.text} hover:opacity-70`
                }`}
              >
                <Plus size={16} />
              </button>
            </div>

            <CustomButton
              onClick={() => setIsOpen(true)}
              className={`!px-6 !py-2 md:!py-3 w-full justify-center flex ${colors.button}`}
            >
              Buy {quantity > 1 ? `${quantity} Erasers` : "Eraser"}
              <ArrowRightIcon className="ml-1" />
            </CustomButton>
          </div>
        </div>
      </div>

      {/* ─── Confirmation Modal ────────────────────────────── */}
      {isOpen && (
        <Modal
          open={isOpen}
          handleClose={setIsOpen}
          title="Confirm Purchase"
          showBtns={false}
        >
          <Flex
            direction="column"
            gap="3"
            justify="between"
            className="min-h-[230px] w-full"
          >
            {/* Order summary */}
            <div className="border border-primary-200 rounded-2xl p-4 mt-4 space-y-3 bg-primary-50/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/eraser.svg"
                    alt="eraser"
                    height={24}
                    width={24}
                    className="scale-125"
                  />
                  <span className="font-semibold text-neutral-800">
                    {product.name}
                  </span>
                </div>
                <span className="text-sm text-neutral-500">
                  × {quantity}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-primary-200 pt-3">
                <span className="text-sm text-neutral-500">Unit price</span>
                <span className="font-medium">{product.price_formatted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-800">
                  Total
                </span>
                <span className="text-lg font-bold text-primary-900">
                  {formatNaira(totalKobo)}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 text-center">
              Amount will be deducted from your wallet balance.
            </p>

            <CustomButton
              onClick={handlePurchase}
              loader={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              Pay {formatNaira(totalKobo)}
            </CustomButton>
          </Flex>
        </Modal>
      )}

      {/* ─── Success Modal ─────────────────────────────────── */}
      {isSuccess && (
        <SuccessMessageModal
          open={isSuccess}
          setOpen={setIsSuccess}
          success={true}
          message="Purchase Successful!"
          subMessage={successMessage}
          onClose={() => setIsSuccess(false)}
          actionLabel="Keep Shopping"
        />
      )}

      {/* ─── Insufficient Balance Modal ────────────────────── */}
      {isError && (
        <SuccessMessageModal
          open={isError}
          setOpen={setIsError}
          success={false}
          message="Insufficient Balance"
          subMessage="Your wallet balance is too low. Fund your account to continue."
          onClose={() => router.push("/wallet")}
          actionLabel="Fund Wallet"
        />
      )}
    </section>
  );
};

export default ProductCard;
