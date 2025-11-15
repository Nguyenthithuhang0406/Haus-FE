import { getAllPromotions } from "@/api/promotion";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const WAREHOUSE_ADDRESS = "Số 39, ngõ 134, Cầu Diễn, Minh Khai, Bắc Từ Liêm, Hà Nội";

const ProductPayment = ({ listProducts, diliveryAddress }) => {
  const products = useMemo(() => listProducts || [], [listProducts]);
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingNote, setShippingNote] = useState("");
  const [promotion, setPromotion] = useState(null);

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

          const today = new Date();

          // Lọc các promotion thỏa điều kiện subtotal
          const validPromotions = promotions.filter((promo) => {
            const { minPriceOrder, maxPriceOrder, startDate, endDate, status } =
              promo;

            const start = new Date(startDate);
            const end = new Date(endDate);

            return (
              status === "active" &&
              subtotal >= (minPriceOrder || 0) &&
              subtotal <= (maxPriceOrder || Infinity) &&
              today >= start &&
              today <= end
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
  }, [subtotal]);

  useEffect(() => {
    let isCancelled = false;

    const calculateShippingFee = async () => {
      if (!diliveryAddress) {
        if (!isCancelled) {
          setShippingFee(0);
          setShippingNote(
            "Vui lòng chọn địa chỉ nhận hàng để tính phí vận chuyển."
          );
        }
        return;
      }

      if (subtotal >= 10000000) {
        if (!isCancelled) {
          setShippingFee(0);
          setShippingNote("Miễn phí giao hàng cho đơn hàng trên 10.000.000đ.");
        }
        return;
      }

      const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (!googleApiKey) {
        console.warn(
          "Google Maps API key is missing. Set VITE_GOOGLE_MAPS_API_KEY in your environment."
        );
        if (!isCancelled) {
          setShippingFee(0);
          setShippingNote(
            "Không thể tính phí vận chuyển vì thiếu Google Maps API key."
          );
        }
        return;
      }

      const destination = [
        diliveryAddress.detailAddress,
        diliveryAddress.commune,
        diliveryAddress.district,
        diliveryAddress.city,
        diliveryAddress.country,
      ]
        .filter(Boolean)
        .join(", ");

      if (!destination) {
        if (!isCancelled) {
          setShippingFee(0);
          setShippingNote(
            "Địa chỉ nhận hàng chưa đầy đủ để tính phí vận chuyển."
          );
        }
        return;
      }

      try {
        const { Client } = await import("@googlemaps/google-maps-services-js");
        const client = new Client({});
        const response = await client.distancematrix({
          params: {
            origins: [WAREHOUSE_ADDRESS],
            destinations: [destination],
            key: googleApiKey,
          },
        });

        const element = response?.data?.rows?.[0]?.elements?.[0];

        if (!element || element.status !== "OK") {
          console.warn("Unable to calculate shipping distance", element);
          if (!isCancelled) {
            setShippingFee(0);
            setShippingNote(
              "Không thể tính khoảng cách đến địa chỉ này. Vui lòng thử lại."
            );
          }
          return;
        }

        const distanceKm = element.distance.value / 1000;

        if (distanceKm <= 10) {
          if (!isCancelled) {
            setShippingFee(0);
            setShippingNote("Miễn phí vận chuyển trong phạm vi 10km từ kho.");
          }
          return;
        }

        const extraDistanceKm = Math.max(distanceKm - 10, 0);
        const ratePerKm = distanceKm <= 30 ? 15000 : 20000;

        let calculatedFee = Math.ceil(extraDistanceKm) * ratePerKm;

        if (distanceKm > 50) {
          calculatedFee = Math.max(calculatedFee, 200000);
          calculatedFee = Math.min(calculatedFee, 1000000);
        }

        if (!isCancelled) {
          setShippingFee(calculatedFee);
          setShippingNote(
            `Khoảng cách ước tính ${distanceKm.toFixed(
              1
            )}km. Phí áp dụng ${ratePerKm.toLocaleString()}đ/km cho quãng đường vượt quá 10km.`
          );
        }
      } catch (error) {
        console.error("Failed to calculate shipping fee:", error);
        if (!isCancelled) {
          setShippingFee(0);
          setShippingNote(
            "Có lỗi xảy ra khi tính phí vận chuyển. Vui lòng thử lại sau."
          );
        }
      }
    };

    calculateShippingFee();

    return () => {
      isCancelled = true;
    };
  }, [diliveryAddress, subtotal]);

  const total = (subtotal * (100 - (promotion || 0))) / 100 + shippingFee;

  let countProduct = 0;
  products.forEach((item) => {
    item.productVariations.forEach((variant) => {
      if (variant.isSelected) {
        countProduct += 1;
      }
    });
  });

  const handleOrder = () => {
    console.log("list products:", listProducts);
    console.log("diliveryAddress:", diliveryAddress);
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
        {promotion && promotion > 0 && (
          <div className="flex justify-between border-t border-[#ad7555] pt-3 my-3 font-medium">
            <span>Giảm giá:</span>
            <span className="text-[#ad7555]">- {promotion} %</span>
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
