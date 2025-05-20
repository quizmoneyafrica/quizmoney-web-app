import { formatAmount } from "./ActivityRow";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/app/store/walletSlice";

interface TransactionDetailsModalProps {
  transaction: Transaction;
  onClose: () => void;
  isOpen: boolean;
}

export function TransactionDetailsModal({
  transaction,
  onClose,
  isOpen,
}: TransactionDetailsModalProps): React.ReactElement {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/35 bg-opacity-50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className=" px-3 md:px-0 fixed z-50 top-1/2 left-1/2 md:h-fit h-screen bg-white rounded-xl w-full max-w-[650px] overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20, x: "-50%", translateY: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%", translateY: "-50%" }}
                exit={{ opacity: 0, y: -20, x: "-50%", translateY: "-50%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="flex justify-between items-center p-6">
                  <Dialog.Title className="md:text-2xl text-lg font-bold text-[#303030]">
                    Transaction Details
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <motion.button
                      className="p-1 focus:outline-none"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </Dialog.Close>
                </div>

                <motion.div
                  className="bg-blue-50 mt-10 mx-6 mb-6 border border-dashed border-[#BCDDF4] rounded-xl p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    className="mb-6"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-primary-900  font-medium">
                        Transaction Date:
                      </span>
                      <span className="text-right text-gray-800 ">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-b border-dashed border-[#17478B] mt-4"></div>
                  </motion.div>

                  <motion.div
                    className="mb-6"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-primary-900  font-medium">
                        Transaction Type:
                      </span>
                      <span className="text-right text-gray-800  capitalize">
                        {transaction.type}
                      </span>
                    </div>
                    <div className="border-b border-dashed border-[#17478B] mt-4"></div>
                  </motion.div>

                  <motion.div
                    className="mb-6"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-primary-900  font-medium">
                        Amount:
                      </span>
                      <span
                        className={`text-right  font-medium ${
                          transaction.type === "deposit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "deposit" ? " " : "- "}
                        {formatAmount(transaction.amount)}
                      </span>
                    </div>
                    <div className="border-b border-dashed border-[#17478B] mt-4"></div>
                  </motion.div>

                  <motion.div
                    className="mb-6"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-primary-900  font-medium">
                        Transaction Status:
                      </span>
                      <span className="text-right text-green-600 ">
                        {transaction.status === "successful"
                          ? "Successful"
                          : transaction.status || "Successful"}
                      </span>
                    </div>
                    <div className="border-b border-dashed border-[#17478B] mt-4"></div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    <div>
                      <label className="text-primary-900  text-sm font-normal">
                        Comments:{" "}
                        <label className="text-gray-800 mt-2">
                          Transaction has been Approved payment has been sent
                          your bank Account
                        </label>
                      </label>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
}
