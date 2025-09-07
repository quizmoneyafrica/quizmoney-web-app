/* eslint-disable @typescript-eslint/no-explicit-any */
import { logoutAndRedirect } from "@/app/logoutAndRedirect";
import { handleInvalidSession } from "./handleInvalidSession";
import { store } from "@/app/store/store";

export const callParseEndpoint = async <T>(
  endpoint: string,
  body?: any,
  accessToken?: string,
  method: string = "POST"
): Promise<T> => {
  const dispatch = store.dispatch;
  const refreshToken = store.getState().auth.refreshToken;
  const doRequest = async (token: string) => {
    const res = await fetch("/api/parse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        endpoint,
        method,
        ...body,
      }),
    });

    const data = await res.json();
    return { res, data };
  };

  let { res, data } = await doRequest(accessToken || "");

  if (data.code === 401 || data.code === 209 || res.status === 401) {
    try {
      const newToken = await handleInvalidSession(dispatch, refreshToken);
      ({ res, data } = await doRequest(newToken));
      if (!res.ok || data.success === false) {
        throw new Error(data.error || "Failed after token refresh.");
      }
    } catch (err) {
      console.error(err);
      await logoutAndRedirect();
      throw new Error("Session expired, please login again.");
    }
  }
  if (!res.ok || data.success === false) {
    const err = new Error(data.error || data.message || "Unknown error") as any;
    err.code = data.code;
    err.raw = data;
    throw err;
  }

  return data;
};
