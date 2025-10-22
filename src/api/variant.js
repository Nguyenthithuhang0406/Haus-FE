import { request } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";

export const createVariant = async (data) => {
  try {
    const { imageFile, color, size, price, inventoryQuantity, productId } =
      data;
    const formData = new FormData();
    const requestData = {
      color: color,
      size: size,
      price: price,
      inventoryQuantity: inventoryQuantity,
      productId: productId,
    };
    formData.append("request", JSON.stringify(requestData));
    formData.append("imageFile", imageFile);
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/product/variation",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const editVariant = async (data) => {
  try {
    const { id, imageFile, color, size, price, inventoryQuantity } = data;
    const formData = new FormData();
    formData.append("imageFile", imageFile);
    formData.append("color", color);
    formData.append("size", size);
    formData.append("price", price);
    formData.append("inventoryQuantity", inventoryQuantity);
    formData.append("id", id);
    const response = await request(axiosPrivate, {
      method: "PUT",
      url: `/product/variation`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getVariantByProductId = async (productId) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/product/${productId}/variations`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getVarinatById = async (id) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/product/variation/${id}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteVariantById = async (id) => {
  try {
    const response = await request(axiosPrivate, {
      method: "DELETE",
      url: `/product/variation/${id}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
