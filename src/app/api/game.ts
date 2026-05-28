/* eslint-disable */
// STUB — game is Socket.io only; HTTP game API removed

import { apiClient } from "@/lib/api-client";

export interface UpcomingGame {
  id: string;
  status: "scheduled" | "lobby" | "locked" | "active";
  scheduled_start_time: string;
  entry_fee_kobo: number;
  prize_percent: number;
  total_entry_collected_kobo: number;
  prize_pool_max_kobo: number | null;
  qmcoin_prize_total: number;
  title: string | null;
  is_sponsored: boolean;
  sponsor_name: string | null;
  sponsor_prize_boost_kobo: number | null;
  winner_count_percent: number;
  winner_count_max: number;
  ngn_winner_percent: number;
}

const GameApi = {
  fetchNextGame: async () => ({ success: false, data: null }),
  registerForGame: async (_gameId: string) => ({ success: false, data: null }),
  removeUserFromGame: async (_gameId: string) => ({
    success: false,
    data: null,
  }),
  getCurrentQuestion: async () => ({
    success: false,
    data: { id: "", question: "", options: [] as any[] },
  }),
  updateErasers: async (_erasersUsed: number) => ({
    success: false,
    data: null,
  }),
  submitAnswer: async (_optionId: any, _timeSpent?: any) => ({
    success: false,
    data: null,
  }),
  recordGameAnswer: async (..._args: any[]) => ({
    success: false as const,
    data: null,
  }),

  // New API method to fetch upcoming game details
  // getUpcomingGame(): Promise<{ success: boolean; data: UpcomingGame | null }> {
  //   return apiClient.get("/api/game/upcoming");
  // },
};

export default GameApi;

export const decryptGameData = (_data: any): any => _data;
