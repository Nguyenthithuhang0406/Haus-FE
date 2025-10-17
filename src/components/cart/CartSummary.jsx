import React from "react";

const CartSummary = ({ total, onContinue, onCheckout }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
      <h3 className="text-xl font-bold mb-6">Tổng đơn hàng</h3>
      
      <div className="space-y-3 mb-6 pb-6 border-b">
        <div className="flex justify-between text-gray-600">
          <span>Tổng tiền:</span>
          <span className="font-bold text-2xl text-pink-600">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onCheckout}
          className="w-full bg-[#ad7555] text-white py-3 rounded-lg hover:bg-[#9d6545] transition-colors font-medium"
        >
          Thanh toán ngay
        </button>
        <button
          onClick={onContinue}
          className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Tiếp tục mua hàng
        </button>
      </div>
    </div>
  );
};

export default CartSummary;