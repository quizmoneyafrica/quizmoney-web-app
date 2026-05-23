/**
 * leaderboardApi.ts
 *
 * Leaderboard API calls.
 * Replaces old leaderboardApi.ts which called:
 *   games/leaderboard/all-time, games/leaderboard, games (GET), games/stats
 *
 * New endpoints: /api/leaderboard/*
 */

import { apiClient } from '@/lib/api-client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number
  player_id: string
  username: string
  avatar_url: string | null
  score: number
  prize?: number | null       // in kobo
  prize_formatted?: string    // e.g. "₦1,000.00"
  is_admin?: boolean
}

export interface MyRank {
  rank: number
  score: number
  total_players: number
}

export interface MyLastGamePerformance {
  game_id: string
  rank: number
  score: number
  total_players: number
  correct_answers: number
  total_questions: number
  prize: number | null        // in kobo
  played_at: string
}

// ─── Leaderboard API ──────────────────────────────────────────────────────────

const LeaderboardAPI = {
  /**
   * Get leaderboard for the most recently completed game.
   * Replaces: getLastGameLeaderboard() → games/leaderboard
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLastGameLeaderboard(limit?: number, _page?: number): Promise<{ success: boolean; data: LeaderboardEntry[] }> {
    const qs = limit ? `?limit=${limit}` : ''
    return apiClient.get(`/api/leaderboard/last-game${qs}`)
  },

  /**
   * Get all-time leaderboard.
   * Replaces: getAllTimeLeaderboard() → games/leaderboard/all-time
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAllTimeLeaderboard(limit?: number, _page?: number): Promise<{ success: boolean; data: LeaderboardEntry[] }> {
    const qs = limit ? `?limit=${limit}` : ''
    return apiClient.get(`/api/leaderboard/all-time${qs}`)
  },

  /**
   * Get the current player's rank in the most recent game.
   * Replaces: userLastGameStat() → games/stats
   */
  getMyLastGameRank(): Promise<{ success: boolean; data: MyRank }> {
    return apiClient.get('/api/leaderboard/my-rank/last-game')
  },

  /**
   * Get the current player's all-time rank.
   */
  getMyAllTimeRank(): Promise<{ success: boolean; data: MyRank }> {
    return apiClient.get('/api/leaderboard/my-rank/all-time')
  },

  /**
   * Get leaderboard for a specific finished game by game ID.
   */
  getGameLeaderboard(
    gameId: string,
    limit?: number,
  ): Promise<{ success: boolean; data: LeaderboardEntry[] }> {
    const qs = limit ? `?limit=${limit}` : ''
    return apiClient.get(`/api/leaderboard/game/${gameId}${qs}`)
  },

  /**
   * Get the current player's detailed performance in the last game.
   * Use this for the post-game result screen.
   */
  getMyLastGamePerformance(): Promise<{ success: boolean; data: MyLastGamePerformance }> {
    return apiClient.get('/api/leaderboard/my-performance/last-game')
  },
}

export default LeaderboardAPI
