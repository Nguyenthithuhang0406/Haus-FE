import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";

export const getAllPromotions = async (data) => {
  try {
    const { pageNum, pageSize, sortByPrice, type, startDate, endDate, status } =
      data;
    const response = await request(axiosPublic, {
      method: "GET",
      url: "/promotion/filter",
      params: {
        pageNum,
        pageSize,
        sortByPrice,
        search: [
          type && `type:${type}`,
          status && `status:${status}`,
          startDate && `startDate:${startDate}`,
          endDate && `endDate:${endDate}`,
        ]
          .filter(Boolean)
          .join(","),
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createPromotion = async (data) => {
  try {
    const {
      promotionCode,
      description,
      type,
      status,
      startDate,
      endDate,
      minPriceOrder,
      maxPriceOrder,
      discountPercent,
      categoryId,
    } = data;
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/promotion",
      data: {
        promotionCode,
        description,
        type,
        status,
        startDate,
        endDate,
        ...(minPriceOrder !== undefined && { minPriceOrder }),
        ...(maxPriceOrder !== undefined && { maxPriceOrder }),
        ...(discountPercent !== undefined && {
          discountPercent: parseInt(discountPercent, 10),
        }),
        ...(categoryId !== undefined && { categoryId }),
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const updatePromotion = async (data) => {
  try {
    const {
      promotionId,
      promotionCode,
      description,
      type,
      status,
      startDate,
      endDate,
      minPriceOrder,
      maxPriceOrder,
      discountPercent,
      categoryId,
    } = data;
    const response = await request(axiosPrivate, {
      method: "PUT",
      url: `/promotion/${promotionId}`,
      data: {
        promotionCode,
        description,
        type,
        status,
        startDate,
        endDate,
        ...(minPriceOrder !== undefined && { minPriceOrder }),
        ...(maxPriceOrder !== undefined && { maxPriceOrder }),
        ...(discountPercent !== undefined && { discountPercent }),
        ...(categoryId !== undefined && { categoryId }),
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPromotionById = async (promotionId) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/promotion/${promotionId}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deletePromotion = async (promotionId) => {
  try {
    const response = await request(axiosPrivate, {
      method: "DELETE",
      url: `/promotion/${promotionId}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
