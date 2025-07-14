"use client";

import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  login,
  LoginPayload,
  logout,
  updateUser,
  UserObject,
} from "../store/authSlice";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken } = useAppSelector(
    (state) => state.auth
  );
  const user = useAppSelector((state) => state.auth.user);

  const loginUser = (userData: LoginPayload) => {
    dispatch(login(userData));
  };
  const updateCustomer = (userData: UserObject) => {
    dispatch(updateUser(userData));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    accessToken,
    isAuthenticated,
    user,
    userEmail: user?.email ?? null,
    loginUser,
    logoutUser,
    updateCustomer,
  };
};
