/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from "../store/store";
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
    return callWithSessionToken<ApiResponse>(`verifyBVN`, {
      accountNumber,
      bvn,
      firstName,
      lastName,
      bankCode,
    });
  },
  isBVNVerified(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(`isBVNVerified`, {});
  },
  fetchCustomerWallet(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("wallets", {}, {}, "GET");
  },

  fetchBanks(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("banks", {}, {}, "GET");
  },
  fetchPayoutBanks(): Promise<ApiResponse> {
    // return callWithSessionToken<ApiResponse>("payout-accounts", {}, {}, "GET");
  },
  confirmAccount(
    accountNumber: string,
    bankCode: string
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `banks/name-inquiry?accountNumber=${accountNumber}&bankCode=${bankCode}`,
      {},
      {},
      "GET"
    );
  },
  fetchTransactions(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `wallet-transactions`,
      {},
      {},
      "GET"
    );
  },

  getCheckoutLink(data: { amount: string }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(`getCheckoutLink`, { ...data });
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

  addBankAccount(data: any, dispatch: any): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `payout-accounts`,
      { ...data },
      dispatch
    );
  },

  verifyAccount(data: {
    email: string;
    accountNumber: string;
    bankCode: string;
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(`verifyAccount`, { ...data });
  },
  listBanks(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("listBanks", {});
  },
  fetchDedicatedAccount(data: { email: string }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(`fetchDedicatedAccount`, {
      ...data,
    });
  },
  createWithdrawalPin(data: { pin: string }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `users/pin/set-up`,
      { pin: data?.pin },
      {},
      "PATCH"
    );
  },
  requestWithdrawal(
    data: {
      amount: string;
      pin: string;
      purpose: string;
    },
    dispatch: any
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("withdraw", { ...data }, dispatch);
  },

  forgotPin(data: { email: string }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(`forgotPin`, { ...data });
  },
  verifyPinOtp(data: { otp: string; email: string }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(`verifyPinOtp`, { ...data });
  },
  removeBankAccount(data: {
    bankAccount: {
      accountNumber: string;
      bankName: string;
      accountName: string;
    };
  }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(`removeBankAccount`, { ...data });
  },
  searchTransactions(data: { query: string }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(`searchTransactions`, { ...data });
  },
};

export default WalletApi;
