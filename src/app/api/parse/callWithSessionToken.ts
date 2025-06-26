/* eslint-disable @typescript-eslint/no-explicit-any */
import { decryptData } from "@/app/utils/crypto";
import { callParseEndpoint } from "./callParseEndpoint";
import { store } from "@/app/store/store";

export const callWithSessionToken = async <T>(
  endpoint: string,
  body?: any,
  method: string = "POST"
): Promise<T> => {
  const encrypted = store.getState().auth.userEncryptedData;
  const user = encrypted ? decryptData(encrypted) : null;
  const sessionToken = user?.sessionToken;

  if (!sessionToken) {
    throw new Error("User session token not found");
  }

  return callParseEndpoint<T>(endpoint, body, sessionToken, method);
};
