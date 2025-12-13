import React, { useState, useEffect } from "react";
import CartHeader from "@/components/cart/CartHeader";
import CartItem from "@/components/cart/CartItem";
import EmptyCart from "@/components/cart/EmptyCart";
import CartSummary from "@/components/cart/CartSummary";
import PaginationComponent from "@/components/cart/Pagination";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "@/utils/checkLogin";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  getCart,
  removeProductFromCart,
  updateCartItem,
} from "@/api/cart";
import {
  setOrderList,
  updateLocalCart,
  loadCartQuantity,
} from "@/store/orderSlice";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const cartItemsInRedux = useSelector((state) => state.order.localCart);
  const dispatch = useDispatch();
  const orderListItems = useSelector((state) => state.order.orderList);

  useEffect(() => {
    if (orderListItems && orderListItems.length > 0) {
      setSelectedItems(
        orderListItems
          .map((item) => item.productVariations.find((v) => v.isSelected)?.id)
          .filter(Boolean)
      );
    }
  }, [orderListItems]);

  // Ref để theo dõi xem có đang update không
  const isUpdatingRef = React.useRef(false);

  // Load cart items khi component mount hoặc khi cartItemsInRedux thay đổi (chỉ khi chưa đăng nhập)
  useEffect(() => {
    // Nếu đang update, không reload từ Redux/API
    if (isUpdatingRef.current) {
      return;
    }

    // Chỉ xử lý khi chưa đăng nhập (load từ Redux)
    if (!isLoggedIn()) {
      setLoading(true);
      setCartItems(cartItemsInRedux);
      console.log("cart in redux:", cartItemsInRedux);
      setLoading(false);
    }
  }, [cartItemsInRedux]);

  // Load cart items khi component mount (chỉ khi đã đăng nhập)
  useEffect(() => {
    if (isLoggedIn() && !isUpdatingRef.current) {
      const fetchCartItems = async () => {
        setLoading(true);
        try {
          const response = await getCart();
          if (response.status === 200) {
            const cartItems = response.data.cartItems || [];

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
              const unselectedVariants = [];

              item.productVariations.forEach((variant) => {
                if (variant.isSelected) {
                  const variantId = variant.id;
                  if (selectedVariantMap.has(variantId)) {
                    // Nếu đã có variant này, gộp số lượng
                    const existing = selectedVariantMap.get(variantId);
                    selectedVariantMap.set(variantId, {
                      ...existing,
                      cartQuantity:
                        (existing.cartQuantity || 0) +
                        (variant.cartQuantity || 0),
                    });
                  } else {
                    // Nếu chưa có, thêm mới
                    selectedVariantMap.set(variantId, { ...variant });
                  }
                } else {
                  // Giữ nguyên variant không được selected
                  unselectedVariants.push(variant);
                }
              });

              // Tạo danh sách variants đã normalize: chỉ giữ 1 variant cho mỗi id được selected
              const normalizedSelectedVariants = Array.from(
                selectedVariantMap.values()
              );

              // Kết hợp: variants được selected (đã gộp) + variants không được selected
              const normalizedVariants = [
                ...normalizedSelectedVariants,
                ...unselectedVariants,
              ];

              return {
                ...item,
                productVariations: normalizedVariants,
              };
            });

            setCartItems(normalizedCartItems);
            // Chỉ cập nhật Redux khi mount lần đầu, không dispatch để tránh infinite loop
            // Redux sẽ được cập nhật khi user thực hiện action (update, add, remove)
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCartItems();
    }
  }, []);

  // Khởi tạo selectedItems lần đầu tiên khi load cartItems (chỉ khi có orderListItems)
  useEffect(() => {
    // Chỉ khởi tạo nếu chưa có selectedItems và có orderListItems
    if (
      selectedItems.length > 0 ||
      !orderListItems ||
      orderListItems.length === 0
    ) {
      return;
    }

    // Nếu có orderListItems, khởi tạo từ orderListItems
    const initialFromOrder = orderListItems
      .map((item) => item.productVariations.find((v) => v.isSelected)?.id)
      .filter(Boolean);
    if (initialFromOrder.length > 0) {
      setSelectedItems(initialFromOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderListItems]); // Chỉ chạy khi orderListItems thay đổi

  // Cleanup: loại bỏ các IDs không còn tồn tại trong cartItems khi cartItems thay đổi
  useEffect(() => {
    if (selectedItems.length === 0 || cartItems.length === 0) {
      return;
    }

    const allSelectableIds = cartItems.reduce((ids, item) => {
      const selectedVariants = item.productVariations
        .filter((v) => v.isSelected)
        .map((v) => v.id);
      return [...ids, ...selectedVariants];
    }, []);

    // Chỉ cleanup, không tự động thêm mới
    const validSelected = selectedItems.filter((id) =>
      allSelectableIds.includes(id)
    );
    if (validSelected.length !== selectedItems.length) {
      setSelectedItems(validSelected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  // Tính tổng số variants có thể chọn (isSelected = true)
  const getTotalSelectableItems = () => {
    return cartItems.reduce((count, item) => {
      return count + item.productVariations.filter((v) => v.isSelected).length;
    }, 0);
  };

  const handleToggleSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    const totalSelectable = getTotalSelectableItems();

    if (selectedItems.length === totalSelectable && totalSelectable > 0) {
      // Bỏ chọn tất cả
      setSelectedItems([]);
    } else {
      // Chọn tất cả variants có isSelected = true
      const allSelectableIds = cartItems.reduce((ids, item) => {
        const selectedVariants = item.productVariations
          .filter((v) => v.isSelected)
          .map((v) => v.id);
        return [...ids, ...selectedVariants];
      }, []);
      setSelectedItems(allSelectableIds);
    }
  };
  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    if (isLoggedIn()) {
      try {
        isUpdatingRef.current = true;
        const data = {
          oldVariantId: id,
          quantity: newQuantity,
        };
        const response = await updateCartItem(data);
        if (response.status === 200) {
          // Giữ nguyên thứ tự: cập nhật quantity từ response nhưng giữ nguyên thứ tự items
          setCartItems((prevItems) => {
            const responseItems = response.data.cartItems || [];
            // Tạo map để lấy quantity mới từ response
            const variantQuantityMap = new Map();
            responseItems.forEach((item) => {
              if (
                item.productVariations &&
                Array.isArray(item.productVariations)
              ) {
                item.productVariations.forEach((variant) => {
                  if (variant.isSelected && variant.id === id) {
                    variantQuantityMap.set(id, variant.cartQuantity);
                  }
                });
              }
            });

            // Cập nhật quantity nhưng giữ nguyên thứ tự
            const updated = prevItems.map((item) => {
              const updatedVariants = item.productVariations.map((variant) => {
                if (variant.id === id && variant.isSelected) {
                  const newQty = variantQuantityMap.get(id) || newQuantity;
                  return { ...variant, cartQuantity: newQty };
                }
                return variant;
              });

              return {
                ...item,
                productVariations: updatedVariants,
              };
            });

            // Lưu vào Redux để backup (nhưng không trigger reload vì có isUpdatingRef)
            dispatch(updateLocalCart(updated));
            return updated;
          });
          // Cập nhật số lượng giỏ hàng sau khi update thành công
          dispatch(loadCartQuantity());
          // Đợi một chút để đảm bảo state đã được cập nhật trước khi reset flag
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 100);
        } else {
          isUpdatingRef.current = false;
        }
      } catch (error) {
        console.log(error);
        isUpdatingRef.current = false;
      }
    } else {
      // Chỉ update variant có isSelected = true trong đúng item
      setCartItems((prevItems) => {
        const updated = prevItems.map((item) => {
          // Tìm xem item này có chứa variant với id và isSelected = true không
          const hasSelectedVariant = item.productVariations.some(
            (v) => v.id === id && v.isSelected
          );

          if (!hasSelectedVariant) {
            // Nếu item này không chứa variant được chọn, giữ nguyên
            return item;
          }

          // Chỉ update variant có id khớp và isSelected = true
          const updatedVariants = item.productVariations.map((variant) => {
            if (variant.id === id && variant.isSelected) {
              return { ...variant, cartQuantity: newQuantity };
            }
            return variant;
          });

          return {
            ...item,
            productVariations: updatedVariants,
          };
        });

        // Dùng state mới để update Redux
        dispatch(updateLocalCart(updated));
        return updated;
      });
    }
  };

  const handleChangeVariant = async (
    itemId,
    newVariantId,
    oldVariantId,
    quantity
  ) => {
    const newId = parseInt(newVariantId);
    const oldId = parseInt(oldVariantId);

    // Nếu chọn lại cùng variant, không làm gì
    if (newId === oldId) {
      return;
    }

    if (isLoggedIn()) {
      isUpdatingRef.current = true;

      // Kiểm tra xem variant mới đã có trong giỏ hàng chưa
      let totalQuantity = quantity || 1;
      const existingVariant = cartItems
        .flatMap((item) => item.productVariations || [])
        .find((v) => v.id === newId && v.isSelected);

      // Nếu variant mới đã có, gộp số lượng
      if (existingVariant && existingVariant.cartQuantity) {
        totalQuantity = (existingVariant.cartQuantity || 0) + (quantity || 1);
      }

      const data = {
        oldVariantId: oldId,
        newVariantId: newId,
        quantity: totalQuantity, // Gửi số lượng đã gộp
      };
      const response = await updateCartItem(data);
      if (response.status === 200) {
        const updatedCartItems = response.data.cartItems || [];

        // Giữ nguyên thứ tự: cập nhật từ response nhưng giữ nguyên thứ tự items và variants
        setCartItems((prevItems) => {
          // Tạo map từ response để lấy dữ liệu mới
          const responseItemMap = new Map();
          updatedCartItems.forEach((item) => {
            if (
              item.productVariations &&
              Array.isArray(item.productVariations)
            ) {
              item.productVariations.forEach((variant) => {
                if (variant.isSelected) {
                  if (!responseItemMap.has(item.id)) {
                    responseItemMap.set(item.id, new Map());
                  }
                  responseItemMap.get(item.id).set(variant.id, variant);
                }
              });
            }
          });

          // Cập nhật nhưng giữ nguyên thứ tự
          const updated = prevItems.map((item) => {
            const itemVariantsMap = responseItemMap.get(item.id);
            if (!itemVariantsMap) {
              // Item không có trong response, giữ nguyên
              return item;
            }

            // Cập nhật variants nhưng giữ nguyên thứ tự
            // Khi chọn variant mới, chỉ cập nhật variant cũ và variant mới
            // Giữ nguyên các variant khác (có thể có nhiều variant được selected cho cùng một sản phẩm)
            const updatedVariants = item.productVariations.map((variant) => {
              // Nếu variant cũ (oldId), bỏ chọn
              if (variant.id === oldId && variant.isSelected) {
                return { ...variant, isSelected: false, cartQuantity: 0 };
              }
              // Nếu variant mới (newId), cập nhật từ response
              if (variant.id === newId && itemVariantsMap.has(newId)) {
                const newVariantData = itemVariantsMap.get(newId);
                // Cập nhật từ response (đã bao gồm số lượng từ variant cũ)
                return { ...variant, ...newVariantData, isSelected: true };
              }
              // Nếu variant khác đã có trong response, cập nhật từ response
              if (itemVariantsMap.has(variant.id)) {
                return { ...variant, ...itemVariantsMap.get(variant.id) };
              }
              // Giữ nguyên variant khác (không thay đổi isSelected)
              return variant;
            });

            // Kiểm tra xem variant mới có trong danh sách chưa
            const hasNewVariant = item.productVariations.some(
              (v) => v.id === newId
            );
            if (!hasNewVariant && itemVariantsMap.has(newId)) {
              // Nếu variant mới chưa có trong danh sách, thêm vào (giữ nguyên thứ tự variants khác)
              const newVariant = itemVariantsMap.get(newId);
              // Tìm vị trí để chèn variant mới (sau variant cũ nếu có)
              const oldVariantIndex = updatedVariants.findIndex(
                (v) => v.id === oldId
              );
              if (oldVariantIndex >= 0) {
                updatedVariants.splice(oldVariantIndex + 1, 0, {
                  ...newVariant,
                  isSelected: true,
                });
              } else {
                updatedVariants.push({ ...newVariant, isSelected: true });
              }
            }

            return {
              ...item,
              productVariations: updatedVariants,
            };
          });

          // Lưu vào Redux để backup (nhưng không trigger reload vì có isUpdatingRef)
          dispatch(updateLocalCart(updated));
          return updated;
        });

        // Cập nhật selectedItems: xóa variant cũ, thêm variant mới
        setSelectedItems((prev) => {
          const updated = prev.includes(oldId)
            ? prev.filter((id) => id !== oldId)
            : prev;
          // Chỉ thêm variant mới nếu chưa có
          return updated.includes(newId) ? updated : [...updated, newId];
        });

        // Cập nhật số lượng giỏ hàng
        dispatch(loadCartQuantity());
        // Đợi một chút để đảm bảo state đã được cập nhật trước khi reset flag
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      } else {
        isUpdatingRef.current = false;
      }
    } else {
      // ---- TRƯỜNG HỢP CHƯA LOGIN ----
      setCartItems((prevItems) => {
        const updatedCart = prevItems.map((item) => {
          // Chỉ xử lý item có id khớp
          if (item.id !== itemId) return item;

          const variants = item.productVariations.map((variant) => {
            // Nếu là variant cũ và đang được chọn -> bỏ chọn
            if (variant.id === oldId && variant.isSelected) {
              return { ...variant, isSelected: false, cartQuantity: 0 };
            }

            // Nếu là variant mới
            if (variant.id === newId) {
              if (variant.isSelected) {
                // Nếu đã chọn từ trước -> tăng số lượng
                return {
                  ...variant,
                  cartQuantity: (variant.cartQuantity || 0) + (quantity || 1),
                };
              } else {
                // Nếu chưa chọn -> chọn mới và gán quantity
                return {
                  ...variant,
                  isSelected: true,
                  cartQuantity: quantity || 1,
                };
              }
            }
            return variant;
          });

          return { ...item, productVariations: variants };
        });

        // Dùng state mới để update Redux
        dispatch(updateLocalCart(updatedCart));
        return updatedCart;
      });

      // Update selectedItems riêng biệt
      setSelectedItems((prev) => {
        const newSelected = prev.includes(oldId)
          ? prev.filter((id) => id !== oldId).concat(newId)
          : prev.includes(newId)
          ? prev
          : [...prev, newId];
        return newSelected;
      });

      // Cập nhật số lượng giỏ hàng trên icon
      dispatch(loadCartQuantity());
    }
  };

  const handleRemoveItem = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      if (isLoggedIn()) {
        isUpdatingRef.current = true;
        const response = await removeProductFromCart(id);
        if (response.status === 200) {
          // Giữ nguyên thứ tự: chỉ bỏ chọn variant bị xóa, không xóa toàn bộ item
          setCartItems((prevItems) => {
            const updated = prevItems.map((item) => {
              // Tìm item chứa variant bị xóa
              const hasVariantToRemove = item.productVariations.some(
                (variant) => variant.id === id && variant.isSelected
              );

              if (!hasVariantToRemove) {
                // Item này không chứa variant bị xóa, giữ nguyên
                return item;
              }

              // Cập nhật variants: bỏ chọn variant bị xóa và loại bỏ duplicate
              const variantMap = new Map();
              const uniqueVariants = [];

              item.productVariations.forEach((variant) => {
                if (variant.id === id && variant.isSelected) {
                  // Bỏ chọn variant bị xóa
                  const unselectedVariant = {
                    ...variant,
                    isSelected: false,
                    cartQuantity: 0,
                  };
                  // Chỉ thêm vào nếu chưa có variant với id này
                  if (!variantMap.has(variant.id)) {
                    variantMap.set(variant.id, unselectedVariant);
                    uniqueVariants.push(unselectedVariant);
                  }
                } else if (variant.isSelected) {
                  // Nếu variant được chọn, kiểm tra duplicate
                  if (!variantMap.has(variant.id)) {
                    variantMap.set(variant.id, variant);
                    uniqueVariants.push(variant);
                  }
                } else {
                  // Variant không được chọn, thêm vào
                  uniqueVariants.push(variant);
                }
              });

              return {
                ...item,
                productVariations: uniqueVariants,
              };
            });

            // Lưu vào Redux để backup (nhưng không trigger reload vì có isUpdatingRef)
            dispatch(updateLocalCart(updated));
            return updated;
          });

          // Xóa variant id khỏi selectedItems
          setSelectedItems((selected) =>
            selected.filter((itemId) => itemId !== id)
          );

          // Cập nhật số lượng giỏ hàng sau khi xóa thành công
          dispatch(loadCartQuantity());
          // Đợi một chút để đảm bảo state đã được cập nhật trước khi reset flag
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 100);
        } else {
          isUpdatingRef.current = false;
        }
      } else {
        // Chỉ bỏ chọn variant bị xóa, không xóa toàn bộ item
        setCartItems((prevItems) => {
          const updated = prevItems.map((item) => {
            // Tìm item chứa variant bị xóa
            const hasVariantToRemove = item.productVariations.some(
              (variant) => variant.id === id && variant.isSelected
            );

            if (!hasVariantToRemove) {
              // Item này không chứa variant bị xóa, giữ nguyên
              return item;
            }

            // Cập nhật variants: bỏ chọn variant bị xóa
            const updatedVariants = item.productVariations.map((variant) => {
              if (variant.id === id && variant.isSelected) {
                return {
                  ...variant,
                  isSelected: false,
                  cartQuantity: 0,
                };
              }
              return variant;
            });

            return {
              ...item,
              productVariations: updatedVariants,
            };
          });

          // Dùng state mới để update Redux
          dispatch(updateLocalCart(updated));
          return updated;
        });

        // Xóa variant id khỏi selectedItems
        setSelectedItems((selected) =>
          selected.filter((itemId) => itemId !== id)
        );

        // Cập nhật số lượng giỏ hàng
        dispatch(loadCartQuantity());
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm?")) {
      if (isLoggedIn()) {
        const response = await clearCart();
        if (response.status === 204) {
          setCartItems([]);
          setSelectedItems([]);
          // Xóa localCart trong Redux để F5 không load lại
          dispatch(updateLocalCart([]));
          // Cập nhật số lượng giỏ hàng
          dispatch(loadCartQuantity());
        }
      } else {
        setCartItems([]);
        setSelectedItems([]);
        // Xóa localCart trong Redux để F5 không load lại
        dispatch(updateLocalCart([]));
        // Cập nhật số lượng giỏ hàng
        dispatch(loadCartQuantity());
      }
    }
  };

  const calculateTotal = () => {
    return cartItems
      .map((item) => {
        const selectedVariant = item?.productVariations?.find(
          (variant) => variant.isSelected && selectedItems.includes(variant.id)
        );
        if (!selectedVariant) return 0;

        let price = selectedVariant.price ?? item.price ?? 0;
        const discount = selectedVariant.discountPercent ?? 0;
        price = price - (price * discount) / 100;
        const quantity = selectedVariant.cartQuantity ?? 1; // ✅ Lấy từ variant

        return price * quantity;
      })
      .reduce((sum, val) => sum + val, 0);
  };

  const handleClickCheckout = () => {
    const itemSelecteds = cartItems
      .map((item) => {
        const selectedVariants = item.productVariations.filter((variant) =>
          selectedItems.includes(variant.id)
        );
        if (selectedVariants.length > 0) {
          return {
            ...item,
            productVariations: selectedVariants,
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    dispatch(setOrderList(itemSelecteds));
    if (isLoggedIn()) {
      navigate("/paymentPage");
    } else {
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ad7555]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto mt-[120px] px-4 py-8">
      <CartHeader
        totalItems={getTotalSelectableItems()}
        selectedCount={selectedItems.length}
        onClearAll={handleClearAll}
        onSelectAll={handleSelectAll}
        allSelected={
          getTotalSelectableItems() > 0 &&
          selectedItems.length === getTotalSelectableItems()
        }
      />

      {cartItems.length === 0 ? (
        <EmptyCart onNavigate={(path) => navigate(path)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map(
              (item) =>
                item.productVariations.length > 0 &&
                item.productVariations.map(
                  (variant) =>
                    variant.isSelected && (
                      <CartItem
                        key={`${item.id}-${variant.id}`}
                        item={item}
                        variant={variant}
                        isSelected={selectedItems.includes(variant?.id)}
                        onToggleSelect={handleToggleSelect}
                        onUpdateQuantity={handleUpdateQuantity}
                        handleChangeVariant={handleChangeVariant}
                        onRemove={handleRemoveItem}
                      />
                    )
                )
            )}
            {/* <PaginationComponent
                currentPage={currentPage}
                totalItems={cartItems.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              /> */}
          </div>

          <div>
            <CartSummary
              total={calculateTotal()}
              selectedCount={selectedItems.length}
              onContinue={() => navigate("/")}
              onCheckout={handleClickCheckout}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
