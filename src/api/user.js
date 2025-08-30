import { requestWithToken } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";

export const getUserProfile = async () => {
  try {
    const response = await requestWithToken(axiosPrivate, {
      method: "GET",
      url: "/user/profile",
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};


export const resetPassword = async (data) => {
  const {email, newPassword} = data;
  try {
    const response = await requestWithToken(axiosPrivate, {
      method: "POST",
      url: "/auth/reset-password",
      data: {
        email,
        newPassword
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
