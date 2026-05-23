'use client'

/**
 * useAuth.ts
 *
 * Convenience hook that exposes auth state from Zustand.
 * Replaces the old Redux-based version that used useAppSelector/useAppDispatch.
 *
 * useAppDispatch and useAppSelector are NOT exported here anymore —
 * they referenced the deleted Redux store. Any component still importing
 * them should be migrated to use useAuthStore directly or the hooks
 * exported from '@/lib/queries'.
 *
 * Usage:
 *   const { user, isAuthenticated, setAuth, clearAuth } = useAuth()
 */

import { useAuthStore } from '@/lib/auth-store'

export const useAuth = () => {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setAuth = useAuthStore((s) => s.setAuth)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const updateUser = useAuthStore((s) => s.updateUser)

  return {
    user,
    isAuthenticated,
    userEmail: user?.email ?? null,
    setAuth,
    clearAuth,
    updateUser,
    updateCustomer: updateUser,   // legacy alias
    accessToken: typeof window !== 'undefined' ? localStorage.getItem('qm_access_token') ?? '' : '',
  }
}

export default useAuth

// ─── Stub hooks for un-migrated screens ───────────────────────────────────────
// These prevent build errors in files that still import useAppSelector /
// useAppDispatch from here. They return a static mock state — screens using
// them will compile and render but won't reflect live data until migrated.
// TODO: remove once every screen is on Zustand / React Query.

// Using Record<string, any> for slice shapes so un-migrated screens can
// destructure any field without TypeScript complaining.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stubState: Record<string, any> = {
  auth: { user: null, isAuthenticated: false, rehydrated: true, accessToken: '', refreshToken: '' },
  wallet: { balance: null, transactions: [], loading: false, addBankModal: false, banks: [], payoutBanks: [], withdrawalModal: false, withdrawalPinModal: false, withdrawalData: null },
  game: { phase: '', isAllowedInGame: false, nextGameData: null, topGamers: [], showAdsScreen: false, openLeaveGame: false, totalTimeUsed: 0, currentLiveQuestion: null, audioShouldPlay: false, optionLocked: false },
  gameZone: { phase: '', audioShouldPlay: false, allGamesData: [], currentGameData: null },
  kyc: { customerKyc: null, isLoading: false },
  notifications: { notificationCount: 0, notifications: [] },
  store: { products: [] },
  leaderboard: { selectedPlayer: null, lastGame: [], allTime: [] },
  stompSub: { subscriptions: [] },
  demo: { demoData: null },
  coin: { coinBalance: null },
  withdrawalRequest: { withdrawalRequestData: null },
  numberGuess: { gameSettings: null, extraTrialBought: false, trials: 0, gameStatus: '', openBuyModal: false },
}

import type { RootState } from '@/app/store/store'
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  selector(stubState as unknown as RootState)

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const useAppDispatch = () => (_action: any) => {}
