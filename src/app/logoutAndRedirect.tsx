/**
 * logoutAndRedirect.tsx
 *
 * Utility for force-logout from non-component contexts (e.g. Axios interceptor).
 * Clears Zustand auth state (which also wipes localStorage tokens).
 *
 * Removed: Redux store.dispatch, persistor.purge, walletSlice clears.
 * Wallet and server state are managed by React Query and cleared automatically
 * when auth state is cleared and the QueryClient is reset in api-client.ts.
 */

import { useAuthStore } from '@/lib/auth-store'

export async function logoutAndRedirect() {
  useAuthStore.getState().clearAuth()
}
