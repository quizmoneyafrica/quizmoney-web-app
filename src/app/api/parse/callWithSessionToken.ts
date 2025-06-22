/* eslint-disable @typescript-eslint/no-explicit-any */
import { callParseEndpoint } from "./callParseEndpoint";
import { getAuthUser } from "../userApi";

export const callWithSessionToken = async <T>(
  endpoint: string,
  body?: any,
  method: string = "POST"
): Promise<T> => {
  const user = getAuthUser();
  const sessionToken = user?.sessionToken;
  console.log("USER DATA", user);

  if (!sessionToken) {
    throw new Error("User session token not found");
  }

  return callParseEndpoint<T>(endpoint, body, sessionToken, method);
};
