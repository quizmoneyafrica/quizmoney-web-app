"use client";
import { logout } from "@/app/store/authSlice";
import { AppDispatch } from "@/app/store/store";

export const performLogout = (dispatch: AppDispatch) => {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem("userEncryptedData");
  }

  dispatch(logout());
};
