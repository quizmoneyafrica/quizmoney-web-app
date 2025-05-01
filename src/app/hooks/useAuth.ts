"use client";

import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { login, logout } from "../store/authSlice";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const userEmail = useAppSelector((state) => state.auth.userEmail);

	const loginUser = (email: string) => {
		dispatch(login(email));
	};

	const logoutUser = () => {
		dispatch(logout());
	};

	return {
		isAuthenticated,
		userEmail,
		loginUser,
		logoutUser,
	};
};
