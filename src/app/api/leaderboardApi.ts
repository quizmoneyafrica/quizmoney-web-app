import axios, { AxiosResponse } from "axios";
import { BASE_URL, getAuthUser, getSessionTokenHeaders } from "./userApi";
import { ApiResponse } from "./interface";

const user = getAuthUser();
const LeaderboardAPI = {
  getAllTimeLeaderboard(page?: number): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/getAllTimeLeaderboard`,
      {
        page: page ?? 1,
      },
      {
        headers: getSessionTokenHeaders(),timeout: 600000
      },
			
    );
  },
  getLastGameLeaderboard(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/getLastGameLeaderboard`,
      { userId: user?.objectId },
      {
        headers: getSessionTokenHeaders(),timeout: 600000
      }
    );
  },
};

export default LeaderboardAPI;
