import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import walletReducer from "./walletSlice";
import gameReducer from "./gameSlice";
import demoReducer from "./demoSlice";
import notificationReducer from "./notificationSlice";
import { createFilter } from "redux-persist-transform-filter";

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

const authTransform = createFilter("auth", ["userEncryptedData"]);

const authPersistConfig = {
  key: "auth",
  storage: localForage,
  transforms: [authTransform],
};

const persistConfig = {
  key: "root",
  storage: localForage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
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
