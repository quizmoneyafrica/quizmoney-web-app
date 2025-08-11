import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// type UpdateUserFieldPayload = {
//   key: keyof UserObject;
//   value: UserObject[keyof UserObject];
// };

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
  pinSetup: boolean;
  gameEraserCount: number;
  facebookHandle: string;
  twitterHandle: string;
  instagramHandle: string;
  tiktokHandle: string;
  whatsappContact: string;
  referralCode: string;
  referralEarnings: number;
  totalReferral: number;
}
interface AuthState {
  isAuthenticated: boolean;
  rehydrated: boolean;
  accessToken: string;
  expiredAt: number;
  refreshToken: string;
  user: UserObject | null;
  userEncryptedData: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  rehydrated: false,
  accessToken: "",
  expiredAt: 0,
  refreshToken: "",
  user: null,
  userEncryptedData: null,
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
    updateUser(state, action: PayloadAction<Partial<UserObject>>) {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
    // updateUser(state, action: PayloadAction<UpdateUserFieldPayload>) {
    //   if (state.user) {
    //     state.user[action.payload.key] = action.payload.value;
    //   }
    // },
  },
});

export const { login, logout, setRehydrated, updateUser } = authSlice.actions;
export default authSlice.reducer;
