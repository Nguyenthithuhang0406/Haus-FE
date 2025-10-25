import React, { useState, useEffect } from "react";
import Layout from "@/components/commons/Layout";
import CartHeader from "@/components/cart/CartHeader";
import CartItem from "@/components/cart/CartItem";
import EmptyCart from "@/components/cart/EmptyCart";
import CartSummary from "@/components/cart/CartSummary";
import PaginationComponent from "@/components/cart/Pagination";
import { useNavigate } from "react-router-dom";

const dummyCartItems = [
  {
    id: 1,
    name: "Sofa 3 chỗ ngồi phong cách hiện đại tối giản",
    category: "Kem",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    price: 9500000,
    quantity: 1,
  },
  {
    id: 2,
    name: "Bàn trang điểm IKEA NORDKISA",
    category: "Tre tự nhiên",
    image: "https://images.unsplash.com/photo-1506898667547-42e22a46e125?w=400",
    price: 1000000,
    quantity: 1,
  },
  {
    id: 3,
    name: "Ghế làm việc ergonomic",
    category: "Đen",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400",
    price: 3500000,
    quantity: 1,
  },
  {
    id: 4,
    name: "Tủ quần áo 3 cánh",
    category: "Gỗ sồi",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400",
    price: 7200000,
    quantity: 1,
  },
  {
    id: 5,
    name: "Giường ngủ queen size",
    category: "Xám nhạt",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400",
    price: 12000000,
    quantity: 1,
  },
  {
    id: 6,
    name: "Bàn ăn 6 chỗ",
    category: "Gỗ tự nhiên",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400",
    price: 8500000,
    quantity: 1,
  },
];

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(3);
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    loadCartItems();
    setLoading(false);
  }, []);

  const loadCartItems = () => {
    setCartItems(dummyCartItems);
  };
  const handleToggleSelect = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setCartItems(items => items.filter(item => item.id !== id));
      setSelectedItems(selected => selected.filter(itemId => itemId !== id));
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm?")) {
      setCartItems([]);
      setSelectedItems([]);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateTotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  useEffect(() => {
    const totalPages = Math.ceil(cartItems.length / pageSize);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [cartItems, currentPage, pageSize]);

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

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
          allSelected={cartItems.length > 0 && selectedItems.length === cartItems.length}  // Thêm
        />

        {cartItems.length === 0 ? (
          <EmptyCart onNavigate={(path) => navigate(path)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {currentItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onToggleSelect={handleToggleSelect}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
              <PaginationComponent
                currentPage={currentPage}
                totalItems={cartItems.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </div>

            <div>
              <CartSummary
                total={calculateTotal()}
                selectedCount={selectedItems.length}
                onContinue={() => navigate('/')}
                onCheckout={() => navigate('/paymentPage')}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;