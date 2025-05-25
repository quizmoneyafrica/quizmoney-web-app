import React from "react";
import { Flex } from "@radix-ui/themes";
import Image from "next/image";
import CustomButton from "@/app/utils/CustomBtn";
import QmDrawer from "../../drawer/drawer";

const SuccessMessageModal = ({
  open,
  setOpen,
  success,
  message,
  subMessage,
  onClose,
  actionLabel,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  success: boolean;
  message: string;
  subMessage: string;
  onClose: () => void;
  actionLabel: string;
}) => {
  const handleClose = () => {
    setOpen(false);
    onClose();
  };
  return (
    <>
      <QmDrawer open={open} onOpenChange={setOpen} trigger={<></>}>
        <div>
          <Flex
            direction="column"
            align="center"
            justify="center"
            gap="20px"
            className="py-10"
          >
            {success ? (
              <div className="bg-primary-50 rounded-full p-3">
                <Image
                  src="/icons/success.svg"
                  alt="success"
                  width={60}
                  height={60}
                />
              </div>
            ) : (
              <div className="bg-rose-50 rounded-full p-3">
                <Image
                  src="/icons/error.svg"
                  alt="error"
                  width={60}
                  height={60}
                />
              </div>
            )}
            <p className="text-lg font-bold">{message}</p>
            <p className="text-sm text-gray-500 text-center w-[80%]">
              {subMessage}
            </p>

            <CustomButton
              onClick={handleClose}
              className=" w-full font-semibold"
            >
              {actionLabel}
            </CustomButton>
          </Flex>
        </div>
      </QmDrawer>
      {/* <Modal open={open} onOpenChange={setOpen}>
        <Flex
          justify="center"
          align="center"
          direction="column"
          gap="30px"
          className="p-4 min-h-[400px] "
        >
          {success ? (
            <div className="bg-primary-50 rounded-full p-3">
              <Image
                src="/icons/success.svg"
                alt="success"
                width={60}
                height={60}
              />
            </div>
          ) : (
            <div className="bg-rose-50 rounded-full p-3">
              <Image
                src="/icons/error.svg"
                alt="error"
                width={60}
                height={60}
              />
            </div>
          )}
          <p className="text-lg font-bold">{message}</p>
          <p className="text-sm text-gray-500 text-center w-[80%]">
            {subMessage}
          </p>

          <CustomButton onClick={handleClose} className=" w-full font-semibold">
            {actionLabel}
          </CustomButton>
        </Flex>
      </Modal> */}
    </>
  );
};

export default SuccessMessageModal;
