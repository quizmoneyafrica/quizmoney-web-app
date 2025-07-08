"use client";

import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { login, logout, UserObject } from "../store/authSlice";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  const loginUser = (userData: UserObject) => {
    dispatch(login(userData));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    isAuthenticated,
    user,
    userEmail: user?.email ?? null,
    loginUser,
    logoutUser,
  };
};
