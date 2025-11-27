import { useEffect, useState } from "react";
import { loadGoogleMapsScript, getDistanceMatrix } from "@/utils/googleMapsUtils";

const WAREHOUSE_ADDRESS =
  "Số 39, ngõ 134, Cầu Diễn, Minh Khai, Bắc Từ Liêm, Hà Nội";

/**
 * Custom hook để tính phí vận chuyển dựa trên địa chỉ giao hàng và tổng tiền
 * @param {Object} diliveryAddress - Địa chỉ giao hàng
 * @param {number} subtotal - Tổng tiền tạm tính
 * @returns {Object} { shippingFee, shippingNote }
 */
export const useShippingFee = (diliveryAddress, subtotal) => {
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingNote, setShippingNote] = useState("");

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

  return { shippingFee, shippingNote };
};

