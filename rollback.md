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
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/verifyBVN`,
      { accountNumber, bvn, firstName, lastName, bankCode }
    );
  },
  isBVNVerified(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/isBVNVerified`,
      {},
    );
  },
  fetchCustomerWallet(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/fetchCustomerWallet`,
      {},
    );
  },
  fetchTransactions(page?: {
    page: number;
    limit: number;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/fetchTransactions`,
      page ? { ...page } : {}
    );
  },
  getCheckoutLink(data: {
    amount: string;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/getCheckoutLink`,
      { ...data },
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

  addBankAccount(data: any): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/addBankAccount`,
      { ...data },
    );
  },
  verifyAccount(data: {
    email: string;
    accountNumber: string;
    bankCode: string;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/verifyAccount`,
      { ...data },
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
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/fetchDedicatedAccount`,
      { ...data },
    );
  },
  createWithdrawalPin(data: {
    pin: string;
    edit?: boolean;
    oldPin?: string;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/createWithdrawalPin`,
      data?.edit ? { ...data } : { pin: data?.pin },
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

  forgotPin(data: { email: string }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/forgotPin`,
      { ...data },
    );
  },
  verifyPinOtp(data: {
    otp: string;
    email: string;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/verifyPinOtp`,
      { ...data },
    );
  },
  removeBankAccount(data: {
    bankAccount: {
      accountNumber: string;
      bankName: string;
      accountName: string;
    };
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/removeBankAccount`,
      { ...data },
    );
  },
  searchTransactions(data: {
    query: string;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `${BASE_URL}/searchTransactions`,
      { ...data },
    );
  },
};

export default WalletApi;
