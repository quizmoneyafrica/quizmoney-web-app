/**
 * useWallet.ts
 *
 * Convenience wrappers around React Query wallet hooks.
 * Components that previously imported this hook keep working — they just
 * receive React Query state instead of Redux state.
 *
 * For direct usage in new components, import from '@/lib/queries' instead:
 *   import { useWalletBalance, useWalletTransactions } from '@/lib/queries'
 */

import {
  useWalletBalance as useWalletBalanceQuery,
  useWalletTransactions,
} from "@/lib/queries";

/**
 * Provides wallet balance and transactions via React Query.
 * Re-fetching is automatic — call `refetchBalance()` or `refetchTransactions()`
 * to manually trigger a refresh.
 */
function useWalletHook() {
  const { data: balanceData, refetch: refetchBalance } =
    useWalletBalanceQuery();
  const { refetch: refetchTransactions } = useWalletTransactions();

  return {
    /** Manually refetch the wallet balance */
    fetchWallet: refetchBalance,
    /** Manually refetch transactions (page 1) */
    fetchTransactions: refetchTransactions,
    /** Balance in kobo (for un-migrated screens that read ngnBalance) */
    ngnBalance: balanceData?.ngn_balance ?? null,
  };
}

export default useWalletHook;

// Stub alias — un-migrated screens import useWalletBalances from here
export const useWalletBalances = useWalletHook;

/**
 * Convenience hook for reading the wallet balance.
 * Returns balance in kobo — use <KoboAmount value={balanceKobo} /> for display.
 */
export function useWalletBalance() {
  const { data } = useWalletBalanceQuery();
  return {
    balanceKobo: data?.ngn_balance ?? 0,
    currency: "NGN",
  };
}
export function useQMCoinBalance() {
  const { data } = useWalletBalanceQuery();
  return {
    qmcoin_balance: data?.qmcoin_balance ?? 0,
    currency: "QMC",
  };
}
