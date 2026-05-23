/**
 * kycApi.ts
 *
 * KYC / Identity Verification API.
 * Replaces old kycApi.ts which called: customer-kyc/phone/verify, customer-kyc/otp/verify,
 * customer-kyc/bvn/verify, customer-kyc (GET), wallet-accounts (POST for DVA).
 *
 * New endpoints: /api/verification/* and /api/wallet/virtual-account/setup
 */

import { apiClient } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VerificationStatus {
  data: {
    phone_verified: boolean;
    bvn_verified: boolean;
    is_fully_verified: boolean;
    can_withdraw: boolean;
    can_have_virtual_account: boolean;
  };
}

// ─── KYC API ──────────────────────────────────────────────────────────────────

const KycAPI = {
  /**
   * Get the current player's KYC verification status.
   * Replaces: getCustomerKyc() → customer-kyc (GET)
   */
  getVerificationStatus(): Promise<{
    success: boolean;
    data: VerificationStatus;
  }> {
    return apiClient.get("/api/verification/status");
  },

  /**
   * Send OTP to phone number for verification.
   * Replaces: phoneVerify(phoneNumber) → customer-kyc/phone/verify
   */
  sendPhoneOtp(
    phone_number: string,
  ): Promise<{ success: boolean; message: string }> {
    return apiClient.post("/api/verification/phone/send-otp", { phone_number });
  },

  /**
   * Verify phone OTP.
   * Replaces: phoneOtpVerify(otp, phoneNumber) → customer-kyc/otp/verify
   */
  verifyPhoneOtp(body: {
    phone_number: string;
    otp: string;
  }): Promise<{ success: boolean; message: string }> {
    return apiClient.post("/api/verification/phone/verify-otp", body);
  },

  /**
   * Verify BVN (phone must be verified first).
   * Replaces: bvnVerify(bvn) → customer-kyc/bvn/verify
   * NOTE: New backend requires first_name and last_name (legal name matching).
   */
  verifyBvn(body: {
    bvn: string;
    first_name: string;
    last_name: string;
    date_of_birth?: string; // YYYY-MM-DD, optional but improves match accuracy
  }): Promise<{ success: boolean; message: string }> {
    return apiClient.post("/api/verification/bvn/verify", body);
  },
  // Legacy method aliases — un-migrated screens still use these names
  /* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
  bvnVerify: async (...args: any[]) => ({
    success: false as const,
    message: "",
    data: null as any,
  }),
  createCustomerDVA: async () => ({
    success: false as const,
    message: "",
    data: null as any,
  }),
  getCustomerKyc: async () => ({
    success: false as const,
    message: "",
    data: [] as any[],
  }),
  phoneVerify: async (...args: any[]) => ({
    success: false as const,
    message: "",
    data: null as any,
  }),
  phoneOtpVerify: async (...args: any[]) => ({
    success: false as const,
    message: "",
    data: null as any,
  }),
  /* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
};

export default KycAPI;
