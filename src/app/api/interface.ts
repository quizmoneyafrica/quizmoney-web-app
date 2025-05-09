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
  otp: string;
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
//verifyForgotPasswordOtp interface
export interface ResetPasswordForm {
  email: string;
  password: string;
}

//Signup
export interface SignUpFormType {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  gender: string;
  country: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  promotionalMails: boolean;
  referredBy: string;
}

export interface Product {
  productImage: {
    name: string;
    url: string;
  };
  productDescription: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productCategory: string;
  stock: string;
  createdAt: string; // or Date if you're parsing it
  updatedAt: string; // or Date
  objectId: string;
}
