import { useCallback } from "react";
import { useAppDispatch } from "./useAuth";
import {
  setTransactions,
  setTransactionsLoading,
  setWallet,
  setWalletLoading,
} from "../store/walletSlice";
import WalletApi from "../api/wallet";

function useWalletHook() {
  const dispatch = useAppDispatch();

  const fetchWallet = useCallback(async () => {
    try {
      dispatch(setWalletLoading(true));
      const res = await WalletApi.fetchCustomerWallet();
      if (res?.data) {
        dispatch(setWallet(res?.data));
      }
    } catch (error) {
      console.log(error, "Wallet Error");
    } finally {
      dispatch(setWalletLoading(false));
    }
  }, [dispatch]);

  const fetchTransactions = useCallback(async () => {
    try {
      dispatch(setTransactionsLoading(true));
      const res = await WalletApi.fetchTransactions({});
      if (res?.data?.content) {
        dispatch(setTransactions(res?.data.content ?? []));
      }
    } catch (error) {
      console.log(error, "Transaction Error");
    } finally {
      dispatch(setTransactionsLoading(false));
    }
  }, [dispatch]);
  return { fetchWallet, fetchTransactions };
}

export default useWalletHook;
