import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
	isAuthenticated: boolean;
	userEmail: string | null;
	userEncryptedData?: string | null;
	rehydrated: boolean;
}

const initialState: AuthState = {
	isAuthenticated: false,
	userEmail: null,
	userEncryptedData: null,
	rehydrated: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(state, action: PayloadAction<string>) {
			state.isAuthenticated = true;
			state.userEmail = action.payload;
			state.userEncryptedData = action.payload;
		},
		logout(state) {
			state.isAuthenticated = false;
			state.userEmail = null;
			state.userEncryptedData = null;
		},
		setRehydrated(state, action: PayloadAction<boolean>) {
			state.rehydrated = action.payload;
		},
	},
});

export const { login, logout, setRehydrated } = authSlice.actions;
export default authSlice.reducer;
