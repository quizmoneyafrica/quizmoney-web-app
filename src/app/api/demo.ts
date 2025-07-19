import { ApiResponse } from "./interface";
import { callParseEndpoint } from "./parse/callParseEndpoint";

const DemoApi = {
  fetchDemoGame(): Promise<ApiResponse> {
    return callParseEndpoint<ApiResponse>("getPracticeQuestions");
  },
};

export default DemoApi;
