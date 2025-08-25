import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import kycReducer from "./kycSlice";
import walletReducer from "./walletSlice";
import gameReducer from "./gameSlice";
import demoReducer from "./demoSlice";
import coinReducer from "./coinSlice";
import notificationReducer from "./notificationSlice";
import leaderboardReducer from "./leaderboardSlice";
import storeReducer from "./storeSlice";
import stompSub from "./stompSlice";
import numberGuessGameSlice from "./numberGuessGameSlice";

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
const customerKycPersistConfig = {
  key: "kyc",
  storage: localForage,
  transforms: [authTransform],
};
const walletPersistConfig = {
  key: "wallet",
  storage: localForage,
  transforms: [authTransform],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedKycReducer = persistReducer(
  customerKycPersistConfig,
  kycReducer
);
const persistedWalletReducer = persistReducer(
  walletPersistConfig,
  walletReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    wallet: persistedWalletReducer,
    game: gameReducer,
    demo: demoReducer,
    notifications: notificationReducer,
    leaderboard: leaderboardReducer,
    store: storeReducer,
    coin: coinReducer,
    stompSub: stompSub,
    numberGuess: numberGuessGameSlice,
    kyc: persistedKycReducer,
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
