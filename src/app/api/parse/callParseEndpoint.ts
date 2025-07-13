import { handleInvalidSession } from "./handleInvalidSession";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const callParseEndpoint = async <T>(
  endpoint: string,
  body?: any,
  dispatch?: any,
  accessToken?: string,
  method: string = "POST"
): Promise<T> => {
  const res = await fetch("/api/parse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify({
      endpoint,
      method,
      ...body,
    }),
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    const err = new Error(data.error || data.message || "Unknown error") as any;
    err.code = data.code;
    err.raw = data;

    // handle invalid session
    if (data.code === 209 && dispatch) {
      await handleInvalidSession(dispatch);
      err.message = "Please login to continue.";
    }

    throw err;
  }

  return data;
};
