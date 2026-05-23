/* eslint-disable */
// STUB — Redux store removed. Zustand handles auth, React Query handles server state.
// This file prevents build errors while un-migrated screens still import RootState / store.

export type RootState = {
  auth: { user: any; isAuthenticated: boolean; accessToken: string; refreshToken: string; rehydrated: boolean; [key: string]: any }
  wallet: { balance: any; transactions: any[]; loading: boolean; wallet: any[]; isWalletLoading: boolean; isTransactionsLoading: boolean; payoutBanks: any; withdrawalModal: boolean; withdrawalPinModal: boolean; [key: string]: any }
  game: { phase: string; isAllowedInGame: boolean; [key: string]: any }
  gameZone: { phase: string; audioShouldPlay: boolean; allGamesData: any[]; currentGameData: any; [key: string]: any }
  kyc: { customerKyc: any; isLoading: boolean; [key: string]: any }
  notifications: { notificationCount: number; notifications: any; [key: string]: any }
  store: { products: any[]; [key: string]: any }
  leaderboard: { selectedPlayer: any; lastGame: any[]; allTime: any[]; pagination?: any; [key: string]: any }
  stomp: { subscriptions: any[]; [key: string]: any }
  stompSub: { subscriptions: any[]; [key: string]: any }
  demo: { [key: string]: any }
  coin: { [key: string]: any }
  withdrawalRequest: { content: any[]; totalPages: any; [key: string]: any }
  numberGuess: { [key: string]: any }
}

export type AppDispatch = (action: any) => any

// Minimal stub store — dispatching does nothing, getState returns empty shape
export const store = {
  dispatch: (_action: any) => {},
  getState: (): RootState => ({
    auth: { user: null, isAuthenticated: false, accessToken: '', refreshToken: '', rehydrated: true },
    wallet: { balance: null, transactions: [], loading: false, wallet: [], isWalletLoading: false, isTransactionsLoading: false, payoutBanks: null, withdrawalModal: false, withdrawalPinModal: false },
    game: { phase: '', isAllowedInGame: false },
    gameZone: { phase: '', audioShouldPlay: false, allGamesData: [], currentGameData: null },
    kyc: { customerKyc: null, isLoading: false },
    notifications: { notificationCount: 0, notifications: [] },
    store: { products: [] },
    leaderboard: { selectedPlayer: null, lastGame: [], allTime: [] },
    stomp: { subscriptions: [] },
    stompSub: { subscriptions: [] },
    demo: {},
    coin: {},
    withdrawalRequest: { content: [], totalPages: 0 },
    numberGuess: {},
  }),
  subscribe: (_listener: any) => () => {},
} as any

export const persistor = {
  purge: async () => {},
  pause: () => {},
  flush: async () => {},
} as any
