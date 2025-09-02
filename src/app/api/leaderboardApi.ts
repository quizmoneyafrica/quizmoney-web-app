/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from "../store/store";
import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const LeaderboardAPI = {
  getAllTimeLeaderboard(page: number = 0, size: number = 10): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `games/leaderboard/all-time?page=${page}&size=${size}`,{},{},"GET");
  },
  getLastGameLeaderboard(gameId: string, page: number = 0, size: number = 10): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `games/${gameId}/leaderboard?page=${page}&size=${size}`,{},{},"GET");
  },
  getUserGames(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `games`,{},{},"GET");
  },
};

export default LeaderboardAPI;
