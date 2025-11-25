import { getAllPromotions } from "@/api/promotion";
import { createOrder } from "@/api/order";
import { paymentCod, paymentMomo } from "@/api/payment";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const WAREHOUSE_ADDRESS =
  "Số 39, ngõ 134, Cầu Diễn, Minh Khai, Bắc Từ Liêm, Hà Nội";

// Hàm tạo orderNumber duy nhất với thông tin phương thức thanh toán
const generateOrderNumber = (paymentMethod) => {
  const timestamp = Date.now(); // Lấy timestamp hiện tại (milliseconds)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0"); // Số ngẫu nhiên 4 chữ số
  const date = new Date(timestamp);
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, ""); // HHMMSS

  // Thêm mã phương thức thanh toán vào orderNumber
  const paymentCode =
    paymentMethod === "COD"
      ? "COD"
      : paymentMethod === "VNPAY"
      ? "VNP"
      : paymentMethod === "MOMO"
      ? "MOM"
      : "";

  // Format: ORDER + PaymentCode + YYYYMMDD + HHMMSS + random 4 digits
  return `ORDER${paymentCode}${dateStr}${timeStr}${random}`;
};

let googleMapsLoaderPromise = null;

const loadGoogleMapsScript = (apiKey) => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is undefined"));
  }

  if (window.google?.maps) {
    return Promise.resolve();
  }

  if (!apiKey) {
    return Promise.reject(
      new Error("Google Maps API key is missing while loading script.")
    );
  }

  if (!googleMapsLoaderPromise) {
    googleMapsLoaderPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        'script[src^="https://maps.googleapis.com/maps/api/js"]'
      );
      if (existingScript) {
        existingScript.addEventListener("load", resolve);
        existingScript.addEventListener("error", () =>
          reject(new Error("Failed to load Google Maps"))
        );
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () =>
        reject(new Error("Failed to load Google Maps script"));
      document.head.appendChild(script);
    });
  }

  return googleMapsLoaderPromise;
};

const getDistanceMatrix = ({ origins, destinations }) => {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps) {
      reject(new Error("Google Maps library not initialized"));
      return;
    }

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins,
        destinations,
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === "OK") {
          resolve(response);
        } else {
          const errorMessage =
            response?.rows?.[0]?.elements?.[0]?.status ||
            response?.error_message ||
            status;
          reject(
            new Error(`Distance Matrix API error: ${errorMessage || status}`)
          );
        }
      }
    );
  });
};

