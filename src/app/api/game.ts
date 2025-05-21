import axios, { AxiosResponse } from "axios";
import {
  appHeaders,
  BASE_URL,
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
      { headers: getSessionTokenHeaders() }
    );
  },
  deactivateSession(gameId: string) {
    return axios.post(
      `${BASE_URL}/functions/deactivateSession`,
      { gameId },
      { headers: getSessionTokenHeaders() }
    );
  },
  checkSessionStatus(gameId: string) {
    return axios.post(
      `${BASE_URL}/functions/checkGameSession`,
      { gameId },
      { headers: getSessionTokenHeaders() }
    );
  },
};

export default GameApi;

export function decryptGameData(encrypted: string) {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}
