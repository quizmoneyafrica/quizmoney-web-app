/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterType } from "../components/transactions/FilterBar";
import { store } from "../store/store";
import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const WalletApi = {
  verifyAccount(
    email: string,
    accountNumber: string,
    bankCode: string
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(``, {
      email,
      accountNumber,
      bankCode,
    });
  },
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
    return callWithSessionToken<ApiResponse>("payout-accounts", {}, {}, "GET");
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
  fetchTransactions({transactionStatus, searchText, page}: {transactionStatus?: FilterType, searchText?: string, page?: number}): Promise<ApiResponse> {
    const params = [];
    if (transactionStatus !== undefined && transactionStatus !== null) {
      params.push(`transactionStatus=${transactionStatus.toUpperCase()}`);
    }
    if (searchText !== undefined && searchText !== null && searchText !== "") {
      params.push(`searchText=${encodeURIComponent(searchText)}`);
    }
    if (page !== undefined && page !== null) {
      params.push(`page=${page}`);
    }
    const queryString = params.length ? `?${params.join("&")}` : "";
    return callWithSessionToken<ApiResponse>(
      `wallet-transactions${queryString}`,
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

  addBankAccount(data: any, dispatch?: any): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `payout-accounts`,
      { ...data },
      dispatch
    );
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
    amount: number,
    pin: string,
    purpose?: string,

    dispatch?: any
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "wallets/withdraw",
      { amount, pin, purpose },
      dispatch
    );
  },
  initializePaystack(data: { amount: number }): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "wallets/initialize/payment",
      { ...data },
      store.dispatch
    );
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
