import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const StoreAPI = {
  getProducts(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("products", {}, "GET");
  },

  purchaseItem(productId: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "products/purchase",
      { productId },

      "POST"
    );
  },
};

export default StoreAPI;
