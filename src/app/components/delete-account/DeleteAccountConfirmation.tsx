"use client";
import { useState } from "react";
import { Flex } from "@radix-ui/themes";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onCancel?: () => void;
  onConfirm?: (reason: string) => void;
  isLoading?: boolean;
};

const DeleteAccountConfirmation = ({
  onCancel,

  onConfirm,
  isLoading = false,
}: Props) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm?.(reason);
  };

  return (
    <div className="flex flex-col h-full pt-8">
      <div className="flex-1 flex flex-col justify-center text-center px-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
          Are you sure you want to delete your account?
        </h2>

        <p className="text-gray-600 text-sm sm:text-base mb-8 leading-relaxed">
          Deleting your account is permanent. You will lose your profile,
          progress, rewards, and purchased items.
        </p>

        <div className="mb-8">
          <label className="block text-left text-gray-700 text-sm font-medium mb-3">
            Tell us the reason why you want to delete your Account
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Optional"
            className="w-full p-4 border border-gray-300 rounded-xl resize-none h-24 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleConfirm}
          variant="destructive"
          className="flex-1 h-12 text-base font-semibold rounded-full bg-[#C30012] hover:bg-[#C30012]"
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Yes, Delete"}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 h-12 text-base font-semibold rounded-full bg-[#17478B] hover:bg-[#17478B] text-white border-[#17478B]"
          disabled={isLoading}
        >
          No, Cancel
        </Button>
      </div>
    </div>
  );
};

export default DeleteAccountConfirmation;
