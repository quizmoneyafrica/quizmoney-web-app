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
  if (data.code === 401) {
    await logoutAndRedirect();
    throw new Error("Session expired, please login again.");
  }
  if (!res.ok || data.success === false) {
    if (data.code === 209 && dispatch) {
      try {
        const newToken = await handleInvalidSession(dispatch);

        const retry = await doRequest(newToken);
        if (!retry.res.ok || retry.data.success === false) {
          await handleInvalidSession(dispatch);
          throw new Error(
            retry.data.error || retry.data.message || "Unknown error"
          );
        }
        return retry.data;
      } catch {
        await logoutAndRedirect();
        throw new Error("Session expired, please login again.");
      }
    }
    // else {
    //   await logoutAndRedirect();
    // }

    const err = new Error(data.error || data.message || "Unknown error") as any;
    err.code = data.code;
    err.raw = data;

    if (data.code === 401 || data.code === 209 || data.code === 101) {
      await logoutAndRedirect(); // other auth errors
    }

    throw err;
  }

  return data;
};
