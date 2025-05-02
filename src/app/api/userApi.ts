import axios, { AxiosResponse } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
const XParseApplicationId = process.env.NEXT_PUBLIC_XParseApplicationId;
const XParseRESTAPIKey = process.env.NEXT_PUBLIC_XParseRESTAPIKey;

interface LoginForm {
	email: string;
	password: string;
	deviceToken: string | null;
}

interface LoginResponse {
	objectId: string;
	sessionToken: string;
	username: string;
	email?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

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
	
};

export { BASE_URL, SOCKET_URL, XParseApplicationId, XParseRESTAPIKey };
export default UserAPI;
