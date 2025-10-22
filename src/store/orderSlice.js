import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderList: [],
  localCart: [],
  totalPrice: 0,
  loading: false,
  error: null,
  quantityOfCart: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderList: (state, action) => {
      state.orderList = action.payload;
    },
    setPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setQuantityOfCart: (state, action) => {
      state.quantityOfCart = action.payload;
    },
    setLocalCart: (state, action) => {
      state.localCart = action.payload;
    },
  },
});

export const {
  setOrderList,
  setPrice,
  setLoading,
  setError,
  setQuantityOfCart,
} = orderSlice.actions;
export default orderSlice.reducer;
