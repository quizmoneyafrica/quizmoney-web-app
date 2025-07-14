/* eslint-disable @typescript-eslint/no-explicit-any */
import { callParseEndpoint } from "./callParseEndpoint";
// import { store } from "@/app/store/store";

export const callWithSessionToken = async <T>(
  endpoint: string,
  body?: any,
  dispatch?: any,
  method: string = "POST",
  accessToken?: string
): Promise<T> => {
  // const accessToken = store.getState().auth.accessToken;
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  return callParseEndpoint<T>(endpoint, body, dispatch, accessToken, method);
};
