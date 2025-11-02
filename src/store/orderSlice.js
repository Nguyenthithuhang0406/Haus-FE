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

      // Lấy variant được chọn từ sản phẩm mới
      const selectedVariant = newItem.productVariations.find(
        (v) => v.isSelected
      );
      if (!selectedVariant) return;

      const productId = newItem.id;
      const variantId = selectedVariant.id;

      // Tìm sản phẩm trong giỏ theo id
      const existedProduct = state.localCart.find(
        (item) => item.id === productId
      );

      if (existedProduct) {
        // Nếu sản phẩm đã tồn tại trong giỏ
        const existedVariant = existedProduct.productVariations.find(
          (v) => v.id === variantId && v.isSelected
        );

        if (existedVariant) {
          // Nếu variant đã có => tăng số lượng
          existedVariant.cartQuantity += selectedVariant.cartQuantity;
          existedVariant.isSelected = true;
        } else {
          // Nếu variant chưa có => thêm variant mới vào danh sách variations
          existedProduct.productVariations =
            existedProduct.productVariations.map((v) => {
              if (v.id === variantId) {
                return {
                  ...v,
                  isSelected: true,
                  cartQuantity: selectedVariant.cartQuantity,
                };
              }
              return v;
            });
        }
      } else {
        // Nếu chưa có sản phẩm này trong giỏ => thêm mới toàn bộ sản phẩm
        state.localCart.push(newItem);
      }
    },
    updateLocalCart: (state, action) => {
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
  setLocalCart,
  updateLocalCart,
} = orderSlice.actions;
export default orderSlice.reducer;
