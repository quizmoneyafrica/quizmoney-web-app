import { logout } from "@/app/store/authSlice";
import { setWallet, setTransactions } from "@/app/store/walletSlice";
import { persistor, store } from "@/app/store/store";

export async function logoutAndRedirect() {
  const dispatch = store.dispatch;

  dispatch(logout());
  dispatch(setWallet([]));
  dispatch(setTransactions([]));
  await persistor.purge();
}
