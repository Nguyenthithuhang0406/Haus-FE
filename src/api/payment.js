import { request } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";

export const paymentCod = async (data) => {
  try {
    const { orderId, phoneNumber, note } = data;
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/payment/cod",
      data: {
        orderId,
        phoneNumber,
        note,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const paymentMomo = async (data) => {
  try {
    const { orderId } = data;
    const response = await request(axiosPrivate, {
      method: "POST",
      url: `/payment/momo/create?orderId=${orderId}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
