import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "../utils/crypto";

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
    updateUser(state, action: PayloadAction<object>) {
      const currentDecrypted = decryptData(state.userEncryptedData || "") ?? {};
      const updated = { ...currentDecrypted, ...action.payload };
      state.userEncryptedData = encryptData(updated);
    },
  },
});

export const { login, logout, setRehydrated, updateUser } = authSlice.actions;
export default authSlice.reducer;
