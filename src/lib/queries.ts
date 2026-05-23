/**
 * queries.ts
 *
 * ALL React Query hooks for the QuizMoney player app.
 * Mirrors the pattern from qm-admin-pwa-1/src/app/lib/queries.ts.
 *
 * Components should ONLY import from this file — never call useQuery/useMutation directly.
 * API functions (authApi, WalletAPI, etc.) are called here, not in components.
 *
 * Pattern:
 *   useXxx()        → useQuery  (reading data)
 *   useDoXxx()      → useMutation (writing / side effects)
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore, tokenStorage, Player } from "@/lib/auth-store";
import AuthAPI from "@/app/api/authApi";
import ProfileAPI from "@/app/api/profileApi";
import WalletAPI from "@/app/api/wallet";
import KycAPI from "@/app/api/kycApi";
import LeaderboardAPI from "@/app/api/leaderboardApi";
import StoreAPI from "@/app/api/storeApi";
import NotificationAPI from "@/app/api/notification";
import { toastPosition } from "@/app/utils/utils";

// ─── Auth Mutations ───────────────────────────────────────────────────────────

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      AuthAPI.login({ email, password }),
    onSuccess: (res) => {
      const { access_token, refresh_token, player } = res.data.data;
      setAuth(player, { access_token, refresh_token });
      console.log("USER LOGGED IN:", player, { access_token, refresh_token });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Login failed", {
        position: toastPosition,
      });
    },
  });
};

export const useRegister = () =>
  useMutation({
    mutationFn: AuthAPI.register,
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Registration failed", {
        position: toastPosition,
      });
    },
  });

export const useVerifyEmail = () =>
  useMutation({
    mutationFn: AuthAPI.verifyEmail,
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "OTP verification failed", {
        position: toastPosition,
      });
    },
  });

export const useResendOtp = () =>
  useMutation({
    mutationFn: AuthAPI.resendOtp,
    onSuccess: () => toast.success("OTP sent"),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to resend OTP", {
        position: toastPosition,
      });
    },
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: ({ email }: { email: string }) =>
      AuthAPI.forgotPassword({ email }),
    onSuccess: () => toast.success("Reset OTP sent to your email"),
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to send reset OTP",
        {
          position: toastPosition,
        },
      );
    },
  });

export const useVerifyResetOtp = () =>
  useMutation({
    mutationFn: AuthAPI.verifyResetOtp,
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Invalid OTP", {
        position: toastPosition,
      });
    },
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: AuthAPI.resetPassword,
    onSuccess: () => toast.success("Password reset successfully"),
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to reset password",
        {
          position: toastPosition,
        },
      );
    },
  });

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      AuthAPI.logout({ refresh_token: tokenStorage.getRefreshToken() ?? "" }),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    },
  });
};

// ─── Profile Queries & Mutations ──────────────────────────────────────────────

export const useMe = () =>
  useQuery({
    queryKey: queryKeys.me,
    queryFn: () => ProfileAPI.getMyProfile(),
    select: (res) => res.data as Player,
    staleTime: 1000 * 60 * 5,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: ProfileAPI.updateProfile,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      // Keep Zustand in sync for nav/header display
      updateUser({
        username: res.data.username,
        avatar_url: res.data.avatar_url,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
      });
      toast.success("Profile updated");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update profile",
        {
          position: toastPosition,
        },
      );
    },
  });
};

export const useMyGameHistory = (params?: { page?: number; limit?: number }) =>
  useQuery({
    queryKey: queryKeys.myGameHistory(params),
    queryFn: () => ProfileAPI.getMyGameHistory(params),
    select: (res) => res.data,
  });

export const useMyReferrals = () =>
  useQuery({
    queryKey: queryKeys.myReferrals,
    queryFn: ProfileAPI.getMyReferrals,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

export const useDeleteAccount = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ProfileAPI.deleteAccount,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete account",
        {
          position: toastPosition,
        },
      );
    },
  });
};

// ─── Wallet Queries & Mutations ───────────────────────────────────────────────

export const useWalletBalance = () =>
  useQuery({
    queryKey: queryKeys.walletBalance,
    queryFn: WalletAPI.getBalance,
    select: (res) => res.data,
    staleTime: 1000 * 30, // 30 seconds — balance changes frequently
  });

export const useWalletTransactions = (params?: {
  page?: number;
  limit?: number;
  type?: string;
}) =>
  useQuery({
    queryKey: queryKeys.walletTransactions(params),
    queryFn: () => WalletAPI.getTransactions(params),
    select: (res) => res.data,
    staleTime: 1000 * 60,
  });

export const useVirtualAccount = () =>
  useQuery({
    queryKey: queryKeys.virtualAccount,
    queryFn: WalletAPI.getVirtualAccount,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 10,
  });

export const useSetupVirtualAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: WalletAPI.setupVirtualAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.virtualAccount });
      toast.success("Virtual account created");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create virtual account",
        {
          position: toastPosition,
        },
      );
    },
  });
};

export const useInitiateDeposit = () =>
  useMutation({
    mutationFn: (amount: number) => WalletAPI.initiateDeposit(amount),
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to initiate deposit",
        {
          position: toastPosition,
        },
      );
    },
  });

export const useBanks = () =>
  useQuery({
    queryKey: queryKeys.banks,
    queryFn: WalletAPI.getBanks,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 60, // 1 hour — bank list rarely changes
  });

export const useResolveBankAccount = () =>
  useMutation({
    mutationFn: WalletAPI.resolveBankAccount,
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Could not verify account",
        {
          position: toastPosition,
        },
      );
    },
  });

export const useBankAccounts = () =>
  useQuery({
    queryKey: queryKeys.bankAccounts,
    queryFn: WalletAPI.getBankAccounts,
    select: (res) => res.data,
  });

export const useAddBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: WalletAPI.addBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccounts });
      toast.success("Bank account saved");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to save bank account",
        {
          position: toastPosition,
        },
      );
    },
  });
};

export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) => WalletAPI.deleteBankAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccounts });
      toast.success("Bank account removed");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove account",
        {
          position: toastPosition,
        },
      );
    },
  });
};

export const useSetDefaultBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) =>
      WalletAPI.setDefaultBankAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccounts });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to set default", {
        position: toastPosition,
      });
    },
  });
};

export const useRequestWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: WalletAPI.requestWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.walletBalance });
      queryClient.invalidateQueries({ queryKey: ["wallet", "withdrawals"] });
      toast.success("Withdrawal request submitted");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Withdrawal request failed",
        {
          position: toastPosition,
        },
      );
    },
  });
};

export const useWithdrawalHistory = (params?: {
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: queryKeys.withdrawals(params),
    queryFn: () => WalletAPI.getWithdrawalHistory(params),
    select: (res) => res.data,
  });

// ─── Leaderboard Queries ──────────────────────────────────────────────────────

export const useLastGameLeaderboard = (limit?: number) =>
  useQuery({
    queryKey: queryKeys.leaderboardLastGame,
    queryFn: () => LeaderboardAPI.getLastGameLeaderboard(limit),
    select: (res) => res.data,
    staleTime: 1000 * 60 * 2,
  });

export const useAllTimeLeaderboard = (limit?: number) =>
  useQuery({
    queryKey: queryKeys.leaderboardAllTime({ limit }),
    queryFn: () => LeaderboardAPI.getAllTimeLeaderboard(limit),
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

export const useGameLeaderboard = (gameId: string) =>
  useQuery({
    queryKey: queryKeys.leaderboardGame(gameId),
    queryFn: () => LeaderboardAPI.getGameLeaderboard(gameId),
    select: (res) => res.data,
    enabled: !!gameId,
  });

export const useMyLastGameRank = () =>
  useQuery({
    queryKey: queryKeys.myLastGameRank,
    queryFn: LeaderboardAPI.getMyLastGameRank,
    select: (res) => res.data,
  });

export const useMyAllTimeRank = () =>
  useQuery({
    queryKey: queryKeys.myAllTimeRank,
    queryFn: LeaderboardAPI.getMyAllTimeRank,
    select: (res) => res.data,
  });

export const useMyLastGamePerformance = () =>
  useQuery({
    queryKey: queryKeys.myLastGamePerformance,
    queryFn: LeaderboardAPI.getMyLastGamePerformance,
    select: (res) => res.data,
  });

// ─── KYC / Verification ───────────────────────────────────────────────────────

export const useVerificationStatus = () =>
  useQuery({
    queryKey: queryKeys.verificationStatus,
    queryFn: KycAPI.getVerificationStatus,
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 2,
  });

export const useSendPhoneOtp = () =>
  useMutation({
    mutationFn: (phone_number: string) => KycAPI.sendPhoneOtp(phone_number),
    onSuccess: () => toast.success("OTP sent to your phone"),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send OTP", {
        position: toastPosition,
      });
    },
  });

export const useVerifyPhoneOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: KycAPI.verifyPhoneOtp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.verificationStatus });
      toast.success("Phone number verified");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "OTP verification failed", {
        position: toastPosition,
      });
    },
  });
};

export const useVerifyBvn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: KycAPI.verifyBvn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.verificationStatus });
      toast.success("BVN verified successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "BVN verification failed", {
        position: toastPosition,
      });
    },
  });
};

// ─── Store Queries & Mutations ────────────────────────────────────────────────

export const useStoreCatalogue = () =>
  useQuery({
    queryKey: queryKeys.storeCatalogue,
    queryFn: StoreAPI.getCatalogue,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });

export const useStoreInventory = () =>
  useQuery({
    queryKey: queryKeys.storeInventory,
    queryFn: StoreAPI.getInventory,
    select: (res) => res.data,
  });

export const usePurchaseItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: StoreAPI.purchaseItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.storeInventory });
      queryClient.invalidateQueries({ queryKey: queryKeys.walletBalance });
      toast.success("Item purchased");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Purchase failed", {
        position: toastPosition,
      });
    },
  });
};

export const usePurchaseScratchCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: StoreAPI.purchaseScratchCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.walletBalance });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Purchase failed", {
        position: toastPosition,
      });
    },
  });
};

// ─── Push Notifications ───────────────────────────────────────────────────────

export const useSubscribePush = () =>
  useMutation({
    mutationFn: NotificationAPI.subscribe,
    onError: (error: any) => {
      console.warn("Push subscription failed:", error?.response?.data?.message);
    },
  });

export const useUnsubscribePush = () =>
  useMutation({
    mutationFn: NotificationAPI.unsubscribe,
  });
