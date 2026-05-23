/**
 * useKycStep.ts
 *
 * Reads KYC / verification status via React Query.
 * Previously used Redux (kycSlice) — now delegates to useVerificationStatus()
 * from '@/lib/queries' which calls GET /api/verification/status.
 *
 * Return shape is identical to the old hook so existing screens need no changes.
 */

import { useVerificationStatus } from "@/lib/queries";

// Derived step type — keeps the same interface so existing UI screens don't break
export type CurrentStep = "PHONE" | "BVN" | "DONE" | null;

export const useKycStep = () => {
  const {
    data: status,
    isLoading,
    refetch: refreshKyc,
  } = useVerificationStatus();

  // Derive the current step from the flat status object
  let currentStep: CurrentStep = null;
  console.log("KYC STATUS ", status);

  if (status) {
    if (!status.phone_verified) {
      currentStep = "PHONE";
    } else if (!status.bvn_verified) {
      currentStep = "BVN";
    } else {
      currentStep = "DONE";
    }
  }

  // Compat: un-migrated screens destructure { customerKyc } as an array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customerKyc: any[] = status
    ? [
        {
          step: "PHONE",
          status: status.phone_verified ? "COMPLETED" : "PENDING",
        },
        {
          step: "BVN",
          status: status.bvn_verified ? "COMPLETED" : "PENDING",
        },
      ]
    : [];

  return {
    currentStep,
    status: status ?? null,
    isLoading,
    refreshKyc,
    customerKyc,
    canWithdraw: status?.can_withdraw ?? false,
    canHaveVirtualAccount: status?.can_have_virtual_account ?? false,
    isFullyVerified: status?.is_fully_verified ?? false,
  };
};
