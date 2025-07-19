"use client";
// import { useAppDispatch } from "@/app/hooks/useAuth";
// import { useCallback, useEffect } from "react";
// import { toast } from "sonner";
// import UserAPI, { getAuthUser } from "@/app/api/userApi";
// import { handleInvalidSession } from "@/app/api/parse/handleInvalidSession";

function CheckSession() {
  // const dispatch = useAppDispatch();
  // const user = getAuthUser();

  // const verifySession = useCallback(async () => {
  //   if (!user) return;

  //   try {
  //     await UserAPI.checkSessionTokenValidity();
  //   } catch {
  //     handleInvalidSession(dispatch);
  //     toast.error("Please login to continue", { position: "top-center" });
  //   }
  // }, [dispatch, user]);

  // useEffect(() => {
  //   verifySession();
  // }, [verifySession]);

  return null;
}

export default CheckSession;
