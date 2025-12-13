import React from "react";
import { Minus, Plus, X, Check } from "lucide-react";

const CartItem = ({
  item,
  variant,
  onUpdateQuantity,
  onRemove,
  isSelected,
  handleChangeVariant,
  onToggleSelect,
}) => {

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };
  return (
    <div
      className={`bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 transition-all duration-200 ${
        isSelected ? "ring-2 ring-[#ad7555] shadow-md" : ""
      }`}
    >
      {/* Mobile Layout */}
      <div className="flex gap-3 lg:hidden">
        <button
          onClick={() => onToggleSelect(variant?.id)}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            isSelected
              ? "bg-[#ad7555] border-[#ad7555]"
              : "bg-white border-gray-300 hover:border-[#ad7555]"
          }`}
        >
          {isSelected && (
            <Check size={14} className="text-white" strokeWidth={3} />
          )}
        </button>

        <img
          src={variant?.media?.url || item?.medias?.[0]?.url}
          alt={item?.productName}
          className="w-20 h-20 object-cover rounded flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-base text-gray-900 line-clamp-2 pr-2">
              {item?.productName}
            </h3>
            <button
              onClick={() => onRemove(variant?.id)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1 flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          <select
            className="border mb-2 border-[#cecece] px-2 py-1 rounded-md outline-none focus:border-[#ad7555]"
            value={variant?.id}
            onChange={(e) =>
              handleChangeVariant(
                item?.id,
                e.target.value,
                variant?.id,
                variant?.cartQuantity || 1
              )
            }
          >
            {item?.productVariations?.map((variant) => (
              <option key={variant?.id} value={variant?.id}>
                {variant?.color}, {variant?.size}
              </option>
            ))}
          </select>

          {/* <div className="mb-3">
            <p className="text-sm text-gray-600">
              Đơn giá:{" "}
              <span className="font-medium text-[#ad7555]">
                {formatPrice(variant?.price)}
              </span>
            </p>
          </div> */}

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 border rounded-lg px-2 py-1">
              <button
                onClick={() => {
                  onUpdateQuantity(
                    variant?.id,
                    variant?.cartQuantity - 1
                  );
                }}
                className="text-gray-600 hover:text-gray-900 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={variant?.cartQuantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-medium text-sm">
                {variant?.cartQuantity || 1}
              </span>
              <button
                onClick={() => {
                  onUpdateQuantity(
                    variant?.id,
                    variant?.cartQuantity + 1
                  );
                }}
                className="text-gray-600 hover:text-gray-900 p-1"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="text-right">
              {variant?.discountPercent > 0 && (
                <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                  <span className="line-through">
                    {formatPrice(variant?.price || 0)}
                  </span>{" "}
                  <span className="text-[#ad7555]">
                    - {variant?.discountPercent}%
                  </span>
                </p>
              )}
              <p className="text-base font-bold text-[#ad7555]">
                {formatPrice(
                  (variant?.price *
                    (100 - (variant?.discountPercent || 0))) /
                    100
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center gap-6">
        <button
          onClick={() => onToggleSelect(variant?.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            isSelected
              ? "bg-[#ad7555] border-[#ad7555] scale-110"
              : "bg-white border-gray-300 hover:border-[#ad7555] hover:scale-105"
          }`}
        >
          {isSelected && (
            <Check size={16} className="text-white" strokeWidth={3} />
          )}
        </button>

        <img
          src={variant?.media?.url || item?.medias?.[0]?.url}
          alt={item?.productName}
          className="w-24 h-24 object-cover rounded"
        />

        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {item?.productName}
          </h3>
          <select
            className="border border-[#cecece] px-2 py-1 rounded-md outline-none focus:border-[#ad7555]"
            value={variant?.id}
            onChange={(e) =>
              handleChangeVariant(
                item?.id,
                e.target.value,
                variant?.id,
                variant?.cartQuantity || 1
              )
            }
          >
            {item?.productVariations?.map((variant) => (
              <option key={variant?.id} value={variant?.id}>
                {variant?.color}, {variant?.size}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="text-center min-w-[100px]">
          <p className="text-sm text-gray-500 mb-1">Đơn giá</p>
          <p className="text-base font-medium text-[#ad7555]">
            {formatPrice(variant?.price)}
          </p>
        </div> */}

        <div className="flex items-center gap-3 border rounded-lg px-3 py-2">
          <button
            onClick={() => {
              onUpdateQuantity(
                variant?.id,
                variant?.cartQuantity - 1
              );
            }}
            className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={variant?.cartQuantity <= 1}
          >
            <Minus size={18} />
          </button>
          <span className="w-8 text-center font-medium">
            {variant?.cartQuantity || 1}
          </span>
          <button
            onClick={() => {
              onUpdateQuantity(
                variant?.id,
                variant?.cartQuantity + 1
              );
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="text-center min-w-[120px]">
          {variant?.discountPercent > 0 && (
            <p className="text-sm text-gray-500 mb-1 flex items-center justify-center gap-2">
              <span className="line-through">
                {formatPrice(variant?.price || 0)}
              </span>{" "}
              <span className="text-[#ad7555]">
                - {variant?.discountPercent || 0}%
              </span>
            </p>
          )}
          <p className="text-lg font-bold text-[#ad7555]">
            {formatPrice(
              ((variant?.price || 0) *
                (100 - (variant?.discountPercent || 0))) /
                100
            )}
          </p>
        </div>

        <button
          onClick={() => onRemove(variant?.id)}
          className="text-gray-400 hover:text-red-600 transition-colors p-2"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
