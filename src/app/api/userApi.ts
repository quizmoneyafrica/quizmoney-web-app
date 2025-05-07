import axios, { AxiosResponse } from "axios";
import {
	ApiResponse,
	LoginForm,
	ResetPasswordForm,
	SignUpForm,
	VerifyEmailForm,
	VerifyForgotPasswordOtpForm,
} from "./interface";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
const XParseApplicationId = process.env.NEXT_PUBLIC_XParseApplicationId;
const XParseRESTAPIKey = process.env.NEXT_PUBLIC_XParseRESTAPIKey;

const UserAPI = {
	login(form: LoginForm): Promise<AxiosResponse<ApiResponse>> {
		return axios.post(`${BASE_URL}/login`, form, {
			headers: {
				"X-Parse-Application-Id": XParseApplicationId,
				"X-Parse-REST-API-Key": XParseRESTAPIKey,
				"Content-Type": "application/json",
			},
		});
	},
	signUp(form: SignUpForm): Promise<AxiosResponse<ApiResponse>> {
		console.log("Form: ", form);
		return axios.post(`${BASE_URL}/signup`, form, {
			headers: {
				"X-Parse-Application-Id": XParseApplicationId,
				"X-Parse-REST-API-Key": XParseRESTAPIKey,
				"Content-Type": "application/json",
			},
		});
	},
	verifyEmail(form: VerifyEmailForm): Promise<AxiosResponse<ApiResponse>> {
		console.log("Form: ", form);
		return axios.post(`${BASE_URL}/verifyMail`, form, {
			headers: {
				"X-Parse-Application-Id": XParseApplicationId,
				"X-Parse-REST-API-Key": XParseRESTAPIKey,
				"Content-Type": "application/json",
			},
		});
	},
	resendSignupOtp(email: string): Promise<AxiosResponse<ApiResponse>> {
		console.log("Form: ", email);
		return axios.post(
			`${BASE_URL}/resendSignupOtp`,
			{ email },
			{
				headers: {
					"X-Parse-Application-Id": XParseApplicationId,
					"X-Parse-REST-API-Key": XParseRESTAPIKey,
					"Content-Type": "application/json",
				},
			}
		);
	},

	forgotPassword(email: string): Promise<AxiosResponse<ApiResponse>> {
		return axios.post(
			`${BASE_URL}/forgotPassword`,
			{ email },
			{
				headers: {
					"X-Parse-Application-Id": XParseApplicationId,
					"X-Parse-REST-API-Key": XParseRESTAPIKey,
					"Content-Type": "application/json",
				},
			}
		);
	},
	verifyForgotPasswordOtp(
		form: VerifyForgotPasswordOtpForm
	): Promise<AxiosResponse<ApiResponse>> {
		return axios.post(`${BASE_URL}/verifyForgotPasswordOtp`, form, {
			headers: {
				"X-Parse-Application-Id": XParseApplicationId,
				"X-Parse-REST-API-Key": XParseRESTAPIKey,
				"Content-Type": "application/json",
			},
		});
	},
	resetPasswordAuth(
		form: ResetPasswordForm
	): Promise<AxiosResponse<ApiResponse>> {
		return axios.post(`${BASE_URL}/changePassword`, form, {
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
