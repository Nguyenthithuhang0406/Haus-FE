import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";
import { getCookie, removeAllCookies, setCookie } from "@/utils/cookies";
import { getAccessToken, setAccessToken, clearAccessToken } from "@/utils/tokenMemory";

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
    throw error;
  }
};

export const verifyOTP = async (data) => {
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
    throw error;
  }
};

export const login = async (data) => {
  const { email, password } = data;
  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/login",
      data: {
        username: email,
        password,
      },
    });

    const { accessToken, refreshToken, role } = response.data.data;
    // Store accessToken in memory only
    setAccessToken(accessToken);
    // Persist refreshToken and role in cookies
    setCookie("refreshToken", refreshToken);
    setCookie("role", role);

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async () => {
  const token = getAccessToken();
  try {
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/auth/logout",
      data: {
        token,
      },
    });
    removeAllCookies();
    clearAccessToken();
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const refreshToken = async () => {
  const refreshToken = getCookie("refreshToken");
  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/refresh",
      data: {
        refreshToken,
      },
    });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    // Update memory access token
    setAccessToken(accessToken);
    // Rotate refresh token in cookie
    setCookie("refreshToken", newRefreshToken);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sentEmailForgotPassword = async (data) => {
  const { email } = data;
  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/forgot-password",
      data: {
        email,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyOTPForForgotPassword = async (data) => {
  const { email, otp } = data;
  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/verify-otp-to-reset-password",
      data: {
        email,
        otp,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
