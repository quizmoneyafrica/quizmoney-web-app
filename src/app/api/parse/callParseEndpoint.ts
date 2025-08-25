/* eslint-disable @typescript-eslint/no-explicit-any */
// callParseEndpoint.ts
import { handleInvalidSession } from "./handleInvalidSession";

export const callParseEndpoint = async <T>(
  endpoint: string,
  body?: any,
  dispatch?: any,
  accessToken?: string,
  method: string = "POST"
): Promise<T> => {
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

  const { res, data } = await doRequest(accessToken || "");

  if (!res.ok || data.success === false) {
    // expired session
    if (data.code === 209 && dispatch) {
      const newToken = await handleInvalidSession(dispatch);

      // 🔁 retry once with fresh token
      const retry = await doRequest(newToken);
      if (!retry.res.ok || retry.data.success === false) {
        throw new Error(
          retry.data.error || retry.data.message || "Unknown error"
        );
      }
      return retry.data;
    }

    const err = new Error(data.error || data.message || "Unknown error") as any;
    err.code = data.code;
    err.raw = data;
    throw err;
  }

  return data;
};
