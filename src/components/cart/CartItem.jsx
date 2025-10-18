import React from "react";
import { Minus, Plus, X } from "lucide-react";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4">
      {/* Mobile Layout */}
      <div className="flex gap-4 sm:hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-base text-gray-900 line-clamp-2 pr-2">
              {item.name}
            </h3>
            <button
              onClick={() => onRemove(item.id)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1 flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mb-3">{item.category}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 border rounded-lg px-2 py-1">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="text-gray-600 hover:text-gray-900 p-1"
                disabled={item.quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="text-gray-600 hover:text-gray-900 p-1"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <p className="text-base font-bold text-[#ad7555]">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center gap-6">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded"
        />
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.category}</p>
        </div>

        <div className="flex items-center gap-3 border rounded-lg px-3 py-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="text-gray-600 hover:text-gray-900"
            disabled={item.quantity <= 1}
          >
            <Minus size={18} />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="text-right min-w-[120px]">
          <p className="text-lg font-bold text-[#ad7555]">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-red-600 transition-colors p-2"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;