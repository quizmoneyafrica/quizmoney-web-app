import {
  // logout,
  updateAccessToken,
  updateExpiry,
  updateRefreshToken,
} from "@/app/store/authSlice";
import { AppDispatch } from "@/app/store/store";
// import { setTransactions, setWallet } from "@/app/store/walletSlice";
import { toastPosition } from "@/app/utils/utils";
import { toast } from "sonner";

export const handleInvalidSession = async (
  dispatch: AppDispatch,
  refreshToken?: string
): Promise<string> => {
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
      throw new Error(`Refresh failed: ${errorText}`);
    }
    const response = await res.json();
    const tokenData = response?.data;

    if (!tokenData?.accessToken || !tokenData?.refreshToken) {
      throw new Error("Invalid or expired refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = tokenData;
    // if (!accessToken || !newRefreshToken)
    //   throw new Error("Incomplete token response");

    dispatch(updateAccessToken(accessToken));
    dispatch(updateRefreshToken(newRefreshToken));
    dispatch(updateExpiry(tokenData.expiredAt));

    return accessToken;
  } catch (err) {
    console.error("Refresh token invalid/expired:", err);
    // dispatch(logout());
    // dispatch(setWallet([]));
    // dispatch(setTransactions([]));
    // await persistor.purge();
    toast.error("Session expired. Please log in again.", {
      position: toastPosition,
    });
    throw err;
  }
};
