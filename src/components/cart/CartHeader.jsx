import React from "react";

const CartHeader = ({ totalItems, onClearAll }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
      {totalItems > 0 && (
        <button
          onClick={onClearAll}
          className="text-red-600 hover:text-red-800 font-medium transition-colors"
        >
          Xóa tất cả
        </button>
      )}
    </div>
  );
};

export default CartHeader;