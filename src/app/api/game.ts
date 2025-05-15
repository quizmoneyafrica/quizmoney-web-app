import axios, { AxiosResponse } from "axios";
import { appHeaders, BASE_URL } from "./userApi";
import { ApiResponse } from "./interface";

const GameApi = {
  fetchNextGame(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(`${BASE_URL}/fetchNextGame`, {}, { headers: appHeaders });
  },
};

export default GameApi;
