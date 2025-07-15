import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserObject {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  dob: string;
  avatarUrl: string;
  createdAt: string;
  country: string;
  facebook: string;
  twitter: string;
  instagram: string;
  tiktok: string;
  whatsapp_contact: string;
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

export interface LoginPayload {
  accessToken: string;
  refreshToken: string;
  expiredAt: number;
  user: UserObject;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      Object.assign(state, {
        isAuthenticated: true,
        ...action.payload,
      });
    },
    logout: (state) => Object.assign(state, initialState),

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
