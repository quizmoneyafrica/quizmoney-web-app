/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const StoreAPI = {
  getProducts(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("products", {}, {}, "GET");
  },

  purchaseItem(productId: string, dispatch: any): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "products/purchase",
      { productId },
      dispatch,
      "POST"
    );
  },
};

export default StoreAPI;
