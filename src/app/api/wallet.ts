/**
 * wallet.ts
 *
 * Wallet API calls — balance, deposit, transactions, bank accounts, withdrawals.
 * Replaces the old wallet.ts which used callWithSessionToken via the /api/parse proxy.
 *
 * Old endpoint patterns removed:
 *   wallets, wallet-accounts, payout-accounts, banks, wallets/withdraw,
 *   wallets/withdrawal-requests, getCheckoutLink, getPaystackCheckoutLink, etc.
 *
 * All amounts are in KOBO (integer). ₦1,000.00 = 100000 kobo.
 */

import { apiClient } from '@/lib/api-client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WalletBalance {
  balance: number          // in kobo
  currency: string         // "NGN"
}

export interface VirtualAccount {
  account_number: string
  account_name: string
  bank_name: string
  bank_code: string
}

export interface Transaction {
  id: string
  type: string             // "deposit" | "withdrawal" | "game_entry" | "prize" | etc.
  amount: number           // in kobo
  status: string           // "pending" | "success" | "failed"
  reference: string
  description: string | null
  created_at: string
}

export interface BankAccount {
  id: string
  account_number: string
  account_name: string
  bank_name: string
  bank_code: string
  is_default: boolean
  created_at: string
}

export interface Bank {
  name: string
  code: string
}

export interface WithdrawalRequest {
  id: string
  amount: number           // in kobo
  status: string           // "pending" | "approved" | "rejected" | "paid"
  bank_account: BankAccount
  created_at: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

// ─── Wallet API ───────────────────────────────────────────────────────────────

const WalletAPI = {
  /**
   * Get wallet balance (in kobo).
   */
  getBalance(): Promise<{ success: boolean; data: WalletBalance }> {
    return apiClient.get('/api/wallet/balance')
  },

  /**
   * Initiate a Paystack deposit.
   * @param amount - Amount in kobo (e.g. 100000 = ₦1,000)
   */
  initiateDeposit(amount: number): Promise<{ success: boolean; data: { checkout_url: string; reference: string } }> {
    return apiClient.post('/api/wallet/deposit', { amount })
  },

  /**
   * Get virtual bank account details.
   */
  getVirtualAccount(): Promise<{ success: boolean; data: VirtualAccount | null }> {
    return apiClient.get('/api/wallet/virtual-account')
  },

  /**
   * Create a virtual bank account (requires fully verified account — phone + BVN).
   */
  setupVirtualAccount(): Promise<{ success: boolean; data: VirtualAccount }> {
    return apiClient.post('/api/wallet/virtual-account/setup')
  },

  /**
   * Get transaction history (paginated).
   */
  getTransactions(query?: {
    page?: number
    limit?: number
    type?: string
  }): Promise<{ success: boolean; data: PaginatedResponse<Transaction> }> {
    const params = new URLSearchParams()
    if (query?.page !== undefined) params.set('page', String(query.page))
    if (query?.limit !== undefined) params.set('limit', String(query.limit))
    if (query?.type) params.set('type', query.type)
    const qs = params.toString()
    return apiClient.get(`/api/wallet/transactions${qs ? `?${qs}` : ''}`)
  },

  /**
   * Get list of Nigerian banks. Public endpoint — no auth required.
   */
  getBanks(): Promise<{ success: boolean; data: Bank[] }> {
    return apiClient.get('/api/wallet/banks', { skipAuth: true })
  },

  /**
   * Verify a bank account number and get the account name before saving.
   */
  resolveBankAccount(query: {
    account_number: string
    bank_code: string
  }): Promise<{ success: boolean; data: { account_name: string } }> {
    return apiClient.get(
      `/api/wallet/bank-accounts/resolve?account_number=${query.account_number}&bank_code=${query.bank_code}`,
    )
  },

  /**
   * Get all saved bank accounts.
   */
  getBankAccounts(): Promise<{ success: boolean; data: BankAccount[] }> {
    return apiClient.get('/api/wallet/bank-accounts')
  },

  /**
   * Save a new bank account for withdrawals.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  addBankAccount(body: any, _dispatch?: any): Promise<any> {
    return apiClient.post('/api/wallet/bank-accounts', body)
  },

  /**
   * Remove a saved bank account.
   */
  deleteBankAccount(accountId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/api/wallet/bank-accounts/${accountId}`)
  },

  /**
   * Set a bank account as the default.
   */
  setDefaultBankAccount(accountId: string): Promise<{ success: boolean; data: BankAccount }> {
    return apiClient.patch(`/api/wallet/bank-accounts/${accountId}/default`)
  },

  /**
   * Request a withdrawal (pending admin approval).
   * @param amount - Amount in kobo (minimum ₦1,000 = 100000 kobo)
   * @param bank_account_id - UUID of a saved bank account
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  requestWithdrawal(body: any, ..._rest: any[]): Promise<any> {
    return apiClient.post('/api/wallet/withdraw', body)
  },

  /**
   * Get withdrawal request history (paginated).
   */
  getWithdrawalHistory(query?: {
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: PaginatedResponse<WithdrawalRequest> }> {
    const params = new URLSearchParams()
    if (query?.page !== undefined) params.set('page', String(query.page))
    if (query?.limit !== undefined) params.set('limit', String(query.limit))
    const qs = params.toString()
    return apiClient.get(`/api/wallet/withdrawals${qs ? `?${qs}` : ''}`)
  },

  // Legacy method aliases — un-migrated screens still use these names
  /* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
  fetchCustomerWallet: async (...args: any[]): Promise<any> => ({ success: false, data: null }),
  fetchTransactions: async (...args: any[]): Promise<any> => ({ success: false, data: { content: [], totalPages: 0 } }),
  fetchPayoutBanks: async (...args: any[]): Promise<any> => ({ success: false, data: [] }),
  listBanks: async (...args: any[]): Promise<any> => ({ success: false, data: [] }),
  fetchDedicatedAccount: async (...args: any[]): Promise<any> => ({ success: false, data: null }),
  fetchWithdrawalRequests: async (...args: any[]): Promise<any> => ({ success: false, data: [] }),
  fetchBanks: async (...args: any[]): Promise<any> => ({ success: false, data: [] }),
  confirmAccount: async (...args: any[]): Promise<any> => ({ success: false, data: null }),
  createWithdrawalPin: async (...args: any[]): Promise<any> => ({ success: false, data: null }),
  deletePayoutBank: async (...args: any[]): Promise<any> => ({ success: false, data: null }),
  forgotPin: async (...args: any[]): Promise<any> => ({ success: false, data: null }),
  getCheckoutLink: async (...args: any[]): Promise<any> => ({ success: false, data: null }),
  initializePaystack: async (...args: any[]): Promise<any> => ({ success: false, data: null }),
  resetPin: async (...args: any[]): Promise<any> => ({ success: false, data: null }),
  verifyAccount: async (...args: any[]): Promise<any> => ({ success: false, data: null }),
  verifyPinOtp: async (...args: any[]): Promise<any> => ({ success: false, data: null }),
  /* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
}

export default WalletAPI
