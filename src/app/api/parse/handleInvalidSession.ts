/* eslint-disable @typescript-eslint/no-explicit-any */
import { logout, updateAccessToken } from "@/app/store/authSlice";
import { persistor } from "@/app/store/store";
import { setTransactions, setWallet } from "@/app/store/walletSlice";

export const handleInvalidSession = async (dispatch: any) => {
  try {
    const res = await fetch("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to refresh token");
    const data = await res.json();

    const newToken = data.accessToken;
    if (!newToken) throw new Error("No accessToken in refresh response");

    // update Redux
    dispatch(updateAccessToken({ accessToken: newToken }));

    return newToken;
  } catch (err) {
    console.error("Token refresh failed", err);
    dispatch(logout());
    dispatch(setWallet([]));
    dispatch(setTransactions([]));
    await persistor.purge();
    throw err;
  }
};
