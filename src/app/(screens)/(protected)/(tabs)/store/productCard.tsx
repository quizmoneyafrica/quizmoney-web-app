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
import { Eraser } from "@/app/icons/icons";
import { toast } from "sonner";

const displayColor = [
  {
    bg: "bg-[#ECF6FD]",
    text: "text-[#2A75BC]",
    button: "!bg-[#17478B]",
    border: "border-[#2980D6]",
  },
  {
    bg: "bg-[#E7FEED]",
    text: "text-[#00C449]",
    button: "!bg-[#009028]",
    border: "border-[#00B23D]",
  },
  {
    bg: "bg-[#F6E4F6]",
    text: "text-[#85119F]",
    button: "!bg-[#85119F]",
    border: "border-[#9817A6]",
  },
  {
    bg: "bg-[#FFEAEE]",
    text: "text-[#DE1528]",
    button: "!bg-[#C30012]",
    border: "border-[#DE1528]",
  },
  {
    bg: "bg-[#DFF9FF]",
    text: "text-[#00BBE3]",
    button: "!bg-[#00BBE3]",
    border: "border-[#00BBE3]",
  },
  {
    bg: "bg-[#FFFCE7]",
    text: "text-[#F8B93C]",
    button: "!bg-[#F8B93C]",
    border: "border-[#F4A235]",
  },
];

const ProductCard = ({
  product,
  index,
}: {
  product: Product;
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { loginUser } = useAuth();

  console.log(6 % (6 - index), index);
  // console.log(displayColor[index % displayColor.length]);

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
        const error =
          "Customer's balance is less than the amount you are about to deduct";
        if (err.response.data.error != error) {
          return toast.error(err.response.data.error, {
            position: "top-center",
          });
        }
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      <div
        className={` relative min-h-[265px] md:min-h-[289px] ${
          displayColor[index % displayColor.length].bg
        } ${
          displayColor[index % displayColor.length].border
        } border-2 rounded-3xl py-4`}
      >
        <Eraser
          className={` absolute top-3 right-0 ${
            displayColor[index % displayColor.length].text
          } opacity-10`}
        />

        <div className=" flex flex-col justify-between w-full h-full ">
          <div className=" px-4 z-10">
            <p
              className={`${
                displayColor[index % displayColor.length].text
              } md:text-[28px] text-[24px] font-bold`}
            >
              {product?.productName}
            </p>
            <p className=" font-semibold">{product?.productDescription}</p>
          </div>
          <div className="flex flow-row items-center my-4">
            <div
              className={` w-[20%] h-[1px] ${
                displayColor[index % displayColor.length].border
              } border-t`}
            />

            <div
              className={`bg-white ${
                displayColor[index % displayColor.length].border
              } border w-full rounded-2xl py-4 flex-1 flex flex-col items-center justify-center gap-2`}
            >
              <div className="flex-row flex  items-center">
                <p className=" text-2xl  font-semibold">
                  ₦{product?.productPrice.toLocaleString()}{" "}
                </p>
                <span className="font-semibold inline-flex pl-1">
                  / {product?.productQuantity} Erasers
                </span>
              </div>

              <p className=" bg-[#C4FBD2] text-[#009028] text-xs px-2 rounded-full">
                <span className=" font-semibold">
                  {product?.bonus > 0 ? product?.bonus : "No"}{" "}
                </span>
                Bonus Eraser
              </p>
            </div>

            <div
              className={` w-[20%] h-[1px] ${
                displayColor[index % displayColor.length].border
              } border-t`}
            />
          </div>
          <div className="px-4">
            <CustomButton
              onClick={() => setIsOpen(true)}
              className={`!px-6 !py-2 md:!py-3 w-full justify-center flex  ${
                displayColor[index % displayColor.length].button
              }`}
            >
              <div
                className={`flex items-center gap-2 text-white font-semibold `}
              >
                Buy Eraser <ArrowRightIcon />
              </div>
            </CustomButton>
          </div>
        </div>
      </div>
      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        className=" !w-[1000px]"
        title="Verify Purchase"
        description={``}
      >
        <Flex
          direction={"column"}
          gap="2"
          justify={"between"}
          className=" min-h-[230px] w-full  "
        >
          <Flex
            gap="2"
            className="w-full border border-primary-500 rounded-2xl p-3 py-6 md:px-6 mt-4"
            justify={"between"}
            align={"end"}
          >
            <div className=" space-y-3">
              <p className="font-bold ">{product?.productName}</p>
              <div className="flex gap-2 items-center">
                <Image
                  src="/icons/eraser.svg"
                  alt="eraser"
                  height={100}
                  width={100}
                  className="w-6 h-6 scale-150 border"
                />
                <p className=" text-blue-500">
                  {product?.productQuantity ?? "2"} Eraser
                </p>
                {product?.bonus > 0 && (
                  <p className=" text-[#00B23D] font-semibold">
                    {" "}
                    <span className=" font-semibold text-black">+</span>{" "}
                    {product?.bonus} Bonus
                  </p>
                )}
              </div>
            </div>

            <div className="w-fit h-[33px] px-4 -space-x-5 font-bold  overflow-hidden flex flex-row justify-center items-center gap-2 bg-primary-50 text-black rounded-md">
              <p className=" text-sm sm:text-base font-bold pr-2">
                ₦{product?.productPrice ?? "100"}
              </p>
            </div>
          </Flex>
        </Flex>
        <CustomButton
          onClick={handlePurchase}
          loader={isLoading}
          disabled={isLoading}
          className=" w-full"
        >
          Proceed to Pay ₦{product?.productPrice}
        </CustomButton>
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
    </>
  );
};

export default ProductCard;
