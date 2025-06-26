
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
  getPaystackCheckoutLink(data: {
    amount: string;
  }): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/getPaystackCheckoutLink`,
      { ...data },
      { headers: getSessionTokenHeaders() }
    );
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  listBanks(): Promise<ApiResponse>  {
    return callWithSessionToken(
      `${BASE_URL}/listBanks`,
      {},
     
    );
  },
  fetchDedicatedAccount(data: {
    email: string;
  }):  Promise<AxiosResponse<ApiResponse>> {
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
  }): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/requestWithdrawal`,
      { ...data },
      { headers: getSessionTokenHeaders() }
    );
  },
  forgotPin(data: {email:string}):Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/forgotPin`,
      { ...data },

      { headers: getSessionTokenHeaders() }

      
     
    );
  },
  verifyPinOtp(data: {otp:string,email:string}):Promise<AxiosResponse<ApiResponse>> {
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
