import React from "react";
import { Check } from "lucide-react";

const CartHeader = ({ totalItems, selectedCount, onClearAll, onSelectAll, allSelected }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
        {totalItems > 0 && (
          <button
            onClick={onClearAll}
            className="text-red-600 hover:text-red-800 font-medium transition-colors text-sm sm:text-base"
          >
            Xóa tất cả
          </button>
        )}
      </div>
      
      {totalItems > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={onSelectAll}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  allSelected 
                    ? 'bg-[#ad7555] border-[#ad7555] scale-110' 
                    : 'bg-white border-gray-300 hover:border-[#ad7555]'
                }`}
              >
                {allSelected && <Check size={16} className="text-white" strokeWidth={3} />}
              </div>
              <span className="font-medium text-gray-900">Chọn tất cả ({totalItems})</span>
            </button>
            
            {selectedCount > 0 && (
              <span className="text-sm text-[#ad7555] font-medium">
                Đã chọn {selectedCount} sản phẩm
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartHeader;