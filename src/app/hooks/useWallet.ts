import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useAuth";
import {
  setTransactions,
  setTransactionsLoading,
  setWallet,
  setWalletLoading,
  Wallet,
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

export function useWalletBalances() {
  const wallet = useAppSelector((s) => s.wallet.wallet);

  // Find QMC and NGN wallets
  const qmcWallet = wallet.find((w: Wallet) => w.currency === "QMC");
  const ngnWallet = wallet.find((w: Wallet) => w.currency === "NGN");

  return {
    qmcBalance: qmcWallet?.availableBalance ?? 0,
    ngnBalance: ngnWallet?.availableBalance ?? 0,
  };
}
