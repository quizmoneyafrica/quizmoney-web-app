/**
 * auth-store.ts
 *
 * Zustand auth store — replaces Redux authSlice.
 * Mirrors the pattern from qm-admin-pwa-1/src/app/lib/auth-store.ts.
 *
 * User object + isAuthenticated are persisted to localStorage via zustand/persist.
 * Tokens are stored in localStorage via tokenStorage (for Axios interceptor access).
 * Access token is NOT kept in Zustand state — Axios interceptor reads it directly
 * from localStorage via tokenStorage.getAccessToken().
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Token Storage ────────────────────────────────────────────────────────────
// Tokens live in localStorage so the Axios interceptor can access them
// without needing the Zustand store (avoids circular imports).

const ACCESS_TOKEN_KEY = 'qm_access_token'
const REFRESH_TOKEN_KEY = 'qm_refresh_token'

export const tokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Player {
  id: string
  username: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  role: string
  is_admin: boolean
  is_active: boolean
  created_at: string
  // Extended fields returned by /api/profile/me
  phone_number?: string
  referral_code?: string
  coin_balance?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

interface AuthStore {
  user: Player | null
  isAuthenticated: boolean
  /** True once Zustand has rehydrated from localStorage on app boot */
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  /** Call after login or token refresh */
  setAuth: (user: Player, tokens: AuthTokens) => void
  /** Call on logout or session expiry */
  clearAuth: () => void
  /** Call after PATCH /api/profile/me */
  updateUser: (updates: Partial<Player>) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      setAuth: (user, tokens) => {
        tokenStorage.setTokens(tokens.access_token, tokens.refresh_token)
        set({ user, isAuthenticated: true })
      },

      clearAuth: () => {
        tokenStorage.clearTokens()
        set({ user: null, isAuthenticated: false })
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'qm_player_auth',
      // Only persist user + isAuthenticated — tokens are in their own localStorage keys
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
