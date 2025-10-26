import React, { useState, useEffect } from "react";
import Layout from "@/components/commons/Layout";
import CartHeader from "@/components/cart/CartHeader";
import CartItem from "@/components/cart/CartItem";
import EmptyCart from "@/components/cart/EmptyCart";
import CartSummary from "@/components/cart/CartSummary";
import PaginationComponent from "@/components/cart/Pagination";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "@/utils/checkLogin";
import { useSelector } from "react-redux";
import { getCart } from "@/api/cart";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize] = useState(3);
  const [selectedItems, setSelectedItems] = useState([]);
  const cartItemsInRedux = useSelector((state) => state.order.localCart);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isLoggedIn()) {
        setLoading(true);
        setCartItems(cartItemsInRedux);
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
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setCartItems((items) => items.filter((item) => item.id !== id));
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
  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // useEffect(() => {
  //   const totalPages = Math.ceil(cartItems.length / pageSize);
  //   if (currentPage > totalPages && totalPages > 0) {
  //     setCurrentPage(totalPages);
  //   }
  // }, [cartItems, currentPage, pageSize]);

  // const indexOfLastItem = currentPage * pageSize;
  // const indexOfFirstItem = indexOfLastItem - pageSize;
  // const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

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
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onToggleSelect={handleToggleSelect}
                  onUpdateQuantity={handleUpdateQuantity}
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
