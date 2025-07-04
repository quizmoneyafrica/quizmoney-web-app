/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApiResponse,
  InAppChangePasswordForm,
  LoginForm,
  ResetPasswordForm,
  SignUpForm,
  UpdateUserForm,
  VerifyEmailForm,
  VerifyForgotPasswordOtpForm,
} from "./interface";
import { store } from "@/app/store/store";
import { callParseEndpoint } from "./parse/callParseEndpoint";
import { decryptData } from "../utils/crypto";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
const XParseApplicationId = process.env.NEXT_PUBLIC_XParseApplicationId;
const XParseRESTAPIKey = process.env.NEXT_PUBLIC_XParseRESTAPIKey;
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY!;

const appHeaders = {
  "X-Parse-Application-Id": XParseApplicationId,
  "X-Parse-REST-API-Key": XParseRESTAPIKey,
  "Content-Type": "application/json",
};
const getSessionTokenHeaders = () => {
  const encrypted = store.getState().auth.userEncryptedData;
  const user = encrypted ? decryptData(encrypted) : null;
  const sessionToken = user?.sessionToken;

  return {
    "X-Parse-Application-Id": process.env.NEXT_PUBLIC_XParseApplicationId!,
    "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_XParseRESTAPIKey!,
    "X-Parse-Session-Token": sessionToken,
    "Content-Type": "application/json",
  };
};

const getAuthUser = () => {
  const encrypted = store.getState().auth.userEncryptedData;
  const user = encrypted ? decryptData(encrypted) : null;
  return user;
};

const UserAPI = {
  checkSessionTokenValidity(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("checkSessionTokenValidity");
  },
  // login(form: LoginForm): Promise<ApiResponse> {
  //   return callParseEndpoint<ApiResponse>("login", form);
  // },
  login(form: LoginForm): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("auth/login", form);
  },

  signUp(form: SignUpForm): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("signup", form);
  },
  verifyEmail(form: VerifyEmailForm): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("verifyMail", form);
  },
  resendSignupOtp(email: string): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("resendSignupOtp", { email });
  },

  sendFeedback(form: any, dispatch: any): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("sendFeedback", form, dispatch);
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
      "updateSocialHandles",
      { facebook, twitter, whatsapp, instagram, tiktok },
      dispatch
    );
  },

  forgotPassword(email: string): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("forgotPassword", {
      email,
    });
  },
  verifyForgotPasswordOtp(
    form: VerifyForgotPasswordOtpForm
  ): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("forgotPassword", form);
  },
  resetPasswordAuth(form: ResetPasswordForm): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("changePassword", form);
  },

  inAppChangePassword(form: InAppChangePasswordForm): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("inAppChangePassword", form);
  },

  updateUser(form: UpdateUserForm): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `updateProfile?firstName=${form.firstName}&lastName=${form.lastName}&dob=${form.dob}&gender=${form.gender}&country=${form.country}&facebook=${form.facebook}&instagram=${form.instagram}&twitter=${form.twitter}&whatsapp=${form.whatsapp}&tiktok=${form.tiktok}&avatar=${form.avatar}`
    );
  },

  getAvatars(): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("avatars");
  },

  topGamersOfToday(): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("topGamersOfTheWeekend");
  },
  getReferralStats(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("referralData", {});
  },
};

export {
  appHeaders,
  getSessionTokenHeaders,
  BASE_URL,
  SOCKET_URL,
  XParseApplicationId,
  XParseRESTAPIKey,
  SECRET_KEY,
  getAuthUser,
};
export default UserAPI;
