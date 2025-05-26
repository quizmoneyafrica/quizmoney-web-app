import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../api/interface";

interface StoreState {
  products: Product[] | null;
}

const initialState: StoreState = {
  products: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setStoreProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
});

export const { setStoreProducts } = storeSlice.actions;
export default storeSlice.reducer;
