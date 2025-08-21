import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
type WithdrawalData = {
  amount: number;
  bankAccount: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
};
interface WalletState {
  withdrawalData: WithdrawalData | null;
  wallet: Wallet[];
  withdrawalModal: boolean;
  withdrawalPinModal: boolean;
  addBankAccountModal: boolean;
  virtualAccount: VirtualAccount | undefined;
  isWalletLoading: boolean;
  isTransactionsLoading: boolean;
  transactions: Transaction[] | [];
  banks: Bank[];
  payoutBanks: PayoutBank | undefined;
}
export interface Bank {
  id: number;
  code: string;
  name: string;
}

export interface PayoutBank {
  id: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  status: "ACTIVE" | "INACTIVE" | string;
}
const initialState: WalletState = {
  withdrawalModal: false,
  withdrawalData: null,
  virtualAccount: undefined,
  withdrawalPinModal: false,
  addBankAccountModal: false,
  wallet: [],
  transactions: [],
  banks: [],
  payoutBanks: undefined,
  isTransactionsLoading: false,
  isWalletLoading: false,
};
export interface ParsePointer {
  __type: "Pointer";
  className: string;
  objectId: string;
}
export type BankAccount = {
  id?: number;
  accountNumber: string;
  bankName: string;
  accountName: string;
};
export type Wallet = {
  id: string;
  availableBalance: number;
  pendingBalance: number;
  currency: 'NGN' | 'QMC';
  walletAccountNumber: string;
  walletAccountName: string;
  bankName: string;
};
// export type Wallet = {
//   user: {
//     __type: "Pointer";
//     className: "_User";
//     objectId: string;
//   };
//   balance: string;
//   lastPaymentDate: {
//     __type: "Date";
//     iso: string;
//   };
//   createdAt: string;
//   updatedAt: string;
//   bankAccounts: BankAccount[];
//   pin: string;
//   objectId: string;
//   __type: "Object";
//   className: "Wallet";
// };
type VirtualAccount = {
  accountName: string;
  accountNumber: string;
  accountType: string;
  bankName: string;
  currency: string;
  paymentProviderName: string;
  walletId: string;
};
export type TransactionType = "deposit" | "withdrawal" | "transfer" | string;

export interface Transaction {
  id: string;
  transactionDate: string; // ISO 8601 date string
  transactionStatus: "SUCCESSFUL" | "FAILED" | "PENDING" | string; // Adjust based on possible statuses
  transactionType: "FUNDING" | string; // Adjust based on possible types
  narration: string;
  amount: number;
  direction: "CREDIT" | "DEBIT" | string; // Adjust based on possible directions
}

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet(state, action: PayloadAction<Wallet[]>) {
      state.wallet = action.payload;
    },
    setVirtualAccount(
      state,
      action: PayloadAction<VirtualAccount | undefined>
    ) {
      state.virtualAccount = action.payload;
    },
    setTransactionsLoading(state, action: PayloadAction<boolean>) {
      state.isTransactionsLoading = action.payload;
    },
    setWalletLoading(state, action: PayloadAction<boolean>) {
      state.isWalletLoading = action.payload;
    },
    setWalletBalance(state, action: PayloadAction<number>) {
      if (state.wallet) {
        const wallet = state.wallet.map((w) =>{
          if (w.currency === 'NGN') {
            w.availableBalance = action.payload;
          }
          return w;
        });
        if (wallet) {
          state.wallet = wallet;
        }
      }
    },
    setTransactions(
      state,
      action: PayloadAction<Transaction[] | []>
    ) {
      state.transactions = action.payload;
    },
    setBanks(state, action: PayloadAction<Bank[] | []>) {
      state.banks = action.payload;
    },
    setPayoutBanks(state, action: PayloadAction<PayoutBank | undefined>) {
      state.payoutBanks = action.payload;
    },
    setWithdrawalModal(state, action: PayloadAction<boolean>) {
      state.withdrawalModal = action.payload;
    },
    setAddBankModal(state, action: PayloadAction<boolean>) {
      state.addBankAccountModal = action.payload;
    },
    setWithdrawalPinModal(state, action: PayloadAction<boolean>) {
      state.withdrawalPinModal = action.payload;
    },
    setWithdrawalData(state, action: PayloadAction<WithdrawalData | null>) {
      state.withdrawalData = action.payload;
    },
  },
});

export const {
  setWallet,
  setVirtualAccount,
  setTransactionsLoading,
  setWalletLoading,
  setTransactions,
  setBanks,
  setPayoutBanks,
  setAddBankModal,
  setWithdrawalModal,
  setWithdrawalPinModal,
  setWithdrawalData,
  setWalletBalance,
} = walletSlice.actions;
export default walletSlice.reducer;
export const useWallet = (state: RootState) => state?.wallet;
