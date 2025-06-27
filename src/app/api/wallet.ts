/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
import { BASE_URL, getSessionTokenHeaders } from "./userApi";
import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const WalletApi = {
  verifyBVN(
    accountNumber: string,
    bvn: string,
    firstName: string,
    lastName: string,
    bankCode: string
  ): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/verifyBVN`,
      { accountNumber, bvn, firstName, lastName, bankCode },
      { headers: getSessionTokenHeaders() }
    );
  },
  isBVNVerified(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/isBVNVerified`,
      {},
      { headers: getSessionTokenHeaders() }
    );
  },
  fetchCustomerWallet(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/fetchCustomerWallet`,
      {},
      { headers: getSessionTokenHeaders() }
    );
  },
  fetchTransactions(page?: {
    page: number;
    limit: number;
  }): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/fetchTransactions`,
      page ? { ...page } : {},
      { headers: getSessionTokenHeaders() }
    );
  },
  getCheckoutLink(data: {
    amount: string;
  }): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/getCheckoutLink`,
      { ...data },
      { headers: getSessionTokenHeaders() }
    );
  },
  getPaystackCheckoutLink(
    data: {
      amount: string;
    },
    dispatch: any
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "getPaystackCheckoutLink",
      { ...data },
      dispatch
    );
  },
  // getPaystackCheckoutLink(data: {
  //   amount: string;
  // }): Promise<AxiosResponse<ApiResponse>> {
  //   return axios.post(
  //     `${BASE_URL}/getPaystackCheckoutLink`,
  //     { ...data },
  //     { headers: getSessionTokenHeaders() }
  //   );
  // },

  addBankAccount(data: any): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/addBankAccount`,
      { ...data },
      { headers: getSessionTokenHeaders() }
    );
  },
  verifyAccount(data: {
    email: string;
    accountNumber: string;
    bankCode: string;
  }): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/verifyAccount`,
      { ...data },
      { headers: getSessionTokenHeaders() }
    );
  },
  listBanks(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/listBanks`,
      {},
      { headers: getSessionTokenHeaders() }
    );
  },
  fetchDedicatedAccount(data: {
    email: string;
  }): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/fetchDedicatedAccount`,
      { ...data },
      { headers: getSessionTokenHeaders() }
    );
  },
  createWithdrawalPin(data: {
    pin: string;
    edit?: boolean;
    oldPin?: string;
  }): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/createWithdrawalPin`,
      data?.edit ? { ...data } : { pin: data?.pin },
      { headers: getSessionTokenHeaders() }
    );
  },
  requestWithdrawal(data: {
    amount: string;
    pin: string;
    bankAccount: {
      accountNumber: string;
      bankName: string;
      accountName: string;
    };
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("requestWithdrawal", { ...data });
  },

  forgotPin(data: { email: string }): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/forgotPin`,
      { ...data },

      { headers: getSessionTokenHeaders() }
    );
  },
  verifyPinOtp(data: {
    otp: string;
    email: string;
  }): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/verifyPinOtp`,
      { ...data },
      { headers: getSessionTokenHeaders() }
    );
  },
  removeBankAccount(data: {
    bankAccount: {
      accountNumber: string;
      bankName: string;
      accountName: string;
    };
  }): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/removeBankAccount`,
      { ...data },
      { headers: getSessionTokenHeaders() }
    );
  },
  searchTransactions(data: {
    query: string;
  }): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/searchTransactions`,
      { ...data },
      { headers: getSessionTokenHeaders() }
    );
  },
};

export default WalletApi;
