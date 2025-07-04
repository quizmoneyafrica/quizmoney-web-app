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
      `verifyBVN`,
      { accountNumber, bvn, firstName, lastName, bankCode }
    );
  },
  isBVNVerified(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `isBVNVerified`,
      {},
    );
  },
  fetchCustomerWallet(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `fetchCustomerWallet`,
      {},
    );
  },
  fetchTransactions(page?: {
    page: number;
    limit: number;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `fetchTransactions`,
      page ? { ...page } : {}
    );
  },
  getCheckoutLink(data: {
    amount: string;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `getCheckoutLink`,
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
      `addBankAccount`,
      { ...data },
    );
  },
  verifyAccount(data: {
    email: string;
    accountNumber: string;
    bankCode: string;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `verifyAccount`,
      { ...data },
    );
  },
  listBanks(): Promise<ApiResponse> {
      return callWithSessionToken<ApiResponse>("listBanks", {});
    },
  fetchDedicatedAccount(data: {
    email: string;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `fetchDedicatedAccount`,
      { ...data },
    );
  },
  createWithdrawalPin(data: {
    pin: string;
    edit?: boolean;
    oldPin?: string;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `createWithdrawalPin`,
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
      `forgotPin`,
      { ...data },
    );
  },
  verifyPinOtp(data: {
    otp: string;
    email: string;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `verifyPinOtp`,
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
      `removeBankAccount`,
      { ...data },
    );
  },
  searchTransactions(data: {
    query: string;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `searchTransactions`,
      { ...data },
    );
  },
};

export default WalletApi;
