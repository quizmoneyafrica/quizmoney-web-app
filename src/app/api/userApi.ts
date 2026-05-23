/* eslint-disable */
// STUB — replaced by authApi.ts (auth) + profileApi.ts (profile)
// This file prevents build errors in un-migrated screens that still import UserAPI.
// When migrating a screen: replace UserAPI calls with hooks from @/lib/queries

const UserAPI = {
  login: async (_form: any) => ({ success: false, data: {} as any }),
  customerProfile: async (_token: string) => ({ success: false, data: {} as any }),
  DeleteMyProfile: async (_reason: string) => ({ success: false, data: {} as any, timestamp: null as any }),
  signUp: async (_form: any) => ({ success: false, data: {} as any }),
  verifyEmail: async (_form: any) => ({ success: false, data: {} as any }),
  resendSignupOtp: async (_email: string) => ({ success: false, data: {} as any }),
  forgotPassword: async (_email: string) => ({ success: false, data: {} as any }),
  resetPasswordAuth: async (_form: any) => ({ success: false, data: {} as any }),
  inAppChangePassword: async (_form: any) => ({ success: false, data: {} as any }),
  updateUser: async (_form: any) => ({ success: false, data: {} as any }),
  updateProfile: async (_form: any) => ({ success: false, data: {} as any }),
  getGameErasers: async () => ({ success: false, data: {} as any }),
  getAvatars: async () => ({ success: false, data: {} as any }),
  getReferralCode: async () => ({ success: false, data: {} as any }),
  getReferralSummary: async () => ({ success: false, data: {} as any }),
  sendFeedback: async (_form: any) => ({ success: false, data: {} as any }),
  topGamersOfToday: async () => ({ success: false, data: {} as any }),
  getReferralStats: async () => ({ success: false, data: {} as any }),
  fetchUserCoinAccount: async () => ({ success: false, data: {} as any }),
  fetchCoinTransactions: async () => ({ success: false, data: {} as any }),
  redeemCoin: async () => ({ success: false, data: {} as any }),
  updateSocialHandles: async (..._args: any[]) => ({ success: false, data: {} as any }),
}

export default UserAPI

export const getAuthUser = () => ({} as any)
