import React from "react";

const ProductRow = ({ product, isFirst }) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${!isFirst ? 'pt-3 border-t border-gray-200' : ''}`}>
      {/* Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400 text-xs">ảnh</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center space-y-1">
        <h3 className="font-semibold text-sm sm:text-base text-center sm:text-left line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm text-center sm:text-left">
          Loại: {product.type}
        </p>
        <p className="text-gray-600 text-xs sm:text-sm text-center sm:text-left">
          Số lượng: x{product.quantity}
        </p>
      </div>

      {/* Price */}
      <div className="text-center sm:text-right sm:min-w-[120px] flex flex-col justify-center">
        <p className="text-sm sm:text-base font-semibold">
          {(product.price || product.priceAtSale || 0).toLocaleString()}đ
        </p>
        <p className="text-xs text-gray-500">
          Tổng: {((product.price || product.priceAtSale || 0) * (product.quantity || 0)).toLocaleString()}đ
        </p>
      </div>
    </div>
  );
};

export default ProductRow;