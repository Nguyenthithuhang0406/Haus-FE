import React from "react";
import { ShoppingBag, ArrowLeft } from "lucide-react";

const EmptyCart = ({ onNavigate }) => {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
        <ShoppingBag size={40} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Giỏ hàng của bạn đang trống
      </h2>
      <p className="text-gray-500 mb-8">
        Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
      </p>
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-2 bg-[#ad7555] text-white px-8 py-3 rounded-lg hover:bg-[#9d6545] transition-colors"
      >
        <ArrowLeft size={20} />
        Tiếp tục mua hàng
      </button>
    </div>
  );
};

export default EmptyCart;