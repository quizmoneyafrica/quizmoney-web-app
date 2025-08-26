/* eslint-disable @typescript-eslint/no-explicit-any */
import { callParseEndpoint } from "./callParseEndpoint";
import { store } from "@/app/store/store";

export type methodType = "POST" | "GET" | "PATCH" | "PUT";
export const callWithSessionToken = async <T>(
  endpoint: string,
  body?: any,
  dispatch?: any,
  method: methodType = "POST",
  token?: string
): Promise<T> => {
  const accessToken = token ? token : store.getState().auth.accessToken;
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  return callParseEndpoint<T>(endpoint, body, dispatch, accessToken, method);
};
