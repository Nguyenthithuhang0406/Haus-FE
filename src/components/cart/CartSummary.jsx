import React, { useState } from "react";

const CartSummary = ({ total, selectedCount, onContinue, onCheckout }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      await onCheckout();
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
      <h3 className="text-xl font-bold mb-6">Tổng đơn hàng</h3>

      <div className="space-y-3 mb-6 pb-6 border-b">
        {selectedCount > 0 && (
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Số sản phẩm đã chọn:</span>
            <span className="font-medium">{selectedCount}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Tổng tiền:</span>
          <span className="font-bold text-2xl text-[#ad7555]">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={selectedCount === 0 || isCheckingOut}
          className="w-full bg-[#ad7555] text-white py-3 rounded-lg hover:bg-[#9d6545] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCheckingOut ? "Đang xử lý..." : `Thanh toán (${selectedCount})`}
        </button>
        <button
          onClick={onContinue}
          disabled={isCheckingOut}
          className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tiếp tục mua hàng
        </button>
      </div>
    </div>
  );
};
export default CartSummary;
