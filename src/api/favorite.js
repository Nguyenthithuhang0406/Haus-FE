import { axiosPrivate } from "@/utils/axios/axiosInstance";

// Lấy danh sách sản phẩm yêu thích
export const getFavoriteProducts = async (page, size) => {
  try {
    return await axiosPrivate.get("/product/favorites", {
      params: {
        pageNum: page,
        pageSize: size,
      },
    });
  } catch (error) {
    console.error("Lỗi API lấy danh sách yêu thích:", error);
    throw error;
  }
};

// Thêm sản phẩm vào yêu thích
export const addFavoriteProduct = async (productId) => {
  try {
    return await axiosPrivate.post("/product/favorites", { productId });
  } catch (error) {
    console.error("Lỗi thêm sản phẩm yêu thích:", error);
    throw error;
  }
};

// Xóa sản phẩm khỏi yêu thích
export const deleteFavoriteProduct = async (productId) => {
  try {
    return await axiosPrivate.delete(`/product/favorites/${productId}`);
  } catch (error) {
    console.error("Lỗi xóa sản phẩm yêu thích:", error);
    throw error;
  }
};

// Kiểm tra một sản phẩm có được yêu thích hay không
export const checkFavoriteProduct = async (productId) => {
  try {
    return await axiosPrivate.get(`/product/favorites/check/${productId}`);
  } catch (error) {
    console.error("Lỗi kiểm tra sản phẩm yêu thích:", error);
    throw error;
  }
};
// Đồng bộ sản phẩm yêu thích từ localStorage lên server sau khi đăng nhập
export async function syncFavoritesAfterLogin() {
  const localFavs = JSON.parse(localStorage.getItem("likeProducts")) || [];

  if (localFavs.length === 0) return;

  try {
    for (const p of localFavs) {
      await addFavoriteProduct(p.id);
    }

    localStorage.removeItem("likeProducts");
    console.log("Đã đồng bộ yêu thích từ local lên server");
  } catch (error) {
    console.error("Lỗi sync yêu thích:", error);
  }
}
