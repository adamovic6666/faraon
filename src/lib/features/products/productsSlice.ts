import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Color = {
  name: string;
  code: string;
};

// Define a type for the slice state
interface ProductsState {
  colorSelection: Color;
}

// Define the initial state using that type
const initialState: ProductsState = {
  colorSelection: {
    name: "Brown",
    code: "bg-[#4F4631]",
  },
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setColorSelection: (state, action: PayloadAction<Color>) => {
      state.colorSelection = action.payload;
    },
  },
});

export const { setColorSelection } = productsSlice.actions;

export default productsSlice.reducer;
