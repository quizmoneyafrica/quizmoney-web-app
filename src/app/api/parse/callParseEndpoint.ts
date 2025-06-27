import { handleInvalidSession } from "./handleInvalidSession";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const callParseEndpoint = async <T>(
  endpoint: string,
  body?: any,
  dispatch?: any,
  sessionToken?: string,
  method: string = "POST"
): Promise<T> => {
  const res = await fetch("/api/parse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionToken && { "x-session-token": sessionToken }),
    },
    body: JSON.stringify({
      endpoint,
      method,
      ...body,
    }),
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    let error = new Error(data.error || "Unknown error");
    // @ts-expect-error can be an
    error.code = data.code;
    if (data.code === 209 && dispatch) {
      await handleInvalidSession(dispatch);
      error = Error("Please Login to continue");
    }
    throw error;
  }

  return data.result;
};
