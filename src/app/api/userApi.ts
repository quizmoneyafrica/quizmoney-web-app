import axios, { AxiosResponse } from "axios";
import {
	LoginForm,
	LoginResponse,
	SignUpForm,
	SignUpResponse,
	VerifyEmailForm,
	VerifyEmailResponse,
} from "./interface";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
const XParseApplicationId = process.env.NEXT_PUBLIC_XParseApplicationId;
const XParseRESTAPIKey = process.env.NEXT_PUBLIC_XParseRESTAPIKey;

const UserAPI = {
	login(form: LoginForm): Promise<AxiosResponse<LoginResponse>> {
		return axios.post(`${BASE_URL}/login`, form, {
			headers: {
				"X-Parse-Application-Id": XParseApplicationId,
				"X-Parse-REST-API-Key": XParseRESTAPIKey,
				"Content-Type": "application/json",
			},
		});
	},
	signUp(form: SignUpForm): Promise<AxiosResponse<SignUpResponse>> {
		console.log("Form: ", form);
		return axios.post(`${BASE_URL}/signup`, form, {
			headers: {
				"X-Parse-Application-Id": XParseApplicationId,
				"X-Parse-REST-API-Key": XParseRESTAPIKey,
				"Content-Type": "application/json",
			},
		});
	},
	verifyEmail(
		form: VerifyEmailForm
	): Promise<AxiosResponse<VerifyEmailResponse>> {
		console.log("Form: ", form);
		return axios.post(`${BASE_URL}/verifyMail`, form, {
			headers: {
				"X-Parse-Application-Id": XParseApplicationId,
				"X-Parse-REST-API-Key": XParseRESTAPIKey,
				"Content-Type": "application/json",
			},
		});
	},
	
};

export { BASE_URL, SOCKET_URL, XParseApplicationId, XParseRESTAPIKey };
export default UserAPI;
