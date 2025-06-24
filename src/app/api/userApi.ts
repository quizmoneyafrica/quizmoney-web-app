import axios, { AxiosResponse } from "axios";
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
  login(form: LoginForm): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("login", form);
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

  // sendFeedback(rating: string, message: string): Promise<ApiResponse> {
  //   return callWithSessionToken<ApiResponse>("sendFeedback", {
  //     rating,
  //     message,
  //   });
  // },
  sendFeedback(
    rating: string,
    message: string
  ): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/sendFeedback`,
      { rating, message },
      {
        headers: getSessionTokenHeaders(),
      }
    );
  },
  updateSocialHandles(
    facebook: string,
    twitter: string,
    whatsapp: string,
    instagram: string
  ): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/updateSocialHandles`,
      { facebook, twitter, whatsapp, instagram },
      {
        headers: getSessionTokenHeaders(),
      }
    );
  },
  // updateSocialHandles(
  //   facebook: string,
  //   twitter: string,
  //   whatsapp: string,
  //   instagram: string
  // ): Promise<ApiResponse> {
  //   return callWithSessionToken<ApiResponse>("updateSocialHandles", {
  //     facebook,
  //     twitter,
  //     whatsapp,
  //     instagram,
  //   });
  // },

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

  // inAppChangePassword(form: InAppChangePasswordForm): Promise<ApiResponse> {
  //   return callWithSessionToken<ApiResponse>("inAppChangePassword", form);
  // },
  inAppChangePassword(
    form: InAppChangePasswordForm
  ): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(`${BASE_URL}/inAppChangePassword`, form, {
      headers: getSessionTokenHeaders(),
    });
  },

  updateUser(form: UpdateUserForm): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `updateProfile?firstName=${form.firstName}&lastName=${form.lastName}&dob=${form.dob}&gender=${form.gender}&country=${form.country}&facebook=${form.facebook}&instagram=${form.instagram}&twitter=${form.twitter}&whatsapp=${form.whatsapp}&avatar=${form.avatar}`
    );
  },
  // updateUser(form: UpdateUserForm): Promise<AxiosResponse<ApiResponse>> {
  //   return axios.post(
  //     `${BASE_URL}/updateProfile?firstName=${form.firstName}&lastName=${form.lastName}&dob=${form.dob}&gender=${form.gender}&country=${form.country}&facebook=${form.facebook}&instagram=${form.instagram}&twitter=${form.twitter}&whatsapp=${form.whatsapp}&avatar=${form.avatar}`,
  //     {},
  //     {
  //       headers: getSessionTokenHeaders(),
  //     }
  //   );
  // },

  getAvatars(): Promise<AxiosResponse<ApiResponse>> {
    return axios.get(`https://quizmoney.b4a.io/classes/Avatars`, {
      headers: getSessionTokenHeaders(),
    });
  },

  // topGamersOfToday(): Promise<ApiResponse> {
  //   return callParseEndpoint<ApiResponse>(
  //     "topGamersOfTheWeekend",
  //     "",
  //     getAuthUser()?.sessionToken
  //   );
  // },
  topGamersOfToday(): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("topGamersOfTheWeekend");
  },
  // getReferralStats(): Promise<ApiResponse> {
  //   return callWithSessionToken<ApiResponse>("referralData", {});
  // },
  getReferralStats(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/referralData`,
      {},
      {
        headers: getSessionTokenHeaders(),
      }
    );
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
