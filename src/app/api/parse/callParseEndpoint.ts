/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { handleInvalidSession } from "./handleInvalidSession";
import { store } from "@/app/store/store";
import { logout } from "@/app/store/authSlice";

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

  console.log("===============doRequest=====================");

  console.log(JSON.stringify(data, null, 2));
  console.log("============doRequest========================");

  const isTokenExpired =
    (data.code === "401" || data.code === 401) &&
    data.message?.toLowerCase().includes("token expired");

//     {
//   "success": false,
//   "code": "401",
//   "message": "Token expired, please login again"
// }

  if (data.success === false && data.message?.toLowerCase().includes("token expired") && isTokenExpired) {
    try {
      if (!refreshToken) {
         logout();
        redirect("/login");
      }
      const newToken = await handleInvalidSession(dispatch, refreshToken);
      console.log("Retrying with new access token:", newToken);
      ({ res, data } = await doRequest(newToken));
      if (!res.ok || data.success === false) {
        throw new Error(data.error || "Failed after token refresh.");
      }
    } catch (err: any) {
      console.error("Token refresh & retry failed:", err);
      throw new Error(err.message);
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
