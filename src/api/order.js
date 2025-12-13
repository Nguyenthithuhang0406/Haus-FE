import { request } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";

export const createOrder = async (data) => {
  try {
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/orders",
      data: data,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllOrder = async (data) => {
  try {
    const { status, pageNum = 1, pageSize = 10 } = data;
    const params = {
      pageNum,
      pageSize,
      ...(status && { status: status }),
    };
    const response = await request(axiosPrivate, {
      method: "GET",
      url: "/order",
      params: params,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await request(axiosPrivate, {
      method: "PATCH",
      url: `/order/${orderId}/status=${status}`,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/order/${id}`,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getInvoiceByOrderId = async (orderId) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/orders/${orderId}/invoice`,
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi lấy hóa đơn:", error);
    throw error;
  }
};

export const getInvoicePdf = async (orderId) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/orders/${orderId}/invoice/pdf`,
      responseType: "blob",
    });

    return response;
  } catch (error) {
    console.error("Lỗi lấy hóa đơn PDF:", error);
    throw error;
  }
};

export const getOrderStatistics = async () => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: "/statistics/order-by-month",
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi lấy thống kê đơn hàng:", error);
    throw error;
  }
};
