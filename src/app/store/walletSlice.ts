import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface WalletState {
	wallet: Wallet|undefined;
	isWalletLoading:boolean;
	isTransactionsLoading:boolean;
	transactions:UserWalletTransaction[]|[]
	banks:Bank[]
}
export interface Bank { id: number; code: string; name: string }
const initialState: WalletState = {
	wallet:undefined,
	transactions:[],
	banks:[],
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


export interface Transaction  {
	amount: number;
	title: string;
	description: string;
	type: string;
	status: string;
	user: {
		__type: string;
		className: string;
		objectId: string;
	};
	createdAt: string;
	updatedAt: string;
	objectId: string;
	__type: string;
	className: string;
}
export type UserWalletTransaction = {
  date: string;
  transactions:Array<Transaction>;
};

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
		setBanks(state, action: PayloadAction<Bank[]|[]>) {
			state.banks = action.payload;
		},
	},
});

export const {  setWallet,setTransactionsLoading ,setWalletLoading,setTransactions,setBanks} = walletSlice.actions;
export default walletSlice.reducer;
export const useWallet=(state:RootState)=>state?.wallet
