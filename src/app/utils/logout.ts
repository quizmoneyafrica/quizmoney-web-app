/**
 * logout.ts
 *
 * Centralised logout utility.
 * Clears Zustand auth state (which also wipes localStorage tokens).
 *
 * Usage:
 *   import { performLogout } from '@/app/utils/logout'
 *   performLogout()           // from event handlers / non-hook contexts
 *
 * For mutation-based logout (e.g. calling POST /auth/logout before clearing),
 * use the useLogout() hook from '@/lib/queries' instead.
 */

import { useAuthStore } from '@/lib/auth-store'

/**
 * Synchronously clears auth state without calling the logout API.
 * Use this for force-logout scenarios (e.g. 401 after refresh fails,
 * account deletion, or manual sign-out where the API call is optional).
 */
export const performLogout = () => {
  useAuthStore.getState().clearAuth()
}