const ProductPayment = ({
  listProducts,
  diliveryAddress,
  paymentMethod,
  orderNote,
  setOrderNote,
}) => {
  const navigate = useNavigate();
  const products = useMemo(() => listProducts || [], [listProducts]);
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingNote, setShippingNote] = useState("");
  const [promotion, setPromotion] = useState(null); // Lưu cả promotion object để có id

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
            setPromotion(bestPromotion); // Lưu cả object để có id
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
        await loadGoogleMapsScript(googleApiKey);
        const data = await getDistanceMatrix({
          origins: [WAREHOUSE_ADDRESS],
          destinations: [destination],
        });

        const element = data?.rows?.[0]?.elements?.[0];

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
          let errorNote =
            "Có lỗi xảy ra khi tính phí vận chuyển. Vui lòng thử lại sau.";

          if (
            error?.message?.includes("REQUEST_DENIED") ||
            error?.message?.includes("INVALID_REQUEST")
          ) {
            errorNote =
              "Không thể truy cập Google Distance Matrix API. Vui lòng kiểm tra khóa API, quyền truy cập (HTTP referrer, địa chỉ IP) và đảm bảo đã bật các dịch vụ Distance Matrix + Maps JavaScript.";
          }

          setShippingNote(errorNote);
        }
      }
    };

    calculateShippingFee();

    return () => {
      isCancelled = true;
    };
  }, [diliveryAddress, subtotal]);

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
    if (!diliveryAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    const orderItems = [];
    listProducts.forEach((item) => {
      item.productVariations
        .filter((variant) => variant.isSelected)
        .forEach((variant) => {
          const priceAtSale = Math.round(
            variant.price * ((100 - (variant.discountPercent || 0)) / 100)
          );
          orderItems.push({
            productVariationId: variant.id,
            quantity: variant.cartQuantity,
            priceAtSale: priceAtSale,
          });
        });
    });

    // Xác định paymentGateway và paymentType dựa trên paymentMethod
    let paymentGateway = null;
    let paymentType = "CASH_ON_DELIVERY";

    if (paymentMethod === "VNPAY") {
      paymentGateway = "VNPAY";
      paymentType = "ONLINE_PAYMENT";
    } else if (paymentMethod === "MOMO") {
      paymentGateway = "MOMO";
      paymentType = "ONLINE_PAYMENT";
    }
    // COD: paymentGateway = null, paymentType = "CASH_ON_DELIVERY" (mặc định)

    const orderData = {
      orderItems: orderItems,
      order: {
        orderNumber: generateOrderNumber(paymentMethod),
        shippingFee: shippingFee,
        totalAmount: total,
        addresses: [
          {
            id: diliveryAddress.id,
            isSelected: true,
          },
        ],
        ...(promotion?.id && { promotionId: promotion.id }),
        ...(orderNote && orderNote.trim() && { note: orderNote.trim() }),
      },
      payment: {
        paymentGateway: paymentGateway,
        paymentType: paymentType,
      },
    };

    try {
      const response = await createOrder(orderData);

      // Lấy orderId từ response
      const orderId = response?.data?.orderId || response.data;

      if (!orderId) {
        console.error("Order response:", response);
        toast.error("Không thể lấy thông tin đơn hàng. Vui lòng thử lại.");
        return;
      }

      // Nếu thanh toán COD và tạo đơn hàng thành công
      if (paymentMethod === "COD") {
        try {
          const phoneNumber = diliveryAddress?.phoneNumber;

          if (!phoneNumber) {
            toast.error(
              "Không tìm thấy số điện thoại. Vui lòng kiểm tra lại địa chỉ giao hàng."
            );
            return;
          }

          // Gọi API paymentCod
          const paymentResponse = await paymentCod({
            orderId: orderId,
            phoneNumber: phoneNumber,
            note: orderNote?.trim() || "",
          });

          console.log("Payment COD response:", paymentResponse);

          // Kiểm tra response thành công (có thể là paymentResponse.status === 200 hoặc paymentResponse.data)
          const isSuccess =
            paymentResponse?.status === 200 || paymentResponse?.data;
          const message = isSuccess
            ? "Đơn hàng của bạn đã được xác nhận thành công."
            : "Đơn hàng đã được tạo nhưng có lỗi khi xử lý thanh toán COD. Vui lòng liên hệ hỗ trợ.";

          // Navigate đến trang kết quả thanh toán
          navigate(
            `/payment-result?status=${
              isSuccess ? "success" : "failed"
            }&orderId=${orderId}&message=${encodeURIComponent(message)}`
          );
        } catch (paymentError) {
          console.error("Failed to process COD payment:", paymentError);
          const errorMessage =
            paymentError?.response?.data?.message ||
            "Đơn hàng đã được tạo nhưng có lỗi khi xử lý thanh toán COD. Vui lòng liên hệ hỗ trợ.";

          // Navigate đến trang kết quả thanh toán với trạng thái thất bại
          navigate(
            `/payment-result?status=failed&orderId=${orderId}&message=${encodeURIComponent(
              errorMessage
            )}`
          );
        }
      } else if (paymentMethod === "MOMO") {
        // Xử lý thanh toán MOMO
        try {
          // Gọi API paymentMomo
          const paymentResponse = await paymentMomo({
            orderId: orderId,
          });

          console.log("Payment MOMO response:", paymentResponse);

          // Kiểm tra response thành công và có payment URL
          if (paymentResponse?.status === 200 || paymentResponse?.data) {
            // Nếu có payment URL, redirect đến trang thanh toán
            const paymentUrl = paymentResponse?.data?.payUrl;
            if (paymentUrl) {
              window.location.href = paymentUrl;
            } else {
              toast.success(
                "Đơn hàng đã được tạo thành công! Vui lòng thanh toán qua MoMo."
              );
            }
          } else {
            toast.error(
              "Đơn hàng đã được tạo nhưng có lỗi khi xử lý thanh toán MOMO. Vui lòng liên hệ hỗ trợ."
            );
          }
        } catch (paymentError) {
          console.error("Failed to process MOMO payment:", paymentError);
          toast.error(
            "Đơn hàng đã được tạo nhưng có lỗi khi xử lý thanh toán MOMO. Vui lòng liên hệ hỗ trợ."
          );
        }
      } else {
        // Xử lý các phương thức thanh toán khác (VNPAY)
        // TODO: Redirect đến trang thanh toán hoặc trang xác nhận
        toast.success("Đơn hàng đã được tạo thành công!");
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
    }
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
