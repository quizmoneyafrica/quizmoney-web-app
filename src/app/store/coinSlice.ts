import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface CoinTransactions {
  points: number;
  title: string;
  createdAt: string;
  type: string;
  status: string;
}

interface CoinState {
  balance: number;
  userCoinTransactions: CoinTransactions[];
}

const initialState: CoinState = {
  balance: 0,
  userCoinTransactions: [],
};
const coinSlice = createSlice({
  name: "coin",
  initialState,
  reducers: {
    updateCoinBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    setUserCoinTransactions: (
      state,
      action: PayloadAction<CoinTransactions[]>
    ) => {
      state.userCoinTransactions = action.payload;
    },
  },
});

export const { updateCoinBalance, setUserCoinTransactions } = coinSlice.actions;
export default coinSlice.reducer;
