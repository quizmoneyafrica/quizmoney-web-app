/**
 * profileApi.ts
 *
 * Player profile API calls.
 * Replaces the old userApi.ts profile/customer methods (customers/profile, customers PATCH, etc.)
 *
 * All endpoints: /api/profile/*  (all protected — require Bearer token)
 */

import { apiClient } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlayerProfile {
  success: boolean;
  data: Data;
}

interface Data {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  avatar_url: null;
  bio: null;
  date_of_birth: null;
  state: null;
  country: string;
  referral_code: string;
  created_at: string;
  updated_at: string;
  verification: Verification;
  wallet: Wallet;
  stats: Stats;
}

interface Stats {
  games_played: number;
  games_won: number;
  win_rate: number;
  best_rank: number;
  total_ngn_won_kobo: number;
  total_ngn_won_formatted: string;
  total_qmcoin_won: number;
  practice_sessions: number;
  practice_avg_score_percent: number;
}

interface Wallet {
  ngn_balance: number;
  ngn_balance_formatted: string;
  qmcoin_balance: number;
}

interface Verification {
  phone_verified: boolean;
  phone_verified_at: null;
  bvn_verified: boolean;
  bvn_verified_at: null;
}
// export interface PlayerProfile {
//   id: string
//   username: string
//   email: string
//   first_name: string | null
//   last_name: string | null
//   avatar_url: string | null
//   bio: string | null
//   date_of_birth: string | null
//   state: string | null
//   role: string
//   is_admin: boolean
//   is_active: boolean
//   created_at: string
//   // Stats included in full profile response
//   total_games_played?: number
//   total_wins?: number
//   referral_code?: string
// }

export interface GameHistoryEntry {
  id: string;
  game_id: string;
  score: number;
  rank: number;
  prize: number | null;
  played_at: string;
}

export interface ReferralStats {
  referral_code: string;
  referral_link: string;
  total_referrals: number;
  total_earnings: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Profile API ──────────────────────────────────────────────────────────────

const ProfileAPI = {
  /**
   * Get the current player's full profile including stats.
   */
  getMyProfile(): Promise<{ success: boolean; data: PlayerProfile }> {
    return apiClient.get("/api/profile/me");
  },

  /**
   * Update profile fields.
   */
  updateProfile(body: {
    username?: string;
    bio?: string;
    avatar_url?: string;
    date_of_birth?: string; // YYYY-MM-DD
    state?: string;
  }): Promise<{ success: boolean; data: PlayerProfile }> {
    return apiClient.patch("/api/profile/me", body);
  },

  /**
   * Get the current player's game history (paginated).
   */
  getMyGameHistory(query?: {
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: PaginatedResponse<GameHistoryEntry> }> {
    const params = new URLSearchParams();
    if (query?.page !== undefined) params.set("page", String(query.page));
    if (query?.limit !== undefined) params.set("limit", String(query.limit));
    const qs = params.toString();
    return apiClient.get(`/api/profile/me/games${qs ? `?${qs}` : ""}`);
  },

  /**
   * Get the current player's referral link and stats.
   */
  getMyReferrals(): Promise<{ success: boolean; data: ReferralStats }> {
    return apiClient.get("/api/profile/me/referrals");
  },

  /**
   * Permanently delete the current player's account.
   */
  deleteAccount(): Promise<{ success: boolean; message: string }> {
    return apiClient.delete("/api/profile/me");
  },
};

export default ProfileAPI;
