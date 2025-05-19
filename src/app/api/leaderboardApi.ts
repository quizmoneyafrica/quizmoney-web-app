import axios, { AxiosResponse } from "axios";
import { BASE_URL, getSessionTokenHeaders } from "./userApi";
import { ApiResponse } from "./interface";

const LeaderboardAPI = {
  getAllTimeLeaderboard(page?: number): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/getAllTimeLeaderboard`,
      {
        page: page ?? 1,
      },
      {
        headers: getSessionTokenHeaders(),
      }
    );
  },
  getLastGameLeaderboard(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/getLastGameLeaderboard`,
      {},
      {
        headers: getSessionTokenHeaders(),
      }
    );
  },
};

export default LeaderboardAPI;
