import {
  logout,
  updateAccessToken,
  updateExpiry,
  updateRefreshToken,
} from "@/app/store/authSlice";
import { AppDispatch, persistor } from "@/app/store/store";
import { setTransactions, setWallet } from "@/app/store/walletSlice";
import {
  getRefreshPromise,
  setRefreshPromise,
} from "@/app/utils/refreshTokenPromise";

export const handleInvalidSession = async (
  dispatch: AppDispatch,
  refreshToken?: string
): Promise<string> => {
  const existing = getRefreshPromise();
  if (existing) {
    return existing;
  }

  const newPromise = (async () => {
    try {
      if (!refreshToken) throw new Error("No refresh token found");
      const res = await fetch("/api/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenValue: refreshToken }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        const err = JSON.parse(errorText || "{}");
        if (err.message === "Session expired") {
          dispatch(logout());
          dispatch(setWallet([]));
          dispatch(setTransactions([]));
          await persistor.purge();
          throw new Error(err.message);
        }
      }

      const response = await res.json();
      const tokenData = response?.data;

      if (!tokenData?.accessToken || !tokenData?.refreshToken) {
        throw new Error("Invalid or expired refresh token");
      }

      dispatch(updateAccessToken(tokenData.accessToken));
      dispatch(updateRefreshToken(tokenData.refreshToken));
      dispatch(updateExpiry(tokenData.expiredAt));

      return tokenData.accessToken;
    } finally {
      setRefreshPromise(null);
    }
  })();

  setRefreshPromise(newPromise);
  return newPromise;
};