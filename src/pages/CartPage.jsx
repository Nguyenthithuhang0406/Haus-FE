import React, { useState, useEffect } from "react";
import Layout from "@/components/commons/Layout";
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
  setQuantityOfCart,
  updateLocalCart,
} from "@/store/orderSlice";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const cartItemsInRedux = useSelector((state) => state.order.localCart);
  const dispatch = useDispatch();
  const quantityOfCart = useSelector((state) => state.order.quantityOfCart);
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

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isLoggedIn()) {
        setLoading(true);
        setCartItems(cartItemsInRedux);
        console.log("cart in redux:", cartItemsInRedux);
        setLoading(false);
      } else {
        setLoading(true);
        const response = await getCart();
        if (response.status === 200) {
          setCartItems(response.data.cartItems || []);
          setLoading(false);
        }
      }
    };
    fetchCartItems();
  }, [cartItemsInRedux]);

  // Khởi tạo và cleanup selectedItems khi cartItems thay đổi
  useEffect(() => {
    // Lấy tất cả variant IDs có thể chọn (isSelected = true)
    const allSelectableIds = cartItems.reduce((ids, item) => {
      const selectedVariants = item.productVariations
        .filter((v) => v.isSelected)
        .map((v) => v.id);
      return [...ids, ...selectedVariants];
    }, []);

    // Nếu chưa có selectedItems và có orderListItems, khởi tạo từ orderListItems
    if (
      selectedItems.length === 0 &&
      orderListItems &&
      orderListItems.length > 0
    ) {
      const initialFromOrder = orderListItems
        .map((item) => item.productVariations.find((v) => v.isSelected)?.id)
        .filter(Boolean);
      if (initialFromOrder.length > 0) {
        setSelectedItems(initialFromOrder);
        return;
      }
    }

    // Nếu chưa có selectedItems, khởi tạo từ cartItems
    if (selectedItems.length === 0 && allSelectableIds.length > 0) {
      setSelectedItems(allSelectableIds);
      return;
    }

    // Cleanup: loại bỏ các IDs không còn tồn tại trong cartItems
    if (selectedItems.length > 0) {
      const validSelected = selectedItems.filter((id) =>
        allSelectableIds.includes(id)
      );
      if (validSelected.length !== selectedItems.length) {
        setSelectedItems(validSelected);
      }
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
        const data = {
          oldVariantId: id,
          quantity: newQuantity,
        };
        const response = await updateCartItem(data);
        if (response.status === 200) {
          setCartItems(response.data.cartItems || []);
          setCartItems((items) =>
            items.map((item) => {
              const updatedVariants = item.productVariations.map((variant) =>
                variant.id === id
                  ? { ...variant, cartQuantity: newQuantity } // ✅ gắn quantity vào variant
                  : variant
              );

              return {
                ...item,
                productVariations: updatedVariants,
              };
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setCartItems((items) =>
        items.map((item) => {
          const updatedVariants = item.productVariations.map((variant) =>
            variant.id === id
              ? { ...variant, cartQuantity: newQuantity } // ✅ gắn quantity vào variant
              : variant
          );

          return {
            ...item,
            productVariations: updatedVariants,
          };
        })
      );
      dispatch(updateLocalCart(cartItems));
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
    if (isLoggedIn()) {
      const data = {
        oldVariantId: oldId,
        newVariantId: newId,
        quantity: quantity || 1,
      };
      const response = await updateCartItem(data);
      if (response.status === 200) {
        setCartItems(response.data.cartItems || []);
      }
    } else {
      // ---- TRƯỜNG HỢP CHƯA LOGIN ----
      const updatedCart = cartItems.map((item) => {
        if (item.id !== itemId) return item;

        const variants = item.productVariations.map((variant) => {
          // Nếu là variant cũ -> bỏ chọn
          if (variant.id === oldId) {
            return { ...variant, isSelected: false };
          }

          // Nếu là variant mới
          if (variant.id === newId) {
            if (variant.isSelected) {
              // Nếu đã chọn từ trước -> tăng số lượng
              return {
                ...variant,
                cartQuantity: variant.cartQuantity + (quantity || 1),
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
      setCartItems(updatedCart);
      setSelectedItems((prev) =>
        prev.includes(oldId)
          ? prev
              .filter((id) => id !== oldId) // bỏ id cũ
              .concat(newId) // thêm id mới
          : prev
      );
      dispatch(updateLocalCart(updatedCart));
    }
  };

  const handleRemoveItem = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      if (isLoggedIn()) {
        const quantityDeleteing = cartItems
          ?.find((item) =>
            item?.productVariations?.some(
              (variant) => variant?.isSelected && variant?.id === id
            )
          )
          ?.productVariations?.find(
            (variant) => variant?.isSelected && variant?.id === id
          )?.cartQuantity;

        const response = await removeProductFromCart(id);
        if (response.status === 200) {
          setCartItems(response.data.cartItems || []);
          dispatch(setQuantityOfCart(quantityOfCart - quantityDeleteing));
        }
      } else {
        const itemDeleteing = cartItems?.find((item) =>
          item?.productVariations?.some(
            (variant) => variant?.isSelected && variant?.id === id
          )
        );

        const variantDeleteing = itemDeleteing?.productVariations?.filter(
          (variant) => variant?.isSelected && variant?.id === id
        );
        dispatch(
          setQuantityOfCart(
            quantityOfCart - variantDeleteing?.cartQuantity || 1
          )
        );
        const updateItems = cartItems.filter(
          (item) =>
            item?.productVariations?.find((variant) => variant?.isSelected)
              ?.id !== id
        );
        setCartItems(updateItems);
        dispatch(updateLocalCart(updateItems));
        setSelectedItems((selected) =>
          selected.filter((itemId) => itemId !== id)
        );
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
          dispatch(setQuantityOfCart(0));
        }
      } else {
        setCartItems([]);
        setSelectedItems([]);
        dispatch(setQuantityOfCart(0));
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
      <Layout>
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ad7555]"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
                          key={variant?.id}
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
    </Layout>
  );
};

export default CartPage;
