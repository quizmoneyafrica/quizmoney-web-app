import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WithdrawContentObj {
  comment: string;
  amount: number;
  status: string;
  createdAt: string;
}
export interface WithdrawDataObj {
  content: WithdrawContentObj[] | [];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const initialState: WithdrawDataObj = {
  content: [],
  pageNo: 0,
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
  last: false,
};

const withdrawalRequestSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWithdrawalRequestData: (state, action: PayloadAction<WithdrawDataObj>) =>
      action.payload,
  },
});

export const { setWithdrawalRequestData } = withdrawalRequestSlice.actions;
export default withdrawalRequestSlice.reducer;
