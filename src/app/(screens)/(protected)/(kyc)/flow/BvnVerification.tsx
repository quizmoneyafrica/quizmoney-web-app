"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
import { CircleCheck, Info } from "lucide-react";
import { useRouter } from "next/navigation";
// import Link from "next/link";

import CustomButton from "@/app/utils/CustomBtn";
import { useVerifyBvn, useVerificationStatus, useMe } from "@/lib/queries";
// import { toastPosition } from "@/app/utils/utils";
import Modal from "@/app/components/game/modal/ModalWindow";
import CustomImage from "@/app/components/wallet/CustomImage";
import QmDrawer from "@/app/components/drawer/drawer";
import QMLoader from "@/app/components/splashScreen/QMLoader";

const bvnSchema = z.object({
  bvn: z
    .string()
    .length(11, "BVN must be 11 digits")
    .regex(/^\d{11}$/, "BVN must contain only numbers"),
});

type BvnForm = z.infer<typeof bvnSchema>;

export default function BvnVerification({ onNext }: { onNext: () => void }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [enteredBvn, setEnteredBvn] = useState("");

  const router = useRouter();
  const { data: user, isFetching } = useMe();
  const verifyBvn = useVerifyBvn();
  const { refetch: refreshKyc } = useVerificationStatus();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BvnForm>({
    resolver: zodResolver(bvnSchema),
    defaultValues: { bvn: "" },
  });

  const onSubmit = (data: BvnForm) => {
    setEnteredBvn(data.bvn);
    setShowConfirmModal(true);
  };

  const confirmBvn = async () => {
    const info = {
      bvn: enteredBvn,
      first_name: user?.first_name || "John",
      last_name: user?.last_name || "Doe",
      date_of_birth: user?.date_of_birth || "",
    };
    try {
      await verifyBvn.mutateAsync(info);
      await refreshKyc();

      setShowConfirmModal(false);
      setSuccessModal(true);
      router.replace("/home");
    } catch {
      // Error already  handled in query
    }
  };

  const goToDashboard = () => {
    setSuccessModal(false);
    router.push("/home");
    onNext();
  };

  if (isFetching) {
    return (
      <div className="w-full grid place-items-center">
        <QMLoader />
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add BVN</h1>
        <p className="text-gray-600 text-sm">
          We use your BVN to verify your identity and secure your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Enter your Bank Verification Number (BVN)
          </label>
          <input
            {...register("bvn")}
            type="text"
            placeholder="Enter your 11-digit BVN"
            maxLength={11}
            inputMode="numeric"
            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-900"
          />
          {errors.bvn && (
            <p className="text-red-500 text-xs mt-2">{errors.bvn.message}</p>
          )}
        </div>

        <div className="bg-[#DEF2FF] p-5 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            Why do we need your BVN?
            <Info className="w-5 h-5" />
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CircleCheck className="text-green-600 w-5 h-5" />
              <span>Verify your full name</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck className="text-green-600 w-5 h-5" />
              <span>Verify your date of birth</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck className="text-green-600 w-5 h-5" />
              <span>Enable full wallet features</span>
            </div>
          </div>
        </div>

        <CustomButton
          type="submit"
          className="w-full"
          disabled={verifyBvn.isPending}
        >
          Verify BVN
        </CustomButton>
      </form>

      {/* Confirm Modal */}
      <Modal
        open={showConfirmModal}
        handleClose={() => setShowConfirmModal(false)}
        title="Confirm BVN"
        actionBtnText="Yes, Proceed"
        actionOnClick={confirmBvn}
        actionLoader={verifyBvn.isPending}
      >
        <p>
          Confirm <span className="font-bold">{enteredBvn}</span> is correct.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          You will be charged ₦100 for this verification.
        </p>
      </Modal>

      {/* Success Drawer */}
      <QmDrawer open={successModal} onOpenChange={goToDashboard} title="">
        <div className="flex flex-col items-center text-center pt-8">
          <CustomImage alt="success" src="/icons/success_bg.svg" />
          <h2 className="text-2xl font-bold mt-6">KYC Completed!</h2>
          <p className="text-gray-600 mt-2">
            Your identity has been verified successfully.
          </p>

          <CustomButton onClick={goToDashboard} className="mt-12 w-full">
            Go to Dashboard
          </CustomButton>
        </div>
      </QmDrawer>
    </div>
  );
}
