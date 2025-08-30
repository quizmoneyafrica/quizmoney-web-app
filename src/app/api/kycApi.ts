import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const KycAPI = {
  phoneVerify(phoneNumber: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "customer-kyc/phone/verify",
      { phoneNumber },
      {},
      "POST"
    );
  },

  phoneOtpVerify(otp: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "customer-kyc/otp/verify",
      { otp },
      {},
      "POST"
    );
  },
  bvnVerify(bvn: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "customer-kyc/bvn/verify",
      { bvn, subjectConsent: true },
      {},
      "POST"
    );
  },
  getCustomerKyc(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("customer-kyc", {}, {}, "GET");
  },
  createCustomerDVA(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("customer-kyc", {}, {}, "POST");
  },
  
};

export default KycAPI;
