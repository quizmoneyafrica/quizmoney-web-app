import axios, { AxiosResponse } from "axios";
import { appHeaders, BASE_URL } from "./userApi";
import { ApiResponse } from "./interface";

const DemoApi = {
  fetchDemoGame(): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(`${BASE_URL}/getPracticeQuestions`, {}, { headers: appHeaders });
  },
};

export default DemoApi;
