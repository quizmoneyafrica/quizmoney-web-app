import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface UserObject {
  email: string;
  firstName: string;
  lastName: string;
}
interface AuthState {
  isAuthenticated: boolean;
  rehydrated: boolean;
  accessToken: string;
  expiredAt: number;
  refreshToken: string;
  user: UserObject | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  rehydrated: false,
  accessToken: "",
  expiredAt: 0,
  refreshToken: "",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<UserObject>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    setRehydrated(state, action: PayloadAction<boolean>) {
      state.rehydrated = action.payload;
    },
    updateUser(state, action: PayloadAction<UserObject>) {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
});

export const { login, logout, setRehydrated, updateUser } = authSlice.actions;
export default authSlice.reducer;
