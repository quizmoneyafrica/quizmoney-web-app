"use client";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import UserAPI from "@/app/api/userApi";
import { handleInvalidSession } from "@/app/api/parse/handleInvalidSession";

function CheckSession() {
  const dispatch = useAppDispatch();

  const verifySession = useCallback(async () => {
    try {
      await UserAPI.checkSessionTokenValidity();
    } catch {
      handleInvalidSession(dispatch);
      toast.error("Please login to continue", { position: "top-center" });
    }
  }, [dispatch]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  return null;
}

export default CheckSession;
