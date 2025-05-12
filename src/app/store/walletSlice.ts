import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
	wallet: Wallet|undefined;
	isWalletLoading:boolean;
	isTransactionsLoading:boolean;
}

const initialState: WalletState = {
	wallet:undefined,
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
	},
});

export const {  setWallet,setTransactionsLoading ,setWalletLoading} = walletSlice.actions;
export default walletSlice.reducer;
