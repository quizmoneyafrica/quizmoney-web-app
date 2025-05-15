import { FlatTransaction } from "@/app/utils/utils";
import { formatAmount } from "./ActivityRow";
interface TransactionDetailsModalProps {
  transaction: FlatTransaction;
  onClose: () => void;
  isOpen: boolean;
}

export function TransactionDetailsModal({
  transaction,
  onClose,
  isOpen,
}: TransactionDetailsModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  const statusColor =
    transaction.status === "successful" ? "text-green-500" : "text-gray-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Transaction Details</h2>
          <button onClick={onClose} className="p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4 pb-4 border-b border-dashed">
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction Date:</span>
              <span className="font-medium">
                {new Date(transaction.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mb-4 pb-4 border-b border-dashed">
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction Type:</span>
              <span className="font-medium capitalize">{transaction.type}</span>
            </div>
          </div>

          <div className="mb-4 pb-4 border-b border-dashed">
            <div className="flex justify-between">
              <span className="text-gray-500">Amount:</span>
              <span
                className={`font-medium ${
                  transaction.type === "deposit"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatAmount(transaction.amount)}
              </span>
            </div>
          </div>

          <div className="mb-4 pb-4 border-b border-dashed">
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction Status:</span>
              <span className={`font-medium capitalize ${statusColor}`}>
                {transaction.status || "Successful"}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-col">
              <span className="text-gray-500">Comments:</span>
              <span className="font-medium mt-1">
                {
                  "Transaction has been Approved payment has been sent your bank Account"
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
