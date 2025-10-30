import { request } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";

export const getAllOrder = async (data) => {
  try {
    const { status, pageNum = 1, pageSize = 10 } = data;
    const response = await request(axiosPrivate, {
      method: "GET",
      url: "/order",
      data: {
        ...(status && { status: status }),
        pageNum,
        pageSize,
      },
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
