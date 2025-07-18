import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StompState {
  subscriptions: string[];
}

const initialState: StompState = {
  subscriptions: [],
};

const stompSlice = createSlice({
  name: "stomp",
  initialState,
  reducers: {
    addSubscription: (state, action: PayloadAction<string>) => {
      if (!state.subscriptions.includes(action.payload)) {
        state.subscriptions.push(action.payload);
      }
    },
    removeSubscription: (state, action: PayloadAction<string>) => {
      state.subscriptions = state.subscriptions.filter(
        (sub) => sub !== action.payload
      );
    },
    clearSubscriptions: (state) => {
      state.subscriptions = [];
    },
  },
});

export const { addSubscription, removeSubscription, clearSubscriptions } =
  stompSlice.actions;
export default stompSlice.reducer;
