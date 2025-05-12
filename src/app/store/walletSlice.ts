import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface WalletState {
	wallet: Wallet|undefined;
	isWalletLoading:boolean;
	isTransactionsLoading:boolean;
	transactions:UserWalletTransaction[]|[]
}

const initialState: WalletState = {
	wallet:undefined,
	transactions:[],
	isTransactionsLoading:false,
	isWalletLoading:false
};
export interface ParsePointer {
  __type: 'Pointer';
  className: string;
  objectId: string;
}

export interface ParseDate {
  __type: 'Date';
  iso: string;
}

export interface Wallet {
  user: ParsePointer;
  balance: string;
  lastPaymentDate: ParseDate;
  createdAt: string;
  updatedAt: string;
  objectId: string;
}

export interface ParsePointer {
  __type: 'Pointer';
  className: string;
  objectId: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | string;

export interface UserWalletTransaction {
  amount: number;
  type: TransactionType;
  user: ParsePointer;
  createdAt: string;
  updatedAt: string;
  objectId: string;
  __type: 'Object';
  className: 'UserWalletTransaction';
}

const walletSlice = createSlice({
	name: "wallet",
	initialState,
	reducers: {
		setWallet(state, action: PayloadAction<Wallet|undefined>) {
			state.wallet = action.payload;
		},
		setTransactionsLoading(state, action: PayloadAction<boolean>) {
			state.isTransactionsLoading = action.payload;
		},
		setWalletLoading(state, action: PayloadAction<boolean>) {
			state.isTransactionsLoading = action.payload;
		},
		setTransactions(state, action: PayloadAction<UserWalletTransaction[]|[]>) {
			state.transactions = action.payload;
		},
	},
});

export const {  setWallet,setTransactionsLoading ,setWalletLoading,setTransactions} = walletSlice.actions;
export default walletSlice.reducer;
export const useWallet=(state:RootState)=>state?.wallet
