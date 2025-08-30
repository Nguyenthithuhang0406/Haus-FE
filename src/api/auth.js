import { request, requestWithToken } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";
import { getCookie, removeAllCookies, setCookie } from "@/utils/cookies";

export const register = async (data) => {
  const { username, password, firstName, lastName, email } = data;

  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/register",
      data: {
        username,
        password,
        firstName,
        lastName,
        email,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const verifyOTPRegister = async (data) => {
  const { email, otp } = data;
  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/verify-otp",
      data: {
        email,
        otp,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (data) => {
  const { email, password } = data;
  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/login",
      data: {
        email,
        password,
      },
    });

    const { accessToken, refreshToken } = response.data.data;
    setCookie("accessToken", accessToken);
    setCookie("refreshToken", refreshToken);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  const token = getCookie("accessToken");
  try {
    const response = await requestWithToken(axiosPrivate, {
      method: "POST",
      url: "/auth/logout",
      data: {
        token,
      },
    });
    removeAllCookies();
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const refreshToken = async () => {
  const refreshToken = getCookie("refreshToken");
  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/refresh",
      data: {
        refreshToken
      },
    });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    setCookie("accessToken", accessToken);
    setCookie("refreshToken", newRefreshToken);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
