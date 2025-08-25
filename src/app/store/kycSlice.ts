import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface KycRootObject {
  id: string;
  customerId: string;
  step: string;
  status: string;
  startedAt?: string;
  completedAt?: string;
}

interface KycState {
  customerKyc: KycRootObject[];
}

const initialState: KycState = {
  customerKyc: [],
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    setCustomerKyc(state, action: PayloadAction<KycRootObject[]>) {
      state.customerKyc = action.payload;
    },
  },
});

export const { setCustomerKyc } = kycSlice.actions;

export default kycSlice.reducer;
