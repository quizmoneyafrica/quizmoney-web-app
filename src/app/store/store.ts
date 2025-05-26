import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import walletReducer from "./walletSlice";
import gameReducer from "./gameSlice";
import demoReducer from "./demoSlice";
import notificationReducer from "./notificationSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// import storage from "redux-persist/lib/storage";
import localForage from "localforage";

const persistConfig = {
  key: "root",
  version: 1,
  storage: localForage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  migrate: (state: any) => {
    return Promise.resolve(state);
  },
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedWalletReducer = persistReducer(persistConfig, walletReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    wallet: persistedWalletReducer,
    game: gameReducer,
    demo: demoReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
