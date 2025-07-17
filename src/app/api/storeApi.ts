/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
import { BASE_URL, getSessionTokenHeaders } from "./userApi";
import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const StoreAPI = {
  getProducts(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("products", {}, {}, "GET");
  },

  purchaseItem(productId: string, dispatch: any): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "purchaseItem",
      { productId },
      dispatch
    );
  },

  fetchCustomerWallet(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(`${BASE_URL}/fetchCustomerWallet`, {
      headers: getSessionTokenHeaders(),
    });
  },
  fetchTransactions(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(`${BASE_URL}/fetchTransactions`, {
      headers: getSessionTokenHeaders(),
    });
  },
};

export default StoreAPI;
