import { axiosPrivate } from "@/utils/axios/axiosInstance";

// them danh gia san pham
export const addProductReview = async (productId, data) => {
  try {
    return await axiosPrivate.post(`/product/${productId}/review`, data);
  } catch (error) {
    console.error("Lỗi thêm đánh giá sản phẩm:", error);
    throw error;
  }
};

// lay danh gia theo id san pham
export const getProductReviews = async (
  productId,
  pageNum = 1,
  pageSize = 10
) => {
  try {
    const response = await axiosPrivate.get(`/product/${productId}/review`, {
      params: {
        pageNum,
        pageSize,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi lấy đánh giá sản phẩm:", error);
    throw error;
  }
};

export const getMyReviews = async (pageNum = 1, pageSize = 10) => {
  try {
    const response = await axiosPrivate.get(`/user/me/review`, {
      params: {
        pageNum,
        pageSize,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách đánh giá của tôi:", error);
    throw error;
  }
};

// loc danh gia theo so sao
export const getProductReviewsByRating = async (
  productId,
  rating,
  pageNum = 1,
  pageSize = 10
) => {
  try {
    const response = await axiosPrivate.get(
      `/product/${productId}/review/rating/${rating}`,
      {
        params: { pageNum, pageSize },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi lấy đánh giá theo số sao:", error);
    throw error;
  }
};

// lấy danh sách đánh giá top (không phân biệt sản phẩm) — sort theo sao giảm dần
export const getTopReviews = async (pageNum = 1, pageSize = 10) => {
  try {
    const response = await axiosPrivate.get(`/review/top`, {
      params: {
        pageNum,
        pageSize,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách đánh giá top:", error);
    throw error;
  }
};
