import { request } from "@/utils/axios/axios-http";
import { axiosPublic } from "@/utils/axios/axiosInstance";

export const getAllProducts = async (data) => {
  try {
    const { keyword, pageNum, pageSize } = data;
    const response = await request(axiosPublic, {
      method: "GET",
      url: "/product/search",
      params: {
        pageNum,
        pageSize,
        search: keyword || "",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createProduct = async () => {};

export const getProductById = async (id) => {
  try {
    const response = await request(axiosPublic, {
      method: "GET",
      url: `/product/${id}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
