//Login Interface
export interface LoginForm {
	email: string;
	password: string;
	deviceToken: string | null;
}

export interface LoginResponse {
	objectId: string;
	sessionToken: string;
	username: string;
	email?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

//Sign up interface
export interface SignUpForm {
	email: string;
	password: string;
	deviceToken: string | null;
}

export interface SignUpResponse {
	objectId: string;
	sessionToken: string;
	username: string;
	email?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

//VerifyEmail interface
export interface VerifyEmailForm {
	email: string;
	password: string;
	deviceToken: string | null;
}

export interface VerifyEmailResponse {
	objectId: string;
	sessionToken: string;
	username: string;
	email?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}
