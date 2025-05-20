import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "../api/interface";

interface DemoState {
    data: ApiResponse | null;
  }
  
  const initialState: DemoState = {
    data: null,
  };

  const demoSlice = createSlice({
    name: "demo",
    initialState,
    reducers: {
      setDemoData(state, action: PayloadAction<ApiResponse>) {
        state.data = action.payload;
      },
      clearDemoData(state) {
        state.data = null;
      },
    },
  });
  
  export const { setDemoData, clearDemoData } = demoSlice.actions;
  export default demoSlice.reducer;