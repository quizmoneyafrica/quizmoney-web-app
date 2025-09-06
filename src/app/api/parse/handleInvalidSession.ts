import { logout, updateAccessToken } from "@/app/store/authSlice";
import { AppDispatch, persistor, store } from "@/app/store/store";
import { setTransactions, setWallet } from "@/app/store/walletSlice";
import { redirect } from "next/navigation";

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

    if ( String(data.message).toLowerCase() === "session expired") {
      clean();
    }
    const newToken = data.accessToken;
    if (!newToken) throw new Error("No accessToken in refresh response");
    dispatch(updateAccessToken(newToken));
    return newToken;
  } catch (err) {
  clean();
    throw err;
  }
};
export const clean = async () => {
  const dispatch = store.dispatch;
  dispatch(logout());
  dispatch(setWallet([]));
  dispatch(setTransactions([]));
  await persistor.purge();
  redirect("/login");
};
