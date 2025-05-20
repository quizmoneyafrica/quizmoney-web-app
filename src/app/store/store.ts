import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import walletReducer from "./walletSlice";
import gameReducer from "./gameSlice";
import demoReducer from "./demoSlice";

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
import storage from "redux-persist/lib/storage";

const persistConfig = {
	key: "root",
	storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedWalletReducer = persistReducer(persistConfig, walletReducer);

export const store = configureStore({
	reducer: {
		auth: persistedAuthReducer,
		wallet: persistedWalletReducer,
		game: gameReducer,
		demo: demoReducer,
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
