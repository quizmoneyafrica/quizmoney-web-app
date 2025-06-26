"use client";
import Parse from "parse";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { logout } from "@/app/store/authSlice";
import { persistor } from "@/app/store/store";
import { setTransactions, setWallet } from "@/app/store/walletSlice";
import { performLogout } from "@/app/utils/logout";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import UserAPI from "@/app/api/userApi";

function CheckSession() {
  const dispatch = useAppDispatch();

  const verifySession = useCallback(async () => {
    try {
      await UserAPI.checkSessionTokenValidity();
    } catch {
      await Parse.User.logOut();
      dispatch(logout());
      dispatch(setWallet(undefined));
      dispatch(setTransactions([]));
      performLogout(dispatch);

      await persistor.purge();
      toast.error("Please login to continue", { position: "top-center" });
    }
  }, [dispatch]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  return null;
}

export default CheckSession;
