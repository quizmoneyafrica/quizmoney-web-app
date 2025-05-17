import { Flex } from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import Image from "next/image";
import Modal from "@/app/components/modal/Modal";
import { Product } from "@/app/api/interface";
import SuccessMessageModal from "@/app/components/modal/store/SuccessMessageModal";
import StoreAPI from "@/app/api/storeApi";
import { useRouter } from "next/navigation";
import CustomButton from "@/app/utils/CustomBtn";
import { encryptData } from "@/app/utils/crypto";
import { useAuth } from "@/app/hooks/useAuth";
const ProductCard = ({ product }: { product: Product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { loginUser } = useAuth();

  const handlePurchase = async () => {
    setIsLoading(true);
    await StoreAPI.purchaseItem(product.objectId)
      .then((res) => {
        if (res.status === 200) {
          setIsOpen(false);
          setIsSuccess(true);
          const userData = res.data.result.updatedUser;
          const encryptedUser = encryptData(userData);
          // ✅ Dispatch to Redux
          loginUser(encryptedUser);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsOpen(false);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className=" h-[187px] md:h-[217px] bg-white border-zinc-200 border rounded-3xl p-8">
      <Flex justify="between" className=" h-full" align="center">
        <Flex direction="column" justify="between" gap="2" className=" h-full">
          <p className=" text-lg md:text-2xl font-bold">
            {product?.productName ?? "Eraser"}
          </p>
          <p className=" text-sm md:text-base">
            {product?.productDescription ??
              "Let you correct wrong answers in the game."}
          </p>

          <CustomButton
            onClick={() => setIsOpen(true)}
            className="!px-6 !py-2 md:!py-3 w-fit"
          >
            <div className="flex items-center gap-2 text-white font-semibold ">
              Buy <ArrowRightIcon />
            </div>
          </CustomButton>
        </Flex>
        <Flex
          height={{ md: "107px", initial: "90px" }}
          width={{ md: "105px", initial: "92px" }}
          className="rounded-xl bg-zinc-100"
          direction="column"
        >
          <div className="w-full flex-1 h-full flex flex-row justify-center items-center gap-2">
            <Image
              src="/icons/eraser.svg"
              alt="eraser"
              height={100}
              width={100}
              className="w-6 h-6 scale-150 border"
            />
            <p>x{product?.productQuantity ?? "2"}</p>
          </div>
          <div className="w-full h-[33px] -space-x-5 font-bold flex-[.5] overflow-hidden flex flex-row justify-center items-center gap-2 bg-primary-900 text-white rounded-b-xl">
            <Image
              src="/assets/images/chest.svg"
              alt="chest"
              height={1000}
              width={1000}
              className="w-10 h-10 scale-150 border"
            />

            <p className=" text-sm sm:text-lg font-bold pr-2">
              ₦{product?.productPrice}
            </p>
          </div>
        </Flex>
      </Flex>
      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        className=" !w-[1000px]"
        title="Verify Purchase"
        description={`Buy ${product?.productQuantity ?? "2"} ${
          product?.productName ?? "Eraser"
        }`}
      >
        <Flex
          direction={"column"}
          gap="2"
          justify={"between"}
          className=" min-h-[200px] "
        >
          <Flex
            gap="2"
            className="w-full border border-zinc-200 rounded-2xl p-4 mt-4"
            justify={"between"}
          >
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/eraser.svg"
                alt="eraser"
                height={100}
                width={100}
                className="w-6 h-6 scale-150 border"
              />
              <p>x{product?.productQuantity ?? "2"}</p>
              <p className="text-lg font-bold ">
                {product?.productName ?? "Eraser"}
              </p>
            </div>

            <div className="w-fit h-[33px] px-4 -space-x-5 font-bold  overflow-hidden flex flex-row justify-center items-center gap-2 bg-primary-900 text-white rounded-2xl">
              <Image
                src="/assets/images/chest.svg"
                alt="chest"
                height={1000}
                width={1000}
                className="w-10 h-10 scale-150 border"
              />

              <p className=" text-sm sm:text-base font-bold pr-2">
                ₦{product?.productPrice ?? "100"}
              </p>
            </div>
          </Flex>

          <CustomButton
            onClick={handlePurchase}
            loader={isLoading}
            disabled={isLoading}
          >
            Proceed to Pay ₦{product?.productPrice}
          </CustomButton>
        </Flex>
      </Modal>
      <SuccessMessageModal
        open={isSuccess}
        setOpen={setIsSuccess}
        success={true}
        message="Awesome!"
        subMessage={`You have successfully purchase ${product?.productQuantity} erasers.`}
        onClose={() => router.push("/home")}
        actionLabel="Go back Home"
      />
      <SuccessMessageModal
        open={isError}
        setOpen={setIsError}
        success={false}
        message="Insufficient Wallet Balance"
        subMessage={`Your purchase of ${product?.productQuantity} erasers failed due to insufficient funds`}
        onClose={() => router.push("/wallet")}
        actionLabel="Fund Account"
      />
    </div>
  );
};

export default ProductCard;
