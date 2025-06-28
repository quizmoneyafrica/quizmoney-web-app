/* eslint-disable @typescript-eslint/no-explicit-any */
import { logout } from "@/app/store/authSlice";
import { persistor } from "@/app/store/store";
import { setTransactions, setWallet } from "@/app/store/walletSlice";

export const handleInvalidSession = async (dispatch: any) => {
  dispatch(logout());
  dispatch(setWallet(undefined));
  dispatch(setTransactions([]));
  await persistor.purge();
};
