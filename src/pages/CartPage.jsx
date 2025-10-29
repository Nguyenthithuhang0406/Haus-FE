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
import { getCart, updateCartItem } from "@/api/cart";
import { setQuantityOfCart, updateLocalCart } from "@/store/orderSlice";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const cartItemsInRedux = useSelector((state) => state.order.localCart);
  const dispatch = useDispatch();
  const quantityOfCart = useSelector((state) => state.order.quantityOfCart);

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
  }, []);

  const handleToggleSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        cartItems.map(
          (item) =>
            item?.productVariations?.find((variant) => variant?.isSelected)?.id
        )
      );
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

    const updatedVariants = cartItems.map((item) => {
      // Chỉ xử lý item có id trùng với itemId
      if (item.id !== itemId) return item;

      // Kiểm tra nếu variant cũ tồn tại trong item
      if (
        item.productVariations.some(
          (variant) => variant.isSelected && variant.id === oldId
        )
      ) {
        const updatedVariant = item.productVariations.map((variant) => {
          if (variant.id === oldId) {
            return { ...variant, isSelected: false };
          } else if (variant.id === newId) {
            return { ...variant, isSelected: true, cartQuantity: quantity };
          }
          return variant;
        });
        return { ...item, productVariations: updatedVariant };
      }
      return item;
    });

    const uniqueVariants = [];
    updatedVariants.forEach((item) => {
      const selectedVariant = item.productVariations.find(
        (variant) => variant.isSelected
      );
      if (!selectedVariant) return;

      const existedIdx = uniqueVariants.findIndex((i) =>
        i.productVariations.some(
          (v) => v.isSelected && v.id === selectedVariant.id
        )
      );
      if (existedIdx !== -1) {
        // Cập nhật số lượng thành số lượng mới
        uniqueVariants[existedIdx] = {
          ...uniqueVariants[existedIdx],
          productVariations: uniqueVariants[existedIdx].productVariations.map(
            (v) =>
              v.id === selectedVariant.id
                ? {
                    ...v,
                    cartQuantity:
                      parseInt(v.cartQuantity) +
                      parseInt(selectedVariant.cartQuantity),
                  }
                : { ...v }
          ),
        };
      } else {
        uniqueVariants.push(item);
      }
    });

    setCartItems(uniqueVariants);
    setSelectedItems((prev) =>
      prev.includes(oldId)
        ? prev
            .filter((id) => id !== oldId) // bỏ id cũ
            .concat(newId) // thêm id mới
        : prev
    );
    dispatch(updateLocalCart(uniqueVariants));
  };

  const handleRemoveItem = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      const itemDeleteing = cartItems?.find((item) =>
        item?.productVariations?.some(
          (variant) => variant?.isSelected && variant?.id === id
        )
      );

      const variantDeleteing = itemDeleteing?.productVariations?.filter(
        (variant) => variant?.isSelected && variant?.id === id
      );
      dispatch(
        setQuantityOfCart(quantityOfCart - variantDeleteing?.cartQuantity || 1)
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
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm?")) {
      setCartItems([]);
      setSelectedItems([]);
    }
  };

  const calculateTotal = () => {
    // console.log(cartItems);
    return cartItems
      .map((item) => {
        const selectedVariant = item.productVariations.find(
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

  // useEffect(() => {
  //   console.log("selectedItems: ", selectedItems);
  // }, [selectedItems]);

  // useEffect(() => {
  //   console.log("cartItems: ", cartItems);
  // }, [cartItems]);
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
          totalItems={cartItems.length}
          selectedCount={selectedItems.length}
          onClearAll={handleClearAll}
          onSelectAll={handleSelectAll}
          allSelected={
            cartItems.length > 0 && selectedItems.length === cartItems.length
          } // Thêm
        />

        {cartItems.length === 0 ? (
          <EmptyCart onNavigate={(path) => navigate(path)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <CartItem
                  key={
                    item?.productVariations?.find(
                      (variant) => variant.isSelected
                    )?.id
                  }
                  item={item}
                  isSelected={selectedItems.includes(
                    item?.productVariations?.find(
                      (variant) => variant.isSelected
                    )?.id
                  )}
                  onToggleSelect={handleToggleSelect}
                  onUpdateQuantity={handleUpdateQuantity}
                  handleChangeVariant={handleChangeVariant}
                  onRemove={handleRemoveItem}
                />
              ))}
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
                onCheckout={() => navigate("/paymentPage")}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
