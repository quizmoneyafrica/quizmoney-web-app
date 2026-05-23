/**
 * authApi.ts
 *
 * Authentication API calls — register, login, verify email, password reset, logout.
 * Replaces the old userApi.ts auth methods (which used callParseEndpoint via /api/parse proxy).
 *
 * All endpoints: POST /api/auth/*
 * None of these require a Bearer token (except logout).
 */

import { apiClient } from "@/lib/api-client";

// ─── Response Types ───────────────────────────────────────────────────────────

export interface Player {
  id: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export interface LoginResult {
  data: { access_token: string; refresh_token: string; player: Player };
}

export interface AuthResponse<T = void> {
  success: boolean;
  message?: string;
  data?: T;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

const AuthAPI = {
  /**
   * Register a new player account.
   */
  register(body: {
    username: string;
    email: string;
    password: string;
    phone_number?: string;
    referral_code?: string;
  }): Promise<AuthResponse> {
    return apiClient.post("/api/auth/register", body, { skipAuth: true });
  },

  /**
   * Login with email + password.
   * Returns access_token, refresh_token and the player object.
   */
  login(body: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; data: LoginResult }> {
    return apiClient.post("/api/auth/login", body, { skipAuth: true });
  },

  /**
   * Verify email address with OTP sent during registration.
   */
  verifyEmail(body: { email: string; otp: string }): Promise<AuthResponse> {
    return apiClient.post("/api/auth/verify-email", body, { skipAuth: true });
  },

  /**
   * Resend OTP to email.
   * purpose: "email_verification" | "password_reset"
   */
  resendOtp(body: {
    email: string;
    purpose: "email_verification" | "password_reset";
  }): Promise<AuthResponse> {
    return apiClient.post("/api/auth/resend-otp", body, { skipAuth: true });
  },

  /**
   * Request a password reset OTP.
   */
  forgotPassword(body: { email: string }): Promise<AuthResponse> {
    return apiClient.post("/api/auth/forgot-password", body, {
      skipAuth: true,
    });
  },

  /**
   * Verify that the password reset OTP is valid (before showing the reset form).
   */
  verifyResetOtp(body: { email: string; otp: string }): Promise<AuthResponse> {
    return apiClient.post("/api/auth/verify-reset-otp", body, {
      skipAuth: true,
    });
  },

  /**
   * Reset password using verified OTP.
   */
  resetPassword(body: {
    email: string;
    otp: string;
    new_password: string;
  }): Promise<AuthResponse> {
    return apiClient.post("/api/auth/reset-password", body, { skipAuth: true });
  },

  /**
   * Logout and invalidate the refresh token on the server.
   * Requires auth (access token).
   */
  logout(body: { refresh_token: string }): Promise<AuthResponse> {
    return apiClient.post("/api/auth/logout", body);
  },
};

export default AuthAPI;
