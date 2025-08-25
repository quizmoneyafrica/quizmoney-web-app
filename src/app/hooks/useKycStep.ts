import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { setCustomerKyc } from "@/app/store/kycSlice";
import KycAPI from "@/app/api/kycApi";

export type CurrentStep = "PHONE" | "BVN" | "DONE" | null;

export const useKycStep = () => {
  const dispatch = useAppDispatch();
  const customerKyc = useAppSelector((s) => s.kyc.customerKyc);

  const refreshKyc = useCallback(async () => {
    try {
      const res = await KycAPI.getCustomerKyc();
      dispatch(setCustomerKyc(res.data));
    } catch (err) {
      console.error("Failed to fetch KYC:", err);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!customerKyc.length) {
      refreshKyc();
    }
  }, [customerKyc.length, refreshKyc]);

  const phoneStep = customerKyc.find((s) => s.step === "PHONE");
  const bvnStep = customerKyc.find((s) => s.step === "BVN");

  let currentStep: CurrentStep = null;

  if (!phoneStep || phoneStep.status !== "COMPLETED") {
    currentStep = "PHONE";
  } else if (!bvnStep || bvnStep.status !== "COMPLETED") {
    currentStep = "BVN";
  } else {
    currentStep = "DONE";
  }

  return {
    currentStep,
    customerKyc,
    refreshKyc,
  };
};
