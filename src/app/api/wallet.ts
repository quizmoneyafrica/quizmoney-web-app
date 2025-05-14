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
	  // eslint-disable-next-line @typescript-eslint/no-explicit-any
	addBankAccount(data:any): Promise<AxiosResponse<ApiResponse>> {
		return axios.post(
			`${BASE_URL}/addBankAccount`,
			{...data},
			{ headers: getSessionTokenHeaders() }
		);
	},
	verifyAccount(data:{
		email:string;
		accountNumber: string;
		bankCode: string;
	}): Promise<AxiosResponse<ApiResponse>> {
		return axios.post(
			`${BASE_URL}/verifyAccount`,
			{...data},
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
};

export default WalletApi;
