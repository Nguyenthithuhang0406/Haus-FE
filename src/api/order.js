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
      url: `/order/${orderId}?status=${status}`,
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

export const getBestSellerProducts = async (pageNum = 1, pageSize = 10) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: "/statistics/get-best-seller",
      params: {
        pageNum,
        pageSize,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi lấy sản phẩm bán chạy:", error);
    throw error;
  }
};

export const searchOrderByNumber = async (orderNumber) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/order/search/${orderNumber}`,
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi tra cứu đơn hàng:", error);
    throw error;
  }
};

export const getSaleByParentCategory = async (startDate, endDate) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await request(axiosPrivate, {
      method: "GET",
      url: "/statistics/get-sale-by-parent-category",
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi lấy thống kê doanh thu theo danh mục:", error);
    throw error;
  }
};