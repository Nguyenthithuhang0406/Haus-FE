import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, addToCart } from "@/api/cart";
import { isLoggedIn } from "@/utils/checkLogin";

const initialState = {
  orderList: [],
  localCart: [],
  totalPrice: 0,
  loading: false,
  error: null,
  quantityOfCart: 0,
};

// Thunk để tính số lượng từ localCart (chỉ đếm số variant, không đếm số lượng)
const calculateLocalCartQuantity = (localCart) => {
  let quantity = 0;
  if (localCart && Array.isArray(localCart)) {
    // Normalize: Gộp các variant duplicate lại (cùng variant trong cùng product)
    const normalizedCart = localCart.map((item) => {
      if (!item.productVariations || !Array.isArray(item.productVariations)) {
        return item;
      }

      // Nhóm các variant được selected theo id và gộp số lượng
      const selectedVariantMap = new Map();
      item.productVariations.forEach((variant) => {
        if (variant.isSelected) {
          const variantId = variant.id;
          if (selectedVariantMap.has(variantId)) {
            // Nếu đã có variant này, gộp số lượng
            const existing = selectedVariantMap.get(variantId);
            selectedVariantMap.set(variantId, {
              ...existing,
              cartQuantity:
                (existing.cartQuantity || 0) + (variant.cartQuantity || 0),
            });
          } else {
            // Nếu chưa có, thêm mới
            selectedVariantMap.set(variantId, { ...variant });
          }
        }
      });

      // Chỉ giữ 1 variant cho mỗi id được selected (đã gộp số lượng)
      const normalizedSelectedVariants = Array.from(
        selectedVariantMap.values()
      );

      return {
        ...item,
        productVariations: normalizedSelectedVariants,
      };
    });

    // Đếm số variant sau khi normalize
    normalizedCart.forEach((cartItem) => {
      if (
        cartItem.productVariations &&
        Array.isArray(cartItem.productVariations)
      ) {
        cartItem.productVariations.forEach((variant) => {
          if (variant.isSelected && variant.cartQuantity) {
            quantity += 1; // Chỉ đếm số variant, không đếm số lượng
          }
        });
      }
    });
  }
  return quantity;
};

// Thunk để lấy số lượng giỏ hàng
export const loadCartQuantity = createAsyncThunk(
  "order/loadCartQuantity",
  async (_, { getState }) => {
    if (isLoggedIn()) {
      // Nếu đã đăng nhập, lấy từ API
      try {
        const res = await getCart();
        const cartItems = res.data?.cartItems || [];

        // Normalize: Gộp các variant duplicate lại (cùng variant trong cùng product)
        const normalizedCartItems = cartItems.map((item) => {
          if (
            !item.productVariations ||
            !Array.isArray(item.productVariations)
          ) {
            return item;
          }

          // Nhóm các variant được selected theo id và gộp số lượng
          const selectedVariantMap = new Map();
          item.productVariations.forEach((variant) => {
            if (variant.isSelected) {
              const variantId = variant.id;
              if (selectedVariantMap.has(variantId)) {
                // Nếu đã có variant này, gộp số lượng
                const existing = selectedVariantMap.get(variantId);
                selectedVariantMap.set(variantId, {
                  ...existing,
                  cartQuantity:
                    (existing.cartQuantity || 0) + (variant.cartQuantity || 0),
                });
              } else {
                // Nếu chưa có, thêm mới
                selectedVariantMap.set(variantId, { ...variant });
              }
            }
          });

          // Chỉ giữ 1 variant cho mỗi id được selected (đã gộp số lượng)
          const normalizedSelectedVariants = Array.from(
            selectedVariantMap.values()
          );

          return {
            ...item,
            productVariations: normalizedSelectedVariants,
          };
        });

        // Đếm số variant sau khi normalize
        let quantity = 0;
        normalizedCartItems.forEach((cartItem) => {
          if (
            cartItem.productVariations &&
            Array.isArray(cartItem.productVariations)
          ) {
            cartItem.productVariations.forEach((variant) => {
              if (variant.isSelected && variant.cartQuantity) {
                quantity += 1; // Chỉ đếm số variant, không đếm số lượng
              }
            });
          }
        });
        return quantity;
      } catch (error) {
        console.error("Error loading cart quantity:", error);
        return 0;
      }
    } else {
      // Nếu chưa đăng nhập, lấy từ localStorage (Redux persist)
      const state = getState();
      const localCart = state.order.localCart || [];
      return calculateLocalCartQuantity(localCart);
    }
  }
);

