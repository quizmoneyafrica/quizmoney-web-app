import axios, { AxiosResponse } from "axios";
import {
  appHeaders,
  BASE_URL,
  getAuthUser,
  getSessionTokenHeaders,
  SECRET_KEY,
} from "./userApi";
import { ApiResponse } from "./interface";
import CryptoJS from "crypto-js";

const GameApi = {
  fetchNextGame(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(`${BASE_URL}/errorLoad`, {}, { headers: appHeaders });
  },
  registerForGame(gameId: string): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/registerForGame`,
      { gameId },
      { headers: getSessionTokenHeaders() }
    );
  },
  removeUserFromGame(gameId: string): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(
      `${BASE_URL}/removeUserFromGame`,
      { gameId },
      { headers: appHeaders }
    );
  },
  deactivateSession(gameId: string) {
    return axios.post(
      `${BASE_URL}/functions/deactivateSession`,
      { gameId },
      {
        headers: appHeaders,
      }
    );
  },
  checkSessionStatus(gameId: string) {
    return axios.post(
      `${BASE_URL}/functions/checkGameSession`,
      { gameId },
      { headers: appHeaders }
    );
  },
};

export default GameApi;

export function decryptGameData(encrypted: string) {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}
