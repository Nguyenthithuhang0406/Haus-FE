import { request } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";

export const addToCart = async (data) => {
  const { variantId, quantity } = data;
  try {
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/cart",
      data: {
        variantId: variantId,
        quantity: quantity,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: "/cart",
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateCartItem = async (data) => {
  try {
    const { newVariantId, quantity, oldVariantId } = data;
    const response = await request(axiosPrivate, {
      method: "PATCH",
      url: `/cart`,
      data: {
        oldVariantId: oldVariantId,
        ...(newVariantId && { newVariantId: newVariantId }),
        ...addToCart(quantity && { quantity: quantity }),
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const removeProductFromCart = async (variantId) => {
  try {
    const response = await request(axiosPrivate, {
      method: "DELETE",
      url: `/cart/${variantId}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await request(axiosPrivate, {
      method: "DELETE",
      url: `/cart`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