// Thunk để đồng bộ localCart lên server sau khi đăng nhập
export const syncLocalCartToServer = createAsyncThunk(
  "order/syncLocalCartToServer",
  async (_, { getState }) => {
    if (!isLoggedIn()) {
      return { synced: false, message: "User not logged in" };
    }

    const state = getState();
    const localCart = state.order.localCart || [];

    if (!localCart || localCart.length === 0) {
      return { synced: false, message: "No items in local cart" };
    }

    try {
      // Lấy giỏ hàng hiện tại từ server
      const serverCartRes = await getCart();
      const serverCartItems = serverCartRes.data?.cartItems || [];

      // Tạo map để kiểm tra variant đã có trên server chưa
      const serverVariantMap = new Map();
      serverCartItems.forEach((item) => {
        if (item.productVariations && Array.isArray(item.productVariations)) {
          item.productVariations.forEach((variant) => {
            if (variant.isSelected) {
              serverVariantMap.set(variant.id, variant.cartQuantity || 0);
            }
          });
        }
      });

      // Đồng bộ từng item trong localCart lên server
      const syncPromises = [];
      localCart.forEach((cartItem) => {
        if (
          cartItem.productVariations &&
          Array.isArray(cartItem.productVariations)
        ) {
          cartItem.productVariations.forEach((variant) => {
            if (variant.isSelected && variant.cartQuantity) {
              const variantId = variant.id;
              const localQuantity = variant.cartQuantity;
              const serverQuantity = serverVariantMap.get(variantId) || 0;

              // Nếu variant chưa có trên server hoặc số lượng khác, thêm/cập nhật
              if (serverQuantity === 0) {
                // Thêm mới vào server
                syncPromises.push(
                  addToCart({
                    variantId: variantId,
                    quantity: localQuantity,
                  }).catch((err) => {
                    console.error(`Error syncing variant ${variantId}:`, err);
                  })
                );
              } else if (serverQuantity !== localQuantity) {
                // Cập nhật số lượng (có thể dùng updateCartItem nếu cần)
                // Ở đây ta sẽ thêm số lượng chênh lệch
                const diffQuantity = localQuantity - serverQuantity;
                if (diffQuantity > 0) {
                  syncPromises.push(
                    addToCart({
                      variantId: variantId,
                      quantity: diffQuantity,
                    }).catch((err) => {
                      console.error(
                        `Error updating variant ${variantId}:`,
                        err
                      );
                    })
                  );
                }
              }
            }
          });
        }
      });

      await Promise.all(syncPromises);

      // Xóa localCart sau khi đồng bộ thành công
      // Dispatch action clearLocalCart (sẽ được định nghĩa sau trong slice)
      return {
        synced: true,
        message: "Cart synced successfully",
        shouldClearLocalCart: true,
      };
    } catch (error) {
      console.error("Error syncing cart to server:", error);
      throw error;
    }
  }
);

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
    clearLocalCart: (state) => {
      state.localCart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCartQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCartQuantity.fulfilled, (state, action) => {
        state.quantityOfCart = action.payload;
        state.loading = false;
      })
      .addCase(loadCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(syncLocalCartToServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncLocalCartToServer.fulfilled, (state, action) => {
        state.loading = false;
        // Xóa localCart sau khi đồng bộ thành công
        if (action.payload?.shouldClearLocalCart) {
          state.localCart = [];
        }
      })
      .addCase(syncLocalCartToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
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
  clearLocalCart,
} = orderSlice.actions;
export default orderSlice.reducer;
