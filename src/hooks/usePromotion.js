import { useEffect, useState } from "react";
import { getAllPromotions } from "@/api/promotion";

/**
 * Custom hook để lấy promotion phù hợp dựa trên subtotal
 * @param {number} subtotal - Tổng tiền tạm tính
 * @returns {Object|null} Promotion object hoặc null
 */
export const usePromotion = (subtotal) => {
  const [promotion, setPromotion] = useState(null);

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
            setPromotion(bestPromotion);
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

  return promotion;
};

