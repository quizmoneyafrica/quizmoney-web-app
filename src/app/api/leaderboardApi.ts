/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const LeaderboardAPI = {
  getAllTimeLeaderboard(dispatch: any, page?: number): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "getAllTimeLeaderboard",
      {
        page: page ?? 1,
      },
      dispatch
    );
  },
  getLastGameLeaderboard(dispatch: any): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "getLastGameLeaderboard",
      {},
      dispatch
    );
  },
};

export default LeaderboardAPI;
