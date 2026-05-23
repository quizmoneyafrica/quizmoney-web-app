/* eslint-disable */
// STUB — wallet state moves to React Query (useWalletBalance, useWalletTransactions from @/lib/queries)

export type Transaction = {
  id: string
  type: string
  amount: number
  status: string
  created_at: string
  description?: string
  [key: string]: any
}

export type WalletBalance = {
  balance: number
  currency: string
  [key: string]: any
}

export const setWalletBalance = (_v: any) => ({ type: 'stub/setWalletBalance' })
export const setWalletLoading = (_v: boolean) => ({ type: 'stub/setWalletLoading' })
export const setTransactions = (_v: any[]) => ({ type: 'stub/setTransactions' })
export const setTransactionsLoading = (_v: boolean) => ({ type: 'stub/setTransactionsLoading' })
export const setWallet = (_v: any) => ({ type: 'stub/setWallet' })
export const setAddBankModal = (_v: boolean) => ({ type: 'stub/setAddBankModal' })
export const setBanks = (_v: any[]) => ({ type: 'stub/setBanks' })
export const setPayoutBanks = (_v: any) => ({ type: 'stub/setPayoutBanks' })
export const clearWalletState = () => ({ type: 'stub/clearWalletState' })

export default function walletReducer(state = {}, _action: any) {
  return state
}

// Stub hook — un-migrated screens may import useWallet from walletSlice
export const useWallet = (_s?: any) => ({
  balance: null as any,
  transactions: [] as any[],
  loading: false,
  isWalletLoading: false,
  isTransactionsLoading: false,
  addBankModal: false,
  banks: [] as any[],
  payoutBanks: null as any,
  wallet: [] as any[],
  withdrawalModal: false,
  withdrawalPinModal: false,
  withdrawalData: null as any,
  addBankAccountModal: false,
})

export const setWithdrawalData = (_v: any) => ({ type: 'stub/setWithdrawalData' })
export const setWithdrawalModal = (_v: boolean) => ({ type: 'stub/setWithdrawalModal' })
export const setWithdrawalPinModal = (_v: boolean) => ({ type: 'stub/setWithdrawalPinModal' })
