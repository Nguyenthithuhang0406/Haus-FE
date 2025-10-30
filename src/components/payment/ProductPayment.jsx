import { getAllPromotions } from "@/api/promotion";
import { setOrderList } from "@/store/orderSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const ProductPayment = ({ listProducts }) => {
  const [products, setProducts] = useState(listProducts || []);
  const [shippingFee, setShippingFee] = useState(30000);
  const [promoton, setPromotion] = useState(null);

  // const dispatch = useDispatch();

  // const increaseQuantity = (index) => {
  //   const updated = [...products];
  //   updated[index].quantity += 1;
  //   dispatch(setOrderList(updated));
  //   setProducts(updated);
  // };

  // const decreaseQuantity = (index) => {
  //   const updated = [...products];
  //   if (updated[index].quantity > 1) {
  //     updated[index].quantity -= 1;
  //     dispatch(setOrderList(updated));
  //     setProducts(updated);
  //   }
  // };

  const subtotal = products.reduce((sum, item) => {
    const variantSelected = item.productVariations.find(
      (variant) => variant.isSelected
    );
    const itemTotal = variantSelected
      ? variantSelected.price *
        variantSelected.cartQuantity *
        ((100 - (variantSelected.discountPercent || 0)) / 100)
      : 0;
    return sum + itemTotal;
  }, 0);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const data = {
          pageNum: 1,
          pageSize: 100,
          sortByPrice: "desc",
          type: "order",
          status: "active",
        };

        const response = await getAllPromotions(data);
        if (response.status === 200) {
          const promotions = response.data.items || [];

          // Lọc các promotion thỏa điều kiện subtotal
          const validPromotions = promotions.filter((promo) => {
            const { minPriceOrder, maxPriceOrder, startDate, endDate, status } =
              promo;
            const now = new Date();
            const start = new Date(startDate);
            const end = new Date(endDate);

            return (
              status === "active" &&
              subtotal >= (minPriceOrder || 0) &&
              subtotal <= (maxPriceOrder || Infinity) &&
              now >= start &&
              now <= end
            );
          });

          if (validPromotions.length > 0) {
            // Lấy promotion có discountPercent lớn nhất
            const bestPromotion = validPromotions.reduce((max, current) =>
              current.discountPercent > max.discountPercent ? current : max
            );
            setPromotion(bestPromotion?.discountPercent);
          } else {
            setPromotion(null);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPromotion();
  }, []);

  const total = (subtotal * (100 - (promoton || 0))) / 100 + shippingFee;

  return (
    <div className="w-[600px] md:w-[500px] rounded-lg border border-gray-200 shadow-lg flex flex-col">
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-[22px] text-[#ad7555] font-semibold pb-2 border-b">
          {`Đơn hàng (${products?.length} sản phẩm)`}
        </h2>

        <div className="max-h-72 overflow-y-auto pr-2 my-5 flex-1">
          <ul>
            {products?.map((item, index) => {
              const variantSelected = item.productVariations.find(
                (variant) => variant.isSelected
              );
              return (
                <li key={index} className="flex mb-4 items-center">
                  <img
                    src={variantSelected?.media?.url}
                    alt="anhminhhoa"
                    className="w-20 h-20 object-cover mr-3 border border-gray-200 rounded-md"
                  />
                  <div className="flex-1 mt-3">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-gray-500">
                      {variantSelected?.color} - {variantSelected?.size}
                    </p>
                    <div className="flex justify-between items-center my-2">
                      <div className="flex items-center gap-1">
                        {/* <button
                          onClick={() => decreaseQuantity(index)}
                          className="px-2 border border-gray-200 shadow-lg rounded"
                        >
                          -
                        </button> */}

                        <p className="w-6 text-center mx-1 text-gray-500">
                          x {variantSelected?.cartQuantity}
                        </p>
                        {/* <button
                          onClick={() => increaseQuantity(index)}
                          className="px-2 border border-gray-200 shadow-lg rounded"
                        >
                          +
                        </button> */}
                      </div>
                      {variantSelected?.discountPercent > 0 && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium line-through text-gray-500 text-[15px]">
                            {variantSelected.price.toLocaleString()} đ
                          </span>
                          <span className="text-[#ad7555]">
                            -{variantSelected?.discountPercent}%
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <p></p>
                      <p className="font-medium">
                        {(
                          variantSelected.price *
                          ((100 - (variantSelected.discountPercent || 0)) / 100)
                        ).toLocaleString()}{" "}
                        đ
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex justify-between border-t border-[#ad7555] pt-3 my-3 font-medium">
          <span>Tạm tính:</span>
          <span>{subtotal.toLocaleString()} đ</span>
        </div>
        {promoton && promoton > 0 && (
          <div className="flex justify-between border-t border-[#ad7555] pt-3 my-3 font-medium">
            <span>Giảm giá:</span>
            <span className="text-[#ad7555]">- {promoton} %</span>
          </div>
        )}
        <div className="flex justify-between pt-1 pb-5 border-b border-[#ad7555] font-medium">
          <span>Phí vận chuyển:</span>
          <span>{shippingFee.toLocaleString()} đ</span>
        </div>
        <div className="flex justify-between mt-8 pb-5 border-b border-[#ad7555] font-semibold">
          <span>Tổng cộng:</span>
          <span>{total.toLocaleString()} đ</span>
        </div>

        {/* Nút luôn ở dưới */}
        <div className="mt-auto pt-5 flex justify-between items-center">
          <Link to="/cart" className="text-[#ad7555]">
            Quay lại giỏ hàng
          </Link>
          <button className="px-5 py-2.5 bg-[#ad7555] hover:bg-[#945f46] text-white font-semibold rounded-xl shadow-md cursor-pointer">
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPayment;
