import { request } from "@/utils/axios/axios-http";
import { axiosPublic } from "@/utils/axios/axiosInstance";

export const getAllPromotions = async () => {
  try {
    const response = await request(axiosPublic, {
      method: "GET",
      url: "/promotion",
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
