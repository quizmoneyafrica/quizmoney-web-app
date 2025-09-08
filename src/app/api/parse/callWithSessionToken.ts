/* eslint-disable @typescript-eslint/no-explicit-any */
import { callParseEndpoint } from "./callParseEndpoint";
import { store } from "@/app/store/store";
import { logoutAndRedirect } from "@/app/logoutAndRedirect";

export type methodType = "POST" | "GET" | "PATCH" | "PUT" | "DELETE";
export const callWithSessionToken = async <T>(
  endpoint: string,
  body?: any,
  method: methodType = "POST",
  token?: string
): Promise<T> => {
  const accessToken = token ? token : store.getState().auth.accessToken;

  if (!accessToken) {
    await logoutAndRedirect();

    throw new Error("Access token not found");
  }

  return callParseEndpoint<T>(endpoint, body, accessToken, method);
};
