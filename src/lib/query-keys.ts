/**
 * query-keys.ts
 *
 * Centralised React Query key factory.
 * Always import from here — never hardcode query key strings in components.
 *
 * Pattern:
 *   - Stable keys (no params): plain array  →  ['wallet', 'balance'] as const
 *   - Parameterised keys: function returning array  →  (params) => ['wallet', 'transactions', params]
 *
 * Invalidation tip:
 *   queryClient.invalidateQueries({ queryKey: ['wallet'] })
 *   → invalidates ALL wallet queries (balance, transactions, bank-accounts, etc.)
 */

export const queryKeys = {
  // ── Profile ───────────────────────────────────────────────────────────────
  me: ["profile", "me"] as const,
  myGameHistory: (params?: object) =>
    ["profile", "me", "games", params] as const,
  myReferrals: ["profile", "me", "referrals"] as const,

  // ── Wallet ────────────────────────────────────────────────────────────────
  walletBalance: ["wallet", "balance"] as const,
  walletTransactions: (params?: object) =>
    ["wallet", "transactions", params] as const,
  bankAccounts: ["wallet", "bank-accounts"] as const,
  banks: ["wallet", "banks"] as const,
  virtualAccount: ["wallet", "virtual-account"] as const,
  withdrawals: (params?: object) => ["wallet", "withdrawals", params] as const,

  // ── Leaderboard ──────────────────────────────────────────────────────────
  leaderboardLastGame: ["leaderboard", "last-game"] as const,
  leaderboardAllTime: (params?: object) =>
    ["leaderboard", "all-time", params] as const,
  leaderboardGame: (gameId: string) => ["leaderboard", "game", gameId] as const,
  myLastGameRank: ["leaderboard", "my-rank", "last-game"] as const,
  myAllTimeRank: ["leaderboard", "my-rank", "all-time"] as const,
  myLastGamePerformance: [
    "leaderboard",
    "my-performance",
    "last-game",
  ] as const,

  // ── KYC / Verification ───────────────────────────────────────────────────
  verificationStatus: ["verification", "status"] as const,

  // ── Store ─────────────────────────────────────────────────────────────────
  storeCatalogue: ["store", "catalogue"] as const,
  storeInventory: ["store", "inventory"] as const,

  // ── Game ──────────────────────────────────────────────────────────────────
  upcomingGame: ["game", "upcoming"] as const,
};
