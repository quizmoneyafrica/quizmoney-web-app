import axios from "axios";
import { BASE_URL, XParseApplicationId, XParseRESTAPIKey } from "./userApi";
import { ApiResponse } from "./interface";

const StoreAPI = {
  getStoreItems: async (): Promise<ApiResponse> => {
    const response = await axios.post(`${BASE_URL}/getProducts`, {
      headers: {
        "X-Parse-Application-Id": XParseApplicationId,
        "X-Parse-REST-API-Key": XParseRESTAPIKey,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
};

export default StoreAPI;
