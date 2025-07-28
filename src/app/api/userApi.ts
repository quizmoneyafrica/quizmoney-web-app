/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserObject } from "../store/authSlice";
import { store } from "../store/store";
import {
  ApiResponse,
  InAppChangePasswordForm,
  LoginForm,
  ResetPasswordForm,
  SignUpForm,
  VerifyEmailForm,
} from "./interface";
import { callParseEndpoint } from "./parse/callParseEndpoint";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const getAuthUser = () => {
  const state = store.getState();
  return state.auth.user;
};

const UserAPI = {
  login(form: LoginForm): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("auth/login", form);
  },
  customerProfile(accessToken: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "customers/profile",
      {},
      {},
      "GET",
      accessToken
    );
  },
  signUp(form: SignUpForm): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("auth/register", form);
  },
  verifyEmail(form: VerifyEmailForm): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("auth/otp/verify", form);
  },
  resendSignupOtp(email: string): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("auth/resend", { email });
  },
  forgotPassword(email: string): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("auth/password/forgot", {
      email,
    });
  },

  resetPasswordAuth(form: ResetPasswordForm): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("auth/password/reset", form);
  },
  inAppChangePassword(form: InAppChangePasswordForm): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "customers/password/change",
      form,
      {},
      "PATCH"
    );
  },
  updateUser(form: UserObject): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("customers", form, {}, "PATCH");
  },
  updateSocialHandles(
    facebook: string,
    twitter: string,
    whatsapp: string,
    instagram: string,
    tiktok: string,
    dispatch: any
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "socials",
      { facebook, twitter, whatsapp, instagram, tiktok },
      dispatch,
      "PATCH"
    );
  },
  getGameErasers(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("erasers", {}, {}, "GET");
  },
  getAvatars(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("avatars", {}, {}, "GET");
  },
  getReferralCode(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("referrals/code", {}, {}, "GET");
  },
  getReferralSummary(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "referrals/summary",
      {},
      {},
      "GET"
    );
  },
  sendFeedback(form: any, dispatch: any): Promise<ApiResponse> {
    // return callWithSessionToken<ApiResponse>("sendFeedback", form, dispatch);
  },

  topGamersOfToday(): Promise<ApiResponse> {
    // return callParseEndpoint<ApiResponse>("topGamersOfTheWeekend");
  },
  getReferralStats(): Promise<ApiResponse> {
    // return callWithSessionToken<ApiResponse>("referralData", {});
  },
  fetchUserCoinAccount(): Promise<ApiResponse> {
    // return callWithSessionToken<ApiResponse>("fetchUserCoinAccount", {});
  },
  fetchCoinTransactions(): Promise<ApiResponse> {
    // return callWithSessionToken<ApiResponse>("fetchCoinTransactions", {});
  },
  redeemCoin(): Promise<ApiResponse> {
    // return callWithSessionToken<ApiResponse>("redeemCoinPoints", {});
  },
};

export {
  getSessionTokenHeaders,
  BASE_URL,
  SOCKET_URL,
  XParseApplicationId,
  XParseRESTAPIKey,
  SECRET_KEY,
  getAuthUser,
};
export default UserAPI;
