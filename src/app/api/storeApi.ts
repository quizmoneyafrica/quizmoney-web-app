import axios, { AxiosResponse } from "axios";
import { appHeaders, BASE_URL, getSessionTokenHeaders } from "./userApi";
import { ApiResponse } from "./interface";

const StoreAPI = {
  getProducts(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(`${BASE_URL}/getProducts`, {}, { headers: appHeaders });
  },

	getProductById(productId: string): Promise<AxiosResponse<ApiResponse>> {
		return axios.post(
			`${BASE_URL}/fetchSingleProduct`,
			{ productId },
			{ headers: appHeaders }
		);
	},
	purchaseItem(productId: string): Promise<AxiosResponse<ApiResponse>> {
		return axios.post(
			`${BASE_URL}/purchaseItem`,
			{ productId },
			{ headers: getSessionTokenHeaders() }
		);
	},
	fetchCustomerWallet(): Promise<AxiosResponse<ApiResponse>> {
		const headers=getSessionTokenHeaders() 
		console.log('=========fetchCustomerWallet===========================');
		console.log(JSON.stringify(headers,null,2));
		console.log('===========fetchCustomerWallet=========================');
		return axios.post(
			`${BASE_URL}/fetchCustomerWallet`,
			{ headers: {
				...headers
			}}
		);
	},
	fetchTransactions(): Promise<AxiosResponse<ApiResponse>> {
		return axios.post(
			`${BASE_URL}/fetchTransactions`,
			{},
			{ headers: getSessionTokenHeaders() }
		);
	},
};

export default StoreAPI;
