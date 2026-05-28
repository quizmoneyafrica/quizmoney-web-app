//API Response Type
export interface ApiResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
//Login Interface
export interface LoginForm {
  username: string;
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
  email?: string;
  otp: string;
  purpose?: string;
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
  // email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface InAppChangePasswordForm {
  oldPassword: string;
  newPassword: string;
}

//Signup
export interface SignUpFormType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
  id: string;
  name: string;
  description: string;
  price_kobo: number;
  price_formatted: string; // e.g. "₦500.00"
  item_type: string;
  quantity?: number;
}
export interface UpdateProfile {
  firstName?: string;
  lastName?: string;
  dob?: string;
  country?: string;
  gender?: string;
  avatarUrl?: string;
  promotions?: boolean;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  whatsapp?: string;
  tiktok?: string;
}

export interface User {
  admin?: boolean;
  avatar?: string;
  balance?: string;
  country?: string;
  createdAt?: Date; // ISO Date string
  deviceToken?: string;
  dob?: {
    __type: "Date";
    iso: string; // ISO Date string
  };
  dummyAccount?: boolean;
  email?: string;
  emailVerified?: boolean;
  erasers?: number;
  firstName?: string;
  // games: []; // You can replace `any` with a proper Game interface if known
  gender?: "male" | "female";
  influencer?: boolean;
  lastName?: string;
  objectId?: string;
  otp?: string;
  otpExpiry?: {
    __type: "Date";
    iso?: Date;
  };
  promotionalMails?: boolean;
  referralCode?: string;
  referralPoints?: number;
  sessionToken?: string;
  updatedAt?: Date;
  username?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
}
