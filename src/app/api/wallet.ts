import axios, { AxiosResponse } from "axios";
import { BASE_URL, getSessionTokenHeaders } from "./userApi";
import { ApiResponse } from "./interface";

const WalletApi = {
	fetchCustomerWallet(): Promise<AxiosResponse<ApiResponse>> {
		return axios.post(
			`${BASE_URL}/fetchCustomerWallet`,
			{},
			{ headers: getSessionTokenHeaders() }
		);
	},
	fetchTransactions(): Promise<AxiosResponse<ApiResponse>> {
		return axios.post(
			`${BASE_URL}/fetchTransactions`,
			{},
			{ headers: getSessionTokenHeaders() }
		);
	},
	getCheckoutLink(data:{amount:string}): Promise<AxiosResponse<ApiResponse>> {
		return axios.post(
			`${BASE_URL}/getCheckoutLink`,
			{...data},
			{ headers: getSessionTokenHeaders() }
		);
	},
};

export default WalletApi;
