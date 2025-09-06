import { logout, updateAccessToken } from "@/app/store/authSlice";
import { AppDispatch, persistor } from "@/app/store/store";
import { setTransactions, setWallet } from "@/app/store/walletSlice";

export const handleInvalidSession = async (
  dispatch: AppDispatch
): Promise<string> => {
  try {
    const res = await fetch("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to refresh token");
    const data = await res.json();

    const newToken = data.accessToken;
    if (!newToken) throw new Error("No accessToken in refresh response");

    dispatch(updateAccessToken(newToken));

    return newToken;
  } catch (err) {
    console.error("Token refresh failed", err);
    localStorage.clear();
    sessionStorage.clear();
    dispatch(logout());
    dispatch(setWallet([]));
    dispatch(setTransactions([]));
    await persistor.purge();
    throw err;
  }
};
