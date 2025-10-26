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
      const newItem = action.payload;

      // Tìm variant được chọn trong sản phẩm mới
      const selectedVariant = newItem.productVariations.find(
        (variant) => variant.isSelected
      );
      if (!selectedVariant) return;

      const variantId = selectedVariant.id;

      // Tìm xem variant đó đã có trong giỏ chưa
      const existedItem = state.localCart.find((item) =>
        item.productVariations.some(
          (variant) => variant.isSelected && variant.id === variantId
        )
      );

      if (existedItem) {
        // Tìm đúng variant trong sản phẩm cũ và cộng thêm số lượng
        const existedVariant = existedItem.productVariations.find(
          (variant) => variant.id === variantId
        );
        if (existedVariant) {
          existedVariant.cartQuantity += selectedVariant.cartQuantity;
        }
      } else {
        // Nếu chưa có, thêm sản phẩm mới vào giỏ
        state.localCart.push(newItem);
      }
    },
  },
});

export const {
  setOrderList,
  setPrice,
  setLoading,
  setError,
  setQuantityOfCart,
  setLocalCart,
} = orderSlice.actions;
export default orderSlice.reducer;
