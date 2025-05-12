import React from "react";
import Modal from "../Modal";
import { Flex } from "@radix-ui/themes";
import Image from "next/image";

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
    <Modal open={open} onOpenChange={setOpen}>
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
            <Image src="/icons/error.svg" alt="error" width={60} height={60} />
          </div>
        )}
        <p className="text-lg font-bold">{message}</p>
        <p className="text-sm text-gray-500 text-center w-[80%]">
          {subMessage}
        </p>
        <div
          className="bg-primary-900 text-white px-6 py-3 w-full rounded-full flex items-center gap-2 justify-center font-semibold"
          onClick={handleClose}
        >
          {actionLabel}
        </div>
      </Flex>
    </Modal>
  );
};

export default SuccessMessageModal;
