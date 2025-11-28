import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useShippingFee } from "@/hooks/useShippingFee";
import { usePromotion } from "@/hooks/usePromotion";
import { processOrder } from "@/services/orderService";
import { useNavigate } from "react-router-dom";

const ProductPayment = ({
  listProducts,
  diliveryAddress,
  paymentMethod,
  orderNote,
  setOrderNote,
}) => {
  const navigate = useNavigate();
  const products = useMemo(() => listProducts || [], [listProducts]);

  const subtotal = useMemo(
    () =>
      products.reduce((sum, item) => {
        const variantSelected = item.productVariations.find(
          (variant) => variant.isSelected
        );
        const itemTotal = variantSelected
          ? variantSelected.price *
            variantSelected.cartQuantity *
            ((100 - (variantSelected.discountPercent || 0)) / 100)
          : 0;
        return sum + itemTotal;
      }, 0),
    [products]
  );

  // Sử dụng custom hooks
  const { shippingFee, shippingNote } = useShippingFee(
    diliveryAddress,
    subtotal
  );
  const promotion = usePromotion(subtotal);

  const total =
    (subtotal * (100 - (promotion?.discountPercent || 0))) / 100 + shippingFee;

  let countProduct = 0;
  products.forEach((item) => {
    item.productVariations.forEach((variant) => {
      if (variant.isSelected) {
        countProduct += 1;
      }
    });
  });

  const handleOrder = async () => {
    await processOrder({
      listProducts,
      diliveryAddress,
      paymentMethod,
      orderNote,
      shippingFee,
      total,
      promotion,
      navigate,
    });
  };
  return (
    <div className="w-[600px] md:w-[500px] rounded-lg border border-gray-200 shadow-lg flex flex-col">
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-[22px] text-[#ad7555] font-semibold pb-2 border-b">
          {`Đơn hàng (${countProduct} sản phẩm)`}
        </h2>

        <div className="max-h-72 overflow-y-auto pr-2 my-5 flex-1">
          <ul>
            {products.length > 0 &&
              products.map((item) =>
                item.productVariations
                  .filter((variant) => variant.isSelected)
                  .map((variant) => (
                    <li
                      key={`${item.id}-${variant.id}`}
                      className="flex mb-4 items-center"
                    >
                      <img
                        src={variant?.media?.url}
                        alt="anhminhhoa"
                        className="w-20 h-20 object-cover mr-3 border border-gray-200 rounded-md"
                      />
                      <div className="flex-1 mt-3">
                        <h3 className="font-medium">{item?.productName}</h3>
                        <p className="text-gray-500">
                          {variant?.color} - {variant?.size}
                        </p>
                        <div className="flex justify-between items-center my-2">
                          <div className="flex items-center gap-1">
                            <p className="w-6 text-center mx-1 text-gray-500">
                              x {variant.cartQuantity}
                            </p>
                          </div>
                          {variant?.discountPercent > 0 && (
                            <p className="flex items-center gap-2">
                              <span className="font-medium line-through text-gray-500 text-[15px]">
                                {variant?.price?.toLocaleString()} đ
                              </span>
                              <span className="text-[#ad7555]">
                                -{variant?.discountPercent}%
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <p></p>
                          <p className="font-medium">
                            {(
                              variant.price *
                              ((100 - (variant.discountPercent || 0)) / 100)
                            ).toLocaleString()}{" "}
                            đ
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
              )}
          </ul>
        </div>

        <div className="flex justify-between border-t border-[#ad7555] pt-3 my-3 font-medium">
          <span>Tạm tính:</span>
          <span>{subtotal.toLocaleString()} đ</span>
        </div>
        {promotion && promotion.discountPercent > 0 && (
          <div className="flex justify-between border-t border-[#ad7555] pt-3 my-3 font-medium">
            <span>Giảm giá:</span>
            <span className="text-[#ad7555]">
              - {promotion.discountPercent} %
            </span>
          </div>
        )}
        <div className="flex justify-between pt-1 pb-5 border-b border-[#ad7555] font-medium">
          <span>Phí vận chuyển:</span>
          <span>{shippingFee.toLocaleString()} đ</span>
        </div>
        {shippingNote && (
          <p className="text-sm text-gray-500 -mt-4 mb-4">{shippingNote}</p>
        )}
        <div className="flex justify-between mt-8 pb-5 border-b border-[#ad7555] font-semibold">
          <span>Tổng cộng:</span>
          <span>{total.toLocaleString()} đ</span>
        </div>

        {/* Ghi chú đơn hàng */}
        <div className="mt-5 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú đơn hàng (tùy chọn)
          </label>
          <textarea
            value={orderNote || ""}
            onChange={(e) => setOrderNote(e.target.value)}
            placeholder="Nhập ghi chú cho đơn hàng của bạn (ví dụ: Giao hàng vào buổi sáng, gọi điện trước khi giao...)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#ad7555] resize-none transition-colors"
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {orderNote?.length || 0}/500 ký tự
          </p>
        </div>

        {/* Nút luôn ở dưới */}
        <div className="mt-auto pt-5 flex justify-between items-center">
          <Link to="/cart" className="text-[#ad7555]">
            Quay lại giỏ hàng
          </Link>
          <button
            onClick={handleOrder}
            className="px-5 py-2.5 bg-[#ad7555] hover:bg-[#945f46] text-white font-semibold rounded-xl shadow-md cursor-pointer"
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPayment;
