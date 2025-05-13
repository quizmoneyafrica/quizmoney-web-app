import axios, { AxiosResponse } from "axios";
import { BASE_URL, getSessionTokenHeaders } from "./userApi";
import { ApiResponse } from "./interface";

const LeaderboardAPI = {
  getAllTimeLeaderboard(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(`${BASE_URL}/getAllTimeLeaderboard`, {
      headers: getSessionTokenHeaders(),
    });
  },
  getLastGameLeaderboard(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(`${BASE_URL}/getLastGameLeaderboard`, {
      headers: getSessionTokenHeaders(),
    });
  },
};

export default LeaderboardAPI;
