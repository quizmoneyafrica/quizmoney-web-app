//API Response Type
export interface ApiResponse {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}
//Login Interface
export interface LoginForm {
	email: string;
	password: string;
	deviceToken: string | null;
}

//Sign up interface
export interface SignUpForm {
	email: string;
	password: string;
	deviceToken: string | null;
}

//VerifyEmail interface
export interface VerifyEmailForm {
	email: string;
	password: string;
}

//ResendSignupOTP interface
export interface ResendSignupOTPForm {
	email: string;
}

//verifyForgotPasswordOtp interface
export interface VerifyForgotPasswordOtpForm {
	email: string;
	otp: string;
}

//forgotPassword interface
export interface forgotPasswordForm {
	email: string;
}
