import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const LeaderboardAPI = {
  getAllTimeLeaderboard(
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `games/leaderboard/all-time?page=${page}&size=${size}`,
      {},
      "GET"
    );
  },

  // Add this method for last game leaderboard
  getLastGameLeaderboard(
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `games/leaderboard?page=${page}&size=${size}`,
      {},
      "GET"
    );
  },

  getUserGames(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(`games`, {}, "GET");
  },
  userLastGameStat(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(`games/stats`, {}, "GET");
  },
};

export default LeaderboardAPI;
